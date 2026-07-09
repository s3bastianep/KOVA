'use client';

import { ONBOARDING_JOURNEY_STEPS, type OnboardingJourneyId } from '@/lib/portal-onboarding-unified';

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
              <span className="ob-stepper__dot" aria-hidden />
              <span className="ob-stepper__label">{step.label}</span>
              {isActive ? <span className="ob-stepper__status">En progreso</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function journeyIdForIndex(index: number): OnboardingJourneyId {
  return ONBOARDING_JOURNEY_STEPS[index]?.id ?? 'info';
}
