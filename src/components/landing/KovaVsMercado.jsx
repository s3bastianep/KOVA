import React from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const filas = [
  { criterio: 'Evaluación psicotécnica especializada en ventas', kova: true, mercado: false },
  { criterio: 'Entrega de terna en menos de 3 semanas', kova: true, mercado: false },
  { criterio: 'Diseño del proceso comercial documentado', kova: true, mercado: false },
  { criterio: 'Programa de inducción estructurado para el equipo', kova: true, mercado: false },
  { criterio: 'Playbook de ventas listo para replicar', kova: true, mercado: false },
  { criterio: 'Garantía de reemplazo sin costo adicional', kova: true, mercado: false },
  { criterio: 'Métricas y KPIs definidos por rol', kova: true, mercado: false },
  { criterio: 'Un solo proveedor para todo el ciclo comercial', kova: true, mercado: false },
];

export default function KovaVsMercado() {
  return (
    <section className="py-24 px-6 lg:px-8" style={{ background: '#FAFBFF' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#6366F1', letterSpacing: '0.15em' }}>Por qué Kova</p>
          <h2 className="font-heading font-black leading-tight mb-4" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', color: '#0F0A2A', letterSpacing: '-0.02em' }}>
            No somos otra firma de reclutamiento.
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: '#6B7280', lineHeight: 1.8 }}>
            La mayoría de firmas publican, esperan y entregan CVs. Kova diseña el sistema comercial completo.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #E5E7EB', boxShadow: '0 4px 24px rgba(99,102,241,0.06)' }}>
          <div className="grid grid-cols-[1fr_140px_140px]" style={{ background: '#FAFBFF', borderBottom: '1px solid #E5E7EB' }}>
            <div className="px-6 py-4" />
            <div className="px-5 py-4 text-center" style={{ borderLeft: '1px solid #E5E7EB' }}>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Tradicional</span>
            </div>
            <div className="px-5 py-4 text-center" style={{ background: '#EEF2FF', borderLeft: '1px solid #C7D2FE' }}>
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: '#6366F1' }}>Kova</span>
            </div>
          </div>

          {filas.map((fila, i) => (
            <div key={i} className="grid grid-cols-[1fr_140px_140px]"
              style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFBFF', borderBottom: i < filas.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              <div className="px-6 py-3.5">
                <span className="text-sm" style={{ color: '#374151' }}>{fila.criterio}</span>
              </div>
              <div className="px-5 py-3.5 flex items-center justify-center" style={{ borderLeft: '1px solid #F3F4F6' }}>
                <XCircle className="w-4 h-4" style={{ color: '#D1D5DB' }} />
              </div>
              <div className="px-5 py-3.5 flex items-center justify-center" style={{ background: i % 2 === 0 ? '#EEF2FF' : '#E0E7FF', borderLeft: '1px solid #C7D2FE' }}>
                <CheckCircle2 className="w-5 h-5" style={{ color: '#6366F1' }} />
              </div>
            </div>
          ))}

          <div className="grid grid-cols-[1fr_140px_140px]" style={{ borderTop: '1px solid #E5E7EB' }}>
            <div className="px-6 py-5" />
            <div className="px-5 py-5 flex items-center justify-center" style={{ borderLeft: '1px solid #E5E7EB' }}>
              <span className="text-xs text-gray-400">Parcial</span>
            </div>
            <div className="px-5 py-5 flex items-center justify-center" style={{ background: '#EEF2FF', borderLeft: '1px solid #C7D2FE' }}>
              <button onClick={() => document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center gap-1 text-xs font-bold transition-all" style={{ color: '#6366F1' }}>
                Empezar <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}