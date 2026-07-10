'use client';

import { Trash2 } from 'lucide-react';
import type {
  CommercialProfile,
  EducationEntry,
  LanguageEntry,
  WorkHistoryEntry,
} from '@/lib/candidate-commercial-profile';
import { COLOMBIAN_CITIES } from '@/lib/candidate-commercial-profile';
import type { ReviewSectionId } from '@/lib/portal-onboarding-unified';
import {
  EDUCATION_LEVEL_OPTIONS,
  LANGUAGE_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
  newCertificationEntry,
  newEducationEntry,
  newLanguageEntry,
  newWorkHistoryEntry,
} from '@/lib/commercial-profile-builder';
import { PortalSkillPicker } from './PortalSkillPicker';

type Props = {
  profile: CommercialProfile;
  section: ReviewSectionId;
  onChange: (profile: CommercialProfile) => void;
};

function ordinalLabel(index: number, kind: 'experiencia' | 'formación' | 'idioma' | 'certificación'): string {
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

function PersonalSection({ profile, onChange }: Props) {
  const ciudad = profile.ciudad?.trim() ?? '';
  const isKnownCity = COLOMBIAN_CITIES.includes(ciudad) && ciudad !== 'Otra';
  const citySelectValue = !ciudad ? '' : isKnownCity ? ciudad : 'Otra';

  // profile.nombre stores the full name as one string; split it for two fields and recombine
  // on change, same pattern as the signup form's Nombre/Apellido split.
  const fullName = profile.nombre?.trim() ?? '';
  const spaceIdx = fullName.indexOf(' ');
  const nombreVal = spaceIdx === -1 ? fullName : fullName.slice(0, spaceIdx);
  const apellidoVal = spaceIdx === -1 ? '' : fullName.slice(spaceIdx + 1);

  return (
    <div className="space-y-3">
      <p className="portal-onboarding-section-title">Información personal</p>
      <div className="portal-onboarding-work-dates">
        <label className="portal-onboarding-work-field">
          <span className="portal-onboarding-work-field__label">Nombre</span>
          <input
            className="portal-onboarding-field"
            value={nombreVal}
            placeholder="Tu nombre"
            onChange={(e) => onChange({ ...profile, nombre: `${e.target.value} ${apellidoVal}`.trim() })}
          />
        </label>
        <label className="portal-onboarding-work-field">
          <span className="portal-onboarding-work-field__label">Apellido</span>
          <input
            className="portal-onboarding-field"
            value={apellidoVal}
            placeholder="Tu apellido"
            onChange={(e) => onChange({ ...profile, nombre: `${nombreVal} ${e.target.value}`.trim() })}
          />
        </label>
      </div>
      <label className="portal-onboarding-work-field">
        <span className="portal-onboarding-work-field__label">Correo</span>
        <input
          className="portal-onboarding-field"
          type="email"
          value={profile.email ?? ''}
          placeholder="tu@correo.com"
          onChange={(e) => onChange({ ...profile, email: e.target.value })}
        />
      </label>
      <label className="portal-onboarding-work-field">
        <span className="portal-onboarding-work-field__label">Teléfono</span>
        <input
          className="portal-onboarding-field"
          type="tel"
          value={profile.telefono ?? ''}
          placeholder="+57 300 000 0000"
          onChange={(e) => onChange({ ...profile, telefono: e.target.value })}
        />
      </label>
      <label className="portal-onboarding-work-field">
        <span className="portal-onboarding-work-field__label">Ciudad</span>
        <select
          className="portal-onboarding-field portal-onboarding-field--select"
          value={citySelectValue}
          onChange={(e) => onChange({ ...profile, ciudad: e.target.value === 'Otra' ? '' : e.target.value })}
        >
          <option value="">Selecciona ciudad</option>
          {COLOMBIAN_CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>
      {citySelectValue === 'Otra' ? (
        <label className="portal-onboarding-work-field">
          <span className="portal-onboarding-work-field__label">¿Cuál ciudad?</span>
          <input
            className="portal-onboarding-field"
            value={isKnownCity ? '' : ciudad}
            placeholder="Escribe tu ciudad"
            onChange={(e) => onChange({ ...profile, ciudad: e.target.value })}
          />
        </label>
      ) : null}
    </div>
  );
}

function ExperienceSection({ profile, onChange }: Props) {
  const work = profile.historialLaboral ?? [];

  const updateWork = (id: string, patch: Partial<WorkHistoryEntry>) => {
    onChange({
      ...profile,
      historialLaboral: work.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    });
  };

  const removeWork = (id: string) => {
    onChange({ ...profile, historialLaboral: work.filter((entry) => entry.id !== id) });
  };

  return (
    <div className="space-y-3">
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
    </div>
  );
}

function EducationSection({ profile, onChange }: Props) {
  const edu = profile.formacion ?? [];

  const updateEdu = (id: string, patch: Partial<EducationEntry>) => {
    onChange({
      ...profile,
      formacion: edu.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    });
  };

  const removeEdu = (id: string) => {
    onChange({ ...profile, formacion: edu.filter((entry) => entry.id !== id) });
  };

  return (
    <div className="space-y-3">
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

      <button
        type="button"
        className="portal-onboarding-link mt-2"
        onClick={() => {
          const entry = newEducationEntry();
          onChange({ ...profile, formacion: [...edu, entry] });
        }}
      >
        + Agregar estudio
      </button>
    </div>
  );
}

function LanguagesSection({ profile, onChange }: Props) {
  const langs = profile.idiomas ?? [];

  const updateLang = (id: string, patch: Partial<LanguageEntry>) => {
    onChange({
      ...profile,
      idiomas: langs.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    });
  };

  const removeLang = (id: string) => {
    onChange({ ...profile, idiomas: langs.filter((entry) => entry.id !== id) });
  };

  return (
    <div className="space-y-3">
      <p className="portal-onboarding-section-title">Idiomas</p>
      {langs.length === 0 ? (
        <p className="portal-onboarding-muted">Sin idiomas detectados. Agrega los que manejas.</p>
      ) : (
        langs.map((entry, index) => {
          const isKnownLanguage = LANGUAGE_OPTIONS.includes(entry.idioma as (typeof LANGUAGE_OPTIONS)[number]);
          const isOtro = entry.idioma === 'Otro' || (!!entry.idioma && !isKnownLanguage);
          const languageSelectValue = !entry.idioma ? '' : isOtro ? 'Otro' : entry.idioma;

          return (
            <article key={entry.id} className="portal-onboarding-work-card">
              <CardHeader label={ordinalLabel(index, 'idioma')} onDelete={() => removeLang(entry.id)} />
              <div className="portal-onboarding-work-dates">
                <label className="portal-onboarding-work-field">
                  <span className="portal-onboarding-work-field__label">Idioma</span>
                  <select
                    className="portal-onboarding-field portal-onboarding-field--select"
                    value={languageSelectValue}
                    onChange={(e) =>
                      updateLang(entry.id, { idioma: e.target.value === 'Otro' ? '' : e.target.value })
                    }
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
              {languageSelectValue === 'Otro' ? (
                <label className="portal-onboarding-work-field">
                  <span className="portal-onboarding-work-field__label">¿Cuál idioma?</span>
                  <input
                    className="portal-onboarding-field"
                    value={isKnownLanguage ? '' : entry.idioma}
                    placeholder="Escribe el idioma"
                    onChange={(e) => updateLang(entry.id, { idioma: e.target.value })}
                  />
                </label>
              ) : null}
            </article>
          );
        })
      )}

      <button
        type="button"
        className="portal-onboarding-link mt-2"
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

function CertificationsSection({ profile, onChange }: Props) {
  const certs = profile.certificaciones ?? [];

  const updateCert = (id: string, patch: Partial<(typeof certs)[number]>) => {
    onChange({
      ...profile,
      certificaciones: certs.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    });
  };

  const removeCert = (id: string) => {
    onChange({ ...profile, certificaciones: certs.filter((entry) => entry.id !== id) });
  };

  return (
    <div className="space-y-3">
      <p className="portal-onboarding-section-title">Certificaciones</p>
      {certs.length === 0 ? (
        <p className="portal-onboarding-muted">Sin certificaciones detectadas. Agrega cursos o certificados relevantes.</p>
      ) : (
        certs.map((entry, index) => (
          <article key={entry.id} className="portal-onboarding-work-card">
            <CardHeader label={ordinalLabel(index, 'certificación')} onDelete={() => removeCert(entry.id)} />
            <label className="portal-onboarding-work-field">
              <span className="portal-onboarding-work-field__label">Nombre</span>
              <input
                className="portal-onboarding-field"
                value={entry.nombre}
                placeholder="Ej. HubSpot Sales Software"
                onChange={(e) => updateCert(entry.id, { nombre: e.target.value })}
              />
            </label>
            <label className="portal-onboarding-work-field">
              <span className="portal-onboarding-work-field__label">Entidad emisora</span>
              <input
                className="portal-onboarding-field"
                value={entry.entidad}
                placeholder="Ej. HubSpot Academy"
                onChange={(e) => updateCert(entry.id, { entidad: e.target.value })}
              />
            </label>
          </article>
        ))
      )}

      <button
        type="button"
        className="portal-onboarding-link mt-2"
        onClick={() => {
          const entry = newCertificationEntry();
          onChange({ ...profile, certificaciones: [...certs, entry] });
        }}
      >
        + Agregar certificación
      </button>
    </div>
  );
}

function SkillsSection({ profile, onChange }: Props) {
  const skills = profile.herramientas ?? [];

  return (
    <div className="space-y-3">
      <p className="portal-onboarding-section-title">Habilidades y herramientas</p>
      <p className="portal-onboarding-muted">
        Elige de la lista de sugerencias mientras escribes, o toca uno de los chips de abajo.
        Cuantas más agregues, mejor te podemos ubicar en las vacantes correctas.
      </p>
      <PortalSkillPicker
        skills={skills}
        onChange={(herramientas) => onChange({ ...profile, herramientas })}
      />
    </div>
  );
}

export function PortalOnboardingReviewCards({ profile, section, onChange }: Props) {
  switch (section) {
    case 'personal':
      return <PersonalSection profile={profile} section={section} onChange={onChange} />;
    case 'experiencia':
      return <ExperienceSection profile={profile} section={section} onChange={onChange} />;
    case 'educacion':
      return <EducationSection profile={profile} section={section} onChange={onChange} />;
    case 'idiomas':
      return <LanguagesSection profile={profile} section={section} onChange={onChange} />;
    case 'certificaciones':
      return <CertificationsSection profile={profile} section={section} onChange={onChange} />;
    case 'skills':
      return <SkillsSection profile={profile} section={section} onChange={onChange} />;
    default:
      return null;
  }
}
