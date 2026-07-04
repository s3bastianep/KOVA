export type ProcessPipelineMetrics = {
  candidates: number;
  interviewed: number;
  preselected: number;
  tests: number;
  finalInterview: number;
  selected: number;
};

const PRESELECTED_STAGES = new Set(['APPLIED', 'SCREENING', 'CALL']);
const INTERVIEWED_STAGES = new Set(['INTERVIEW']);
const TEST_STAGES = new Set(['ASSESSMENT', 'ROLE_PLAY']);
const FINAL_INTERVIEW_STAGES = new Set(['CLIENT_REVIEW']);
const SELECTED_STAGES = new Set(['OFFER', 'HIRED']);

export function emptyProcessPipelineMetrics(): ProcessPipelineMetrics {
  return {
    candidates: 0,
    interviewed: 0,
    preselected: 0,
    tests: 0,
    finalInterview: 0,
    selected: 0,
  };
}

/** Cuenta candidatos activos por etapa actual del pipeline. */
export function computeProcessPipelineMetrics(stages: string[]): ProcessPipelineMetrics {
  const active = stages.filter((stage) => stage && stage !== 'REJECTED');
  const metrics = emptyProcessPipelineMetrics();
  metrics.candidates = active.length;

  for (const stage of active) {
    if (PRESELECTED_STAGES.has(stage)) metrics.preselected += 1;
    else if (INTERVIEWED_STAGES.has(stage)) metrics.interviewed += 1;
    else if (TEST_STAGES.has(stage)) metrics.tests += 1;
    else if (FINAL_INTERVIEW_STAGES.has(stage)) metrics.finalInterview += 1;
    else if (SELECTED_STAGES.has(stage)) metrics.selected += 1;
  }

  return metrics;
}

export const PROCESS_PIPELINE_METRICS = [
  { key: 'candidates', label: 'Candidatos', short: 'Cand.' },
  { key: 'interviewed', label: 'Entrevistado', short: 'Entrev.' },
  { key: 'preselected', label: 'Preseleccionado', short: 'Presel.' },
  { key: 'tests', label: 'Pruebas', short: 'Pruebas' },
  { key: 'finalInterview', label: 'Entrevista final', short: 'Ent. final' },
  { key: 'selected', label: 'Seleccionados', short: 'Selecc.' },
] as const satisfies ReadonlyArray<{ key: keyof ProcessPipelineMetrics; label: string; short: string }>;
