'use client';

import { formatFirstName } from '@/lib/portal-onboarding-unified';
import { PortalOnboardingProgressRing } from './PortalOnboardingProgressRing';

type Props = {
  firstName?: string;
  title: string;
  subtitle: string;
  percent: number;
  eyebrow?: string;
  showGreeting?: boolean;
  hideRing?: boolean;
};

export function PortalOnboardingStepHero({
  firstName,
  title,
  subtitle,
  percent,
  eyebrow,
  showGreeting = false,
  hideRing = false,
}: Props) {
  return (
    <div className="ob-step-hero">
      {showGreeting && firstName ? (
        <p className="ob-step-hero__eyebrow">{formatFirstName(firstName)}</p>
      ) : null}
      {eyebrow ? <p className="ob-step-hero__eyebrow">{eyebrow}</p> : null}
      <div className={`ob-step-hero__row${hideRing ? ' ob-step-hero__row--compact' : ''}`}>
        <div className="ob-step-hero__text">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {!hideRing ? <PortalOnboardingProgressRing percent={percent} /> : null}
      </div>
    </div>
  );
}
