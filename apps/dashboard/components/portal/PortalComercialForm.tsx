'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Loader2,
  Save,
  Sparkles,
  Target,
  TrendingUp,
  User,
} from 'lucide-react';
import { portalApi } from '@/lib/api';
import {
  CLIENT_TYPE_OPTIONS,
  COMMERCIAL_INDUSTRIES,
  CONTRACT_TYPE_OPTIONS,
  INTERLOCUTOR_OPTIONS,
  PROFESSIONAL_OBJECTIVE_OPTIONS,
  ROLE_FUNCTION_OPTIONS,
  ROLE_LEVEL_OPTIONS,
  SALES_CHANNEL_OPTIONS,
  SALARY_EXPECTATION_OPTIONS,
  SALE_CYCLE_OPTIONS,
  type CommercialProfile,
} from '@/lib/candidate-commercial-profile';

const SALES_TYPE_OPTIONS = ['B2B', 'B2C', 'B2B2C', 'Consultiva', 'Transaccional'] as const;
const SALES_NATURE_OPTIONS = ['Producto', 'Servicio', 'Mixta'] as const;
const SALES_FOCUS_OPTIONS = ['Hunter', 'Farmer', 'Mixto'] as const;

const inputClass =
  'w-full rounded-xl border border-[var(--kova-border)] bg-white px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-[var(--kova-blue)] focus:ring-2 focus:ring-[var(--kova-ring)]';

function isFilled(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
}

function commercialCompleteness(profile: CommercialProfile): number {
  const checks = [
    profile.nivelRol,
    profile.funcionPrincipal,
    profile.objetivoProfesional,
    profile.anios,
    profile.tipoVenta,
    profile.naturaleza,
    profile.enfoque,
    profile.ciclo,
    profile.tipoCliente,
    profile.nivelInterlocutor,
    profile.canalVenta,
    profile.expectativaSalarial,
    profile.tipoContratoDeseado,
    profile.industrias,
  ];
  const done = checks.filter(isFilled).length;
  return Math.round((done / checks.length) * 100);
}

function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--kova-border)] bg-white shadow-[var(--kova-shadow-xs)]">
      <div className="border-b border-[var(--kova-border)] bg-[var(--kova-surface-2)]/40 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--kova-blue-soft)] text-[var(--kova-blue)]">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold">{title}</h2>
            <p className="mt-0.5 text-sm text-[var(--kova-muted)]">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
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

