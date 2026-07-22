'use client';

import { formatFirstName } from '@/lib/portal-onboarding-unified';

type Props = {
  firstName?: string;
  title: string;
  subtitle: string;
  eyebrow?: string;
  progress?: string;
  showGreeting?: boolean;
  /** Preferencias FlexJobs-style: centered question rhythm */
  align?: 'start' | 'center';
};

export function PortalOnboardingStepHero({
  firstName,
  title,
  subtitle,
  eyebrow,
  progress,
  showGreeting = false,
  align = 'start',
}: Props) {
  return (
    <header className={`ob-step-hero${align === 'center' ? ' ob-step-hero--center' : ''}`}>
      {eyebrow || progress ? (
        <div className="ob-step-hero__meta">
          {showGreeting && firstName ? (
            <p className="ob-step-hero__eyebrow">{formatFirstName(firstName)}</p>
          ) : eyebrow ? (
            <p className="ob-step-hero__eyebrow">{eyebrow}</p>
          ) : null}
          {progress ? <p className="ob-step-hero__progress">{progress}</p> : null}
        </div>
      ) : null}
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
