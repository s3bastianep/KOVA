export const COMPETENCIES = [
  { id: 'ventaConsultiva', label: 'Venta consultiva', shortLabel: 'Venta consultiva', weight: 35, color: '#1A3FAA' },
  { id: 'prospeccion', label: 'Prospección', shortLabel: 'Prospección', weight: 28, color: '#2D5BE3' },
  { id: 'objeciones', label: 'Manejo de objeciones', shortLabel: 'Objeciones', weight: 22, color: '#00B27A' },
  { id: 'orientacion', label: 'Orientación al logro', shortLabel: 'Orientación', weight: 15, color: '#009966' },
];

/** Puntajes por competencia de cada candidato en la terna */
export const TERN_CANDIDATES = [
  {
    name: 'María López',
    role: 'Ejecutivo Comercial',
    recommended: true,
    scores: { ventaConsultiva: 94, prospeccion: 89, objeciones: 91, orientacion: 95 },
  },
  {
    name: 'Carlos Ruiz',
    role: 'Ejecutivo Comercial',
    scores: { ventaConsultiva: 86, prospeccion: 85, objeciones: 88, orientacion: 89 },
  },
  {
    name: 'Ana Martínez',
    role: 'Ejecutivo Comercial',
    scores: { ventaConsultiva: 82, prospeccion: 83, objeciones: 85, orientacion: 86 },
  },
];

export const VACANCY_STATS = {
  evaluatedCount: 12,
};

export function weightedMatch(scores) {
  const total = COMPETENCIES.reduce((sum, c) => sum + scores[c.id] * c.weight, 0);
  return Math.round(total / 100);
}

export function competencyList(scores) {
  return COMPETENCIES.map((c) => ({
    label: c.label,
    shortLabel: c.shortLabel,
    value: scores[c.id],
  }));
}

export function ternAverageScores() {
  const n = TERN_CANDIDATES.length;
  return COMPETENCIES.map((c) => {
    const sum = TERN_CANDIDATES.reduce((acc, cand) => acc + cand.scores[c.id], 0);
    return { label: c.label, value: Math.round(sum / n) };
  });
}

export const TOP_CANDIDATE = TERN_CANDIDATES[0];
export const TOP_MATCH = weightedMatch(TOP_CANDIDATE.scores);

export const RANKING = TERN_CANDIDATES.map((c) => ({
  ...c,
  match: weightedMatch(c.scores),
}));

/** Perfil predictivo derivado de las competencias — una sola fuente de verdad para el mockup */
export function buildCandidateProfile(
  candidate,
  { evaluatedCount = VACANCY_STATS.evaluatedCount, rank = 1 } = {},
) {
  const { scores } = candidate;
  const matchScore = weightedMatch(scores);
  const competencies = competencyList(scores);

  const modelFit = Math.round((scores.ventaConsultiva + scores.prospeccion) / 2);
  const culturalFit = Math.round(scores.orientacion * 0.55 + scores.objeciones * 0.45);
  const successProbability = Math.max(72, matchScore - 4);
  const quotaPotential = Math.round((scores.ventaConsultiva + scores.orientacion) / 2);
  const retention12m = Math.min(94, scores.orientacion - 8);
  const riskScore = Math.max(8, 100 - matchScore + 6);

  const strengths = competencies.filter((c) => c.value >= 90).map((c) => c.shortLabel);

  return {
    matchScore,
    kovaScore: matchScore,
    successProbability,
    culturalFit,
    modelFit,
    quotaPotential,
    retention12m,
    riskLevel: matchScore >= 85 ? 'Bajo' : matchScore >= 72 ? 'Medio' : 'Alto',
    riskScore,
    percentile: rank,
    evaluatedCount,
    shortlistSize: TERN_CANDIDATES.length,
    competencies,
    strengths,
  };
}

export const TOP_PROFILE = buildCandidateProfile(TOP_CANDIDATE, { rank: 1 });
