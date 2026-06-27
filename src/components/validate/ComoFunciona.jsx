import React from 'react';
import SectionHeader from '@/components/landing/SectionHeader';
import ComoFuncionaProceso from '@/components/validate/ComoFuncionaProceso';

const pasos = [
  {
    title: 'Definimos el perfil de la vacante',
    desc: 'Entendemos tu contexto comercial y traducimos la vacante en competencias concretas y medibles.',
  },
  {
    title: 'Evaluamos candidatos con el mismo criterio',
    desc: 'Medimos habilidades comerciales reales y comparamos perfiles con la misma escala para todos.',
  },
  {
    title: 'Te entregamos una terna para decidir',
    desc: 'Recibes candidatos rankeados con coincidencia por puesto, para elegir con datos y no con corazonada.',
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
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          <div>
            <SectionHeader
              align="left"
              dark
              className="mb-8 lg:mb-10"
              eyebrow="Cómo funciona"
              title="Sabrás qué cumple cada candidato antes de contratar."
              description="Adaptamos el criterio a tu vacante, evaluamos talento comercial por competencias y te entregamos una terna comparada para que decidas con claridad."
            />

            <div className="space-y-4">
              {pasos.map((paso, i) => (
                <div key={paso.title} className="flex gap-4">
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs text-white mt-0.5"
                    style={{ background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(165,180,252,0.25)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">{paso.title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>
                      {paso.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ComoFuncionaProceso />
        </div>
      </div>
    </section>
  );
}
