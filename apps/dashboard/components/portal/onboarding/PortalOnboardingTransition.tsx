'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import type { StepTransition } from '@/lib/portal-onboarding-unified';

type Props = {
  transition: StepTransition;
  onDone: () => void;
  durationMs?: number;
};

export function PortalOnboardingTransition({ transition, onDone, durationMs = 2200 }: Props) {
  const [phase, setPhase] = useState<'loading' | 'done'>('loading');

  useEffect(() => {
    const reveal = setTimeout(() => setPhase('done'), 650);
    const finish = setTimeout(onDone, durationMs);
    return () => {
      clearTimeout(reveal);
      clearTimeout(finish);
    };
  }, [durationMs, onDone]);

  return (
    <div className="portal-onboarding-transition" role="status" aria-live="polite">
      <div className={`portal-onboarding-transition__card${phase === 'done' ? ' is-revealed' : ''}`}>
        {phase === 'loading' ? (
          <>
            <span className="portal-onboarding-transition__loader" aria-hidden>
              <Loader2 className="h-7 w-7 animate-spin" />
            </span>
            <p className="portal-onboarding-transition__loading">Actualizando tu perfil…</p>
          </>
        ) : (
          <>
            <span className="portal-onboarding-transition__check" aria-hidden>
              <Check className="h-6 w-6" />
            </span>
            <h2>{transition.headline}</h2>
            {transition.detail ? <p>{transition.detail}</p> : null}
          </>
        )}
      </div>
    </div>
  );
}
