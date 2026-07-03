export type QuestionInputType = 'select' | 'multiselect';
export type QuestionMatchType = 'years_min' | 'contains' | 'equals' | 'in_list';

export type StandardQuestionDef = {
  id: string;
  label: string;
  category: string;
  inputType: QuestionInputType;
  matchType: QuestionMatchType;
  options: string[];
  defaultWeight: number;
  helpText?: string;
  maxSelections?: number;
  weightPerItem?: number;
};

export const SKILLS_QUESTION_ID = 'skills';

/** Habilidades comerciales evaluadas - mismas del formulario del puesto comercial */
export const COMMERCIAL_SKILLS = [
  'Prospección',
  'Cierre de ventas',
  'Negociación',
  'Presentación comercial',
  'Manejo de objeciones',
  'Cuentas clave',
  'Venta consultiva',
  'Gestión de pipeline',
  'Liderazgo comercial',
  'Postventa',
  'Inteligencia emocional',
  'Trabajo en equipo',
  'Análisis de mercado',
  'Pricing',
  'Fidelización',
];

/** Cargos comerciales - selección múltiple en wizard de proceso */
export const JOB_TITLE_OPTIONS = [
  'Ejecutivo Comercial B2B',
  'Ejecutivo Comercial B2C',
  'Asesor Comercial',
  'Ejecutivo de Cuentas Clave',
  'Inside Sales',
  'Field Sales',
  'Business Developer / Hunter',
  'Representante de Ventas',
  'Gerente Comercial',
  'Jefe de Ventas',
  'Director Comercial',
  'Líder Comercial',
  'Customer Success / Postventa',
  'Coordinador Comercial',
];

/** Discovery - facturación mensual en COP (millones) */
export const REVENUE_RANGES = [
  'Menos de 100 millones/mes',
  '100 - 500 millones/mes',
  '500 - 1.000 millones/mes',
  '1.000 - 5.000 millones/mes',
  '5.000 - 10.000 millones/mes',
  '10.000 - 20.000 millones/mes',
  '+ de 20.000 millones/mes',
];

/** Discovery - formas de venta (multiselect) */
export const HOW_SELLS_OPTIONS = [
  'B2B consultivo',
  'Inside sales',
  'Field sales',
  'E-commerce',
  'Canal indirecto',
  'Suscripción',
  'B2B',
  'B2C',
  'Venta consultiva',
  'Televentas',
  'Mayorista / distribución',
];

