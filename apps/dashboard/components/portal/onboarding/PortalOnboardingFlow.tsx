'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { CvExtractionResult } from '@/lib/cv-extract';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import {
  stripIncompleteCertifications,
  stripIncompleteLanguages,
  profileHasMissingDateFields,
  DATE_FIELDS_REQUIRED_MESSAGE,
  missingWorkDateFields,
  missingEducationDateFields,
} from '@/lib/commercial-profile-builder';
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
  applyLanguageLevels,
  languageLevelsFromProfile,
} from '@/lib/portal-onboarding-evidence';

function sanitizeOnboardingProfile<T extends Partial<CommercialProfile>>(patch: T): T {
  return stripIncompleteLanguages(stripIncompleteCertifications(patch));
}
import { PortalOnboardingReviewCards } from './PortalOnboardingReviewCards';
import { PortalOnboardingReviewHub } from './PortalOnboardingReviewHub';
import {
  canContinuePreferenciasStep,
  PortalOnboardingPreferencias,
} from './PortalOnboardingPreferencias';
import { PortalOnboardingFooter, PortalOnboardingShell } from './PortalOnboardingShell';
import { guideMessageForStep } from './PortalOnboardingGuide';
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
  'complete',
]);

/**
 * Same as answersFromProfile, but also seeds the salary slider's answer with whatever value it
 * already renders. The slider always displays a value (defaulting to "$8 millones COP/mes" when
 * the candidate hasn't set one), but canContinuePreferenciasStep only reads this answers record —
 * without seeding it, "Continuar" stayed silently disabled on a step that visually already looked
 * answered, with no hint telling the candidate why they were stuck.
 */
