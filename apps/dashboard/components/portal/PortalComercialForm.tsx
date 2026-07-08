'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Save } from 'lucide-react';
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

export function PortalComercialForm() {
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

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)] mb-2">
          Matching
        </p>
        <h1 className="font-heading text-2xl font-bold">Perfil Comercial</h1>
        <p className="text-[var(--kova-muted)] mt-1">
          Define tu enfoque para que Kova te muestre vacantes realmente compatibles.
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
          Perfil comercial guardado.
        </div>
      ) : null}

      <div className="kova-card rounded-2xl border p-6 grid sm:grid-cols-2 gap-4">
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

      <div className="kova-card rounded-2xl border p-6 grid sm:grid-cols-2 gap-4">
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

      <div className="kova-card rounded-2xl border p-6">
        <p className="text-sm font-medium mb-3">Industrias de experiencia</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {COMMERCIAL_INDUSTRIES.map((industry) => {
            const checked = (profile.industrias ?? []).includes(industry);
            return (
              <label key={industry} className="flex items-center gap-2 text-sm rounded-lg border px-3 py-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleIndustry(industry)}
                />
                {industry}
              </label>
            );
          })}
        </div>
      </div>

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
            Guardar perfil comercial
          </>
        )}
      </button>
    </form>
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

function FieldInput(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{props.label}</label>
      <input
        type={props.type ?? 'text'}
        min={props.type === 'number' ? 0 : undefined}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-xl border px-4 py-3 text-sm bg-white"
      />
    </div>
  );
}
