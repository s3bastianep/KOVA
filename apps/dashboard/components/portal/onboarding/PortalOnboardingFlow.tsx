'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, Clock3, FileText, Loader2, Upload } from 'lucide-react';
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
import { normalizeEducation, normalizeWorkHistory } from '@/lib/cv-extract';
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
  const [profile, setProfile] = useState<CommercialProfile>(() => ({
    ...initialProfile,
    historialLaboral: normalizeWorkHistory(initialProfile.historialLaboral ?? []),
    formacion: normalizeEducation(initialProfile.formacion ?? []),
  }));
  const [extraction, setExtraction] = useState<CvExtractionResult | null>(null);
  const [counts, setCounts] = useState<OnboardingCounts | null>(null);
  const [analysisDone, setAnalysisDone] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setBusy(true);
    setError('');
    try {
      await saveStep('bridge', profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos guardar tu perfil');
    } finally {
      setBusy(false);
    }
  };

  const startQuestions = async () => {
    setQuestionIndex(0);
    await saveStep('questions');
  };

  const goBackQuestion = async () => {
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
      return;
    }
    await saveStep('bridge');
  };

  const questionOptions = (options: string[]) =>
    options.includes('Otro') ? options : [...options, 'Otro'];

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
      } else if (
        q.field === 'expectativaSalarial' ||
        q.field === 'industriaPrincipal' ||
        q.field === 'rol'
      ) {
        patch[q.field] = selected[0];
      } else if (q.field === 'crmVentas' || q.field === 'tipoCliente' || q.field === 'nivelInterlocutor') {
        patch[q.field] = selected.join(', ');
      } else if (q.field === 'coberturaGeografica') {
        patch.coberturaGeografica = selected.join(', ');
      } else if (q.field === 'naturaleza') {
        patch.naturaleza = selected.join(', ');
      } else if (q.field === 'funcionPrincipal') {
        patch.funcionPrincipal = selected.join(', ');
        if (selected.includes('Hunter')) patch.enfoque = 'Hunter';
        if (selected.includes('Farmer')) patch.enfoque = 'Farmer';
        if (selected.some((s) => s.includes('consultiva'))) patch.tipoVenta = 'Consultiva';
      } else if (q.field === 'tipoVenta') {
        patch.tipoVenta = selected.join(', ');
      } else if (q.field === 'modalidadTrabajo') {
        patch.modalidadTrabajo = selected.join(', ');
      } else if (q.field === 'disponibilidadViajar' || q.field === 'disponibilidadReubicacion') {
        patch[q.field] = selected[0];
      }
    }
    return patch;
  };

  useEffect(() => {
    if (step !== 'cv_review' && step !== 'questions') return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSaveStatus('saving');
      const profilePatch = step === 'questions' ? applyQuestionAnswers() : profile;
      portalApi
        .updateOnboarding({
          onboardingStep: step,
          profile: profilePatch as Record<string, unknown>,
        })
        .then(() => setSaveStatus('saved'))
        .catch(() => setSaveStatus('error'));
    }, 450);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [answers, profile, step]);

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
        profile.nombre && 'Nombre',
        profile.email && 'Correo',
        profile.telefono && 'Teléfono',
        displayCounts.experiencias > 0 && `${displayCounts.experiencias} experiencias laborales`,
        displayCounts.estudios > 0 && `${displayCounts.estudios} estudios`,
        displayCounts.certificaciones > 0 && `${displayCounts.certificaciones} certificaciones`,
        displayCounts.idiomas > 0 && `${displayCounts.idiomas} idiomas`,
        displayCounts.cursos > 0 && `${displayCounts.cursos} cursos`,
        (profile.herramientas?.length ?? 0) > 0 && `${profile.herramientas?.length ?? 0} habilidades`,
      ].filter(Boolean) as string[],
    [displayCounts, profile],
  );

  const onboardingChecklist = [
    { id: 'account', label: 'Cuenta creada', eta: '< 1 min', done: true },
    { id: 'cv', label: 'Subir hoja de vida', eta: '2 min', done: step !== 'welcome' },
    {
      id: 'review',
      label: 'Revisar información',
      eta: '3 min',
      done: ['cv_review', 'bridge', 'questions', 'done'].includes(step),
    },
    { id: 'sales', label: 'Cuéntanos cómo vendes', eta: '2 min', done: ['questions', 'done'].includes(step) },
    { id: 'prefs', label: 'Preferencias laborales', eta: '1 min', done: step === 'done' },
    { id: 'complete', label: 'Perfil completo', eta: 'Listo', done: step === 'done' },
  ];
  const checklistDone = onboardingChecklist.filter((item) => item.done).length;
  const checklistPercent = Math.round((checklistDone / onboardingChecklist.length) * 100);

  if (step === 'welcome') {
    return (
      <div className="portal-onboarding portal-onboarding--welcome">
        <div className="portal-onboarding-shell">
          <header className="portal-onboarding-shell__header">
            <span className="portal-onboarding-eyebrow">Bienvenido a Kova</span>
            <h1>Hola, {firstName}</h1>
            <p className="portal-onboarding-lead">
              Tu cuenta ya está lista. Sube tu hoja de vida y organizamos la mayor parte de tu perfil por ti.
            </p>
            <p className="portal-onboarding-time">
              <Clock3 className="w-3.5 h-3.5" aria-hidden />
              Tiempo aproximado: 5 minutos
            </p>
          </header>

          <div className="portal-onboarding-progress-block">
            <div className="portal-onboarding-progress-head">
              <span>Progreso del perfil</span>
              <strong>{checklistPercent}%</strong>
            </div>
            <div className="portal-onboarding-progress" role="progressbar" aria-valuenow={checklistPercent} aria-valuemin={0} aria-valuemax={100}>
              <span style={{ width: `${checklistPercent}%` }} />
            </div>
          </div>

          <ul className="portal-onboarding-checklist">
            {onboardingChecklist.map((item) => (
              <li key={item.id} className={item.done ? 'is-done' : undefined}>
                <span className="portal-onboarding-checklist__icon" aria-hidden>
                  {item.done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                </span>
                <span className="portal-onboarding-checklist__label">{item.label}</span>
                <span className="portal-onboarding-checklist__eta">{item.eta}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="portal-onboarding-btn portal-onboarding-btn--primary"
            onClick={() => {
              void saveStep('cv_upload');
            }}
          >
            Comenzar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'cv_upload') {
    return (
      <div className="portal-onboarding portal-onboarding--upload">
        <div className="portal-onboarding-shell">
          <header className="portal-onboarding-shell__header portal-onboarding-shell__header--compact">
            <h1>Sube tu hoja de vida</h1>
            <p className="portal-onboarding-lead">Arrastra PDF o Word. Nosotros hacemos el resto.</p>
          </header>

          <div
            className="portal-onboarding-upload-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              void handleFile(e.dataTransfer.files?.[0]);
            }}
          >
            <input
              ref={inputRef}
              id="portal-cv-file"
              type="file"
              accept={CV_FILE_ACCEPT}
              className="sr-only"
              onChange={(e) => void handleFile(e.target.files?.[0])}
            />
            <div className="portal-onboarding-upload-icon" aria-hidden>
              <FileText className="w-6 h-6" />
            </div>
            <p className="portal-onboarding-upload-title">Arrastra tu hoja de vida aquí</p>
            <p className="portal-onboarding-upload-or">o</p>
            <label htmlFor="portal-cv-file" className="portal-onboarding-btn portal-onboarding-btn--primary portal-onboarding-upload-btn">
              <Upload className="w-4 h-4" />
              Subir hoja de vida
            </label>
            <p className="portal-onboarding-upload-hint">PDF, DOC o DOCX · máximo 5 MB</p>
          </div>

          {error ? <p className="portal-onboarding-error">{error}</p> : null}
          {busy ? (
            <p className="portal-onboarding-busy">
              <Loader2 className="w-4 h-4 animate-spin" /> Preparando análisis...
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  if (step === 'cv_analyzing') {
    return (
      <div className="portal-onboarding portal-onboarding--welcome">
        <div className="portal-onboarding-shell portal-onboarding-analyze">
          <h2>Analizando tu hoja de vida...</h2>
          <p className="text-sm">Esto puede tardar unos segundos.</p>
          <div className="portal-onboarding-progress mt-4" aria-hidden>
            <span style={{ width: `${analysisProgress}%` }} />
          </div>
          <ul className="portal-onboarding-steps">
            {CV_ANALYSIS_STEPS.map((label, i) => (
              <li key={label} className={i < analysisDone ? 'is-done' : undefined}>
                {i < analysisDone ? <Check className="w-4 h-4 text-[var(--kova-lime)]" /> : <span className="w-4 h-4" />}
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
      <div className="portal-onboarding portal-onboarding--welcome">
        <div className="portal-onboarding-shell">
          <header className="portal-onboarding-shell__header portal-onboarding-shell__header--compact">
            <h1>Encontramos esta información</h1>
            <p className="portal-onboarding-lead">Revisa que todo se vea correcto antes de continuar.</p>
          </header>
          {summaryLines.length > 0 ? (
            summaryLines.map((line) => (
              <div key={line} className="portal-onboarding-summary-item">
                <Check className="w-4 h-4 text-[var(--kova-lime)] shrink-0" />
                <span>{line}</span>
              </div>
            ))
          ) : (
            <p className="portal-onboarding-lead text-center">
              No detectamos secciones claras. Puedes completar tu perfil manualmente en el siguiente paso.
            </p>
          )}
          <p className="text-center font-medium mt-4 mb-2 text-white">¿Todo se ve correcto?</p>
          <button type="button" className="portal-onboarding-btn portal-onboarding-btn--primary" onClick={() => void goToReview()}>
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
        <div className="portal-onboarding-shell">
          <header className="portal-onboarding-shell__header portal-onboarding-shell__header--compact text-left">
            <h1 className="text-left">Revisa tu información</h1>
            <p className="portal-onboarding-lead text-left mx-0">No escribes desde cero. Solo corrige lo que haga falta.</p>
          </header>
          <div className="portal-onboarding-save-state">
            {saveStatus === 'saving' ? 'Guardando cambios...' : null}
            {saveStatus === 'saved' ? '✓ Todos los cambios guardados' : null}
            {saveStatus === 'error' ? 'No pudimos guardar automáticamente. Reintentando...' : null}
          </div>
          <PortalOnboardingReviewCards profile={profile} onChange={setProfile} />
          {error ? <p className="portal-onboarding-error">{error}</p> : null}
          <button
            type="button"
            className="portal-onboarding-btn portal-onboarding-btn--primary mt-8"
            disabled={busy}
            onClick={() => void confirmReview()}
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Toda mi información está correcta — Continuar
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'bridge') {
    return (
      <div className="portal-onboarding portal-onboarding--welcome">
        <div className="portal-onboarding-shell text-center">
          <span className="portal-onboarding-eyebrow">Perfil ~80% listo</span>
          <h1 className="text-xl sm:text-2xl mb-3">Hemos completado aproximadamente el 80% de tu perfil.</h1>
          <p className="portal-onboarding-lead">
            Solo necesitamos 2 minutos más para entender cómo vendes y recomendarte las mejores vacantes.
          </p>
          <button type="button" className="portal-onboarding-btn portal-onboarding-btn--primary" onClick={() => void startQuestions()}>
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'questions' && currentQuestion) {
    const selected = answers[currentQuestion.id] ?? [];
    const questionPercent = Math.round((questionIndex / Math.max(SMART_QUESTIONS.length - 1, 1)) * 100);
    const options = questionOptions(currentQuestion.options);
    return (
      <div className="portal-onboarding portal-onboarding--questions">
        <div className="portal-onboarding-shell portal-onboarding-question-shell">
          <header className="portal-onboarding-question-header">
            <div className="portal-onboarding-question-meta">
              <span>Paso 3 de 5</span>
              <span>
                Pregunta {questionIndex + 1} de {SMART_QUESTIONS.length}
              </span>
            </div>
            <div
              className="portal-onboarding-progress"
              role="progressbar"
              aria-valuenow={questionPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${questionPercent}%` }} />
            </div>
          </header>

          <div className="portal-onboarding-question-body">
            <h2 className="portal-onboarding-question-title">{currentQuestion.title}</h2>
            {currentQuestion.subtitle ? (
              <p className="portal-onboarding-question-subtitle">{currentQuestion.subtitle}</p>
            ) : currentQuestion.multi ? (
              <p className="portal-onboarding-question-subtitle">Selecciona todas las que apliquen.</p>
            ) : null}

            <div className="portal-onboarding-chips">
              {options.map((option) => {
                const on = selected.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    className={`portal-onboarding-chip${on ? ' portal-onboarding-chip--on' : ''}`}
                    onClick={() => toggleAnswer(currentQuestion.id, option, currentQuestion.multi)}
                  >
                    {on ? <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} /> : null}
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {error ? <p className="portal-onboarding-error">{error}</p> : null}

          <footer className="portal-onboarding-question-footer">
            <div className="portal-onboarding-save-state">
              {saveStatus === 'saving' ? 'Guardando cambios...' : null}
              {saveStatus === 'saved' ? '✓ Todos los cambios guardados' : null}
              {saveStatus === 'error' ? 'No pudimos guardar automáticamente.' : null}
            </div>

            <div className="portal-onboarding-question-actions">
              <button
                type="button"
                className="portal-onboarding-btn portal-onboarding-btn--back"
                onClick={() => void goBackQuestion()}
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>
              <button
                type="button"
                className="portal-onboarding-btn portal-onboarding-btn--primary portal-onboarding-btn--continue"
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

            <button
              type="button"
              className="portal-onboarding-question-exit"
              onClick={() => void saveStep('questions')}
            >
              Guardar y salir
            </button>
          </footer>
        </div>
      </div>
    );
  }

  return null;
}
