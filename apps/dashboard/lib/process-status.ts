export const PROCESS_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Borrador',
  DISCOVERY_PENDING: 'Discovery',
  PROFILE_BUILDING: 'Perfil en construcción',
  APPROVAL_PENDING: 'Aprobación pendiente',
  SEARCH_ACTIVE: 'Búsqueda activa',
  EVALUATION: 'Evaluación',
  FINALISTS: 'Finalistas',
  OFFER: 'Oferta',
  HIRED: 'Contratado',
  CLOSED: 'Cerrado',
  PAUSED: 'Pausado',
  DISCOVERY: 'Discovery',
};

export function processStatusLabel(status?: string | null) {
  if (!status) return '-';
  return PROCESS_STATUS_LABELS[status] ?? status;
}

export function processProgress(status?: string) {
  const map: Record<string, number> = {
    DRAFT: 5,
    DISCOVERY_PENDING: 15,
    PROFILE_BUILDING: 25,
    APPROVAL_PENDING: 35,
    SEARCH_ACTIVE: 50,
    EVALUATION: 65,
    FINALISTS: 80,
    OFFER: 90,
    HIRED: 100,
    CLOSED: 100,
    PAUSED: 0,
    DISCOVERY: 15,
  };
  return map[status ?? ''] ?? 30;
}
