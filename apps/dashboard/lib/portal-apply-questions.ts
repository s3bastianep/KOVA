import {
  getQuestionById,
  parseMultiValue,
  standardQuestionsFromMetadata,
  type SelectedStandardQuestion,
} from '@/lib/standard-questions';

export type YesNoValue = 'Sí' | 'No';

export type ApplyQuestionResolve =
  | { kind: 'years_min'; sourceKey: string; passValue: string }
  | { kind: 'equals'; sourceKey: string; passValue: string; failValue: string }
  | { kind: 'english_min'; sourceKey: string; passValue: string }
  | { kind: 'append_all'; sourceKey: string; items: string[] }
  | { kind: 'boolean_extra'; sourceKey: string; passValue: string; failValue: string };

export type ApplyMatchQuestion = {
  id: string;
  label: string;
  category: string;
  inputType: 'yesno';
  helpText?: string;
  resolve: ApplyQuestionResolve;
  priority: number;
};

export type VacancyApplyContext = {
  title?: string;
  description?: string | null;
  city?: string | null;
  modality?: string | null;
};

export const MAX_APPLY_QUESTIONS = 7;

export const MOCK_VACANCY_APPLY_METADATA = {
  standardQuestions: [
    { id: 'experience_years', weight: 25, expected: '5' },
    { id: 'industry', weight: 20, expected: 'Software,Tecnología' },
    { id: 'sales_type', weight: 15, expected: 'B2B,Consultiva' },
    { id: 'skills', weight: 20, expected: 'Prospección,Cierre de ventas,Negociación' },
    { id: 'crm', weight: 10, expected: 'Salesforce,HubSpot' },
    { id: 'english_level', weight: 5, expected: 'B2' },
    { id: 'availability', weight: 5, expected: 'Inmediata' },
  ] satisfies SelectedStandardQuestion[],
};

type CandidateLike = { metadata?: unknown; city?: string | null };

const REQUIREMENT_ORDER = [
  'experience_years',
  'industry',
  'sales_type',
  'team_leadership',
  'skills',
  'crm',
  'english_level',
  'education',
  'city',
  'availability',
  'ticket_avg',
  'job_objective',
  'kpi_focus',
  'main_functions',
] as const;

function joinNatural(items: string[], max = 3) {
  const slice = items.slice(0, max).map((i) => i.toLowerCase());
  if (slice.length === 0) return '';
  if (slice.length === 1) return slice[0]!;
  if (slice.length === 2) return `${slice[0]} y ${slice[1]}`;
  return `${slice.slice(0, -1).join(', ')} y ${slice[slice.length - 1]}`;
}

function industryPhrase(items: string[]) {
  if (items.some((i) => /software/i.test(i))) return 'software';
  if (items.some((i) => /tecnolog/i.test(i))) return 'tecnología';
  if (items.length === 1) return items[0]!.toLowerCase();
  return joinNatural(items, 2);
}

function needsVehicle(context: VacancyApplyContext, salesTypes: string[]) {
  const haystack = [context.modality, context.title, context.description, ...salesTypes]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return (
    salesTypes.some((s) => /field/i.test(s)) ||
    /presencial|terreno|visita.*cliente|vehículo|vehiculo/i.test(haystack)
  );
}

function needsIntangible(industries: string[], salesTypes: string[], context: VacancyApplyContext) {
  const haystack = [context.title, context.description, ...industries, ...salesTypes]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return (
    industries.some((i) => /software|tecnolog|saas|servicio/i.test(i)) ||
    salesTypes.some((s) => /consultiv/i.test(s)) ||
    /intangible|servicio|software|saas/i.test(haystack)
  );
}

