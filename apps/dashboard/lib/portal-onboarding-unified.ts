import type { CommercialProfile } from './candidate-commercial-profile';
import { competencyDefsForProfile } from './portal-onboarding-evidence';
import {
  getActiveSteps,
  isPreferenciasComplete,
  type PreferenciasBlock,
} from './portal-preferencias-wizard';
import type { OnboardingStep } from './portal-onboarding';

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

export function motivationalMessage(percent: number): string | null {
  if (percent >= 85) return '¡Ya casi terminas! Tu perfil está casi listo para matching.';
  if (percent >= 55) return 'Excelente — esta información mejora tus oportunidades.';
  if (percent >= 25) return 'Vamos bien. KOVA construye tu perfil mientras respondes.';
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
      const n = profile.historialLaboral?.length ?? 0;
      return n ? `${n} empleo${n === 1 ? '' : 's'} encontrado${n === 1 ? '' : 's'}` : 'Sin experiencia detectada';
    }
    case 'educacion': {
      const n = profile.formacion?.length ?? 0;
      return n ? `${n} estudio${n === 1 ? '' : 's'}` : 'Sin estudios detectados';
    }
    case 'idiomas': {
      const n = profile.idiomas?.length ?? 0;
      return n ? `${n} idioma${n === 1 ? '' : 's'}` : 'Sin idiomas detectados';
    }
    case 'certificaciones': {
      const n = profile.certificaciones?.length ?? 0;
      return n ? `${n} certificación${n === 1 ? '' : 'es'}` : 'Opcional';
    }
    case 'skills': {
      const n = profile.herramientas?.length ?? 0;
      return n ? `${n} habilidad${n === 1 ? '' : 'es'}` : 'Opcional';
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
