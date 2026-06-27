import React from 'react';
import { CheckCircle2, FileText } from 'lucide-react';
import SectionHeader from '@/components/landing/SectionHeader';

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
    <section id="entregable" className="py-24 lg:py-28 px-6 lg:px-8" style={{ background: '#F8FAFC' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div>
            <SectionHeader
              align="left"
              className="mb-8 lg:mb-10"
              eyebrow="Qué recibes"
              title="No recibes solo hojas de vida. Recibes una recomendación de selección."
              description="Un entregable diseñado para que dirección comercial y talento humano decidan con el mismo criterio."
            />

            <ul className="space-y-4">
              {beneficios.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: '#EEF2FF' }}
                  >
                    <CheckCircle2 className="w-3 h-3" style={{ color: '#4338CA' }} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm lg:text-base" style={{ color: '#334155', lineHeight: 1.65 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="kova-card rounded-2xl overflow-hidden">
            <div
              className="px-6 py-4 border-b flex items-center justify-between gap-3"
              style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}
                >
                  <FileText className="w-4 h-4" style={{ color: '#4338CA' }} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                    Reporte de ajuste comercial
                  </p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: '#0F172A' }}>
                    Candidato A · Ejecutivo Comercial B2B
                  </p>
                </div>
              </div>
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-md whitespace-nowrap"
                style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' }}
              >
                Recomendado
              </span>
            </div>

            <div className="p-6 lg:p-7 bg-white">
              <div className="flex items-end justify-between mb-7 pb-6 border-b" style={{ borderColor: '#F1F5F9' }}>
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: '#94A3B8' }}>Puntaje de evaluación</p>
                  <p className="font-heading font-bold text-4xl leading-none tabular-nums" style={{ color: '#4338CA' }}>
                    92<span className="text-lg font-semibold text-slate-400">/100</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>Metodología</p>
                  <p className="text-xs font-semibold" style={{ color: '#334155' }}>Kova · Competencias comerciales</p>
                </div>
              </div>

              <div className="space-y-4 mb-7">
                {competencias.map((c) => (
                  <div key={c.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium" style={{ color: '#475569' }}>{c.label}</span>
                      <span className="font-semibold tabular-nums" style={{ color: '#0F172A' }}>{c.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${c.value}%`, background: 'linear-gradient(90deg, #6366F1, #4338CA)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-4 space-y-2.5" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                {[
                  'Perfil alineado con el estilo consultivo requerido',
                  'Recomendado para incluir en la terna final',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm" style={{ color: '#334155' }}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#059669' }} strokeWidth={2} />
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
