'use client';

import { ONBOARDING_JOURNEY_STEPS } from '@/lib/portal-onboarding-unified';

type Props = {
  activeIndex: number;
};

export function PortalOnboardingStepper({ activeIndex }: Props) {
  return (
    <nav className="ob-stepper" aria-label="Progreso del perfil">
      <ol className="ob-stepper__list">
        {ONBOARDING_JOURNEY_STEPS.map((step, index) => {
          const isActive = index === activeIndex;
          const isDone = index < activeIndex;
          return (
            <li
              key={step.id}
              className={`ob-stepper__item${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}`}
            >
              <span className="ob-stepper__marker" aria-hidden>
                {isDone ? '✓' : index + 1}
              </span>
              <span className="ob-stepper__label">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
