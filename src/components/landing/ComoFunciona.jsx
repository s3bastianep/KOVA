import React from 'react';
import { ArrowRight } from 'lucide-react';

const pasos = [
  { title: 'Diagnóstico inicial.', desc: 'Entendemos la estructura actual del área comercial, los perfiles existentes, problemas recurrentes y objetivos de crecimiento.', entregable: 'Informe de diagnóstico comercial', color: '#6366F1', bg: '#EEF2FF' },
  { title: 'Definimos el perfil ideal.', desc: 'Construimos el perfil de cargo ideal: competencias, experiencia, estilo de venta y fit cultural — específico para tu empresa.', entregable: 'Perfil de cargo por posición', color: '#0EA5E9', bg: '#F0F9FF' },
  { title: 'Reclutamos y evaluamos.', desc: 'Buscamos activamente, entrevistamos por competencias y aplicamos pruebas psicotécnicas. Solo presentamos candidatos validados.', entregable: 'Terna con informes ejecutivos', color: '#10B981', bg: '#ECFDF5' },
  { title: 'Diseñamos y publicamos el proceso en una plataforma interactiva.', desc: 'Construimos el proceso de ventas específico para tu empresa y lo dejamos vivo en una plataforma interactiva. Cualquier asesor puede entrar, consultar cómo se hace cada etapa y resolver dudas en el momento que las tenga — sin depender de un superior.', entregable: 'Plataforma interactiva del proceso comercial', color: '#F59E0B', bg: '#FFFBEB' },
  { title: 'Inducción gamificada con tu proceso real.', desc: 'El programa de capacitación se construye con el proceso que acabamos de diseñar — personalizado para tu empresa, no contenido genérico. Se entrega en formato gamificado: niveles, retos, evaluaciones y certificaciones para que el aprendizaje sea activo y medible.', entregable: 'Programa gamificado + certificación por asesor', color: '#8B5CF6', bg: '#F5F3FF' },
  { title: 'El área comercial queda lista.', desc: 'Equipo reclutado con criterio, evaluado con pruebas, entrenado y con playbook documentado. Listo para escalar.', entregable: 'Sistema comercial operativo', color: '#EF4444', bg: '#FEF2F2' },
];

export default function ComoFunciona() {
  return (
    <section id="proceso" className="py-24 px-6 lg:px-8" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[360px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#6366F1', letterSpacing: '0.15em' }}>Cómo trabajamos</p>
            <h2 className="font-heading font-black leading-tight mb-5" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', color: '#0F0A2A', letterSpacing: '-0.02em' }}>
              De cero a un área comercial que funciona.
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#6B7280', lineHeight: 1.85 }}>
              Kova acompaña todo el proceso — desde el primer diagnóstico hasta que el equipo está operando.
            </p>
            <button onClick={() => document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl transition-all text-white"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
              Agendar diagnóstico <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-0">
            {pasos.map((p, i) => (
              <div key={i} className="flex gap-4 pb-6 relative">
                {i < pasos.length - 1 && (
                  <div className="absolute left-4 top-9 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, ${p.color}30, transparent)` }} />
                )}
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10"
                  style={{ background: p.bg, border: `2px solid ${p.color}40` }}>
                  <span className="font-mono font-black text-xs" style={{ color: p.color }}>{i + 1}</span>
                </div>
                <div className="pt-0.5 flex-1">
                  <h3 className="font-heading font-bold text-sm mb-1.5" style={{ color: '#0F0A2A' }}>{p.title}</h3>
                  <p className="text-xs leading-relaxed mb-2.5" style={{ color: '#6B7280', lineHeight: 1.75 }}>{p.desc}</p>
                  <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ background: p.bg, color: p.color }}>
                    → {p.entregable}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}