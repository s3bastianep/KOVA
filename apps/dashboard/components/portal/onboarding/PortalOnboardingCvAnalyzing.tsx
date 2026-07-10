'use client';

import { ArrowRight, Check, Loader2, Sparkles } from 'lucide-react';
import { CV_ANALYSIS_STEPS } from '@/lib/portal-onboarding';
import { PortalOnboardingProgressRing } from './PortalOnboardingProgressRing';

type Props = {
  analysisDone: number;
  analysisProgress: number;
  complete?: boolean;
  busy?: boolean;
  onContinue?: () => void;
};

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
        <div className="ob-build__ring-wrap">
          <PortalOnboardingProgressRing percent={displayProgress} size={120} />
        </div>
        <h2 className="ob-build__title">
          {complete ? '¡Perfil estructurado!' : `${activeLabel}…`}
        </h2>
        <p className="ob-build__sub">
          {complete
            ? 'Hemos organizado tu trayectoria para hacer el mejor matching comercial.'
            : 'Estamos organizando tu trayectoria para el matching comercial.'}
        </p>
      </div>

      <ul className="ob-build__tasks">
        {CV_ANALYSIS_STEPS.map((label, i) => {
          const done = complete || i < analysisDone;
          const active = !complete && i === analysisDone && analysisDone < CV_ANALYSIS_STEPS.length;
          return (
            <li
              key={label}
              className={`ob-build__task${done ? ' is-done' : ''}${active ? ' is-active' : ''}`}
            >
              <span className="ob-build__task-check" aria-hidden>
                {done ? (
                  <Check className="h-3.5 w-3.5" />
                ) : active ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : null}
              </span>
              <span className="ob-build__task-label">{label}</span>
              {done ? <span className="ob-build__task-badge">Completado</span> : null}
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
