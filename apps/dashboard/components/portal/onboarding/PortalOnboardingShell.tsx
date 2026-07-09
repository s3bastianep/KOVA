'use client';

import type { ReactNode } from 'react';
import { Clock3 } from 'lucide-react';

type Props = {
  percent: number;
  minutesLeft: number;
  motivation?: string | null;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  onSaveExit?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
  preview?: ReactNode;
};

export function PortalOnboardingShell({
  percent,
  minutesLeft,
  motivation,
  saveStatus,
  onSaveExit,
  children,
  footer,
  wide,
  preview,
}: Props) {
  return (
    <div className={`portal-onboarding portal-onboarding--fullscreen${wide ? ' portal-onboarding--wide' : ''}`}>
      <div className="portal-onboarding-viewport">
        <header className="portal-onboarding-header">
          <div className="portal-onboarding-header__row">
            <span className="portal-onboarding-header__brand">Perfil</span>
            <div className="portal-onboarding-header__actions">
              <span className="portal-onboarding-header__time">
                <Clock3 className="h-3.5 w-3.5" aria-hidden />
                {minutesLeft <= 0 ? 'Listo' : `${minutesLeft} min`}
              </span>
              {onSaveExit ? (
                <button type="button" className="portal-onboarding-header__exit" onClick={onSaveExit}>
                  Salir
                </button>
              ) : null}
            </div>
          </div>
          <div className="portal-onboarding-header__progress-row">
            <div
              className="portal-onboarding-progress portal-onboarding-progress--header"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${percent}%` }} />
            </div>
            <strong className="portal-onboarding-header__percent">{percent}%</strong>
          </div>
        </header>

        <main className="portal-onboarding-main">
          {preview}
          {motivation ? <p className="portal-onboarding-motivation">{motivation}</p> : null}

          <div className="portal-onboarding-stage portal-onboarding-card-enter">{children}</div>

          {saveStatus && saveStatus !== 'idle' ? (
            <p className="portal-onboarding-save-state" aria-live="polite">
              {saveStatus === 'saving' ? 'Guardando...' : null}
              {saveStatus === 'saved' ? '✓ Guardado' : null}
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
  continueLabel = 'Continuar',
  backLabel = 'Anterior',
  continueDisabled,
  busy,
  hint,
}: {
  onBack?: () => void;
  onContinue: () => void;
  continueLabel?: string;
  backLabel?: string;
  continueDisabled?: boolean;
  busy?: boolean;
  hint?: string;
}) {
  return (
    <footer className="portal-onboarding-footer">
      {hint ? <p className="portal-onboarding-footer__hint">{hint}</p> : null}
      <div className="portal-onboarding-question-actions">
        {onBack ? (
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
        </button>
      </div>
      <p className="portal-onboarding-footer__later">Puedes terminar después. Retomamos donde quedaste.</p>
    </footer>
  );
}
