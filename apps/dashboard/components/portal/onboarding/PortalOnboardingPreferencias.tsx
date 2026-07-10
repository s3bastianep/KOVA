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
  onAutoAdvance?: (option: string) => void;
  /** Free-text value typed after checking an "Otra"/"Otro" option, so what the candidate actually
   * sells or does in that "other" case gets captured instead of the bare placeholder word. */
  onCustomOptionText?: (stepId: string, placeholder: string, text: string) => void;
};

const OTHER_OPTION = /^otr[oa]$/i;

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
  onAutoAdvance,
  onCustomOptionText,
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
  // Progress within the current block (not across all ~19 steps) so each block reads as a short,
  // completable chunk instead of one long marathon that starts at "1 / 19".
  const blockSteps = activeSteps.filter((s) => s.block === currentStep.block);
  const blockPosition = blockSteps.findIndex((s) => s.id === currentStep.id) + 1;
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
        eyebrow={blockLabel}
        progress={`${blockPosition} / ${blockSteps.length}`}
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
            style={{
              // Paint the track lime up to the thumb so the control reads as a filled meter
              // instead of a bare native range input.
              ['--salary-fill' as string]: `${
                (salaryIdx / Math.max(1, SALARY_SLIDER_LABELS.length - 1)) * 100
              }%`,
            }}
            aria-label="Aspiración salarial"
            aria-valuetext={SALARY_SLIDER_LABELS[salaryIdx]}
          />
          <div className="portal-onboarding-salary__labels">
            <span>Menor</span>
            <span>Mayor</span>
          </div>
        </div>
      ) : currentStep.kind === 'idiomas-review' ? (
        <div className="portal-onboarding-idiomas-review">
          <ul className="portal-onboarding-idiomas-review__list">
            {(profile.idiomas ?? []).map((lang) => (
              <li key={lang.id}>
                <span className="portal-onboarding-idiomas-review__lang">
                  <span className="portal-onboarding-idiomas-review__icon" aria-hidden>
                    <Languages className="h-4 w-4" />
                  </span>
                  {lang.idioma}
                </span>
                <span className="portal-onboarding-idiomas-review__level">{lang.nivel}</span>
              </li>
            ))}
          </ul>
          <div className="portal-onboarding-idiomas-review__actions">
            {currentStep.options.map((option) => {
              const on = selected.includes(option);
              const isConfirm = option === 'Sí, están correctos';
              return (
                <button
                  key={option}
                  type="button"
                  className={`portal-onboarding-idiomas-review__btn${isConfirm ? ' is-confirm' : ' is-review'}${on ? ' is-selected' : ''}`}
                  onClick={() => {
                    onToggle(currentStep.id, option, false);
                    onAutoAdvance?.(option);
                  }}
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
        <div className="portal-onboarding-chip-list">
          {currentStep.options.map((option) => {
            const isOther = OTHER_OPTION.test(option.trim());
            // "Otra"/"Otro" is stored as "Otra: <lo que escribió>" once the candidate types
            // something, so the answer actually carries what they meant — not just the literal
            // placeholder word, which on its own tells the company nothing.
            const otherEntry = isOther
              ? selected.find((v) => v === option || v.startsWith(`${option}: `))
              : undefined;
            const on = isOther ? Boolean(otherEntry) : selected.includes(option);
            const otherText = otherEntry?.startsWith(`${option}: `)
              ? otherEntry.slice(option.length + 2)
              : '';

            return (
              <div key={option} className="portal-onboarding-chip-row-wrap">
                <button
                  type="button"
                  className={`portal-onboarding-chip-row${on ? ' portal-onboarding-chip-row--on' : ''}`}
                  onClick={() => onToggle(currentStep.id, otherEntry ?? option, currentStep.multi)}
                >
                  <span className="portal-onboarding-chip-row__label">{option}</span>
                  <span className="portal-onboarding-chip-row__box" aria-hidden>
                    {on ? <Check className="w-3 h-3" strokeWidth={3} /> : null}
                  </span>
                </button>
                {isOther && on ? (
                  <input
                    type="text"
                    className="portal-onboarding-chip-row__other-input"
                    placeholder="Escribe cuál"
                    value={otherText}
                    autoFocus={!otherText}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onCustomOptionText?.(currentStep.id, option, e.target.value)}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {microFeedback ? (
        <p className="portal-onboarding-micro-feedback">
          <span className="portal-onboarding-micro-feedback__icon" aria-hidden>
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </span>
          {microFeedback}
        </p>
      ) : null}

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
