import React from 'react';
import { ArrowRight } from 'lucide-react';

const pasos = [
  { title: 'Entendemos la vacante.', desc: 'Conversamos contigo para comprender el rol, el contexto comercial y qué significa el éxito en esa posición.', entregable: 'Brief de vacante comercial', color: '#6366F1', bg: '#EEF2FF' },
  { title: 'Identificamos competencias críticas.', desc: 'Definimos qué capacidades son esenciales para esa vacante específica — no un checklist genérico de ventas.', entregable: 'Mapa de competencias del rol', color: '#0EA5E9', bg: '#F0F9FF' },
  { title: 'Evaluamos candidatos.', desc: 'Aplicamos una metodología especializada para medir esas competencias con evidencia, no solo impresiones.', entregable: 'Evaluación por competencias', color: '#10B981', bg: '#ECFDF5' },
  { title: 'Recomendamos el mejor ajuste.', desc: 'Entregamos una recomendación sustentada que facilita la decisión para comercial, talento humano y dirección.', entregable: 'Reporte de recomendación', color: '#F59E0B', bg: '#FFFBEB' },
];

export default function ComoFunciona() {
  return (
    <section id="proceso" className="py-24 px-6 lg:px-8" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[360px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#6366F1', letterSpacing: '0.15em' }}>Cómo funciona</p>
            <h2 className="font-heading font-black leading-tight mb-5" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', color: '#0F0A2A', letterSpacing: '-0.02em' }}>
              Un sistema claro, de principio a fin.
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#6B7280', lineHeight: 1.85 }}>
              Una buena contratación empieza entendiendo qué necesita realmente la vacante.
            </p>
            <button onClick={() => document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl transition-all text-white"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
              Solicitar acceso anticipado <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