function buildConsolidatedQuestion(
  selected: SelectedStandardQuestion,
  context: VacancyApplyContext,
  allSelected: SelectedStandardQuestion[],
): ApplyMatchQuestion | null {
  const def = getQuestionById(selected.id);
  if (!def) return null;

  const expectedItems = parseMultiValue(selected.expected);
  const industries = parseMultiValue(allSelected.find((s) => s.id === 'industry')?.expected ?? '');
  const salesTypes = parseMultiValue(allSelected.find((s) => s.id === 'sales_type')?.expected ?? '');
  const priority = selected.weight;

  switch (selected.id) {
    case 'experience_years': {
      const sector = industryPhrase(industries);
      const label = sector
        ? `¿Tienes al menos ${selected.expected} años vendiendo ${sector}?`
        : `¿Tienes al menos ${selected.expected} años en ventas?`;
      return {
        id: 'experience_years',
        label,
        category: 'Experiencia',
        inputType: 'yesno',
        priority,
        resolve: { kind: 'years_min', sourceKey: 'experience_years', passValue: selected.expected },
      };
    }

    case 'industry': {
      if (!expectedItems.length) return null;
      const label =
        expectedItems.some((i) => /software/i.test(i))
          ? '¿Has vendido productos de software?'
          : expectedItems.some((i) => /tecnolog/i.test(i))
            ? '¿Has trabajado en tecnología?'
            : `¿Tienes experiencia en ${joinNatural(expectedItems, 2)}?`;
      return {
        id: 'industry',
        label,
        category: 'Industria',
        inputType: 'yesno',
        priority,
        resolve: { kind: 'append_all', sourceKey: 'industry', items: expectedItems },
      };
    }

    case 'sales_type': {
      if (!expectedItems.length) return null;
      const hasB2b = expectedItems.some((t) => /b2b/i.test(t));
      const hasConsult = expectedItems.some((t) => /consultiv/i.test(t));
      let label = `¿Manejas ${joinNatural(expectedItems, 2)}?`;
      if (hasB2b && hasConsult) label = '¿Tienes experiencia en venta B2B consultiva?';
      else if (hasB2b) label = '¿Tienes experiencia en ventas B2B?';
      else if (hasConsult) label = '¿Has hecho venta consultiva?';
      return {
        id: 'sales_type',
        label,
        category: 'Tipo de venta',
        inputType: 'yesno',
        priority,
        resolve: { kind: 'append_all', sourceKey: 'sales_type', items: expectedItems },
      };
    }

    case 'skills': {
      if (!expectedItems.length) return null;
      const top = expectedItems.slice(0, 3);
      return {
        id: 'skills',
        label: `¿Dominas ${joinNatural(top)}?`,
        category: 'Competencias',
        inputType: 'yesno',
        priority,
        resolve: { kind: 'append_all', sourceKey: 'skills', items: expectedItems },
      };
    }

    case 'crm': {
      const tools = expectedItems.filter((t) => !/ninguno/i.test(t));
      if (!tools.length) return null;
      return {
        id: 'crm',
        label: tools.length === 1 ? `¿Has usado ${tools[0]}?` : `¿Has usado ${joinNatural(tools, 2)}?`,
        category: 'Herramientas',
        inputType: 'yesno',
        priority,
        resolve: { kind: 'append_all', sourceKey: 'crm', items: tools },
      };
    }

    case 'english_level':
      return {
        id: 'english_level',
        label: `¿Manejas inglés ${selected.expected} o superior?`,
        category: 'Idiomas',
        inputType: 'yesno',
        priority,
        resolve: { kind: 'english_min', sourceKey: 'english_level', passValue: selected.expected },
      };

    case 'education': {
      const level = expectedItems[0] ?? selected.expected;
      return {
        id: 'education',
        label: `¿Tienes formación ${level.toLowerCase()} o superior?`,
        category: 'Formación',
        inputType: 'yesno',
        priority,
        resolve: { kind: 'equals', sourceKey: 'education', passValue: level, failValue: 'Técnico' },
      };
    }

    case 'city': {
      const city = expectedItems[0] ?? selected.expected;
      return {
        id: 'city',
        label: `¿Vives en ${city} o zona metropolitana?`,
        category: 'Ubicación',
        inputType: 'yesno',
        priority,
        resolve: { kind: 'equals', sourceKey: 'city', passValue: city, failValue: 'Otra' },
      };
    }

    case 'availability': {
      const avail = expectedItems[0] ?? selected.expected;
      return {
        id: 'availability',
        label: /inmediat/i.test(avail)
          ? '¿Puedes incorporarte de inmediato?'
          : `¿Puedes ingresar en ${avail.toLowerCase()} o antes?`,
        category: 'Disponibilidad',
        inputType: 'yesno',
        priority,
        resolve: { kind: 'equals', sourceKey: 'availability', passValue: avail, failValue: '60 días' },
      };
    }

    case 'team_leadership': {
      const num = Number(selected.expected);
      return {
        id: 'team_leadership',
        label:
          Number.isFinite(num) && num > 0
            ? `¿Has liderado equipos de ${num}+ personas?`
            : '¿Has liderado equipos comerciales?',
        category: 'Liderazgo',
        inputType: 'yesno',
        priority,
        resolve: {
          kind: 'years_min',
          sourceKey: 'team_leadership',
          passValue: Number.isFinite(num) && num > 0 ? String(num) : '1',
        },
      };
    }

    case 'ticket_avg': {
      const range = expectedItems[0] ?? selected.expected;
      return {
        id: 'ticket_avg',
        label: `¿Has manejado facturación de ${range.toLowerCase()}?`,
        category: 'Experiencia',
        inputType: 'yesno',
        priority,
        resolve: { kind: 'equals', sourceKey: 'ticket_avg', passValue: range, failValue: 'Menos de 100 millones/mes' },
      };
    }

    default:
      return null;
  }
}

