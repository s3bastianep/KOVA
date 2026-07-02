import type { QuestionMatchType } from './standard-questions';
import { standardQuestionsFromMetadata, selectedToRequirements } from './standard-questions';

export type RequirementRule = {
  key: string;
  label: string;
  weight: number;
  type: QuestionMatchType | 'years_min' | 'contains' | 'equals' | 'score_min';
  expected: string | number;
};

export type RequirementResult = {
  key: string;
  label: string;
  weight: number;
  met: boolean;
  earned: number;
  max: number;
  detail: string;
};

const ENGLISH_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function englishMeets(candidateLevel: string, requiredLevel: string) {
  const c = ENGLISH_LEVELS.indexOf(String(candidateLevel).toUpperCase());
  const r = ENGLISH_LEVELS.indexOf(String(requiredLevel).toUpperCase());
  if (c < 0 || r < 0) return false;
  return c >= r;
}

function normalize(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
}

function evaluateRule(
  rule: RequirementRule,
  answers: Record<string, string | number>,
): RequirementResult {
  const max = rule.weight;
  const actual = answers[rule.key];
  let met = false;
  let detail = '';
  const matchType = rule.type;

  if (matchType === 'years_min' || matchType === 'min_score') {
    const num = Number(actual ?? 0);
    const min = Number(rule.expected);
    met = num >= min;
    detail = met ? `${num} (mín. ${min})` : `${num} — requiere ${min}+`;
  } else if (matchType === 'equals' && rule.key === 'english_level') {
    met = englishMeets(String(actual ?? ''), String(rule.expected));
    detail = met
      ? `${actual} (req. ${rule.expected})`
      : `${actual ?? '—'} — requiere ${rule.expected}+`;
  } else if (matchType === 'equals') {
    met = normalize(actual) === normalize(rule.expected);
    detail = met ? String(actual) : `Esperado: ${rule.expected}`;
  } else {
    const expected = normalize(rule.expected);
    const actualNorm = normalize(actual);
    met = actualNorm.includes(expected) || expected.includes(actualNorm);
    detail = met ? String(actual ?? 'Cumple') : `Esperado: ${rule.expected}`;
  }

  const partial =
    matchType === 'min_score' && !met
      ? Math.min(max, Math.round((Number(actual ?? 0) / Number(rule.expected || 1)) * max))
      : 0;

  return {
    key: rule.key,
    label: rule.label,
    weight: rule.weight,
    met,
    earned: met ? max : partial,
    max,
    detail,
  };
}

export function calculateCompatibility(
  requirements: RequirementRule[],
  answers: Record<string, string | number>,
) {
  const breakdown = requirements.map((rule) => evaluateRule(rule, answers));
  const total = Math.round(breakdown.reduce((sum, item) => sum + item.earned, 0));
  return { total, breakdown };
}

export function requirementsFromMetadata(metadata: unknown): RequirementRule[] {
  const selected = standardQuestionsFromMetadata(metadata);
  return selectedToRequirements(selected);
}

export function profileFromCandidate(candidate: {
  metadata?: unknown;
  city?: string | null;
  experiences?: { startDate?: Date | null; endDate?: Date | null; isCurrent?: boolean }[];
  assessments?: { score?: number | null }[];
}) {
  const meta = (candidate.metadata ?? {}) as Record<string, unknown>;
  const standardAnswers = (meta.standardAnswers ?? {}) as Record<string, string | number>;

  if (Object.keys(standardAnswers).length > 0) {
    return standardAnswers;
  }

  let experienceYears = Number(meta.experienceYears ?? 0);
  if (!experienceYears && candidate.experiences?.length) {
    const exp = candidate.experiences[0];
    if (exp.startDate) {
      const end = exp.isCurrent || !exp.endDate ? new Date() : exp.endDate;
      experienceYears = Math.max(0, end.getFullYear() - exp.startDate.getFullYear());
    }
  }

  return {
    experience_years: experienceYears,
    industry: String(meta.industry ?? ''),
    sales_type: String(meta.salesType ?? meta.sales ?? 'B2B'),
    crm: String(meta.crm ?? ''),
    education: String(meta.education ?? ''),
    english_level: String(meta.englishLevel ?? meta.english ?? 'B1'),
    city: String(meta.city ?? candidate.city ?? ''),
    availability: String(meta.availability ?? ''),
  };
}

export function compatibilityFromVacancyAndAnswers(
  vacancyMetadata: unknown,
  answers: Record<string, string | number>,
) {
  const requirements = requirementsFromMetadata(vacancyMetadata);
  return calculateCompatibility(requirements, answers);
}
