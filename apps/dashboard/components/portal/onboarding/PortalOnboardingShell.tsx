'use client';

import type { ReactNode } from 'react';
import { ArrowRight, Clock3 } from 'lucide-react';
import { PortalOnboardingStepper } from './PortalOnboardingStepper';
import { PortalOnboardingProgressIndicator } from './PortalOnboardingProgressIndicator';

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
  hideHeaderProgress?: boolean;
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
  hideHeaderProgress,
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
          {!hideHeaderProgress ? (
            <PortalOnboardingProgressIndicator percent={percent} compact />
          ) : null}
        </header>

        <main className="portal-onboarding-main">
          {!hidePreview && preview}
          {motivation ? <p className="portal-onboarding-motivation">{motivation}</p> : null}
          <div className="portal-onboarding-stage">{children}</div>
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
  backLabel = 'Atrás',
  continueDisabled,
  busy,
  hint,
  primaryOnly,
  saveStatus,
  layout = 'default',
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
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  layout?: 'default' | 'bar';
}) {
  if (layout === 'bar') {
    return (
      <footer className="portal-onboarding-footer portal-onboarding-footer--bar">
        {onBack ? (
          <button type="button" className="portal-onboarding-btn portal-onboarding-btn--back" onClick={onBack}>
            <ArrowRight className="h-4 w-4 rotate-180" aria-hidden />
            {backLabel}
          </button>
        ) : (
          <span />
        )}
        <p className="portal-onboarding-footer__save" aria-live="polite">
          {saveStatus === 'saving' ? 'Guardando…' : null}
          {saveStatus === 'saved' ? '✓ Guardado automáticamente' : null}
          {saveStatus === 'error' ? 'Error al guardar' : null}
          {!saveStatus || saveStatus === 'idle' ? 'Progreso guardado' : null}
        </p>
        <button
          type="button"
          className="portal-onboarding-btn portal-onboarding-btn--primary portal-onboarding-btn--continue"
          disabled={continueDisabled || busy}
          onClick={onContinue}
        >
          {busy ? 'Guardando...' : continueLabel}
          {!busy ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
        </button>
      </footer>
    );
  }

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
      <p className="portal-onboarding-footer__later">Progreso guardado automáticamente. Puedes retomar en cualquier momento.</p>
      {onSaveExit ? (
        <button type="button" className="portal-onboarding-footer__save-exit" onClick={onSaveExit}>
          Guardar y salir
        </button>
      ) : null}
    </footer>
  );
}
