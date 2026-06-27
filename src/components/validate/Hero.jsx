import React from 'react';
import { ArrowRight } from 'lucide-react';
import HeroDemoMockup from '@/components/landing/HeroDemoMockup';

export default function Hero() {
  const scrollToAcceso = () => document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToProceso = () => document.getElementById('proceso')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ background: '#FAFBFF' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 65%)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-14 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-7 text-xs font-bold" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366F1', border: '1px solid rgba(99,102,241,0.18)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              Especialistas en selección comercial
            </div>

            <h1 className="font-heading font-black mb-5" style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: 1.08, color: '#0F0A2A' }}>
              Más precisión para contratar{' '}
              <span style={{ background: 'linear-gradient(90deg, #6366F1, #0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                talento comercial.
              </span>
            </h1>

            <p className="text-sm mb-8 max-w-[460px]" style={{ color: '#6B7280', lineHeight: 1.85 }}>
              Una excelente contratación comercial empieza por entender la vacante y luego identificar quiénes sí tienen las competencias necesarias para desempeñarla.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={scrollToAcceso}
                className="group inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all text-white"
                style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 4px 24px rgba(99,102,241,0.35)' }}>
                Solicitar acceso anticipado
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={scrollToProceso}
                className="inline-flex items-center gap-2 font-medium px-6 py-3.5 rounded-xl text-sm transition-all"
                style={{ background: '#FFFFFF', color: '#374151', border: '1.5px solid #E5E7EB' }}>
                Ver cómo funciona
              </button>
            </div>
          </div>

          <div className="mt-10 lg:mt-0">
            <HeroDemoMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
