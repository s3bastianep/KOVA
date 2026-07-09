'use client';

import { ChevronRight, Pencil } from 'lucide-react';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import type { OnboardingCounts } from '@/lib/portal-onboarding';
import {
  estimatedCompatibility,
  estimatedVacancies,
  formatPersonName,
  profileHeadlineRole,
} from '@/lib/portal-onboarding-unified';
import { PortalOnboardingStepHero } from './PortalOnboardingStepHero';

type Props = {
  firstName: string;
  profile: CommercialProfile;
  counts: OnboardingCounts;
  percent: number;
  prefAnswers: Record<string, string[]>;
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
  percent,
  prefAnswers,
  onEditContact,
  onEditProfile,
}: Props) {
  const displayName = formatPersonName(profile.nombre?.trim() || firstName);
  const role = profileHeadlineRole(profile);
  const compatibility = estimatedCompatibility(profile, percent, prefAnswers);
  const vacancies = estimatedVacancies(profile, percent, prefAnswers);
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
        percent={percent}
        hideRing
      />

      {hasContent ? (
        <section className="ob-cv-dossier">
          <header className="ob-cv-dossier__head">
            <div className="ob-cv-dossier__identity">
              <span className="ob-cv-dossier__avatar" aria-hidden>
                {initials(displayName)}
              </span>
              <div>
                <h2>{displayName}</h2>
                <p>{role}</p>
              </div>
            </div>
            {onEdit ? (
              <button type="button" className="ob-cv-dossier__edit" onClick={onEdit}>
                <Pencil className="h-3.5 w-3.5" aria-hidden />
                Editar
              </button>
            ) : null}
          </header>

          <div className="ob-cv-dossier__signals">
            <span>
              <strong>{compatibility}%</strong> compatibilidad
            </span>
            <span className="ob-cv-dossier__signals-divider" aria-hidden />
            <span>
              <strong>{vacancies}</strong> vacantes alineadas
            </span>
          </div>

          {contactRows.length > 0 ? (
            <>
              <div className="ob-cv-dossier__divider" aria-hidden />
              <dl className="ob-cv-dossier__fields">
                {contactRows.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : null}

          {inventory.length > 0 ? (
            <>
              <div className="ob-cv-dossier__divider" aria-hidden />
              <ul className="ob-cv-dossier__inventory">
                {inventory.map((item) => (
                  <li key={item.label}>
                    <span className="ob-cv-dossier__inventory-count">{item.count}</span>
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {onEdit ? (
            <button type="button" className="ob-cv-dossier__review" onClick={onEdit}>
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