/** Catálogo único: lo que el asesor elige aquí sale igual en el formulario del aspirante */
export const STANDARD_QUESTIONS: StandardQuestionDef[] = [
  // Perfil del cargo
  {
    id: 'job_objective',
    label: 'Objetivo del cargo',
    category: 'Perfil del cargo',
    inputType: 'select',
    matchType: 'equals',
    options: ['Incrementar ventas', 'Abrir nuevos mercados', 'Liderar equipo comercial', 'Recuperar cartera', 'Lanzar producto nuevo'],
    defaultWeight: 10,
  },
  {
    id: 'main_functions',
    label: 'Funciones principales',
    category: 'Perfil del cargo',
    inputType: 'multiselect',
    matchType: 'contains',
    options: ['Prospección', 'Cierre de ventas', 'Negociación', 'Cuentas clave', 'Postventa', 'Gestión de pipeline'],
    defaultWeight: 10,
    maxSelections: 4,
    helpText: 'Selecciona todas las que hayas realizado',
  },
  {
    id: 'responsibilities',
    label: 'Responsabilidades clave',
    category: 'Perfil del cargo',
    inputType: 'multiselect',
    matchType: 'contains',
    options: ['Meta individual', 'Gestión de cartera', 'Reporte a gerencia', 'Capacitación de equipo', 'Estrategia comercial'],
    defaultWeight: 8,
    maxSelections: 4,
    helpText: 'Selecciona todas las que hayas tenido',
  },
  {
    id: 'kpi_focus',
    label: 'KPI principal',
    category: 'Perfil del cargo',
    inputType: 'select',
    matchType: 'equals',
    options: ['Facturación mensual', 'Tasa de cierre', 'Nuevos clientes', 'Ticket promedio', 'Retención de cartera'],
    defaultWeight: 8,
  },
  // Requisitos / compatibilidad
  {
    id: 'experience_years',
    label: 'Años de experiencia en ventas',
    category: 'Experiencia',
    inputType: 'select',
    matchType: 'years_min',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '10'],
    defaultWeight: 20,
    helpText: 'Mínimo exigido para el cargo',
  },
  {
    id: SKILLS_QUESTION_ID,
    label: 'Habilidades',
    category: 'Competencias',
    inputType: 'multiselect',
    matchType: 'in_list',
    options: COMMERCIAL_SKILLS,
    defaultWeight: 30,
    maxSelections: 6,
    weightPerItem: 5,
    helpText: 'Selecciona las habilidades que dominas (hasta 6)',
  },
  {
    id: 'industry',
    label: 'Industria',
    category: 'Industria',
    inputType: 'multiselect',
    matchType: 'contains',
    options: ['Tecnología', 'Software', 'Consumo masivo', 'Distribución', 'Servicios', 'Salud', 'Finanzas', 'Retail'],
    defaultWeight: 15,
    maxSelections: 4,
    helpText: 'Selecciona todas las industrias en las que has trabajado',
  },
  {
    id: 'sales_type',
    label: 'Tipo de ventas',
    category: 'Ventas',
    inputType: 'multiselect',
    matchType: 'contains',
    options: ['B2B', 'B2C', 'Inside sales', 'Field sales', 'Consultiva'],
    defaultWeight: 10,
    maxSelections: 3,
    helpText: 'Selecciona todos los tipos de venta que manejas',
  },
  {
    id: 'crm',
    label: 'CRM / herramienta comercial',
    category: 'Herramientas',
    inputType: 'multiselect',
    matchType: 'contains',
    options: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho', 'Dynamics', 'Ninguno'],
    defaultWeight: 10,
    maxSelections: 5,
    helpText: 'Selecciona todas las herramientas que conoces',
  },
  {
    id: 'education',
    label: 'Nivel académico',
    category: 'Formación',
    inputType: 'select',
    matchType: 'contains',
    options: ['Técnico', 'Tecnólogo', 'Profesional', 'Especialización', 'Maestría'],
    defaultWeight: 5,
  },
  {
    id: 'english_level',
    label: 'Nivel de inglés',
    category: 'Idiomas',
    inputType: 'select',
    matchType: 'equals',
    options: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    defaultWeight: 5,
  },
  {
    id: 'city',
    label: 'Ciudad de residencia',
    category: 'Ubicación',
    inputType: 'select',
    matchType: 'contains',
    options: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Otra'],
    defaultWeight: 5,
  },
  {
    id: 'availability',
    label: 'Disponibilidad para ingresar',
    category: 'Disponibilidad',
    inputType: 'select',
    matchType: 'contains',
    options: ['Inmediata', '15 días', '30 días', '60 días'],
    defaultWeight: 5,
  },
  {
    id: 'ticket_avg',
    label: 'Ticket / facturación manejada',
    category: 'Experiencia',
    inputType: 'select',
    matchType: 'years_min',
    options: REVENUE_RANGES,
    defaultWeight: 10,
    helpText: 'Rango mensual en millones COP',
  },
  {
    id: 'team_leadership',
    label: 'Personas lideradas',
    category: 'Competencias',
    inputType: 'select',
    matchType: 'years_min',
    options: ['0', '1', '3', '5', '10', '15'],
    defaultWeight: 10,
  },
  {
    id: 'hiring_reason',
    label: 'Motivo de contratación',
    category: 'Necesidad',
    inputType: 'select',
    matchType: 'equals',
    options: ['Crecimiento', 'Reemplazo', 'Nuevo producto', 'Expansión regional', 'Reestructuración'],
    defaultWeight: 5,
  },
  {
    id: 'commercial_model',
    label: 'Modelo comercial',
    category: 'Discovery',
    inputType: 'multiselect',
    matchType: 'contains',
    options: ['B2B consultivo', 'Inside sales', 'Field sales', 'E-commerce', 'Canal indirecto', 'Suscripción'],
    defaultWeight: 5,
    maxSelections: 3,
    helpText: 'Selecciona todos los modelos que conoces',
  },
];

