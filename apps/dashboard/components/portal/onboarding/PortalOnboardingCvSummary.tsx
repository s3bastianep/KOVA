'use client';

import { ChevronRight, Pencil } from 'lucide-react';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import type { OnboardingCounts } from '@/lib/portal-onboarding';
import { formatPersonName, profileHeadlineRole } from '@/lib/portal-onboarding-unified';
import type { PortalVacancyMatchStats } from '@/lib/portal-vacancies';
import { PortalOnboardingStepHero } from './PortalOnboardingStepHero';
import { PortalOnboardingVacancyMetrics } from './PortalOnboardingVacancyMetrics';

type Props = {
  firstName: string;
  profile: CommercialProfile;
  counts: OnboardingCounts;
  vacancyStats: PortalVacancyMatchStats | null;
  vacancyStatsLoading?: boolean;
  onEditContact?: () => void;
  onEditProfile?: () => void;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function PortalOnboardingCvSummary({
  firstName,
  profile,
  counts,
  vacancyStats,
  vacancyStatsLoading,
  onEditContact,
  onEditProfile,
}: Props) {
  const displayName = formatPersonName(profile.nombre?.trim() || firstName);
  const role = profileHeadlineRole(profile);
  const onEdit = onEditProfile ?? onEditContact;

  const contactRows = [
    { label: 'Correo', value: profile.email?.trim() ?? '' },
    { label: 'Teléfono', value: profile.telefono?.trim() ?? '' },
    { label: 'Ciudad', value: profile.ciudad?.trim() ?? '' },
  ].filter((row) => row.value);

  const inventory = [
    { label: 'Experiencia laboral', count: counts.experiencias },
    { label: 'Formación académica', count: counts.estudios },
    { label: 'Idiomas', count: counts.idiomas },
    { label: 'Certificaciones', count: counts.certificaciones },
  ].filter((item) => item.count > 0);

  const hasContent = contactRows.length > 0 || inventory.length > 0;

  return (
    <div className="ob-cv-summary">
      <PortalOnboardingStepHero
        eyebrow="Análisis completado"
        title="Trayectoria consolidada"
        subtitle="Valida la información extraída de tu CV antes de continuar."
      />

      {hasContent ? (
        <section className="ob-cv-canvas">
          <div className="ob-cv-canvas__lead">
            <div className="ob-cv-canvas__identity">
              <span className="ob-cv-canvas__avatar" aria-hidden>
                {initials(displayName)}
              </span>
              <div>
                <h2>{displayName}</h2>
                <p>{role}</p>
              </div>
            </div>
            {onEdit ? (
              <button type="button" className="ob-cv-canvas__edit" onClick={onEdit}>
                <Pencil className="h-4 w-4" aria-hidden />
                Editar perfil
              </button>
            ) : null}
          </div>

          <PortalOnboardingVacancyMetrics
            stats={vacancyStats}
            loading={vacancyStatsLoading}
            className="ob-cv-canvas__metrics"
          />

          {contactRows.length > 0 ? (
            <dl className="ob-cv-canvas__fields">
              {contactRows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {inventory.length > 0 ? (
            <ul className="ob-cv-canvas__inventory">
              {inventory.map((item) => (
                <li key={item.label}>
                  <span className="ob-cv-canvas__inventory-count">{item.count}</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {onEdit ? (
            <button type="button" className="ob-cv-canvas__link" onClick={onEdit}>
              Revisar secciones en detalle
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </section>
      ) : (
        <p className="ob-cv-summary__empty">
          No detectamos secciones claras. Podrás completarlas manualmente en el siguiente paso.
        </p>
      )}
    </div>
  );
}
