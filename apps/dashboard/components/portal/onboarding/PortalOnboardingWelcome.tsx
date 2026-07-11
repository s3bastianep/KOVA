'use client';

import { ArrowRight, BellRing, Clock, ShieldCheck } from 'lucide-react';
import { formatFirstName } from '@/lib/portal-onboarding-unified';
import { PortalOnboardingChrome } from './PortalOnboardingChrome';

const WELCOME_BENEFITS = [
  { icon: Clock, label: 'Unos 4 minutos' },
  { icon: BellRing, label: 'Te avisamos del match' },
  { icon: ShieldCheck, label: 'Tus datos, seguros' },
] as const;

type Props = {
  firstName: string;
  minutesLeft: number;
  onStart: () => void;
  onSaveExit?: () => void;
};

export function PortalOnboardingWelcome({ firstName, minutesLeft, onStart, onSaveExit }: Props) {
  return (
    <PortalOnboardingChrome
      journeyIndex={0}
      minutesLeft={minutesLeft}
      percent={0}
      onSaveExit={onSaveExit}
      narrow
      hideHeaderProgress
    >
      <div className="ob-welcome ob-welcome--ready">
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
            onClick={onStart}
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
      </div>
    </PortalOnboardingChrome>
  );
}
