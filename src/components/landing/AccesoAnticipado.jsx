import React, { useState } from 'react';
import { submitEarlyAccess } from '@/api/earlyAccess';
import { ArrowRight, CheckCircle2, Lock, Users } from 'lucide-react';

const vacantes = [
  'Ejecutivo comercial B2B',
  'SDR / Prospección',
  'Account manager',
  'Director / Gerente comercial',
  'Otra vacante comercial',
];

const inputClass = 'w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-shadow';
const inputStyle = { background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A' };

const beneficios = [
  'Diagnóstico con un especialista humano en selección comercial',
  'Metodología propia por competencias, sin automatismos ni IA',
  'Orientación clara sobre tu vacante y perfil ideal',
  'Informe comparativo para decidir con criterio de experto',
  'Menor riesgo de rotación por perfiles mal alineados',
  'Respuesta en menos de 48 horas, sin compromiso',
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
    <section id="acceso" className="py-24 lg:py-28 px-6 lg:px-8 bg-white relative overflow-hidden">
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
            <p className="text-base leading-relaxed mb-8" style={{ color: '#64748B', lineHeight: 1.75 }}>
              ¿Buscas atraer talento comercial con más certeza? Un especialista de Kova te orienta sobre el perfil ideal para tu vacante.
              Criterio humano, metodología especializada y respuesta en 48 horas.
            </p>

            <div className="space-y-3.5 mb-10">
              {beneficios.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: '#059669' }} strokeWidth={2.5} />
                  <span className="text-sm leading-relaxed" style={{ color: '#334155' }}>{item}</span>
                </div>
              ))}
            </div>

            <div
              className="rounded-xl p-5 flex items-start gap-3"
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
            >
              <Users className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#64748B' }} strokeWidth={1.75} />
              <p className="text-sm leading-relaxed" style={{ color: '#64748B', lineHeight: 1.7 }}>
                ¿Eres candidato buscando empleo? Kova evalúa perfiles para empresas clientes.
                Escríbenos a{' '}
                <a href="mailto:contacto@kova.com.co" className="font-medium" style={{ color: '#4338CA' }}>
                  contacto@kova.com.co
                </a>
              </p>
            </div>
          </div>

          <div>
            {done ? (
              <div className="kova-card rounded-2xl p-10 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                  <CheckCircle2 className="w-7 h-7" style={{ color: '#059669' }} strokeWidth={2} />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2" style={{ color: '#0F172A' }}>Solicitud recibida</h3>
                <p className="text-sm mb-5 leading-relaxed" style={{ color: '#64748B' }}>
                  Un especialista de Kova te contactará en menos de 48 horas para coordinar el diagnóstico de tu vacante.
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
                      Datos confidenciales. Solo los usa un especialista de Kova para contactarte. Sin IA, sin terceros.
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
