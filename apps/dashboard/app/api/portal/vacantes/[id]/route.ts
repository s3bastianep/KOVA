import { NextRequest } from 'next/server';
import { handlePortalRoute } from '@/lib/portal-api';
import { prisma } from '@/lib/prisma';
import { isMockMode } from '@/lib/mock';
import {
  buildApplyQuestions,
  mockVacancyMetadataForId,
} from '@/lib/portal-apply-questions';
import {
  computeCandidateVacancyCompatibility,
  PORTAL_OPEN_VACANCY_STATUSES,
} from '@/lib/portal-vacancies';

export const dynamic = 'force-dynamic';

const MOCK_VACANCIES: Record<
  string,
  { title: string; companyName: string; city: string; modality: string; description: string }
> = {
  'seed-vacancy-001': {
    title: 'Ejecutivo Comercial B2B',
    companyName: 'TechSales Colombia SAS',
    city: 'Bogotá',
    modality: 'Híbrido',
    description: 'Buscamos ejecutivo con mínimo 5 años vendiendo software B2B. Requiere vehículo para visitas.',
  },
  'seed-vacancy-002': {
    title: 'Gerente Comercial Regional',
    companyName: 'Distribuidora Andina',
    city: 'Medellín',
    modality: 'Presencial',
    description: 'Buscamos líder comercial con experiencia en equipos regionales.',
  },
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handlePortalRoute(
    req,
    async ({ user, candidate }) => {
      const { id } = await params;

      if (isMockMode()) {
        const base = MOCK_VACANCIES[id] ?? MOCK_VACANCIES['seed-vacancy-001'];
        const metadata = mockVacancyMetadataForId(id);
        const questions = buildApplyQuestions(metadata, candidate, {
          title: base.title,
          description: base.description,
          city: base.city,
          modality: base.modality,
        });
        const { total } = computeCandidateVacancyCompatibility(candidate, metadata);

        return Response.json({
          id,
          ...base,
          compatibility: total,
          alreadyApplied: false,
          application: null,
          questions,
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
      const questions = buildApplyQuestions(vacancy.metadata, candidate, {
        title: vacancy.title,
        description: vacancy.description,
        city: vacancy.city,
        modality: vacancy.modality,
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
      });
    },
    'portal/vacantes/[id]',
  );
}
