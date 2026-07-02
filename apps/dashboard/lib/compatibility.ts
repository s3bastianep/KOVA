export type RequirementRule = {
  key: string;
  label: string;
  weight: number;
  type: 'years_min' | 'contains' | 'equals' | 'score_min';
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

export type CandidateProfile = {
  experienceYears?: number;
  industry?: string;
  salesType?: string;
  crm?: string;
  education?: string;
  englishLevel?: string;
  availability?: string;
  competenciesScore?: number;
};

const ENGLISH_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function englishMeets(candidateLevel: string, requiredLevel: string) {
  const c = ENGLISH_LEVELS.indexOf(candidateLevel.toUpperCase());
  const r = ENGLISH_LEVELS.indexOf(requiredLevel.toUpperCase());
  if (c < 0 || r < 0) return false;
  return c >= r;
}

function normalize(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
}

function evaluateRule(rule: RequirementRule, profile: CandidateProfile): RequirementResult {
  const max = rule.weight;
  let met = false;
  let detail = '';

  switch (rule.key) {
    case 'experience': {
      const years = profile.experienceYears ?? 0;
      const min = Number(rule.expected);
      met = years >= min;
      detail = met ? `${years} años (mín. ${min})` : `${years} años — requiere ${min}+`;
      break;
    }
    case 'industry':
    case 'crm':
    case 'salesType':
    case 'education':
    case 'availability': {
      const field = rule.key === 'salesType' ? profile.salesType : profile[rule.key as keyof CandidateProfile];
      const expected = normalize(rule.expected);
      const actual = normalize(field);
      met = actual.includes(expected) || expected.includes(actual);
      detail = met ? String(field ?? 'Cumple') : `Esperado: ${rule.expected}`;
      break;
    }
    case 'english': {
      met = englishMeets(profile.englishLevel ?? '', String(rule.expected));
      detail = met
        ? `${profile.englishLevel ?? '—'} (req. ${rule.expected})`
        : `${profile.englishLevel ?? '—'} — requiere ${rule.expected}+`;
      break;
    }
    case 'competencies': {
      const score = profile.competenciesScore ?? 0;
      const min = Number(rule.expected);
      met = score >= min;
      detail = met ? `${score}/100` : `${score}/100 — mínimo ${min}`;
      break;
    }
    default: {
      met = normalize(profile[rule.key as keyof CandidateProfile]).includes(normalize(rule.expected));
      detail = met ? 'Cumple' : `Esperado: ${rule.expected}`;
    }
  }

  return {
    key: rule.key,
    label: rule.label,
    weight: rule.weight,
    met,
    earned: met ? max : rule.key === 'competencies' ? Math.min(max, Math.round(((profile.competenciesScore ?? 0) / 100) * max)) : 0,
    max,
    detail,
  };
}

export function calculateCompatibility(requirements: RequirementRule[], profile: CandidateProfile) {
  const breakdown = requirements.map((rule) => evaluateRule(rule, profile));
  const total = Math.round(breakdown.reduce((sum, item) => sum + item.earned, 0));
  return { total, breakdown };
}

export const DEFAULT_REQUIREMENTS: RequirementRule[] = [
  { key: 'experience', label: 'Experiencia', weight: 30, type: 'years_min', expected: 3 },
  { key: 'industry', label: 'Industria', weight: 20, type: 'contains', expected: 'tecnología' },
  { key: 'salesType', label: 'Ventas', weight: 0, type: 'contains', expected: 'b2b' },
  { key: 'crm', label: 'CRM', weight: 10, type: 'contains', expected: 'salesforce' },
  { key: 'education', label: 'Estudios', weight: 10, type: 'contains', expected: 'profesional' },
  { key: 'english', label: 'Inglés', weight: 10, type: 'equals', expected: 'B2' },
  { key: 'competencies', label: 'Competencias', weight: 20, type: 'score_min', expected: 70 },
];

export function requirementsFromMetadata(metadata: unknown): RequirementRule[] {
  if (!metadata || typeof metadata !== 'object') return DEFAULT_REQUIREMENTS;
  const reqs = (metadata as { requirements?: RequirementRule[] }).requirements;
  return Array.isArray(reqs) && reqs.length > 0 ? reqs : DEFAULT_REQUIREMENTS;
}

export function profileFromCandidate(candidate: {
  metadata?: unknown;
  city?: string | null;
  experiences?: { startDate?: Date | null; endDate?: Date | null; isCurrent?: boolean }[];
  assessments?: { score?: number | null }[];
}) {
  const meta = (candidate.metadata ?? {}) as Record<string, unknown>;
  let experienceYears = Number(meta.experienceYears ?? 0);
  if (!experienceYears && candidate.experiences?.length) {
    const exp = candidate.experiences[0];
    if (exp.startDate) {
      const end = exp.isCurrent || !exp.endDate ? new Date() : exp.endDate;
      experienceYears = Math.max(0, end.getFullYear() - exp.startDate.getFullYear());
    }
  }
  const avgAssessment =
    candidate.assessments?.length
      ? candidate.assessments.reduce((s, a) => s + (a.score ?? 0), 0) / candidate.assessments.length
      : Number(meta.competenciesScore ?? 75);

  return {
    experienceYears,
    industry: String(meta.industry ?? ''),
    salesType: String(meta.salesType ?? meta.sales ?? 'B2B'),
    crm: String(meta.crm ?? ''),
    education: String(meta.education ?? ''),
    englishLevel: String(meta.englishLevel ?? meta.english ?? 'B1'),
    availability: String(meta.availability ?? ''),
    competenciesScore: Math.round(avgAssessment),
  } satisfies CandidateProfile;
}
