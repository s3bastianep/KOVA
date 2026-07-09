'use client';

import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import {
  estimatedCompatibility,
  estimatedVacancies,
  formatPersonName,
  profileHeadlineRole,
} from '@/lib/portal-onboarding-unified';

type Props = {
  profile: CommercialProfile;
  percent: number;
  prefAnswers: Record<string, string[]>;
  firstName?: string;
};

function initials(name?: string | null): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function PortalOnboardingProfilePreview({ profile, percent, prefAnswers, firstName }: Props) {
  const displayName = formatPersonName(profile.nombre?.trim() || firstName || 'Tu perfil');
  const role = profileHeadlineRole(profile);
  const compatibility = estimatedCompatibility(profile, percent, prefAnswers);
  const vacancies = estimatedVacancies(profile, percent, prefAnswers);

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
      <div className="portal-onboarding-preview-strip__stats">
        <div className="portal-onboarding-preview-strip__stat">
          <strong>{compatibility}%</strong>
          <span>Compatibilidad</span>
        </div>
        <div className="portal-onboarding-preview-strip__divider" aria-hidden />
        <div className="portal-onboarding-preview-strip__stat">
          <strong>{vacancies}</strong>
          <span>Vacantes</span>
        </div>
      </div>
    </div>
  );
}
