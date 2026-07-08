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
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { portalApi } from '@/lib/api';
import {
  EDUCATION_LEVEL_OPTIONS,
  LANGUAGE_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
  newEducationEntry,
  newLanguageEntry,
  type CommercialProfile,
  type EducationEntry,
  type LanguageEntry,
} from '@/lib/candidate-commercial-profile';

const inputClass =
  'w-full rounded-xl border border-[var(--kova-border)] bg-white px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-[var(--kova-blue)] focus:ring-2 focus:ring-[var(--kova-ring)]';

const LANGUAGE_LEVEL_HINTS: Record<string, string> = {
  A1: 'Principiante — frases básicas',
  A2: 'Elemental — conversaciones simples',
  B1: 'Intermedio — temas cotidianos y trabajo',
  B2: 'Intermedio alto — reuniones y negociación',
  C1: 'Avanzado — fluido en contexto profesional',
  C2: 'Dominio pleno — nivel nativo académico',
  Nativo: 'Lengua materna',
};

function formacionCompleteness(profile: CommercialProfile): number {
  const formacion = profile.formacion ?? [];
  const idiomas = profile.idiomas ?? [];
  let score = 0;
  if (formacion.length > 0) score += 50;
  if (formacion.some((e) => e.titulo && e.institucion && e.nivel)) score += 25;
  if (idiomas.length > 0) score += 15;
  if (idiomas.some((l) => l.idioma && l.nivel)) score += 10;
  return Math.min(100, score);
}

function educationSummary(entry: EducationEntry): string {
  if (entry.titulo?.trim()) return entry.titulo;
  if (entry.institucion?.trim()) return entry.institucion;
  return 'Nuevo estudio — completa los datos';
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
    <section className="overflow-hidden rounded-3xl border border-[var(--kova-border)] bg-white shadow-[var(--kova-shadow-xs)]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--kova-border)] bg-[var(--kova-surface-2)]/40 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--kova-blue-soft)] text-[var(--kova-blue)]">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold">{title}</h2>
            <p className="mt-0.5 text-sm text-[var(--kova-muted)]">{description}</p>
          </div>
        </div>
        {action}
      </div>
      <div className="space-y-4 p-5 sm:p-6">{children}</div>
    </section>
  );
}

