import React from 'react';

const competencias = [
  { label: 'Venta consultiva', width: '88%' },
  { label: 'Prospección', width: '72%' },
  { label: 'Manejo de objeciones', width: '81%' },
];

const candidatos = [
  { name: 'Candidato A', score: '92/100', highlight: true },
  { name: 'Candidato B', score: '67/100', highlight: false },
  { name: 'Candidato C', score: '51/100', highlight: false },
];

export default function HeroDemoMockup() {
  return (
    <div
      className="rounded-2xl overflow-hidden w-full max-w-lg mx-auto lg:max-w-none lg:mx-0"
      style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 24px 64px rgba(99,102,241,0.12), 0 8px 24px rgba(0,0,0,0.06)' }}
    >
      <div className="px-5 py-4 border-b border-slate-100" style={{ background: '#FAFBFF' }}>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#9CA3AF' }}>Vacante</p>
        <p className="text-sm font-bold" style={{ color: '#0F0A2A' }}>Ejecutivo Comercial B2B</p>
        <span className="inline-block mt-2 text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: '#EEF2FF', color: '#6366F1' }}>
          Evaluación especializada
        </span>
      </div>

      <div className="p-5 space-y-4">
        {competencias.map((c) => (
          <div key={c.label}>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-medium" style={{ color: '#374151' }}>{c.label}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: c.width, background: 'linear-gradient(90deg, #6366F1, #4F46E5)' }} />
            </div>
          </div>
        ))}

        <div className="pt-3 space-y-2 border-t border-slate-100">
          {candidatos.map(({ name, score, highlight }) => (
            <div
              key={name}
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{
                background: highlight ? '#EEF2FF' : '#F9FAFB',
                border: `1px solid ${highlight ? '#C7D2FE' : '#E5E7EB'}`,
              }}
            >
              <span className="text-xs font-semibold" style={{ color: '#374151' }}>{name}</span>
              <span className="text-sm font-black" style={{ color: highlight ? '#6366F1' : '#9CA3AF' }}>{score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
