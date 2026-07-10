'use client';

import { useEffect, useState } from 'react';
import { ONBOARDING_JOURNEY_STEPS } from '@/lib/portal-onboarding-unified';
import type { OnboardingStep } from '@/lib/portal-onboarding';

/**
 * "Tu guía Kova": a persistent companion presence shown in the onboarding header on every step.
 * It gives the candidate the felt sense of being accompanied and guided — a warm, first-person
 * message that adapts to where they are. The message advances with the actual step (not just the
 * broad journey phase) so it never repeats across several consecutive screens; an explicit
 * `message` prop overrides everything when a caller wants to say something specific.
 */

const PHASE_MESSAGES: Record<number, string> = {
  0: 'Construyamos tu perfil profesional. Te guío en cada paso.',
  1: 'Revisa la información de tu CV. Tú confirmas cada dato.',
  2: 'Definamos tu perfil comercial. Esto determina con qué empresas te conectamos.',
  3: 'Unos detalles más para afinar tu compatibilidad.',
  4: 'Perfil completo. Ya estás visible para las empresas.',
};

/**
 * Per-step message so the guide evolves screen by screen. For preferencias (many sub-steps that
 * all share one journey phase) the message shifts by block — buscas / vendes / cierras — since
 * "cómo vendes" is the real differentiator and deserves its own beat.
 */
export function guideMessageForStep(
  step: OnboardingStep,
  prefBlock?: 'buscas' | 'vendes' | 'cierras',
): string | undefined {
  switch (step) {
    case 'welcome':
      return 'Construyamos tu perfil profesional. Te guío en cada paso.';
    case 'cv_upload':
      return 'Sube tu hoja de vida y yo extraigo tu experiencia. Sin formularios largos.';
    case 'cv_analyzing':
      return 'Estoy organizando tu trayectoria. Dame un momento.';
    case 'review_hub':
    case 'cv_review':
      return 'Revisa lo que leí de tu CV. Tú confirmas cada dato.';
    case 'preferencias':
      if (prefBlock === 'vendes') return 'Lo clave: cómo vendes. Aquí se define tu compatibilidad con cada empresa.';
      if (prefBlock === 'cierras') return 'Cómo cierras y negocias. Esto perfila tu estilo comercial.';
      return 'Cuéntame qué buscas. Con esto sé a qué empresas conectarte.';
    case 'cv_summary':
      return 'Este es tu perfil comercial. Revísalo antes de activarlo.';
    case 'complete':
      return 'Perfil completo. Ya estás visible para las empresas.';
    default:
      return undefined;
  }
}

type Props = {
  journeyIndex: number;
  message?: string;
  variant?: 'bar' | 'hero';
};

export function PortalOnboardingGuide({ journeyIndex, message, variant = 'bar' }: Props) {
  const phase = Math.max(0, Math.min(journeyIndex, ONBOARDING_JOURNEY_STEPS.length - 1));
  const text = message ?? PHASE_MESSAGES[phase] ?? PHASE_MESSAGES[0];

  // Re-trigger the soft fade/slide each time the message changes so the guide feels like it is
  // "speaking" to the candidate at each new step rather than being static chrome.
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [text]);

  return (
    <div className={`ob-guide ob-guide--${variant}`} aria-live="polite">
      <span className="ob-guide__avatar" aria-hidden>
        <span className="ob-guide__pulse" />
        <span className="ob-guide__mark" />
      </span>
      <div className="ob-guide__body">
        <span className="ob-guide__name">Tu guía Kova</span>
        <p key={animKey} className="ob-guide__message">
          {text}
        </p>
      </div>
    </div>
  );
}
