'use client';

import { Check } from 'lucide-react';
import type { CommercialProfile, CompetencyEntry } from '@/lib/candidate-commercial-profile';
import {
  COMPETENCY_LEVEL_OPTIONS,
  competencyDefsForProfile,
  levelIdFromScore,
} from '@/lib/portal-onboarding-evidence';
import { PortalOnboardingStepHero } from './PortalOnboardingStepHero';

type Props = {
  firstName: string;
  percent: number;
  profile: CommercialProfile;
  competencyIndex: number;
  ratings: Record<string, CompetencyEntry>;
  onRate: (key: string, entry: CompetencyEntry) => void;
};

export function PortalOnboardingCompetencies({
  firstName,
  percent,
  profile,
  competencyIndex,
  ratings,
  onRate,
}: Props) {
  const defs = competencyDefsForProfile(profile);
  const current = defs[competencyIndex];
  const logros = profile.logros ?? [];

  if (!current) {
    return null;
  }

  const entry = ratings[current.key];
  const selectedLevel = entry?.score ? levelIdFromScore(entry.score) : null;
  const linkedEvidence = entry?.evidenceId
    ? logros.find((l) => l.id === entry.evidenceId)
    : undefined;

  return (
    <div className="ob-competencies">
      <PortalOnboardingStepHero
        firstName={firstName}
        eyebrow={`Habilidades · ${competencyIndex + 1} de ${defs.length}`}
        title={`¿Qué tan fuerte es tu ${current.label.toLowerCase()}?`}
        subtitle="Una pregunta a la vez, sin formularios. Elige lo que mejor te representa hoy."
        percent={percent}
      />

      <section className="ob-panel ob-question-panel">
      <div className="portal-onboarding-chips portal-onboarding-chips--levels">
        {COMPETENCY_LEVEL_OPTIONS.map((level) => {
          const on = selectedLevel === level.id;
          return (
            <button
              key={level.id}
              type="button"
              className={`portal-onboarding-chip portal-onboarding-chip--level${on ? ' portal-onboarding-chip--on' : ''}`}
              onClick={() =>
                onRate(current.key, {
                  score: level.score,
                  hasBacking: Boolean(entry?.evidenceId || entry?.ejemplo),
                  evidenceId: entry?.evidenceId,
                  ejemplo: entry?.ejemplo,
                })
              }
            >
              {on ? <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} /> : null}
              <span>{level.label}</span>
            </button>
          );
        })}
      </div>

      {logros.length > 0 ? (
        <div className="portal-onboarding-competencies__link">
          <p className="portal-onboarding-question-subtitle">¿Quieres respaldarlo con un logro?</p>
          <div className="portal-onboarding-chips portal-onboarding-chips--inline">
            {logros.slice(0, 3).map((logro) => {
              const on = entry?.evidenceId === logro.id;
              return (
                <button
                  key={logro.id}
                  type="button"
                  className={`portal-onboarding-chip${on ? ' portal-onboarding-chip--on' : ''}`}
                  onClick={() =>
                    onRate(current.key, {
                      score: entry?.score ?? 62,
                      evidenceId: on ? undefined : logro.id,
                      hasBacking: !on,
                      ejemplo: on ? undefined : `${logro.titulo}: ${logro.cifra}`,
                    })
                  }
                >
                  {on ? <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} /> : null}
                  <span>{logro.titulo}</span>
                </button>
              );
            })}
          </div>
          {linkedEvidence ? (
            <p className="portal-onboarding-competencies__linked">
              Vinculado: {linkedEvidence.titulo}
            </p>
          ) : null}
        </div>
      ) : null}
      </section>
    </div>
  );
}

export function canContinueCompetencyStep(
  profile: CommercialProfile,
  competencyIndex: number,
  ratings: Record<string, CompetencyEntry>,
): boolean {
  const defs = competencyDefsForProfile(profile);
  const key = defs[competencyIndex]?.key;
  if (!key) return false;
  return Boolean(ratings[key]?.score && ratings[key].score > 0);
}
