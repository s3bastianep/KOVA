import type { CommercialProfile } from './candidate-commercial-profile';
import { competencyDefsForProfile } from './portal-onboarding-evidence';
import {
  getActiveSteps,
  isPreferenciasComplete,
  type PreferenciasBlock,
} from './portal-preferencias-wizard';
import type { OnboardingStep } from './portal-onboarding';

export const ONBOARDING_JOURNEY_STEPS = [
  { id: 'info', label: 'Tu información' },
  { id: 'experiencia', label: 'Tu experiencia' },
  { id: 'comercial', label: 'Perfil comercial' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'listo', label: 'Perfil activo' },
] as const;

export type OnboardingJourneyId = (typeof ONBOARDING_JOURNEY_STEPS)[number]['id'];

export function onboardingJourneyIndex(step: OnboardingStep): number {
  const s = normalizeOnboardingStep(step);
  if (s === 'welcome' || s === 'cv_upload' || s === 'cv_analyzing' || s === 'cv_summary') return 0;
  if (s === 'review_hub' || s === 'cv_review') return 1;
  if (s === 'preferencias' || s === 'evidence') return 2;
  if (s === 'competencies') return 3;
  if (s === 'complete') return 4;
  return 0;
}

export function formatFirstName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'Profesional';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export function journeyEncouragement(percent: number): string | null {
  if (percent >= 75) return 'Casi completo';
  if (percent >= 40) return 'Avance sólido';
  if (percent >= 10) return 'En curso';
  return null;
}

export const ONBOARDING_MACRO_LABELS = [
  'Bienvenida',
  'Hoja de vida',
  'Análisis',
  'Revisión',
  'Qué buscas',
  'Tu experiencia',
  'Preferencias',
  'Tus logros',
  'Competencias',
  'Perfil listo',
] as const;

export type ReviewSectionId =
  | 'personal'
  | 'experiencia'
  | 'educacion'
  | 'idiomas'
  | 'certificaciones'
  | 'skills';

export const REVIEW_SECTIONS: {
  id: ReviewSectionId;
  label: string;
  required: boolean;
}[] = [
  { id: 'personal', label: 'Información personal', required: true },
  { id: 'experiencia', label: 'Experiencia laboral', required: true },
  { id: 'educacion', label: 'Formación académica', required: false },
  { id: 'idiomas', label: 'Idiomas', required: false },
  { id: 'certificaciones', label: 'Certificaciones', required: false },
  { id: 'skills', label: 'Habilidades', required: false },
];

export function normalizeOnboardingStep(step?: OnboardingStep | null): OnboardingStep {
  if (!step || step === 'done') return step ?? 'welcome';
  if (step === 'bridge' || step === 'questions') return 'preferencias';
  return step;
}

export function macroStepIndex(step: OnboardingStep): number {
  const s = normalizeOnboardingStep(step);
  switch (s) {
    case 'welcome':
      return 0;
    case 'cv_upload':
      return 1;
    case 'cv_analyzing':
      return 2;
    case 'cv_summary':
    case 'review_hub':
    case 'cv_review':
      return 3;
    case 'preferencias':
      return 4;
    case 'evidence':
      return 7;
    case 'competencies':
      return 8;
    case 'complete':
      return 9;
    default:
      return 0;
  }
}

export function preferenciasBlockForIndex(
  profile: CommercialProfile,
  stepIndex: number,
): PreferenciasBlock {
  const steps = getActiveSteps(profile);
  const block = steps[stepIndex]?.block ?? 'buscas';
  if (block === 'vendes') return 'vendes';
  if (block === 'cierras') return 'cierras';
  return 'buscas';
}

export function unifiedProgressPercent(
  step: OnboardingStep,
  profile: CommercialProfile,
  prefStepIndex: number,
  prefAnswers: Record<string, string[]>,
  evidencePhase?: string,
  competencyIndex = 0,
): number {
  const s = normalizeOnboardingStep(step);
  const macro = macroStepIndex(s);
  const macroBase = (macro / (ONBOARDING_MACRO_LABELS.length - 1)) * 62;

  if (s === 'preferencias') {
    const steps = getActiveSteps(profile);
    const prefPct = steps.length ? ((prefStepIndex + 1) / steps.length) * 18 : 0;
    return Math.min(94, Math.round(macroBase + prefPct));
  }
  if (s === 'evidence') {
    const phases = ['titulo', 'contexto', 'cifra', 'tags'];
    const idx = evidencePhase ? phases.indexOf(evidencePhase) : 0;
    return Math.min(96, Math.round(macroBase + ((idx + 1) / phases.length) * 8));
  }
  if (s === 'competencies') {
    const total = competencyDefsForProfile(profile).length || 1;
    return Math.min(98, Math.round(macroBase + ((competencyIndex + 1) / total) * 8));
  }
  if (s === 'complete') return 100;

  const stepWeights: Partial<Record<OnboardingStep, number>> = {
    welcome: 4,
    cv_upload: 10,
    cv_analyzing: 16,
    cv_summary: 22,
    review_hub: 28,
    cv_review: 34,
  };
  return stepWeights[s] ?? Math.round(macroBase);
}

