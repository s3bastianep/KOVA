export type EvidenceCard = {
  id: string;
  historialId?: string;
  titulo: string;
  contexto: string;
  cifra: string;
  competencias: string[];
};

export type EducationEntry = {
  id: string;
  nivel: string;
  titulo: string;
  institucion: string;
  anioGraduacion?: string;
};

export type LanguageEntry = {
  id: string;
  idioma: string;
  nivel: string;
};

export type CertificationEntry = {
  id: string;
  nombre: string;
  entidad: string;
  fecha?: string;
};

export type WorkHistoryEntry = {
  id: string;
  cargo: string;
  empresa: string;
  sector: string;
  fechaInicio: string;
  fechaFin?: string;
  trabajoActual: boolean;
  descripcion: string;
  tamanoEquipo?: string;
  volumenOperacion?: string;
};

export type CompetencyEntry = {
  score: number;
  evidenceId?: string;
  ejemplo?: string;
  hasBacking?: boolean;
};

export type CompetencyDef = {
  key: string;
  label: string;
};

export const ROLE_LEVEL_OPTIONS = [
  'Ejecutivo comercial',
  'Coordinador',
  'Jefe o Gerente',
  'Director',
  'Gerente General comercial',
] as const;

export const ROLE_FUNCTION_OPTIONS = [
  'Ventas nuevas (hunter)',
  'Cuentas existentes (farmer)',
  'Mixto',
  'Liderazgo de equipo sin venta directa',
] as const;

export const AVAILABILITY_OPTIONS = ['Inmediata', 'Con aviso'] as const;
export const TRAVEL_OPTIONS = ['Sí', 'No', 'Ocasionalmente'] as const;
export const RELOCATION_OPTIONS = ['Sí', 'No', 'A evaluar'] as const;

export const EDUCATION_LEVEL_OPTIONS = [
  'Bachillerato',
  'Técnico',
  'Tecnólogo',
  'Profesional',
  'Especialización',
  'Maestría',
  'Doctorado',
] as const;

export const LANGUAGE_LEVEL_OPTIONS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Nativo'] as const;

export const LANGUAGE_OPTIONS = [
  'Español',
  'Inglés',
  'Mandarín',
  'Hindi',
  'Portugués',
  'Bengalí',
  'Ruso',
  'Japonés',
  'Francés',
  'Alemán',
  'Coreano',
  'Italiano',
  'Vietnamita',
  'Turco',
  'Árabe',
  'Persa',
  'Urdu',
  'Indonesio',
  'Tailandés',
  'Neerlandés',
  'Otro',
] as const;

export const SALARY_EXPECTATION_OPTIONS = [
  'Menos de $5 millones COP / mes',
  '$5 a $10 millones COP / mes',
  '$10 a $15 millones COP / mes',
  '$15 a $25 millones COP / mes',
  '$25 a $40 millones COP / mes',
  'Más de $40 millones COP / mes',
  'Prefiero no indicar por ahora',
] as const;

export const CONTRACT_TYPE_OPTIONS = [
  'Indefinido',
  'Término fijo',
  'Prestación de servicios',
  'Freelance / por proyecto',
  'Indiferente',
] as const;

export const PROFESSIONAL_OBJECTIVE_OPTIONS = [
  'Seguir creciendo en mi rol actual',
  'Dar el salto a un rol de mayor liderazgo',
  'Cambiar de industria',
  'Volver a rol individual contributor',
  'Buscar mayor estabilidad',
  'Buscar mayor variable / comisión',
] as const;

export const EVIDENCE_COMPETENCY_TAGS = [
  'Pensamiento estratégico',
  'Orientación al logro',
  'Liderazgo',
  'Prospección',
  'Venta consultiva',
  'Cierre y negociación',
  'Gestión de KPIs',
  'Desarrollo de cuentas',
  'Manejo de objeciones',
] as const;

export const INDIVIDUAL_COMPETENCIES: CompetencyDef[] = [
  { key: 'venta_consultiva', label: 'Venta consultiva' },
  { key: 'prospeccion', label: 'Prospección' },
  { key: 'objeciones', label: 'Manejo de objeciones' },
  { key: 'cierre_negociacion', label: 'Cierre y negociación' },
  { key: 'logro_orient', label: 'Orientación al logro' },
];

export const LEADERSHIP_COMPETENCIES: CompetencyDef[] = [
  { key: 'liderazgo_equipos', label: 'Liderazgo y desarrollo de equipos' },
  { key: 'pensamiento_estrategico', label: 'Pensamiento estratégico / planeación comercial' },
  { key: 'gestion_kpis', label: 'Gestión de KPIs y toma de decisiones con datos' },
  { key: 'negociacion_clevel', label: 'Negociación con tomadores de decisión (C-level)' },
  {
    key: 'cuentas_estrategicas',
    label: 'Desarrollo de cuentas estratégicas / apertura de mercado',
  },
  { key: 'logro_orient', label: 'Orientación al logro' },
];

const LEADERSHIP_LEVELS = new Set<string>([
  'Coordinador',
  'Jefe o Gerente',
  'Director',
  'Gerente General comercial',
]);

export function isLeadershipRoleLevel(nivelRol?: string): boolean {
  return Boolean(nivelRol && LEADERSHIP_LEVELS.has(nivelRol));
}

