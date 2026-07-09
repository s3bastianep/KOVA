import type { Candidate } from '@prisma/client';
import { prisma } from './prisma';
import type { AuthUser } from './auth';
import { isMockMode } from './mock';
import {
  portalServerCacheGet,
  portalServerCacheSet,
  portalVacantesCacheKey,
} from './portal-server-cache';
import {
  computeCandidateVacancyCompatibility,
  countRecommendedVacantes,
  PORTAL_OPEN_VACANCY_STATUSES,
} from './portal-vacancies';

export type PortalVacancyListItem = {
  id: string;
  title: string;
  companyName: string;
  city: string | null;
  modality: string | null;
  compatibility: number;
  alreadyApplied: boolean;
};

const MOCK_VACANTES: PortalVacancyListItem[] = [
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
];

/** Lista completa con compatibilidad; se cachea una sola vez por candidato. */
export async function loadPortalVacantes(
  user: AuthUser,
  candidate: Candidate,
): Promise<PortalVacancyListItem[]> {
  if (isMockMode()) return MOCK_VACANTES;

  const cacheKey = portalVacantesCacheKey(candidate.id, 0);
  const cached = portalServerCacheGet<{ vacantes: PortalVacancyListItem[] }>(cacheKey);
  if (cached?.vacantes) return cached.vacantes;

  const [applied, vacancies] = await Promise.all([
    prisma.candidateVacancy.findMany({
      where: { candidateId: candidate.id },
      select: { vacancyId: true },
    }),
    prisma.vacancy.findMany({
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
    }),
  ]);

  const appliedIds = new Set(applied.map((row) => row.vacancyId));

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
    .filter((row): row is PortalVacancyListItem => row !== null)
    .sort((a, b) => b.compatibility - a.compatibility);

  portalServerCacheSet(cacheKey, { vacantes: rows, total: rows.length });
  return rows;
}

export function filterVacantesByMinMatch(
  vacantes: PortalVacancyListItem[],
  minMatch: number,
): PortalVacancyListItem[] {
  if (minMatch <= 0) return vacantes;
  return vacantes.filter((v) => v.compatibility >= minMatch);
}

export { countRecommendedVacantes };
