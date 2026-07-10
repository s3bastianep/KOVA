'use client';

import { ONBOARDING_JOURNEY_STEPS } from '@/lib/portal-onboarding-unified';

type Props = {
  activeIndex: number;
};

export function PortalOnboardingStepper({ activeIndex }: Props) {
  const total = ONBOARDING_JOURNEY_STEPS.length;
  const filled = Math.min(100, Math.round(((activeIndex + 1) / total) * 100));

  return (
    <div
      className="ob-stepper"
      role="progressbar"
      aria-valuenow={filled}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Paso ${activeIndex + 1} de ${total}`}
    >
      <span className="ob-stepper__fill" style={{ width: `${filled}%` }} />
    </div>
  );
}
