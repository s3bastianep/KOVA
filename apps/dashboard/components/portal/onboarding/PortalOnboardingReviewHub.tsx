'use client';

import { useMemo, useRef } from 'react';
import {
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
  Exclude<ReviewSectionId, 'certificaciones'>,
  { icon: typeof User; tone: 'purple' | 'blue' | 'yellow' | 'teal' | 'green' }
> = {
  personal: { icon: User, tone: 'purple' },
  experiencia: { icon: Briefcase, tone: 'blue' },
  educacion: { icon: GraduationCap, tone: 'purple' },
  idiomas: { icon: Languages, tone: 'yellow' },
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

function SectionCard({
  section,
  profile,
  isReviewed,
  isFocus,
  onEdit,
  cardRef,
}: {
  section: (typeof REVIEW_SECTIONS)[number];
  profile: CommercialProfile;
  isReviewed: boolean;
  isFocus: boolean;
  onEdit: () => void;
  cardRef: (el: HTMLElement | null) => void;
}) {
  const hasData = isReviewSectionReady(section.id, profile);
  const summary = reviewSectionSummary(section.id, profile);
  const meta = SECTION_ICONS[section.id as Exclude<ReviewSectionId, 'certificaciones'>];
  const Icon = meta.icon;

  return (
    <section
      ref={cardRef}
      className={`ob-panel ob-review-card${isReviewed ? ' is-reviewed' : ''}${isFocus ? ' is-next' : ''}`}
    >
      <header className="ob-panel__head">
        <div className="ob-panel__title">
          <span className={`ob-panel__icon ob-panel__icon--${meta.tone}`} aria-hidden>
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <h2>{section.label}</h2>
            <span className="ob-review-card__badge">Obligatorio</span>
          </div>
        </div>
        {isReviewed ? (
          <span className="ob-review-card__status is-done">
            <Check className="h-3 w-3" />
            Revisado
          </span>
        ) : null}
      </header>

      <p className="ob-review-card__summary">{summary}</p>

      <div className="ob-review-card__actions">
        <button
          type="button"
          className={isReviewed ? 'ob-panel__edit' : 'ob-review-card__confirm'}
          onClick={onEdit}
        >
          {isReviewed ? <Pencil className="h-3.5 w-3.5" aria-hidden /> : null}
          {isReviewed ? 'Volver a revisar' : hasData ? 'Revisar datos' : 'Completar'}
          {!isReviewed ? <ChevronRight className="h-3.5 w-3.5" aria-hidden /> : null}
        </button>
      </div>
    </section>
  );
}

export function PortalOnboardingReviewHub({ profile, reviewed, onEdit }: Props) {
  const sections = REVIEW_SECTIONS;
  const doneCount = sections.filter((s) => reviewed.has(s.id)).length;
  const total = sections.length;
  const pending = total - doneCount;
  const allDone = pending === 0;

  const nextFocus = useMemo(
    () => sections.find((s) => !reviewed.has(s.id)) ?? null,
    [sections, reviewed],
  );

  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  const openFocus = () => {
    if (!nextFocus) return;
    onEdit(nextFocus.id);
  };

  return (
    <div className="ob-review-hub">
      <div className="ob-review-hub__head">
        <PortalOnboardingStepHero
          eyebrow="Revisión de tu CV"
          title="Revisa todas las secciones"
          subtitle="Todas son obligatorias. Abre cada una, revisa los datos y pulsa Guardar."
        />

        <div className={`ob-review-hub__summary${allDone ? ' is-ready' : ''}`}>
          <div
            className="ob-review-hub__ring"
            style={{
              ['--pct' as string]: String(Math.round((doneCount / total) * 100)),
            }}
          >
            <div className="ob-review-hub__ring-inner">
              <strong>
                {doneCount}/{total}
              </strong>
            </div>
          </div>
          <div className="ob-review-hub__summary-text">
            <span>secciones revisadas</span>
            <p>
              {allDone
                ? 'Listo. Ya puedes continuar abajo.'
                : pending === 1
                  ? 'Te falta revisar 1 sección.'
                  : `Te faltan ${pending} secciones por revisar.`}
            </p>
          </div>
        </div>
      </div>

      {!allDone && nextFocus ? (
        <button type="button" className="ob-review-hub__next" onClick={openFocus}>
          <span className="ob-review-hub__next-label">
            Siguiente: <strong>revisar “{nextFocus.label}”</strong>
          </span>
          <span className="ob-review-hub__next-action">
            Abrir
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </button>
      ) : null}

      {allDone ? (
        <p className="ob-review-hub__ready" role="status">
          Todo revisado. Usa <strong>Continuar a preferencias</strong> abajo cuando quieras.
        </p>
      ) : null}

      <section className="ob-review-hub__group" aria-labelledby="ob-review-all-title">
        <header className="ob-review-hub__group-head">
          <h3 id="ob-review-all-title">Secciones a revisar</h3>
          <p>Entra, revisa y guarda. Solo así se marca como revisado.</p>
        </header>
        <div className="ob-review-hub__stack">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              profile={profile}
              isReviewed={reviewed.has(section.id)}
              isFocus={nextFocus?.id === section.id}
              onEdit={() => onEdit(section.id)}
              cardRef={(el) => {
                cardRefs.current[section.id] = el;
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
