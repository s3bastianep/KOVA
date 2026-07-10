'use client';

import { ArrowRight, Loader2, Target } from 'lucide-react';
import type { PortalVacancyMatchStats } from '@/lib/portal-vacancies';
import { PortalOnboardingChrome } from './PortalOnboardingChrome';
import { PortalOnboardingStepHero } from './PortalOnboardingStepHero';
import { PortalOnboardingVacancyMetrics } from './PortalOnboardingVacancyMetrics';

type Props = {
  percent: number;
  vacancyStats: PortalVacancyMatchStats | null;
  vacancyStatsLoading?: boolean;
  hasSkills?: boolean;
  busy?: boolean;
  error?: string;
  onEnter: () => void;
};

export function PortalOnboardingComplete({
  percent,
  vacancyStats,
  vacancyStatsLoading,
  hasSkills = true,
  busy,
  error,
  onEnter,
}: Props) {
  return (
    <PortalOnboardingChrome journeyIndex={4} minutesLeft={0} percent={percent} narrow>
      <div className="ob-complete">
        <PortalOnboardingStepHero
          eyebrow="Perfil activo"
          title="¡Listo! Ya estás en el radar"
          subtitle="Desde ahora, cuando una empresa abra una vacante que encaje contigo, te avisamos. No tienes que estar buscando."
        />

        <div className="ob-complete__status ob-complete__status--live">
          <span className="ob-complete__status-dot" aria-hidden />
          <span>Buscando vacantes para ti en tiempo real</span>
        </div>

        <div className="ob-complete__stats">
          <div className="ob-complete__stat">
            <span className="ob-complete__stat-icon" aria-hidden>
              <Target className="h-4 w-4" />
            </span>
            <div>
              <strong>{percent}%</strong>
              <span>Perfil completado</span>
            </div>
          </div>
          <PortalOnboardingVacancyMetrics
            stats={vacancyStats}
            loading={vacancyStatsLoading}
            className="ob-complete__vacancy-metrics"
            hasSkills={hasSkills}
          />
        </div>

        {error ? (
          <p className="portal-onboarding-error" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          className="portal-onboarding-btn portal-onboarding-btn--primary ob-complete__cta"
          disabled={busy}
          onClick={onEnter}
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Accediendo...
            </>
          ) : (
            <>
              Acceder al portal
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </PortalOnboardingChrome>
  );
}