export function estimatedMinutesLeft(
  step: OnboardingStep,
  profile: CommercialProfile,
  prefStepIndex: number,
  competencyIndex = 0,
): number {
  const s = normalizeOnboardingStep(step);
  if (s === 'complete') return 0;
  if (s === 'welcome') return 5;
  if (s === 'cv_upload' || s === 'cv_analyzing') return 4;
  if (s === 'cv_summary' || s === 'review_hub' || s === 'cv_review') return 3;
  if (s === 'preferencias') {
    const remaining = Math.max(0, getActiveSteps(profile).length - prefStepIndex - 1);
    return Math.max(1, Math.ceil(remaining * 0.25)) + 2;
  }
  if (s === 'evidence') return 2;
  if (s === 'competencies') {
    const remaining = Math.max(0, competencyDefsForProfile(profile).length - competencyIndex - 1);
    return Math.max(1, Math.ceil(remaining * 0.3));
  }
  return 2;
}

export const PROFILE_BUILD_MILESTONES = [
  { id: 'experiencia', label: 'Tu experiencia' },
  { id: 'trayectoria', label: 'Tu trayectoria' },
  { id: 'estilo', label: 'Tu estilo comercial' },
  { id: 'fortalezas', label: 'Tus fortalezas' },
  { id: 'listo', label: 'Tu perfil listo' },
] as const;

export type ProfileMilestoneId = (typeof PROFILE_BUILD_MILESTONES)[number]['id'];

export function milestoneStatus(
  id: ProfileMilestoneId,
  step: OnboardingStep,
  percent: number,
): 'locked' | 'active' | 'done' {
  const order: ProfileMilestoneId[] = ['experiencia', 'trayectoria', 'estilo', 'fortalezas', 'listo'];
  const thresholds: Record<ProfileMilestoneId, number> = {
    experiencia: 20,
    trayectoria: 38,
    estilo: 62,
    fortalezas: 85,
    listo: 100,
  };

  if (percent >= thresholds[id] || (step === 'complete' && id === 'listo')) return 'done';

  const stepToMilestone: Partial<Record<OnboardingStep, ProfileMilestoneId>> = {
    welcome: 'experiencia',
    cv_upload: 'experiencia',
    cv_analyzing: 'experiencia',
    cv_summary: 'experiencia',
    review_hub: 'trayectoria',
    cv_review: 'trayectoria',
    preferencias: 'estilo',
    evidence: 'fortalezas',
    competencies: 'fortalezas',
    complete: 'listo',
  };

  const current = stepToMilestone[normalizeOnboardingStep(step)] ?? 'experiencia';
  if (id === current) return 'active';

  const currentIdx = order.indexOf(current);
  const idIdx = order.indexOf(id);
  if (idIdx < currentIdx) return 'done';
  return 'locked';
}

export function estimatedCompatibility(
  profile: CommercialProfile,
  percent: number,
  prefAnswers: Record<string, string[]>,
): number {
  const base = Math.min(45, Math.round(percent * 0.55));
  let bonus = 0;
  if ((profile.historialLaboral?.length ?? 0) > 0) bonus += 12;
  if ((profile.herramientas?.length ?? 0) > 0) bonus += 6;
  if (profile.rol?.trim()) bonus += 8;
  if (profile.enfoque?.trim()) bonus += 5;
  if (isPreferenciasComplete(prefAnswers, profile)) bonus += 14;
  if ((profile.logros ?? []).some((l) => l.titulo?.trim())) bonus += 6;
  return Math.min(96, base + bonus);
}

export function estimatedVacancies(
  profile: CommercialProfile,
  percent: number,
  prefAnswers: Record<string, string[]>,
): number {
  const compat = estimatedCompatibility(profile, percent, prefAnswers);
  const base = Math.max(4, Math.round((compat / 100) * 28));
  const industryBonus = (prefAnswers['industrias']?.length ?? 0) * 2;
  const roleBonus = (prefAnswers['areas-interes']?.length ?? profile.rol ? 1 : 0) * 3;
  return Math.min(42, base + industryBonus + roleBonus);
}

