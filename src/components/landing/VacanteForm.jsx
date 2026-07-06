import React, { useState } from 'react';
import { submitEarlyAccess } from '@/api/earlyAccess';
import { ArrowRight, CheckCircle2, Lock, MessageCircle, Phone } from 'lucide-react';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const cargos = [
  'Director comercial',
  'Gerente comercial',
  'Gerente / Jefe de talento humano',
  'Asistente de talento humano',
  'Director general / CEO',
  'Otro',
];

const vacantes = [
  'Ejecutivo comercial',
  'SDR / Prospección',
  'Account manager',
  'Director / Gerente comercial',
  'Otra vacante comercial',
];

const labelClass = 'block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5';
const inputClass =
  'w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3FAA]/15 focus:border-[#1A3FAA] transition-all';
const inputStyle = { background: KOVA.white, border: `1px solid ${KOVA.border}`, color: BRAND.navy };

function FormSection({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] pt-1" style={{ color: KOVA.muted }}>
        {title}
      </p>
      {children}
    </div>
  );
}

export default function VacanteForm({ compact = false, alternateContact = null }) {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    empresa: '',
    telefono: '',
    cargo: '',
    vacante: '',
    necesidad: '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.correo || !form.nombre || !form.empresa || !form.telefono || !form.cargo || !form.vacante) {
      setError('Complete los campos obligatorios.');
      return;
    }

    if (
      !form.correo.includes('@') ||
      form.correo.includes('@gmail.') ||
      form.correo.includes('@hotmail.') ||
      form.correo.includes('@yahoo.')
    ) {
      setError('Usa su correo corporativo (ej: nombre@tuempresa.com).');
      return;
    }

    const mensajeParts = [`Perfil comercial buscado: ${form.vacante}`];
    if (form.necesidad.trim()) {
      mensajeParts.push(`Necesidad: ${form.necesidad.trim()}`);
    }

    setLoading(true);
    try {
      await submitEarlyAccess({
        nombre: form.nombre,
        correo: form.correo,
        empresa: form.empresa,
        cargo: form.cargo,
        telefono: form.telefono,
        mensaje: mensajeParts.join('\n\n'),
      });
      setDone(true);
    } catch (err) {
      setError(err.message || 'No pudimos enviar su solicitud. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: KOVA.white,
    border: `1px solid ${KOVA.border}`,
    boxShadow: '0 4px 6px rgba(15,31,61,0.04), 0 16px 40px rgba(15,31,61,0.08)',
  };

  if (done) {
    return (
      <div className={`text-center ${compact ? 'rounded-2xl p-8' : 'rounded-2xl p-10'}`} style={cardStyle}>
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
          Un consultor de Kova le contactará en las próximas 24 horas hábiles.
        </p>
        <p className="text-sm font-medium" style={{ color: BRAND.blue }}>
          contacto@kova.com.co
        </p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${compact ? 'rounded-2xl' : 'rounded-2xl'}`} style={cardStyle}>
      <div
        className="px-6 py-5 border-b"
        style={{
          borderColor: KOVA.border,
          background: 'linear-gradient(180deg, #FAFBFC 0%, #FFFFFF 100%)',
        }}
      >
        <h2 className="font-heading font-semibold text-lg mb-1.5" style={{ color: BRAND.navy }}>
          Agendar una consultoría
        </h2>
        <p className="text-[13px] leading-relaxed" style={{ color: KOVA.muted, lineHeight: 1.6 }}>
          Cuanto más contexto nos comparta, más preparado llegará su consultor. Solo toma unos minutos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
        <FormSection title="Sus datos">
          <div>
            <label className={labelClass} style={{ color: '#64748B' }}>
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

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={{ color: '#64748B' }}>
                Nombre completo <span style={{ color: '#DC2626' }}>*</span>
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
              <label className={labelClass} style={{ color: '#64748B' }}>
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
            <label className={labelClass} style={{ color: '#64748B' }}>
              Teléfono o WhatsApp <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="tel"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              placeholder="+57 300 000 0000"
              className={inputClass}
              style={inputStyle}
              autoComplete="tel"
            />
          </div>
        </FormSection>

        <FormSection title="Su vacante">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={{ color: '#64748B' }}>
                Cargo <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <select
                value={form.cargo}
                onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                className={`${inputClass} appearance-none`}
                style={{ ...inputStyle, color: form.cargo ? BRAND.navy : '#94A3B8' }}
              >
                <option value="">Seleccione</option>
                {cargos.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} style={{ color: '#64748B' }}>
                Perfil buscado <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <select
                value={form.vacante}
                onChange={(e) => setForm({ ...form, vacante: e.target.value })}
                className={`${inputClass} appearance-none`}
                style={{ ...inputStyle, color: form.vacante ? BRAND.navy : '#94A3B8' }}
              >
                <option value="">Seleccione</option>
                {vacantes.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass} style={{ color: '#64748B' }}>
              Cuéntenos brevemente su necesidad
            </label>
            <textarea
              value={form.necesidad}
              onChange={(e) => setForm({ ...form, necesidad: e.target.value })}
              placeholder="Vacante urgente, equipo en crecimiento, perfil difícil..."
              rows={2}
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
          </div>
        </FormSection>

        {error && (
          <p
            className="text-sm rounded-lg px-3 py-2"
            style={{ color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FECACA' }}
          >
            {error}
          </p>
        )}

        <div className="pt-1 space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="group kova-btn-primary w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl text-sm transition-all text-white disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Agendar una consultoría'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
          </button>

          <div className="flex items-start gap-2 px-0.5">
            <Lock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#94A3B8' }} strokeWidth={2} />
            <p className="text-[11px] leading-relaxed" style={{ color: '#94A3B8' }}>
              Su información es estrictamente confidencial y será gestionada exclusivamente por un consultor de
              Kova.
            </p>
          </div>
        </div>
      </form>

      {alternateContact && (
        <div
          className="grid grid-cols-2 border-t"
          style={{ borderColor: KOVA.border, background: KOVA.surface }}
        >
          <a
            href={`tel:${alternateContact.phoneTel}`}
            className="flex items-center justify-center gap-2 px-4 py-3.5 text-[13px] font-medium transition-colors hover:bg-white/80 border-r"
            style={{ borderColor: KOVA.border, color: BRAND.navy }}
          >
            <Phone className="w-4 h-4 flex-shrink-0" style={{ color: BRAND.blue }} strokeWidth={2} />
            <span className="truncate">{alternateContact.phoneDisplay}</span>
          </a>
          <a
            href={alternateContact.whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3.5 text-[13px] font-medium transition-colors hover:bg-white/80"
            style={{ color: BRAND.green }}
          >
            <MessageCircle className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
            <span className="truncate">WhatsApp</span>
          </a>
        </div>
      )}
    </div>
  );
}
