import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const beneficios = [
  'Evaluación por competencias específicas de la vacante',
  'Comparación clara entre candidatos evaluados',
  'Recomendación sustentada para facilitar la decisión',
  'Informe pensado para comercial, talento humano y dirección',
];

const competencias = [
  { label: 'Venta consultiva', value: 92 },
  { label: 'Prospección', value: 88 },
  { label: 'Manejo de objeciones', value: 90 },
  { label: 'Orientación al logro', value: 94 },
];

export default function Entregable() {
  return (
    <section id="entregable" className="py-24 px-6 lg:px-8" style={{ background: '#FAFBFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#6366F1', letterSpacing: '0.15em' }}>Qué recibes</p>
            <h2 className="font-heading font-black leading-tight mb-5" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', color: '#0F0A2A', letterSpacing: '-0.02em' }}>
              No recibes solo hojas de vida. Recibes una recomendación de selección.
            </h2>
            <ul className="space-y-3">
              {beneficios.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#6366F1' }} />
                  <span className="text-sm" style={{ color: '#374151' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #E5E7EB', boxShadow: '0 24px 64px rgba(99,102,241,0.10)' }}>
            <div className="px-6 py-4 border-b border-slate-100" style={{ background: '#FAFBFF' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Reporte de ajuste comercial</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: '#0F0A2A' }}>Candidato A · Ejecutivo Comercial B2B</p>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>Puntaje de evaluación</p>
                  <p className="font-heading font-black text-4xl leading-none mt-1" style={{ color: '#6366F1' }}>92<span className="text-lg text-slate-400">/100</span></p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg" style={{ background: '#ECFDF5', color: '#059669' }}>Recomendado</span>
              </div>
              <div className="space-y-3 mb-6">
                {competencias.map((c) => (
                  <div key={c.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: '#374151' }}>{c.label}</span>
                      <span className="font-bold" style={{ color: '#0F0A2A' }}>{c.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100">
                      <div className="h-full rounded-full" style={{ width: `${c.value}%`, background: 'linear-gradient(90deg, #6366F1, #4F46E5)' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  'Perfil alineado con el estilo consultivo requerido',
                  'Recomendado para incluir en la terna final',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs" style={{ color: '#374151' }}>
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#10B981' }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
