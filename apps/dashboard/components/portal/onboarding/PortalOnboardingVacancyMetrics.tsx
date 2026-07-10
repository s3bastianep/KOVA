'use client';

import type { PortalVacancyMatchStats } from '@/lib/portal-vacancies';

/** Below this average match, we hide the number instead of showing a discouraging low score. */
const MIN_COMPATIBILITY_TO_SHOW = 70;

type Props = {
  stats: PortalVacancyMatchStats | null;
  loading?: boolean;
  className?: string;
  variant?: 'default' | 'strip';
  hasSkills?: boolean;
  onAddSkills?: () => void;
};

export function PortalOnboardingVacancyMetrics({
  stats,
  loading,
  className,
  variant = 'default',
  hasSkills = true,
  onAddSkills,
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

  if (!hasSkills) {
    const nudgeClassName = `ob-vacancy-metrics ob-vacancy-metrics--nudge${variant === 'strip' ? ' ob-vacancy-metrics--strip' : ''}${className ? ` ${className}` : ''}`;
    return onAddSkills ? (
      <button type="button" className={`${nudgeClassName} ob-vacancy-metrics--nudge-action`} onClick={onAddSkills}>
        <span>Agrega tus habilidades para ver tu compatibilidad con vacantes</span>
      </button>
    ) : (
      <div className={nudgeClassName}>
        <span>Agrega tus habilidades para ver tu compatibilidad con vacantes</span>
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

  if (stats.averageCompatibility <= MIN_COMPATIBILITY_TO_SHOW) {
    return null;
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
