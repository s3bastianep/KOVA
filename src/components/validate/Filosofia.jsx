import React from 'react';

const items = [
  { title: 'El currículum sigue siendo útil', desc: 'Te dice dónde ha estado alguien. No te dice cómo venderá en tu contexto.', color: '#6366F1', bg: '#EEF2FF' },
  { title: 'La entrevista sigue siendo útil', desc: 'Revela comunicación y actitud. No siempre revela desempeño bajo presión real.', color: '#0EA5E9', bg: '#F0F9FF' },
  { title: 'La experiencia sigue siendo útil', desc: 'Aporta contexto. Pero vender en otra empresa no es lo mismo que vender en la tuya.', color: '#10B981', bg: '#ECFDF5' },
  { title: 'La intuición sigue siendo útil', desc: 'Los mejores líderes la tienen. Pero no escala ni se documenta para el equipo.', color: '#F59E0B', bg: '#FFFBEB' },
];

export default function Filosofia() {
  return (
    <section id="filosofia" className="py-24 px-6 lg:px-8" style={{ background: '#FAFBFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#10B981', letterSpacing: '0.15em' }}>Nuestra filosofía</p>
            <h2 className="font-heading font-black leading-tight" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', color: '#0F0A2A', letterSpacing: '-0.02em' }}>
              Cada vacante comercial es distinta. La selección también debería serlo.
            </h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.85 }}>
            No atacamos el currículum ni la entrevista. Simplemente creemos que, por sí solos, no bastan para tomar una excelente decisión de contratación comercial.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {items.map(({ title, desc, color, bg }) => (
            <div key={title} className="p-6 rounded-2xl" style={{ background: bg, border: `1px solid ${color}18` }}>
              <h3 className="font-heading font-bold text-sm mb-2" style={{ color: '#0F0A2A' }}>{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.75 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="p-6 lg:p-8 rounded-2xl bg-white" style={{ border: '1px solid #E5E7EB', boxShadow: '0 4px 24px rgba(99,102,241,0.06)' }}>
          <p className="text-sm leading-relaxed" style={{ color: '#374151', lineHeight: 1.85 }}>
            <span className="font-heading font-bold" style={{ color: '#0F0A2A' }}>Un vendedor hunter no necesita lo mismo que un account manager.</span>{' '}
            Por eso diseñamos cada proceso de selección alrededor de las necesidades reales de la vacante, no de una plantilla genérica de recursos humanos.
          </p>
        </div>
      </div>
    </section>
  );
}
