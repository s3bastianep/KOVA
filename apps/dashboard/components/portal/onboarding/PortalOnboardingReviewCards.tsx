'use client';

import { Trash2 } from 'lucide-react';
import type {
  CommercialProfile,
  EducationEntry,
  LanguageEntry,
  WorkHistoryEntry,
} from '@/lib/candidate-commercial-profile';
import {
  EDUCATION_LEVEL_OPTIONS,
  LANGUAGE_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
  newEducationEntry,
  newLanguageEntry,
  newWorkHistoryEntry,
} from '@/lib/commercial-profile-builder';

type Props = {
  profile: CommercialProfile;
  onChange: (profile: CommercialProfile) => void;
};

function ordinalLabel(index: number, kind: 'experiencia' | 'formación' | 'idioma'): string {
  return `${index + 1}ª ${kind}`;
}

function CardHeader({
  label,
  onDelete,
}: {
  label: string;
  onDelete: () => void;
}) {
  return (
    <div className="portal-onboarding-work-card__head">
      <p className="portal-onboarding-work-card__badge">{label}</p>
      <button type="button" className="portal-onboarding-card-delete" onClick={onDelete}>
        <Trash2 className="w-3.5 h-3.5" aria-hidden />
        Eliminar
      </button>
    </div>
  );
}

