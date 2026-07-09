import type { CommercialProfile } from './candidate-commercial-profile';
import type { CvExtractionResult } from './cv-extract';
import { applyCvSuggestions, normalizeEducation, normalizeWorkHistory } from './cv-extract';

export type OnboardingStep =
  | 'welcome'
  | 'cv_upload'
  | 'cv_analyzing'
  | 'cv_summary'
  | 'review_hub'
  | 'cv_review'
  | 'preferencias'
  | 'evidence'
  | 'competencies'
  | 'complete'
  | 'done'
  | 'bridge'
  | 'questions';

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
  onboardingSubStep?: number;
  onboardingReviewed?: string[];
  cvExtraction?: unknown;
};

export function isOnboardingComplete(meta: OnboardingMeta) {
  return meta.profileStatus === 'complete' || meta.onboardingStep === 'done';
}

function normalizeStep(step?: OnboardingStep): OnboardingStep {
  if (!step) return 'welcome';
  if (step === 'bridge' || step === 'questions') return 'preferencias';
  return step;
}

export function resolveOnboardingStep(meta: OnboardingMeta, hasCv: boolean): OnboardingStep {
  if (isOnboardingComplete(meta)) return 'done';
  const saved = normalizeStep(meta.onboardingStep);
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
  let next = applyCvSuggestions(profile, extraction.suggestions, keys) as CommercialProfile;
  if (next.historialLaboral?.length) {
    next = { ...next, historialLaboral: normalizeWorkHistory(next.historialLaboral) };
  }
  if (next.formacion?.length) {
    next = { ...next, formacion: normalizeEducation(next.formacion) };
  }
  return next;
}

export function onboardingProgressPercent(step: OnboardingStep) {
  const order: OnboardingStep[] = [
    'welcome',
    'cv_upload',
    'cv_analyzing',
    'cv_summary',
    'review_hub',
    'cv_review',
    'preferencias',
    'evidence',
    'competencies',
    'complete',
    'done',
  ];
  const normalized = normalizeStep(step);
  const idx = order.indexOf(normalized);
  if (idx < 0) return 0;
  return Math.round((idx / (order.length - 1)) * 100);
}

export const CV_ANALYSIS_STEPS = [
  'Extrayendo experiencia',
  'Leyendo formación',
  'Detectando habilidades',
  'Extrayendo idiomas',
  'Detectando empresas',
  'Organizando información',
] as const;

export type SmartQuestion = {
  id: string;
  title: string;
  subtitle?: string;
  options: string[];
  multi: boolean;
  field: keyof CommercialProfile | 'indicadores';
};

