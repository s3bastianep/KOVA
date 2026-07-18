'use client';

import { useEffect, useRef } from 'react';

type Props = {
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
};

export function PortalOnboardingExitConfirm({ onCancel, onConfirm, busy }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    triggerRef.current = document.activeElement;
    cancelRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = cardRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [onCancel]);

  return (
    <div className="ob-exit-confirm" role="alertdialog" aria-modal="true" aria-labelledby="ob-exit-confirm-title" aria-describedby="ob-exit-confirm-body">
      <div className="ob-exit-confirm__backdrop" onClick={onCancel} aria-hidden />
      <div className="ob-exit-confirm__card" ref={cardRef}>
        <h2 id="ob-exit-confirm-title">¿Salir del registro?</h2>
        <p id="ob-exit-confirm-body">
          Guardamos tu progreso. Puedes volver después y continuar donde lo dejaste.
        </p>
        <div className="ob-exit-confirm__actions">
          <button
            type="button"
            ref={cancelRef}
            className="portal-onboarding-btn portal-onboarding-btn--back"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="portal-onboarding-btn portal-onboarding-btn--primary"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Saliendo…' : 'Salir'}
          </button>
        </div>
      </div>
    </div>
  );
}
