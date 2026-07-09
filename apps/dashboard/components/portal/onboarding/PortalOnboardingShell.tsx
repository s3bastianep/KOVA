'use client';

import type { ReactNode } from 'react';
import { Clock3 } from 'lucide-react';
import { ONBOARDING_MACRO_LABELS } from '@/lib/portal-onboarding-unified';

type Props = {
  macroIndex: number;
  percent: number;
  minutesLeft: number;
  motivation?: string | null;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  onSaveExit?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
};

export function PortalOnboardingShell({
  macroIndex,
  percent,
  minutesLeft,
  motivation,
  saveStatus,
  onSaveExit,
  children,
  footer,
  wide,
}: Props) {
  const stepLabel = ONBOARDING_MACRO_LABELS[macroIndex] ?? 'Onboarding';
  const macroTotal = ONBOARDING_MACRO_LABELS.length;

  return (
    <div className={`portal-onboarding portal-onboarding--flow${wide ? ' portal-onboarding--wide' : ''}`}>
      <div className="portal-onboarding-topbar">
        <div className="portal-onboarding-topbar__main">
          <div className="portal-onboarding-topbar__meta">
            <span>
              Paso {macroIndex + 1} de {macroTotal}
            </span>
            <span className="portal-onboarding-topbar__label">{stepLabel}</span>
          </div>
          <div className="portal-onboarding-topbar__progress">
            <div
              className="portal-onboarding-progress"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${percent}%` }} />
            </div>
            <div className="portal-onboarding-topbar__stats">
              <strong>{percent}%</strong>
              <span className="portal-onboarding-topbar__time">
                <Clock3 className="h-3.5 w-3.5" aria-hidden />
                {minutesLeft <= 0 ? 'Listo' : `${minutesLeft} min restantes`}
              </span>
            </div>
          </div>
        </div>
        {onSaveExit ? (
          <button type="button" className="portal-onboarding-topbar__exit" onClick={onSaveExit}>
            Guardar y salir
          </button>
        ) : null}
      </div>

      {motivation ? <p className="portal-onboarding-motivation">{motivation}</p> : null}

      <div className="portal-onboarding-shell portal-onboarding-shell--flow">{children}</div>

      {saveStatus && saveStatus !== 'idle' ? (
        <p className="portal-onboarding-save-state portal-onboarding-save-state--centered">
          {saveStatus === 'saving' ? 'Guardando...' : null}
          {saveStatus === 'saved' ? '✓ Guardado automáticamente' : null}
          {saveStatus === 'error' ? 'No pudimos guardar. Reintentaremos al continuar.' : null}
        </p>
      ) : null}

      {footer}
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
        ) : (
          <span />
        )}
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
