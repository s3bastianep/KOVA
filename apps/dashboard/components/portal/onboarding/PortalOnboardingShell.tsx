'use client';

import { useState, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { PortalOnboardingStepper } from './PortalOnboardingStepper';
import { PortalOnboardingGuide } from './PortalOnboardingGuide';
import { PortalOnboardingExitConfirm } from './PortalOnboardingExitConfirm';

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
  centered?: boolean;
  narrow?: boolean;
  hideGuide?: boolean;
  guideMessage?: string;
};

export function PortalOnboardingShell({
  journeyIndex,
  motivation,
  saveStatus,
  onSaveExit,
  children,
  footer,
  wide,
  preview,
  hidePreview,
  centered = true,
  narrow,
  hideGuide,
  guideMessage,
}: Props) {
  const [confirmingExit, setConfirmingExit] = useState(false);

  return (
    <div
      className={`portal-onboarding portal-onboarding--fullscreen portal-onboarding--v2 portal-onboarding--immersive${wide ? ' portal-onboarding--wide' : ''}${centered ? ' portal-onboarding--centered' : ''}${narrow ? ' portal-onboarding--narrow' : ''}`}
    >
      <div className="portal-onboarding-viewport">
        <header className="ob-chrome">
          <div className="ob-chrome__top">
            <div className="ob-logo" aria-label="Kova">
              <span className="ob-logo__mark" aria-hidden />
              <span className="ob-logo__text">Kova</span>
            </div>
            {onSaveExit ? (
              <button type="button" className="ob-chrome__exit" onClick={() => setConfirmingExit(true)}>
                Salir
              </button>
            ) : null}
          </div>
          <PortalOnboardingStepper activeIndex={journeyIndex} />
          {!hideGuide ? (
            <PortalOnboardingGuide journeyIndex={journeyIndex} message={guideMessage} />
          ) : null}
        </header>

        <main className="portal-onboarding-main portal-onboarding-main--immersive">
          {!hidePreview && preview}
          {motivation ? <p className="portal-onboarding-motivation">{motivation}</p> : null}
          <div className="portal-onboarding-stage">{children}</div>
          {saveStatus === 'error' ? (
            <p className="portal-onboarding-save-state portal-onboarding-save-state--toast" role="alert">
              Error al guardar. Reintentaremos en segundo plano.
            </p>
          ) : null}
        </main>

        {footer ? <div className="portal-onboarding-bottom">{footer}</div> : null}
      </div>

      {confirmingExit ? (
        <PortalOnboardingExitConfirm onCancel={() => setConfirmingExit(false)} onConfirm={() => onSaveExit?.()} />
      ) : null}
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
          {saveStatus === 'error' ? 'Error al guardar' : null}
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
      {onSaveExit ? (
        <button type="button" className="portal-onboarding-footer__save-exit" onClick={onSaveExit}>
          Guardar y salir
        </button>
      ) : null}
    </footer>
  );
}
