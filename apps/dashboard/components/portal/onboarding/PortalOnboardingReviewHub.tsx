'use client';

import {
  Award,
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

  return (
    <div className="ob-review-hub">
      <PortalOnboardingStepHero
        eyebrow="Revisión de trayectoria"
        title="Valida tu perfil profesional"
        subtitle="Confirma cada sección. Puedes editar cualquier dato antes de continuar."
      />

      <p className="ob-review-hub__progress-label">
        {reviewedCount} de {REVIEW_SECTIONS.length} secciones revisadas
      </p>

      <div className="ob-review-hub__list">
        {REVIEW_SECTIONS.map((section) => {
          const isReviewed = reviewed.has(section.id);
          const hasData = isReviewSectionReady(section.id, profile);
          const summary = reviewSectionSummary(section.id, profile);
          const meta = SECTION_ICONS[section.id];
          const Icon = meta.icon;

          return (
            <section
              key={section.id}
              className={`ob-panel ob-review-card${isReviewed ? ' is-reviewed' : ''}`}
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
                      <span className="ob-review-card__badge ob-review-card__badge--optional">Opcional</span>
                    )}
                  </div>
                </div>
                <span
                  className={`ob-review-card__status${isReviewed ? ' is-done' : hasData ? ' is-pending' : ' is-empty'}`}
                >
                  {isReviewed ? (
                    <>
                      <Check className="h-3 w-3" />
                      Revisado
                    </>
                  ) : (
                    'Pendiente'
                  )}
                </span>
              </header>

              <p className="ob-review-card__summary">{summary}</p>

              <div className="ob-review-card__actions">
                <button type="button" className="ob-panel__edit" onClick={() => onEdit(section.id)}>
                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                  Editar
                </button>
                {!isReviewed ? (
                  <button
                    type="button"
                    className="ob-review-card__confirm"
                    onClick={() => onMarkReviewed(section.id)}
                  >
                    Marcar revisado
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  </button>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
