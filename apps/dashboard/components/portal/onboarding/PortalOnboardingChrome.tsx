'use client';

import { useState, type ReactNode } from 'react';
import { PortalOnboardingStepper } from './PortalOnboardingStepper';
import { PortalOnboardingExitConfirm } from './PortalOnboardingExitConfirm';

type Props = {
  journeyIndex: number;
  minutesLeft: number;
  percent?: number;
  onSaveExit?: () => void;
  children: ReactNode;
  wide?: boolean;
  centered?: boolean;
  narrow?: boolean;
  hideHeaderProgress?: boolean;
};

export function PortalOnboardingChrome({
  journeyIndex,
  onSaveExit,
  children,
  wide,
  centered = true,
  narrow,
}: Props) {
  const [confirmingExit, setConfirmingExit] = useState(false);

  return (
    <div
      className={`portal-onboarding portal-onboarding--fullscreen portal-onboarding--v2 portal-onboarding--immersive${wide ? ' portal-onboarding--wide' : ''}${centered ? ' portal-onboarding--centered' : ''}${narrow ? ' portal-onboarding--narrow' : ''}`}
    >
      <div className="portal-onboarding-viewport">
        <header className="ob-chrome">
          <div className="ob-chrome__top">
            <div className="ob-logo" aria-label="KOVA">
              <span className="ob-logo__mark">K</span>
              <span className="ob-logo__text">OVA</span>
            </div>
            {onSaveExit ? (
              <button type="button" className="ob-chrome__exit" onClick={() => setConfirmingExit(true)}>
                Salir
              </button>
            ) : null}
          </div>
          <PortalOnboardingStepper activeIndex={journeyIndex} />
        </header>

        <main className="portal-onboarding-main portal-onboarding-main--immersive">
          <div className="portal-onboarding-stage">{children}</div>
        </main>
      </div>

      {confirmingExit ? (
        <PortalOnboardingExitConfirm onCancel={() => setConfirmingExit(false)} onConfirm={() => onSaveExit?.()} />
      ) : null}
    </div>
  );
}
