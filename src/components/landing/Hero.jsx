import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, Users, Clock } from 'lucide-react';
import HeroDemoMockup from './HeroDemoMockup';

const metrics = [
  { val: '+200', label: 'perfiles colocados', icon: Users, color: '#6366F1' },
  { val: '< 3 sem', label: 'tiempo de entrega', icon: Clock, color: '#0EA5E9' },
  { val: '94%', label: 'retención al año', icon: TrendingUp, color: '#10B981' },
];

export default function Hero() {
  const scrollToAcceso = () => document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToServicios = () => document.getElementById('producto')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ background: '#FAFBFF' }}>
      {/* Gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '35%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 65%)' }} />
        {/* Grid dots */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#1e1b4b" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 lg:gap-20 items-center">

          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-7 text-xs font-bold" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366F1', border: '1px solid rgba(99,102,241,0.18)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              La nueva forma de construir tu equipo comercial
            </div>

            <h1 className="font-heading font-black mb-5" style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: 1.08, color: '#0F0A2A' }}>
              Reclutamos, evaluamos<br />y entrenamos a tu<br />
              <span style={{ background: 'linear-gradient(90deg, #6366F1, #0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                fuerza de ventas.
              </span>
            </h1>

            <p className="text-sm mb-3 max-w-[440px]" style={{ color: '#374151', lineHeight: 1.85, fontWeight: 500 }}>
              Kova es la firma que busca al vendedor correcto, lo evalúa con pruebas reales, diseña el proceso de ventas de tu empresa y lo convierte en un programa de capacitación gamificado — para que cualquier asesor aprenda rápido y venda bien.
            </p>
            <p className="text-sm mb-8 max-w-[440px]" style={{ color: '#6B7280', lineHeight: 1.8 }}>
              No mandamos CVs. No damos talleres genéricos. Construimos el sistema que hace que tu área comercial funcione — y lo dejamos corriendo dentro de tu empresa.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-12">
              <button onClick={scrollToAcceso}
                className="group inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all text-white"
                style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 4px 24px rgba(99,102,241,0.35)' }}>
                Agendar diagnóstico gratuito
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={scrollToServicios}
                className="inline-flex items-center gap-2 font-medium px-6 py-3.5 rounded-xl text-sm transition-all"
                style={{ background: '#FFFFFF', color: '#374151', border: '1.5px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                ¿Qué hacemos exactamente?
              </button>
            </div>

            <div className="pt-8" style={{ borderTop: '1px solid #E5E7EB' }}>
              <div className="flex flex-wrap gap-5 mb-5">
                {metrics.map(({ val, label, icon: Icon, color }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}12` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div>
                      <p className="font-heading font-black text-base leading-none" style={{ color: '#0F0A2A', letterSpacing: '-0.02em' }}>{val}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{label}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {['Reclutamiento con criterio', 'Capacitación gamificada', 'Proceso propio de tu empresa'].map(item => (
                  <span key={item} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: '#F3F4F6', color: '#6B7280' }}>
                    <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: '#10B981' }} />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <HeroDemoMockup />
          </div>
        </div>
      </div>
    </section>
  );
}