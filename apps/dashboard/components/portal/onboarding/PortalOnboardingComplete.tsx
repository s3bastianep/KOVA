'use client';

import { ArrowRight, Building2, Loader2, Sparkles, Target } from 'lucide-react';
import {
  estimatedCompatibility,
  estimatedVacancies,
  profileLevel,
} from '@/lib/portal-onboarding-unified';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';

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
    <div className="portal-onboarding portal-onboarding--immersive">
      <div className="portal-onboarding-complete">
        <div className="portal-onboarding-complete__hero">
          <span className="portal-onboarding-complete__icon" aria-hidden>
            <Sparkles className="h-7 w-7" />
          </span>
          <h1>Tu perfil ya está listo.</h1>
          <p>Hemos encontrado oportunidades que encajan con tu trayectoria.</p>
        </div>

        <div className="portal-onboarding-complete__grid">
          <div className="portal-onboarding-complete__stat">
            <span className="portal-onboarding-complete__stat-label">Nivel del perfil</span>
            <strong>{level}%</strong>
          </div>
          <div className="portal-onboarding-complete__stat">
            <span className="portal-onboarding-complete__stat-label">Compatibilidad inicial</span>
            <strong>{compatibility}%</strong>
          </div>
          <div className="portal-onboarding-complete__stat">
            <span className="portal-onboarding-complete__stat-label">
              <Target className="h-3.5 w-3.5" aria-hidden />
              Vacantes compatibles
            </span>
            <strong>{vacancies}</strong>
          </div>
          <div className="portal-onboarding-complete__stat">
            <span className="portal-onboarding-complete__stat-label">
              <Building2 className="h-3.5 w-3.5" aria-hidden />
              Empresas interesadas
            </span>
            <strong>{companies}</strong>
          </div>
        </div>

        <button
          type="button"
          className="portal-onboarding-btn portal-onboarding-btn--primary portal-onboarding-complete__cta"
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
    </div>
  );
}
