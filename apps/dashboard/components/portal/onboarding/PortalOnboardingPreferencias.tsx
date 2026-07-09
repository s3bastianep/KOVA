'use client';

import { useMemo } from 'react';
import { Check, Languages, Loader2 } from 'lucide-react';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import {
  PREFERENCIAS_BLOCK_LABELS,
  SALARY_SLIDER_LABELS,
  getActiveSteps,
  type PreferenciasWizardStep,
} from '@/lib/portal-preferencias-wizard';
import { LANGUAGE_LEVEL_OPTIONS } from '@/lib/commercial-profile-builder';
import { microFeedbackForPrefStep } from '@/lib/portal-onboarding-unified';
import { PortalOnboardingStepHero } from './PortalOnboardingStepHero';

type Props = {
  firstName: string;
  percent: number;
  profile: CommercialProfile;
  answers: Record<string, string[]>;
  stepIndex: number;
  salaryIdx: number;
  languageLevels: Record<string, string>;
  onToggle: (stepId: string, option: string, multi: boolean) => void;
  onSalaryChange: (index: number) => void;
  onLanguageLevel: (idioma: string, nivel: string) => void;
  onSkip?: () => void;
};

export function PortalOnboardingPreferencias({
  firstName,
  percent,
  profile,
  answers,
  stepIndex,
  salaryIdx,
  languageLevels,
  onToggle,
  onSalaryChange,
  onLanguageLevel,
  onSkip,
}: Props) {
  const activeSteps = useMemo(() => getActiveSteps(profile), [profile]);
  const currentStep = activeSteps[stepIndex] as PreferenciasWizardStep | undefined;

  if (!currentStep) {
    return (
      <div className="portal-onboarding-pref-empty">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const selected = answers[currentStep.id] ?? [];
  const blockLabel = PREFERENCIAS_BLOCK_LABELS[currentStep.block];
  const microFeedback =
    currentStep.kind === 'slider'
      ? salaryIdx >= 0
        ? microFeedbackForPrefStep(currentStep.id, [SALARY_SLIDER_LABELS[salaryIdx]])
        : null
      : currentStep.kind === 'idiomas-levels'
        ? (answers['idiomas'] ?? []).every((idioma) => languageLevels[idioma]?.trim())
          ? microFeedbackForPrefStep(currentStep.id, answers['idiomas'] ?? [])
          : null
        : microFeedbackForPrefStep(currentStep.id, selected);

  const subtitle =
    currentStep.subtitle ??
    (currentStep.multi ? 'Puedes seleccionar varias opciones.' : 'Elige la opción que mejor te representa.');

  return (
    <div className="ob-pref" key={currentStep.id}>
      <PortalOnboardingStepHero
        firstName={firstName}
        eyebrow={`Perfil comercial · ${blockLabel}`}
        title={currentStep.title}
        subtitle={subtitle}
      />

      <section className="ob-panel ob-question-panel">
      {currentStep.kind === 'slider' ? (
        <div className="portal-onboarding-salary">
          <p className="portal-onboarding-salary__value">{SALARY_SLIDER_LABELS[salaryIdx]}</p>
          <input
            type="range"
            min={0}
            max={SALARY_SLIDER_LABELS.length - 1}
            step={1}
            value={salaryIdx}
            onChange={(e) => onSalaryChange(Number(e.target.value))}
            className="portal-onboarding-salary__slider"
            aria-label="Aspiración salarial"
          />
          <div className="portal-onboarding-salary__labels">
            <span>Menor</span>
            <span>Mayor</span>
          </div>
        </div>
      ) : currentStep.kind === 'idiomas-review' ? (
        <div className="portal-onboarding-idiomas-review">
          <ul>
            {(profile.idiomas ?? []).map((lang) => (
              <li key={lang.id}>
                <span>
                  <Languages className="h-4 w-4" />
                  {lang.idioma}
                </span>
                <span>{lang.nivel}</span>
              </li>
            ))}
          </ul>
          <div className="portal-onboarding-chips portal-onboarding-chips--inline">
            {currentStep.options.map((option) => {
              const on = selected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  className={`portal-onboarding-chip${on ? ' portal-onboarding-chip--on' : ''}`}
                  onClick={() => onToggle(currentStep.id, option, false)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ) : currentStep.kind === 'idiomas-levels' ? (
        <div className="portal-onboarding-idiomas-levels space-y-5">
          {(answers['idiomas']?.length ? answers['idiomas'] : (profile.idiomas ?? []).map((l) => l.idioma)).map(
            (idioma) => (
              <div key={idioma} className="portal-onboarding-idiomas-levels__row">
                <p className="portal-onboarding-idiomas-levels__name">
                  <Languages className="h-4 w-4" />
                  {idioma}
                </p>
                <div className="portal-onboarding-chips portal-onboarding-chips--inline">
                  {LANGUAGE_LEVEL_OPTIONS.map((nivel) => {
                    const on = languageLevels[idioma] === nivel;
                    return (
                      <button
                        key={nivel}
                        type="button"
                        className={`portal-onboarding-chip${on ? ' portal-onboarding-chip--on' : ''}`}
                        onClick={() => onLanguageLevel(idioma, nivel)}
                      >
                        {on ? <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} /> : null}
                        <span>{nivel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="portal-onboarding-chips">
          {currentStep.options.map((option) => {
            const on = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                className={`portal-onboarding-chip${on ? ' portal-onboarding-chip--on' : ''}`}
                onClick={() => onToggle(currentStep.id, option, currentStep.multi)}
              >
                {on ? <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} /> : null}
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      )}

      {microFeedback ? <p className="portal-onboarding-micro-feedback">{microFeedback}</p> : null}

      {currentStep.optional ? (
        <p className="portal-onboarding-optional">
          Opcional:{' '}
          {onSkip ? (
            <button type="button" className="portal-onboarding-link" onClick={onSkip}>
              omitir por ahora
            </button>
          ) : (
            'puedes continuar sin responder'
          )}
        </p>
      ) : null}
      </section>
    </div>
  );
}

export function canContinuePreferenciasStep(
  step: PreferenciasWizardStep | undefined,
  answers: Record<string, string[]>,
  languageLevels: Record<string, string> = {},
): boolean {
  if (!step) return false;
  if (step.optional) return true;
  if (step.kind === 'slider') return Boolean(answers[step.id]?.[0]);
  if (step.kind === 'idiomas-levels') {
    const langs = answers['idiomas']?.length
      ? answers['idiomas']
      : Object.keys(languageLevels);
    return langs.length > 0 && langs.every((idioma) => Boolean(languageLevels[idioma]?.trim()));
  }
  return (answers[step.id]?.length ?? 0) > 0;
}
