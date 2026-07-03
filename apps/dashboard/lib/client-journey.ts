export type ClientJourneyStage = {
  id: string;
  order: number;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  bg: string;
};

export const CLIENT_JOURNEY_STAGES: ClientJourneyStage[] = [
  {
    id: 'discovery',
    order: 1,
    label: 'Descubrimiento y diagnóstico',
    shortLabel: 'Discovery',
    description: 'Levantar información del negocio, proceso comercial y necesidad de contratación.',
    color: '#1A3FAA',
    bg: '#EEF2FA',
  },
  {
    id: 'ideal_seller',
    order: 2,
    label: 'Diseño del vendedor ideal',
    shortLabel: 'Perfil ideal',
    description: 'Definir competencias, experiencia y perfil de éxito del cargo.',
    color: '#2D5BE3',
    bg: '#EEF2FA',
  },
  {
    id: 'recruitment',
    order: 3,
    label: 'Reclutamiento',
    shortLabel: 'Reclutamiento',
    description: 'Buscar, contactar y atraer candidatos al proceso.',
    color: '#0891B2',
    bg: '#ECFEFF',
  },
  {
    id: 'evaluation',
    order: 4,
    label: 'Evaluación',
    shortLabel: 'Evaluación',
    description: 'Aplicar pruebas comerciales y psicotécnicas.',
    color: '#7C3AED',
    bg: '#F3E8FF',
  },
  {
    id: 'pre_interview',
    order: 5,
    label: 'Entrevista personalizada',
    shortLabel: 'Entrevista personalizada',
    description: 'Entrevistar y filtrar aspirantes antes de presentarlos al cliente.',
    color: '#D97706',
    bg: '#FFF7E6',
  },
  {
    id: 'candidate_definition',
    order: 6,
    label: 'Definición de candidatos',
    shortLabel: 'Definición candidatos',
    description: 'Seleccionar finalistas alineados al perfil acordado.',
    color: '#EA580C',
    bg: '#FFF7ED',
  },
  {
    id: 'client_interview',
    order: 7,
    label: 'Entrevista candidatos',
    shortLabel: 'Entrevista candidatos',
    description: 'Coordinar entrevistas del cliente con finalistas.',
    color: '#BE185D',
    bg: '#FDF2F8',
  },
  {
    id: 'onboarding',
    order: 8,
    label: 'Selección + Preparación + Estandarización',
    shortLabel: 'Selección + Preparación',
    description: 'Seleccionar, preparar el ingreso y estandarizar el proceso comercial.',
    color: '#00B27A',
    bg: '#E6FAF3',
  },
];

export type ClientJourneyEvent = {
  stageId: string;
  action: 'advance' | 'hold' | 'initial';
  reason?: string;
  at: string;
};

export type ClientJourneyRecord = {
  companyId: string;
  companyName: string;
  contact?: string;
  city?: string;
  value?: string;
  currentStageId: string;
  stageEnteredAt: string;
  daysInStage: number;
  history: ClientJourneyEvent[];
};

export function getStageById(id: string) {
  return CLIENT_JOURNEY_STAGES.find((s) => s.id === id);
}

export function getStageIndex(id: string) {
  return CLIENT_JOURNEY_STAGES.findIndex((s) => s.id === id);
}

export function nextStageId(currentId: string): string | null {
  const idx = getStageIndex(currentId);
  if (idx < 0 || idx >= CLIENT_JOURNEY_STAGES.length - 1) return null;
  return CLIENT_JOURNEY_STAGES[idx + 1].id;
}

export function daysSince(iso: string) {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86400000));
}
