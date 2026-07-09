'use client';

import { PortalOnboardingProgressRing } from './PortalOnboardingProgressRing';

type Props = {
  firstName?: string;
  title: string;
  subtitle: string;
  percent: number;
  eyebrow?: string;
  showGreeting?: boolean;
};

export function PortalOnboardingStepHero({
  firstName,
  title,
  subtitle,
  percent,
  eyebrow,
  showGreeting = false,
}: Props) {
  return (
    <div className="ob-step-hero">
      {showGreeting && firstName ? (
        <p className="ob-step-hero__greeting">
          ¡Hola, {firstName}! <span aria-hidden>👋</span>
        </p>
      ) : null}
      {eyebrow ? <p className="ob-step-hero__eyebrow">{eyebrow}</p> : null}
      <div className="ob-step-hero__row">
        <div className="ob-step-hero__text">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <PortalOnboardingProgressRing percent={percent} />
      </div>
    </div>
  );
}
