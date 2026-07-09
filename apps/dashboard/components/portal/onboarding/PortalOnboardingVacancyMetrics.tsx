'use client';

import type { PortalVacancyMatchStats } from '@/lib/portal-vacancies';

type Props = {
  stats: PortalVacancyMatchStats | null;
  loading?: boolean;
  className?: string;
};

export function PortalOnboardingVacancyMetrics({ stats, loading, className }: Props) {
  if (loading) {
    return (
      <div className={`ob-vacancy-metrics ob-vacancy-metrics--loading${className ? ` ${className}` : ''}`}>
        <span>Calculando compatibilidad…</span>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  if (stats.totalOpen === 0) {
    return (
      <div className={`ob-vacancy-metrics ob-vacancy-metrics--empty${className ? ` ${className}` : ''}`}>
        <span>No hay vacantes abiertas en este momento.</span>
      </div>
    );
  }

  return (
    <div className={`ob-vacancy-metrics${className ? ` ${className}` : ''}`}>
      <div>
        <strong>{stats.averageCompatibility}%</strong>
        <span>Compatibilidad</span>
      </div>
      <span className="ob-vacancy-metrics__divider" aria-hidden />
      <div>
        <strong>{stats.recommendedCount}</strong>
        <span>Vacantes alineadas</span>
      </div>
    </div>
  );
}
