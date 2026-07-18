import type { CommercialProfile } from './candidate-commercial-profile';
import {
  CONTRACT_TYPE_OPTIONS,
  LANGUAGE_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
} from './commercial-profile-builder';
import { isLanguageComplete } from './commercial-profile-builder';
import { MAX_PORTAL_INDUSTRIES, PORTAL_INDUSTRY_OPTIONS } from './candidate-industries';

export type PreferenciasBlock = 'buscas' | 'vendes' | 'cierras';
export type PreferenciasStepKind = 'chips' | 'slider' | 'idiomas-review' | 'idiomas-levels' | 'tag-picker';

export type PreferenciasWizardStep = {
  id: string;
  block: PreferenciasBlock;
  kind?: PreferenciasStepKind;
  title: string;
  subtitle?: string;
  options: readonly string[];
  multi: boolean;
  /** Cap for multi / tag-picker steps (e.g. industrias = 3). */
  maxSelections?: number;
  optional?: boolean;
  skipIf?: (profile: CommercialProfile) => boolean;
  apply: (selected: string[], profile: CommercialProfile) => Partial<CommercialProfile>;
  read: (profile: CommercialProfile) => string[];
};

export const PREFERENCIAS_BLOCK_LABELS: Record<PreferenciasBlock, string> = {
  buscas: 'Lo que buscas',
  vendes: 'Cómo vendes',
  cierras: 'Tus condiciones',
};

export const PREFERENCIAS_BLOCK_HINTS: Record<PreferenciasBlock, string> = {
  buscas: 'Para avisarte solo de vacantes que te interesan',
  vendes: 'Así medimos tu compatibilidad con cada vacante comercial',
  cierras: 'Salario, viaje y disponibilidad — para un match realista',
};

export const PREFERENCIAS_BLOCKS: PreferenciasBlock[] = ['buscas', 'vendes', 'cierras'];

/** Rango granular de aspiración salarial, de $1 millón COP en $1 millón COP. */
function buildSalarySliderLabels(): string[] {
  const labels: string[] = ['Menos de $1 millón COP / mes'];
  for (let millones = 1; millones <= 40; millones += 1) {
    labels.push(`$${millones} millones COP / mes`);
  }
  labels.push('Más de $40 millones COP / mes');
  labels.push('Prefiero no indicar por ahora');
  return labels;
}

export const SALARY_SLIDER_LABELS = buildSalarySliderLabels();

const join = (values: string[]) => values.join(', ');

function split(value?: string | string[] | null): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value?.trim()) return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

function mergeTools(profile: CommercialProfile, selected: string[]): string[] {
  const existing = profile.herramientas ?? [];
  return [...new Set([...existing, ...selected])];
}

function inferNivelRol(cargos: string[], equipo: string): string | undefined {
  if (cargos.some((c) => /director/i.test(c))) return 'Director';
  if (cargos.some((c) => /gerente/i.test(c))) return 'Jefe o Gerente';
  if (cargos.some((c) => /coordinador/i.test(c))) return 'Coordinador';
  if (equipo && equipo !== '0' && equipo !== 'No') return 'Jefe o Gerente';
  if (cargos.some((c) => /key account|kam/i.test(c))) return 'Ejecutivo comercial';
  if (cargos.length > 0) return 'Ejecutivo comercial';
  return undefined;
}

function mapProspecting(selected: string[]): Partial<CommercialProfile> {
  const patch: Partial<CommercialProfile> = { funcionPrincipal: join(selected) };
  if (selected.some((s) => /prospect|hunter/i.test(s))) patch.enfoque = 'Hunter';
  else if (selected.some((s) => /cartera|base instalada|farmer/i.test(s))) patch.enfoque = 'Farmer';
  if (selected.some((s) => /licitac/i.test(s))) patch.canalVenta = 'Licitación';
  else if (selected.some((s) => /distribuidor/i.test(s))) patch.canalVenta = 'Distribuidores';
  else if (selected.some((s) => /marketing|leads/i.test(s))) patch.canalVenta = 'Directo';
  return patch;
}

function hasCompleteLanguages(profile: CommercialProfile): boolean {
  return (profile.idiomas ?? []).some(isLanguageComplete);
}