export const SMART_QUESTIONS: SmartQuestion[] = [
  {
    id: 'cargos-busca',
    title: '¿Qué cargos buscas?',
    subtitle: 'Selecciona todos los que te interesen.',
    options: ['Ejecutivo Comercial', 'KAM', 'Gerente Comercial', 'Director Comercial', 'Gerente General'],
    multi: true,
    field: 'rol',
  },
  {
    id: 'roles-desempenados',
    title: '¿Qué roles has desempeñado?',
    subtitle: 'Puedes seleccionar varios.',
    options: [
      'Hunter',
      'Farmer',
      'Desarrollo de negocios',
      'Licitaciones',
      'Canales',
      'Trade Marketing',
      'Customer Success',
      'Preventa',
      'Postventa',
    ],
    multi: true,
    field: 'funcionPrincipal',
  },
  {
    id: 'como-vendes',
    title: '¿Qué tipo de venta has realizado?',
    subtitle: 'Selecciona todas las que apliquen.',
    options: ['Venta consultiva', 'Venta técnica', 'Venta de proyectos', 'Venta transaccional', 'Venta relacional'],
    multi: true,
    field: 'tipoVenta',
  },
  {
    id: 'tipo-clientes',
    title: '¿Qué tipo de clientes manejaste?',
    options: ['B2B', 'Gobierno', 'Retail', 'Distribuidores', 'B2C', 'Mayoristas'],
    multi: true,
    field: 'tipoCliente',
  },
  {
    id: 'interlocutores',
    title: '¿Con qué tipo de interlocutores negociaste?',
    options: ['CEO', 'Gerente General', 'Presidencia', 'Compras', 'Operaciones', 'Producción', 'RRHH', 'Finanzas'],
    multi: true,
    field: 'nivelInterlocutor',
  },
  {
    id: 'crm',
    title: '¿Qué CRM has utilizado?',
    options: ['Dynamics', 'Salesforce', 'Hubspot', 'Zoho', 'Pipedrive', 'SAP CRM', 'Otro'],
    multi: true,
    field: 'crmVentas',
  },
  {
    id: 'erp',
    title: '¿Qué ERP has utilizado?',
    options: ['SAP', 'Oracle', 'Odoo', 'Siigo', 'Siesa', 'Softland'],
    multi: true,
    field: 'herramientas',
  },
  {
    id: 'industrias',
    title: '¿En qué industrias has vendido?',
    subtitle: 'Puedes escoger todas.',
    options: [
      'Industrial',
      'Tecnología',
      'SaaS',
      'Construcción',
      'Manufactura',
      'Salud',
      'Energía',
      'Logística',
      'Educación',
      'Agro',
      'Retail',
      'Farmacéutica',
      'Químicos',
      'Consumo Masivo',
      'Servicios',
      'Telecomunicaciones',
      'Automotriz',
      'Minería',
    ],
    multi: true,
    field: 'industrias',
  },
  {
    id: 'industria-principal',
    title: '¿Cuál es tu industria principal?',
    options: [
      'Industrial',
      'Tecnología',
      'SaaS',
      'Construcción',
      'Manufactura',
      'Salud',
      'Energía',
      'Logística',
      'Educación',
      'Agro',
      'Retail',
      'Farmacéutica',
      'Químicos',
      'Consumo Masivo',
      'Servicios',
      'Telecomunicaciones',
      'Automotriz',
      'Minería',
    ],
    multi: false,
    field: 'industriaPrincipal',
  },
  {
    id: 'herramientas',
    title: '¿Qué herramientas utilizas?',
    options: ['Excel', 'Power BI', 'Tableau', 'Looker', 'PowerPoint', 'Google Sheets', 'Notion'],
    multi: true,
    field: 'herramientas',
  },
  {
    id: 'metodologias',
    title: '¿Qué metodologías comerciales utilizas?',
    options: ['SPIN', 'Challenger', 'MEDDIC', 'BANT', 'Sandler', 'Solution Selling'],
    multi: true,
    field: 'naturaleza',
  },
  {
    id: 'indicadores',
    title: '¿Qué indicadores manejas?',
    options: ['Forecast', 'Pipeline', 'Conversión', 'Margen', 'Rentabilidad', 'Ticket promedio', 'Retención', 'Cross Selling', 'Upselling'],
    multi: true,
    field: 'indicadores',
  },
  {
    id: 'cobertura',
    title: '¿Qué cobertura has manejado?',
    options: ['Local', 'Regional', 'Nacional', 'LATAM', 'Internacional'],
    multi: true,
    field: 'coberturaGeografica',
  },
  {
    id: 'modalidad-trabajo',
    title: '¿Qué modalidad de trabajo prefieres?',
    subtitle: 'Selecciona todas las que aceptarías.',
    options: ['Presencial', 'Híbrido', 'Remoto'],
    multi: true,
    field: 'modalidadTrabajo',
  },
  {
    id: 'viajar-trabajo',
    title: '¿Puedes viajar por trabajo?',
    subtitle: 'Viajes ocasionales o frecuentes por la empresa.',
    options: ['Sí', 'No', 'Ocasionalmente'],
    multi: false,
    field: 'disponibilidadViajar',
  },
  {
    id: 'reubicacion',
    title: '¿Estarías dispuesto a cambiar de ciudad?',
    subtitle: 'Por una oportunidad laboral.',
    options: ['Sí', 'No', 'A evaluar'],
    multi: false,
    field: 'disponibilidadReubicacion',
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
