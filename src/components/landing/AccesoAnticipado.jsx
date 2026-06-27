import React, { useState } from 'react';
import { submitEarlyAccess } from '@/api/earlyAccess';
import { ArrowRight, CheckCircle2, Lock, Clock } from 'lucide-react';

const vacantes = [
  'Ejecutivo comercial',
  'SDR / Prospección',
  'Account manager',
  'Director / Gerente comercial',
  'Otra vacante comercial',
];

const inputClass = 'w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-shadow';
const inputStyle = { background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A' };

const pasosDespues = [
  { title: 'Confirmación', desc: 'Recibes acuse de solicitud al instante.' },
  { title: 'Diagnóstico', desc: 'Un especialista te contacta en 24 horas hábiles.' },
  { title: 'Propuesta clara', desc: 'Perfil, alcance y siguiente paso para tu vacante.' },
];

export default function AccesoAnticipado() {
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
      setError('Completa correo, nombre, empresa y vacante.');
      return;
    }

    if (!form.correo.includes('@') || form.correo.includes('@gmail.') || form.correo.includes('@hotmail.') || form.correo.includes('@yahoo.')) {
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

  return (
    <section id="acceso" className="py-24 lg:py-28 px-6 lg:px-8 pb-28 md:pb-24 bg-white relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle at 100% 0%, rgba(99,102,241,0.06) 0%, transparent 45%)' }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1fr_440px] gap-14 lg:gap-16 items-start">

          <div className="lg:sticky lg:top-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-4" style={{ color: '#059669' }}>
              Solicitar diagnóstico
            </p>
            <h2
              className="font-heading font-bold leading-tight mb-4"
              style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', letterSpacing: '-0.03em', color: '#0F172A' }}
            >
              Hablemos de tu vacante comercial.
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#64748B', lineHeight: 1.75 }}>
              Cuéntanos tu vacante. Un especialista en selección comercial revisa tu caso, define el perfil ideal
              y te explica cómo Kova puede ayudarte, sin compromiso.
            </p>

            <div
              className="flex gap-4 p-4 rounded-xl mb-8"
              style={{ background: '#FAFBFF', border: '1px solid #E2E8F0' }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-heading font-bold text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #6366F1, #4338CA)' }}
              >
                KV
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>Especialista Kova</p>
                <p className="text-xs mt-0.5 mb-2" style={{ color: '#64748B' }}>Selección comercial · Latinoamérica</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: '#059669' }}>
                  <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Te respondemos en 24 horas hábiles
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>
              Qué pasa después
            </p>
            <div className="space-y-3 mb-8">
              {pasosDespues.map(({ title, desc }, i) => (
                <div key={title} className="flex gap-3">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                    style={{ background: '#EEF2FF', color: '#4338CA' }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>{title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {done ? (
              <div className="kova-card rounded-2xl p-10 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                  <CheckCircle2 className="w-7 h-7" style={{ color: '#059669' }} strokeWidth={2} />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2" style={{ color: '#0F172A' }}>Solicitud recibida</h3>
                <p className="text-sm mb-2 leading-relaxed" style={{ color: '#64748B' }}>
                  Un especialista de Kova te contactará en las próximas 24 horas hábiles para coordinar el diagnóstico.
                </p>
                <p className="text-sm font-medium" style={{ color: '#4338CA' }}>contacto@kova.com.co</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="kova-card rounded-2xl overflow-hidden">
                <div className="px-6 pt-6 pb-5 border-b" style={{ borderColor: '#E2E8F0', background: '#FAFBFC' }}>
                  <h3 className="font-heading font-semibold text-lg mb-1" style={{ color: '#0F172A' }}>
                    Solicitar diagnóstico
                  </h3>
                  <p className="text-sm" style={{ color: '#64748B' }}>
                    Solo lo esencial. Un especialista te contacta directamente.
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#475569' }}>
                      Correo corporativo <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={form.correo}
                      onChange={e => setForm({ ...form, correo: e.target.value })}
                      placeholder="nombre@empresa.com"
                      className={inputClass}
                      style={inputStyle}
                      autoComplete="email"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#475569' }}>
                        Nombre <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={form.nombre}
                        onChange={e => setForm({ ...form, nombre: e.target.value })}
                        placeholder="Tu nombre"
                        className={inputClass}
                        style={inputStyle}
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#475569' }}>
                        Empresa <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={form.empresa}
                        onChange={e => setForm({ ...form, empresa: e.target.value })}
                        placeholder="Nombre de la empresa"
                        className={inputClass}
                        style={inputStyle}
                        autoComplete="organization"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#475569' }}>
                      ¿Qué perfil comercial buscas? <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <select
                      value={form.vacante}
                      onChange={e => setForm({ ...form, vacante: e.target.value })}
                      className={`${inputClass} appearance-none`}
                      style={{ ...inputStyle, color: form.vacante ? '#0F172A' : '#94A3B8' }}
                    >
                      <option value="">Selecciona una opción</option>
                      {vacantes.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <p className="text-sm rounded-lg px-3 py-2" style={{ color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FECACA' }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl text-sm transition-all text-white disabled:opacity-50 hover:opacity-95"
                    style={{ background: '#4338CA', boxShadow: '0 4px 14px rgba(67,56,202,0.25)' }}
                  >
                    {loading ? 'Enviando...' : 'Agendar diagnóstico comercial'}
                    {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
                  </button>

                  <div className="flex items-start gap-2.5">
                    <Lock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#94A3B8' }} strokeWidth={2} />
                    <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
                      Datos confidenciales. Solo los usa un especialista de Kova para contactarte.
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