export const PREFERENCIAS_WIZARD_STEPS: PreferenciasWizardStep[] = [
  {
    id: 'areas-interes',
    block: 'buscas',
    title: '¿Qué tipo de trabajo estás buscando?',
    subtitle: 'Elige los roles que te interesan (puedes marcar varios).',
    multi: true,
    options: [
      'Ventas',
      'Asesor comercial',
      'Key account manager',
      'Auxiliar servicio al cliente',
      'Director comercial',
      'Gerente comercial',
      'Ejecutivo comercial',
      'Representante de ventas',
    ],
    apply: (selected, profile) => {
      const equipo = profile.tamanoEquipo ?? '';
      return {
        objetivoProfesional: join(selected),
        rol: selected[0] ?? profile.rol,
        rolOtro: selected.length > 1 ? join(selected.slice(1)) : profile.rolOtro,
        nivelRol: inferNivelRol(selected, equipo) ?? profile.nivelRol,
      };
    },
    read: (p) => {
      const fromObjective = split(p.objetivoProfesional);
      if (fromObjective.length > 0) return fromObjective;
      const fromRole = split(p.rol);
      if (p.rolOtro) fromRole.push(...split(p.rolOtro));
      return fromRole;
    },
  },
  {
    id: 'cargos-interes',
    block: 'buscas',
    title: '¿Qué cargos te interesan?',
    subtitle: 'Selecciona todos los que te gustaría.',
    multi: true,
    skipIf: () => true,
    options: [
      'Ejecutivo comercial',
      'Asesor comercial',
      'Representante de ventas',
      'KAM / Key Account',
      'Hunter',
      'Farmer',
      'SDR / BDR',
      'Director comercial',
      'Gerente comercial',
      'Gerente de zona',
      'Jefe comercial',
      'Preventa / Pre-sales',
      'Consultor comercial',
      'Ejecutivo de cuenta',
      'Líder comercial',
    ],
    apply: (selected, profile) => {
      const equipo = profile.tamanoEquipo ?? '';
      return {
        rol: selected[0] ?? profile.rol,
        rolOtro: selected.length > 1 ? join(selected.slice(1)) : profile.rolOtro,
        nivelRol: inferNivelRol(selected, equipo) ?? profile.nivelRol,
      };
    },
    read: (p) => {
      const items = split(p.rol);
      if (p.rolOtro) items.push(...split(p.rolOtro));
      return items;
    },
  },
  {
    id: 'industrias',
    block: 'buscas',
    kind: 'tag-picker',
    title: '¿En qué industrias quieres trabajar?',
    subtitle: 'Elige hasta 3 — las que más te interesen ahora.',
    multi: true,
    maxSelections: MAX_PORTAL_INDUSTRIES,
    options: [...PORTAL_INDUSTRY_OPTIONS],
    apply: (selected) => ({
      industrias: selected.slice(0, MAX_PORTAL_INDUSTRIES),
      industriaPrincipal: selected[0],
    }),
    read: (p) => (p.industrias ?? []).slice(0, MAX_PORTAL_INDUSTRIES),
  },
  {
    id: 'modalidad',
    block: 'buscas',
    title: '¿Qué modalidad prefieres?',
    multi: true,
    options: ['Presencial', 'Híbrido', 'Remoto'],
    apply: (selected) => ({ modalidadTrabajo: join(selected) }),
    read: (p) => split(p.modalidadTrabajo),
  },
  {
    id: 'disponibilidad',
    block: 'buscas',
    title: '¿Cuándo podrías empezar?',
    multi: false,
    options: ['Inmediata', '15 días', '30 días', '60 días'],
    apply: (selected) => ({ disponibilidad: selected[0] }),
    read: (p) => (p.disponibilidad ? [p.disponibilidad] : []),
  },
  {
    id: 'contrato',
    skipIf: () => true, // simplificado: fuera del flujo activo
    block: 'buscas',
    title: '¿Qué tipo de contrato prefieres?',
    multi: true,
    options: [...CONTRACT_TYPE_OPTIONS],
    apply: (selected) => ({ tipoContratoDeseado: join(selected) }),
    read: (p) => split(p.tipoContratoDeseado),
  },
  {
    id: 'que-vendes',
    block: 'vendes',
    title: '¿Qué sabes vender?',
    subtitle: 'Selecciona todo lo que hayas vendido.',
    multi: true,
    options: [
      'Productos físicos',
      'Servicios',
      'Software',
      'SaaS / Suscripciones',
      'Consultoría',
      'Maquinaria',
      'Equipos industriales',
      'Materias primas',
      'Insumos',
      'Proyectos',
      'Licitaciones públicas',
      'Soluciones integrales',
    ],
    apply: (selected) => ({ naturaleza: join(selected) }),
    read: (p) => split(p.naturaleza),
  },
  {
    id: 'tipo-venta',
    block: 'vendes',
    title: '¿Cómo es normalmente tu venta?',
    subtitle: 'Puedes marcar estilo y enfoque (Hunter / Farmer).',
    multi: true,
    options: [
      'Venta consultiva',
      'Venta técnica',
      'Venta transaccional',
      'Venta relacional',
      'Venta estratégica',
      'Venta por proyectos',
      'Venta recurrente',
      'Venta de alto ticket',
      'Hunter (prospección)',
      'Farmer (cartera)',
    ],
    apply: (selected, profile) => {
      const patch: Partial<CommercialProfile> = { tipoVenta: join(selected) };
      if (selected.some((s) => /hunter/i.test(s))) patch.enfoque = 'Hunter';
      else if (selected.some((s) => /farmer/i.test(s))) patch.enfoque = 'Farmer';
      else if (profile.enfoque) patch.enfoque = profile.enfoque;
      return patch;
    },
    read: (p) => {
      const items = split(p.tipoVenta);
      if (p.enfoque === 'Hunter' && !items.some((s) => /hunter/i.test(s))) {
        items.push('Hunter (prospección)');
      }
      if (p.enfoque === 'Farmer' && !items.some((s) => /farmer/i.test(s))) {
        items.push('Farmer (cartera)');
      }
      return items;
    },
  },
  {
    id: 'tipo-cliente',
    block: 'vendes',
    title: '¿Quién es normalmente tu cliente?',
    multi: true,
    options: [
      'Empresas (B2B)',
      'Consumidor final (B2C)',
      'Gobierno',
      'Distribuidores',
      'Mayoristas',
      'Constructoras',
      'Hospitales / clínicas',
      'Universidades',
      'Industria',
      'Retail / tiendas',
      'Otro',
    ],
    apply: (selected) => ({ tipoCliente: join(selected) }),
    read: (p) => split(p.tipoCliente),
  },
  {
    id: 'interlocutores',
    skipIf: () => true, // simplificado: fuera del flujo activo
    block: 'vendes',
    title: '¿Con quién hablas normalmente?',
    multi: true,
    options: [
      'Dueño / accionista',
      'CEO',
      'Director comercial',
      'Gerencia general',
      'Compras',
      'Recursos humanos',
      'Operaciones',
      'Ingeniería / TI',
      'Financiero / CFO',
      'Marketing',
    ],
    apply: (selected) => ({ nivelInterlocutor: join(selected) }),
    read: (p) => split(p.nivelInterlocutor),
  },
  {
    id: 'como-consigues',
    skipIf: () => true, // simplificado: fuera del flujo activo
    block: 'vendes',
    title: '¿Cómo consigues clientes?',
    multi: true,
    options: [
      'Prospectando en frío',
      'Referidos',
      'Licitaciones',
      'Marketing inbound',
      'Leads entrantes',
      'Base instalada',
      'Distribuidores / canales',
      'Cartera propia',
      'Visitas presenciales',
      'Ferias y eventos',
    ],
    apply: (selected) => mapProspecting(selected),
    read: (p) => split(p.funcionPrincipal),
  },
  {
    id: 'ciclo-venta',
    skipIf: () => true, // simplificado: fuera del flujo activo
    block: 'vendes',
    title: '¿Cómo es tu ciclo de venta?',
    multi: false,
    options: ['Menos de 1 semana', '1-4 semanas', '1-3 meses', '3-6 meses', 'Más de 6 meses'],
    apply: (selected) => {
      const map: Record<string, string> = {
        'Menos de 1 semana': 'Menos de 1 mes',
        '1-4 semanas': 'Menos de 1 mes',
        '1-3 meses': '1 a 3 meses',
        '3-6 meses': '3 a 6 meses',
        'Más de 6 meses': '6 a 12 meses',
      };
      return { ciclo: map[selected[0]] ?? selected[0] };
    },
    read: (p) => {
      if (!p.ciclo) return [];
      const reverse: Record<string, string> = {
        'Menos de 1 mes': 'Menos de 1 semana',
        '1 a 3 meses': '1-3 meses',
        '3 a 6 meses': '3-6 meses',
        '6 a 12 meses': 'Más de 6 meses',
      };
      return [reverse[p.ciclo] ?? p.ciclo];
    },
  },
  {
    id: 'tamano-negocio',
    skipIf: () => true, // simplificado: fuera del flujo activo
    block: 'vendes',
    title: '¿Qué tamaño de negocio manejas?',
    subtitle: 'Valor aproximado del negocio o contrato.',
    multi: false,
    options: [
      'Hasta $10 millones COP',
      '$10 a $50 millones COP',
      '$50 a $200 millones COP',
      'Más de $200 millones COP',
    ],
    apply: (selected) => {
      const map: Record<string, string> = {
        'Hasta $10 millones COP': 'Menos de $5 millones COP',
        '$10 a $50 millones COP': '$5 a $20 millones COP',
        '$50 a $200 millones COP': '$20 a $100 millones COP',
        'Más de $200 millones COP': '$100 a $500 millones COP',
      };
      return { ticketPrincipal: map[selected[0]] ?? selected[0] };
    },
    read: (p) => {
      if (!p.ticketPrincipal) return [];
      const reverse: Record<string, string> = {
        'Menos de $5 millones COP': 'Hasta $10 millones COP',
        '$5 a $20 millones COP': '$10 a $50 millones COP',
        '$20 a $100 millones COP': '$50 a $200 millones COP',
        '$100 a $500 millones COP': 'Más de $200 millones COP',
      };
      return [reverse[p.ticketPrincipal] ?? p.ticketPrincipal];
    },
  },
  {
    id: 'liderazgo',
    block: 'vendes',
    title: '¿Has tenido personas a cargo?',
    subtitle: 'Cuéntanos tu experiencia liderando equipo comercial.',
    multi: false,
    options: ['No', '1-5', '6-10', '11-20', '20+'],
    apply: (selected, profile) => {
      const val = selected[0];
      const cargos = split(profile.rol).concat(split(profile.rolOtro));
      if (val === 'No') return { tamanoEquipo: '0' };
      return {
        tamanoEquipo: val,
        nivelRol: inferNivelRol(cargos, val) ?? profile.nivelRol,
      };
    },
    read: (p) => {
      if (!p.tamanoEquipo || p.tamanoEquipo === '0') return ['No'];
      return [p.tamanoEquipo];
    },
  },
  {
    id: 'crm',
    block: 'vendes',
    title: '¿Qué CRM has usado?',
    subtitle: 'Opcional. Marca los que conozcas.',
    multi: true,
    optional: true,
    options: [
      'Salesforce',
      'HubSpot',
      'Microsoft Dynamics',
      'SAP',
      'Zoho',
      'Monday CRM',
      'Pipedrive',
      'Odoo',
      'Siigo',
      'Ninguno / poco uso',
    ],
    apply: (selected) => ({ crmVentas: join(selected) }),
    read: (p) => split(p.crmVentas),
  },
  {
    id: 'herramientas',
    skipIf: () => true, // simplificado: fuera del flujo activo
    block: 'cierras',
    title: '¿Qué otras herramientas dominas?',
    subtitle: 'ERP, analítica y productividad.',
    multi: true,
    optional: true,
    options: [
      'SAP',
      'Oracle',
      'Siigo',
      'Siesa',
      'Helisa',
      'Excel avanzado',
      'Power BI',
      'Tableau',
      'Google Workspace',
      'Notion',
    ],
    apply: (selected, profile) => ({ herramientas: mergeTools(profile, selected) }),
    read: (p) => p.herramientas ?? [],
  },
  {
    id: 'idiomas-review',
    block: 'cierras',
    kind: 'idiomas-review',
    title: '¿Tus idiomas están correctos?',
    subtitle: 'Los leímos de tu hoja de vida.',
    multi: false,
    options: ['Sí, están correctos', 'Quiero revisarlos'],
    // Already confirmed in the CV review hub — skip to avoid asking twice.
    skipIf: () => true,
    apply: () => ({}),
    read: (p) => (hasCompleteLanguages(p) ? ['Sí, están correctos'] : []),
  },
  {
    id: 'idiomas',
    block: 'cierras',
    kind: 'chips',
    title: '¿Qué idiomas hablas?',
    subtitle: 'Solo si no los confirmaste al revisar tu CV.',
    multi: true,
    options: [...LANGUAGE_OPTIONS.filter((l) => l !== 'Otro')],
    skipIf: (p) => hasCompleteLanguages(p),
    apply: (selected, profile) => ({
      idiomas: selected.map((idioma, i) => ({
        id: profile.idiomas?.find((l) => l.idioma === idioma)?.id ?? `lang-${i}`,
        idioma,
        nivel: profile.idiomas?.find((l) => l.idioma === idioma)?.nivel ?? '',
      })),
    }),
    read: (p) => (p.idiomas ?? []).map((l) => l.idioma).filter(Boolean),
  },
  {
    id: 'idiomas-niveles',
    block: 'cierras',
    kind: 'idiomas-levels',
    title: '¿Qué nivel tienes en cada idioma?',
    subtitle: 'Elige el nivel en el que puedes trabajar.',
    multi: false,
    options: [...LANGUAGE_LEVEL_OPTIONS],
    skipIf: (p) => hasCompleteLanguages(p),
    apply: () => ({}),
    read: () => [],
  },
  {
    id: 'viajar',
    block: 'cierras',
    title: '¿Estás dispuesto a viajar por trabajo?',
    multi: false,
    options: ['Sí', 'No', 'Ocasionalmente'],
    apply: (selected) => ({ disponibilidadViajar: selected[0] }),
    read: (p) => (p.disponibilidadViajar ? [p.disponibilidadViajar] : []),
  },
  {
    id: 'reubicacion',
    block: 'cierras',
    title: '¿Estarías dispuesto a cambiar de ciudad?',
    multi: false,
    options: ['Sí', 'No', 'A evaluar'],
    apply: (selected) => ({ disponibilidadReubicacion: selected[0] }),
    read: (p) => (p.disponibilidadReubicacion ? [p.disponibilidadReubicacion] : []),
  },
  {
    id: 'salario',
    block: 'cierras',
    kind: 'slider',
    title: '¿Cuál es tu aspiración salarial?',
    subtitle: 'Mensual en COP, antes de impuestos. Desliza para elegir.',
    multi: false,
    options: SALARY_SLIDER_LABELS,
    apply: (selected) => ({ expectativaSalarial: selected[0] }),
    read: (p) => (p.expectativaSalarial ? [p.expectativaSalarial] : []),
  },
];

