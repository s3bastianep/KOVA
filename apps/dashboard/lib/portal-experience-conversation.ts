import type { WorkHistoryEntry } from '@/lib/candidate-commercial-profile';

export type ExperienceConversationPhase = 'empresa' | 'cargo' | 'duracion' | 'actividades' | 'resumen';

export const EXPERIENCE_ROLE_CHIPS = [
  'Asesor comercial',
  'Ejecutivo de ventas',
  'Key account manager',
  'Director comercial',
  'Gerente comercial',
  'Hunter',
  'Farmer',
  'Customer success',
] as const;

export const EXPERIENCE_TENURE_CHIPS = [
  'Menos de 1 año',
  '1-2 años',
  '3-4 años',
  '5+ años',
  'Sigo aquí',
] as const;

export const EXPERIENCE_ACTIVITY_CHIPS = [
  'Gestión de cartera',
  'Prospección B2B',
  'Negociación y cierre',
  'Liderazgo de equipo',
  'Forecast y presupuesto',
  'CRM y pipeline',
  'Key accounts',
  'Desarrollo de negocios',
  'Servicio al cliente',
  'Trade marketing',
] as const;

export const ROLE_ACTIVITY_HINTS: Record<string, string[]> = {
  'Director comercial': ['CRM', 'Forecast', 'Presupuestos', 'Liderazgo'],
  'Gerente comercial': ['CRM', 'Forecast', 'Presupuestos', 'Liderazgo'],
  'Key account manager': ['CRM', 'Key accounts', 'Negociación y cierre', 'Forecast y presupuesto'],
  Hunter: ['Prospección B2B', 'CRM y pipeline', 'Negociación y cierre'],
  Farmer: ['Gestión de cartera', 'Key accounts', 'Servicio al cliente'],
};

export function phaseQuestion(phase: ExperienceConversationPhase, empresa?: string): string {
  switch (phase) {
    case 'empresa':
      return '¿Dónde trabajaste más recientemente?';
    case 'cargo':
      return empresa ? `¿Cuál fue tu cargo en ${empresa}?` : '¿En qué cargo trabajaste?';
    case 'duracion':
      return '¿Cuánto tiempo estuviste allí?';
    case 'actividades':
      return '¿Cuáles eran tus responsabilidades principales?';
    case 'resumen':
      return 'Experiencia agregada';
  }
}

export function phaseMicroFeedback(phase: ExperienceConversationPhase): string | null {
  switch (phase) {
    case 'empresa':
      return 'Empresa registrada.';
    case 'cargo':
      return 'Cargo documentado.';
    case 'duracion':
      return 'Periodo registrado.';
    case 'actividades':
      return 'Responsabilidades agregadas.';
    default:
      return null;
  }
}

export function tenureToDates(tenure: string): Pick<WorkHistoryEntry, 'fechaInicio' | 'fechaFin' | 'trabajoActual'> {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');

  switch (tenure) {
    case 'Menos de 1 año':
      return { fechaInicio: `${y - 1}-${m}`, fechaFin: `${y}-${m}`, trabajoActual: false };
    case '1-2 años':
      return { fechaInicio: `${y - 2}-${m}`, fechaFin: `${y}-${m}`, trabajoActual: false };
    case '3-4 años':
      return { fechaInicio: `${y - 4}-${m}`, fechaFin: `${y}-${m}`, trabajoActual: false };
    case '5+ años':
      return { fechaInicio: `${y - 6}-${m}`, fechaFin: `${y}-${m}`, trabajoActual: false };
    case 'Sigo aquí':
      return { fechaInicio: `${y - 2}-${m}`, fechaFin: undefined, trabajoActual: true };
    default:
      return { fechaInicio: '', trabajoActual: false };
  }
}

export function suggestedActivitiesForRole(cargo: string): string[] {
  const normalized = cargo.trim().toLowerCase();
  for (const [role, hints] of Object.entries(ROLE_ACTIVITY_HINTS)) {
    if (normalized.includes(role.toLowerCase())) return hints;
  }
  if (/director|gerente/i.test(cargo)) return ROLE_ACTIVITY_HINTS['Director comercial'];
  if (/key account|kam/i.test(cargo)) return ROLE_ACTIVITY_HINTS['Key account manager'];
  if (/hunter/i.test(cargo)) return ROLE_ACTIVITY_HINTS.Hunter;
  if (/farmer/i.test(cargo)) return ROLE_ACTIVITY_HINTS.Farmer;
  return ['CRM y pipeline', 'Negociación y cierre', 'Gestión de cartera'];
}

export function isExperienceEntryDraftComplete(entry: WorkHistoryEntry): boolean {
  return Boolean(
    entry.empresa?.trim() &&
      entry.cargo?.trim() &&
      entry.fechaInicio?.trim() &&
      entry.descripcion?.trim() &&
      (entry.trabajoActual || entry.fechaFin?.trim()),
  );
}

export function nextExperiencePhase(phase: ExperienceConversationPhase): ExperienceConversationPhase | null {
  const order: ExperienceConversationPhase[] = ['empresa', 'cargo', 'duracion', 'actividades', 'resumen'];
  const idx = order.indexOf(phase);
  return idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;
}
