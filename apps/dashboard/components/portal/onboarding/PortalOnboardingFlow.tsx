'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, FileText, Loader2, Upload } from 'lucide-react';
import type { CvExtractionResult } from '@/lib/cv-extract';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import { portalApi } from '@/lib/api';
import { getStoredUser } from '@/lib/api';
import { enrichCvExtraction } from '@/app/registro/registro-utils';
import { CV_FILE_ACCEPT } from '@/lib/cv-file-formats';
import {
  CV_ANALYSIS_STEPS,
  SMART_QUESTIONS,
  applyFullCvExtraction,
  countsFromExtraction,
  countsFromProfile,
  type OnboardingCounts,
  type OnboardingStep,
} from '@/lib/portal-onboarding';
import { PortalOnboardingReviewCards } from './PortalOnboardingReviewCards';
import './portal-onboarding.css';

type Props = {
  initialProfile: CommercialProfile;
  initialStep: OnboardingStep;
  onComplete: () => void;
};

export function PortalOnboardingFlow({ initialProfile, initialStep, onComplete }: Props) {
  const user = getStoredUser();
  const firstName = user?.firstName ?? initialProfile.nombre?.split(' ')[0] ?? 'Candidato';

  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [profile, setProfile] = useState<CommercialProfile>(initialProfile);
  const [extraction, setExtraction] = useState<CvExtractionResult | null>(null);
  const [counts, setCounts] = useState<OnboardingCounts | null>(null);
  const [analysisDone, setAnalysisDone] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.classList.add('portal-onboarding-active');
    return () => document.documentElement.classList.remove('portal-onboarding-active');
  }, []);

  const saveStep = useCallback(async (next: OnboardingStep, profilePatch?: Partial<CommercialProfile>) => {
    await portalApi.updateOnboarding({
      onboardingStep: next,
      ...(profilePatch ? { profile: profilePatch as Record<string, unknown> } : {}),
    });
    setStep(next);
  }, []);

  const runAnalysisAnimation = useCallback(async (uploadPromise: Promise<CvExtractionResult>) => {
    setStep('cv_analyzing');
    setAnalysisDone(0);
    await saveStep('cv_analyzing');

    const delays = CV_ANALYSIS_STEPS.map((_, i) =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          setAnalysisDone(i + 1);
          resolve();
        }, 420 + i * 380);
      }),
    );

    const animation = Promise.all(delays);
    const [result] = await Promise.all([uploadPromise, animation]);

    const aligned = enrichCvExtraction(result, profile);
    const nextProfile = applyFullCvExtraction(profile, aligned);
    setExtraction(aligned);
    setProfile(nextProfile);
    setCounts(countsFromExtraction(aligned));
    await portalApi.updateOnboarding({
      onboardingStep: 'cv_summary',
      profile: nextProfile as Record<string, unknown>,
    });
    setStep('cv_summary');
  }, [profile, saveStep]);

  const handleFile = async (file: File | null | undefined) => {
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      const uploadPromise = portalApi.uploadCv(file) as Promise<CvExtractionResult>;
      await runAnalysisAnimation(uploadPromise);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos leer tu archivo.');
      setStep('cv_upload');
    } finally {
      setBusy(false);
    }
  };

  const goToReview = async () => {
    await saveStep('cv_review', profile);
  };

  const confirmReview = async () => {
    await portalApi.updateOnboarding({
      profile: profile as Record<string, unknown>,
      onboardingStep: 'bridge',
    });
  };

  const startQuestions = async () => {
    await saveStep('questions');
  };

  const toggleAnswer = (questionId: string, option: string, multi: boolean) => {
    setAnswers((prev) => {
      const current = prev[questionId] ?? [];
      if (!multi) return { ...prev, [questionId]: [option] };
      const has = current.includes(option);
      return {
        ...prev,
        [questionId]: has ? current.filter((o) => o !== option) : [...current, option],
      };
    });
  };

  const applyQuestionAnswers = (): Partial<CommercialProfile> => {
    const patch: Partial<CommercialProfile> = {};
    for (const q of SMART_QUESTIONS) {
      const selected = answers[q.id] ?? [];
      if (selected.length === 0) continue;
      if (q.field === 'industrias' || q.field === 'herramientas') {
        patch[q.field] = selected;
      } else if (q.field === 'expectativaSalarial' || q.field === 'crmVentas' || q.field === 'tipoCliente') {
        patch[q.field] = selected[0];
      } else if (q.field === 'funcionPrincipal') {
        patch.funcionPrincipal = selected.join(', ');
        if (selected.includes('Hunter')) patch.enfoque = 'Hunter';
        if (selected.includes('Farmer')) patch.enfoque = 'Farmer';
        if (selected.some((s) => s.includes('consultiva'))) patch.tipoVenta = 'Consultiva';
      }
    }
    return patch;
  };

  const finishQuestions = async () => {
    setBusy(true);
    try {
      const patch = applyQuestionAnswers();
      const merged = { ...profile, ...patch };
      await portalApi.updateOnboarding({
        profile: merged as Record<string, unknown>,
        completeOnboarding: true,
      });
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos guardar tu perfil');
    } finally {
      setBusy(false);
    }
  };

  const displayCounts = counts ?? countsFromProfile(profile);
  const analysisProgress = Math.round((analysisDone / CV_ANALYSIS_STEPS.length) * 100);
  const currentQuestion = SMART_QUESTIONS[questionIndex];
  const isLastQuestion = questionIndex >= SMART_QUESTIONS.length - 1;

  const summaryLines = useMemo(
    () =>
      [
        displayCounts.experiencias > 0 && `${displayCounts.experiencias} experiencias laborales`,
        displayCounts.estudios > 0 && `${displayCounts.estudios} estudios`,
        displayCounts.certificaciones > 0 && `${displayCounts.certificaciones} certificaciones`,
        displayCounts.idiomas > 0 && `${displayCounts.idiomas} idiomas`,
        displayCounts.cursos > 0 && `${displayCounts.cursos} cursos`,
      ].filter(Boolean) as string[],
    [displayCounts],
  );

  if (step === 'welcome') {
    return (
      <div className="portal-onboarding">
        <div className="portal-onboarding-hero">
          <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)]">
            Bienvenido a Kova
          </p>
          <h1>Hola {firstName} 👋</h1>
          <p>Antes de comenzar, sube tu hoja de vida.</p>
        </div>
        <div className="portal-onboarding-card">
          <button
            type="button"
            className="portal-onboarding-btn"
            onClick={() => {
              void saveStep('cv_upload');
            }}
          >
            <Upload className="w-4 h-4" />
            Subir hoja de vida
          </button>
        </div>
      </div>
    );
  }

  if (step === 'cv_upload') {
    return (
      <div className="portal-onboarding">
        <div className="portal-onboarding-hero">
          <h1>Sube tu hoja de vida</h1>
          <p>Arrastra PDF o Word. Nosotros hacemos el resto.</p>
        </div>
        <div
          className="portal-onboarding-drop"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <input
            ref={inputRef}
            type="file"
            accept={CV_FILE_ACCEPT}
            className="sr-only"
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
          <FileText className="w-10 h-10 mx-auto mb-3 text-[var(--kova-muted)]" />
          <p className="font-medium">Selecciona un archivo o arrástralo aquí</p>
          <p className="text-sm text-[var(--kova-muted)] mt-1">PDF, DOC o DOCX · máximo 5 MB</p>
        </div>
        {error ? <p className="text-sm text-red-600 mt-3">{error}</p> : null}
        {busy ? (
          <p className="text-sm text-[var(--kova-muted)] mt-3 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Preparando análisis...
          </p>
        ) : null}
      </div>
    );
  }

  if (step === 'cv_analyzing') {
    return (
      <div className="portal-onboarding">
        <div className="portal-onboarding-card portal-onboarding-analyze">
          <h2>Analizando tu hoja de vida...</h2>
          <p className="text-sm text-[var(--kova-muted)]">Esto puede tardar unos segundos.</p>
          <div className="portal-onboarding-progress" aria-hidden>
            <span style={{ width: `${analysisProgress}%` }} />
          </div>
          <ul className="portal-onboarding-steps">
            {CV_ANALYSIS_STEPS.map((label, i) => (
              <li key={label} className={i < analysisDone ? 'is-done' : undefined}>
                {i < analysisDone ? <Check className="w-4 h-4 text-[var(--kova-lime-dark)]" /> : <span className="w-4 h-4" />}
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (step === 'cv_summary') {
    return (
      <div className="portal-onboarding">
        <div className="portal-onboarding-hero">
          <h1>Encontramos esta información</h1>
          <p>Revisa que todo se vea correcto antes de continuar.</p>
        </div>
        <div className="portal-onboarding-card">
          {summaryLines.length > 0 ? (
            summaryLines.map((line) => (
              <div key={line} className="portal-onboarding-summary-item">
                <Check className="w-4 h-4 text-[var(--kova-lime-dark)] shrink-0" />
                <span>{line}</span>
              </div>
            ))
          ) : (
            <p className="text-[var(--kova-muted)] text-sm">
              No detectamos secciones claras. Puedes completar tu perfil manualmente en el siguiente paso.
            </p>
          )}
          <p className="font-medium mt-4 mb-4">¿Todo se ve correcto?</p>
          <button type="button" className="portal-onboarding-btn" onClick={() => void goToReview()}>
            Revisar información
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'cv_review') {
    return (
      <div className="portal-onboarding max-w-3xl">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold">Revisa tu información</h1>
          <p className="text-[var(--kova-muted)] mt-1">No escribes desde cero. Solo corrige lo que haga falta.</p>
        </div>
        <PortalOnboardingReviewCards profile={profile} onChange={setProfile} />
        <button
          type="button"
          className="portal-onboarding-btn mt-8"
          onClick={() => void confirmReview()}
        >
          <Check className="w-4 h-4" />
          Toda mi información está correcta — Continuar
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (step === 'bridge') {
    return (
      <div className="portal-onboarding">
        <div className="portal-onboarding-card text-center py-8">
          <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)] mb-3">
            Perfil ~80% listo
          </p>
          <h2 className="font-heading text-xl font-bold mb-3">
            Hemos completado aproximadamente el 80% de tu perfil.
          </h2>
          <p className="text-[var(--kova-muted)] max-w-md mx-auto mb-6">
            Solo necesitamos 2 minutos más para entender cómo vendes y recomendarte las mejores vacantes.
          </p>
          <button type="button" className="portal-onboarding-btn" onClick={() => void startQuestions()}>
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'questions' && currentQuestion) {
    const selected = answers[currentQuestion.id] ?? [];
    return (
      <div className="portal-onboarding">
        <div className="portal-onboarding-card">
          <p className="text-xs text-[var(--kova-muted)] mb-2">
            Pregunta {questionIndex + 1} de {SMART_QUESTIONS.length}
          </p>
          <h2 className="font-heading text-xl font-bold">{currentQuestion.title}</h2>
          {currentQuestion.subtitle ? (
            <p className="text-sm text-[var(--kova-muted)] mt-1">{currentQuestion.subtitle}</p>
          ) : null}
          <div className="portal-onboarding-chips mt-5">
            {currentQuestion.options.map((option) => {
              const on = selected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  className={`portal-onboarding-chip${on ? ' portal-onboarding-chip--on' : ''}`}
                  onClick={() => toggleAnswer(currentQuestion.id, option, currentQuestion.multi)}
                >
                  {on ? <Check className="w-3.5 h-3.5" /> : null}
                  {option}
                </button>
              );
            })}
          </div>
          {error ? <p className="text-sm text-red-600 mt-3">{error}</p> : null}
          <button
            type="button"
            className="portal-onboarding-btn mt-6"
            disabled={busy || (!currentQuestion.multi && selected.length === 0)}
            onClick={() => {
              if (isLastQuestion) void finishQuestions();
              else setQuestionIndex((i) => i + 1);
            }}
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : isLastQuestion ? (
              'Finalizar'
            ) : (
              <>
                Continuar
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