export type SelectedStandardQuestion = {
  id: string;
  weight: number;
  expected: string;
};

export function getQuestionById(id: string) {
  return STANDARD_QUESTIONS.find((q) => q.id === id);
}

export function parseMultiValue(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export function serializeMultiValue(values: string[]): string {
  return values.join(',');
}

export function defaultExpectedForQuestion(def: StandardQuestionDef): string {
  if (def.id === SKILLS_QUESTION_ID) {
    return serializeMultiValue(def.options.slice(0, 3));
  }
  return def.options[0];
}

export function defaultSelectedQuestions(): SelectedStandardQuestion[] {
  return [
    'experience_years',
    SKILLS_QUESTION_ID,
    'industry',
    'sales_type',
    'crm',
    'education',
    'english_level',
    'availability',
  ].map((id) => {
    const q = getQuestionById(id)!;
    return { id, weight: q.defaultWeight, expected: defaultExpectedForQuestion(q) };
  });
}

export function selectedToRequirements(selected: SelectedStandardQuestion[]) {
  return selected.map((s) => {
    const def = getQuestionById(s.id);
    return {
      key: s.id,
      label: def?.label ?? s.id,
      weight: s.weight,
      type: def?.matchType ?? 'contains',
      expected: s.expected,
    };
  });
}

export function standardQuestionsFromMetadata(metadata: unknown): SelectedStandardQuestion[] {
  if (!metadata || typeof metadata !== 'object') return defaultSelectedQuestions();
  const sq = (metadata as { standardQuestions?: SelectedStandardQuestion[] }).standardQuestions;
  if (Array.isArray(sq) && sq.length > 0) return sq;
  const reqs = (metadata as { requirements?: { key: string; weight: number; expected: string | number }[] }).requirements;
  if (Array.isArray(reqs) && reqs.length > 0) {
    return reqs.map((r) => ({ id: r.key, weight: r.weight, expected: String(r.expected) }));
  }
  return defaultSelectedQuestions();
}

export const PROFILE_QUESTION_IDS = STANDARD_QUESTIONS.filter((q) => q.category === 'Perfil del cargo').map((q) => q.id);
export const REQUIREMENT_QUESTION_IDS = STANDARD_QUESTIONS.filter((q) => q.category !== 'Perfil del cargo').map((q) => q.id);

/** Grupos lógicos para el selector de preguntas al aspirante */
export type QuestionGroupDef = {
  id: string;
  title: string;
  description: string;
  questionIds: string[];
};

export const QUESTION_GROUPS: QuestionGroupDef[] = [
  {
    id: 'experience',
    title: 'Experiencia comercial',
    description: 'Trayectoria, volumen de ventas, industria y canal',
    questionIds: ['experience_years', 'ticket_avg', 'industry', 'sales_type'],
  },
  {
    id: 'competencies',
    title: 'Competencias',
    description: 'Habilidades requeridas y liderazgo de equipo',
    questionIds: [SKILLS_QUESTION_ID, 'team_leadership'],
  },
  {
    id: 'profile',
    title: 'Alineación con el cargo',
    description: 'Objetivo, funciones y KPIs del rol',
    questionIds: ['job_objective', 'main_functions', 'responsibilities', 'kpi_focus'],
  },
  {
    id: 'formation',
    title: 'Formación e idiomas',
    description: 'Estudios y nivel de inglés',
    questionIds: ['education', 'english_level'],
  },
  {
    id: 'logistics',
    title: 'Ubicación y disponibilidad',
    description: 'Ciudad de residencia e ingreso',
    questionIds: ['city', 'availability'],
  },
  {
    id: 'tools',
    title: 'Herramientas',
    description: 'CRM y stack comercial',
    questionIds: ['crm'],
  },
  {
    id: 'other',
    title: 'Otros (opcional)',
    description: 'Criterios adicionales',
    questionIds: ['hiring_reason', 'commercial_model'],
  },
];
