import React from 'react';
import SectionHeader from '@/components/landing/SectionHeader';

const pasos = [
  {
    title: 'Entendemos la vacante',
    desc: 'Contexto comercial, perfil de cliente y expectativas de desempeño del rol.',
  },
  {
    title: 'Definimos competencias clave',
    desc: 'Criterios claros y medibles, alineados a lo que la vacante realmente exige.',
  },
  {
    title: 'Evaluamos habilidades demostradas',
    desc: 'Análisis estructurado de capacidades comerciales, no solo entrevistas convencionales.',
  },
  {
    title: 'Presentamos el talento ideal comparado',
    desc: 'Terna argumentada con sustento para que elijas al perfil comercial correcto con confianza.',
  },
];

export default function ComoFunciona() {
  return (
    <section id="proceso" className="relative py-24 lg:py-28 px-6 lg:px-8 overflow-hidden" style={{ background: '#0F172A' }}>
      <div className="absolute inset-0 kova-grid-bg opacity-80 pointer-events-none" />
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <SectionHeader
            align="left"
            dark
            className="mb-0 lg:mb-2"
            eyebrow="Cómo funciona"
            title="Atraer talento comercial no debería ser a ciegas."
            description="Diseñamos el proceso alrededor de lo que cada vacante realmente necesita: perfil ideal, competencias, contexto comercial y criterios de éxito claros."
          />

          <div className="space-y-3 lg:pt-2">
            {pasos.map((paso, i) => (
              <div
                key={paso.title}
                className="flex gap-4 p-5 rounded-xl transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span
                  className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs text-white"
                  style={{ background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(165,180,252,0.2)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{paso.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                    {paso.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
