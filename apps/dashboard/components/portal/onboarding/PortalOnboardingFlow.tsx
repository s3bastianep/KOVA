'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { CvExtractionResult } from '@/lib/cv-extract';
import type { CommercialProfile, CompetencyEntry } from '@/lib/candidate-commercial-profile';
import { stripIncompleteCertifications } from '@/lib/commercial-profile-builder';
import { portalApi } from '@/lib/api';
import { getStoredUser } from '@/lib/api';
import { syncOnboardingSession } from '@/lib/portal-onboarding-session';
import { enrichCvExtraction } from '@/app/registro/registro-utils';
import {
  CV_ANALYSIS_STEPS,
  applyFullCvExtraction,
  countsFromExtraction,
  countsFromProfile,
  type OnboardingCounts,
  type OnboardingStep,
} from '@/lib/portal-onboarding';
import {
  REVIEW_SECTIONS,
  canContinueFromReviewHub,
  estimatedMinutesLeft,
  onboardingJourneyIndex,
  normalizeOnboardingStep,
  transitionAfterStep,
  type ReviewSectionId,
  type StepTransition,
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
import { PortalOnboardingWelcome } from './PortalOnboardingWelcome';
import { PortalOnboardingTransition } from './PortalOnboardingTransition';
import { PortalOnboardingComplete } from './PortalOnboardingComplete';
import { PortalOnboardingCvSummary } from './PortalOnboardingCvSummary';
import { PortalOnboardingCvUpload } from './PortalOnboardingCvUpload';
import { PortalOnboardingCvAnalyzing } from './PortalOnboardingCvAnalyzing';
import { PortalOnboardingStepHero } from './PortalOnboardingStepHero';
import { usePortalVacancyMatchStats } from './usePortalVacancyMatchStats';
import './portal-onboarding.css';

const STEPS_WITH_VACANCY_STATS = new Set<OnboardingStep>([
  'cv_summary',
  'review_hub',
  'cv_review',
  'preferencias',
  'evidence',
  'competencies',
  'complete',
]);

type Props = {
  initialProfile: CommercialProfile;
  initialStep: OnboardingStep;
  initialSubStep?: number;
  initialReviewed?: string[];
  onComplete: () => void;
  onProgressSaved?: () => void;
};

export function PortalOnboardingFlow({
  initialProfile,
  initialStep,
  initialSubStep = 0,
  initialReviewed = [],
  onComplete,
  onProgressSaved,
}: Props) {
  const user = getStoredUser();
  const firstName = user?.firstName ?? initialProfile.nombre?.split(' ')[0] ?? 'Candidato';

  const normalizedInitial = normalizeOnboardingStep(initialStep);
  // cv_analyzing is a transient animation, never a valid resume point: if a reload
  // lands here, the previous session already saved the extracted profile before
  // reaching this step, so there is nothing left to animate — skip to the summary.
  const resumableInitial = normalizedInitial === 'cv_analyzing' ? 'cv_summary' : normalizedInitial;

  const [step, setStep] = useState<OnboardingStep>(() => resumableInitial);
  const [profile, setProfile] = useState<CommercialProfile>(() => ({
    ...initialProfile,
    historialLaboral: normalizeWorkHistory(initialProfile.historialLaboral ?? []),
    formacion: normalizeEducation(initialProfile.formacion ?? []),
  }));
  const [counts, setCounts] = useState<OnboardingCounts | null>(null);
  const [analysisDone, setAnalysisDone] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
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
  const [reviewEditOrigin, setReviewEditOrigin] = useState<'cv_summary' | 'review_hub' | 'preferencias'>(
    'review_hub',
  );
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
  const [overlayTransition, setOverlayTransition] = useState<StepTransition | null>(null);
  const [cvImportedAt, setCvImportedAt] = useState<string | null>(() => new Date().toISOString());
  const [vacancyStatsKey, setVacancyStatsKey] = useState(() =>
    STEPS_WITH_VACANCY_STATS.has(normalizedInitial) ? 1 : 0,
  );
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
    merged = applyCompetencyRatings(merged, competencyRatings);
    return stripIncompleteCertifications(merged);
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
  const journeyIndex = onboardingJourneyIndex(step);
  const vacancyStatsEnabled = STEPS_WITH_VACANCY_STATS.has(step) && vacancyStatsKey > 0;
  const { stats: vacancyStats, loading: vacancyStatsLoading } = usePortalVacancyMatchStats(
    vacancyStatsEnabled ? vacancyStatsKey : null,
  );

  const renderWithOverlay = (node: ReactNode) => (
    <>
      {node}
      {overlayTransition ? (
        <PortalOnboardingTransition
          key={`${overlayTransition.headline}-${overlayTransition.detail}`}
          transition={overlayTransition}
          onDone={() => setOverlayTransition(null)}
        />
      ) : null}
    </>
  );

  useEffect(() => {
    document.documentElement.classList.add('portal-onboarding-active');
    document.documentElement.classList.add('portal-onboarding-immersive');
    return () => {
      document.documentElement.classList.remove('portal-onboarding-active');
      document.documentElement.classList.remove('portal-onboarding-immersive');
    };
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
      const sanitizedPatch = patch.profilePatch ? stripIncompleteCertifications(patch.profilePatch) : undefined;
      const body = {
        onboardingStep: patch.nextStep ?? step,
        onboardingSubStep: patch.subStep ?? prefStepIndex,
        onboardingReviewed: reviewedIds,
        ...(sanitizedPatch ? { profile: sanitizedPatch as Record<string, unknown> } : {}),
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
        ...(sanitizedPatch || step === 'preferencias' || step === 'evidence' || step === 'competencies'
          ? { profile: (sanitizedPatch ?? buildMergedProfile()) as Record<string, unknown> }
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
        if (STEPS_WITH_VACANCY_STATS.has(next) || profilePatch) {
          setVacancyStatsKey((key) => key + 1);
        }
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
      syncOnboardingSession(false);
      onProgressSaved?.();
      window.location.assign('/');
    } catch {
      setError('No pudimos guardar tu progreso.');
      setBusy(false);
    }
  };

  const runAnalysisAnimation = useCallback(
    async (uploadPromise: Promise<CvExtractionResult>) => {
      setStep('cv_analyzing');
      setAnalysisDone(0);
      setAnalysisComplete(false);
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
      const nextCounts = countsFromExtraction(aligned);
      setProfile(nextProfile);
      setPrefAnswers(answersFromProfile(nextProfile));
      setCounts(nextCounts);
      setCvImportedAt(new Date().toISOString());
      await saveStep('cv_analyzing', nextProfile);
      setAnalysisComplete(true);
      setVacancyStatsKey((key) => key + 1);
    },
    [profile, saveStep],
  );

  const continueFromAnalysis = async () => {
    setBusy(true);
    try {
      const dataCount =
        (counts?.experiencias ?? 0) +
        (counts?.estudios ?? 0) +
        (counts?.idiomas ?? 0) +
        (counts?.certificaciones ?? 0);
      setOverlayTransition(transitionAfterStep('cv_analyzing', profile, dataCount) ?? null);
      await saveStep('cv_summary');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos continuar.');
    } finally {
      setBusy(false);
    }
  };

  const handleFile = async (file: File | null | undefined) => {
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      const uploadPromise = portalApi.uploadCv(file) as Promise<CvExtractionResult>;
      await runAnalysisAnimation(uploadPromise);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos leer tu archivo.');
      // Reconcile the server's persisted step too, not just local state — runAnalysisAnimation
      // already saved 'cv_analyzing' server-side before the upload settled. Without this, a
      // reload after a failed upload resumes on 'cv_analyzing' with nothing to show (it silently
      // rewrites to an empty cv_summary), skipping the upload step entirely.
      try {
        await saveStep('cv_upload');
      } catch {
        setStep('cv_upload');
      }
    } finally {
      setBusy(false);
    }
  };

  const togglePrefAnswer = (stepId: string, option: string, multi: boolean) => {
    setPrefAnswers((prev) => {
      const current = prev[stepId] ?? [];
      const isExclusive = (value: string) => value.trim().toLowerCase().startsWith('ninguno');
      let next: string[];
      if (!multi) {
        next = current.includes(option) ? [] : [option];
      } else if (current.includes(option)) {
        next = current.filter((o) => o !== option);
      } else if (isExclusive(option)) {
        next = [option];
      } else {
        next = [...current.filter((o) => !isExclusive(o)), option];
      }
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

  const markReviewed = (section: ReviewSectionId) => {
    setReviewed((prev) => new Set([...prev, section]));
  };

  const goPrefNext = async () => {
    if (!currentPrefStep) return;
    if (!canContinuePreferenciasStep(currentPrefStep, prefAnswers, languageLevels)) return;

    if (
      currentPrefStep.id === 'idiomas-review' &&
      (prefAnswers['idiomas-review'] ?? []).includes('Quiero revisarlos')
    ) {
      setReviewEditSection('idiomas');
      setReviewEditOrigin('preferencias');
      await saveStep('cv_review');
      return;
    }

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
        setOverlayTransition(transitionAfterStep('preferencias', merged));
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
    setError('');
    try {
      const merged = buildMergedProfile();
      setProfile(merged);
      await persist({ complete: true, profilePatch: merged });
      syncOnboardingSession(true);
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos completar el onboarding');
    } finally {
      setBusy(false);
    }
  };

  if (step === 'welcome') {
    return renderWithOverlay(
      <PortalOnboardingWelcome
        firstName={firstName}
        minutesLeft={minutesLeft}
        onStart={() => void saveStep('cv_upload')}
        onSaveExit={() => void handleSaveExit()}
      />,
    );
  }

  if (step === 'cv_upload') {
    return renderWithOverlay(
      <PortalOnboardingShell
        percent={percent}
        minutesLeft={minutesLeft}
        journeyIndex={journeyIndex}
        onSaveExit={() => void handleSaveExit()}
        narrow
        hidePreview
        hideHeaderProgress
      >
        <PortalOnboardingCvUpload
          journeyIndex={journeyIndex}
          inputRef={inputRef}
          onFile={(file) => void handleFile(file)}
          error={error}
          busy={busy}
        />
      </PortalOnboardingShell>,
    );
  }

  if (step === 'cv_analyzing') {
    return renderWithOverlay(
      <PortalOnboardingShell
        percent={percent}
        minutesLeft={minutesLeft}
        journeyIndex={journeyIndex}
        narrow
        hidePreview
        hideHeaderProgress
      >
        <PortalOnboardingCvAnalyzing
          analysisDone={analysisDone}
          analysisProgress={analysisProgress}
          complete={analysisComplete}
          busy={busy}
          onContinue={() => void continueFromAnalysis()}
        />
      </PortalOnboardingShell>,
    );
  }

  if (step === 'cv_summary') {
    return renderWithOverlay(
      <PortalOnboardingShell
        percent={percent}
        minutesLeft={minutesLeft}
        journeyIndex={journeyIndex}
        onSaveExit={() => void handleSaveExit()}
        centered
        hidePreview
        hideHeaderProgress
        footer={
          <PortalOnboardingFooter
            layout="bar"
            onBack={() => void saveStep('cv_upload')}
            onContinue={() => void saveStep('review_hub')}
            continueLabel="Continuar"
            busy={busy}
            saveStatus={saveStatus}
          />
        }
      >
        <PortalOnboardingCvSummary
          firstName={firstName}
          profile={profile}
          counts={displayCounts}
          percent={percent}
          journeyIndex={journeyIndex}
          vacancyStats={vacancyStats}
          vacancyStatsLoading={vacancyStatsLoading}
          cvImportedAt={cvImportedAt}
          onEditContact={() => {
            setReviewEditSection('personal');
            setReviewEditOrigin('cv_summary');
            void saveStep('cv_review');
          }}
          onReviewExperience={() => {
            setReviewEditSection('experiencia');
            setReviewEditOrigin('cv_summary');
            void saveStep('cv_review');
          }}
        />
      </PortalOnboardingShell>,
    );
  }

  if (step === 'review_hub') {
    const canContinue = canContinueFromReviewHub(reviewed, profile);
    return renderWithOverlay(
      <PortalOnboardingShell
        percent={percent}
        minutesLeft={minutesLeft}
        journeyIndex={journeyIndex}
        saveStatus={saveStatus}
        onSaveExit={() => void handleSaveExit()}
        hidePreview
        footer={
          <PortalOnboardingFooter
            onBack={() => void saveStep('cv_summary')}
            onContinue={async () => {
              setBusy(true);
              try {
                setOverlayTransition(transitionAfterStep('review_hub', profile));
                await saveStep('preferencias', applyPreferenciasAnswers(prefAnswers, profile), 0);
              } finally {
                setBusy(false);
              }
            }}
            continueDisabled={!canContinue}
            continueLabel="Continuar"
            busy={busy}
            hint={!canContinue ? 'Confirma personal y experiencia para seguir construyendo tu perfil.' : undefined}
          />
        }
      >
        <PortalOnboardingReviewHub
          firstName={firstName}
          percent={percent}
          profile={profile}
          reviewed={reviewed}
          onEdit={(section) => {
            setReviewEditSection(section);
            setReviewEditOrigin('review_hub');
            void saveStep('cv_review', undefined, prefStepIndex);
          }}
          onMarkReviewed={markReviewed}
        />
        {error ? <p className="portal-onboarding-error">{error}</p> : null}
      </PortalOnboardingShell>,
    );
  }

  if (step === 'cv_review') {
    const editSectionMeta = REVIEW_SECTIONS.find((item) => item.id === reviewEditSection);
    return renderWithOverlay(
      <PortalOnboardingShell
        percent={percent}
        minutesLeft={minutesLeft}
        journeyIndex={journeyIndex}
        saveStatus={saveStatus}
        onSaveExit={() => void handleSaveExit()}
        hidePreview
        footer={
          <PortalOnboardingFooter
            onBack={() => void saveStep(reviewEditOrigin)}
            onContinue={async () => {
              setReviewed((prev) => new Set([...prev, reviewEditSection]));
              await saveStep(reviewEditOrigin, profile);
            }}
            continueLabel={
              reviewEditOrigin === 'cv_summary'
                ? 'Volver al resumen del CV'
                : reviewEditOrigin === 'preferencias'
                  ? 'Volver a preferencias'
                  : 'Volver al resumen'
            }
            busy={busy}
          />
        }
      >
        <PortalOnboardingStepHero
          eyebrow="Edición de perfil"
          title={
            reviewEditSection === 'experiencia'
              ? 'Detalle de trayectoria'
              : `Ajustar ${editSectionMeta?.label.toLowerCase() ?? 'información'}`
          }
          subtitle={
            reviewEditSection === 'experiencia'
              ? 'Documenta tu experiencia comercial con precisión.'
              : 'Los cambios se reflejan en tiempo real en tu perfil.'
          }
        />
        <section className="ob-panel ob-question-panel">
        <PortalOnboardingReviewCards profile={profile} section={reviewEditSection} onChange={setProfile} />
        </section>
      </PortalOnboardingShell>,
    );
  }

  if (step === 'preferencias') {
    return renderWithOverlay(
      <PortalOnboardingShell
        percent={percent}
        minutesLeft={minutesLeft}
        journeyIndex={journeyIndex}
        saveStatus={saveStatus}
        onSaveExit={() => void handleSaveExit()}
        narrow
        hidePreview
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
          firstName={firstName}
          percent={percent}
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
      </PortalOnboardingShell>,
    );
  }

  if (step === 'evidence') {
    const isLastPhase = evidencePhase === 'tags';
    return renderWithOverlay(
      <PortalOnboardingShell
        percent={percent}
        minutesLeft={minutesLeft}
        journeyIndex={journeyIndex}
        saveStatus={saveStatus}
        onSaveExit={() => void handleSaveExit()}
        narrow
        hidePreview
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
          firstName={firstName}
          percent={percent}
          draft={evidenceDraft}
          phase={evidencePhase}
          onChange={setEvidenceDraft}
          onPhaseChange={setEvidencePhase}
        />
        <p className="portal-onboarding-optional text-center">
          <button type="button" className="portal-onboarding-link" onClick={() => void skipEvidence()}>
            Omitir logros por ahora
          </button>
        </p>
        {error ? <p className="portal-onboarding-error">{error}</p> : null}
      </PortalOnboardingShell>,
    );
  }

  if (step === 'competencies') {
    const defs = competencyDefsForProfile(profile);
    const isLastCompetency = competencyIndex >= defs.length - 1;
    return renderWithOverlay(
      <PortalOnboardingShell
        percent={percent}
        minutesLeft={minutesLeft}
        journeyIndex={journeyIndex}
        saveStatus={saveStatus}
        onSaveExit={() => void handleSaveExit()}
        narrow
        hidePreview
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
          firstName={firstName}
          percent={percent}
          profile={profile}
          competencyIndex={competencyIndex}
          ratings={competencyRatings}
          onRate={(key, entry) => setCompetencyRatings((prev) => ({ ...prev, [key]: entry }))}
        />
        {error ? <p className="portal-onboarding-error">{error}</p> : null}
      </PortalOnboardingShell>,
    );
  }

  if (step === 'complete') {
    return renderWithOverlay(
      <PortalOnboardingComplete
        percent={percent}
        vacancyStats={vacancyStats}
        vacancyStatsLoading={vacancyStatsLoading}
        hasSkills={(profile.herramientas?.length ?? 0) > 0}
        busy={busy}
        error={error}
        onEnter={() => void finishOnboarding()}
      />,
    );
  }

  return null;
}
