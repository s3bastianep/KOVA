'use client';

import { ArrowRight, CheckCircle2, Loader2, Target } from 'lucide-react';
import type { PortalVacancyMatchStats } from '@/lib/portal-vacancies';
import { PortalOnboardingChrome } from './PortalOnboardingChrome';
import { PortalOnboardingStepHero } from './PortalOnboardingStepHero';
import { PortalOnboardingVacancyMetrics } from './PortalOnboardingVacancyMetrics';

type Props = {
  percent: number;
  vacancyStats: PortalVacancyMatchStats | null;
  vacancyStatsLoading?: boolean;
  busy?: boolean;
  onEnter: () => void;
};

export function PortalOnboardingComplete({
  percent,
  vacancyStats,
  vacancyStatsLoading,
  busy,
  onEnter,
}: Props) {
  return (
    <PortalOnboardingChrome journeyIndex={4} minutesLeft={0} percent={percent} narrow>
      <div className="ob-complete">
        <PortalOnboardingStepHero
          eyebrow="Perfil activo"
          title="Perfil completado"
          subtitle="Tu trayectoria está posicionada para oportunidades comerciales de alto nivel."
        />

        <div className="ob-complete__status" aria-hidden>
          <CheckCircle2 className="h-5 w-5" />
          <span>Listo para matching</span>
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
          />
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
