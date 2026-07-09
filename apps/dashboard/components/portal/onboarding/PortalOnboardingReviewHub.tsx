'use client';

import { Check, ChevronRight, Pencil } from 'lucide-react';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import {
  REVIEW_SECTIONS,
  type ReviewSectionId,
  isReviewSectionReady,
  reviewSectionSummary,
} from '@/lib/portal-onboarding-unified';

type Props = {
  profile: CommercialProfile;
  reviewed: Set<ReviewSectionId>;
  onEdit: (section: ReviewSectionId) => void;
  onMarkReviewed: (section: ReviewSectionId) => void;
};

export function PortalOnboardingReviewHub({ profile, reviewed, onEdit, onMarkReviewed }: Props) {
  return (
    <div className="portal-onboarding-review-hub">
      <header className="portal-onboarding-shell__header portal-onboarding-shell__header--compact text-left">
        <h1 className="text-left">Revisa tu perfil</h1>
        <p className="portal-onboarding-lead text-left mx-0">
          KOVA extrajo esta información de tu hoja de vida. Confirma cada sección o edítala si hace falta.
        </p>
      </header>

      <div className="portal-onboarding-review-grid">
        {REVIEW_SECTIONS.map((section) => {
          const isReviewed = reviewed.has(section.id);
          const hasData = isReviewSectionReady(section.id, profile);
          const summary = reviewSectionSummary(section.id, profile);

          return (
            <article
              key={section.id}
              className={`portal-onboarding-review-card${isReviewed ? ' is-reviewed' : ''}`}
            >
              <div className="portal-onboarding-review-card__head">
                <div>
                  <h3>{section.label}</h3>
                  <p>{summary}</p>
                </div>
                <span
                  className={`portal-onboarding-review-card__status${
                    isReviewed ? ' is-done' : hasData ? ' is-pending' : ' is-empty'
                  }`}
                >
                  {isReviewed ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Revisado
                    </>
                  ) : (
                    'Pendiente'
                  )}
                </span>
              </div>

              <div className="portal-onboarding-review-card__actions">
                <button type="button" className="portal-onboarding-review-card__edit" onClick={() => onEdit(section.id)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </button>
                {!isReviewed ? (
                  <button
                    type="button"
                    className="portal-onboarding-review-card__confirm"
                    onClick={() => onMarkReviewed(section.id)}
                  >
                    Marcar revisado
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
