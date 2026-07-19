'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Languages,
  Loader2,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { portalApi, type PortalPerfilResponse } from '@/lib/api';
import { PORTAL_CACHE_KEYS, portalCacheGet } from '@/lib/portal-cache';
import {
  EDUCATION_LEVEL_OPTIONS,
  LANGUAGE_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
  DATE_FIELDS_REQUIRED_MESSAGE,
  missingEducationDateFields,
  newEducationEntry,
  newLanguageEntry,
  type CommercialProfile,
  type EducationEntry,
  type LanguageEntry,
} from '@/lib/candidate-commercial-profile';

const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--kova-lime)] px-4 py-2.5 text-sm font-semibold text-[var(--kv-ink)] transition hover:brightness-[0.97] active:brightness-95 disabled:opacity-60';

const btnSecondary =
  'inline-flex items-center gap-2 rounded-lg border border-[var(--kova-border-strong)] bg-white px-3.5 py-2 text-sm font-medium text-[var(--kova-navy)] transition hover:bg-[var(--kova-surface-2)]';

const inputClass =
  'w-full rounded-lg border border-[var(--kova-border-strong)] bg-white px-3.5 py-2.5 text-sm text-[var(--kova-navy)] outline-none transition placeholder:text-[var(--kova-navy-muted)]/60 focus:border-[var(--kova-navy)]/20 focus:ring-1 focus:ring-[var(--kova-navy)]/8';

const labelClass = 'text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--kova-navy-muted)]';

const LANGUAGE_LEVEL_HINTS: Record<string, string> = {
  A1: 'Principiante: frases básicas',
  A2: 'Elemental: conversaciones simples',
  B1: 'Intermedio: temas cotidianos y trabajo',
  B2: 'Intermedio alto: reuniones y negociación',
  C1: 'Avanzado: fluido en contexto profesional',
  C2: 'Dominio pleno: nivel nativo académico',
  Nativo: 'Lengua materna',
};

function formacionCompleteness(profile: CommercialProfile): number {
  const formacion = profile.formacion ?? [];
  const idiomas = profile.idiomas ?? [];
  let score = 0;
  if (formacion.length > 0) score += 50;
  if (formacion.some((e) => e.titulo && e.institucion && e.nivel && e.anioGraduacion)) score += 25;
  if (idiomas.length > 0) score += 15;
  if (idiomas.some((l) => l.idioma && l.nivel)) score += 10;
  return Math.min(100, score);
}

function educationSummary(entry: EducationEntry): string {
  if (entry.titulo?.trim()) return entry.titulo;
  if (entry.institucion?.trim()) return entry.institucion;
  return 'Nuevo estudio: completa los datos';
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[var(--kova-border)] bg-white px-4 py-3 min-w-[88px]">
      <p className="kova-portal-eyebrow">{label}</p>
      <p className="kova-portal-stat mt-1 text-2xl">{value}</p>
    </div>
  );
}

function FormSection({
  title,
  description,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--kova-border)] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--kova-border)] px-5 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--kova-border)] bg-[var(--kova-surface-2)] text-[var(--kova-navy-muted)]">
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="kova-portal-title kova-portal-title-md font-heading">{title}</h2>
            <p className="mt-0.5 text-sm text-[var(--kova-navy-muted)]">{description}</p>
          </div>
        </div>
        {action}
      </div>
      <div className="space-y-3 p-5 lg:p-6">{children}</div>
    </section>
  );
}

function FieldInput({
  label,
  hint,
  value,
  onChange,
  placeholder,
  invalid,
  errorText,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
  errorText?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className={labelClass}>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        className={`${inputClass}${invalid ? ' border-[var(--kova-coral)] ring-1 ring-[var(--kova-coral)]/30' : ''}`}
      />
      {invalid && errorText ? (
        <span className="text-xs text-[var(--kova-coral)]">{errorText}</span>
      ) : hint ? (
        <span className="text-xs text-[var(--kova-navy-muted)]">{hint}</span>
      ) : null}
    </label>
  );
}

function FieldSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className={labelClass}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        <option value="">Selecciona...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function EducationCard({
  entry,
  index,
  onChange,
  onRemove,
  highlightMissingDates,
}: {
  entry: EducationEntry;
  index: number;
  onChange: (patch: Partial<EducationEntry>) => void;
  onRemove: () => void;
  highlightMissingDates?: boolean;
}) {
  const missingYear =
    Boolean(highlightMissingDates) && missingEducationDateFields(entry).includes('anioGraduacion');
  return (
    <article className="rounded-lg border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/25">
      <div className="flex items-start justify-between gap-3 border-b border-[var(--kova-border)] px-4 py-3">
        <div className="min-w-0">
          <p className="kova-portal-eyebrow">Estudio {String(index + 1).padStart(2, '0')}</p>
          <p className="mt-0.5 truncate font-heading text-sm font-bold text-[var(--kova-navy)]">
            {educationSummary(entry)}
          </p>
          {entry.nivel && entry.anioGraduacion ? (
            <p className="mt-0.5 text-xs text-[var(--kova-navy-muted)]">
              {entry.nivel} · {entry.anioGraduacion}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[var(--kova-navy-muted)] transition hover:text-[var(--kova-coral)]"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Eliminar
        </button>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldSelect
            label="Nivel académico"
            value={entry.nivel}
            options={EDUCATION_LEVEL_OPTIONS}
            onChange={(value) => onChange({ nivel: value })}
          />
          <FieldInput
            label="Año de graduación"
            value={entry.anioGraduacion ?? ''}
            onChange={(value) => onChange({ anioGraduacion: value.replace(/\D/g, '').slice(0, 4) })}
            placeholder="Ej. 2020"
            hint="Solo el año, no la fecha completa"
            invalid={missingYear}
            errorText="Indica el año de graduación (AAAA)"
          />
        </div>
        <FieldInput
          label="Título o carrera"
          value={entry.titulo}
          onChange={(value) => onChange({ titulo: value })}
          placeholder="Ej. Profesional en Mercadeo y Publicidad"
        />
        <FieldInput
          label="Institución"
          value={entry.institucion}
          onChange={(value) => onChange({ institucion: value })}
          placeholder="Universidad, colegio o instituto"
        />
      </div>
    </article>
  );
}

function LanguageCard({
  entry,
  index,
  onChange,
  onRemove,
}: {
  entry: LanguageEntry;
  index: number;
  onChange: (patch: Partial<LanguageEntry>) => void;
  onRemove: () => void;
}) {
  return (
    <article className="rounded-lg border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/25">
      <div className="flex items-start justify-between gap-3 border-b border-[var(--kova-border)] px-4 py-3">
        <div className="min-w-0">
          <p className="kova-portal-eyebrow">Idioma {String(index + 1).padStart(2, '0')}</p>
          <p className="mt-0.5 font-heading text-sm font-bold text-[var(--kova-navy)]">
            {entry.idioma || 'Selecciona un idioma'}
            {entry.nivel ? ` · ${entry.nivel}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[var(--kova-navy-muted)] transition hover:text-[var(--kova-coral)]"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Quitar
        </button>
      </div>

      <div className="space-y-4 p-4">
        <FieldSelect
          label="Idioma"
          value={entry.idioma}
          options={LANGUAGE_OPTIONS}
          onChange={(value) => onChange({ idioma: value })}
        />

        <div className="space-y-2.5">
          <span className={labelClass}>Nivel (marco común europeo)</span>
          <div className="flex flex-wrap gap-1.5">
            {LANGUAGE_LEVEL_OPTIONS.map((level) => {
              const active = entry.nivel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => onChange({ nivel: level })}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                    active
                      ? 'border-transparent bg-[var(--kova-lime)] text-[var(--kv-ink)]'
                      : 'border-[var(--kova-border-strong)] bg-white text-[var(--kova-navy-muted)] hover:border-[var(--kova-navy)]/15 hover:text-[var(--kova-navy)]'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
          {entry.nivel ? (
            <p className="rounded-lg border border-[var(--kova-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--kova-navy-muted)]">
              <span className="font-semibold text-[var(--kova-navy)]">{entry.nivel}:</span>{' '}
              {LANGUAGE_LEVEL_HINTS[entry.nivel] ?? 'Nivel seleccionado'}
            </p>
          ) : (
            <p className="text-xs text-[var(--kova-navy-muted)]">
              Elige el nivel que mejor describe tu dominio actual del idioma.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function PortalFormacionForm() {
  const cached = portalCacheGet<PortalPerfilResponse>(PORTAL_CACHE_KEYS.perfil);
  const initialProfile = (cached?.profile as CommercialProfile) ?? null;
  const [profile, setProfile] = useState<CommercialProfile | null>(initialProfile);
  const [baseline, setBaseline] = useState<CommercialProfile | null>(initialProfile);
  const [loading, setLoading] = useState(() => !cached);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [highlightMissingDates, setHighlightMissingDates] = useState(false);

  useEffect(() => {
    portalApi
      .perfil()
      .then((data) => {
        const loaded = data.profile as CommercialProfile;
        setProfile(loaded);
        setBaseline(loaded);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false));
  }, []);

  const completeness = useMemo(() => (profile ? formacionCompleteness(profile) : 0), [profile]);

  const dirty = useMemo(() => {
    if (!profile || !baseline) return false;
    return JSON.stringify(profile) !== JSON.stringify(baseline);
  }, [profile, baseline]);

  const updateEducacion = (id: string, patch: Partial<EducationEntry>) => {
    setSaved(false);
    setHighlightMissingDates(false);
    if (error === DATE_FIELDS_REQUIRED_MESSAGE) setError('');
    setProfile((prev) => {
      if (!prev) return prev;
      const formacion = (prev.formacion ?? []).map((item) => (item.id === id ? { ...item, ...patch } : item));
      return { ...prev, formacion };
    });
  };

  const updateIdioma = (id: string, patch: Partial<LanguageEntry>) => {
    setSaved(false);
    setProfile((prev) => {
      if (!prev) return prev;
      const idiomas = (prev.idiomas ?? []).map((item) => (item.id === id ? { ...item, ...patch } : item));
      return { ...prev, idiomas };
    });
  };

  const addEducacion = () => {
    setSaved(false);
    setProfile((prev) => (prev ? { ...prev, formacion: [...(prev.formacion ?? []), newEducationEntry()] } : prev));
  };

  const addIdioma = () => {
    setSaved(false);
    setProfile((prev) => (prev ? { ...prev, idiomas: [...(prev.idiomas ?? []), newLanguageEntry()] } : prev));
  };

  const removeEducacion = (id: string) => {
    setSaved(false);
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, formacion: (prev.formacion ?? []).filter((item) => item.id !== id) };
    });
  };

  const removeIdioma = (id: string) => {
    setSaved(false);
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, idiomas: (prev.idiomas ?? []).filter((item) => item.id !== id) };
    });
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!profile) return;
    const datesMissing = (profile.formacion ?? []).some(
      (entry) => missingEducationDateFields(entry).length > 0,
    );
    if (datesMissing) {
      setHighlightMissingDates(true);
      setError(DATE_FIELDS_REQUIRED_MESSAGE);
      return;
    }
    setHighlightMissingDates(false);
    setSaving(true);
    setError('');
    try {
      const res = await portalApi.updatePerfil(profile as Record<string, unknown>);
      const updated = res.profile as CommercialProfile;
      setProfile(updated);
      setBaseline(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--kova-navy-muted)]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Cargando formación...
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

  const formacion = profile.formacion ?? [];
  const idiomas = profile.idiomas ?? [];

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6 pb-24">
      <section className="rounded-xl border border-[var(--kova-border)] bg-white p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <p className="kova-portal-eyebrow">Credenciales</p>
            <h1 className="kova-portal-title kova-portal-title-lg mt-2 font-heading">Formación e idiomas</h1>
            <p className="kova-portal-body mt-3">
              Registra tus estudios formales y los idiomas que dominas. Esto mejora tu compatibilidad con
              vacantes internacionales y roles bilingües.
            </p>
          </div>

          <div className="flex gap-3">
            <MiniStat label="Estudios" value={formacion.length} />
            <MiniStat label="Idiomas" value={idiomas.length} />
          </div>
        </div>

        <div className="mt-6 border-t border-[var(--kova-border)] pt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-[var(--kova-navy)]">Sección completada</span>
            <span className="font-heading text-sm font-bold text-[var(--kova-navy)]">{completeness}%</span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[var(--kova-border)]">
            <div
              className="h-full rounded-full bg-[var(--kova-navy)] transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </section>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-[var(--kova-coral)]/30 bg-[var(--kova-coral)]/5 px-4 py-3 text-sm text-[var(--kova-coral)]"
        >
          {error}
        </div>
      ) : null}

      {saved && !dirty ? (
        <div className="flex items-center gap-2 rounded-xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/50 px-4 py-3 text-sm text-[var(--kova-navy)]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--kova-navy)]" />
          Formación guardada correctamente.
        </div>
      ) : null}

      <FormSection
        title="Educación"
        description="Agrega cada título por separado: pregrado, posgrado, técnico, etc."
        icon={BookOpen}
        action={
          <button type="button" onClick={addEducacion} className={btnSecondary}>
            <Plus className="h-4 w-4" />
            Agregar estudio
          </button>
        }
      >
        {formacion.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--kova-border)] px-6 py-10 text-center">
            <GraduationCap className="mx-auto mb-3 h-8 w-8 text-[var(--kova-navy-muted)]" strokeWidth={1.5} />
            <p className="font-heading text-sm font-bold text-[var(--kova-navy)]">Aún no tienes estudios registrados</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--kova-navy-muted)]">
              Si importaste tu HV, revisa que los datos estén correctos o agrégalos manualmente.
            </p>
            <button type="button" onClick={addEducacion} className={`mt-4 ${btnPrimary}`}>
              <Plus className="h-4 w-4" />
              Agregar primer estudio
            </button>
          </div>
        ) : (
          formacion.map((item, index) => (
            <EducationCard
              key={item.id}
              entry={item}
              index={index}
              highlightMissingDates={highlightMissingDates}
              onChange={(patch) => updateEducacion(item.id, patch)}
              onRemove={() => removeEducacion(item.id)}
            />
          ))
        )}
      </FormSection>

      <FormSection
        title="Idiomas"
        description="Indica en qué idiomas puedes trabajar y tu nivel real hoy."
        icon={Languages}
        action={
          <button type="button" onClick={addIdioma} className={btnSecondary}>
            <Plus className="h-4 w-4" />
            Agregar idioma
          </button>
        }
      >
        {idiomas.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--kova-border)] px-6 py-10 text-center">
            <Languages className="mx-auto mb-3 h-8 w-8 text-[var(--kova-navy-muted)]" strokeWidth={1.5} />
            <p className="font-heading text-sm font-bold text-[var(--kova-navy)]">Sin idiomas registrados</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--kova-navy-muted)]">
              El inglés u otros idiomas pueden abrirte vacantes con mejor match.
            </p>
            <button type="button" onClick={addIdioma} className={`mt-4 ${btnPrimary}`}>
              <Plus className="h-4 w-4" />
              Agregar primer idioma
            </button>
          </div>
        ) : (
          idiomas.map((item, index) => (
            <LanguageCard
              key={item.id}
              entry={item}
              index={index}
              onChange={(patch) => updateIdioma(item.id, patch)}
              onRemove={() => removeIdioma(item.id)}
            />
          ))
        )}
      </FormSection>

      <div className="rounded-xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/40 px-5 py-4">
        <p className="text-sm text-[var(--kova-navy-muted)]">
          <span className="font-semibold text-[var(--kova-navy)]">Tip:</span> B2 o superior en inglés suele ser
          requisito en vacantes comerciales internacionales. Sé honesto con tu nivel.
        </p>
      </div>

      {!dirty ? (
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar formación
            </>
          )}
        </button>
      ) : null}

      {dirty ? (
        <div className="fixed inset-x-0 bottom-6 z-20 flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-xl border border-[var(--kova-border)] bg-white px-4 py-3 shadow-[var(--kova-shadow-lg)]">
          <p className="hidden text-sm text-[var(--kova-navy-muted)] sm:block">Cambios sin guardar</p>
          <button
            type="button"
            onClick={() => {
              setProfile(baseline);
              setSaved(false);
            }}
            className="rounded-lg border border-[var(--kova-border-strong)] px-3 py-2 text-sm font-medium text-[var(--kova-navy)] hover:bg-[var(--kova-surface-2)]"
          >
            Descartar
          </button>
          <button type="button" disabled={saving} onClick={() => void submit()} className={btnPrimary}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar cambios
              </>
            )}
          </button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
