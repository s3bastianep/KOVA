import React, { useState } from 'react';
import { submitEarlyAccess } from '@/api/earlyAccess';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

const desafios = [
  { id: 'rotacion', label: 'Tengo alta rotación en el equipo de ventas' },
  { id: 'proceso', label: 'No tenemos un proceso comercial definido' },
  { id: 'contratar', label: 'Necesito contratar un vendedor pero no sé cómo evaluarlo' },
  { id: 'escalar', label: 'Quiero escalar el equipo pero no sé por dónde empezar' },
  { id: 'induccion', label: 'Los vendedores nuevos tardan mucho en ser productivos' },
  { id: 'otro', label: 'Tengo otro desafío' },
];

const opciones = ['1–5', '6–20', '21–50', '50+'];

export default function AccesoAnticipado() {
  const [step, setStep] = useState(1); // 1 = elegir desafío, 2 = formulario
  const [desafioSeleccionado, setDesafioSeleccionado] = useState('');
  const [form, setForm] = useState({ nombre: '', empresa: '', cargo: '', correo: '', contrataciones_anuales: '', mensaje: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSelectDesafio = (id, label) => {
    setDesafioSeleccionado(label);
    setForm(f => ({ ...f, mensaje: label }));
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.empresa || !form.correo) {
      setError('Por favor completa nombre, empresa y correo.');
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
    <section id="acceso" className="py-24 px-6 lg:px-8 overflow-hidden" style={{ background: '#FAFBFF', position: 'relative', borderTop: '1px solid #E5E7EB' }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1fr_500px] gap-16 items-start">

          {/* LEFT: pitch */}
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#6366F1', letterSpacing: '0.15em' }}>Acceso anticipado</p>
            <h2 className="font-heading font-black leading-tight mb-4" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', letterSpacing: '-0.02em', color: '#0F0A2A' }}>
              Estamos seleccionando empresas para validar el servicio.
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#6B7280', lineHeight: 1.85 }}>
              Si contratas vendedores y sientes que el proceso actual no te da suficiente certeza, queremos conocerte. Sin compromiso, sin pitch de ventas.
            </p>
            <div className="space-y-3 mb-8">
              {[
                'Respuesta en menos de 48 horas',
                'Prioridad para empresas piloto',
                'Metodología especializada en selección comercial',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#818CF8' }} />
                  <span className="text-sm" style={{ color: '#374151' }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="p-5 rounded-2xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              <p className="text-sm italic leading-relaxed mb-2" style={{ color: '#374151' }}>
                "Pensé que era un pitch de ventas. Terminó siendo la conversación más honesta que tuve sobre mi equipo comercial."
              </p>
              <p className="text-xs font-bold" style={{ color: '#818CF8' }}>— Gerente Comercial, Bogotá</p>
            </div>
          </div>

          {/* RIGHT: interactive contact */}
          <div>
            {done ? (
              <div className="rounded-2xl p-10 text-center bg-white">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#ECFDF5' }}>
                  <CheckCircle2 className="w-6 h-6" style={{ color: '#10B981' }} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2" style={{ color: '#0F0A2A' }}>Perfecto, lo tenemos.</h3>
                <p className="text-sm mb-4" style={{ color: '#6B7280' }}>Un especialista de Kova te va a escribir en menos de 24 horas para coordinar la conversación.</p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>Mientras tanto, si tienes preguntas escribenos a <span style={{ color: '#6366F1' }}>contacto@kova.com.co</span></p>
              </div>

            ) : step === 1 ? (
              <div className="rounded-2xl p-7 bg-white" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#9CA3AF' }}>Paso 1 de 2</p>
                  <h3 className="font-heading font-bold text-base" style={{ color: '#0F0A2A' }}>¿Cuál es el desafío principal de tu equipo comercial ahora mismo?</h3>
                  <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Elige el que más se acerque a tu situación</p>
                </div>
                <div className="space-y-2">
                  {desafios.map(({ id, label }) => (
                    <button key={id} onClick={() => handleSelectDesafio(id, label)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all group"
                      style={{ background: '#F9FAFB', border: '1.5px solid #E5E7EB' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = '#EEF2FF'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; }}>
                        <span className="text-sm font-medium flex-1" style={{ color: '#374151' }}>{label}</span>
                      <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: '#D1D5DB' }} />
                    </button>
                  ))}
                </div>
              </div>

            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl p-7 space-y-4 bg-white" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
                <div>
                  <button type="button" onClick={() => setStep(1)} className="text-xs mb-4 flex items-center gap-1" style={{ color: '#6366F1' }}>
                    ← Cambiar desafío
                  </button>
                  <div className="px-3 py-2 rounded-lg mb-4" style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
                    <p className="text-xs font-semibold" style={{ color: '#4338CA' }}>Tu desafío: <span style={{ color: '#0F0A2A', fontWeight: 400 }}>{desafioSeleccionado}</span></p>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#9CA3AF' }}>Paso 2 de 2</p>
                  <h3 className="font-heading font-bold text-base" style={{ color: '#0F0A2A' }}>¿A quién le avisamos?</h3>
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Solo necesitamos lo básico para coordinar la llamada</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { key: 'nombre', label: 'Tu nombre', placeholder: 'Nombre completo', type: 'text' },
                    { key: 'empresa', label: 'Empresa', placeholder: 'Nombre de la empresa', type: 'text' },
                    { key: 'cargo', label: 'Cargo', placeholder: 'Ej: Gerente Comercial', type: 'text' },
                    { key: 'correo', label: 'Correo', placeholder: 'tu@empresa.com', type: 'email' },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#6B7280' }}>{label}</label>
                      <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder}
                        className="w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                        style={{ background: '#F9FAFB', border: '1.5px solid #E5E7EB', color: '#111827' }}
                        onFocus={e => e.target.style.borderColor = '#6366F1'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#6B7280' }}>Tamaño del equipo</label>
                  <div className="flex flex-wrap gap-2">
                    {opciones.map(op => (
                      <button key={op} type="button" onClick={() => setForm({ ...form, contrataciones_anuales: op })}
                        className="px-3.5 py-1.5 rounded-lg text-sm font-semibold border transition-all"
                        style={form.contrataciones_anuales === op
                          ? { background: '#6366F1', color: '#FFFFFF', borderColor: '#6366F1' }
                          : { background: '#F9FAFB', color: '#6B7280', borderColor: '#E5E7EB' }
                        }>{op}</button>
                    ))}
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <button type="submit" disabled={loading}
                  className="group w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl text-sm transition-all text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}>
                  {loading ? 'Enviando...' : 'Solicitar acceso anticipado'}
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
                </button>
                <p className="text-center text-xs" style={{ color: '#9CA3AF' }}>Sin compromiso · Te escribimos en menos de 24 horas</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}