'use client';

import type { WorkHistoryEntry } from '@/lib/candidate-commercial-profile';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import type { OnboardingCounts } from '@/lib/portal-onboarding';
import { formatPersonName, type ReviewSectionId } from '@/lib/portal-onboarding-unified';
import type { PortalVacancyMatchStats } from '@/lib/portal-vacancies';
import {
  Briefcase,
  Check,
  ChevronRight,
  CircleHelp,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { PortalOnboardingProgressRing } from './PortalOnboardingProgressRing';
import { PortalOnboardingVacancyMetrics } from './PortalOnboardingVacancyMetrics';

type Props = {
  firstName: string;
  profile: CommercialProfile;
  counts: OnboardingCounts;
  percent: number;
  journeyIndex: number;
  vacancyStats: PortalVacancyMatchStats | null;
  vacancyStatsLoading?: boolean;
  cvImportedAt?: string | null;
  onEditContact?: () => void;
  onReviewExperience?: () => void;
  onAddSkills?: () => void;
  onEditSection?: (section: ReviewSectionId) => void;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatMonthYear(value?: string): string {
  if (!value?.trim()) return '';
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleDateString('es-CO', { month: 'short', year: 'numeric' });
  }
  return value.trim();
}

function formatWorkPeriod(entry: WorkHistoryEntry): string {
  const start = formatMonthYear(entry.fechaInicio);
  const end = entry.trabajoActual ? 'Actual' : formatMonthYear(entry.fechaFin);
  if (!start && !end) return 'Sin fechas';
  if (!start) return end;
  if (!end) return start;
  return `${start} a ${end}`;
}

function formatCvImportedAt(iso?: string | null): string {
  if (!iso) return 'Hoja de vida importada';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Hoja de vida importada';
  const date = d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
  return `Importada ${date}, ${time}`;
}

function pendingItems(profile: CommercialProfile) {
  const items: string[] = [];
  if (!profile.expectativaSalarial?.trim()) items.push('Expectativa salarial');
  if (!profile.disponibilidad?.trim()) items.push('Disponibilidad para trabajar');
  if (!profile.disponibilidadViajar?.trim()) items.push('Disponibilidad para viajar');
  if (!profile.rol?.trim() && !(profile.historialLaboral?.[0]?.cargo?.trim())) {
    items.push('Rol comercial');
  }
  return items;
}

export function PortalOnboardingCvSummary({
  firstName,
  profile,
  counts,
  percent,
  journeyIndex,
  vacancyStats,
  vacancyStatsLoading,
  cvImportedAt,
  onEditContact,
  onReviewExperience,
  onAddSkills,
  onEditSection,
}: Props) {
  const displayName = formatPersonName(profile.nombre?.trim() || firstName);
  const experiences = (profile.historialLaboral ?? []).filter(
    (entry) => entry.empresa?.trim() || entry.cargo?.trim(),
  );

  const contactRows = [
    { label: 'Nombre', value: displayName, icon: User },
    { label: 'Correo', value: profile.email?.trim() ?? '', icon: Mail },
    { label: 'Teléfono', value: profile.telefono?.trim() ?? '', icon: Phone },
    { label: 'Ciudad', value: profile.ciudad?.trim() ?? '', icon: MapPin },
  ].filter((row) => row.value);

  const detectedItems: { label: string; done: boolean; section: ReviewSectionId }[] = [
    { label: 'Datos de contacto', done: contactRows.length > 0, section: 'personal' },
    { label: 'Experiencia laboral', done: counts.experiencias > 0, section: 'experiencia' },
    { label: 'Formación académica', done: counts.estudios > 0, section: 'educacion' },
    { label: 'Idiomas', done: counts.idiomas > 0, section: 'idiomas' },
  ];

  const pending = pendingItems(profile);
  const hasContent = contactRows.length > 0 || experiences.length > 0 || detectedItems.some((i) => i.done);

  return (
    <div className="ob-cv-summary">
      <div className="ob-cv-summary__hero">
        <div className="ob-cv-summary__hero-text">
          <h1>Así quedó tu perfil.</h1>
          <p>
            Este es el perfil con el que las empresas te van a encontrar. Si algo no está bien,
            aún puedes ajustarlo antes de finalizar.
          </p>
        </div>
      </div>

      {hasContent ? (
        <div className="ob-cv-summary__grid">
          <div className="ob-cv-summary__main">
            <div className="ob-profile-card">
            <div className="ob-profile-card__left">
              <span className="ob-profile-card__avatar" aria-hidden>
                {initials(displayName)}
              </span>
              <div className="ob-profile-card__who">
                <p className="ob-profile-card__name">{displayName}</p>
              </div>
            </div>
            <div className="ob-profile-card__stats">
              <PortalOnboardingVacancyMetrics
                stats={vacancyStats}
                loading={vacancyStatsLoading}
                variant="strip"
                hasSkills={(profile.herramientas?.length ?? 0) > 0}
                onAddSkills={onAddSkills}
              />
              <div className="ob-profile-card__import">
                <FileText className="h-4 w-4" aria-hidden />
                <div>
                  <strong>Hoja de vida importada</strong>
                  <span>{formatCvImportedAt(cvImportedAt)}</span>
                </div>
              </div>
            </div>
            </div>

            {contactRows.length > 0 ? (
                <section className="ob-panel">
                  <div className="ob-panel__head">
                    <div className="ob-panel__title">
                      <span className="ob-panel__icon ob-panel__icon--purple" aria-hidden>
                        <User className="h-4 w-4" />
                      </span>
                      <h2>Datos de contacto</h2>
                    </div>
                    {onEditContact ? (
                      <button type="button" className="ob-panel__edit ob-panel__edit--lime" onClick={onEditContact}>
                        Editar
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    ) : null}
                  </div>
                  <ul className="ob-contact-grid">
                    {contactRows.map((row) => (
                      <li key={row.label}>
                        <span className="ob-contact-grid__label">{row.label}</span>
                        <span className="ob-contact-grid__value">{row.value}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {experiences.length > 0 ? (
                <section className="ob-panel">
                  <div className="ob-panel__head">
                    <div className="ob-panel__title">
                      <span className="ob-panel__icon ob-panel__icon--blue" aria-hidden>
                        <Briefcase className="h-4 w-4" />
                      </span>
                      <h2>Tu experiencia profesional</h2>
                    </div>
                  </div>
                  <ol className="ob-exp-timeline">
                    {experiences.map((entry) => (
                      <li key={entry.id} className="ob-exp-timeline__item">
                        <div className="ob-exp-timeline__content">
                          <div className="ob-exp-timeline__top">
                            <div>
                              <h3>{entry.empresa?.trim() || 'Empresa'}</h3>
                              <p>{entry.cargo?.trim() || 'Cargo'}</p>
                              <span className="ob-exp-timeline__dates">{formatWorkPeriod(entry)}</span>
                            </div>
                            <span className="ob-exp-timeline__badge">Importado</span>
                          </div>
                          {onReviewExperience ? (
                            <button
                              type="button"
                              className="ob-exp-timeline__review"
                              onClick={onReviewExperience}
                            >
                              Revisar
                              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                            </button>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}
          </div>

          <aside className="ob-cv-summary__aside">
            <div className="ob-cv-summary__ring-card">
              <PortalOnboardingProgressRing percent={percent} size={112} />
              <p className="ob-cv-summary__ring-caption">Completado</p>
              <p className="ob-cv-summary__encourage">
                <strong>¡Vas muy bien!</strong> Tu perfil ya tiene lo esencial para empezar a
                conectar con oportunidades.
              </p>
            </div>

            <section className="ob-panel ob-panel--sidebar">
                <h2 className="ob-panel__sidebar-title">Información detectada</h2>
                <ul className="ob-detected-list">
                  {detectedItems.map((item) => (
                    <li key={item.label} className={item.done ? 'is-done' : ''}>
                      {onEditSection ? (
                        <button
                          type="button"
                          className="ob-detected-list__row"
                          onClick={() => onEditSection(item.section)}
                        >
                          <span className="ob-detected-list__icon" aria-hidden>
                            {item.done ? <Check className="h-3.5 w-3.5" /> : null}
                          </span>
                          <span>{item.label}</span>
                          <ChevronRight className="ob-detected-list__chevron h-3.5 w-3.5" aria-hidden />
                        </button>
                      ) : (
                        <>
                          <span className="ob-detected-list__icon" aria-hidden>
                            {item.done ? <Check className="h-3.5 w-3.5" /> : null}
                          </span>
                          <span>{item.label}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              {pending.length > 0 ? (
                <section className="ob-panel ob-panel--pending">
                  <h2 className="ob-panel__sidebar-title">Información pendiente</h2>
                  <p className="ob-panel__pending-note">
                    Puedes completarlos o editarlos antes de finalizar. No hay más preguntas
                    después de este paso.
                  </p>
                  <ul className="ob-pending-list">
                    {pending.map((label) => (
                      <li key={label}>
                        <span>{label}</span>
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <p className="ob-cv-summary__compat-note">
                <CircleHelp className="h-3.5 w-3.5" aria-hidden />
                La compatibilidad se calcula con vacantes abiertas en la plataforma.
              </p>
          </aside>
        </div>
      ) : (
        <p className="ob-cv-summary__empty">
          No detectamos secciones claras. Podrás completarlas manualmente en el siguiente paso.
        </p>
      )}
    </div>
  );
}
