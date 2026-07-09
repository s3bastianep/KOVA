import {
  calculateCommercialProfileMatch,
  commercialCriteriaFromVacancyMetadata,
  commercialProfileFromMetadata,
  mergeCompatibilityScores,
} from './candidate-commercial-profile';
import { compatibilityFromVacancyAndAnswers, profileFromCandidate, type RequirementRule } from './compatibility';

type CandidateForMatch = {
  metadata?: unknown;
  city?: string | null;
  experiences?: { startDate?: Date | null; endDate?: Date | null; isCurrent?: boolean }[];
};

export function computeCandidateVacancyCompatibility(
  candidate: CandidateForMatch,
  vacancyMetadata: unknown,
) {
  return computeApplyCompatibility(candidate, vacancyMetadata);
}

export function computeApplyCompatibility(
  candidate: CandidateForMatch,
  vacancyMetadata: unknown,
  extraAnswers: Record<string, string | number | string[]> = {},
) {
  const base = profileFromCandidate(candidate);
  const merged = { ...base, ...extraAnswers };
  const derivedRules = derivedRequirementRules(merged);
  const standard = compatibilityFromVacancyAndAnswers(vacancyMetadata, merged, derivedRules);
  const commercialProfile = commercialProfileFromMetadata(candidate.metadata);
  const commercialCriteria = commercialCriteriaFromVacancyMetadata(vacancyMetadata);

  if (commercialProfile && commercialCriteria) {
    const commercial = calculateCommercialProfileMatch(commercialProfile, commercialCriteria);
    return mergeCompatibilityScores(standard.total, standard.breakdown, commercial);
  }

  return standard;
}

const DERIVED_APPLY_RULES: Record<string, { label: string; weight: number }> = {
  has_vehicle: { label: 'Vehículo propio', weight: 8 },
  intangible_sales: { label: 'Venta de intangibles', weight: 8 },
};

function derivedRequirementRules(
  answers: Record<string, string | number | string[]>,
): RequirementRule[] {
  return Object.entries(DERIVED_APPLY_RULES)
    .filter(([key]) => key in answers)
    .map(([key, config]) => ({
      key,
      label: config.label,
      weight: config.weight,
      type: 'equals' as const,
      expected: 'Sí',
    }));
}

export const PORTAL_OPEN_VACANCY_STATUSES = [
  'SEARCH_ACTIVE',
  'EVALUATION',
  'FINALISTS',
  'OFFER',
] as const;

export const PORTAL_RECOMMENDED_MIN_MATCH = 50;

export type PortalVacancyMatchStats = {
  totalOpen: number;
  recommendedCount: number;
  averageCompatibility: number;
  bestCompatibility: number;
};

export function countRecommendedVacantes(
  vacantes: { compatibility: number; alreadyApplied: boolean }[],
  minMatch = PORTAL_RECOMMENDED_MIN_MATCH,
): number {
  return vacantes.filter((v) => !v.alreadyApplied && v.compatibility >= minMatch).length;
}

/** Agrega métricas reales a partir de la lista de vacantes del portal (mismo origen que /portal/vacantes). */
export function aggregateVacancyMatchStats(
  vacantes: { compatibility: number; alreadyApplied: boolean }[],
): PortalVacancyMatchStats | null {
  if (!vacantes.length) return null;

  const open = vacantes.filter((v) => !v.alreadyApplied);
  if (!open.length) {
    return {
      totalOpen: 0,
      recommendedCount: 0,
      averageCompatibility: 0,
      bestCompatibility: 0,
    };
  }

  const averageCompatibility = Math.round(
    open.reduce((sum, v) => sum + v.compatibility, 0) / open.length,
  );
  const bestCompatibility = Math.max(...open.map((v) => v.compatibility));

  return {
    totalOpen: open.length,
    recommendedCount: countRecommendedVacantes(vacantes),
    averageCompatibility,
    bestCompatibility,
  };
}
