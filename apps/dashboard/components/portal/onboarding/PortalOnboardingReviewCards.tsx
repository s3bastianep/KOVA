'use client';

import { useState } from 'react';
import type {
  CommercialProfile,
  EducationEntry,
  LanguageEntry,
  WorkHistoryEntry,
} from '@/lib/candidate-commercial-profile';
import {
  newEducationEntry,
  newLanguageEntry,
  newWorkHistoryEntry,
} from '@/lib/commercial-profile-builder';
import { formatMonthYearDisplay } from '@/app/registro/registro-utils';

type Props = {
  profile: CommercialProfile;
  onChange: (profile: CommercialProfile) => void;
};

type EditTarget =
  | { type: 'work'; id: string }
  | { type: 'edu'; id: string }
  | { type: 'lang'; id: string }
  | null;

export function PortalOnboardingReviewCards({ profile, onChange }: Props) {
  const [editing, setEditing] = useState<EditTarget>(null);
  const [draft, setDraft] = useState<WorkHistoryEntry | EducationEntry | LanguageEntry | null>(null);

  const openWork = (entry: WorkHistoryEntry) => {
    setEditing({ type: 'work', id: entry.id });
    setDraft({ ...entry });
  };

  const openEdu = (entry: EducationEntry) => {
    setEditing({ type: 'edu', id: entry.id });
    setDraft({ ...entry });
  };

  const openLang = (entry: LanguageEntry) => {
    setEditing({ type: 'lang', id: entry.id });
    setDraft({ ...entry });
  };

  const saveEdit = () => {
    if (!editing || !draft) return;
    if (editing.type === 'work') {
      const historialLaboral = (profile.historialLaboral ?? []).map((e) =>
        e.id === editing.id ? (draft as WorkHistoryEntry) : e,
      );
      onChange({ ...profile, historialLaboral });
    } else if (editing.type === 'edu') {
      const formacion = (profile.formacion ?? []).map((e) =>
        e.id === editing.id ? (draft as EducationEntry) : e,
      );
      onChange({ ...profile, formacion });
    } else if (editing.type === 'lang') {
      const idiomas = (profile.idiomas ?? []).map((e) =>
        e.id === editing.id ? (draft as LanguageEntry) : e,
      );
      onChange({ ...profile, idiomas });
    }
    setEditing(null);
    setDraft(null);
  };

  const work = profile.historialLaboral ?? [];
  const edu = profile.formacion ?? [];
  const langs = profile.idiomas ?? [];
  const certs = profile.certificaciones ?? [];

  return (
    <div className="space-y-2">
      {editing && draft ? (
        <div className="portal-onboarding-card mb-6 space-y-3">
          <h3 className="font-semibold">Editar</h3>
          {editing.type === 'work' ? (
            <>
              <label className="block text-sm">
                Empresa
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={(draft as WorkHistoryEntry).empresa}
                  onChange={(e) => setDraft({ ...(draft as WorkHistoryEntry), empresa: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Cargo
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={(draft as WorkHistoryEntry).cargo}
                  onChange={(e) => setDraft({ ...(draft as WorkHistoryEntry), cargo: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Fecha inicio
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={(draft as WorkHistoryEntry).fechaInicio}
                  onChange={(e) => setDraft({ ...(draft as WorkHistoryEntry), fechaInicio: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Fecha fin
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={(draft as WorkHistoryEntry).fechaFin ?? ''}
                  onChange={(e) => setDraft({ ...(draft as WorkHistoryEntry), fechaFin: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Descripción
                <textarea
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm min-h-[80px]"
                  value={(draft as WorkHistoryEntry).descripcion}
                  onChange={(e) => setDraft({ ...(draft as WorkHistoryEntry), descripcion: e.target.value })}
                />
              </label>
            </>
          ) : null}
          {editing.type === 'edu' ? (
            <>
              <label className="block text-sm">
                Institución
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={(draft as EducationEntry).institucion}
                  onChange={(e) => setDraft({ ...(draft as EducationEntry), institucion: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Título
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={(draft as EducationEntry).titulo}
                  onChange={(e) => setDraft({ ...(draft as EducationEntry), titulo: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Año
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={(draft as EducationEntry).anioGraduacion ?? ''}
                  onChange={(e) =>
                    setDraft({ ...(draft as EducationEntry), anioGraduacion: e.target.value })
                  }
                />
              </label>
            </>
          ) : null}
          {editing.type === 'lang' ? (
            <>
              <label className="block text-sm">
                Idioma
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={(draft as LanguageEntry).idioma}
                  onChange={(e) => setDraft({ ...(draft as LanguageEntry), idioma: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Nivel
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={(draft as LanguageEntry).nivel}
                  onChange={(e) => setDraft({ ...(draft as LanguageEntry), nivel: e.target.value })}
                />
              </label>
            </>
          ) : null}
          <div className="flex gap-2 pt-2">
            <button type="button" className="portal-onboarding-btn flex-1" onClick={saveEdit}>
              Guardar
            </button>
            <button
              type="button"
              className="portal-onboarding-btn portal-onboarding-btn--ghost flex-1"
              onClick={() => {
                setEditing(null);
                setDraft(null);
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : null}

      <p className="portal-onboarding-section-title">💼 Experiencia</p>
      {work.length === 0 ? (
        <p className="text-sm text-[var(--kova-muted)]">Sin experiencia detectada.</p>
      ) : (
        work.map((entry) => (
          <article key={entry.id} className="portal-onboarding-review-card mb-3">
            <h3>{entry.cargo || 'Cargo'}</h3>
            <p>{entry.empresa}</p>
            <p className="text-xs font-mono mt-1">
              {formatMonthYearDisplay(entry.fechaInicio)}
              {' — '}
              {entry.trabajoActual ? 'Actualidad' : formatMonthYearDisplay(entry.fechaFin ?? '')}
            </p>
            <button type="button" onClick={() => openWork(entry)}>
              Editar
            </button>
          </article>
        ))
      )}

      <p className="portal-onboarding-section-title">🎓 Formación</p>
      {edu.length === 0 ? (
        <p className="text-sm text-[var(--kova-muted)]">Sin estudios detectados.</p>
      ) : (
        edu.map((entry) => (
          <article key={entry.id} className="portal-onboarding-review-card mb-3">
            <h3>{entry.institucion}</h3>
            <p>{entry.titulo}</p>
            {entry.anioGraduacion ? <p className="text-xs font-mono mt-1">{entry.anioGraduacion}</p> : null}
            <button type="button" onClick={() => openEdu(entry)}>
              Editar
            </button>
          </article>
        ))
      )}

      {certs.length > 0 ? (
        <>
          <p className="portal-onboarding-section-title">Certificaciones</p>
          {certs.map((c) => (
            <article key={c.id} className="portal-onboarding-review-card mb-3">
              <h3>{c.nombre}</h3>
              <p>{c.entidad}</p>
            </article>
          ))}
        </>
      ) : null}

      <p className="portal-onboarding-section-title">Idiomas</p>
      {langs.length === 0 ? (
        <p className="text-sm text-[var(--kova-muted)]">Sin idiomas detectados.</p>
      ) : (
        langs.map((entry) => (
          <article key={entry.id} className="portal-onboarding-review-card mb-3">
            <h3>{entry.idioma}</h3>
            <p>{entry.nivel}</p>
            <button type="button" onClick={() => openLang(entry)}>
              Editar
            </button>
          </article>
        ))
      )}

      <button
        type="button"
        className="text-sm font-semibold text-[var(--kova-indigo)] mt-2"
        onClick={() => {
          const entry = newWorkHistoryEntry();
          onChange({ ...profile, historialLaboral: [...work, entry] });
          openWork(entry);
        }}
      >
        + Agregar experiencia
      </button>
      <button
        type="button"
        className="text-sm font-semibold text-[var(--kova-indigo)] mt-2 ml-4"
        onClick={() => {
          const entry = newEducationEntry();
          onChange({ ...profile, formacion: [...edu, entry] });
          openEdu(entry);
        }}
      >
        + Agregar estudio
      </button>
      <button
        type="button"
        className="text-sm font-semibold text-[var(--kova-indigo)] mt-2 ml-4"
        onClick={() => {
          const entry = newLanguageEntry();
          onChange({ ...profile, idiomas: [...langs, entry] });
          openLang(entry);
        }}
      >
        + Agregar idioma
      </button>
    </div>
  );
}
