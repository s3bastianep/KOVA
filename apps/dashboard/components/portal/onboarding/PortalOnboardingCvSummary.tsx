'use client';

import {
  Award,
  Briefcase,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Sparkles,
  User,
} from 'lucide-react';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import type { OnboardingCounts } from '@/lib/portal-onboarding';
import {
  estimatedCompatibility,
  estimatedVacancies,
  profileHeadlineRole,
} from '@/lib/portal-onboarding-unified';
import { PortalOnboardingProgressRing } from './PortalOnboardingProgressRing';

type ContactField = {
  label: string;
  value: string;
  icon: typeof User;
};

type StatItem = {
  label: string;
  count: number;
  icon: typeof Briefcase;
  tone: 'green' | 'purple' | 'yellow' | 'teal';
};

type Props = {
  firstName: string;
  profile: CommercialProfile;
  counts: OnboardingCounts;
  percent: number;
  prefAnswers: Record<string, string[]>;
  onEditContact?: () => void;
  onEditProfile?: () => void;
};

function initials(name?: string | null): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
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
  const displayName = profile.nombre?.trim() || firstName;
  const role = profileHeadlineRole(profile);
  const compatibility = estimatedCompatibility(profile, percent, prefAnswers);
  const vacancies = estimatedVacancies(profile, percent, prefAnswers);

  const contactFields: ContactField[] = [
    { label: 'Nombre', value: profile.nombre?.trim() ?? '', icon: User },
    { label: 'Correo', value: profile.email?.trim() ?? '', icon: Mail },
    { label: 'Teléfono', value: profile.telefono?.trim() ?? '', icon: Phone },
    { label: 'Ciudad', value: profile.ciudad?.trim() ?? '', icon: MapPin },
  ].filter((f) => f.value);

  const stats: StatItem[] = [
    { label: 'Experiencias', count: counts.experiencias, icon: Briefcase, tone: 'green' as const },
    { label: 'Estudios', count: counts.estudios, icon: GraduationCap, tone: 'purple' as const },
    { label: 'Idiomas', count: counts.idiomas, icon: Languages, tone: 'yellow' as const },
    { label: 'Certificaciones', count: counts.certificaciones, icon: Award, tone: 'teal' as const },
  ].filter((s) => s.count > 0);

  return (
    <div className="ob-cv-summary">
      <div className="ob-cv-summary__hero">
        <div className="ob-cv-summary__hero-text">
          <p className="ob-cv-summary__eyebrow">Análisis completado</p>
          <h1>Trayectoria consolidada</h1>
          <p>
            Revisa la información extraída de tu CV. Confirma los datos antes de continuar con tu
            perfil comercial.
          </p>
        </div>
        <PortalOnboardingProgressRing percent={percent} />
      </div>

      <div className="ob-profile-card">
        <div className="ob-profile-card__left">
          <span className="ob-profile-card__avatar" aria-hidden>
            {initials(displayName)}
          </span>
          <div>
            <p className="ob-profile-card__name">{displayName}</p>
            <p className="ob-profile-card__role">{role}</p>
          </div>
        </div>
        <div className="ob-profile-card__stats">
          <div>
            <strong>{compatibility}%</strong>
            <span>Compatibilidad inicial</span>
          </div>
          <div>
            <strong>{vacancies}</strong>
            <span>Vacantes para ti</span>
          </div>
        </div>
      </div>

      {contactFields.length > 0 ? (
        <section className="ob-panel">
          <header className="ob-panel__head">
            <div className="ob-panel__title">
              <span className="ob-panel__icon ob-panel__icon--purple" aria-hidden>
                <User className="h-4 w-4" />
              </span>
              <h2>Datos de contacto</h2>
            </div>
            {onEditContact ? (
              <button type="button" className="ob-panel__edit" onClick={onEditContact}>
                <Pencil className="h-3.5 w-3.5" aria-hidden />
                Editar
              </button>
            ) : null}
          </header>
          <ul className="ob-contact-list">
            {contactFields.map((field) => {
              const Icon = field.icon;
              return (
                <li key={field.label}>
                  <span className="ob-contact-list__icon" aria-hidden>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="ob-contact-list__label">{field.label}</span>
                    <span className="ob-contact-list__value">{field.value}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {stats.length > 0 ? (
        <section className="ob-panel">
          <header className="ob-panel__head">
            <div className="ob-panel__title">
              <span className="ob-panel__icon ob-panel__icon--blue" aria-hidden>
                <Briefcase className="h-4 w-4" />
              </span>
              <h2>Tu perfil profesional</h2>
            </div>
            {onEditProfile ? (
              <button type="button" className="ob-panel__edit" onClick={onEditProfile}>
                <Pencil className="h-3.5 w-3.5" aria-hidden />
                Editar
              </button>
            ) : null}
          </header>
          <div className="ob-stat-grid">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`ob-stat-chip ob-stat-chip--${stat.tone}`}>
                  <span className="ob-stat-chip__icon" aria-hidden>
                    <Icon className="h-4 w-4" />
                  </span>
                  <strong>{stat.count}</strong>
                  <span>{stat.label}</span>
                </div>
              );
            })}
          </div>
          <p className="ob-panel__tip">
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Tip: Mientras más completo esté tu perfil, mejores oportunidades te mostraremos.
          </p>
        </section>
      ) : null}

      {contactFields.length === 0 && stats.length === 0 ? (
        <p className="ob-cv-summary__empty">
          No detectamos secciones claras. Podrás completar manualmente en el siguiente paso.
        </p>
      ) : null}
    </div>
  );
}
