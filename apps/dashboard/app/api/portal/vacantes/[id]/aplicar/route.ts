import { NextRequest } from 'next/server';
import { handlePortalRoute } from '@/lib/portal-api';
import { profileFromCandidate } from '@/lib/compatibility';
import { runCandidateAddedAutomation } from '@/lib/automations';
import { prisma } from '@/lib/prisma';
import { isMockMode } from '@/lib/mock';
import { invalidatePortalCandidateCaches } from '@/lib/portal-server-cache';
import { mockVacancyMetadataForId } from '@/lib/portal-apply-questions';
import {
  computeApplyCompatibility,
  PORTAL_OPEN_VACANCY_STATUSES,
} from '@/lib/portal-vacancies';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handlePortalRoute(
    req,
    async ({ user, candidate }) => {
      const { id: vacancyId } = await params;
      const body = await req.json().catch(() => ({}));

      // OWASP A04: mismo tope que la postulación pública. Las respuestas quedan
      // guardadas en metadata; sin límite, una cuenta podía inflar la DB.
      if (JSON.stringify(body.answers ?? {}).length > 20_000) {
        return Response.json({ message: 'Las respuestas son demasiado largas.' }, { status: 400 });
      }

      const extraAnswers = (body.answers ?? {}) as Record<string, string | number | string[]>;

  if (isMockMode()) {
    const metadata = mockVacancyMetadataForId(vacancyId);
    const profileAnswers = profileFromCandidate(candidate);
    const mergedAnswers = { ...profileAnswers, ...extraAnswers };
    const { total: compatibility } = computeApplyCompatibility(candidate, metadata, mergedAnswers);

    return Response.json({
      ok: true,
      compatibility,
      message: `¡Listo! Tu postulación fue registrada con ${compatibility}% de compatibilidad.`,
      applicationId: `mock-application-${vacancyId}`,
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

  invalidatePortalCandidateCaches(candidate.id);

  return Response.json({
    ok: true,
    applicationId: result.id,
    compatibility,
    stage: result.stage,
    message: `¡Listo! Tu postulación a ${vacancy.title} fue registrada con ${compatibility}% de compatibilidad.`,
  });
    },
    'portal/vacantes/[id]/aplicar',
  );
}