function FieldInput({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--kova-muted)]">{label}</span>
      <input
        type={type}
        min={type === 'number' ? 0 : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

export function PortalComercialForm() {
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

  const completeness = useMemo(() => (profile ? commercialCompleteness(profile) : 0), [profile]);

  const dirty = useMemo(() => {
    if (!profile || !baseline) return false;
    return JSON.stringify(profile) !== JSON.stringify(baseline);
  }, [profile, baseline]);

  const update = (patch: Partial<CommercialProfile>) => {
    setSaved(false);
    setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const toggleIndustry = (industry: string) => {
    setSaved(false);
    setProfile((prev) => {
      if (!prev) return prev;
      const current = prev.industrias ?? [];
      const has = current.includes(industry);
      const industrias = has ? current.filter((i) => i !== industry) : [...current, industry];
      return { ...prev, industrias };
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
        Cargando perfil comercial...
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

  const selectedIndustries = profile.industrias ?? [];

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
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)]">
              Matching
            </p>
            <h1 className="font-heading text-2xl font-bold lg:text-3xl">Perfil comercial</h1>
            <p className="mt-2 text-[var(--kova-muted)]">
              Define tu enfoque comercial para que KOVA te muestre vacantes con mayor compatibilidad.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--kova-border)] bg-white/80 p-4 backdrop-blur-sm lg:min-w-[220px]">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Completitud</span>
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
            <p className="mt-2 text-xs text-[var(--kova-muted)]">
              {completeness >= 85
                ? 'Perfil comercial sólido para matching.'
                : completeness >= 50
                  ? 'Vas bien — completa los campos clave.'
                  : 'Cuanto más completo, mejores vacantes verás.'}
            </p>
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
          Perfil comercial guardado correctamente.
        </div>
      ) : null}

      <FormSection
        title="Rol y trayectoria"
        description="Tu nivel actual y objetivo dentro del mundo comercial."
        icon={User}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldSelect
            label="Nivel de rol"
            value={profile.nivelRol ?? ''}
            onChange={(value) => update({ nivelRol: value })}
            options={ROLE_LEVEL_OPTIONS}
          />
          <FieldSelect
            label="Función principal"
            value={profile.funcionPrincipal ?? ''}
            onChange={(value) => update({ funcionPrincipal: value })}
            options={ROLE_FUNCTION_OPTIONS}
          />
          <FieldSelect
            label="Objetivo profesional"
            value={profile.objetivoProfesional ?? ''}
            onChange={(value) => update({ objetivoProfesional: value })}
            options={PROFESSIONAL_OBJECTIVE_OPTIONS}
          />
          <FieldInput
            label="Años de experiencia comercial"
            type="number"
            value={String(profile.anios ?? '')}
            onChange={(value) => update({ anios: value })}
          />
        </div>
      </FormSection>

      <FormSection
        title="Modelo de venta"
        description="Cómo vendes, a quién y bajo qué condiciones."
        icon={Target}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldSelect
            label="Tipo de venta"
            value={profile.tipoVenta ?? ''}
            onChange={(value) => update({ tipoVenta: value })}
            options={SALES_TYPE_OPTIONS}
          />
          <FieldSelect
            label="Naturaleza de la venta"
            value={profile.naturaleza ?? ''}
            onChange={(value) => update({ naturaleza: value })}
            options={SALES_NATURE_OPTIONS}
          />
          <FieldSelect
            label="Enfoque"
            value={profile.enfoque ?? ''}
            onChange={(value) => update({ enfoque: value })}
            options={SALES_FOCUS_OPTIONS}
          />
          <FieldSelect
            label="Ciclo de venta"
            value={profile.ciclo ?? ''}
            onChange={(value) => update({ ciclo: value })}
            options={SALE_CYCLE_OPTIONS}
          />
          <FieldSelect
            label="Tipo de cliente"
            value={profile.tipoCliente ?? ''}
            onChange={(value) => update({ tipoCliente: value })}
            options={CLIENT_TYPE_OPTIONS}
          />
          <FieldSelect
            label="Interlocutor habitual"
            value={profile.nivelInterlocutor ?? ''}
            onChange={(value) => update({ nivelInterlocutor: value })}
            options={INTERLOCUTOR_OPTIONS}
          />
          <FieldSelect
            label="Canal de venta"
            value={profile.canalVenta ?? ''}
            onChange={(value) => update({ canalVenta: value })}
            options={SALES_CHANNEL_OPTIONS}
          />
          <FieldSelect
            label="Expectativa salarial"
            value={profile.expectativaSalarial ?? ''}
            onChange={(value) => update({ expectativaSalarial: value })}
            options={SALARY_EXPECTATION_OPTIONS}
          />
          <div className="sm:col-span-2">
            <FieldSelect
              label="Tipo de contrato deseado"
              value={profile.tipoContratoDeseado ?? ''}
              onChange={(value) => update({ tipoContratoDeseado: value })}
              options={CONTRACT_TYPE_OPTIONS}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Industrias de experiencia"
        description="Selecciona los sectores donde has vendido o liderado equipos."
        icon={Building2}
      >
        <div className="flex flex-wrap gap-2">
          {COMMERCIAL_INDUSTRIES.map((industry) => {
            const checked = selectedIndustries.includes(industry);
            return (
              <button
                key={industry}
                type="button"
                onClick={() => toggleIndustry(industry)}
                className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                  checked
                    ? 'border-[var(--kova-lime-dark)] bg-[var(--kova-green-soft)] text-[var(--kova-green)] shadow-[var(--kova-shadow-xs)]'
                    : 'border-[var(--kova-border)] bg-white text-[var(--kova-navy-muted)] hover:border-[var(--kova-border-strong)] hover:bg-[var(--kova-surface-2)]'
                }`}
              >
                {industry}
              </button>
            );
          })}
        </div>
        {selectedIndustries.length > 0 ? (
          <p className="mt-4 text-xs text-[var(--kova-muted)]">
            {selectedIndustries.length} industria{selectedIndustries.length === 1 ? '' : 's'} seleccionada
            {selectedIndustries.length === 1 ? '' : 's'}
          </p>
        ) : (
          <p className="mt-4 text-xs italic text-[var(--kova-muted)]">
            Elige al menos una industria para mejorar el matching.
          </p>
        )}
      </FormSection>

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-[var(--kova-border-strong)] bg-[var(--kova-surface-2)]/50 px-5 py-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--kova-indigo)]" />
          <p className="text-sm text-[var(--kova-muted)]">
            Un perfil comercial completo mejora tus matches en vacantes y aplicaciones.
          </p>
        </div>
        <div className="hidden items-center gap-1 text-xs font-medium text-[var(--kova-muted)] sm:flex">
          <TrendingUp className="h-3.5 w-3.5" />
          <Briefcase className="h-3.5 w-3.5" />
        </div>
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
              Guardar perfil comercial
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
