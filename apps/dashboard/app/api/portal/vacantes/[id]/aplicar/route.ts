import { NextRequest } from 'next/server';
import { requireCandidateUser } from '@/lib/candidate-auth';
import { profileFromCandidate } from '@/lib/compatibility';
import { runCandidateAddedAutomation } from '@/lib/automations';
import { prisma } from '@/lib/prisma';
import { isMockMode } from '@/lib/mock';
import {
  computeApplyCompatibility,
  PORTAL_OPEN_VACANCY_STATUSES,
} from '@/lib/portal-vacancies';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireCandidateUser(req);
  if (auth instanceof Response) return auth;

  const { id: vacancyId } = await params;
  const body = await req.json().catch(() => ({}));
  const extraAnswers = (body.answers ?? {}) as Record<string, string | number | string[]>;

  const { user, candidate } = auth;

  if (isMockMode()) {
    return Response.json({
      ok: true,
      compatibility: 86,
      message: 'Postulación registrada correctamente (modo demo).',
      applicationId: 'mock-application',
      stage: 'APPLIED',
    });
  }

  const vacancy = await prisma.vacancy.findFirst({
    where: {
      id: vacancyId,
      tenantId: user.tenantId,
      status: { in: [...PORTAL_OPEN_VACANCY_STATUSES] },
    },
    select: {
      id: true,
      title: true,
      metadata: true,
      consultantId: true,
      companyId: true,
      tenantId: true,
      company: { select: { name: true } },
    },
  });

  if (!vacancy) {
    return Response.json({ message: 'Vacante no encontrada o no disponible' }, { status: 404 });
  }

  const existing = await prisma.candidateVacancy.findUnique({
    where: { candidateId_vacancyId: { candidateId: candidate.id, vacancyId } },
    select: { id: true, stage: true, score: true },
  });

  if (existing) {
    return Response.json(
      {
        ok: true,
        alreadyApplied: true,
        applicationId: existing.id,
        stage: existing.stage,
        compatibility: existing.score ?? 0,
        message: 'Ya habías aplicado a esta vacante.',
      },
      { status: 200 },
    );
  }

  const profileAnswers = profileFromCandidate(candidate);
  const mergedAnswers = { ...profileAnswers, ...extraAnswers };
  const { total: compatibility, breakdown } = computeApplyCompatibility(
    candidate,
    vacancy.metadata,
    mergedAnswers,
  );

  const consultantId = vacancy.consultantId;
  if (!consultantId) {
    return Response.json({ message: 'Esta vacante aún no tiene consultor asignado.' }, { status: 400 });
  }

  const candidateRow = await prisma.candidate.findUnique({
    where: { id: candidate.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      metadata: true,
      city: true,
      experiences: { select: { startDate: true, endDate: true, isCurrent: true }, take: 3 },
    },
  });

  if (!candidateRow) {
    return Response.json({ message: 'Perfil de candidato no encontrado' }, { status: 404 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const candidateVacancy = await tx.candidateVacancy.create({
      data: {
        candidateId: candidate.id,
        vacancyId,
        stage: 'APPLIED',
        score: compatibility,
        source: 'Portal candidato',
        metadata: {
          appliedAt: new Date().toISOString(),
          knockoutAnswers: mergedAnswers,
          compatibilityBreakdown: breakdown,
        },
      },
    });

    await tx.candidate.update({
      where: { id: candidate.id },
      data: { compatibility },
    });

    await runCandidateAddedAutomation(tx, {
      tenantId: vacancy.tenantId,
      userId: consultantId,
      companyId: vacancy.companyId,
      vacancyId,
      candidateId: candidate.id,
      candidateVacancyId: candidateVacancy.id,
      consultantId,
      vacancyTitle: vacancy.title,
      candidateName: `${candidateRow.firstName} ${candidateRow.lastName}`.trim(),
      vacancyMetadata: vacancy.metadata,
      candidate: candidateRow,
    });

    return candidateVacancy;
  });

  return Response.json({
    ok: true,
    applicationId: result.id,
    compatibility,
    stage: result.stage,
    message: `¡Listo! Tu postulación a ${vacancy.title} fue registrada con ${compatibility}% de compatibilidad.`,
  });
}