export function profileLevel(
  profile: CommercialProfile,
  percent: number,
  prefAnswers: Record<string, string[]>,
): number {
  return Math.min(98, Math.round((percent * 0.4 + estimatedCompatibility(profile, percent, prefAnswers) * 0.6)));
}

export function profileHeadlineRole(profile: CommercialProfile): string {
  const latest = profile.historialLaboral?.[0];
  if (profile.rol?.trim()) return profile.rol.trim();
  if (latest?.cargo?.trim()) return latest.cargo.trim();
  return 'Perfil comercial';
}

export function profileExperienceYears(profile: CommercialProfile): string | null {
  const items = profile.historialLaboral ?? [];
  if (!items.length) return null;
  let totalMonths = 0;
  for (const item of items) {
    const start = item.fechaInicio ? new Date(item.fechaInicio).getTime() : NaN;
    const end = item.fechaFin ? new Date(item.fechaFin).getTime() : Date.now();
    if (!Number.isNaN(start) && !Number.isNaN(end) && end > start) {
      totalMonths += Math.round((end - start) / (1000 * 60 * 60 * 24 * 30));
    }
  }
  if (totalMonths < 6) return null;
  const years = Math.max(1, Math.round(totalMonths / 12));
  return `${years} año${years === 1 ? '' : 's'}`;
}

export function profilePreviewTags(
  profile: CommercialProfile,
  prefAnswers: Record<string, string[]>,
): string[] {
  const tags: string[] = [];
  const push = (v?: string | null) => {
    const t = v?.trim();
    if (t && !tags.includes(t)) tags.push(t);
  };
  push(profile.enfoque);
  push(profile.tipoVenta);
  const industries = prefAnswers['industrias'] ?? [];
  for (const ind of industries.slice(0, 2)) push(ind);
  if (!industries.length && profile.industriaPrincipal?.trim()) push(profile.industriaPrincipal);
  if (!industries.length && (profile.industrias?.length ?? 0) > 0) push(profile.industrias![0]);
  const tools = profile.herramientas ?? [];
  for (const tool of tools.slice(0, 2)) push(tool);
  return tags.slice(0, 5);
}

export type StepTransition = {
  headline: string;
  detail?: string;
  deltaVacancies?: number;
};

export function transitionAfterStep(
  from: OnboardingStep,
  profile: CommercialProfile,
  dataCount?: number,
): StepTransition | null {
  switch (from) {
    case 'cv_analyzing':
      return {
        headline: 'Experiencia agregada',
        detail: dataCount ? `+${dataCount} datos encontrados` : 'Tu trayectoria ya está organizada',
        deltaVacancies: 5,
      };
    case 'review_hub':
      return {
        headline: 'Trayectoria confirmada',
        detail: 'Continuemos con tu perfil comercial.',
        deltaVacancies: 3,
      };
    case 'preferencias':
      return {
        headline: 'Preferencias registradas',
        detail: 'Esto optimiza la compatibilidad con vacantes.',
        deltaVacancies: 8,
      };
    case 'evidence':
      return {
        headline: 'Logros documentados',
        detail: 'Tu perfil gana credibilidad ante empresas.',
        deltaVacancies: 4,
      };
  }
  return null;
}

export function microFeedbackForPrefStep(stepId: string, selected: string[]): string | null {
  if (!selected.length) return null;
  const map: Record<string, string> = {
    'areas-interes': 'Rol comercial identificado.',
    industrias: 'Industrias objetivo registradas.',
    'tipo-venta': 'Estilo comercial documentado.',
    salario: 'Expectativa salarial registrada.',
    viajar: 'Disponibilidad de viaje anotada.',
    reubicacion: 'Preferencia de ubicación registrada.',
    disponibilidad: 'Disponibilidad confirmada.',
    idiomas: 'Idiomas agregados al perfil.',
    'sabes-vender': 'Expertise comercial documentada.',
    enfoque: 'Enfoque Hunter/Farmer registrado.',
    'tamano-equipo': 'Experiencia de liderazgo registrada.',
    'herramientas-crm': 'Stack comercial documentado.',
  };
  return map[stepId] ?? 'Información registrada.';
}

export function motivationalMessage(percent: number): string | null {
  if (percent >= 85) return 'Perfil casi completo. Listo para matching con empresas.';
  if (percent >= 55) return 'Compatibilidad con vacantes en aumento.';
  if (percent >= 25) return 'Cada sección fortalece tu posicionamiento.';
  return null;
}

