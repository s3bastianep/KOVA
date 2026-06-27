import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import HeroDemoMockup from '@/components/landing/HeroDemoMockup';

const proofPoints = [
  'Metodología especializada en ventas B2B',
  'Informe comparativo para tu equipo directivo',
  'Diagnóstico inicial sin compromiso',
];

export default function Hero() {
  const scrollToAcceso = () => document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToProceso = () => document.getElementById('proceso')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative overflow-hidden" style={{ background: '#FAFBFF' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[min(720px,90vw)] h-[min(720px,90vw)] rounded-full opacity-70"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 68%)', transform: 'translate(15%, -20%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[min(480px,70vw)] h-[min(480px,70vw)] rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(15,23,42,0.03) 0%, transparent 68%)', transform: 'translate(-20%, 20%)' }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-20 lg:pt-36 lg:pb-28 w-full">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-20 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-[11px] font-semibold tracking-wide"
              style={{ background: '#FFFFFF', color: '#4338CA', border: '1px solid #E0E7FF', boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#6366F1' }} />
              Selección comercial para empresas B2B
            </div>

            <h1
              className="font-heading font-bold mb-6"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.1rem)', letterSpacing: '-0.035em', lineHeight: 1.06, color: '#0F172A' }}
            >
              Más precisión para contratar{' '}
              <span style={{ color: '#4338CA' }}>talento comercial.</span>
            </h1>

            <p className="text-base lg:text-lg mb-8 max-w-[520px]" style={{ color: '#64748B', lineHeight: 1.75 }}>
              Una excelente contratación comercial empieza por entender la vacante y luego identificar quiénes sí tienen las competencias necesarias para desempeñarla.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-10">
              <button
                onClick={scrollToAcceso}
                className="group inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all text-white hover:opacity-95"
                style={{ background: '#4338CA', boxShadow: '0 4px 14px rgba(67,56,202,0.28)' }}
              >
                Agendar diagnóstico comercial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={scrollToProceso}
                className="inline-flex items-center gap-2 font-medium px-6 py-3.5 rounded-xl text-sm transition-all hover:bg-slate-50"
                style={{ background: '#FFFFFF', color: '#334155', border: '1px solid #CBD5E1' }}
              >
                Ver cómo funciona
              </button>
            </div>

            <ul className="space-y-2.5">
              {proofPoints.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#6366F1' }} strokeWidth={2} />
                  <span className="text-sm font-medium" style={{ color: '#475569' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 lg:mt-0">
            <HeroDemoMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
