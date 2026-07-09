'use client';

import { formatFirstName } from '@/lib/portal-onboarding-unified';

type Props = {
  firstName?: string;
  title: string;
  subtitle: string;
  eyebrow?: string;
  showGreeting?: boolean;
};

export function PortalOnboardingStepHero({
  firstName,
  title,
  subtitle,
  eyebrow,
  showGreeting = false,
}: Props) {
  return (
    <header className="ob-step-hero">
      {showGreeting && firstName ? (
        <p className="ob-step-hero__eyebrow">{formatFirstName(firstName)}</p>
      ) : null}
      {eyebrow ? <p className="ob-step-hero__eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
