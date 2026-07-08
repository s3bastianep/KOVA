'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Save } from 'lucide-react';
import {
  AVAILABILITY_OPTIONS,
  RELOCATION_OPTIONS,
  TRAVEL_OPTIONS,
  type CommercialProfile,
} from '@/lib/candidate-commercial-profile';
import { portalApi, getStoredUser } from '@/lib/api';

export function PortalPerfilForm() {
  const [profile, setProfile] = useState<CommercialProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    portalApi
      .perfil()
      .then((data) => setProfile(data.profile as CommercialProfile))
      .catch((err) => {
        if (stored) {
          setProfile({
            nombre: `${stored.firstName} ${stored.lastName}`.trim(),
            email: stored.email,
            telefono: '',
            consentimientoDatos: true,
          });
        }
        setError(err instanceof Error ? err.message : 'Error al cargar');
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (patch: Partial<CommercialProfile>) => {
    setSaved(false);
    setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
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
        Cargando perfil...
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
    <form onSubmit={submit} className="space-y-6 max-w-2xl">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--kova-muted)] mb-2">
          Información personal
        </p>
        <h1 className="font-heading text-2xl font-bold">Mi Perfil</h1>
        <p className="text-[var(--kova-muted)] mt-1">
          Datos de contacto y disponibilidad. Tu correo viene de tu cuenta y no se puede cambiar aquí.
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
          Perfil guardado correctamente.
        </div>
      ) : null}

      <div className="kova-card rounded-2xl border p-6 space-y-5">
        <div className="space-y-2">
          <label htmlFor="perfil-nombre" className="text-sm font-medium">
            Nombre completo
          </label>
          <input
            id="perfil-nombre"
            value={profile.nombre ?? ''}
            onChange={(e) => update({ nombre: e.target.value })}
            required
            className="w-full rounded-xl border px-4 py-3 text-sm bg-white"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="perfil-email" className="text-sm font-medium">
            Correo
          </label>
          <input
            id="perfil-email"
            type="email"
            value={profile.email ?? ''}
            readOnly
            className="w-full rounded-xl border px-4 py-3 text-sm bg-[var(--kova-paper-2)] text-[var(--kova-muted)]"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="perfil-telefono" className="text-sm font-medium">
              Teléfono
            </label>
            <input
              id="perfil-telefono"
              type="tel"
              value={profile.telefono ?? ''}
              onChange={(e) => update({ telefono: e.target.value })}
              required
              className="w-full rounded-xl border px-4 py-3 text-sm bg-white"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="perfil-ciudad" className="text-sm font-medium">
              Ciudad
            </label>
            <input
              id="perfil-ciudad"
              value={profile.ciudad ?? ''}
              onChange={(e) => update({ ciudad: e.target.value })}
              required
              className="w-full rounded-xl border px-4 py-3 text-sm bg-white"
            />
          </div>
        </div>
      </div>

      <div className="kova-card rounded-2xl border p-6 space-y-5">
        <h2 className="font-heading text-lg font-semibold">Disponibilidad</h2>

        <div className="space-y-2">
          <label htmlFor="perfil-disponibilidad" className="text-sm font-medium">
            ¿Cuándo puedes empezar?
          </label>
          <select
            id="perfil-disponibilidad"
            value={profile.disponibilidad ?? ''}
            onChange={(e) => update({ disponibilidad: e.target.value })}
            className="w-full rounded-xl border px-4 py-3 text-sm bg-white"
          >
            <option value="">Selecciona...</option>
            {AVAILABILITY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="perfil-viajar" className="text-sm font-medium">
              ¿Puedes viajar?
            </label>
            <select
              id="perfil-viajar"
              value={profile.disponibilidadViajar ?? ''}
              onChange={(e) => update({ disponibilidadViajar: e.target.value })}
              className="w-full rounded-xl border px-4 py-3 text-sm bg-white"
            >
              <option value="">Selecciona...</option>
              {TRAVEL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="perfil-reubicacion" className="text-sm font-medium">
              ¿Puedes reubicarte?
            </label>
            <select
              id="perfil-reubicacion"
              value={profile.disponibilidadReubicacion ?? ''}
              onChange={(e) => update({ disponibilidadReubicacion: e.target.value })}
              className="w-full rounded-xl border px-4 py-3 text-sm bg-white"
            >
              <option value="">Selecciona...</option>
              {RELOCATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
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
            Guardar cambios
          </>
        )}
      </button>
    </form>
  );
}
