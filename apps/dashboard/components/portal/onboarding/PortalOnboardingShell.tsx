'use client';

import type { ReactNode } from 'react';
import { ArrowRight, Clock3 } from 'lucide-react';
import { PortalOnboardingStepper } from './PortalOnboardingStepper';

type Props = {
  percent: number;
  minutesLeft: number;
  journeyIndex: number;
  motivation?: string | null;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  onSaveExit?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
  preview?: ReactNode;
  hidePreview?: boolean;
};

export function PortalOnboardingShell({
  percent,
  minutesLeft,
  journeyIndex,
  motivation,
  saveStatus,
  onSaveExit,
  children,
  footer,
  wide,
  preview,
  hidePreview,
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
        </header>

        <main className="portal-onboarding-main">
          {!hidePreview && preview}
          {motivation ? <p className="portal-onboarding-motivation">{motivation}</p> : null}
          <div className="portal-onboarding-stage portal-onboarding-card-enter">{children}</div>
          {saveStatus && saveStatus !== 'idle' ? (
            <p className="portal-onboarding-save-state" aria-live="polite">
              {saveStatus === 'saving' ? 'Guardando...' : null}
              {saveStatus === 'saved' ? '✓ Guardado automáticamente' : null}
              {saveStatus === 'error' ? 'Error al guardar' : null}
            </p>
          ) : null}
        </main>

        {footer ? <div className="portal-onboarding-bottom">{footer}</div> : null}
      </div>
    </div>
  );
}

export function PortalOnboardingFooter({
  onBack,
  onContinue,
  onSaveExit,
  continueLabel = 'Continuar',
  backLabel = 'Anterior',
  continueDisabled,
  busy,
  hint,
  primaryOnly,
}: {
  onBack?: () => void;
  onContinue: () => void;
  onSaveExit?: () => void;
  continueLabel?: string;
  backLabel?: string;
  continueDisabled?: boolean;
  busy?: boolean;
  hint?: string;
  primaryOnly?: boolean;
}) {
  return (
    <footer className={`portal-onboarding-footer${primaryOnly ? ' portal-onboarding-footer--primary-only' : ''}`}>
      {hint ? <p className="portal-onboarding-footer__hint">{hint}</p> : null}
      <div className="portal-onboarding-question-actions">
        {!primaryOnly && onBack ? (
          <button type="button" className="portal-onboarding-btn portal-onboarding-btn--back" onClick={onBack}>
            {backLabel}
          </button>
        ) : null}
        <button
          type="button"
          className="portal-onboarding-btn portal-onboarding-btn--primary portal-onboarding-btn--continue"
          disabled={continueDisabled || busy}
          onClick={onContinue}
        >
          {busy ? 'Guardando...' : continueLabel}
          {!busy ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
        </button>
      </div>
      <p className="portal-onboarding-footer__later">Puedes terminar después. Retomamos donde quedaste.</p>
      {onSaveExit ? (
        <button type="button" className="portal-onboarding-footer__save-exit" onClick={onSaveExit}>
          Guardar y salir
        </button>
      ) : null}
    </footer>
  );
}
