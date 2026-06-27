import React from 'react';

const stats = [
  { value: '+200', label: 'perfiles colocados', sub: 'en los últimos 3 años', color: '#6366F1', bg: '#EEF2FF' },
  { value: '94%', label: 'retención al año 1', sub: 'vs. 54% del promedio del mercado', color: '#10B981', bg: '#ECFDF5' },
  { value: '6–18×', label: 'costo de mala contratación', sub: 'en salarios perdidos por rotación', color: '#F59E0B', bg: '#FFFBEB' },
  { value: '< 3 sem', label: 'tiempo de entrega', sub: 'desde briefing hasta terna validada', color: '#0EA5E9', bg: '#F0F9FF' },
];

const sectores = ['Sector Financiero', 'Tecnología B2B', 'Retail Especializado', 'Servicios Profesionales', 'Manufactura'];

export default function SocialProof() {
  return (
    <section className="py-24 px-6 lg:px-8" style={{ background: '#FAFBFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#10B981', letterSpacing: '0.15em' }}>Resultados reales</p>
            <h2 className="font-heading font-black leading-tight" style={{ fontSize: 'clamp(1.35rem, 1.8vw, 1.75rem)', color: '#0F0A2A', letterSpacing: '-0.02em' }}>
              Números que respaldan<br />nuestro trabajo.
            </h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.85 }}>
            Kova no promete resultados — los entrega. Cada número viene de procesos reales que acompañamos de principio a fin.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map(({ value, label, sub, color, bg }) => (
            <div key={value} className="p-6 rounded-2xl" style={{ background: bg, border: `1px solid ${color}1A` }}>
              <p className="font-heading font-black leading-none mb-2" style={{ fontSize: '1.75rem', color, letterSpacing: '-0.04em' }}>{value}</p>
              <p className="text-sm font-semibold mb-1 leading-snug" style={{ color: '#0F0A2A' }}>{label}</p>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl px-7 py-5" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4 text-center" style={{ color: '#9CA3AF' }}>Sectores en los que trabajamos</p>
          <div className="flex flex-wrap justify-center gap-2">
            {sectores.map(s => (
              <span key={s} className="px-4 py-1.5 rounded-full text-xs font-semibold" style={{ background: '#F3F4F6', color: '#374151' }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}