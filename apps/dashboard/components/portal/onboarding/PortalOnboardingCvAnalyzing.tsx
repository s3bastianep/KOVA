'use client';

import { Check, Loader2 } from 'lucide-react';
import { CV_ANALYSIS_STEPS } from '@/lib/portal-onboarding';

type Props = {
  analysisDone: number;
  analysisProgress: number;
};

export function PortalOnboardingCvAnalyzing({ analysisDone, analysisProgress }: Props) {
  const activeIndex = Math.min(analysisDone, CV_ANALYSIS_STEPS.length - 1);
  const activeLabel =
    analysisDone >= CV_ANALYSIS_STEPS.length
      ? 'Perfil estructurado'
      : CV_ANALYSIS_STEPS[activeIndex] ?? 'Iniciando análisis';

  return (
    <div className="ob-build" role="status" aria-live="polite" aria-label="Construyendo tu perfil">
      <div className="ob-build__visual" aria-hidden>
        <span className="ob-build__pulse" />
        <span className="ob-build__percent">{analysisProgress}%</span>
      </div>

      <p className="ob-build__status">{activeLabel}…</p>
      <p className="ob-build__sub">Estamos organizando tu trayectoria para el matching comercial.</p>

      <div className="ob-build__track" aria-hidden>
        <span style={{ width: `${analysisProgress}%` }} />
      </div>

      <ul className="ob-build__steps">
        {CV_ANALYSIS_STEPS.map((label, i) => {
          const done = i < analysisDone;
          const active = i === analysisDone && analysisDone < CV_ANALYSIS_STEPS.length;
          return (
            <li
              key={label}
              className={`ob-build__step${done ? ' is-done' : ''}${active ? ' is-active' : ''}`}
            >
              <span className="ob-build__step-icon" aria-hidden>
                {done ? (
                  <Check className="h-3.5 w-3.5" />
                ) : active ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : null}
              </span>
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
