'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  FileText,
  GraduationCap,
  Languages,
  Loader2,
  Sparkles,
  Upload,
  User,
} from 'lucide-react';
import type { CvExtractionResult } from '@/lib/cv-extract';
import type { CommercialProfile, CompetencyEntry } from '@/lib/candidate-commercial-profile';
import { portalApi } from '@/lib/api';
import { getStoredUser } from '@/lib/api';
import { enrichCvExtraction } from '@/app/registro/registro-utils';
import { CV_FILE_ACCEPT } from '@/lib/cv-file-formats';
import {
  CV_ANALYSIS_STEPS,
  applyFullCvExtraction,
  countsFromExtraction,
  countsFromProfile,
  type OnboardingCounts,
  type OnboardingStep,
} from '@/lib/portal-onboarding';
import {
  ONBOARDING_MACRO_LABELS,
  REVIEW_SECTIONS,
  canContinueFromReviewHub,
  estimatedMinutesLeft,
  macroStepIndex,
  motivationalMessage,
  normalizeOnboardingStep,
  profileCompletenessScore,
  type ReviewSectionId,
  unifiedProgressPercent,
} from '@/lib/portal-onboarding-unified';
import {
  answersFromProfile,
  applyPreferenciasAnswers,
  getActiveSteps,
  SALARY_SLIDER_LABELS,
  salarySliderIndex,
} from '@/lib/portal-preferencias-wizard';
import { normalizeEducation, normalizeWorkHistory } from '@/lib/cv-extract';
import {
  applyCompetencyRatings,
  applyLanguageLevels,
  competencyDefsForProfile,
  draftEvidenceFromProfile,
  EVIDENCE_PHASES,
  mergeEvidenceIntoProfile,
  type EvidencePhase,
} from '@/lib/portal-onboarding-evidence';
import {
  canContinueCompetencyStep,
  PortalOnboardingCompetencies,
} from './PortalOnboardingCompetencies';
import {
  canContinueEvidencePhase,
  nextEvidencePhase,
  PortalOnboardingEvidence,
  prevEvidencePhase,
} from './PortalOnboardingEvidence';
import { PortalOnboardingReviewCards } from './PortalOnboardingReviewCards';
import { PortalOnboardingReviewHub } from './PortalOnboardingReviewHub';
import {
  canContinuePreferenciasStep,
  PortalOnboardingPreferencias,
} from './PortalOnboardingPreferencias';
import { PortalOnboardingFooter, PortalOnboardingShell } from './PortalOnboardingShell';
import './portal-onboarding.css';

type Props = {
  initialProfile: CommercialProfile;
  initialStep: OnboardingStep;
  initialSubStep?: number;
  initialReviewed?: string[];
  onComplete: () => void;
};

