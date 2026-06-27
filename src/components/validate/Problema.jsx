import React from 'react';

const cards = [
  {
    num: '01',
    title: 'Entrevistan bien, pero no siempre venden bien',
    desc: 'Un buen discurso en la entrevista no garantiza desempeño comercial real.',
    color: '#6366F1',
    bg: '#EEF2FF',
  },
  {
    num: '02',
    title: 'Contratar mal cuesta tiempo y oportunidades',
    desc: 'Una mala decisión puede significar meses perdidos y pipeline estancado.',
    color: '#0EA5E9',
    bg: '#F0F9FF',
  },
  {
    num: '03',
    title: 'Cada vacante requiere competencias distintas',
    desc: 'Un hunter no necesita lo mismo que un account manager ni un SDR.',
    color: '#10B981',
    bg: '#ECFDF5',
  },
];

export default function Problema() {
  return (
    <section id="problema" className="py-24 px-6 lg:px-8" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#6366F1', letterSpacing: '0.15em' }}>El problema</p>
          <h2 className="font-heading font-black leading-tight mb-4" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', color: '#0F0A2A', letterSpacing: '-0.02em' }}>
            El currículum se queda corto para saber si es la persona correcta.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.85 }}>
            Tener experiencia o pasar una buena entrevista no siempre demuestra que alguien tendrá el desempeño comercial que la vacante exige.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {cards.map(({ num, title, desc, color, bg }) => (
            <div key={num} className="p-6 rounded-2xl" style={{ background: bg, border: `1px solid ${color}18` }}>
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black mb-4 text-white" style={{ background: color }}>{num}</span>
              <h3 className="font-heading font-bold text-sm mb-2 leading-snug" style={{ color: '#0F0A2A' }}>{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.75 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
