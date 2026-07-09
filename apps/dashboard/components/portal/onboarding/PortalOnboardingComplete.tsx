'use client';

import { ArrowRight, Building2, Loader2, Sparkles, Target } from 'lucide-react';
import {
  estimatedCompatibility,
  estimatedVacancies,
  profileLevel,
} from '@/lib/portal-onboarding-unified';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import { PortalOnboardingChrome } from './PortalOnboardingChrome';
import { PortalOnboardingStepHero } from './PortalOnboardingStepHero';

type Props = {
  profile: CommercialProfile;
  percent: number;
  prefAnswers: Record<string, string[]>;
  busy?: boolean;
  onEnter: () => void;
};

export function PortalOnboardingComplete({
  profile,
  percent,
  prefAnswers,
  busy,
  onEnter,
}: Props) {
  const level = profileLevel(profile, percent, prefAnswers);
  const compatibility = estimatedCompatibility(profile, percent, prefAnswers);
  const vacancies = estimatedVacancies(profile, percent, prefAnswers);
  const companies = Math.max(6, Math.round(vacancies * 0.55));

  return (
    <PortalOnboardingChrome journeyIndex={4} minutesLeft={0}>
      <div className="ob-complete">
        <PortalOnboardingStepHero
          eyebrow="¡Perfil listo!"
          title="Tu perfil ya está listo."
          subtitle="Hemos encontrado oportunidades que encajan con tu trayectoria."
          percent={percent}
        />

        <div className="ob-complete__hero-icon" aria-hidden>
          <Sparkles className="h-7 w-7" />
        </div>

        <div className="ob-stat-grid ob-complete__grid">
          <div className="ob-stat-chip ob-stat-chip--purple">
            <span className="ob-stat-chip__icon">
              <Sparkles className="h-4 w-4" />
            </span>
            <strong>{level}%</strong>
            <span>Nivel del perfil</span>
          </div>
          <div className="ob-stat-chip ob-stat-chip--green">
            <span className="ob-stat-chip__icon">
              <Target className="h-4 w-4" />
            </span>
            <strong>{compatibility}%</strong>
            <span>Compatibilidad inicial</span>
          </div>
          <div className="ob-stat-chip ob-stat-chip--yellow">
            <span className="ob-stat-chip__icon">
              <Target className="h-4 w-4" />
            </span>
            <strong>{vacancies}</strong>
            <span>Vacantes compatibles</span>
          </div>
          <div className="ob-stat-chip ob-stat-chip--teal">
            <span className="ob-stat-chip__icon">
              <Building2 className="h-4 w-4" />
            </span>
            <strong>{companies}</strong>
            <span>Empresas interesadas</span>
          </div>
        </div>

        <button
          type="button"
          className="portal-onboarding-btn portal-onboarding-btn--primary ob-complete__cta"
          disabled={busy}
          onClick={onEnter}
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Entrando...
            </>
          ) : (
            <>
              Entrar al portal
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </PortalOnboardingChrome>
  );
}
