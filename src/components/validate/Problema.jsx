import React from 'react';
import SectionHeader from '@/components/landing/SectionHeader';

const cards = [
  {
    num: '01',
    title: 'Entrevistan bien, pero no siempre venden bien',
    desc: 'Un buen discurso en la entrevista no garantiza desempeño comercial real ni resultados en el pipeline.',
  },
  {
    num: '02',
    title: 'Contratar mal cuesta tiempo y oportunidades',
    desc: 'Una mala decisión puede significar meses perdidos, rotación elevada y cuota comercial estancada.',
  },
  {
    num: '03',
    title: 'Cada vacante requiere competencias distintas',
    desc: 'Un hunter no necesita lo mismo que un account manager ni un SDR. El criterio debe adaptarse al rol.',
  },
];

export default function Problema() {
  return (
    <section id="problema" className="py-24 lg:py-28 px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="El problema"
          title="El currículum se queda corto para saber si es la persona correcta."
          description="Tener experiencia o pasar una buena entrevista no siempre demuestra que alguien tendrá el desempeño comercial que la vacante exige."
        />

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {cards.map(({ num, title, desc }) => (
            <article
              key={num}
              className="kova-card kova-card-hover rounded-2xl p-7 lg:p-8 relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ background: 'linear-gradient(90deg, #6366F1, #4338CA)' }}
              />
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-xs font-bold mb-5 text-white"
                style={{ background: '#4338CA' }}
              >
                {num}
              </span>
              <h3 className="font-heading font-semibold text-base mb-3 leading-snug" style={{ color: '#0F172A' }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#64748B', lineHeight: 1.75 }}>
                {desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
