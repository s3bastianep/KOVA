import {
  calculateCommercialProfileMatch,
  commercialCriteriaFromVacancyMetadata,
  commercialProfileFromMetadata,
  mergeCompatibilityScores,
} from './candidate-commercial-profile';
import { compatibilityFromVacancyAndAnswers, profileFromCandidate } from './compatibility';

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
  const standard = compatibilityFromVacancyAndAnswers(vacancyMetadata, merged);
  const commercialProfile = commercialProfileFromMetadata(candidate.metadata);
  const commercialCriteria = commercialCriteriaFromVacancyMetadata(vacancyMetadata);

  if (commercialProfile && commercialCriteria) {
    const commercial = calculateCommercialProfileMatch(commercialProfile, commercialCriteria);
    return mergeCompatibilityScores(standard.total, standard.breakdown, commercial);
  }

  return standard;
}

export const PORTAL_OPEN_VACANCY_STATUSES = [
  'SEARCH_ACTIVE',
  'EVALUATION',
  'FINALISTS',
  'OFFER',
] as const;

export const PORTAL_RECOMMENDED_MIN_MATCH = 50;
