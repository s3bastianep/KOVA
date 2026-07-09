'use client';

import { Check } from 'lucide-react';
import type { EvidenceCard } from '@/lib/candidate-commercial-profile';
import {
  ACHIEVEMENT_CIFRA_SUGGESTIONS,
  ACHIEVEMENT_TITLE_SUGGESTIONS,
  EVIDENCE_COMPETENCY_TAGS,
  EVIDENCE_PHASES,
  evidencePhaseIndex,
  isEvidenceDraftComplete,
  type EvidencePhase,
} from '@/lib/portal-onboarding-evidence';
import { PortalOnboardingStepHero } from './PortalOnboardingStepHero';

const PHASE_COPY: Record<
  EvidencePhase,
  { title: string; subtitle: string }
> = {
  titulo: {
    title: '¿Cuál fue un logro que destacas?',
    subtitle: 'Elige una opción o escribe la tuya.',
  },
  contexto: {
    title: '¿En qué contexto ocurrió?',
    subtitle: 'Empresa, equipo o situación. Una frase basta.',
  },
  cifra: {
    title: '¿Con qué cifra o resultado?',
    subtitle: 'Un número concreto fortalece tu perfil.',
  },
  tags: {
    title: '¿Qué demuestra este logro?',
    subtitle: 'Selecciona las competencias que refleja.',
  },
};

type Props = {
  firstName: string;
  percent: number;
  draft: EvidenceCard;
  phase: EvidencePhase;
  onChange: (card: EvidenceCard) => void;
  onPhaseChange: (phase: EvidencePhase) => void;
};

export function PortalOnboardingEvidence({
  firstName,
  percent,
  draft,
  phase,
  onChange,
  onPhaseChange,
}: Props) {
  const phaseIdx = evidencePhaseIndex(phase);
  const copy = PHASE_COPY[phase];

  const toggleTag = (tag: string) => {
    const has = draft.competencias.includes(tag);
    onChange({
      ...draft,
      competencias: has ? draft.competencias.filter((t) => t !== tag) : [...draft.competencias, tag],
    });
  };

  return (
    <div className="ob-evidence">
      <PortalOnboardingStepHero
        firstName={firstName}
        eyebrow={`Perfil comercial · Logro ${phaseIdx + 1} de ${EVIDENCE_PHASES.length}`}
        title={copy.title}
        subtitle={copy.subtitle}
        percent={percent}
      />

      <div className="portal-onboarding-evidence__steps ob-evidence__steps" aria-hidden>
        {EVIDENCE_PHASES.map((p, i) => (
          <span key={p} className={i <= phaseIdx ? 'is-on' : undefined} />
        ))}
      </div>

      <section className="ob-panel ob-question-panel">
      {phase === 'titulo' ? (
        <>
          <div className="portal-onboarding-chips">
            {ACHIEVEMENT_TITLE_SUGGESTIONS.map((option) => {
              const on = draft.titulo === option;
              return (
                <button
                  key={option}
                  type="button"
                  className={`portal-onboarding-chip${on ? ' portal-onboarding-chip--on' : ''}`}
                  onClick={() => onChange({ ...draft, titulo: option })}
                >
                  {on ? <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} /> : null}
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
          <label className="portal-onboarding-evidence__field">
            <span>Otro logro</span>
            <input
              className="portal-onboarding-field"
              value={draft.titulo}
              placeholder="Ej. Dupliqué cartera en retail"
              onChange={(e) => onChange({ ...draft, titulo: e.target.value })}
            />
          </label>
        </>
      ) : null}

      {phase === 'contexto' ? (
        <>
          <label className="portal-onboarding-evidence__field">
            <input
              className="portal-onboarding-field"
              value={draft.contexto}
              placeholder="Ej. Al reestructurar el equipo de 8 vendedores en Bogotá"
              onChange={(e) => onChange({ ...draft, contexto: e.target.value })}
            />
          </label>
        </>
      ) : null}

      {phase === 'cifra' ? (
        <>
          <div className="portal-onboarding-chips">
            {ACHIEVEMENT_CIFRA_SUGGESTIONS.map((option) => {
              const on = draft.cifra === option;
              return (
                <button
                  key={option}
                  type="button"
                  className={`portal-onboarding-chip${on ? ' portal-onboarding-chip--on' : ''}`}
                  onClick={() => onChange({ ...draft, cifra: option })}
                >
                  {on ? <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} /> : null}
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
          <label className="portal-onboarding-evidence__field">
            <span>Otra cifra</span>
            <input
              className="portal-onboarding-field"
              value={draft.cifra}
              placeholder="Ej. 18% margen bruto"
              onChange={(e) => onChange({ ...draft, cifra: e.target.value })}
            />
          </label>
        </>
      ) : null}

      {phase === 'tags' ? (
        <>
          <div className="portal-onboarding-chips">
            {EVIDENCE_COMPETENCY_TAGS.map((tag) => {
              const on = draft.competencias.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  className={`portal-onboarding-chip${on ? ' portal-onboarding-chip--on' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {on ? <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} /> : null}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
          {isEvidenceDraftComplete(draft) ? (
            <div className="portal-onboarding-evidence__preview">
              <p className="portal-onboarding-evidence__preview-title">{draft.titulo}</p>
              <p>{draft.contexto}</p>
              <strong>{draft.cifra}</strong>
            </div>
          ) : null}
        </>
      ) : null}
      </section>
    </div>
  );
}

export function canContinueEvidencePhase(phase: EvidencePhase, draft: EvidenceCard): boolean {
  if (phase === 'titulo') return draft.titulo.trim().length > 4;
  if (phase === 'contexto') return draft.contexto.trim().length > 8;
  if (phase === 'cifra') return draft.cifra.trim().length > 1;
  if (phase === 'tags') return draft.competencias.length > 0;
  return false;
}

export function nextEvidencePhase(phase: EvidencePhase): EvidencePhase | null {
  const idx = evidencePhaseIndex(phase);
  return EVIDENCE_PHASES[idx + 1] ?? null;
}

export function prevEvidencePhase(phase: EvidencePhase): EvidencePhase | null {
  const idx = evidencePhaseIndex(phase);
  return idx > 0 ? EVIDENCE_PHASES[idx - 1] : null;
}
