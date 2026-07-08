import type { CommercialProfile } from './candidate-commercial-profile';
import type { CvExtractionResult } from './cv-extract';
import { applyCvSuggestions } from './cv-extract';

export type OnboardingStep =
  | 'welcome'
  | 'cv_upload'
  | 'cv_analyzing'
  | 'cv_summary'
  | 'cv_review'
  | 'bridge'
  | 'questions'
  | 'done';

export type OnboardingCounts = {
  experiencias: number;
  estudios: number;
  certificaciones: number;
  idiomas: number;
  cursos: number;
};

type OnboardingMeta = {
  profileStatus?: string;
  onboardingStep?: OnboardingStep;
  cvExtraction?: unknown;
};

export function isOnboardingComplete(meta: OnboardingMeta) {
  return meta.profileStatus === 'complete' || meta.onboardingStep === 'done';
}

export function resolveOnboardingStep(meta: OnboardingMeta, hasCv: boolean): OnboardingStep {
  if (isOnboardingComplete(meta)) return 'done';
  const saved = meta.onboardingStep;
  if (saved && saved !== 'welcome') return saved;
  if (hasCv && meta.cvExtraction) return 'cv_summary';
  return 'welcome';
}

export function countsFromProfile(profile: CommercialProfile): OnboardingCounts {
  return {
    experiencias: profile.historialLaboral?.length ?? 0,
    estudios: profile.formacion?.length ?? 0,
    certificaciones: profile.certificaciones?.length ?? 0,
    idiomas: profile.idiomas?.length ?? 0,
    cursos: 0,
  };
}

export function countsFromExtraction(extraction: CvExtractionResult): OnboardingCounts {
  const s = extraction.suggestions;
  return {
    experiencias: s.historialLaboral?.length ?? 0,
    estudios: s.formacion?.length ?? 0,
    certificaciones: 0,
    idiomas: s.idiomas?.length ?? 0,
    cursos: 0,
  };
}

export function applyFullCvExtraction(
  profile: CommercialProfile,
  extraction: CvExtractionResult,
): CommercialProfile {
  const keys = extraction.reviewFields.map((f) => f.key);
  return applyCvSuggestions(profile, extraction.suggestions, keys) as CommercialProfile;
}

export function onboardingProgressPercent(step: OnboardingStep) {
  const order: OnboardingStep[] = [
    'welcome',
    'cv_upload',
    'cv_analyzing',
    'cv_summary',
    'cv_review',
    'bridge',
    'questions',
    'done',
  ];
  const idx = order.indexOf(step);
  if (idx < 0) return 0;
  return Math.round((idx / (order.length - 1)) * 100);
}

export const CV_ANALYSIS_STEPS = [
  'Leyendo documento',
  'Detectando empresas',
  'Detectando cargos',
  'Detectando estudios',
  'Detectando fechas',
  'Detectando habilidades',
] as const;

export type SmartQuestion = {
  id: string;
  title: string;
  subtitle?: string;
  options: string[];
  multi: boolean;
  field: keyof CommercialProfile | 'modalidadesPreferidas' | 'indicadores';
};

export const SMART_QUESTIONS: SmartQuestion[] = [
  {
    id: 'como-vendes',
    title: '¿Cómo vendes?',
    subtitle: 'Selecciona todas las que apliquen.',
    options: ['Hunter', 'Farmer', 'Desarrollo de negocio', 'Venta consultiva', 'Venta técnica'],
    multi: true,
    field: 'funcionPrincipal',
  },
  {
    id: 'tipo-clientes',
    title: '¿Qué tipo de clientes manejas?',
    options: ['B2B', 'Gobierno', 'Retail', 'Distribuidores', 'B2C'],
    multi: true,
    field: 'tipoCliente',
  },
  {
    id: 'crm',
    title: '¿Qué CRM has utilizado?',
    options: ['Dynamics', 'Salesforce', 'Hubspot', 'Zoho'],
    multi: true,
    field: 'crmVentas',
  },
  {
    id: 'industrias',
    title: '¿En qué industrias has vendido?',
    options: ['Industrial', 'Tecnología', 'Salud', 'Retail', 'Logística', 'Manufactura'],
    multi: true,
    field: 'industrias',
  },
  {
    id: 'herramientas',
    title: '¿Qué herramientas utilizas?',
    options: ['Excel', 'Power BI', 'Tableau', 'SAP'],
    multi: true,
    field: 'herramientas',
  },
  {
    id: 'indicadores',
    title: '¿Qué indicadores manejas?',
    options: ['Forecast', 'Pipeline', 'Rentabilidad', 'Conversión', 'Ticket', 'Margen'],
    multi: true,
    field: 'indicadores',
  },
  {
    id: 'modalidad',
    title: '¿Qué modalidades aceptarías?',
    options: ['Remoto', 'Híbrido', 'Presencial'],
    multi: true,
    field: 'modalidadesPreferidas',
  },
  {
    id: 'salario',
    title: 'Aspiración salarial',
    options: [
      'Menos de $3 millones',
      '$3 a $5 millones',
      '$5 a $8 millones',
      '$8 a $12 millones',
      'Más de $12 millones',
    ],
    multi: false,
    field: 'expectativaSalarial',
  },
];

export function readOnboardingMeta(metadata: unknown): OnboardingMeta {
  if (!metadata || typeof metadata !== 'object') return {};
  return metadata as OnboardingMeta;
}
