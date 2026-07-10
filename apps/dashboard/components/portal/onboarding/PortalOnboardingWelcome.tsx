'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, BellRing, Clock, Loader2, ShieldCheck } from 'lucide-react';
import { formatFirstName } from '@/lib/portal-onboarding-unified';
import { PortalOnboardingChrome } from './PortalOnboardingChrome';

const WELCOME_BENEFITS = [
  { icon: Clock, label: 'Unos 4 minutos' },
  { icon: BellRing, label: 'Te avisamos del match' },
  { icon: ShieldCheck, label: 'Tus datos, seguros' },
] as const;

const BOOT_MESSAGES = [
  'Preparando tu espacio de perfil…',
  'Configurando tu experiencia…',
  'Casi listo…',
] as const;

type Props = {
  firstName: string;
  minutesLeft: number;
  onStart: () => void;
  onSaveExit?: () => void;
};

export function PortalOnboardingWelcome({ firstName, minutesLeft, onStart, onSaveExit }: Props) {
  const [bootIndex, setBootIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (bootIndex >= BOOT_MESSAGES.length - 1) {
      const done = setTimeout(() => setReady(true), 300);
      return () => clearTimeout(done);
    }
    const timer = setTimeout(() => setBootIndex((i) => i + 1), 380);
    return () => clearTimeout(timer);
  }, [bootIndex]);

  const handleStart = () => {
    setStarting(true);
    window.setTimeout(() => onStart(), 500);
  };

  return (
    <PortalOnboardingChrome
      journeyIndex={0}
      minutesLeft={minutesLeft}
      percent={0}
      onSaveExit={onSaveExit}
      narrow
      hideHeaderProgress
    >
      <div className={`ob-welcome${ready ? ' ob-welcome--ready' : ''}${starting ? ' ob-welcome--starting' : ''}`}>
        {!ready || starting ? (
          <div className="ob-welcome__boot" aria-live="polite">
            <span className="ob-welcome__boot-ring" aria-hidden>
              <Loader2 className="h-6 w-6 animate-spin" />
            </span>
            <p className="ob-welcome__boot-text">
              {starting ? 'Iniciando construcción de tu perfil…' : BOOT_MESSAGES[bootIndex]}
            </p>
          </div>
        ) : (
          <>
            <header className="ob-welcome__intro">
              <h1>Hola, {formatFirstName(firstName)}</h1>
              <p className="ob-welcome__lead">
                Construye tu perfil una sola vez y te avisamos apenas se abra una
                vacante hecha para ti. Sin volver a buscar.
              </p>
            </header>

            <div className="ob-welcome__cta-wrap">
              <button
                type="button"
                className="portal-onboarding-btn portal-onboarding-btn--primary ob-welcome__cta"
                onClick={handleStart}
              >
                Empezar
                <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
            </div>

            <ul className="ob-welcome__benefits">
              {WELCOME_BENEFITS.map(({ icon: Icon, label }) => (
                <li key={label} className="ob-welcome__benefit">
                  <span className="ob-welcome__benefit-icon" aria-hidden>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </PortalOnboardingChrome>
  );
}
