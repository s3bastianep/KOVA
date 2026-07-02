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

export function stageLabel(stage?: string | null) {
  if (!stage) return '—';
  return STAGE_LABELS[stage] ?? stage;
}
