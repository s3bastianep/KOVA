export type QuestionInputType = 'number' | 'select' | 'text';
export type QuestionMatchType = 'years_min' | 'contains' | 'equals' | 'min_score';

export type StandardQuestionDef = {
  id: string;
  label: string;
  category: string;
  inputType: QuestionInputType;
  matchType: QuestionMatchType;
  options?: string[];
  defaultWeight: number;
  placeholder?: string;
  helpText?: string;
};

/** Preguntas estándar reutilizables: mismas en perfil del cargo y formulario del aspirante */
export const STANDARD_QUESTIONS: StandardQuestionDef[] = [
  {
    id: 'experience_years',
    label: 'Años de experiencia en ventas',
    category: 'Experiencia',
    inputType: 'number',
    matchType: 'years_min',
    defaultWeight: 30,
    placeholder: '3',
    helpText: 'Mínimo de años exigidos para el cargo',
  },
  {
    id: 'industry',
    label: 'Industria',
    category: 'Industria',
    inputType: 'select',
    matchType: 'contains',
    options: ['Tecnología', 'Software', 'Consumo masivo', 'Distribución', 'Servicios', 'Salud', 'Finanzas', 'Retail'],
    defaultWeight: 20,
  },
  {
    id: 'sales_type',
    label: 'Tipo de ventas',
    category: 'Ventas',
    inputType: 'select',
    matchType: 'contains',
    options: ['B2B', 'B2C', 'Inside sales', 'Field sales', 'Consultiva'],
    defaultWeight: 15,
  },
  {
    id: 'crm',
    label: 'CRM / herramienta comercial',
    category: 'Herramientas',
    inputType: 'select',
    matchType: 'contains',
    options: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho', 'Dynamics', 'Ninguno'],
    defaultWeight: 10,
  },
  {
    id: 'education',
    label: 'Nivel académico',
    category: 'Formación',
    inputType: 'select',
    matchType: 'contains',
    options: ['Técnico', 'Tecnólogo', 'Profesional', 'Especialización', 'Maestría'],
    defaultWeight: 10,
  },
  {
    id: 'english_level',
    label: 'Nivel de inglés',
    category: 'Idiomas',
    inputType: 'select',
    matchType: 'equals',
    options: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    defaultWeight: 10,
  },
  {
    id: 'city',
    label: 'Ciudad de residencia',
    category: 'Ubicación',
    inputType: 'text',
    matchType: 'contains',
    defaultWeight: 5,
    placeholder: 'Bogotá',
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
    label: 'Ticket promedio manejado (millones COP)',
    category: 'Experiencia',
    inputType: 'number',
    matchType: 'years_min',
    defaultWeight: 10,
    placeholder: '10',
    helpText: 'Valor mínimo de ticket que debe manejar el candidato',
  },
  {
    id: 'team_leadership',
    label: 'Personas a cargo (máximo lideradas)',
    category: 'Competencias',
    inputType: 'number',
    matchType: 'years_min',
    defaultWeight: 10,
    placeholder: '0',
  },
];

export type SelectedStandardQuestion = {
  id: string;
  weight: number;
  expected: string | number;
};

export function getQuestionById(id: string) {
  return STANDARD_QUESTIONS.find((q) => q.id === id);
}

export function defaultSelectedQuestions(): SelectedStandardQuestion[] {
  return [
    'experience_years',
    'industry',
    'sales_type',
    'crm',
    'education',
    'english_level',
    'availability',
  ].map((id) => {
    const q = getQuestionById(id)!;
    return {
      id,
      weight: q.defaultWeight,
      expected: q.inputType === 'number' ? Number(q.placeholder ?? 0) : (q.options?.[0] ?? ''),
    };
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
  const reqs = (metadata as { requirements?: { key: string; weight: number; expected: string | number; label?: string }[] }).requirements;
  if (Array.isArray(reqs) && reqs.length > 0) {
    return reqs.map((r) => ({ id: r.key, weight: r.weight, expected: r.expected }));
  }
  return defaultSelectedQuestions();
}

export function answersToProfile(answers: Record<string, string | number>): Record<string, string | number> {
  return { ...answers };
}