export const PREFERENCIAS_STEP_KEY = 'kova_preferencias_step';
export const PREFERENCIAS_VIEW_KEY = 'kova_preferencias_view';

export function getActiveSteps(profile: CommercialProfile): PreferenciasWizardStep[] {
  return PREFERENCIAS_WIZARD_STEPS.filter((step) => !step.skipIf?.(profile));
}

export function answersFromProfile(profile: CommercialProfile): Record<string, string[]> {
  const answers: Record<string, string[]> = {};
  for (const step of PREFERENCIAS_WIZARD_STEPS) {
    if (step.skipIf?.(profile)) continue;
    answers[step.id] = step.read(profile);
  }
  return answers;
}

export function applyPreferenciasAnswers(
  answers: Record<string, string[]>,
  profile: CommercialProfile,
): CommercialProfile {
  let next = { ...profile };
  const steps = getActiveSteps(profile);
  for (const step of steps) {
    const selected = answers[step.id] ?? [];
    if (selected.length === 0) continue;
    next = { ...next, ...step.apply(selected, next) };
  }
  return next;
}

export function blockProgress(
  block: PreferenciasBlock,
  answers: Record<string, string[]>,
  profile: CommercialProfile,
): { done: number; total: number; percent: number } {
  const steps = getActiveSteps(profile).filter((s) => s.block === block);
  const done = steps.filter((s) => (answers[s.id]?.length ?? 0) > 0).length;
  const total = steps.length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

export function overallProgress(answers: Record<string, string[]>, profile: CommercialProfile): number {
  const steps = getActiveSteps(profile);
  const answered = steps.filter((s) => (answers[s.id]?.length ?? 0) > 0).length;
  return steps.length ? Math.round((answered / steps.length) * 100) : 0;
}

export function isPreferenciasComplete(answers: Record<string, string[]>, profile: CommercialProfile): boolean {
  const requiredIds = ['areas-interes', 'industrias', 'tipo-venta', 'salario', 'viajar', 'reubicacion', 'disponibilidad'];
  const steps = getActiveSteps(profile).filter((s) => requiredIds.includes(s.id));
  return steps.every((s) => (answers[s.id]?.length ?? 0) > 0);
}

export function stepIndexForBlock(
  activeSteps: PreferenciasWizardStep[],
  block: PreferenciasBlock,
  answers: Record<string, string[]>,
): number {
  const blockSteps = activeSteps.filter((s) => s.block === block);
  const firstEmpty = blockSteps.find((s) => (answers[s.id]?.length ?? 0) === 0);
  const target = firstEmpty ?? blockSteps[0];
  const idx = activeSteps.findIndex((s) => s.id === target?.id);
  return idx >= 0 ? idx : 0;
}

export function profileSnapshot(profile: CommercialProfile) {
  return {
    experiencias: profile.historialLaboral?.length ?? 0,
    estudios: profile.formacion?.length ?? 0,
    certificaciones: profile.certificaciones?.length ?? 0,
    idiomas: profile.idiomas?.length ?? 0,
    herramientas: profile.herramientas?.length ?? 0,
  };
}

export function salarySliderIndex(value?: string): number {
  const fallback = 8; // "$8 millones COP / mes"
  if (!value) return fallback;
  const idx = SALARY_SLIDER_LABELS.indexOf(value);
  return idx >= 0 ? idx : fallback;
}
