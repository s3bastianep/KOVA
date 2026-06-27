import React, { useState } from 'react';
import { submitEarlyAccess } from '@/api/earlyAccess';
import { ArrowRight, CheckCircle2, Lock } from 'lucide-react';

const roles = [
  'Gerente / Director Comercial',
  'Líder de Talento Humano',
  'CEO / Fundador',
  'Otro',
];

const inputClass = 'w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-shadow';
const inputStyle = { background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A' };

export default function AccesoAnticipado() {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    cargo: '',
    empresa: '',
    mensaje: '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.correo || !form.empresa) {
      setError('Por favor, completa nombre, correo y empresa.');
      return;
    }
    setLoading(true);
    try {
      await submitEarlyAccess(form);
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
        <div className="grid lg:grid-cols-[1fr_500px] gap-16 lg:gap-20 items-start">

          <div className="lg:sticky lg:top-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-4" style={{ color: '#6366F1' }}>
              Solicitar acceso
            </p>
            <h2
              className="font-heading font-bold leading-tight mb-5"
              style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2rem)', letterSpacing: '-0.025em', color: '#0F172A' }}
            >
              Agenda un diagnóstico comercial con nuestro equipo.
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: '#64748B', lineHeight: 1.75 }}>
              Cuéntanos sobre tu vacante y te orientamos con criterio especializado. Sin compromiso, respuesta en menos de 48 horas.
            </p>

            <div className="space-y-4 mb-10">
              {[
                'Diagnóstico inicial sin costo',
                'Metodología especializada en selección comercial',
                'Respuesta en menos de 48 horas',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: '#4338CA' }} strokeWidth={2} />
                  <span className="text-sm font-medium" style={{ color: '#334155' }}>{item}</span>
                </div>
              ))}
            </div>

            <blockquote
              className="rounded-2xl p-6 relative"
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
            >
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#334155', lineHeight: 1.75 }}>
                "Necesitábamos un criterio claro para contratar comercial. El diagnóstico nos ayudó a definir competencias y comparar candidatos con sustento."
              </p>
              <footer>
                <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>Gerente Comercial</p>
                <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>Empresa B2B · Bogotá</p>
              </footer>
            </blockquote>
          </div>

          <div>
            {done ? (
              <div className="kova-card rounded-2xl p-10 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                  <CheckCircle2 className="w-7 h-7" style={{ color: '#059669' }} strokeWidth={2} />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2" style={{ color: '#0F172A' }}>Solicitud recibida</h3>
                <p className="text-sm mb-5 leading-relaxed" style={{ color: '#64748B' }}>
                  Un especialista de Kova te contactará en menos de 48 horas para coordinar el diagnóstico.
                </p>
                <p className="text-sm font-medium" style={{ color: '#4338CA' }}>contacto@kova.com.co</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="kova-card rounded-2xl overflow-hidden">
                <div className="px-7 pt-7 pb-5 border-b" style={{ borderColor: '#E2E8F0', background: '#FAFBFC' }}>
                  <h3 className="font-heading font-semibold text-base mb-1" style={{ color: '#0F172A' }}>
                    Completa tus datos corporativos
                  </h3>
                  <p className="text-sm" style={{ color: '#64748B' }}>
                    Un miembro del equipo se pondrá en contacto contigo.
                  </p>
                </div>

                <div className="p-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#475569' }}>Nombre</label>
                    <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre completo"
                      className={inputClass} style={inputStyle} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#475569' }}>Correo corporativo</label>
                    <input type="email" value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} placeholder="nombre@empresa.com"
                      className={inputClass} style={inputStyle} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#475569' }}>Tu rol</label>
                    <select value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })}
                      className={`${inputClass} appearance-none`}
                      style={{ ...inputStyle, color: form.cargo ? '#0F172A' : '#94A3B8' }}>
                      <option value="">Selecciona tu rol</option>
                      {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#475569' }}>Empresa</label>
                    <input type="text" value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })} placeholder="Nombre de la empresa"
                      className={inputClass} style={inputStyle} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#475569' }}>
                      ¿Qué vacante comercial te cuesta más contratar?
                    </label>
                    <textarea value={form.mensaje} onChange={e => setForm({ ...form, mensaje: e.target.value })}
                      placeholder="Ej: Ejecutivo comercial B2B, SDR, account manager..."
                      rows={3}
                      className={`${inputClass} resize-none`}
                      style={inputStyle} />
                  </div>

                  {error && (
                    <p className="text-sm rounded-lg px-3 py-2" style={{ color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FECACA' }}>
                      {error}
                    </p>
                  )}

                  <button type="submit" disabled={loading}
                    className="group w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl text-sm transition-all text-white disabled:opacity-50 hover:opacity-95"
                    style={{ background: '#4338CA', boxShadow: '0 4px 14px rgba(67,56,202,0.25)' }}>
                    {loading ? 'Enviando...' : 'Agendar diagnóstico comercial'}
                    {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
                  </button>

                  <div className="flex items-start gap-2.5 pt-1">
                    <Lock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#94A3B8' }} strokeWidth={2} />
                    <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
                      Tu información se utiliza únicamente para coordinar el diagnóstico. No compartimos datos con terceros.
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
