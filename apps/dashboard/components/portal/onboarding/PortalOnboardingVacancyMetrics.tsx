'use client';

import type { PortalVacancyMatchStats } from '@/lib/portal-vacancies';

type Props = {
  stats: PortalVacancyMatchStats | null;
  loading?: boolean;
  className?: string;
  variant?: 'default' | 'strip';
};

export function PortalOnboardingVacancyMetrics({
  stats,
  loading,
  className,
  variant = 'default',
}: Props) {
  if (loading) {
    return (
      <div
        className={`ob-vacancy-metrics ob-vacancy-metrics--loading${variant === 'strip' ? ' ob-vacancy-metrics--strip' : ''}${className ? ` ${className}` : ''}`}
      >
        <span>Calculando compatibilidad…</span>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  if (stats.totalOpen === 0) {
    return (
      <div
        className={`ob-vacancy-metrics ob-vacancy-metrics--empty${variant === 'strip' ? ' ob-vacancy-metrics--strip' : ''}${className ? ` ${className}` : ''}`}
      >
        <span>Sin vacantes abiertas</span>
      </div>
    );
  }

  const compatLabel = variant === 'strip' ? 'Compatibilidad inicial' : 'Compatibilidad';
  const vacLabel = variant === 'strip' ? 'Vacantes para ti' : 'Vacantes alineadas';

  return (
    <div
      className={`ob-vacancy-metrics${variant === 'strip' ? ' ob-vacancy-metrics--strip' : ''}${className ? ` ${className}` : ''}`}
    >
      <div>
        <strong>{stats.averageCompatibility}%</strong>
        <span>{compatLabel}</span>
      </div>
      <span className="ob-vacancy-metrics__divider" aria-hidden />
      <div>
        <strong>{stats.recommendedCount}</strong>
        <span>{vacLabel}</span>
      </div>
    </div>
  );
}
