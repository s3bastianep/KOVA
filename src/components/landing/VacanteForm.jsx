import React, { useState } from 'react';
import { submitEarlyAccess } from '@/api/earlyAccess';
import { ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const vacantes = [
  'Ejecutivo comercial',
  'SDR / Prospección',
  'Account manager',
  'Director / Gerente comercial',
  'Otra vacante comercial',
];

const inputClass =
  'w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-shadow';
const inputStyle = { background: KOVA.white, border: '1px solid #CBD5E1', color: BRAND.navy };

export default function VacanteForm({ compact = false }) {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    empresa: '',
    vacante: '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.correo || !form.nombre || !form.empresa || !form.vacante) {
      setError('Completa todos los campos.');
      return;
    }

    if (
      !form.correo.includes('@') ||
      form.correo.includes('@gmail.') ||
      form.correo.includes('@hotmail.') ||
      form.correo.includes('@yahoo.')
    ) {
      setError('Usa tu correo corporativo (ej: nombre@tuempresa.com).');
      return;
    }

    setLoading(true);
    try {
      await submitEarlyAccess({
        nombre: form.nombre,
        correo: form.correo,
        empresa: form.empresa,
        cargo: '',
        mensaje: `Perfil comercial buscado: ${form.vacante}`,
      });
      setDone(true);
    } catch (err) {
      setError(err.message || 'No pudimos enviar tu solicitud. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const labelClass = compact
    ? 'block text-sm font-medium mb-1.5'
    : 'block text-xs font-semibold mb-2 uppercase tracking-wide';

  if (done) {
    return (
      <div
        className={`kova-card text-center ${compact ? 'rounded-xl p-8' : 'rounded-2xl p-10'}`}
        style={{ boxShadow: compact ? '0 4px 24px rgba(15,31,61,0.08)' : undefined }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: KOVA.paleGreen, border: '1px solid #A8E8D4' }}
        >
          <CheckCircle2 className="w-7 h-7" style={{ color: BRAND.green }} strokeWidth={2} />
        </div>
        <h3 className="font-heading font-semibold text-xl mb-2" style={{ color: BRAND.navy }}>
          Solicitud recibida
        </h3>
        <p className="text-sm mb-2 leading-relaxed" style={{ color: KOVA.body }}>
          Un especialista de Kova te contactará en las próximas 24 horas hábiles.
        </p>
        <p className="text-sm font-medium" style={{ color: BRAND.blue }}>
          contacto@kova.com.co
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`kova-card overflow-hidden ${compact ? 'rounded-xl p-6 sm:p-7' : 'rounded-2xl'}`}
      style={compact ? { boxShadow: '0 4px 24px rgba(15,31,61,0.08)' } : undefined}
    >
      {!compact && (
        <div className="px-6 pt-6 pb-5 border-b" style={{ borderColor: KOVA.border, background: KOVA.surface }}>
          <h3 className="font-heading font-semibold text-lg mb-1" style={{ color: BRAND.navy }}>
            Contáctenos
          </h3>
          <p className="text-sm" style={{ color: KOVA.body }}>
            Solo lo esencial. Un especialista de Kova te contacta directamente.
          </p>
        </div>
      )}

      <div className={compact ? 'space-y-4' : 'p-6 space-y-4'}>
        {compact && (
          <div className="mb-1">
            <h2 className="font-heading font-semibold text-xl mb-1" style={{ color: BRAND.navy }}>
              Contáctenos
            </h2>
            <p className="text-sm" style={{ color: KOVA.muted }}>
              Complete el formulario. Le respondemos en 24 horas hábiles.
            </p>
          </div>
        )}

        <div>
          <label className={labelClass} style={{ color: compact ? BRAND.navy : '#475569' }}>
            Correo corporativo <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <input
            type="email"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            placeholder="nombre@empresa.com"
            className={inputClass}
            style={inputStyle}
            autoComplete="email"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={{ color: compact ? BRAND.navy : '#475569' }}>
              Nombre <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Su nombre"
              className={inputClass}
              style={inputStyle}
              autoComplete="name"
            />
          </div>
          <div>
            <label className={labelClass} style={{ color: compact ? BRAND.navy : '#475569' }}>
              Empresa <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={form.empresa}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              placeholder="Nombre de la empresa"
              className={inputClass}
              style={inputStyle}
              autoComplete="organization"
            />
          </div>
        </div>

        <div>
          <label className={labelClass} style={{ color: compact ? BRAND.navy : '#475569' }}>
            Perfil comercial buscado <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <select
            value={form.vacante}
            onChange={(e) => setForm({ ...form, vacante: e.target.value })}
            className={`${inputClass} appearance-none`}
            style={{ ...inputStyle, color: form.vacante ? BRAND.navy : '#94A3B8' }}
          >
            <option value="">Seleccione una opción</option>
            {vacantes.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p
            className="text-sm rounded-lg px-3 py-2"
            style={{ color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FECACA' }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group kova-btn-primary w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-lg text-sm transition-all text-white disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar solicitud'}
          {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
        </button>

        <div className="flex items-start gap-2">
          <Lock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#94A3B8' }} strokeWidth={2} />
          <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
            Datos confidenciales. Solo los usa un especialista de Kova para contactarlo.
          </p>
        </div>
      </div>
    </form>
  );
}