function buildDerivedQuestion(
  kind: 'intangible' | 'vehicle',
  context: VacancyApplyContext,
  allSelected: SelectedStandardQuestion[],
): ApplyMatchQuestion | null {
  const industries = parseMultiValue(allSelected.find((s) => s.id === 'industry')?.expected ?? '');
  const salesTypes = parseMultiValue(allSelected.find((s) => s.id === 'sales_type')?.expected ?? '');

  if (kind === 'intangible' && needsIntangible(industries, salesTypes, context)) {
    return {
      id: 'derived_intangible',
      label: '¿Has vendido productos intangibles o servicios?',
      category: 'Experiencia',
      inputType: 'yesno',
      priority: 12,
      resolve: { kind: 'boolean_extra', sourceKey: 'intangible_sales', passValue: 'Sí', failValue: 'No' },
    };
  }

  if (kind === 'vehicle' && needsVehicle(context, salesTypes)) {
    return {
      id: 'derived_vehicle',
      label: '¿Cuentas con vehículo propio?',
      category: 'Logística',
      inputType: 'yesno',
      priority: 11,
      resolve: { kind: 'boolean_extra', sourceKey: 'has_vehicle', passValue: 'Sí', failValue: 'No' },
    };
  }

  return null;
}

function sortRequirements(selected: SelectedStandardQuestion[]) {
  const orderMap = new Map(REQUIREMENT_ORDER.map((id, i) => [id, i]));
  return [...selected].sort((a, b) => {
    const weightDiff = b.weight - a.weight;
    if (weightDiff !== 0) return weightDiff;
    return (orderMap.get(a.id as (typeof REQUIREMENT_ORDER)[number]) ?? 99) -
      (orderMap.get(b.id as (typeof REQUIREMENT_ORDER)[number]) ?? 99);
  });
}

export function buildApplyQuestions(
  vacancyMetadata: unknown,
  _candidate: CandidateLike,
  context: VacancyApplyContext = {},
): ApplyMatchQuestion[] {
  const selected = standardQuestionsFromMetadata(vacancyMetadata);
  const sorted = sortRequirements(selected);
  const questions: ApplyMatchQuestion[] = [];
  const usedKeys = new Set<string>();

  for (const req of sorted) {
    if (questions.length >= MAX_APPLY_QUESTIONS) break;
    if (usedKeys.has(req.id)) continue;

    const q = buildConsolidatedQuestion(req, context, selected);
    if (!q) continue;

    usedKeys.add(req.id);
    questions.push(q);
  }

  const derivedIntangible = buildDerivedQuestion('intangible', context, selected);
  const derivedVehicle = buildDerivedQuestion('vehicle', context, selected);

  for (const derived of [derivedIntangible, derivedVehicle]) {
    if (!derived || questions.length >= MAX_APPLY_QUESTIONS) continue;
    if (questions.some((q) => q.id === derived.id)) continue;
    questions.push(derived);
  }

  return questions.slice(0, MAX_APPLY_QUESTIONS);
}

export function resolveApplyAnswers(
  questions: ApplyMatchQuestion[],
  yesNoAnswers: Record<string, YesNoValue>,
): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};

  for (const q of questions) {
    const answer = yesNoAnswers[q.id];
    if (!answer) continue;
    const isYes = answer === 'Sí';
    const { resolve } = q;

    if (resolve.kind === 'append_all') {
      const current = parseMultiValue(
        Array.isArray(result[resolve.sourceKey])
          ? (result[resolve.sourceKey] as string[]).join(',')
          : String(result[resolve.sourceKey] ?? ''),
      );
      if (isYes) {
        result[resolve.sourceKey] = [...new Set([...current, ...resolve.items])];
      } else if (!(resolve.sourceKey in result)) {
        result[resolve.sourceKey] = current;
      }
      continue;
    }

    if (resolve.kind === 'years_min') {
      result[resolve.sourceKey] = isYes ? resolve.passValue : '0';
      continue;
    }

    if (resolve.kind === 'english_min') {
      result[resolve.sourceKey] = isYes ? resolve.passValue : 'A1';
      continue;
    }

    if (resolve.kind === 'equals' || resolve.kind === 'boolean_extra') {
      result[resolve.sourceKey] = isYes ? resolve.passValue : resolve.failValue;
    }
  }

  return result;
}

export function isQuestionAnswered(question: ApplyMatchQuestion, answers: Record<string, YesNoValue>) {
  return answers[question.id] === 'Sí' || answers[question.id] === 'No';
}

export function allQuestionsAnswered(
  questions: ApplyMatchQuestion[],
  answers: Record<string, YesNoValue>,
) {
  return questions.every((q) => isQuestionAnswered(q, answers));
}

export function mockVacancyMetadataForId(vacancyId: string) {
  if (vacancyId === 'seed-vacancy-002') {
    return {
      standardQuestions: [
        { id: 'experience_years', weight: 25, expected: '5' },
        { id: 'team_leadership', weight: 20, expected: '5' },
        { id: 'industry', weight: 15, expected: 'Consumo masivo,Distribución' },
        { id: 'skills', weight: 20, expected: 'Liderazgo comercial,Cuentas clave,Negociación' },
        { id: 'city', weight: 10, expected: 'Medellín' },
        { id: 'availability', weight: 10, expected: '30 días' },
      ],
    };
  }
  return MOCK_VACANCY_APPLY_METADATA;
}

export function defaultApplyQuestionsForCandidate(
  candidate: CandidateLike,
  context: VacancyApplyContext = {},
) {
  return buildApplyQuestions({ standardQuestions: MOCK_VACANCY_APPLY_METADATA.standardQuestions }, candidate, context);
}
