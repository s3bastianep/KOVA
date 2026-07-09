'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  GraduationCap,
  Languages,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { portalApi, type PortalPerfilResponse } from '@/lib/api';
import { PORTAL_CACHE_KEYS, portalCacheGet } from '@/lib/portal-cache';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';
import {
  PREFERENCIAS_BLOCK_HINTS,
  PREFERENCIAS_BLOCK_LABELS,
  PREFERENCIAS_BLOCKS,
  PREFERENCIAS_STEP_KEY,
  PREFERENCIAS_VIEW_KEY,
  SALARY_SLIDER_LABELS,
  answersFromProfile,
  applyPreferenciasAnswers,
  blockProgress,
  getActiveSteps,
  isPreferenciasComplete,
  overallProgress,
  profileSnapshot,
  salarySliderIndex,
  stepIndexForBlock,
  type PreferenciasBlock,
} from '@/lib/portal-preferencias-wizard';

const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--kova-lime)] px-5 py-2.5 text-sm font-semibold text-[var(--kv-ink)] transition hover:brightness-[0.97] active:brightness-95 disabled:opacity-50';

const btnSecondary =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--kova-border-strong)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--kova-navy)] transition hover:bg-[var(--kova-surface-2)]';

type View = 'hub' | 'wizard' | 'done';

type Props = {
  fromOnboarding?: boolean;
  initialBlock?: PreferenciasBlock | null;
};

