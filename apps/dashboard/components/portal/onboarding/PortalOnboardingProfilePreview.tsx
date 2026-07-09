'use client';

import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import { formatPersonName, profileHeadlineRole } from '@/lib/portal-onboarding-unified';
import type { PortalVacancyMatchStats } from '@/lib/portal-vacancies';
import { PortalOnboardingVacancyMetrics } from './PortalOnboardingVacancyMetrics';

type Props = {
  profile: CommercialProfile;
  vacancyStats: PortalVacancyMatchStats | null;
  vacancyStatsLoading?: boolean;
  firstName?: string;
};

function initials(name?: string | null): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function PortalOnboardingProfilePreview({
  profile,
  vacancyStats,
  vacancyStatsLoading,
  firstName,
}: Props) {
  const displayName = formatPersonName(profile.nombre?.trim() || firstName || 'Tu perfil');
  const role = profileHeadlineRole(profile);

  return (
    <div className="portal-onboarding-preview-strip" aria-label="Vista previa de tu perfil">
      <div className="portal-onboarding-preview-strip__identity">
        <span className="portal-onboarding-preview-strip__avatar" aria-hidden>
          {initials(displayName)}
        </span>
        <div className="portal-onboarding-preview-strip__who">
          <span className="portal-onboarding-preview-strip__name">{displayName}</span>
          <span className="portal-onboarding-preview-strip__role">{role}</span>
        </div>
      </div>
      <PortalOnboardingVacancyMetrics
        stats={vacancyStats}
        loading={vacancyStatsLoading}
        className="portal-onboarding-preview-strip__metrics"
      />
    </div>
  );
}
