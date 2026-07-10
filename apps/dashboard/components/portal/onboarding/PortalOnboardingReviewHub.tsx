'use client';

import { useMemo, useRef } from 'react';
import {
  Award,
  ArrowRight,
  Briefcase,
  Check,
  ChevronRight,
  GraduationCap,
  Languages,
  Pencil,
  Sparkles,
  User,
} from 'lucide-react';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import {
  REVIEW_SECTIONS,
  type ReviewSectionId,
  isReviewSectionReady,
  reviewSectionSummary,
} from '@/lib/portal-onboarding-unified';
import { PortalOnboardingStepHero } from './PortalOnboardingStepHero';

const SECTION_ICONS: Record<
  ReviewSectionId,
  { icon: typeof User; tone: 'purple' | 'blue' | 'yellow' | 'teal' | 'green' }
> = {
  personal: { icon: User, tone: 'purple' },
  experiencia: { icon: Briefcase, tone: 'blue' },
  educacion: { icon: GraduationCap, tone: 'purple' },
  idiomas: { icon: Languages, tone: 'yellow' },
  certificaciones: { icon: Award, tone: 'teal' },
  skills: { icon: Sparkles, tone: 'green' },
};

type Props = {
  firstName: string;
  percent: number;
  profile: CommercialProfile;
  reviewed: Set<ReviewSectionId>;
  onEdit: (section: ReviewSectionId) => void;
  onMarkReviewed: (section: ReviewSectionId) => void;
};

export function PortalOnboardingReviewHub({
  firstName,
  percent,
  profile,
  reviewed,
  onEdit,
  onMarkReviewed,
}: Props) {
  const reviewedCount = REVIEW_SECTIONS.filter((s) => reviewed.has(s.id)).length;
  const requiredSections = REVIEW_SECTIONS.filter((s) => s.required);
  const requiredPendingCount = requiredSections.filter((s) => !reviewed.has(s.id)).length;
  const hubProgress = Math.round((reviewedCount / REVIEW_SECTIONS.length) * 100);

  // Sections keep their natural, stable order here (unlike an earlier version that resorted
  // pending-first) — the numbered stepper on the left only makes sense against a fixed sequence;
  // re-sorting would make the numbers jump around as sections get confirmed.
  const orderedSections = REVIEW_SECTIONS;

  const nextSection = useMemo(
    () => orderedSections.find((s) => !reviewed.has(s.id)) ?? null,
    [orderedSections, reviewed],
  );
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  const jumpToNext = () => {
    if (!nextSection) return;
    cardRefs.current[nextSection.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    onEdit(nextSection.id);
  };

  return (
    <div className="ob-review-hub">
      <div className="ob-review-hub__head">
        <PortalOnboardingStepHero
          eyebrow="Revisión de trayectoria"
          title="Esto leímos de tu CV"
          subtitle="Revisa que esté bien. Con estos datos te presentamos ante las empresas, así que corrige lo que necesites."
        />

        <div className="ob-review-hub__summary">
          <div
            className="ob-review-hub__ring"
            style={{ ['--pct' as string]: String(hubProgress) }}
          >
            <div className="ob-review-hub__ring-inner">
              <strong>
                {reviewedCount}/{REVIEW_SECTIONS.length}
              </strong>
            </div>
          </div>
          <div className="ob-review-hub__summary-text">
            <span>secciones revisadas</span>
            <p>
              {requiredPendingCount > 0
                ? requiredPendingCount === 1
                  ? 'Falta 1 sección obligatoria por confirmar'
                  : `Faltan ${requiredPendingCount} secciones obligatorias por confirmar`
                : 'Obligatorias listas · lo opcional queda a tu criterio'}
            </p>
          </div>
        </div>
      </div>

      {nextSection ? (
        <button type="button" className="ob-review-hub__next" onClick={jumpToNext}>
          <span className="ob-review-hub__next-label">
            Sigue: <strong>{nextSection.label}</strong>
          </span>
          <span className="ob-review-hub__next-action">
            Ir ahora
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </button>
      ) : null}

      {/* The numbered stepper below visually counts the sections, but reviewing them is not a
          strict sequence — this line exists so the numbering doesn't read as "do 1 before 2". */}
      <p className="ob-review-hub__order-hint">Puedes revisarlas en el orden que prefieras.</p>

      <div className="ob-review-hub__list">
        {orderedSections.map((section, index) => {
          const isReviewed = reviewed.has(section.id);
          const hasData = isReviewSectionReady(section.id, profile);
          const summary = reviewSectionSummary(section.id, profile);
          const meta = SECTION_ICONS[section.id];
          const Icon = meta.icon;
          const isNext = nextSection?.id === section.id;
          const isLast = index === orderedSections.length - 1;

          return (
            <div key={section.id} className="ob-review-hub__item">
              <div className="ob-review-hub__index" aria-hidden>
                <span className={`ob-review-hub__index-badge${isReviewed ? ' is-done' : ''}`}>
                  {isReviewed ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : index + 1}
                </span>
                {!isLast ? <span className="ob-review-hub__index-line" /> : null}
              </div>

              <section
                ref={(el) => {
                  cardRefs.current[section.id] = el;
                }}
                className={`ob-panel ob-review-card${isReviewed ? ' is-reviewed' : ''}${isNext ? ' is-next' : ''}`}
              >
                <header className="ob-panel__head">
                  <div className="ob-panel__title">
                    <span className={`ob-panel__icon ob-panel__icon--${meta.tone}`} aria-hidden>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h2>{section.label}</h2>
                      {section.required ? (
                        <span className="ob-review-card__badge">Obligatorio</span>
                      ) : (
                        <span className="ob-review-card__badge ob-review-card__badge--optional">
                          Opcional
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ob-review-card__status-btn"
                    onClick={() => onEdit(section.id)}
                  >
                    <span
                      className={`ob-review-card__status${isReviewed ? ' is-done' : hasData ? ' is-pending' : ' is-empty'}`}
                    >
                      {isReviewed ? (
                        <>
                          <Check className="h-3 w-3" />
                          Revisado
                        </>
                      ) : hasData ? (
                        'Por confirmar'
                      ) : (
                        'Sin datos'
                      )}
                    </span>
                    <ChevronRight className="ob-review-card__status-chevron h-3.5 w-3.5" aria-hidden />
                  </button>
                </header>

                <p className="ob-review-card__summary">{summary}</p>

                <div className="ob-review-card__actions">
                  <button type="button" className="ob-panel__edit" onClick={() => onEdit(section.id)}>
                    <Pencil className="h-3.5 w-3.5" aria-hidden />
                    Ver y editar
                  </button>
                  {!isReviewed ? (
                    <button
                      type="button"
                      className="ob-review-card__confirm"
                      onClick={() => onMarkReviewed(section.id)}
                    >
                      {hasData ? 'Confirmar sección' : 'Omitir por ahora'}
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  ) : null}
                </div>
              </section>
            </div>
          );
        })}
      </div>
    </div>
  );
}
