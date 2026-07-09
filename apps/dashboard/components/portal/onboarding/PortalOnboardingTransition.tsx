'use client';

import { useEffect } from 'react';
import { Check } from 'lucide-react';
import type { StepTransition } from '@/lib/portal-onboarding-unified';

type Props = {
  transition: StepTransition;
  onDone: () => void;
  durationMs?: number;
};

export function PortalOnboardingTransition({ transition, onDone, durationMs = 2000 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDone, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, onDone]);

  return (
    <div className="portal-onboarding-transition" role="status" aria-live="polite">
      <div className="portal-onboarding-transition__card">
        <span className="portal-onboarding-transition__check" aria-hidden>
          <Check className="h-6 w-6" />
        </span>
        <h2>{transition.headline}</h2>
        {transition.detail ? <p>{transition.detail}</p> : null}
        {transition.deltaVacancies ? (
          <p className="portal-onboarding-transition__delta">
            Encontramos <strong>{transition.deltaVacancies}</strong> vacantes compatibles.{' '}
            <span>(+{transition.deltaVacancies})</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
