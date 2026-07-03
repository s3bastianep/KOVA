import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_CANDIDATES } from '../../../lib/mock';
import { normalizeSkillList } from '../../../lib/candidate-skills';
import { runCandidateAddedAutomation } from '../../../lib/automations';

export const dynamic = 'force-dynamic';

function extractSkills(c: {
  id: string;
  metadata?: unknown;
  skills?: string[];
  assessments?: { title?: string | null }[];
}) {
  if (Array.isArray(c.skills) && c.skills.length > 0) return normalizeSkillList(c.skills);
  const meta = c.metadata as { skills?: string[] } | null | undefined;
  if (Array.isArray(meta?.skills) && meta.skills.length > 0) return normalizeSkillList(meta.skills);
  const fromAssessments = (c.assessments ?? [])
    .map((a) => a.title)
    .filter((x): x is string => !!x);
  if (fromAssessments.length > 0) return normalizeSkillList(fromAssessments);
  return [];
}

function mapCandidate(c: {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  status: string;
  source: string | null;
  compatibility: number | null;
  ranking: number | null;
  metadata?: unknown;
  skills?: string[];
  assessments?: { title?: string | null }[];
  vacancies: { stage: string; source?: string | null; ranking?: number | null; vacancy: { title: string; company?: { name: string } | null } }[];
}) {
  const primary = c.vacancies[0];
  return {
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone,
    city: c.city,
    status: c.status,
    source: c.source ?? primary?.source,
    compatibility: c.compatibility,
    ranking: c.ranking ?? primary?.ranking,
    currentStage: primary?.stage,
    vacancyTitle: primary?.vacancy.title,
    companyName: primary?.vacancy.company?.name ?? undefined,
    skills: extractSkills(c),
    scores: deriveScores(c.compatibility ?? 0, c.id),
  };
}

/** Genera sub-puntajes plausibles y estables a partir de la compatibilidad */
function deriveScores(compatibility: number, seed: string) {
  const base = Math.max(50, Math.min(100, Math.round(compatibility)));
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 97;
  const clamp = (n: number) => Math.max(45, Math.min(100, Math.round(n)));
  return {
    experiencia: clamp(base + (h % 12) - 2),
    habilidades: clamp(base + ((h * 7) % 14) - 8),
    educacion: clamp(base - 5 - ((h * 3) % 12)),
    cultura: clamp(base - ((h * 5) % 10)),
  };
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  if (isMockMode()) {
    return Response.json(
      MOCK_CANDIDATES.map((c) => ({
        ...c,
        vacancyTitle: c.vacancies[0]?.vacancy.title,
        companyName: c.vacancies[0]?.vacancy.company?.name,
        skills: extractSkills(c),
        scores: c.scores ?? deriveScores(c.compatibility ?? 0, c.id),
      })),
    );
  }

  const vacancyId = req.nextUrl.searchParams.get('vacancyId') ?? undefined;

  const candidates = await prisma.candidate.findMany({
    where: {
      tenantId: user.tenantId,
      ...(vacancyId && { vacancies: { some: { vacancyId } } }),
    },
    include: {
      vacancies: {
        include: { vacancy: { select: { id: true, title: true, company: { select: { name: true } } } } },
        orderBy: { updatedAt: 'desc' },
        take: 1,
      },
      assessments: { select: { title: true }, take: 20 },
    },
    orderBy: [{ ranking: 'asc' }, { updatedAt: 'desc' }],
  });

  return Response.json(candidates.map((c) => mapCandidate(c)));
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const { vacancyId, firstName, lastName, email, phone, city, source, metadata } = body;

  if (!vacancyId || !firstName || !lastName) {
    return Response.json({ message: 'Proceso, nombre y apellido son obligatorios' }, { status: 400 });
  }

  if (isMockMode()) {
    return Response.json({ ok: true, compatibility: 88 });
  }

  const vacancy = await prisma.vacancy.findFirst({
    where: { id: vacancyId, tenantId: user.tenantId },
    select: { id: true, title: true, companyId: true, consultantId: true, metadata: true },
  });
  if (!vacancy) return Response.json({ message: 'Proceso no encontrado' }, { status: 404 });

  const result = await prisma.$transaction(async (tx) => {
    const candidate = await tx.candidate.create({
      data: {
        tenantId: user.tenantId,
        firstName,
        lastName,
        email: email ?? null,
        phone: phone ?? null,
        city: city ?? null,
        source: source ?? 'Manual',
        status: 'ACTIVE',
        metadata: metadata ?? {},
      },
    });

    const candidateVacancy = await tx.candidateVacancy.create({
      data: {
        candidateId: candidate.id,
        vacancyId: vacancy.id,
        stage: 'APPLIED',
        source: source ?? 'Manual',
      },
    });

    const automation = await runCandidateAddedAutomation(tx, {
      tenantId: user.tenantId,
      userId: user.id,
      companyId: vacancy.companyId,
      vacancyId: vacancy.id,
      candidateId: candidate.id,
      candidateVacancyId: candidateVacancy.id,
      consultantId: vacancy.consultantId ?? user.id,
      vacancyTitle: vacancy.title,
      candidateName: `${firstName} ${lastName}`,
      vacancyMetadata: vacancy.metadata,
      candidate: { metadata, experiences: [] },
    });

    return { candidate, candidateVacancy, automation };
  });

  return Response.json({
    ok: true,
    id: result.candidate.id,
    compatibility: result.automation.compatibility,
    breakdown: result.automation.breakdown,
  });
}
