import { NextRequest } from 'next/server';
import { getQuestionById, standardQuestionsFromMetadata } from '@/lib/standard-questions';
import { handlePortalRoute } from '@/lib/portal-api';
import { profileFromCandidate } from '@/lib/compatibility';
import { prisma } from '@/lib/prisma';
import { isMockMode } from '@/lib/mock';
import {
  computeCandidateVacancyCompatibility,
  PORTAL_OPEN_VACANCY_STATUSES,
} from '@/lib/portal-vacancies';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handlePortalRoute(
    req,
    async ({ user, candidate }) => {
      const { id } = await params;

  if (isMockMode()) {
    return Response.json({
      id,
      title: 'Ejecutivo Comercial B2B',
      companyName: 'TechSales Colombia SAS',
      city: 'Bogotá',
      modality: 'Híbrido',
      description: 'Buscamos ejecutivo con experiencia en venta consultiva B2B.',
      compatibility: 86,
      alreadyApplied: false,
      questions: [],
      suggestedAnswers: {},
    });
  }

  const vacancy = await prisma.vacancy.findFirst({
    where: {
      id,
      tenantId: user.tenantId,
      status: { in: [...PORTAL_OPEN_VACANCY_STATUSES] },
    },
    select: {
      id: true,
      title: true,
      city: true,
      modality: true,
      description: true,
      metadata: true,
      company: { select: { name: true } },
    },
  });

  if (!vacancy) {
    return Response.json({ message: 'Vacante no encontrada o no disponible' }, { status: 404 });
  }

  const existing = await prisma.candidateVacancy.findUnique({
    where: { candidateId_vacancyId: { candidateId: candidate.id, vacancyId: id } },
    select: { id: true, stage: true, score: true },
  });

  const { total } = computeCandidateVacancyCompatibility(candidate, vacancy.metadata);
  const suggestedAnswers = profileFromCandidate(candidate);

  const selected = standardQuestionsFromMetadata(vacancy.metadata);
  const questions = selected.map((s) => {
    const def = getQuestionById(s.id);
    return {
      id: s.id,
      label: def?.label ?? s.id,
      category: def?.category ?? 'General',
      inputType: def?.inputType ?? 'select',
      options: def?.options ?? [],
      helpText: def?.helpText,
      maxSelections: def?.maxSelections,
      suggestedValue: suggestedAnswers[s.id] != null ? String(suggestedAnswers[s.id]) : '',
    };
  });

  return Response.json({
    id: vacancy.id,
    title: vacancy.title,
    companyName: vacancy.company.name,
    city: vacancy.city,
    modality: vacancy.modality,
    description: vacancy.description,
    compatibility: total,
    alreadyApplied: Boolean(existing),
    application: existing
      ? { id: existing.id, stage: existing.stage, score: existing.score }
      : null,
    questions,
    suggestedAnswers,
  });
    },
    'portal/vacantes/[id]',
  );
}
