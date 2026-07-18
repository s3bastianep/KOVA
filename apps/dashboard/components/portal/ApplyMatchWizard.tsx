'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import type { ApplyMatchQuestion, YesNoValue } from '@/lib/portal-apply-questions';
import {
  allQuestionsAnswered,
  resolveApplyAnswers,
} from '@/lib/portal-apply-questions';

type ApplyMatchWizardProps = {
  open: boolean;
  vacancyTitle: string;
  questions: ApplyMatchQuestion[];
  submitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (answers: Record<string, string | string[]>) => void;
};

const ADVANCE_MS = 340;

export function ApplyMatchWizard({
  open,
  vacancyTitle,
  questions,
  submitting,
  error,
  onClose,
  onSubmit,
}: ApplyMatchWizardProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, YesNoValue>>({});
  const [animKey, setAnimKey] = useState(0);
  const [animPhase, setAnimPhase] = useState<'enter' | 'exit'>('enter');
  const [picked, setPicked] = useState<YesNoValue | null>(null);

  useEffect(() => {
    if (!open) return;
    setQuestionIndex(0);
    setAnswers({});
    setAnimKey(0);
    setAnimPhase('enter');
    setPicked(null);
  }, [open, questions]);

  const currentQuestion = questions[questionIndex];
  const progress = questions.length ? ((questionIndex + (picked ? 1 : 0)) / questions.length) * 100 : 0;
  const isLast = questionIndex >= questions.length - 1;
  const readyToSubmit = allQuestionsAnswered(questions, answers);

  const goNext = useCallback(() => {
    setAnimPhase('exit');
    window.setTimeout(() => {
      setQuestionIndex((i) => i + 1);
      setAnimKey((k) => k + 1);
      setAnimPhase('enter');
      setPicked(null);
    }, 160);
  }, []);

  const handlePick = useCallback(
    (value: YesNoValue) => {
      if (!currentQuestion || picked || submitting) return;

      const nextAnswers = { ...answers, [currentQuestion.id]: value };
      setPicked(value);
      setAnswers(nextAnswers);

      window.setTimeout(() => {
        if (isLast) {
          onSubmit(resolveApplyAnswers(questions, nextAnswers));
          return;
        }
        goNext();
      }, ADVANCE_MS);
    },
    [answers, currentQuestion, goNext, isLast, onSubmit, picked, questions, submitting],
  );

  if (!open || !currentQuestion) return null;

  return (
    <div className="apply-wizard-root">
      <button
        type="button"
        className="apply-wizard-backdrop"
        aria-label="Cerrar"
        onClick={submitting ? undefined : onClose}
      />

      <div role="dialog" aria-modal="true" aria-labelledby="apply-wizard-title" className="apply-wizard-panel">
        <div className="apply-wizard-progress-track" aria-hidden>
          <div className="apply-wizard-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <header className="apply-wizard-header">
          <div className="apply-wizard-header-text">
            <span className="apply-wizard-chip">Match rápido</span>
            <h2 id="apply-wizard-title" className="apply-wizard-title">
              {vacancyTitle}
            </h2>
          </div>
          <button type="button" onClick={onClose} disabled={submitting} className="apply-wizard-close" aria-label="Cerrar">
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </header>

        <div className="apply-wizard-body">
          <div className="apply-wizard-meta">
            <span className="apply-wizard-category">{currentQuestion.category}</span>
            <span className="apply-wizard-counter">
              {Math.min(questionIndex + 1, questions.length)} de {questions.length}
            </span>
          </div>

          <div key={animKey} className={`apply-wizard-question ${animPhase === 'enter' ? 'is-enter' : 'is-exit'}`}>
            <h3 className="apply-wizard-question-text">{currentQuestion.label}</h3>
            {currentQuestion.helpText ? <p className="apply-wizard-hint">{currentQuestion.helpText}</p> : null}
          </div>

          <div className={`apply-wizard-actions ${picked ? 'is-locked' : ''}`}>
            <button
              type="button"
              disabled={submitting || Boolean(picked)}
              onClick={() => handlePick('Sí')}
              className={`apply-wizard-choice apply-wizard-choice--yes ${picked === 'Sí' ? 'is-selected' : ''}`}
            >
              Sí
            </button>
            <button
              type="button"
              disabled={submitting || Boolean(picked)}
              onClick={() => handlePick('No')}
              className={`apply-wizard-choice apply-wizard-choice--no ${picked === 'No' ? 'is-selected' : ''}`}
            >
              No
            </button>
          </div>

          {picked && isLast && submitting ? (
            <p className="apply-wizard-status">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Enviando…
            </p>
          ) : null}

          {error ? <p className="apply-wizard-error">{error}</p> : null}
          {picked && isLast && !submitting && readyToSubmit && !error ? (
            <p className="apply-wizard-status">Listo</p>
          ) : null}
        </div>
      </div>

      <style jsx>{`
        .apply-wizard-root {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        @media (min-width: 640px) {
          .apply-wizard-root {
            align-items: center;
            padding: 1rem;
          }
        }

        .apply-wizard-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(8px);
          border: none;
          cursor: pointer;
        }

        .apply-wizard-panel {
          position: relative;
          width: 100%;
          max-width: 22rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.125rem 1.125rem 0 0;
          box-shadow: 0 24px 64px -16px rgba(0, 0, 0, 0.85);
        }
        @media (min-width: 640px) {
          .apply-wizard-panel {
            border-radius: 1.125rem;
          }
        }

        .apply-wizard-progress-track {
          height: 2px;
          background: rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
        }
        .apply-wizard-progress-fill {
          height: 100%;
          background: var(--kv-lime, #c5de4e);
          opacity: 0.9;
          transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .apply-wizard-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 1rem 1.125rem 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .apply-wizard-header-text {
          min-width: 0;
        }
        .apply-wizard-chip {
          display: inline-block;
          margin-bottom: 0.4rem;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          font-size: 0.5625rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: transparent;
        }
        .apply-wizard-title {
          margin: 0;
          font-family: var(--font-manrope), Manrope, sans-serif;
          font-size: 0.8125rem;
          font-weight: 500;
          line-height: 1.35;
          color: rgba(255, 255, 255, 0.72);
          letter-spacing: 0.01em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .apply-wizard-close {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.625rem;
          height: 1.625rem;
          border: none;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.45);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .apply-wizard-close:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.85);
        }

        .apply-wizard-body {
          padding: 1.125rem 1.125rem 1.25rem;
          display: flex;
          flex-direction: column;
          background: #0a0a0a;
        }

        .apply-wizard-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .apply-wizard-category {
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.42);
        }
        .apply-wizard-category::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--kv-lime, #c5de4e);
          margin-right: 7px;
          vertical-align: middle;
          opacity: 0.85;
        }
        .apply-wizard-counter {
          font-size: 0.625rem;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
          color: rgba(255, 255, 255, 0.38);
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
        }

        .apply-wizard-question {
          min-height: 4.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0.25rem 0;
          will-change: transform, opacity;
        }
        .apply-wizard-question.is-enter {
          animation: applyFadeUp 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .apply-wizard-question.is-exit {
          animation: applyFadeOut 0.16s ease-in both;
        }
        .apply-wizard-question-text {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 500;
          line-height: 1.45;
          letter-spacing: -0.015em;
          color: #ffffff;
        }
        .apply-wizard-hint {
          margin: 0.625rem 0 0;
          font-size: 0.75rem;
          line-height: 1.5;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.4);
        }

        .apply-wizard-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-top: 1.25rem;
          transition: opacity 0.2s ease;
        }
        .apply-wizard-actions.is-locked {
          opacity: 0.45;
          pointer-events: none;
        }

        .apply-wizard-choice {
          height: 2.5rem;
          border-radius: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          touch-action: manipulation;
          transition:
            transform 0.12s ease,
            background 0.15s ease,
            border-color 0.15s ease,
            color 0.15s ease,
            opacity 0.15s ease;
        }

        .apply-wizard-choice--yes {
          border: none;
          background: var(--kv-lime, #c5de4e);
          color: #0a0a0a;
        }
        .apply-wizard-choice--yes:hover:not(:disabled) {
          filter: brightness(1.06);
        }
        .apply-wizard-choice--yes.is-selected {
          filter: brightness(1.1);
          opacity: 1;
        }

        .apply-wizard-choice--no {
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: transparent;
          color: rgba(255, 255, 255, 0.55);
        }
        .apply-wizard-choice--no:hover:not(:disabled) {
          border-color: rgba(255, 255, 255, 0.28);
          color: rgba(255, 255, 255, 0.85);
          background: rgba(255, 255, 255, 0.04);
        }
        .apply-wizard-choice--no.is-selected {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.22);
          color: #ffffff;
        }

        .apply-wizard-choice:active:not(:disabled) {
          transform: scale(0.98);
        }

        .apply-wizard-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          margin: 0.875rem 0 0;
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.45);
        }

        .apply-wizard-error {
          margin: 0.875rem 0 0;
          padding: 0.5rem 0.625rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          color: #fca5a5;
          background: rgba(232, 92, 107, 0.08);
          border: 1px solid rgba(232, 92, 107, 0.2);
        }

        @keyframes applyFadeUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes applyFadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-3px);
          }
        }
      `}</style>
    </div>
  );
}
