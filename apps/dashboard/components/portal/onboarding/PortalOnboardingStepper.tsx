'use client';

import { ONBOARDING_JOURNEY_STEPS } from '@/lib/portal-onboarding-unified';

type Props = {
  activeIndex: number;
};

export function PortalOnboardingStepper({ activeIndex }: Props) {
  const total = ONBOARDING_JOURNEY_STEPS.length;
  const clampedIndex = Math.max(0, Math.min(activeIndex, total - 1));
  const current = ONBOARDING_JOURNEY_STEPS[clampedIndex];

  return (
    <div
      className="ob-stepper"
      role="progressbar"
      aria-valuenow={clampedIndex + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Paso ${clampedIndex + 1} de ${total}: ${current?.label ?? ''}`}
    >
      <div className="ob-stepper__meta">
        <span className="ob-stepper__count">
          Paso {clampedIndex + 1} de {total}
        </span>
        <span className="ob-stepper__label">{current?.label}</span>
      </div>
      <div className="ob-stepper__track">
        {ONBOARDING_JOURNEY_STEPS.map((stepItem, i) => (
          <span
            key={stepItem.id}
            className={`ob-stepper__seg${i < clampedIndex ? ' is-done' : ''}${
              i === clampedIndex ? ' is-active' : ''
            }`}
          >
            <span className="ob-stepper__seg-fill" />
          </span>
        ))}
      </div>
    </div>
  );
}
