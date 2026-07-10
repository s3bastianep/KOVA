import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, isStaffRole } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_CANDIDATES } from '../../../lib/mock';
import { normalizeSkillList } from '../../../lib/candidate-skills';
import { runCandidateAddedAutomation } from '../../../lib/automations';
import { mapCandidateProcessHistory } from '../../../lib/candidate-process-history';

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
  vacancies: {
    id?: string;
    stage: string;
    source?: string | null;
    ranking?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vacancy: { id: string; title: string; status?: string; company?: { id?: string; name: string } | null };
  }[];
}) {
  const primary = c.vacancies[0];
  const processHistory = mapCandidateProcessHistory(
    c.vacancies.map((v, index) => ({
      id: v.id ?? `cv-${c.id}-${index}`,
      stage: v.stage,
      ranking: v.ranking,
      createdAt: v.createdAt ?? new Date(Date.now() - (c.vacancies.length - index) * 30 * 86400000),
      updatedAt: v.updatedAt ?? new Date(Date.now() - (c.vacancies.length - index - 1) * 7 * 86400000),
      vacancy: {
        id: v.vacancy.id,
        title: v.vacancy.title,
        status: v.vacancy.status ?? 'SEARCH_ACTIVE',
        company: v.vacancy.company,
      },
    })),
  );
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
    vacancyId: primary?.vacancy.id,
    companyName: primary?.vacancy.company?.name ?? undefined,
    processCount: c.vacancies.length,
    processHistory,
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
  if (!isStaffRole(user.role)) return unauthorized();

  const vacancyId = req.nextUrl.searchParams.get('vacancyId') ?? undefined;
  const excludeVacancyId = req.nextUrl.searchParams.get('excludeVacancyId') ?? undefined;
  const search = req.nextUrl.searchParams.get('q')?.trim().toLowerCase();

  if (isMockMode()) {
    let list = MOCK_CANDIDATES.map((c) => mapCandidate(c));
    if (vacancyId) {
      list = list.filter((c) => c.processHistory.some((p) => p.vacancyId === vacancyId));
    }
    if (excludeVacancyId) {
      list = list.filter((c) => !c.processHistory.some((p) => p.vacancyId === excludeVacancyId));
    }
    if (search) {
      list = list.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(search) ||
          (c.email ?? '').toLowerCase().includes(search),
      );
    }
    return Response.json(list);
  }

  const candidates = await prisma.candidate.findMany({
    where: {
      tenantId: user.tenantId,
      ...(vacancyId && { vacancies: { some: { vacancyId } } }),
      ...(excludeVacancyId && { vacancies: { none: { vacancyId: excludeVacancyId } } }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      vacancies: {
        include: {
          vacancy: {
            select: { id: true, title: true, status: true, company: { select: { id: true, name: true } } },
          },
        },
        orderBy: { updatedAt: 'desc' },
      },
      assessments: { select: { title: true }, take: 20 },
    },
    orderBy: { updatedAt: 'desc' },
    // Always capped, not just when searching: without this, an unfiltered request loads every
    // candidate in the tenant (with nested vacancy + assessment fan-out) into one response.
    // 200 is generous enough not to change today's behavior for any real tenant size while
    // capping the worst case. A real paginated list (cursor + total count) is the proper fix
    // if a tenant ever needs to browse past this many candidates.
    take: search || excludeVacancyId ? 25 : 200,
  });

  return Response.json(candidates.map((c) => mapCandidate(c)));
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isStaffRole(user.role)) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const {
    vacancyId,
    existingCandidateId,
    firstName,
    lastName,
    email,
    phone,
    city,
    source,
    metadata,
  } = body;

  if (!vacancyId) {
    return Response.json({ message: 'Proceso es obligatorio' }, { status: 400 });
  }

  if (!existingCandidateId && (!firstName || !lastName)) {
    return Response.json({ message: 'Nombre y apellido son obligatorios' }, { status: 400 });
  }

  if (isMockMode()) {
    return Response.json({
      ok: true,
      id: existingCandidateId ?? 'mock-candidate',
      linked: !!existingCandidateId,
      compatibility: 88,
    });
  }

  const vacancy = await prisma.vacancy.findFirst({
    where: { id: vacancyId, tenantId: user.tenantId },
    select: { id: true, title: true, companyId: true, consultantId: true, metadata: true },
  });
  if (!vacancy) return Response.json({ message: 'Proceso no encontrado' }, { status: 404 });

  let candidateId = existingCandidateId as string | undefined;

  if (!candidateId && email) {
    const byEmail = await prisma.candidate.findFirst({
      where: { tenantId: user.tenantId, email: { equals: String(email), mode: 'insensitive' } },
      select: { id: true, firstName: true, lastName: true, metadata: true },
    });
    if (byEmail) candidateId = byEmail.id;
  }

  if (candidateId) {
    const candidate = await prisma.candidate.findFirst({
      where: { id: candidateId, tenantId: user.tenantId },
      include: { experiences: true },
    });
    if (!candidate) return Response.json({ message: 'Candidato no encontrado' }, { status: 404 });

    const alreadyLinked = await prisma.candidateVacancy.findUnique({
      where: { candidateId_vacancyId: { candidateId: candidate.id, vacancyId: vacancy.id } },
    });
    if (alreadyLinked) {
      return Response.json({ message: 'Este candidato ya está en el proceso' }, { status: 409 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const candidateVacancy = await tx.candidateVacancy.create({
        data: {
          candidateId: candidate.id,
          vacancyId: vacancy.id,
          stage: 'APPLIED',
          source: source ?? 'Base de talento',
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
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        vacancyMetadata: vacancy.metadata,
        candidate: { metadata: candidate.metadata, experiences: candidate.experiences },
      });

      return { candidate, candidateVacancy, automation, linked: true };
    });

    return Response.json({
      ok: true,
      id: result.candidate.id,
      linked: true,
      compatibility: result.automation.compatibility,
      breakdown: result.automation.breakdown,
    });
  }

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
    linked: false,
    compatibility: result.automation.compatibility,
    breakdown: result.automation.breakdown,
  });
}