export function PortalOnboardingReviewCards({ profile, onChange }: Props) {
  const work = profile.historialLaboral ?? [];
  const edu = profile.formacion ?? [];
  const langs = profile.idiomas ?? [];
  const certs = profile.certificaciones ?? [];

  const updateWork = (id: string, patch: Partial<WorkHistoryEntry>) => {
    onChange({
      ...profile,
      historialLaboral: work.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    });
  };

  const updateEdu = (id: string, patch: Partial<EducationEntry>) => {
    onChange({
      ...profile,
      formacion: edu.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    });
  };

  const updateLang = (id: string, patch: Partial<LanguageEntry>) => {
    onChange({
      ...profile,
      idiomas: langs.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    });
  };

  const removeWork = (id: string) => {
    onChange({ ...profile, historialLaboral: work.filter((entry) => entry.id !== id) });
  };

  const removeEdu = (id: string) => {
    onChange({ ...profile, formacion: edu.filter((entry) => entry.id !== id) });
  };

  const removeLang = (id: string) => {
    onChange({ ...profile, idiomas: langs.filter((entry) => entry.id !== id) });
  };

  return (
    <div className="space-y-2">
      <p className="portal-onboarding-section-title">Experiencia laboral</p>
      {work.length === 0 ? (
        <p className="portal-onboarding-muted">No detectamos experiencia en tu hoja de vida. Agrega tu primera experiencia.</p>
      ) : (
        work.map((entry, index) => (
          <article key={entry.id} className="portal-onboarding-work-card">
            <CardHeader label={ordinalLabel(index, 'experiencia')} onDelete={() => removeWork(entry.id)} />

            <label className="portal-onboarding-work-field">
              <span className="portal-onboarding-work-field__label">Empresa</span>
              <input
                className="portal-onboarding-field"
                value={entry.empresa}
                placeholder="Nombre de la empresa"
                onChange={(e) => updateWork(entry.id, { empresa: e.target.value })}
              />
            </label>

            <label className="portal-onboarding-work-field">
              <span className="portal-onboarding-work-field__label">Cargo</span>
              <input
                className="portal-onboarding-field"
                value={entry.cargo}
                placeholder="Ej. Director Comercial"
                onChange={(e) => updateWork(entry.id, { cargo: e.target.value })}
              />
            </label>

            <div className="portal-onboarding-work-period">
              <span className="portal-onboarding-work-period__title">¿Sigues trabajando aquí?</span>

              <div className="portal-onboarding-end-toggle" role="group" aria-label="¿Sigues trabajando aquí?">
                <button
                  type="button"
                  className={`portal-onboarding-end-toggle__btn${entry.trabajoActual ? ' is-on' : ''}`}
                  onClick={() => updateWork(entry.id, { trabajoActual: true, fechaFin: undefined })}
                >
                  Sí
                </button>
                <button
                  type="button"
                  className={`portal-onboarding-end-toggle__btn${!entry.trabajoActual ? ' is-on' : ''}`}
                  onClick={() => updateWork(entry.id, { trabajoActual: false })}
                >
                  No
                </button>
              </div>

              <div className="portal-onboarding-work-period__dates">
                <label className="portal-onboarding-work-field">
                  <span className="portal-onboarding-work-field__label">Inicio</span>
                  <input
                    className="portal-onboarding-field portal-onboarding-field--date"
                    value={entry.fechaInicio}
                    placeholder="MM/AAAA"
                    onChange={(e) => updateWork(entry.id, { fechaInicio: e.target.value })}
                  />
                </label>

                {entry.trabajoActual ? (
                  <div className="portal-onboarding-work-field">
                    <span className="portal-onboarding-work-field__label">Fin</span>
                    <div className="portal-onboarding-current-badge">Actualidad</div>
                  </div>
                ) : (
                  <label className="portal-onboarding-work-field">
                    <span className="portal-onboarding-work-field__label">Fin</span>
                    <input
                      className="portal-onboarding-field portal-onboarding-field--date"
                      value={entry.fechaFin ?? ''}
                      placeholder="MM/AAAA"
                      onChange={(e) => updateWork(entry.id, { fechaFin: e.target.value, trabajoActual: false })}
                    />
                  </label>
                )}
              </div>
            </div>

            <label className="portal-onboarding-work-field">
              <span className="portal-onboarding-work-field__label">Qué hiciste en este cargo</span>
              <textarea
                className="portal-onboarding-field portal-onboarding-field--textarea"
                value={entry.descripcion}
                placeholder="Describe tus responsabilidades y logros en esta empresa"
                rows={4}
                onChange={(e) => updateWork(entry.id, { descripcion: e.target.value })}
              />
            </label>
          </article>
        ))
      )}

      <p className="portal-onboarding-section-title">Formación académica</p>
      {edu.length === 0 ? (
        <p className="portal-onboarding-muted">No detectamos estudios en tu hoja de vida. Agrega tu primera formación.</p>
      ) : (
        edu.map((entry, index) => (
          <article key={entry.id} className="portal-onboarding-work-card">
            <CardHeader label={ordinalLabel(index, 'formación')} onDelete={() => removeEdu(entry.id)} />

            <label className="portal-onboarding-work-field">
              <span className="portal-onboarding-work-field__label">Institución</span>
              <input
                className="portal-onboarding-field"
                value={entry.institucion}
                placeholder="Universidad, colegio o instituto"
                onChange={(e) => updateEdu(entry.id, { institucion: e.target.value })}
              />
            </label>

            <label className="portal-onboarding-work-field">
              <span className="portal-onboarding-work-field__label">Título o carrera</span>
              <input
                className="portal-onboarding-field"
                value={entry.titulo}
                placeholder="Ej. Administración de Empresas"
                onChange={(e) => updateEdu(entry.id, { titulo: e.target.value })}
              />
            </label>

            <div className="portal-onboarding-work-dates">
              <label className="portal-onboarding-work-field">
                <span className="portal-onboarding-work-field__label">Nivel</span>
                <select
                  className="portal-onboarding-field portal-onboarding-field--select"
                  value={entry.nivel}
                  onChange={(e) => updateEdu(entry.id, { nivel: e.target.value })}
                >
                  <option value="">Selecciona nivel</option>
                  {EDUCATION_LEVEL_OPTIONS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
              <label className="portal-onboarding-work-field">
                <span className="portal-onboarding-work-field__label">Año de graduación</span>
                <input
                  className="portal-onboarding-field"
                  value={entry.anioGraduacion ?? ''}
                  placeholder="AAAA"
                  onChange={(e) => updateEdu(entry.id, { anioGraduacion: e.target.value })}
                />
              </label>
            </div>
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
        <p className="portal-onboarding-muted">Sin idiomas detectados.</p>
      ) : (
        langs.map((entry, index) => (
          <article key={entry.id} className="portal-onboarding-work-card">
            <CardHeader label={ordinalLabel(index, 'idioma')} onDelete={() => removeLang(entry.id)} />
            <div className="portal-onboarding-work-dates">
              <label className="portal-onboarding-work-field">
                <span className="portal-onboarding-work-field__label">Idioma</span>
                <select
                  className="portal-onboarding-field portal-onboarding-field--select"
                  value={entry.idioma}
                  onChange={(e) => updateLang(entry.id, { idioma: e.target.value })}
                >
                  <option value="">Selecciona idioma</option>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </label>
              <label className="portal-onboarding-work-field">
                <span className="portal-onboarding-work-field__label">Nivel</span>
                <select
                  className="portal-onboarding-field portal-onboarding-field--select"
                  value={entry.nivel}
                  onChange={(e) => updateLang(entry.id, { nivel: e.target.value })}
                >
                  <option value="">Selecciona nivel</option>
                  {LANGUAGE_LEVEL_OPTIONS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </article>
        ))
      )}

      <button
        type="button"
        className="portal-onboarding-link mt-2"
        onClick={() => {
          const entry = newWorkHistoryEntry();
          onChange({ ...profile, historialLaboral: [...work, entry] });
        }}
      >
        + Agregar experiencia
      </button>
      <button
        type="button"
        className="portal-onboarding-link mt-2 ml-4"
        onClick={() => {
          const entry = newEducationEntry();
          onChange({ ...profile, formacion: [...edu, entry] });
        }}
      >
        + Agregar estudio
      </button>
      <button
        type="button"
        className="portal-onboarding-link mt-2 ml-4"
        onClick={() => {
          const entry = newLanguageEntry();
          onChange({ ...profile, idiomas: [...langs, entry] });
        }}
      >
        + Agregar idioma
      </button>
    </div>
  );
}