export function getCompetenciesForRole(nivelRol?: string): CompetencyDef[] {
  return isLeadershipRoleLevel(nivelRol) ? LEADERSHIP_COMPETENCIES : INDIVIDUAL_COMPETENCIES;
}

export function newCertificationEntry(): CertificationEntry {
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cert-${Date.now()}`,
    nombre: '',
    entidad: '',
  };
}

export function newEducationEntry(): EducationEntry {
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `edu-${Date.now()}`,
    nivel: '',
    titulo: '',
    institucion: '',
  };
}

export function newLanguageEntry(): LanguageEntry {
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `lang-${Date.now()}`,
    idioma: '',
    nivel: '',
  };
}

export function isEducationComplete(entry: EducationEntry): boolean {
  return Boolean(entry.nivel.trim() && entry.titulo.trim() && entry.institucion.trim());
}

export function isLanguageComplete(entry: LanguageEntry): boolean {
  return Boolean(entry.idioma.trim() && entry.nivel.trim());
}

export function isCertificationComplete(entry: CertificationEntry): boolean {
  return Boolean(entry.nombre.trim() && entry.entidad.trim());
}

/** Drops certification rows left blank (added via "+ Agregar certificación" but never filled in) before persisting. */
export function stripIncompleteCertifications<T extends { certificaciones?: CertificationEntry[] }>(
  profile: T,
): T {
  if (!profile.certificaciones?.length) return profile;
  const complete = profile.certificaciones.filter(isCertificationComplete);
  if (complete.length === profile.certificaciones.length) return profile;
  return { ...profile, certificaciones: complete };
}

/** Drops language rows left blank (added via "+ Agregar idioma" but never filled in) before persisting. */
export function stripIncompleteLanguages<T extends { idiomas?: LanguageEntry[] }>(profile: T): T {
  if (!profile.idiomas?.length) return profile;
  const complete = profile.idiomas.filter(isLanguageComplete);
  if (complete.length === profile.idiomas.length) return profile;
  return { ...profile, idiomas: complete };
}

export function calculateProfileCompleteness(profile: {
  nombre?: string;
  email?: string;
  telefono?: string;
  ciudad?: string;
  consentimientoDatos?: boolean;
  nivelRol?: string;
  objetivoProfesional?: string;
  historialLaboral?: WorkHistoryEntry[];
  formacion?: EducationEntry[];
  idiomas?: LanguageEntry[];
  expectativaSalarial?: string;
  tipoVenta?: string;
  industrias?: string[];
}): number {
  // "logros" (self-reported achievements) and "competencias" (self-rating) were removed from
  // the active onboarding flow — there's no screen left where a candidate can fill them in. They
  // used to count toward this score, which meant 100% was mathematically unreachable for every
  // candidate and permanently tripped the "finish your profile" redirect on /portal.
  const checks = [
    Boolean(profile.nombre?.trim() && profile.email?.trim() && profile.telefono?.trim()),
    Boolean(profile.consentimientoDatos),
    Boolean(profile.nivelRol && profile.objetivoProfesional),
    (profile.historialLaboral ?? []).some(isWorkHistoryComplete),
    (profile.formacion ?? []).some(isEducationComplete),
    (profile.idiomas ?? []).some(isLanguageComplete),
    Boolean(profile.expectativaSalarial),
    Boolean(profile.tipoVenta),
    (profile.industrias?.length ?? 0) > 0,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

export function newEvidenceCard(): EvidenceCard {
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ev-${Date.now()}`,
    titulo: '',
    contexto: '',
    cifra: '',
    competencias: [],
  };
}

export function newWorkHistoryEntry(): WorkHistoryEntry {
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `wh-${Date.now()}`,
    cargo: '',
    empresa: '',
    sector: '',
    fechaInicio: '',
    trabajoActual: false,
    descripcion: '',
  };
}

export function isWorkHistoryComplete(entry: WorkHistoryEntry): boolean {
  // `sector` is intentionally not required here: nothing extracts it from a CV, and no screen in
  // the onboarding flow lets a candidate set it either — requiring it meant isWorkHistoryComplete
  // (and therefore calculateProfileCompleteness / nextIncompleteOnboardingStep) could never be
  // satisfied by any candidate, trapping every completed profile in an infinite "finish your
  // profile" redirect back to review_hub.
  return Boolean(
    entry.cargo.trim() &&
      entry.empresa.trim() &&
      entry.fechaInicio.trim() &&
      entry.descripcion.trim() &&
      (entry.trabajoActual || entry.fechaFin?.trim()),
  );
}

export function isEvidenceCardComplete(card: EvidenceCard): boolean {
  return Boolean(
    card.titulo.trim() && card.contexto.trim() && card.cifra.trim() && card.competencias.length > 0,
  );
}

export function competencyHasBacking(
  entry: CompetencyEntry | undefined,
  logros: EvidenceCard[] = [],
): boolean {
  if (!entry) return false;
  if (entry.ejemplo?.trim()) return true;
  if (entry.evidenceId && logros.some((l) => l.id === entry.evidenceId && isEvidenceCardComplete(l))) {
    return true;
  }
  return false;
}

export function effectiveCompetencyScore(score: number, hasBacking: boolean): number {
  if (hasBacking) return score;
  return Math.round(score * 0.88);
}

export const HIGH_SCORE_THRESHOLD = 85;