export function reviewSectionSummary(
  id: ReviewSectionId,
  profile: CommercialProfile,
): string {
  switch (id) {
    case 'personal': {
      const parts = [profile.nombre, profile.email, profile.telefono, profile.ciudad].filter(Boolean);
      return parts.length ? parts.slice(0, 2).join(' · ') : 'Completa tus datos de contacto';
    }
    case 'experiencia': {
      const items = profile.historialLaboral ?? [];
      if (!items.length) return 'Sin experiencia detectada';
      const preview = items
        .slice(0, 2)
        .map((item) => {
          const empresa = item.empresa?.trim();
          const cargo = item.cargo?.trim();
          if (empresa && cargo) return `${cargo} en ${empresa}`;
          return empresa || cargo || '';
        })
        .filter(Boolean)
        .join(' · ');
      return preview || `${items.length} empleo${items.length === 1 ? '' : 's'} encontrado${items.length === 1 ? '' : 's'}`;
    }
    case 'educacion': {
      const items = profile.formacion ?? [];
      if (!items.length) return 'Sin estudios detectados';
      const preview = items
        .slice(0, 2)
        .map((item) => item.titulo?.trim() || item.institucion?.trim())
        .filter(Boolean)
        .join(' · ');
      return preview || `${items.length} estudio${items.length === 1 ? '' : 's'}`;
    }
    case 'idiomas': {
      const items = profile.idiomas ?? [];
      if (!items.length) return 'Sin idiomas detectados';
      const preview = items
        .map((item) => (item.nivel?.trim() ? `${item.idioma} (${item.nivel})` : item.idioma))
        .filter(Boolean)
        .slice(0, 3)
        .join(' · ');
      return preview || `${items.length} idioma${items.length === 1 ? '' : 's'}`;
    }
    case 'certificaciones': {
      const items = profile.certificaciones ?? [];
      if (!items.length) return 'Sin certificaciones. Puedes agregarlas al editar.';
      const preview = items
        .map((item) => item.nombre?.trim())
        .filter(Boolean)
        .slice(0, 2)
        .join(' · ');
      return preview || `${items.length} certificación${items.length === 1 ? '' : 'es'}`;
    }
    case 'skills': {
      const items = profile.herramientas ?? [];
      if (!items.length) return 'Sin habilidades listadas. Puedes agregarlas al editar.';
      return items.slice(0, 4).join(' · ');
    }
    default:
      return '';
  }
}

export function isReviewSectionReady(id: ReviewSectionId, profile: CommercialProfile): boolean {
  switch (id) {
    case 'personal':
      return Boolean(profile.nombre?.trim() && profile.email?.trim() && profile.telefono?.trim());
    case 'experiencia':
      return (profile.historialLaboral?.length ?? 0) > 0;
    case 'educacion':
      return (profile.formacion?.length ?? 0) > 0;
    case 'idiomas':
      return (profile.idiomas?.length ?? 0) > 0;
    case 'certificaciones':
      return (profile.certificaciones?.length ?? 0) > 0;
    case 'skills':
      return (profile.herramientas?.length ?? 0) > 0;
    default:
      return false;
  }
}

export function canContinueFromReviewHub(
  reviewed: Set<ReviewSectionId>,
  profile: CommercialProfile,
): boolean {
  const required = REVIEW_SECTIONS.filter((s) => s.required);
  const requiredReviewed = required.every((s) => reviewed.has(s.id));
  const hasPersonal = isReviewSectionReady('personal', profile);
  const hasExperience = isReviewSectionReady('experiencia', profile);
  return requiredReviewed && hasPersonal && (hasExperience || reviewed.has('experiencia'));
}

export function profileCompletenessScore(
  profile: CommercialProfile,
  prefAnswers: Record<string, string[]>,
): number {
  let score = 0;
  if (profile.nombre?.trim()) score += 8;
  if (profile.email?.trim()) score += 5;
  if (profile.telefono?.trim()) score += 5;
  if ((profile.historialLaboral?.length ?? 0) > 0) score += 18;
  if ((profile.formacion?.length ?? 0) > 0) score += 10;
  if ((profile.idiomas?.length ?? 0) > 0) score += 8;
  if ((profile.herramientas?.length ?? 0) > 0) score += 5;
  if (isPreferenciasComplete(prefAnswers, profile)) score += 28;
  else if (Object.keys(prefAnswers).some((k) => (prefAnswers[k]?.length ?? 0) > 0)) score += 10;
  if ((profile.logros ?? []).some((l) => l.titulo?.trim() && l.cifra?.trim())) score += 8;
  if (Object.keys(profile.competencias ?? {}).length >= 3) score += 8;
  return Math.min(98, score);
}