export function PortalPreferenciasWizard({ fromOnboarding = false, initialBlock = null }: Props) {
  const router = useRouter();
  const cached = portalCacheGet<PortalPerfilResponse>(PORTAL_CACHE_KEYS.perfil);
  const initialProfile = (cached?.profile as CommercialProfile) ?? null;

  const [profile, setProfile] = useState<CommercialProfile | null>(initialProfile);
  const [answers, setAnswers] = useState<Record<string, string[]>>(() =>
    initialProfile ? answersFromProfile(initialProfile) : {},
  );
  const [loading, setLoading] = useState(() => !cached);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [view, setView] = useState<View>(() => (fromOnboarding ? 'wizard' : 'hub'));
  const [stepIndex, setStepIndex] = useState(0);
  const [salaryIdx, setSalaryIdx] = useState(() => salarySliderIndex(initialProfile?.expectativaSalarial));
  const [finishing, setFinishing] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bootstrapped = useRef(false);

  const activeSteps = useMemo(() => (profile ? getActiveSteps(profile) : []), [profile]);
  const currentStep = activeSteps[stepIndex];
  const progress = useMemo(() => overallProgress(answers, profile ?? {}), [answers, profile]);
  const complete = useMemo(() => isPreferenciasComplete(answers, profile ?? {}), [answers, profile]);
  const snapshot = useMemo(() => (profile ? profileSnapshot(profile) : null), [profile]);

  useEffect(() => {
    portalApi
      .perfil()
      .then((data) => {
        const loaded = data.profile as CommercialProfile;
        setProfile(loaded);
        const loadedAnswers = answersFromProfile(loaded);
        setAnswers(loadedAnswers);
        setSalaryIdx(salarySliderIndex(loaded.expectativaSalarial));

        if (bootstrapped.current) return;
        bootstrapped.current = true;

        if (fromOnboarding) {
          const block = initialBlock ?? 'buscas';
          const idx = stepIndexForBlock(getActiveSteps(loaded), block, loadedAnswers);
          setStepIndex(idx);
          setView('wizard');
          sessionStorage.setItem(PREFERENCIAS_STEP_KEY, String(idx));
          sessionStorage.setItem(PREFERENCIAS_VIEW_KEY, 'wizard');
          return;
        }

        const savedView = sessionStorage.getItem(PREFERENCIAS_VIEW_KEY) as View | null;
        const savedStep = sessionStorage.getItem(PREFERENCIAS_STEP_KEY);
        if (savedView === 'wizard' && savedStep) {
          const idx = Number(savedStep);
          if (!Number.isNaN(idx) && idx >= 0) {
            setStepIndex(idx);
            setView('wizard');
          }
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false));
  }, [fromOnboarding, initialBlock]);

  const persist = useCallback((nextAnswers: Record<string, string[]>, nextProfile: CommercialProfile) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaveStatus('saving');
      const merged = applyPreferenciasAnswers(nextAnswers, nextProfile);
      portalApi
        .updatePerfil(merged as Record<string, unknown>)
        .then((res) => {
          setProfile(res.profile as CommercialProfile);
          setSaveStatus('saved');
        })
        .catch(() => setSaveStatus('error'));
    }, 400);
  }, []);

  const setAnswer = (stepId: string, value: string[]) => {
    if (!profile) return;
    setAnswers((prev) => {
      const updated = { ...prev, [stepId]: value };
      persist(updated, profile);
      return updated;
    });
  };

  const toggleOption = (stepId: string, option: string, multi: boolean) => {
    const current = answers[stepId] ?? [];
    if (!multi) {
      setAnswer(stepId, current.includes(option) ? [] : [option]);
      return;
    }
    const next = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
    setAnswer(stepId, next);
  };

  const goToBlock = (block: PreferenciasBlock) => {
    const idx = stepIndexForBlock(activeSteps, block, answers);
    setStepIndex(idx);
    setView('wizard');
    sessionStorage.setItem(PREFERENCIAS_STEP_KEY, String(idx));
    sessionStorage.setItem(PREFERENCIAS_VIEW_KEY, 'wizard');
  };

  const finishWizard = async () => {
    if (!profile) return;
    setFinishing(true);
    setError('');
    try {
      const merged = applyPreferenciasAnswers(answers, profile);
      await portalApi.updatePerfil(merged as Record<string, unknown>);
      if (fromOnboarding) {
        await portalApi.updateOnboarding({ completeOnboarding: true, profile: merged as Record<string, unknown> });
        sessionStorage.setItem('kova_portal_onboarding_complete', 'true');
        router.push('/portal');
        router.refresh();
        return;
      }
      sessionStorage.removeItem(PREFERENCIAS_STEP_KEY);
      sessionStorage.removeItem(PREFERENCIAS_VIEW_KEY);
      setView('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos guardar');
    } finally {
      setFinishing(false);
    }
  };

  const goNext = () => {
    if (!currentStep) return;
    const selected = answers[currentStep.id] ?? [];

    if (currentStep.id === 'idiomas-review' && selected[0] === 'Quiero revisarlos') {
      router.push('/portal/formacion');
      return;
    }

    if (!currentStep.optional && selected.length === 0) return;

    if (stepIndex >= activeSteps.length - 1) {
      void finishWizard();
      return;
    }

    const next = stepIndex + 1;
    setStepIndex(next);
    sessionStorage.setItem(PREFERENCIAS_STEP_KEY, String(next));
  };

  const goBack = () => {
    if (fromOnboarding && stepIndex <= 0) return;
    if (stepIndex <= 0) {
      setView('hub');
      sessionStorage.removeItem(PREFERENCIAS_STEP_KEY);
      sessionStorage.setItem(PREFERENCIAS_VIEW_KEY, 'hub');
      return;
    }
    const prev = stepIndex - 1;
    setStepIndex(prev);
    sessionStorage.setItem(PREFERENCIAS_STEP_KEY, String(prev));
  };

  const canContinue = useMemo(() => {
    if (!currentStep) return false;
    if (currentStep.optional) return true;
    if (currentStep.kind === 'slider') return Boolean(answers[currentStep.id]?.[0]);
    return (answers[currentStep.id]?.length ?? 0) > 0;
  }, [answers, currentStep]);

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center py-24 text-[var(--kova-navy-muted)]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Cargando preferencias...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-[var(--kova-border)] bg-white p-8 text-center text-[var(--kova-navy-muted)]">
        {error || 'No pudimos cargar tu perfil'}
      </div>
    );
  }

  if (view === 'done') {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="rounded-xl border border-[var(--kova-border)] bg-white p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--kova-lime)] text-[var(--kv-ink)]">
            <Check className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <h1 className="kova-portal-title kova-portal-title-md font-heading">Preferencias guardadas</h1>
          <p className="kova-portal-body mt-2">
            Tu perfil quedó listo para matching. Revisamos vacantes compatibles con lo que nos contaste.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href="/portal/vacantes" className={btnPrimary}>
              Ver vacantes
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button type="button" className={btnSecondary} onClick={() => setView('hub')}>
              Revisar respuestas
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'hub') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <section className="rounded-xl border border-[var(--kova-border)] bg-white p-6 lg:p-8">
          <p className="kova-portal-eyebrow">Tu perfil</p>
          <h1 className="kova-portal-title kova-portal-title-lg mt-2 font-heading">Preferencias laborales</h1>
          <p className="kova-portal-body mt-3">
            Una pregunta a la vez, sin formularios largos. Todo se guarda solo — entra, responde y sal cuando
            quieras.
          </p>

          {snapshot && (snapshot.experiencias > 0 || snapshot.estudios > 0) ? (
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {snapshot.experiencias > 0 ? (
                <div className="rounded-lg border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/50 px-3 py-2 text-center">
                  <p className="kova-portal-stat text-xl">{snapshot.experiencias}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--kova-navy-muted)]">
                    Experiencias
                  </p>
                </div>
              ) : null}
              {snapshot.estudios > 0 ? (
                <div className="rounded-lg border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/50 px-3 py-2 text-center">
                  <p className="kova-portal-stat text-xl">{snapshot.estudios}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--kova-navy-muted)]">
                    Estudios
                  </p>
                </div>
              ) : null}
              {snapshot.idiomas > 0 ? (
                <div className="rounded-lg border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/50 px-3 py-2 text-center">
                  <p className="kova-portal-stat text-xl">{snapshot.idiomas}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--kova-navy-muted)]">
                    Idiomas
                  </p>
                </div>
              ) : null}
              {snapshot.certificaciones > 0 ? (
                <div className="rounded-lg border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/50 px-3 py-2 text-center">
                  <p className="kova-portal-stat text-xl">{snapshot.certificaciones}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--kova-navy-muted)]">
                    Certificados
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-6 border-t border-[var(--kova-border)] pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[var(--kova-navy)]">Progreso general</span>
              <span className="font-heading font-bold text-[var(--kova-navy)]">{progress}%</span>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[var(--kova-border)]">
              <div
                className="h-full rounded-full bg-[var(--kova-navy)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        <div className="space-y-3">
          {PREFERENCIAS_BLOCKS.map((block, i) => {
            const { done, total, percent } = blockProgress(block, answers, profile);
            const isDone = done === total && total > 0;
            return (
              <button
                key={block}
                type="button"
                onClick={() => goToBlock(block)}
                className="flex w-full items-center gap-4 rounded-xl border border-[var(--kova-border)] bg-white p-5 text-left transition hover:border-[var(--kova-border-strong)]"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${
                    isDone
                      ? 'border-[var(--kova-navy)] bg-[var(--kova-navy)] text-white'
                      : 'border-[var(--kova-border)] bg-[var(--kova-surface-2)] text-[var(--kova-navy-muted)]'
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="kova-portal-eyebrow">{`Bloque ${i + 1}`}</p>
                  <p className="font-heading text-base font-bold text-[var(--kova-navy)]">
                    {PREFERENCIAS_BLOCK_LABELS[block]}
                  </p>
                  <p className="mt-0.5 text-sm text-[var(--kova-navy-muted)]">{PREFERENCIAS_BLOCK_HINTS[block]}</p>
                  <p className="mt-1 text-xs text-[var(--kova-navy-muted)]">
                    {done} de {total} respondidas
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-[var(--kova-navy-muted)]">{percent}%</span>
              </button>
            );
          })}
        </div>

        {complete ? (
          <div className="rounded-xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/50 px-5 py-4">
            <p className="text-sm text-[var(--kova-navy-muted)]">
              <Sparkles className="mr-1.5 inline h-4 w-4 text-[var(--kova-navy)]" />
              Lo esencial está listo. Puedes afinar respuestas o ir a vacantes.
            </p>
            <Link href="/portal/vacantes" className={`mt-3 ${btnPrimary}`}>
              Ver vacantes compatibles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <button type="button" className={btnPrimary} onClick={() => goToBlock('buscas')}>
            {progress > 0 ? 'Continuar donde quedé' : 'Empezar'}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/portal/experiencia"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--kova-border)] px-3 py-2 text-[var(--kova-navy-muted)] hover:text-[var(--kova-navy)]"
          >
            <Briefcase className="h-3.5 w-3.5" />
            Mi experiencia
          </Link>
          <Link
            href="/portal/formacion"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--kova-border)] px-3 py-2 text-[var(--kova-navy-muted)] hover:text-[var(--kova-navy)]"
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Formación
          </Link>
        </div>

        {error ? <p className="text-sm text-[var(--kova-coral)]">{error}</p> : null}
      </div>
    );
  }

  if (!currentStep) return null;

  const selected = answers[currentStep.id] ?? [];
  const blockIdx = PREFERENCIAS_BLOCKS.indexOf(currentStep.block);
  const stepsInBlock = activeSteps.filter((s) => s.block === currentStep.block);
  const idxInBlock = stepsInBlock.findIndex((s) => s.id === currentStep.id);
  const isLast = stepIndex >= activeSteps.length - 1;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      {fromOnboarding ? (
        <div className="rounded-xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/60 px-4 py-3 text-sm text-[var(--kova-navy-muted)]">
          Paso final del onboarding · {progress}% del perfil comercial
        </div>
      ) : null}

      <div className="rounded-xl border border-[var(--kova-border)] bg-white p-5 lg:p-6">
        <div className="mb-5 flex items-center justify-between gap-3 text-xs font-medium text-[var(--kova-navy-muted)]">
          <span>
            Bloque {blockIdx + 1} · {PREFERENCIAS_BLOCK_LABELS[currentStep.block]}
          </span>
          <span>
            {idxInBlock + 1} / {stepsInBlock.length}
          </span>
        </div>
        <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-[var(--kova-border)]">
          <div
            className="h-full rounded-full bg-[var(--kova-navy)] transition-all"
            style={{ width: `${Math.round(((stepIndex + 1) / activeSteps.length) * 100)}%` }}
          />
        </div>

        <h2 className="kova-portal-title kova-portal-title-md font-heading">{currentStep.title}</h2>
        {currentStep.subtitle ? (
          <p className="mt-2 text-sm text-[var(--kova-navy-muted)]">{currentStep.subtitle}</p>
        ) : currentStep.multi ? (
          <p className="mt-2 text-sm text-[var(--kova-navy-muted)]">Puedes seleccionar varias opciones.</p>
        ) : null}

        {currentStep.kind === 'slider' ? (
          <div className="mt-6 space-y-4">
            <p className="text-center font-heading text-lg font-bold text-[var(--kova-navy)]">
              {SALARY_SLIDER_LABELS[salaryIdx]}
            </p>
            <input
              type="range"
              min={0}
              max={SALARY_SLIDER_LABELS.length - 1}
              step={1}
              value={salaryIdx}
              onChange={(e) => {
                const idx = Number(e.target.value);
                setSalaryIdx(idx);
                setAnswer(currentStep.id, [SALARY_SLIDER_LABELS[idx]]);
              }}
              className="kova-salary-slider w-full"
              aria-label="Aspiración salarial"
            />
            <div className="flex justify-between text-[10px] font-medium text-[var(--kova-navy-muted)]">
              <span>Menor</span>
              <span>Mayor</span>
            </div>
          </div>
        ) : currentStep.kind === 'idiomas-review' ? (
          <div className="mt-5 space-y-3">
            <ul className="rounded-lg border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/40 divide-y divide-[var(--kova-border)]">
              {(profile.idiomas ?? []).map((lang) => (
                <li key={lang.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <span className="inline-flex items-center gap-2 font-medium text-[var(--kova-navy)]">
                    <Languages className="h-4 w-4 text-[var(--kova-navy-muted)]" />
                    {lang.idioma}
                  </span>
                  <span className="text-[var(--kova-navy-muted)]">{lang.nivel}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {currentStep.options.map((option) => {
                const on = selected.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleOption(currentStep.id, option, false)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                      on
                        ? 'border-transparent bg-[var(--kova-lime)] text-[var(--kv-ink)]'
                        : 'border-[var(--kova-border-strong)] bg-white text-[var(--kova-navy)]'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap gap-2">
            {currentStep.options.map((option) => {
              const on = selected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleOption(currentStep.id, option, currentStep.multi)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition ${
                    on
                      ? 'border-transparent bg-[var(--kova-lime)] text-[var(--kv-ink)]'
                      : 'border-[var(--kova-border-strong)] bg-white text-[var(--kova-navy)] hover:border-[var(--kova-navy)]/15'
                  }`}
                >
                  {on ? <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} /> : null}
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        )}

        {currentStep.optional ? (
          <p className="mt-3 text-xs text-[var(--kova-navy-muted)]">Opcional — puedes continuar sin responder.</p>
        ) : null}

        <div className="mt-5 min-h-[1.25rem] text-xs text-[var(--kova-navy-muted)]">
          {saveStatus === 'saving' ? 'Guardando...' : null}
          {saveStatus === 'saved' ? '✓ Guardado automáticamente' : null}
          {saveStatus === 'error' ? 'No pudimos guardar. Reintentaremos al continuar.' : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--kova-border)] pt-4">
          <button type="button" className={btnSecondary} onClick={goBack} disabled={fromOnboarding && stepIndex === 0}>
            <ArrowLeft className="h-4 w-4" />
            {stepIndex === 0 && !fromOnboarding ? 'Volver al inicio' : 'Anterior'}
          </button>
          <button
            type="button"
            className={btnPrimary}
            disabled={!canContinue || finishing}
            onClick={goNext}
          >
            {finishing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : isLast ? (
              fromOnboarding ? 'Terminar onboarding' : 'Finalizar'
            ) : (
              <>
                Continuar
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {!fromOnboarding ? (
        <p className="text-center text-xs text-[var(--kova-navy-muted)]">
          Pregunta {stepIndex + 1} de {activeSteps.length} · puedes salir y retomar cuando quieras
        </p>
      ) : null}
    </div>
  );
}
