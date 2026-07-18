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
  0: 'Sube tu CV y lo organizamos por ti.',
  1: 'Revisa que los datos estén bien. Tú confirmas.',
  2: 'Unas preferencias cortas para avisarte de vacantes que te encajan.',
  3: 'Listo. Activa tu perfil y empieza a recibir matches.',
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
      return 'Vamos a crear tu perfil comercial. Te acompaño paso a paso.';
    case 'cv_upload':
      return 'Sube tu hoja de vida. Extraemos la información automáticamente.';
    case 'cv_analyzing':
      return 'Estoy organizando tu experiencia. Un momento…';
    case 'review_hub':
    case 'cv_review':
      return 'Abre cada sección y revisa los datos. Solo así se marca como revisado.';
    case 'preferencias':
      if (prefBlock === 'vendes') return 'Cómo vendes: esto define tu compatibilidad con cada vacante.';
      if (prefBlock === 'cierras') return 'Tus condiciones: salario, viaje y disponibilidad.';
      return 'Qué buscas: así sabemos a qué vacantes avisarte.';
    case 'cv_summary':
      return 'Así quedó tu perfil. Si todo está bien, actívalo.';
    case 'complete':
      return 'Perfil activo. Ya puedes ver vacantes y matches.';
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
