import React, { useState } from 'react';
import { submitEarlyAccess } from '@/api/earlyAccess';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const roles = [
  'Gerente / Director Comercial',
  'Líder de Talento Humano',
  'CEO / Fundador',
  'Otro',
];

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
    <section id="acceso" className="py-24 px-6 lg:px-8 overflow-hidden" style={{ background: '#FFFFFF', position: 'relative', borderTop: '1px solid #E5E7EB' }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1fr_480px] gap-16 items-start">

          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#6366F1', letterSpacing: '0.15em' }}>Solicitar acceso</p>
            <h2 className="font-heading font-black leading-tight mb-4" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', letterSpacing: '-0.02em', color: '#0F0A2A' }}>
              Agenda un diagnóstico comercial con nuestro equipo.
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#6B7280', lineHeight: 1.85 }}>
              Cuéntanos sobre tu vacante y te orientamos con criterio especializado. Sin compromiso, respuesta en menos de 48 horas.
            </p>
            <div className="space-y-3">
              {[
                'Diagnóstico inicial sin costo',
                'Metodología especializada en selección comercial',
                'Respuesta en menos de 48 horas',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#818CF8' }} />
                  <span className="text-sm" style={{ color: '#374151' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {done ? (
              <div className="rounded-2xl p-10 text-center bg-white" style={{ border: '1px solid #E5E7EB', boxShadow: '0 20px 60px rgba(99,102,241,0.08)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#ECFDF5' }}>
                  <CheckCircle2 className="w-6 h-6" style={{ color: '#10B981' }} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2" style={{ color: '#0F0A2A' }}>Solicitud recibida.</h3>
                <p className="text-sm mb-4" style={{ color: '#6B7280' }}>Un especialista de Kova te contactará en menos de 48 horas para coordinar el diagnóstico.</p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>contacto@kova.com.co</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl p-7 space-y-4 bg-white" style={{ border: '1px solid #E5E7EB', boxShadow: '0 20px 60px rgba(99,102,241,0.08)' }}>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#6B7280' }}>Nombre</label>
                  <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre completo"
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                    style={{ background: '#F9FAFB', border: '1.5px solid #E5E7EB', color: '#111827' }}
                    onFocus={e => e.target.style.borderColor = '#6366F1'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#6B7280' }}>Correo corporativo</label>
                  <input type="email" value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} placeholder="tu@empresa.com"
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                    style={{ background: '#F9FAFB', border: '1.5px solid #E5E7EB', color: '#111827' }}
                    onFocus={e => e.target.style.borderColor = '#6366F1'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#6B7280' }}>Tu rol</label>
                  <select value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })}
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none appearance-none"
                    style={{ background: '#F9FAFB', border: '1.5px solid #E5E7EB', color: form.cargo ? '#111827' : '#9CA3AF' }}
                    onFocus={e => e.target.style.borderColor = '#6366F1'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}>
                    <option value="">Selecciona tu rol</option>
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#6B7280' }}>Empresa</label>
                  <input type="text" value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })} placeholder="Nombre de la empresa"
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                    style={{ background: '#F9FAFB', border: '1.5px solid #E5E7EB', color: '#111827' }}
                    onFocus={e => e.target.style.borderColor = '#6366F1'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#6B7280' }}>¿Qué vacante comercial te cuesta más contratar?</label>
                  <textarea value={form.mensaje} onChange={e => setForm({ ...form, mensaje: e.target.value })} placeholder="Ej: Ejecutivo comercial B2B, SDR, account manager..."
                    rows={3}
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none resize-none"
                    style={{ background: '#F9FAFB', border: '1.5px solid #E5E7EB', color: '#111827' }}
                    onFocus={e => e.target.style.borderColor = '#6366F1'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                </div>

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <button type="submit" disabled={loading}
                  className="group w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl text-sm transition-all text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}>
                  {loading ? 'Enviando...' : 'Agendar diagnóstico comercial'}
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
                </button>
                <p className="text-center text-xs" style={{ color: '#9CA3AF' }}>Sin compromiso · Respuesta en menos de 48 horas</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
