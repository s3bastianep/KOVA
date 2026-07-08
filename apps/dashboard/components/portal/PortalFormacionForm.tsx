'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Plus, Save, Trash2 } from 'lucide-react';
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

export function PortalFormacionForm() {
  const [profile, setProfile] = useState<CommercialProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    portalApi
      .perfil()
      .then((data) => setProfile(data.profile as CommercialProfile))
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false));
  }, []);

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError('');
    try {
      const res = await portalApi.updatePerfil(profile as Record<string, unknown>);
      setProfile(res.profile as CommercialProfile);
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
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
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
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)] mb-2">
          Credenciales
        </p>
        <h1 className="font-heading text-2xl font-bold">Formación e Idiomas</h1>
        <p className="text-[var(--kova-muted)] mt-1">
          Agrega tu trayectoria académica y nivel de idiomas para mejorar tu compatibilidad.
        </p>
      </div>

      {error ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {saved ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Formación guardada correctamente.
        </div>
      ) : null}

      <section className="kova-card rounded-2xl border p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold">Educación</h2>
          <button
            type="button"
            onClick={addEducacion}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Agregar estudio
          </button>
        </div>

        {formacion.length === 0 ? (
          <p className="text-sm text-[var(--kova-muted)]">Aún no registras formación académica.</p>
        ) : null}

        {formacion.map((item) => (
          <article key={item.id} className="rounded-xl border p-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <FieldSelect
                label="Nivel"
                value={item.nivel}
                options={EDUCATION_LEVEL_OPTIONS}
                onChange={(value) => updateEducacion(item.id, { nivel: value })}
              />
              <FieldInput
                label="Año de graduación"
                value={item.anioGraduacion ?? ''}
                onChange={(value) => updateEducacion(item.id, { anioGraduacion: value })}
                placeholder="2020"
              />
            </div>
            <FieldInput
              label="Título"
              value={item.titulo}
              onChange={(value) => updateEducacion(item.id, { titulo: value })}
            />
            <FieldInput
              label="Institución"
              value={item.institucion}
              onChange={(value) => updateEducacion(item.id, { institucion: value })}
            />
            <button
              type="button"
              onClick={() => removeEducacion(item.id)}
              className="inline-flex items-center gap-2 text-sm text-red-700 hover:underline"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </article>
        ))}
      </section>

      <section className="kova-card rounded-2xl border p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold">Idiomas</h2>
          <button
            type="button"
            onClick={addIdioma}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Agregar idioma
          </button>
        </div>

        {idiomas.length === 0 ? (
          <p className="text-sm text-[var(--kova-muted)]">Aún no registras idiomas.</p>
        ) : null}

        {idiomas.map((item) => (
          <article key={item.id} className="rounded-xl border p-4">
            <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
              <FieldSelect
                label="Idioma"
                value={item.idioma}
                options={LANGUAGE_OPTIONS}
                onChange={(value) => updateIdioma(item.id, { idioma: value })}
              />
              <FieldSelect
                label="Nivel"
                value={item.nivel}
                options={LANGUAGE_LEVEL_OPTIONS}
                onChange={(value) => updateIdioma(item.id, { nivel: value })}
              />
              <button
                type="button"
                onClick={() => removeIdioma(item.id)}
                className="inline-flex h-[46px] items-center gap-2 rounded-xl border px-3 text-sm text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Quitar
              </button>
            </div>
          </article>
        ))}
      </section>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
        style={{ background: 'var(--kova-lime)', color: 'var(--kv-ink)' }}
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Guardar formación
          </>
        )}
      </button>
    </form>
  );
}

function FieldInput(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{props.label}</label>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className="w-full rounded-xl border px-4 py-3 text-sm bg-white"
      />
    </div>
  );
}

function FieldSelect(props: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{props.label}</label>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-xl border px-4 py-3 text-sm bg-white"
      >
        <option value="">Selecciona...</option>
        {props.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