export function PortalOnboardingFlow({
  initialProfile,
  initialStep,
  initialSubStep = 0,
  initialReviewed = [],
  onComplete,
}: Props) {
  const user = getStoredUser();
  const firstName = user?.firstName ?? initialProfile.nombre?.split(' ')[0] ?? 'Candidato';

  const normalizedInitial = normalizeOnboardingStep(initialStep);

  const [step, setStep] = useState<OnboardingStep>(() => normalizedInitial);
  const [profile, setProfile] = useState<CommercialProfile>(() => ({
    ...initialProfile,
    historialLaboral: normalizeWorkHistory(initialProfile.historialLaboral ?? []),
    formacion: normalizeEducation(initialProfile.formacion ?? []),
  }));
  const [counts, setCounts] = useState<OnboardingCounts | null>(null);
  const [analysisDone, setAnalysisDone] = useState(0);
  const [prefAnswers, setPrefAnswers] = useState<Record<string, string[]>>(() =>
    answersFromProfile(initialProfile),
  );
  const [prefStepIndex, setPrefStepIndex] = useState(
    () => (normalizedInitial === 'preferencias' ? initialSubStep : 0),
  );
  const [salaryIdx, setSalaryIdx] = useState(() => salarySliderIndex(initialProfile.expectativaSalarial));
  const [languageLevels, setLanguageLevels] = useState<Record<string, string>>(() => {
    const levels: Record<string, string> = {};
    for (const lang of initialProfile.idiomas ?? []) {
      if (lang.idioma?.trim()) levels[lang.idioma] = lang.nivel?.trim() ?? '';
    }
    return levels;
  });
  const [evidenceDraft, setEvidenceDraft] = useState(() => draftEvidenceFromProfile(initialProfile));
  const [reviewEditSection, setReviewEditSection] = useState<ReviewSectionId>('experiencia');
  const [evidencePhase, setEvidencePhase] = useState<EvidencePhase>(
    () => (normalizedInitial === 'evidence' ? EVIDENCE_PHASES[initialSubStep] ?? 'titulo' : 'titulo'),
  );
  const [competencyRatings, setCompetencyRatings] = useState<Record<string, CompetencyEntry>>(
    () => ({ ...(initialProfile.competencias ?? {}) }),
  );
  const [competencyIndex, setCompetencyIndex] = useState(
    () => (normalizedInitial === 'competencies' ? initialSubStep : 0),
  );
  const [reviewed, setReviewed] = useState<Set<ReviewSectionId>>(
    () => new Set(initialReviewed as ReviewSectionId[]),
  );
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePrefSteps = useMemo(() => getActiveSteps(profile), [profile]);
  const currentPrefStep = activePrefSteps[prefStepIndex];

  const buildMergedProfile = useCallback((): CommercialProfile => {
    let merged = applyPreferenciasAnswers(prefAnswers, profile);
    merged = applyLanguageLevels(merged, languageLevels);
    if (canContinueEvidencePhase('tags', evidenceDraft)) {
      merged = mergeEvidenceIntoProfile(merged, evidenceDraft);
    }
    return applyCompetencyRatings(merged, competencyRatings);
  }, [competencyRatings, evidenceDraft, languageLevels, prefAnswers, profile]);

  const percent = unifiedProgressPercent(
    step,
    profile,
    prefStepIndex,
    prefAnswers,
    evidencePhase,
    competencyIndex,
  );
  const minutesLeft = estimatedMinutesLeft(step, profile, prefStepIndex, competencyIndex);
  const motivation = motivationalMessage(percent);
  const macroIndex = macroStepIndex(step);

  useEffect(() => {
    document.documentElement.classList.add('portal-onboarding-active');
    return () => document.documentElement.classList.remove('portal-onboarding-active');
  }, []);

  const persist = useCallback(
    async (patch: {
      nextStep?: OnboardingStep;
      profilePatch?: Partial<CommercialProfile>;
      subStep?: number;
      reviewedIds?: ReviewSectionId[];
      complete?: boolean;
    }) => {
      const reviewedIds = patch.reviewedIds ?? [...reviewed];
      const body = {
        onboardingStep: patch.nextStep ?? step,
        onboardingSubStep: patch.subStep ?? prefStepIndex,
        onboardingReviewed: reviewedIds,
        ...(patch.profilePatch ? { profile: patch.profilePatch as Record<string, unknown> } : {}),
        ...(patch.complete ? { completeOnboarding: true } : {}),
      };

      if (patch.complete) {
        const merged = buildMergedProfile();
        await portalApi.updateOnboarding({
          ...body,
          profile: merged as Record<string, unknown>,
          completeOnboarding: true,
        });
        return;
      }

      await portalApi.updateOnboarding({
        ...body,
        ...(patch.profilePatch || step === 'preferencias' || step === 'evidence' || step === 'competencies'
          ? { profile: (patch.profilePatch ?? buildMergedProfile()) as Record<string, unknown> }
          : {}),
      });
      if (patch.nextStep) setStep(patch.nextStep);
      if (patch.subStep !== undefined) {
        if ((patch.nextStep ?? step) === 'preferencias') setPrefStepIndex(patch.subStep);
        if ((patch.nextStep ?? step) === 'competencies') setCompetencyIndex(patch.subStep);
        if ((patch.nextStep ?? step) === 'evidence') {
          setEvidencePhase(EVIDENCE_PHASES[patch.subStep] ?? 'titulo');
        }
      }
    },
    [buildMergedProfile, prefStepIndex, reviewed, step],
  );

  const saveStep = useCallback(
    async (next: OnboardingStep, profilePatch?: Partial<CommercialProfile>, subStep?: number) => {
      setSaveStatus('saving');
      try {
        await persist({ nextStep: next, profilePatch, subStep });
        setSaveStatus('saved');
      } catch (err) {
        setSaveStatus('error');
        throw err;
      }
    },
    [persist],
  );

  const handleSaveExit = async () => {
    setBusy(true);
    try {
      const merged = buildMergedProfile();
      await portalApi.updateOnboarding({
        onboardingStep: step,
        onboardingSubStep:
          step === 'competencies'
            ? competencyIndex
            : step === 'evidence'
              ? EVIDENCE_PHASES.indexOf(evidencePhase)
              : prefStepIndex,
        onboardingReviewed: [...reviewed],
        profile: merged as Record<string, unknown>,
      });
    } catch {
      setError('No pudimos guardar tu progreso.');
    } finally {
      setBusy(false);
    }
  };

  const runAnalysisAnimation = useCallback(
    async (uploadPromise: Promise<CvExtractionResult>) => {
      setStep('cv_analyzing');
      setAnalysisDone(0);
      await saveStep('cv_analyzing');

      const delays = CV_ANALYSIS_STEPS.map((_, i) =>
        new Promise<void>((resolve) => {
          setTimeout(() => {
            setAnalysisDone(i + 1);
            resolve();
          }, 450 + i * 400);
        }),
      );

      const [result] = await Promise.all([uploadPromise, Promise.all(delays)]);

      const aligned = enrichCvExtraction(result, profile);
      const nextProfile = applyFullCvExtraction(profile, aligned);
      setProfile(nextProfile);
      setPrefAnswers(answersFromProfile(nextProfile));
      setCounts(countsFromExtraction(aligned));
      await saveStep('cv_summary', nextProfile);
    },
    [profile, saveStep],
  );

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

  const togglePrefAnswer = (stepId: string, option: string, multi: boolean) => {
    setPrefAnswers((prev) => {
      const current = prev[stepId] ?? [];
      const next = !multi
        ? current.includes(option)
          ? []
          : [option]
        : current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option];
      return { ...prev, [stepId]: next };
    });
  };

  const handleSalaryChange = (index: number) => {
    setSalaryIdx(index);
    setPrefAnswers((prev) => ({ ...prev, salario: [SALARY_SLIDER_LABELS[index]] }));
  };

  const handleLanguageLevel = (idioma: string, nivel: string) => {
    setLanguageLevels((prev) => ({ ...prev, [idioma]: nivel }));
  };

  useEffect(() => {
    if (!['cv_review', 'review_hub', 'preferencias', 'evidence', 'competencies'].includes(step)) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSaveStatus('saving');
      const merged = buildMergedProfile();
      portalApi
        .updateOnboarding({
          onboardingStep: step,
          onboardingSubStep:
            step === 'competencies'
              ? competencyIndex
              : step === 'evidence'
                ? EVIDENCE_PHASES.indexOf(evidencePhase)
                : prefStepIndex,
          onboardingReviewed: [...reviewed],
          profile: merged as Record<string, unknown>,
        })
        .then(() => setSaveStatus('saved'))
        .catch(() => setSaveStatus('error'));
    }, 420);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [
    buildMergedProfile,
    competencyIndex,
    competencyRatings,
    evidenceDraft,
    evidencePhase,
    languageLevels,
    prefAnswers,
    prefStepIndex,
    profile,
    reviewed,
    step,
  ]);

  const displayCounts = counts ?? countsFromProfile(profile);
  const analysisProgress = Math.round((analysisDone / CV_ANALYSIS_STEPS.length) * 100);

  const cvSummary = useMemo(() => {
    const fields = [
      { label: 'Nombre', value: profile.nombre?.trim() },
      { label: 'Correo', value: profile.email?.trim() },
      { label: 'Teléfono', value: profile.telefono?.trim() },
      { label: 'Ciudad', value: profile.ciudad?.trim() },
    ].filter((item) => Boolean(item.value));

    const stats = [
      {
        label: 'Experiencias',
        count: displayCounts.experiencias,
        icon: Briefcase,
      },
      {
        label: 'Estudios',
        count: displayCounts.estudios,
        icon: GraduationCap,
      },
      {
        label: 'Idiomas',
        count: displayCounts.idiomas,
        icon: Languages,
      },
      {
        label: 'Certificaciones',
        count: displayCounts.certificaciones,
        icon: FileText,
      },
    ].filter((item) => item.count > 0);

    return { fields, stats };
  }, [displayCounts, profile]);

  const markReviewed = (section: ReviewSectionId) => {
    setReviewed((prev) => new Set([...prev, section]));
  };

  const goPrefNext = async () => {
    if (!currentPrefStep) return;
    if (!canContinuePreferenciasStep(currentPrefStep, prefAnswers, languageLevels)) return;

    if (currentPrefStep.id === 'idiomas') {
      const selected = prefAnswers['idiomas'] ?? [];
      setLanguageLevels((prev) => {
        const next = { ...prev };
        for (const idioma of selected) {
          if (!next[idioma]) next[idioma] = '';
        }
        return next;
      });
    }

    let merged = applyPreferenciasAnswers(prefAnswers, profile);
    merged = applyLanguageLevels(merged, languageLevels);

    if (prefStepIndex >= activePrefSteps.length - 1) {
      setBusy(true);
      try {
        setProfile(merged);
        setEvidenceDraft(draftEvidenceFromProfile(merged));
        setEvidencePhase('titulo');
        setCompetencyIndex(0);
        await saveStep('evidence', merged, 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No pudimos guardar');
      } finally {
        setBusy(false);
      }
      return;
    }

    const next = prefStepIndex + 1;
    setPrefStepIndex(next);
    await saveStep('preferencias', merged, next);
  };

  const goPrefBack = async () => {
    if (prefStepIndex <= 0) {
      await saveStep('review_hub');
      return;
    }
    const prev = prefStepIndex - 1;
    setPrefStepIndex(prev);
    await saveStep('preferencias', undefined, prev);
  };

  const goEvidenceNext = async () => {
    const nextPhase = nextEvidencePhase(evidencePhase);
    if (nextPhase) {
      setEvidencePhase(nextPhase);
      await saveStep('evidence', mergeEvidenceIntoProfile(profile, evidenceDraft), EVIDENCE_PHASES.indexOf(nextPhase));
      return;
    }
    setBusy(true);
    try {
      const merged = mergeEvidenceIntoProfile(profile, evidenceDraft);
      setProfile(merged);
      setCompetencyIndex(0);
      await saveStep('competencies', merged, 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos guardar');
    } finally {
      setBusy(false);
    }
  };

  const skipEvidence = async () => {
    setBusy(true);
    try {
      const merged = buildMergedProfile();
      setProfile(merged);
      setCompetencyIndex(0);
      await saveStep('competencies', merged, 0);
    } finally {
      setBusy(false);
    }
  };

  const goEvidenceBack = async () => {
    const prev = prevEvidencePhase(evidencePhase);
    if (prev) {
      setEvidencePhase(prev);
      await saveStep('evidence', undefined, EVIDENCE_PHASES.indexOf(prev));
      return;
    }
    const lastPref = Math.max(0, activePrefSteps.length - 1);
    setPrefStepIndex(lastPref);
    await saveStep('preferencias', undefined, lastPref);
  };

  const goCompetencyNext = async () => {
    const merged = buildMergedProfile();
    const defs = competencyDefsForProfile(merged);
    if (competencyIndex >= defs.length - 1) {
      setBusy(true);
      try {
        setProfile(merged);
        await saveStep('complete', merged);
      } finally {
        setBusy(false);
      }
      return;
    }
    const next = competencyIndex + 1;
    setCompetencyIndex(next);
    await saveStep('competencies', merged, next);
  };

  const goCompetencyBack = async () => {
    if (competencyIndex <= 0) {
      setEvidencePhase('tags');
      await saveStep('evidence', undefined, EVIDENCE_PHASES.indexOf('tags'));
      return;
    }
    const prev = competencyIndex - 1;
    setCompetencyIndex(prev);
    await saveStep('competencies', buildMergedProfile(), prev);
  };

  const finishOnboarding = async () => {
    setBusy(true);
    try {
      const merged = buildMergedProfile();
      setProfile(merged);
      await persist({ complete: true, profilePatch: merged });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('kova_portal_onboarding_complete', 'true');
      }
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos completar el onboarding');
    } finally {
      setBusy(false);
    }
  };

  const completeness = profileCompletenessScore(buildMergedProfile(), prefAnswers);

  if (step === 'welcome') {
    const checklist = [
      { id: 'account', label: 'Cuenta creada', eta: '< 1 min', done: true },
      { id: 'cv', label: 'Subir hoja de vida', eta: '2 min', done: false },
      { id: 'review', label: 'Revisar información', eta: '2 min', done: false },
      { id: 'prefs', label: 'Preguntas rápidas', eta: '3 min', done: false },
      { id: 'done', label: 'Perfil listo', eta: 'Listo', done: false },
    ];

    return (
      <div className="portal-onboarding portal-onboarding--welcome">
        <div className="portal-onboarding-shell portal-onboarding-shell--hero">
          <header className="portal-onboarding-shell__header">
            <span className="portal-onboarding-eyebrow">Bienvenido a KOVA</span>
            <h1>Hola, {firstName}</h1>
            <p className="portal-onboarding-lead">
              En menos de cinco minutos construiremos tu perfil profesional. Subes tu hoja de vida, extraemos la
              información y solo revisas unas preguntas rápidas.
            </p>
            <p className="portal-onboarding-time">
              <Clock3 className="w-3.5 h-3.5" aria-hidden />
              Tiempo aproximado: 5 minutos
            </p>
          </header>

          <ul className="portal-onboarding-checklist">
            {checklist.map((item) => (
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
            onClick={() => void saveStep('cv_upload')}
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
      <PortalOnboardingShell
        macroIndex={1}
        percent={percent}
        minutesLeft={minutesLeft}
        motivation={motivation}
        onSaveExit={() => void handleSaveExit()}
      >
        <header className="portal-onboarding-shell__header portal-onboarding-shell__header--compact">
          <h1>Sube tu hoja de vida</h1>
          <p className="portal-onboarding-lead">Arrastra PDF o Word. KOVA extrae tu experiencia automáticamente.</p>
        </header>

        <div
          className="portal-onboarding-upload-zone portal-onboarding-upload-zone--large"
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
            <FileText className="w-7 h-7" />
          </div>
          <p className="portal-onboarding-upload-title">Arrastra tu hoja de vida</p>
          <p className="portal-onboarding-upload-or">o</p>
          <label htmlFor="portal-cv-file" className="portal-onboarding-btn portal-onboarding-btn--primary portal-onboarding-upload-btn">
            <Upload className="w-4 h-4" />
            Selecciona un archivo
          </label>
          <p className="portal-onboarding-upload-hint">PDF · Word · DOCX · máximo 5 MB</p>
          <p className="portal-onboarding-upload-future">Dropbox y Google Drive (próximamente)</p>
        </div>

        {error ? <p className="portal-onboarding-error">{error}</p> : null}
        {busy ? (
          <p className="portal-onboarding-busy">
            <Loader2 className="w-4 h-4 animate-spin" /> Preparando análisis...
          </p>
        ) : null}
      </PortalOnboardingShell>
    );
  }

  if (step === 'cv_analyzing') {
    return (
      <PortalOnboardingShell macroIndex={2} percent={percent} minutesLeft={minutesLeft}>
        <div className="portal-onboarding-analyze">
          <h2>Analizando hoja de vida...</h2>
          <p>Extrayendo tu perfil profesional</p>
          <div className="portal-onboarding-progress mt-4" aria-hidden>
            <span style={{ width: `${analysisProgress}%` }} />
          </div>
          <ul className="portal-onboarding-steps">
            {CV_ANALYSIS_STEPS.map((label, i) => (
              <li key={label} className={i < analysisDone ? 'is-done' : undefined}>
                {i < analysisDone ? <Check className="w-4 h-4 text-[var(--kova-lime)]" /> : <Loader2 className="w-4 h-4 animate-spin opacity-40" />}
                {label}
              </li>
            ))}
          </ul>
        </div>
      </PortalOnboardingShell>
    );
  }

  if (step === 'cv_summary') {
    return (
      <PortalOnboardingShell
        macroIndex={3}
        percent={percent}
        minutesLeft={minutesLeft}
        motivation={motivation}
        onSaveExit={() => void handleSaveExit()}
        footer={
          <PortalOnboardingFooter
            onContinue={() => void saveStep('review_hub')}
            continueLabel="Revisar información"
            busy={busy}
          />
        }
      >
        <div className="portal-onboarding-cv-summary">
          <div className="portal-onboarding-cv-summary__hero">
            <span className="portal-onboarding-cv-summary__icon" aria-hidden>
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h1>Esto encontramos en tu CV</h1>
              <p>Tu hoja de vida ya está organizada. Revisa antes de continuar.</p>
            </div>
          </div>

          {cvSummary.fields.length > 0 ? (
            <section className="portal-onboarding-cv-summary__section">
              <h2>
                <User className="h-4 w-4" aria-hidden />
                Datos de contacto
              </h2>
              <dl className="portal-onboarding-cv-summary__fields">
                {cvSummary.fields.map((field) => (
                  <div key={field.label} className="portal-onboarding-cv-summary__field">
                    <dt>{field.label}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {cvSummary.stats.length > 0 ? (
            <section className="portal-onboarding-cv-summary__section">
              <h2>Tu perfil profesional</h2>
              <div className="portal-onboarding-cv-summary__stats">
                {cvSummary.stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="portal-onboarding-cv-summary__stat">
                      <span className="portal-onboarding-cv-summary__stat-icon" aria-hidden>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="portal-onboarding-cv-summary__stat-count">{stat.count}</span>
                      <span className="portal-onboarding-cv-summary__stat-label">{stat.label}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          {cvSummary.fields.length === 0 && cvSummary.stats.length === 0 ? (
            <p className="portal-onboarding-lead portal-onboarding-cv-summary__empty">
              No detectamos secciones claras. Podrás completar manualmente en el siguiente paso.
            </p>
          ) : null}
        </div>
      </PortalOnboardingShell>
    );
  }

  if (step === 'review_hub') {
    const canContinue = canContinueFromReviewHub(reviewed, profile);
    return (
      <PortalOnboardingShell
        macroIndex={3}
        percent={percent}
        minutesLeft={minutesLeft}
        motivation={motivation}
        saveStatus={saveStatus}
        onSaveExit={() => void handleSaveExit()}
        wide
        footer={
          <PortalOnboardingFooter
            onBack={() => void saveStep('cv_summary')}
            onContinue={async () => {
              setBusy(true);
              try {
                await saveStep('preferencias', applyPreferenciasAnswers(prefAnswers, profile), 0);
              } finally {
                setBusy(false);
              }
            }}
            continueDisabled={!canContinue}
            continueLabel="Continuar"
            busy={busy}
            hint={!canContinue ? 'Marca como revisadas las secciones obligatorias (personal y experiencia).' : undefined}
          />
        }
      >
        <PortalOnboardingReviewHub
          profile={profile}
          reviewed={reviewed}
          onEdit={(section) => {
            setReviewEditSection(section);
            void saveStep('cv_review', undefined, prefStepIndex);
          }}
          onMarkReviewed={markReviewed}
        />
        {error ? <p className="portal-onboarding-error">{error}</p> : null}
      </PortalOnboardingShell>
    );
  }

  if (step === 'cv_review') {
    const editSectionMeta = REVIEW_SECTIONS.find((item) => item.id === reviewEditSection);
    return (
      <PortalOnboardingShell
        macroIndex={3}
        percent={percent}
        minutesLeft={minutesLeft}
        saveStatus={saveStatus}
        onSaveExit={() => void handleSaveExit()}
        wide
        footer={
          <PortalOnboardingFooter
            onBack={() => void saveStep('review_hub')}
            onContinue={async () => {
              setReviewed((prev) => new Set([...prev, reviewEditSection]));
              await saveStep('review_hub', profile);
            }}
            continueLabel="Volver al resumen"
            busy={busy}
          />
        }
      >
        <header className="portal-onboarding-shell__header portal-onboarding-shell__header--compact text-left">
          <h1 className="text-left">Editar {editSectionMeta?.label.toLowerCase() ?? 'información'}</h1>
          <p className="portal-onboarding-lead text-left mx-0">Corrige lo que haga falta. Se guarda solo.</p>
        </header>
        <PortalOnboardingReviewCards profile={profile} section={reviewEditSection} onChange={setProfile} />
      </PortalOnboardingShell>
    );
  }

  if (step === 'preferencias') {
    const blockMacro =
      currentPrefStep?.block === 'vendes' ? 5 : currentPrefStep?.block === 'cierras' ? 6 : 4;
    return (
      <PortalOnboardingShell
        macroIndex={blockMacro}
        percent={percent}
        minutesLeft={minutesLeft}
        motivation={motivation}
        saveStatus={saveStatus}
        onSaveExit={() => void handleSaveExit()}
        footer={
          <PortalOnboardingFooter
            onBack={() => void goPrefBack()}
            onContinue={() => void goPrefNext()}
            continueDisabled={!canContinuePreferenciasStep(currentPrefStep, prefAnswers, languageLevels)}
            continueLabel={
              prefStepIndex >= activePrefSteps.length - 1 ? 'Continuar a logros' : 'Continuar'
            }
            busy={busy}
          />
        }
      >
        <PortalOnboardingPreferencias
          profile={profile}
          answers={prefAnswers}
          stepIndex={prefStepIndex}
          salaryIdx={salaryIdx}
          languageLevels={languageLevels}
          onToggle={togglePrefAnswer}
          onSalaryChange={handleSalaryChange}
          onLanguageLevel={handleLanguageLevel}
          onSkip={() => void goPrefNext()}
        />
        {error ? <p className="portal-onboarding-error">{error}</p> : null}
      </PortalOnboardingShell>
    );
  }

  if (step === 'evidence') {
    const evidenceMacro = 7;
    const isLastPhase = evidencePhase === 'tags';
    return (
      <PortalOnboardingShell
        macroIndex={evidenceMacro}
        percent={percent}
        minutesLeft={minutesLeft}
        motivation={motivation}
        saveStatus={saveStatus}
        onSaveExit={() => void handleSaveExit()}
        footer={
          <PortalOnboardingFooter
            onBack={() => void goEvidenceBack()}
            onContinue={() => void goEvidenceNext()}
            continueDisabled={!canContinueEvidencePhase(evidencePhase, evidenceDraft)}
            continueLabel={isLastPhase ? 'Continuar a competencias' : 'Siguiente'}
            busy={busy}
          />
        }
      >
        <PortalOnboardingEvidence
          draft={evidenceDraft}
          phase={evidencePhase}
          onChange={setEvidenceDraft}
          onPhaseChange={setEvidencePhase}
        />
        {isLastPhase ? (
          <p className="portal-onboarding-optional text-center">
            <button type="button" className="portal-onboarding-link" onClick={() => void skipEvidence()}>
              Omitir logros por ahora
            </button>
          </p>
        ) : null}
        {error ? <p className="portal-onboarding-error">{error}</p> : null}
      </PortalOnboardingShell>
    );
  }

  if (step === 'competencies') {
    const defs = competencyDefsForProfile(profile);
    const isLastCompetency = competencyIndex >= defs.length - 1;
    return (
      <PortalOnboardingShell
        macroIndex={8}
        percent={percent}
        minutesLeft={minutesLeft}
        motivation={motivation}
        saveStatus={saveStatus}
        onSaveExit={() => void handleSaveExit()}
        footer={
          <PortalOnboardingFooter
            onBack={() => void goCompetencyBack()}
            onContinue={() => void goCompetencyNext()}
            continueDisabled={!canContinueCompetencyStep(profile, competencyIndex, competencyRatings)}
            continueLabel={isLastCompetency ? 'Ver perfil listo' : 'Siguiente'}
            busy={busy}
          />
        }
      >
        <PortalOnboardingCompetencies
          profile={profile}
          competencyIndex={competencyIndex}
          ratings={competencyRatings}
          onRate={(key, entry) => setCompetencyRatings((prev) => ({ ...prev, [key]: entry }))}
        />
        {error ? <p className="portal-onboarding-error">{error}</p> : null}
      </PortalOnboardingShell>
    );
  }

  if (step === 'complete') {
    return (
      <div className="portal-onboarding portal-onboarding--welcome">
        <div className="portal-onboarding-shell portal-onboarding-shell--complete">
          <div className="portal-onboarding-complete-icon" aria-hidden>
            <Sparkles className="w-8 h-8" />
          </div>
          <span className="portal-onboarding-eyebrow">¡Perfil listo!</span>
          <h1>Tu perfil ya está optimizado</h1>
          <p className="portal-onboarding-lead">
            KOVA ya puede encontrar vacantes compatibles contigo. Todo quedó guardado.
          </p>

          <div className="portal-onboarding-complete-score">
            <span className="portal-onboarding-complete-score__value">{completeness}%</span>
            <span className="portal-onboarding-complete-score__label">Perfil completo</span>
          </div>

          <ul className="portal-onboarding-complete-checklist">
            {['Experiencia', 'Formación', 'Idiomas', 'Preferencias', 'Logros', 'Competencias'].map((item) => (
              <li key={item}>
                <Check className="w-4 h-4 text-[var(--kova-lime)]" />
                {item}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="portal-onboarding-btn portal-onboarding-btn--primary"
            disabled={busy}
            onClick={() => void finishOnboarding()}
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                Entrar al portal
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
