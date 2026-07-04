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

export const ACTIVE_STATUSES = [
  'SEARCH_ACTIVE',
  'EVALUATION',
  'FINALISTS',
  'OFFER',
  'PROFILE_BUILDING',
  'DISCOVERY',
  'DISCOVERY_PENDING',
];

export type ProcessBucket = 'active' | 'review' | 'paused' | 'closed' | 'archived' | 'other';

export const PROCESS_BUCKET_META: Record<
  ProcessBucket,
  { label: string; hint: string; tint: string; tone: string }
> = {
  active: { label: 'Procesos activos', hint: 'En progreso', tint: '#E6FAF3', tone: 'var(--kova-green)' },
  review: { label: 'En revisión', hint: 'Pendientes de acción', tint: '#EEF2FA', tone: 'var(--kova-blue)' },
  paused: { label: 'Pausados', hint: 'Temporales', tint: '#FFF7E6', tone: '#B7791F' },
  closed: { label: 'Cerrados', hint: 'Contratados', tint: '#F3E8FF', tone: '#7C3AED' },
  archived: { label: 'Archivados', hint: 'Histórico', tint: '#F1F5F9', tone: '#64748B' },
  other: { label: 'Borrador', hint: 'Sin iniciar', tint: '#F1F5F9', tone: '#64748B' },
};

export function getProcessBucket(status: string): ProcessBucket {
  if (ACTIVE_STATUSES.includes(status)) return 'active';
  if (status === 'APPROVAL_PENDING') return 'review';
  if (status === 'PAUSED') return 'paused';
  if (status === 'HIRED') return 'closed';
  if (status === 'CLOSED') return 'archived';
  return 'other';
}

export function processBucketLabel(status?: string | null) {
  if (!status) return '-';
  return PROCESS_BUCKET_META[getProcessBucket(status)].label;
}

export function processBucketStyle(status: string) {
  const { tint, tone } = PROCESS_BUCKET_META[getProcessBucket(status)];
  return { bg: tint, color: tone, bar: tone };
}

export function countProcessesByBucket(items: { status: string }[]) {
  return {
    active: items.filter((v) => getProcessBucket(v.status) === 'active').length,
    review: items.filter((v) => getProcessBucket(v.status) === 'review').length,
    paused: items.filter((v) => getProcessBucket(v.status) === 'paused').length,
    closed: items.filter((v) => getProcessBucket(v.status) === 'closed').length,
    archived: items.filter((v) => getProcessBucket(v.status) === 'archived').length,
  };
}

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

export const PROCESS_WORKFLOW_STAGES = [
  { step: 1, label: 'Discovery', statuses: ['DRAFT', 'DISCOVERY_PENDING', 'DISCOVERY'] },
  { step: 2, label: 'Perfil', statuses: ['PROFILE_BUILDING'] },
  { step: 3, label: 'Aprobación', statuses: ['APPROVAL_PENDING'] },
  { step: 4, label: 'Búsqueda', statuses: ['SEARCH_ACTIVE'] },
  { step: 5, label: 'Evaluación', statuses: ['EVALUATION'] },
  { step: 6, label: 'Finalistas', statuses: ['FINALISTS'] },
  { step: 7, label: 'Oferta', statuses: ['OFFER'] },
  { step: 8, label: 'Contratación', statuses: ['HIRED', 'CLOSED'] },
] as const;

export function processStageInfo(status?: string | null) {
  const total = PROCESS_WORKFLOW_STAGES.length;
  const progress = processProgress(status ?? undefined);

  if (!status || status === 'PAUSED') {
    return {
      step: 1,
      total,
      label: status === 'PAUSED' ? 'Pausado' : 'Inicio',
      progress,
    };
  }

  const index = PROCESS_WORKFLOW_STAGES.findIndex((stage) =>
    (stage.statuses as readonly string[]).includes(status),
  );

  if (index === -1) {
    return {
      step: 1,
      total,
      label: processStatusLabel(status),
      progress,
    };
  }

  const stage = PROCESS_WORKFLOW_STAGES[index];
  return {
    step: stage.step,
    total,
    label: stage.label,
    progress,
  };
}