function FieldInput({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--kova-muted)]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
      {hint ? <span className="text-xs text-[var(--kova-muted)]">{hint}</span> : null}
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
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--kova-muted)]">{label}</span>
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
}: {
  entry: EducationEntry;
  index: number;
  onChange: (patch: Partial<EducationEntry>) => void;
  onRemove: () => void;
}) {
  const complete = Boolean(entry.nivel && entry.titulo?.trim() && entry.institucion?.trim());

  return (
    <article className="relative overflow-hidden rounded-2xl border border-[var(--kova-border)] bg-white">
      <div
        className={`absolute inset-y-0 left-0 w-1 ${complete ? 'bg-[var(--kova-lime)]' : 'bg-[var(--kova-blue)]'}`}
        aria-hidden
      />

      <div className="border-b border-[var(--kova-border)] bg-[var(--kova-surface-2)]/30 px-4 py-3 pl-5 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--kova-violet-soft)] text-[var(--kova-violet)]">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--kova-muted)]">
                {String(index + 1).padStart(2, '0')} · Estudio
              </p>
              <p className="truncate font-heading text-sm font-semibold">{educationSummary(entry)}</p>
              {entry.nivel && entry.anioGraduacion ? (
                <p className="text-xs text-[var(--kova-muted)]">
                  {entry.nivel} · {entry.anioGraduacion}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar
          </button>
        </div>
      </div>

      <div className="space-y-4 p-4 pl-5 sm:p-5">
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
            onChange={(value) => onChange({ anioGraduacion: value })}
            placeholder="Ej. 2020"
            hint="Solo el año, no la fecha completa"
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
    <article className="relative overflow-hidden rounded-2xl border border-[var(--kova-border)] bg-white">
      <div
        className={`absolute inset-y-0 left-0 w-1 ${entry.nivel ? 'bg-[var(--kova-lime)]' : 'bg-[var(--kova-blue)]'}`}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3 border-b border-[var(--kova-border)] bg-[var(--kova-surface-2)]/30 px-4 py-3 pl-5 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Languages className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--kova-muted)]">
              {String(index + 1).padStart(2, '0')} · Idioma
            </p>
            <p className="font-heading text-sm font-semibold">{entry.idioma || 'Selecciona un idioma'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Quitar
        </button>
      </div>

      <div className="space-y-4 p-4 pl-5 sm:p-5">
        <FieldSelect
          label="Idioma"
          value={entry.idioma}
          options={LANGUAGE_OPTIONS}
          onChange={(value) => onChange({ idioma: value })}
        />

        <div className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--kova-muted)]">
            Nivel (Marco común europeo)
          </span>
          <div className="flex flex-wrap gap-2">
            {LANGUAGE_LEVEL_OPTIONS.map((level) => {
              const active = entry.nivel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => onChange({ nivel: level })}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                    active
                      ? 'border-[var(--kova-lime-dark)] bg-[var(--kova-green-soft)] text-[var(--kova-green)] shadow-[var(--kova-shadow-xs)]'
                      : 'border-[var(--kova-border)] bg-white text-[var(--kova-navy-muted)] hover:border-[var(--kova-border-strong)]'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
          {entry.nivel ? (
            <p className="rounded-xl border border-[var(--kova-border)] bg-[var(--kova-surface-2)]/60 px-3 py-2 text-xs text-[var(--kova-navy-muted)]">
              <strong className="font-semibold">{entry.nivel}:</strong>{' '}
              {LANGUAGE_LEVEL_HINTS[entry.nivel] ?? 'Nivel seleccionado'}
            </p>
          ) : (
            <p className="text-xs italic text-[var(--kova-muted)]">
              Elige el nivel que mejor describe tu dominio actual del idioma.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function PortalFormacionForm() {
  const [profile, setProfile] = useState<CommercialProfile | null>(null);
  const [baseline, setBaseline] = useState<CommercialProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--kova-muted)]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Cargando formación...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="kova-card rounded-2xl border p-8 text-center text-[var(--kova-muted)]">
        {error || 'No pudimos cargar tu perfil'}
      </div>
    );
  }

  const formacion = profile.formacion ?? [];
  const idiomas = profile.idiomas ?? [];

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-8 pb-24">
      <section className="kova-card relative overflow-hidden rounded-3xl border p-6 lg:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            background:
              'radial-gradient(circle at top right, var(--kova-lime), transparent 55%), radial-gradient(circle at bottom left, var(--kova-indigo), transparent 50%)',
          }}
          aria-hidden
        />
        <div className="relative space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)]">
                Credenciales
              </p>
              <h1 className="font-heading text-2xl font-bold lg:text-3xl">Formación e idiomas</h1>
              <p className="mt-2 text-[var(--kova-muted)]">
                Dos bloques simples: tus estudios formales y los idiomas que dominas. Esto mejora tu
                compatibilidad con vacantes internacionales y roles bilingües.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <div className="rounded-xl border border-[var(--kova-border)] bg-white/80 px-3.5 py-2 backdrop-blur-sm">
                <p className="text-[10px] font-mono uppercase tracking-wide text-[var(--kova-muted)]">Estudios</p>
                <p className="font-heading text-xl font-bold">{formacion.length}</p>
              </div>
              <div className="rounded-xl border border-[var(--kova-border)] bg-white/80 px-3.5 py-2 backdrop-blur-sm">
                <p className="text-[10px] font-mono uppercase tracking-wide text-[var(--kova-muted)]">Idiomas</p>
                <p className="font-heading text-xl font-bold">{idiomas.length}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--kova-border)] bg-white/70 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--kova-blue-soft)] text-xs text-[var(--kova-blue)]">
                  1
                </span>
                Educación
              </div>
              <p className="mt-1 text-xs text-[var(--kova-muted)]">Título, institución y nivel de cada estudio.</p>
            </div>
            <div className="rounded-xl border border-[var(--kova-border)] bg-white/70 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-800">
                  2
                </span>
                Idiomas
              </div>
              <p className="mt-1 text-xs text-[var(--kova-muted)]">
                Idioma + nivel (A1–C2 o Nativo) con descripción clara.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--kova-border)] bg-white/70 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Sección completada</span>
              <span className="font-mono font-semibold text-[var(--kova-blue)]">{completeness}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--kova-line)]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${completeness}%`,
                  background: 'linear-gradient(90deg, var(--kova-blue), var(--kova-lime-dark))',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {saved && !dirty ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Formación guardada correctamente.
        </div>
      ) : null}

      <FormSection
        title="Educación"
        description="Agrega cada título por separado — pregrado, posgrado, técnico, etc."
        icon={BookOpen}
        action={
          <button
            type="button"
            onClick={addEducacion}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--kova-border-strong)] bg-white px-3 py-2 text-sm font-semibold shadow-[var(--kova-shadow-xs)] hover:shadow-[var(--kova-shadow-sm)]"
          >
            <Plus className="h-4 w-4" />
            Agregar estudio
          </button>
        }
      >
        {formacion.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--kova-border-strong)] bg-[var(--kova-surface-2)]/50 px-6 py-10 text-center">
            <GraduationCap className="mx-auto mb-3 h-10 w-10 text-[var(--kova-muted)]" strokeWidth={1.25} />
            <p className="font-heading text-sm font-semibold">Aún no tienes estudios registrados</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--kova-muted)]">
              Si importaste tu HV, revisa que los datos estén correctos o agrégalos manualmente.
            </p>
            <button
              type="button"
              onClick={addEducacion}
              className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
              style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
            >
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
          <button
            type="button"
            onClick={addIdioma}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--kova-border-strong)] bg-white px-3 py-2 text-sm font-semibold shadow-[var(--kova-shadow-xs)] hover:shadow-[var(--kova-shadow-sm)]"
          >
            <Plus className="h-4 w-4" />
            Agregar idioma
          </button>
        }
      >
        {idiomas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--kova-border-strong)] bg-[var(--kova-surface-2)]/50 px-6 py-10 text-center">
            <Languages className="mx-auto mb-3 h-10 w-10 text-[var(--kova-muted)]" strokeWidth={1.25} />
            <p className="font-heading text-sm font-semibold">Sin idiomas registrados</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--kova-muted)]">
              El inglés u otros idiomas pueden abrirte vacantes con mejor match.
            </p>
            <button
              type="button"
              onClick={addIdioma}
              className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
              style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
            >
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

      <div className="flex items-start gap-3 rounded-2xl border border-dashed border-[var(--kova-border-strong)] bg-[var(--kova-surface-2)]/50 px-5 py-4">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--kova-indigo)]" />
        <p className="text-sm text-[var(--kova-muted)]">
          <strong className="font-semibold text-[var(--kova-navy)]">Tip:</strong> B2 o superior en inglés suele
          ser requisito en vacantes comerciales internacionales. Sé honesto con tu nivel.
        </p>
      </div>

      {!dirty ? (
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-60"
          style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
        >
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
        <div className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-[var(--kova-border-strong)] bg-white/95 px-4 py-3 shadow-[var(--kova-shadow-lg)] backdrop-blur-md">
          <p className="hidden text-sm text-[var(--kova-muted)] sm:block">Cambios sin guardar</p>
          <button
            type="button"
            onClick={() => {
              setProfile(baseline);
              setSaved(false);
            }}
            className="rounded-xl border px-3 py-2 text-sm font-medium"
          >
            Descartar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void submit()}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-60"
            style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
          >
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
      ) : null}
    </form>
  );
}
