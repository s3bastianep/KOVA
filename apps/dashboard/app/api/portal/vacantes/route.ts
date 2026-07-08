import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isMockMode } from '@/lib/mock';
import { handlePortalRoute } from '@/lib/portal-api';
import {
  computeCandidateVacancyCompatibility,
  PORTAL_OPEN_VACANCY_STATUSES,
} from '@/lib/portal-vacancies';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handlePortalRoute(
    req,
    async ({ user, candidate }) => {
      const minMatch = Math.max(0, Math.min(100, Number(req.nextUrl.searchParams.get('minMatch') ?? 0)));

      if (isMockMode()) {
        const mock = [
          {
            id: 'seed-vacancy-001',
            title: 'Ejecutivo Comercial B2B',
            companyName: 'TechSales Colombia SAS',
            city: 'Bogotá',
            modality: 'Híbrido',
            compatibility: 86,
            alreadyApplied: false,
          },
          {
            id: 'seed-vacancy-002',
            title: 'Gerente Comercial Regional',
            companyName: 'Distribuidora Andina',
            city: 'Medellín',
            modality: 'Presencial',
            compatibility: 72,
            alreadyApplied: false,
          },
        ].filter((v) => v.compatibility >= minMatch);
        return Response.json({ vacantes: mock, total: mock.length });
      }

      const applied = await prisma.candidateVacancy.findMany({
        where: { candidateId: candidate.id },
        select: { vacancyId: true },
      });
      const appliedIds = new Set(applied.map((row) => row.vacancyId));

      const vacancies = await prisma.vacancy.findMany({
        where: {
          tenantId: user.tenantId,
          status: { in: [...PORTAL_OPEN_VACANCY_STATUSES] },
        },
        select: {
          id: true,
          title: true,
          city: true,
          modality: true,
          metadata: true,
          company: { select: { name: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: 100,
      });

      const rows = vacancies
        .map((vacancy) => {
          try {
            const { total } = computeCandidateVacancyCompatibility(candidate, vacancy.metadata);
            return {
              id: vacancy.id,
              title: vacancy.title,
              companyName: vacancy.company.name,
              city: vacancy.city,
              modality: vacancy.modality,
              compatibility: total,
              alreadyApplied: appliedIds.has(vacancy.id),
            };
          } catch {
            return null;
          }
        })
        .filter((row): row is NonNullable<typeof row> => row !== null && row.compatibility >= minMatch)
        .sort((a, b) => b.compatibility - a.compatibility);

      return Response.json({ vacantes: rows, total: rows.length });
    },
    'portal/vacantes',
  );
}