function answersFromProfileWithSalaryDefault(profile: CommercialProfile): Record<string, string[]> {
  const answers = answersFromProfile(profile);
  if (!answers.salario?.length) {
    answers.salario = [SALARY_SLIDER_LABELS[salarySliderIndex(profile.expectativaSalarial)]];
  }
  return answers;
}

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
  // cv_analyzing is a transient animation, never a valid resume point: if a reload lands here,
  // the previous session already saved the extracted profile before reaching it, so send the
  // user to verify that data (review_hub) rather than replaying the animation. 'evidence' and
  // 'competencies' were removed from the active flow (self-reported achievements/self-ratings
  // don't hold up in a selection process) — anyone resuming from a saved record with one of
  // those steps goes straight to the final profile reveal instead.
  const resumableInitial =
    normalizedInitial === 'cv_analyzing'
      ? 'review_hub'
      : normalizedInitial === 'evidence' || normalizedInitial === 'competencies'
        ? 'cv_summary'
        : normalizedInitial;

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
    answersFromProfileWithSalaryDefault(initialProfile),
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
  const [reviewEditSection, setReviewEditSection] = useState<ReviewSectionId>('experiencia');
  const [reviewEditOrigin, setReviewEditOrigin] = useState<'cv_summary' | 'review_hub' | 'preferencias'>(
    'review_hub',
  );
  const [reviewed, setReviewed] = useState<Set<ReviewSectionId>>(
    () => new Set(initialReviewed as ReviewSectionId[]),
  );
  const [error, setError] = useState('');
  const [highlightMissingDates, setHighlightMissingDates] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [overlayTransition, setOverlayTransition] = useState<StepTransition | null>(null);
  const [cvImportedAt, setCvImportedAt] = useState<string | null>(() => new Date().toISOString());
  const [vacancyStatsKey, setVacancyStatsKey] = useState(() =>
    STEPS_WITH_VACANCY_STATS.has(normalizedInitial) ? 1 : 0,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishedRef = useRef(false);

  const activePrefSteps = useMemo(() => getActiveSteps(profile), [profile]);
  const currentPrefStep = activePrefSteps[prefStepIndex];

  const buildMergedProfile = useCallback((): CommercialProfile => {
    let merged = applyPreferenciasAnswers(prefAnswers, profile);
    merged = applyLanguageLevels(merged, languageLevels);
    return sanitizeOnboardingProfile(merged);
  }, [languageLevels, prefAnswers, profile]);

  // Keep wizard level state aligned with review-card edits so autosave can't wipe niveles.
  // Only sync while editing/confirming in review — during preferencias the nivel picker owns
  // `languageLevels` and must not be reset from a still-incomplete profile.
  useEffect(() => {
    if (step !== 'cv_review' && step !== 'review_hub') return;
    setLanguageLevels(languageLevelsFromProfile(profile));
  }, [profile.idiomas, step]);

  const percent = unifiedProgressPercent(step, profile, prefStepIndex, prefAnswers);
  const minutesLeft = estimatedMinutesLeft(step, profile, prefStepIndex);
  const journeyIndex = onboardingJourneyIndex(step);
  const guideMessage = guideMessageForStep(step, currentPrefStep?.block);
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
      const sanitizedPatch = patch.profilePatch ? sanitizeOnboardingProfile(patch.profilePatch) : undefined;
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
        ...(sanitizedPatch || step === 'preferencias'
          ? { profile: (sanitizedPatch ?? buildMergedProfile()) as Record<string, unknown> }
          : {}),
      });
      if (patch.nextStep) setStep(patch.nextStep);
      if (patch.subStep !== undefined && (patch.nextStep ?? step) === 'preferencias') {
        setPrefStepIndex(patch.subStep);
      }
    },
    [buildMergedProfile, prefStepIndex, reviewed, step],
  );

  const saveStep = useCallback(
    async (
      next: OnboardingStep,
      profilePatch?: Partial<CommercialProfile>,
      subStep?: number,
      opts?: { quiet?: boolean },
    ) => {
      if (!opts?.quiet) setSaveStatus('saving');
      try {
        await persist({ nextStep: next, profilePatch, subStep });
        if (STEPS_WITH_VACANCY_STATS.has(next) || profilePatch) {
          setVacancyStatsKey((key) => key + 1);
        }
        if (!opts?.quiet) setSaveStatus('saved');
        else setSaveStatus('idle');
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
        onboardingSubStep: prefStepIndex,
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
      setPrefAnswers(answersFromProfileWithSalaryDefault(nextProfile));
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
      // Straight to verifying the extracted data — the rich profile summary is now shown at the
      // end of the flow, not here (showing compatibility before the candidate confirms the data
      // was confusing).
      await saveStep('review_hub');
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

  const setPrefStepAnswers = (stepId: string, values: string[]) => {
    setPrefAnswers((prev) => ({ ...prev, [stepId]: values }));
  };

  const handleCustomOptionText = (stepId: string, placeholder: string, text: string) => {
    setPrefAnswers((prev) => {
      const current = prev[stepId] ?? [];
      const idx = current.findIndex((v) => v === placeholder || v.startsWith(`${placeholder}: `));
      if (idx === -1) return prev;
      const next = [...current];
      next[idx] = text.trim() ? `${placeholder}: ${text.trim()}` : placeholder;
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
    if (finishedRef.current) return;
    if (!['cv_review', 'review_hub', 'preferencias'].includes(step)) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      if (finishedRef.current) return;
      // Silent background persist — never flash "Guardando..." on chip toggles.
      const merged = buildMergedProfile();
      portalApi
        .updateOnboarding({
          onboardingStep: step,
          onboardingSubStep: prefStepIndex,
          onboardingReviewed: [...reviewed],
          profile: merged as Record<string, unknown>,
        })
        .then(() => {
          // Stay quiet on success so the UI doesn't jump.
        })
        .catch(() => {
          if (!finishedRef.current) setSaveStatus('error');
        });
    }, 600);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [buildMergedProfile, languageLevels, prefAnswers, prefStepIndex, profile, reviewed, step]);

  const displayCounts = counts ?? countsFromProfile(profile);
  const analysisProgress = Math.round((analysisDone / CV_ANALYSIS_STEPS.length) * 100);

  const markReviewed = (section: ReviewSectionId) => {
    const nextReviewed = Array.from(new Set<ReviewSectionId>([...reviewed, section]));
    setReviewed(new Set(nextReviewed));
    setSaveStatus('saving');
    void persist({ reviewedIds: nextReviewed, profilePatch: profile })
      .then(() => setSaveStatus('saved'))
      .catch(() => setSaveStatus('error'));
  };

  const goPrefNext = async (overrideOption?: string) => {
    if (!currentPrefStep) return;
    // When called right from a chip click (e.g. the idiomas-review yes/no buttons), use the
    // just-clicked value directly instead of `prefAnswers` — that state update from the same
    // click hasn't necessarily landed yet, so reading it back here would race and silently no-op
    // (exactly the "se queda marcado y ya" bug: click registers, nothing else happens).
    const effectiveAnswers = overrideOption
      ? { ...prefAnswers, [currentPrefStep.id]: [overrideOption] }
      : prefAnswers;
    if (!canContinuePreferenciasStep(currentPrefStep, effectiveAnswers, languageLevels)) return;
    if (overrideOption) setPrefAnswers(effectiveAnswers);

    if (
      currentPrefStep.id === 'idiomas-review' &&
      (effectiveAnswers['idiomas-review'] ?? []).includes('Quiero revisarlos')
    ) {
      setReviewEditSection('idiomas');
      setReviewEditOrigin('preferencias');
      await saveStep('cv_review');
      return;
    }

    if (currentPrefStep.id === 'idiomas') {
      const selected = effectiveAnswers['idiomas'] ?? [];
      setLanguageLevels((prev) => {
        const next = { ...prev };
        for (const idioma of selected) {
          if (!next[idioma]) next[idioma] = '';
        }
        return next;
      });
    }

    let merged = applyPreferenciasAnswers(effectiveAnswers, profile);
    merged = applyLanguageLevels(merged, languageLevels);

    if (prefStepIndex >= activePrefSteps.length - 1) {
      // Logros (self-reported achievements) and Competencias (candidate self-rating) were
      // removed from the flow: neither can be verified in a selection process, so they added
      // questions without adding real signal. Preferencias now goes straight to the final
      // profile reveal.
      setBusy(true);
      try {
        setProfile(merged);
        setVacancyStatsKey((key) => key + 1);
        setOverlayTransition(transitionAfterStep('preferencias', merged));
        await saveStep('cv_summary', merged);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No pudimos guardar');
      } finally {
        setBusy(false);
      }
      return;
    }

    const next = prefStepIndex + 1;
    setPrefStepIndex(next);
    await saveStep('preferencias', merged, next, { quiet: true });
  };

  const goPrefBack = async () => {
    if (prefStepIndex <= 0) {
      await saveStep('review_hub', undefined, undefined, { quiet: true });
      return;
    }
    const prev = prefStepIndex - 1;
    setPrefStepIndex(prev);
    await saveStep('preferencias', undefined, prev, { quiet: true });
  };

  const finishOnboarding = async () => {
    setBusy(true);
    setError('');
    finishedRef.current = true;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    try {
      const merged = buildMergedProfile();
      setProfile(merged);
      await persist({ complete: true, profilePatch: merged });
      syncOnboardingSession(true);
      onComplete();
    } catch (err) {
      finishedRef.current = false;
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
        guideMessage={guideMessage}
        onSaveExit={() => void handleSaveExit()}
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
        guideMessage={guideMessage}
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
        guideMessage={guideMessage}
        onSaveExit={() => void handleSaveExit()}
        centered
        hidePreview
        hideHeaderProgress
        footer={
          <PortalOnboardingFooter
            layout="bar"
            onBack={() => void saveStep('preferencias', undefined, Math.max(0, activePrefSteps.length - 1))}
            onContinue={() => void saveStep('complete')}
            continueLabel="Finalizar"
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
          onAddSkills={() => {
            setReviewEditSection('skills');
            setReviewEditOrigin('cv_summary');
            void saveStep('cv_review');
          }}
          onEditSection={(section) => {
            setReviewEditSection(section);
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
        guideMessage={guideMessage}
        saveStatus={saveStatus}
        onSaveExit={() => void handleSaveExit()}
        hidePreview
        footer={
          <PortalOnboardingFooter
            onBack={() => void saveStep('cv_upload')}
            onContinue={async () => {
              setBusy(true);
              try {
                setOverlayTransition(transitionAfterStep('review_hub', profile));
                // Prefer the languages just confirmed in review over stale preferencias chip
                // answers (those can still hold the CV's first incomplete list).
                const answersForSave = {
                  ...prefAnswers,
                  idiomas: (profile.idiomas ?? [])
                    .map((lang) => lang.idioma?.trim())
                    .filter((name): name is string => Boolean(name)),
                };
                setPrefAnswers(answersForSave);
                setLanguageLevels(languageLevelsFromProfile(profile));
                await saveStep('preferencias', applyPreferenciasAnswers(answersForSave, profile), 0);
              } finally {
                setBusy(false);
              }
            }}
            continueDisabled={!canContinue}
            continueLabel="Continuar a preferencias"
            hint={
              canContinue
                ? undefined
                : 'Revisa las 5 secciones (abre cada una y pulsa Guardar) para continuar.'
            }
            busy={busy}
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
        guideMessage={guideMessage}
        saveStatus={saveStatus}
        onSaveExit={() => void handleSaveExit()}
        hidePreview
        footer={
          <PortalOnboardingFooter
            onBack={() => void saveStep(reviewEditOrigin)}
            backLabel="Volver"
            onContinue={async () => {
              const sectionNeedsDates =
                reviewEditSection === 'experiencia' || reviewEditSection === 'educacion';
              const datesMissing =
                reviewEditSection === 'experiencia'
                  ? (profile.historialLaboral ?? []).some((e) => missingWorkDateFields(e).length > 0)
                  : reviewEditSection === 'educacion'
                    ? (profile.formacion ?? []).some((e) => missingEducationDateFields(e).length > 0)
                    : profileHasMissingDateFields(profile);

              if (sectionNeedsDates && datesMissing) {
                setHighlightMissingDates(true);
                setError(DATE_FIELDS_REQUIRED_MESSAGE);
                return;
              }

              setHighlightMissingDates(false);
              setError('');
              const nextReviewed = Array.from(
                new Set<ReviewSectionId>([...reviewed, reviewEditSection]),
              );
              setReviewed(new Set(nextReviewed));
              setLanguageLevels(languageLevelsFromProfile(profile));
              setBusy(true);
              setSaveStatus('saving');
              try {
                await persist({
                  nextStep: reviewEditOrigin,
                  profilePatch: profile,
                  reviewedIds: nextReviewed,
                });
                setSaveStatus('saved');
              } catch {
                setSaveStatus('error');
              } finally {
                setBusy(false);
              }
            }}
            continueLabel="Guardar"
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
            reviewEditSection === 'skills'
              ? 'Agrega hasta 3 habilidades. Pulsa Guardar para guardar y volver, o Volver si no quieres cambiar nada.'
              : 'Revisa o corrige los datos. Pulsa Guardar para guardar y volver, o Volver si no quieres cambiar nada.'
          }
        />
        <section className="ob-panel ob-question-panel">
        <PortalOnboardingReviewCards
          profile={profile}
          section={reviewEditSection}
          onChange={(next) => {
            setProfile(next);
            if (highlightMissingDates) setHighlightMissingDates(false);
            if (error === DATE_FIELDS_REQUIRED_MESSAGE) setError('');
          }}
          highlightMissingDates={highlightMissingDates}
        />
        </section>
        {error ? <p className="portal-onboarding-error">{error}</p> : null}
      </PortalOnboardingShell>,
    );
  }

  if (step === 'preferencias') {
    return renderWithOverlay(
      <PortalOnboardingShell
        percent={percent}
        minutesLeft={minutesLeft}
        journeyIndex={journeyIndex}
        guideMessage={guideMessage}
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
              prefStepIndex >= activePrefSteps.length - 1 ? 'Ver mi perfil' : 'Continuar'
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
          onSetAnswers={setPrefStepAnswers}
          onCustomOptionText={handleCustomOptionText}
          onSalaryChange={handleSalaryChange}
          onLanguageLevel={handleLanguageLevel}
          onSkip={() => void goPrefNext()}
          onAutoAdvance={(option) => void goPrefNext(option)}
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
