import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_CANDIDATES } from '../../../lib/mock';
import { runCandidateAddedAutomation } from '../../../lib/automations';

export const dynamic = 'force-dynamic';

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
    },
    orderBy: [{ ranking: 'asc' }, { updatedAt: 'desc' }],
  });

  return Response.json(candidates.map(mapCandidate));
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
