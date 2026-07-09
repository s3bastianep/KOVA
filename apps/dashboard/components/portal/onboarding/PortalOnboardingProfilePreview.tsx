'use client';

import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import {
  estimatedCompatibility,
  estimatedVacancies,
  profileExperienceYears,
  profileHeadlineRole,
  profilePreviewTags,
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
  const displayName = profile.nombre?.trim() || firstName || 'Tu perfil';
  const role = profileHeadlineRole(profile);
  const years = profileExperienceYears(profile);
  const tags = profilePreviewTags(profile, prefAnswers);
  const compatibility = estimatedCompatibility(profile, percent, prefAnswers);
  const vacancies = estimatedVacancies(profile, percent, prefAnswers);

  return (
    <aside className="portal-onboarding-preview" aria-label="Vista previa de tu perfil">
      <div className="portal-onboarding-preview__card">
        <div className="portal-onboarding-preview__avatar" aria-hidden>
          {initials(displayName)}
        </div>

        <h3 className="portal-onboarding-preview__name">{displayName}</h3>
        <p className="portal-onboarding-preview__role">{role}</p>

        {tags.length > 0 ? (
          <div className="portal-onboarding-preview__tags">
            {tags.map((tag) => (
              <span key={tag} className="portal-onboarding-preview__tag">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {years ? <p className="portal-onboarding-preview__years">{years}</p> : null}

        <div className="portal-onboarding-preview__meter">
          <div className="portal-onboarding-preview__meter-head">
            <span>Perfil</span>
            <strong>{percent}%</strong>
          </div>
          <div className="portal-onboarding-progress portal-onboarding-progress--preview" aria-hidden>
            <span style={{ width: `${percent}%` }} />
          </div>
        </div>

        <dl className="portal-onboarding-preview__stats">
          <div>
            <dt>Compatibilidad</dt>
            <dd>{compatibility}%</dd>
          </div>
          <div>
            <dt>Vacantes potenciales</dt>
            <dd>{vacancies}</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}
