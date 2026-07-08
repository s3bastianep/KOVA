export type ClientJourneyStage = {
  id: string;
  order: number;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  bg: string;
};

/** Brand-aligned stage palette: indigo progression → lime for onboarding */
export const CLIENT_JOURNEY_STAGES: ClientJourneyStage[] = [
  {
    id: 'discovery',
    order: 1,
    label: 'Descubrimiento y diagnóstico',
    shortLabel: 'Discovery',
    description: 'Levantar información del negocio, proceso comercial y necesidad de contratación.',
    color: '#212C93',
    bg: 'rgba(51, 65, 196, 0.1)',
  },
  {
    id: 'ideal_seller',
    order: 2,
    label: 'Diseño del vendedor ideal',
    shortLabel: 'Perfil ideal',
    description: 'Definir competencias, experiencia y perfil de éxito del cargo.',
    color: '#3341C4',
    bg: 'rgba(51, 65, 196, 0.08)',
  },
  {
    id: 'recruitment',
    order: 3,
    label: 'Reclutamiento',
    shortLabel: 'Reclutamiento',
    description: 'Buscar, contactar y atraer candidatos al proceso.',
    color: '#3F4BC7',
    bg: 'rgba(51, 65, 196, 0.07)',
  },
  {
    id: 'evaluation',
    order: 4,
    label: 'Evaluación',
    shortLabel: 'Evaluación',
    description: 'Aplicar pruebas comerciales y psicotécnicas.',
    color: '#4B57CA',
    bg: 'rgba(51, 65, 196, 0.06)',
  },
  {
    id: 'pre_interview',
    order: 5,
    label: 'Entrevista personalizada',
    shortLabel: 'Entrevista personalizada',
    description: 'Entrevistar y filtrar aspirantes antes de presentarlos al cliente.',
    color: '#5763CD',
    bg: 'rgba(51, 65, 196, 0.06)',
  },
  {
    id: 'candidate_definition',
    order: 6,
    label: 'Definición de candidatos',
    shortLabel: 'Definición candidatos',
    description: 'Seleccionar finalistas alineados al perfil acordado.',
    color: '#636FD0',
    bg: 'rgba(51, 65, 196, 0.05)',
  },
  {
    id: 'client_interview',
    order: 7,
    label: 'Entrevista candidatos',
    shortLabel: 'Entrevista candidatos',
    description: 'Coordinar entrevistas del cliente con finalistas.',
    color: '#6F7BD3',
    bg: 'rgba(51, 65, 196, 0.05)',
  },
  {
    id: 'onboarding',
    order: 8,
    label: 'Selección + Preparación + Estandarización',
    shortLabel: 'Selección + Preparación',
    description: 'Seleccionar, preparar el ingreso y estandarizar el proceso comercial.',
    color: '#5C6E12',
    bg: 'rgba(216, 242, 76, 0.28)',
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
