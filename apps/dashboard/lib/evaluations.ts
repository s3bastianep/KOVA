export type AssessmentRecord = {
  id: string;
  candidateId?: string;
  candidateName: string;
  vacancyId?: string;
  vacancyTitle?: string;
  companyName?: string;
  type: string;
  competency: string;
  score: number;
  maxScore: number;
  result: string;
  durationMinutes?: number;
  durationLabel?: string;
  completedAt?: string;
  comments?: string;
  mistakes?: string[];
};

export type CandidateEvalGroup = {
  candidateId?: string;
  candidateName: string;
  avgScore: number;
  testCount: number;
  totalDuration: number;
  tests: AssessmentRecord[];
};

export type ProcessEvalGroup = {
  vacancyId: string;
  vacancyTitle: string;
  companyName?: string;
  candidateCount: number;
  testCount: number;
  avgScore: number;
  candidates: CandidateEvalGroup[];
};

function avgPct(tests: AssessmentRecord[]) {
  if (!tests.length) return 0;
  return Math.round(tests.reduce((s, t) => s + (t.score / t.maxScore) * 100, 0) / tests.length);
}

export function groupAssessmentsByProcess(items: AssessmentRecord[]): ProcessEvalGroup[] {
  const processMap = new Map<string, ProcessEvalGroup>();

  for (const item of items) {
    const vacancyId = item.vacancyId ?? item.vacancyTitle ?? 'sin-proceso';
    const vacancyTitle = item.vacancyTitle ?? 'Sin proceso';

    if (!processMap.has(vacancyId)) {
      processMap.set(vacancyId, {
        vacancyId,
        vacancyTitle,
        companyName: item.companyName,
        candidateCount: 0,
        testCount: 0,
        avgScore: 0,
        candidates: [],
      });
    }

    const process = processMap.get(vacancyId)!;
    if (!process.companyName && item.companyName) process.companyName = item.companyName;

    let candidate = process.candidates.find(
      (c) => c.candidateId === item.candidateId || c.candidateName === item.candidateName,
    );
    if (!candidate) {
      candidate = {
        candidateId: item.candidateId,
        candidateName: item.candidateName,
        avgScore: 0,
        testCount: 0,
        totalDuration: 0,
        tests: [],
      };
      process.candidates.push(candidate);
    }
    candidate.tests.push(item);
  }

  for (const process of processMap.values()) {
    for (const candidate of process.candidates) {
      candidate.testCount = candidate.tests.length;
      candidate.totalDuration = candidate.tests.reduce((s, t) => s + (t.durationMinutes ?? 0), 0);
      candidate.avgScore = avgPct(candidate.tests);
      candidate.tests.sort((a, b) => new Date(b.completedAt ?? 0).getTime() - new Date(a.completedAt ?? 0).getTime());
    }
    process.candidates.sort((a, b) => b.avgScore - a.avgScore);
    process.candidateCount = process.candidates.length;
    process.testCount = process.candidates.reduce((s, c) => s + c.testCount, 0);
    const allTests = process.candidates.flatMap((c) => c.tests);
    process.avgScore = avgPct(allTests);
  }

  return Array.from(processMap.values()).sort((a, b) => b.testCount - a.testCount);
}

export function parseMistakesFromComments(comments?: string | null): string[] {
  if (!comments) return [];
  try {
    const parsed = JSON.parse(comments) as { mistakes?: string[] };
    if (Array.isArray(parsed.mistakes)) return parsed.mistakes;
  } catch {
    // texto libre
  }
  const match = comments.match(/Errores?:\s*([\s\S]+)/i);
  if (match) {
    return match[1]
      .split('\n')
      .map((l) => l.replace(/^[-•]\s*/, '').trim())
      .filter(Boolean);
  }
  return [];
}

export function parseFeedbackFromComments(comments?: string | null): string {
  if (!comments?.trim()) return '';
  try {
    if (comments.trim().startsWith('{')) {
      const parsed = JSON.parse(comments) as { feedback?: string };
      if (typeof parsed.feedback === 'string' && parsed.feedback.trim()) return parsed.feedback.trim();
    }
  } catch {
    // texto libre
  }
  return comments.trim();
}

export function formatAssessmentDuration(minutes?: number | null, label?: string) {
  if (label) return label;
  if (minutes == null) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

export function assessmentQualitative(score?: number | null, maxScore = 100, pending = false) {
  if (pending || score == null) return { label: 'Pendiente', color: '#64748B', track: '#F1F5F9' };
  const pct = (score / maxScore) * 100;
  if (pct >= 85) return { label: 'Muy sólido', color: 'var(--kova-green)', track: '#ECFDF5' };
  if (pct >= 70) return { label: 'Aceptable', color: '#B7791F', track: '#FFFBEB' };
  if (pct >= 50) return { label: 'Regular', color: '#EA580C', track: '#FFF7ED' };
  return { label: 'Por reforzar', color: 'var(--kova-coral)', track: '#FEF2F2' };
}

export function assessmentResultBadge(result?: string | null) {
  const value = result?.trim() ?? 'Pendiente';
  const lower = value.toLowerCase();
  if (lower.includes('aprob')) return { label: value, bg: '#ECFDF5', color: '#047857' };
  if (lower.includes('revis')) return { label: value, bg: '#EFF6FF', color: '#2563EB' };
  if (lower.includes('rechaz') || lower.includes('no apto')) return { label: value, bg: '#FEF2F2', color: '#DC2626' };
  if (lower.includes('pend')) return { label: value, bg: '#F8FAFC', color: '#64748B' };
  return { label: value, bg: '#F1F5F9', color: '#475569' };
}

export type CandidateAssessment = {
  id: string;
  type: string;
  competency: string;
  score?: number;
  maxScore?: number;
  result?: string;
  feedback?: string;
  mistakes?: string[];
  date?: string;
  durationMinutes?: number;
  durationLabel?: string;
};

export function mapCandidateAssessment(input: {
  id: string;
  type: string;
  competency: string;
  score?: number | null;
  maxScore?: number | null;
  result?: string | null;
  comments?: string | null;
  mistakes?: string[];
  date?: string | null;
  durationMinutes?: number | null;
  durationLabel?: string;
}): CandidateAssessment {
  const maxScore = input.maxScore ?? 100;
  const mistakes = input.mistakes?.length
    ? input.mistakes
    : parseMistakesFromComments(input.comments);

  return {
    id: input.id,
    type: input.type,
    competency: input.competency,
    score: input.score ?? undefined,
    maxScore,
    result: input.result ?? undefined,
    feedback: parseFeedbackFromComments(input.comments),
    mistakes,
    date: input.date ?? undefined,
    durationMinutes: input.durationMinutes ?? undefined,
    durationLabel: formatAssessmentDuration(input.durationMinutes, input.durationLabel) ?? undefined,
  };
}
