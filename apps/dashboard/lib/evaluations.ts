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
