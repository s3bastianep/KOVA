'use client';

import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  FileText,
  GraduationCap,
  Globe,
  Loader2,
  Sparkles,
  Star,
} from 'lucide-react';
import { CV_ANALYSIS_STEPS } from '@/lib/portal-onboarding';
import { PortalOnboardingProgressRing } from './PortalOnboardingProgressRing';

type Props = {
  analysisDone: number;
  analysisProgress: number;
  complete?: boolean;
  busy?: boolean;
  onContinue?: () => void;
};

// One icon per CV_ANALYSIS_STEPS entry (same order) so each task reads at a glance instead of
// every row looking identical.
const TASK_ICONS = [Briefcase, GraduationCap, Star, Globe, Building2, FileText] as const;

export function PortalOnboardingCvAnalyzing({
  analysisDone,
  analysisProgress,
  complete,
  busy,
  onContinue,
}: Props) {
  const activeIndex = Math.min(analysisDone, CV_ANALYSIS_STEPS.length - 1);
  const activeLabel = CV_ANALYSIS_STEPS[activeIndex] ?? 'Iniciando análisis';
  const displayProgress = complete ? 100 : analysisProgress;

  return (
    <div
      className={`ob-build${complete ? ' ob-build--complete' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Construyendo tu perfil"
    >
      <div className="ob-build__hero">
        <div className="ob-build__hero-row">
          {complete ? (
            <div className="ob-build__done-icon" aria-hidden>
              <Check className="h-7 w-7" strokeWidth={3} />
            </div>
          ) : (
            <div className="ob-build__ring-wrap">
              <PortalOnboardingProgressRing percent={displayProgress} size={88} />
            </div>
          )}
          <div className="ob-build__hero-text">
            {complete ? <p className="ob-build__eyebrow">Proceso completado</p> : null}
            <h2 className="ob-build__title">
              {complete ? '¡Perfil estructurado!' : `${activeLabel}…`}
            </h2>
            <p className="ob-build__sub">
              {complete
                ? 'Hemos organizado tu trayectoria para hacer el mejor matching comercial.'
                : 'Estamos organizando tu trayectoria para el matching comercial.'}
            </p>
          </div>
        </div>
      </div>

      <ul className="ob-build__tasks">
        {CV_ANALYSIS_STEPS.map((label, i) => {
          const done = complete || i < analysisDone;
          const active = !complete && i === analysisDone && analysisDone < CV_ANALYSIS_STEPS.length;
          const Icon = TASK_ICONS[i] ?? FileText;
          return (
            <li
              key={label}
              className={`ob-build__task${done ? ' is-done' : ''}${active ? ' is-active' : ''}`}
            >
              <span className="ob-build__task-icon" aria-hidden>
                {active ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
              </span>
              <span className="ob-build__task-label">{label}</span>
              {done ? (
                <span className="ob-build__task-badge">
                  <span className="ob-build__task-badge-dot" aria-hidden />
                  Completado
                </span>
              ) : null}
              {active ? <span className="ob-build__task-badge is-active">En curso</span> : null}
            </li>
          );
        })}
      </ul>

      {complete && onContinue ? (
        <div className="ob-build__footer">
          <div className="ob-build__footer-msg">
            <Sparkles className="h-4 w-4" aria-hidden />
            <p>
              <strong>¡Todo listo!</strong> Ahora revisaremos la información para asegurarnos de
              que todo esté correcto.
            </p>
          </div>
          <button
            type="button"
            className="ob-build__continue"
            disabled={busy}
            onClick={onContinue}
          >
            {busy ? 'Guardando…' : 'Continuar'}
            {!busy ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
          </button>
        </div>
      ) : null}
    </div>
  );
}
