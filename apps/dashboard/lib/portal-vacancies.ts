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
