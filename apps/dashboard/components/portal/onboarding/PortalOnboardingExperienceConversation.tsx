'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import type { CommercialProfile, WorkHistoryEntry } from '@/lib/candidate-commercial-profile';
import { newWorkHistoryEntry } from '@/lib/commercial-profile-builder';
import {
  EXPERIENCE_ACTIVITY_CHIPS,
  EXPERIENCE_ROLE_CHIPS,
  EXPERIENCE_TENURE_CHIPS,
  type ExperienceConversationPhase,
  isExperienceEntryDraftComplete,
  nextExperiencePhase,
  phaseMicroFeedback,
  phaseQuestion,
  suggestedActivitiesForRole,
  tenureToDates,
} from '@/lib/portal-experience-conversation';

type Props = {
  profile: CommercialProfile;
  onChange: (profile: CommercialProfile) => void;
};

type DraftState = {
  entryId: string;
  phase: ExperienceConversationPhase;
  activities: string[];
  customEmpresa: string;
  customCargo: string;
  feedback: string | null;
};

function entryById(work: WorkHistoryEntry[], id: string): WorkHistoryEntry | undefined {
  return work.find((e) => e.id === id);
}

export function PortalOnboardingExperienceConversation({ profile, onChange }: Props) {
  const work = profile.historialLaboral ?? [];

  const [draft, setDraft] = useState<DraftState>(() => ({
    entryId: work[0]?.id ?? '',
    phase: 'empresa',
    activities: [],
    customEmpresa: '',
    customCargo: '',
    feedback: null,
  }));

  const [editingIndex, setEditingIndex] = useState(0);

  const currentEntry = useMemo(() => {
    const existing = entryById(work, draft.entryId);
    if (existing) return existing;
    return work[editingIndex] ?? null;
  }, [draft.entryId, editingIndex, work]);

  const ensureEntry = useCallback((): WorkHistoryEntry => {
    const found = entryById(work, draft.entryId);
    if (found) return found;
    const entry = newWorkHistoryEntry();
    onChange({ ...profile, historialLaboral: [...work, entry] });
    setDraft((prev) => ({ ...prev, entryId: entry.id }));
    return entry;
  }, [draft.entryId, onChange, profile, work]);

  const patchEntry = useCallback(
    (patch: Partial<WorkHistoryEntry>) => {
      const id = draft.entryId || ensureEntry().id;
      onChange({
        ...profile,
        historialLaboral: (profile.historialLaboral ?? []).map((entry) =>
          entry.id === id
            ? { ...entry, ...patch, sector: patch.sector ?? (entry.sector || 'Comercial') }
            : entry,
        ),
      });
    },
    [draft.entryId, ensureEntry, onChange, profile],
  );

  const advancePhase = useCallback(
    (feedback?: string | null) => {
      const next = nextExperiencePhase(draft.phase);
      if (!next) return;
      setDraft((prev) => ({
        ...prev,
        phase: next,
        feedback: feedback ?? phaseMicroFeedback(prev.phase),
      }));
      window.setTimeout(() => {
        setDraft((prev) => ({ ...prev, feedback: null }));
      }, 1200);
    },
    [draft.phase],
  );

  useEffect(() => {
    if (work.length === 0 && !draft.entryId) {
      const entry = newWorkHistoryEntry();
      onChange({ ...profile, historialLaboral: [entry] });
      setDraft((prev) => ({ ...prev, entryId: entry.id }));
    }
  }, [draft.entryId, onChange, profile, work.length]);

  const startNewExperience = () => {
    const entry = newWorkHistoryEntry();
    const nextWork = [...work, entry];
    onChange({ ...profile, historialLaboral: nextWork });
    setEditingIndex(nextWork.length - 1);
    setDraft({
      entryId: entry.id,
      phase: 'empresa',
      activities: [],
      customEmpresa: '',
      customCargo: '',
      feedback: null,
    });
  };

  const editExperience = (index: number) => {
    const entry = work[index];
    if (!entry) return;
    const acts = entry.descripcion?.split(' · ').map((s) => s.trim()).filter(Boolean) ?? [];
    setEditingIndex(index);
    setDraft({
      entryId: entry.id,
      phase: entry.empresa?.trim() ? (entry.cargo?.trim() ? (entry.fechaInicio?.trim() ? 'actividades' : 'duracion') : 'cargo') : 'empresa',
      activities: acts,
      customEmpresa: '',
      customCargo: '',
      feedback: null,
    });
  };

  const handleEmpresa = (empresa: string) => {
    if (!empresa.trim()) return;
    patchEntry({ empresa: empresa.trim() });
    advancePhase('Registrado.');
  };

  const handleCargo = (cargo: string) => {
    if (!cargo.trim()) return;
    patchEntry({ cargo: cargo.trim() });
    advancePhase('Perfecto.');
  };

  const handleTenure = (tenure: string) => {
    patchEntry(tenureToDates(tenure));
    advancePhase('Excelente.');
  };

  const toggleActivity = (activity: string) => {
    setDraft((prev) => {
      const on = prev.activities.includes(activity);
      const activities = on ? prev.activities.filter((a) => a !== activity) : [...prev.activities, activity];
      return { ...prev, activities };
    });
  };

  const finishActivities = () => {
    const description = draft.activities.join(' · ');
    patchEntry({ descripcion: description, sector: 'Comercial' });
    setDraft((prev) => ({ ...prev, phase: 'resumen', feedback: 'Tu perfil está creciendo.' }));
  };

  const empresaSuggestions = useMemo(() => {
    const fromCv = work.map((e) => e.empresa?.trim()).filter(Boolean) as string[];
    return [...new Set(fromCv)].slice(0, 4);
  }, [work]);

  const roleHints = currentEntry?.cargo ? suggestedActivitiesForRole(currentEntry.cargo) : [];
  const activityOptions = [...new Set([...roleHints, ...EXPERIENCE_ACTIVITY_CHIPS])];

  if (draft.phase === 'resumen' && currentEntry && isExperienceEntryDraftComplete(currentEntry)) {
    return (
      <div className="portal-onboarding-exp-conv">
        <div className="portal-onboarding-exp-conv__done">
          <span className="portal-onboarding-exp-conv__done-icon" aria-hidden>
            <Check className="h-5 w-5" />
          </span>
          <h2>Experiencia agregada</h2>
          <p>
            <strong>{currentEntry.cargo}</strong> en {currentEntry.empresa}
          </p>
          {draft.feedback ? <p className="portal-onboarding-micro-feedback">{draft.feedback}</p> : null}
        </div>

        {work.length > 1 ? (
          <ul className="portal-onboarding-exp-conv__list">
            {work.map((entry, index) => (
              <li key={entry.id}>
                <button type="button" onClick={() => editExperience(index)}>
                  {entry.cargo || 'Sin cargo'} · {entry.empresa || 'Sin empresa'}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <button type="button" className="portal-onboarding-link portal-onboarding-exp-conv__add" onClick={startNewExperience}>
          <Plus className="h-4 w-4" />
          Agregar otra experiencia
        </button>
      </div>
    );
  }

  return (
    <div className="portal-onboarding-exp-conv portal-onboarding-card-enter" key={`${draft.entryId}-${draft.phase}`}>
      <p className="portal-onboarding-exp-conv__step">Tu experiencia</p>
      <h2 className="portal-onboarding-question-title">{phaseQuestion(draft.phase, currentEntry?.empresa)}</h2>

      {draft.phase === 'empresa' ? (
        <>
          {empresaSuggestions.length > 0 ? (
            <div className="portal-onboarding-chips">
              {empresaSuggestions.map((empresa) => (
                <button
                  key={empresa}
                  type="button"
                  className={`portal-onboarding-chip${currentEntry?.empresa === empresa ? ' portal-onboarding-chip--on' : ''}`}
                  onClick={() => handleEmpresa(empresa)}
                >
                  {empresa}
                </button>
              ))}
            </div>
          ) : null}
          <label className="portal-onboarding-exp-conv__input-wrap">
            <input
              className="portal-onboarding-field"
              value={draft.customEmpresa}
              placeholder="Escribe el nombre de la empresa"
              onChange={(e) => setDraft((prev) => ({ ...prev, customEmpresa: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEmpresa(draft.customEmpresa);
              }}
            />
          </label>
          {draft.customEmpresa.trim() ? (
            <button type="button" className="portal-onboarding-btn portal-onboarding-btn--primary portal-onboarding-exp-conv__next" onClick={() => handleEmpresa(draft.customEmpresa)}>
              Continuar
            </button>
          ) : null}
        </>
      ) : null}

      {draft.phase === 'cargo' ? (
        <>
          <div className="portal-onboarding-chips">
            {EXPERIENCE_ROLE_CHIPS.map((cargo) => (
              <button
                key={cargo}
                type="button"
                className={`portal-onboarding-chip${currentEntry?.cargo === cargo ? ' portal-onboarding-chip--on' : ''}`}
                onClick={() => handleCargo(cargo)}
              >
                {cargo}
              </button>
            ))}
          </div>
          <label className="portal-onboarding-exp-conv__input-wrap">
            <input
              className="portal-onboarding-field"
              value={draft.customCargo}
              placeholder="Otro cargo"
              onChange={(e) => setDraft((prev) => ({ ...prev, customCargo: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCargo(draft.customCargo);
              }}
            />
          </label>
          {draft.customCargo.trim() ? (
            <button type="button" className="portal-onboarding-btn portal-onboarding-btn--primary portal-onboarding-exp-conv__next" onClick={() => handleCargo(draft.customCargo)}>
              Continuar
            </button>
          ) : null}
        </>
      ) : null}

      {draft.phase === 'duracion' ? (
        <div className="portal-onboarding-chips">
          {EXPERIENCE_TENURE_CHIPS.map((tenure) => (
            <button key={tenure} type="button" className="portal-onboarding-chip" onClick={() => handleTenure(tenure)}>
              {tenure}
            </button>
          ))}
        </div>
      ) : null}

      {draft.phase === 'actividades' ? (
        <>
          {currentEntry?.cargo ? (
            <p className="portal-onboarding-exp-conv__hint">
              Normalmente este perfil también trabaja con:
            </p>
          ) : null}
          <div className="portal-onboarding-chips">
            {activityOptions.map((activity) => {
              const on = draft.activities.includes(activity);
              const hinted = roleHints.includes(activity);
              return (
                <button
                  key={activity}
                  type="button"
                  className={`portal-onboarding-chip${on ? ' portal-onboarding-chip--on' : ''}${hinted ? ' portal-onboarding-chip--hinted' : ''}`}
                  onClick={() => toggleActivity(activity)}
                >
                  {on ? <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} /> : null}
                  <span>{activity}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="portal-onboarding-btn portal-onboarding-btn--primary portal-onboarding-exp-conv__next"
            disabled={draft.activities.length === 0}
            onClick={finishActivities}
          >
            Continuar
          </button>
        </>
      ) : null}

      {draft.feedback ? <p className="portal-onboarding-micro-feedback">{draft.feedback}</p> : null}

      {work.length > 1 && draft.phase !== 'empresa' ? (
        <button type="button" className="portal-onboarding-link portal-onboarding-exp-conv__switch" onClick={() => editExperience((editingIndex + 1) % work.length)}>
          Cambiar experiencia
        </button>
      ) : null}
    </div>
  );
}
