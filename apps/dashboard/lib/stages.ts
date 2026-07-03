export const STAGE_LABELS: Record<string, string> = {
  APPLIED: 'Postulado',
  SCREENING: 'Filtro',
  CALL: 'Llamada',
  INTERVIEW: 'Entrevista',
  ASSESSMENT: 'Prueba',
  ROLE_PLAY: 'Role Play',
  CLIENT_REVIEW: 'Cliente',
  OFFER: 'Oferta',
  HIRED: 'Contratado',
  ONBOARDING: 'Onboarding',
  REJECTED: 'Rechazado',
};

/** Orden del pipeline ATS usado en procesos de selección */
export const PIPELINE_STAGES = [
  'APPLIED',
  'SCREENING',
  'CALL',
  'INTERVIEW',
  'ASSESSMENT',
  'ROLE_PLAY',
  'CLIENT_REVIEW',
  'OFFER',
  'HIRED',
] as const;

export type PipelineStageId = (typeof PIPELINE_STAGES)[number];

const STAGE_COLORS: Record<string, { bg: string; color: string }> = {
  APPLIED: { bg: '#F3E8FF', color: '#7C3AED' },
  SCREENING: { bg: '#F1F5F9', color: '#64748B' },
  CALL: { bg: '#ECFEFF', color: '#0E7490' },
  INTERVIEW: { bg: '#EEF2FA', color: 'var(--kova-blue)' },
  ASSESSMENT: { bg: '#FFF7E6', color: '#B7791F' },
  ROLE_PLAY: { bg: '#FDF2F8', color: '#BE185D' },
  CLIENT_REVIEW: { bg: '#E6FAF3', color: 'var(--kova-green)' },
  OFFER: { bg: '#FFF0EE', color: 'var(--kova-coral)' },
  HIRED: { bg: '#E6FAF3', color: '#047857' },
  REJECTED: { bg: '#FEE2E2', color: '#DC2626' },
};

export function stageLabel(stage?: string | null) {
  if (!stage) return '-';
  return STAGE_LABELS[stage] ?? stage;
}

export function stageIndex(stage?: string | null) {
  if (!stage) return -1;
  return PIPELINE_STAGES.indexOf(stage as PipelineStageId);
}

export function stageStepLabel(stage?: string | null) {
  const idx = stageIndex(stage);
  if (idx < 0) return null;
  return `Paso ${idx + 1} de ${PIPELINE_STAGES.length}`;
}

export function stageStyle(stage?: string | null) {
  return STAGE_COLORS[stage ?? ''] ?? { bg: '#F1F5F9', color: '#64748B' };
}

export type StageMoveOption = {
  value: PipelineStageId;
  label: string;
  forward: boolean;
  recommended: boolean;
};

/** Etapas disponibles para mover al candidato (todas excepto la actual) */
export function stageMoveOptions(currentStage: string): StageMoveOption[] {
  const currentIdx = stageIndex(currentStage);
  return PIPELINE_STAGES.filter((s) => s !== currentStage).map((s) => {
    const idx = stageIndex(s);
    return {
      value: s,
      label: stageLabel(s),
      forward: currentIdx >= 0 && idx > currentIdx,
      recommended: idx === currentIdx + 1,
    };
  });
}
