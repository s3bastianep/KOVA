'use client';

import type { ReactNode } from 'react';
import { Clock3 } from 'lucide-react';
import { PortalOnboardingStepper } from './PortalOnboardingStepper';
import { PortalOnboardingProgressIndicator } from './PortalOnboardingProgressIndicator';

type Props = {
  journeyIndex: number;
  minutesLeft: number;
  percent?: number;
  onSaveExit?: () => void;
  children: ReactNode;
  wide?: boolean;
};

export function PortalOnboardingChrome({
  journeyIndex,
  minutesLeft,
  percent = 0,
  onSaveExit,
  children,
  wide,
}: Props) {
  return (
    <div className={`portal-onboarding portal-onboarding--fullscreen portal-onboarding--v2${wide ? ' portal-onboarding--wide' : ''}`}>
      <div className="portal-onboarding-viewport">
        <header className="ob-chrome">
          <div className="ob-chrome__top">
            <div className="ob-logo" aria-label="KOVA">
              <span className="ob-logo__mark">K</span>
              <span className="ob-logo__text">OVA</span>
            </div>
            <div className="ob-chrome__actions">
              <span className="ob-chrome__time">
                <Clock3 className="h-3.5 w-3.5" aria-hidden />
                {minutesLeft <= 0 ? 'Listo' : `${minutesLeft} min restantes`}
              </span>
              {onSaveExit ? (
                <button type="button" className="ob-chrome__exit" onClick={onSaveExit}>
                  Salir
                </button>
              ) : null}
            </div>
          </div>
          <PortalOnboardingStepper activeIndex={journeyIndex} />
          <PortalOnboardingProgressIndicator percent={percent} compact />
        </header>
        {children}
      </div>
    </div>
  );
}
