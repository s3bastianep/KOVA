import React from 'react';

const competencias = [
  { label: 'Venta consultiva', width: '88%', color: '#4F46E5' },
  { label: 'Prospección', width: '72%', color: '#10B981' },
  { label: 'Manejo de objeciones', width: '81%', color: '#F59E0B' },
];

const candidatos = [
  { name: 'Candidato A', score: '92', highlight: true, tag: 'Recomendado' },
  { name: 'Candidato B', score: '67', highlight: false, tag: null },
  { name: 'Candidato C', score: '51', highlight: false, tag: null },
];

export default function HeroDemoMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none lg:mx-0">
      <div
        className="absolute -inset-4 rounded-3xl kova-dot-grid opacity-60 pointer-events-none"
        aria-hidden
      />

      <div className="relative kova-card rounded-2xl overflow-hidden">
        <div
          className="flex items-center gap-2 px-4 py-3 border-b"
          style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}
        >
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
          <div className="flex-1 mx-3">
            <div className="h-6 rounded-md flex items-center px-3" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <span className="text-[10px] font-medium truncate" style={{ color: '#94A3B8' }}>app.kova.com.co · Informe comparativo</span>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>Vacante evaluada</p>
              <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>Ejecutivo Comercial B2B</p>
            </div>
            <span
              className="text-[10px] font-semibold px-2.5 py-1 rounded-md whitespace-nowrap"
              style={{ background: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE' }}
            >
              Metodología Kova
            </span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Competencias requeridas</p>
          {competencias.map((c) => (
            <div key={c.label}>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: '#334155' }}>{c.label}</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: c.width, backgroundColor: c.color }} />
              </div>
            </div>
          ))}

          <div className="pt-4 space-y-2 border-t" style={{ borderColor: '#F1F5F9' }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>Ranking de candidatos</p>
            {candidatos.map(({ name, score, highlight, tag }) => (
              <div
                key={name}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{
                  background: highlight ? '#F8FAFF' : '#FAFBFC',
                  border: `1px solid ${highlight ? '#C7D2FE' : '#E2E8F0'}`,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                    style={{
                      background: highlight ? '#6366F1' : '#F1F5F9',
                      color: highlight ? '#FFFFFF' : '#64748B',
                    }}
                  >
                    {name.slice(-1)}
                  </span>
                  <div>
                    <span className="text-xs font-semibold block" style={{ color: '#334155' }}>{name}</span>
                    {tag && (
                      <span className="text-[10px] font-medium" style={{ color: '#059669' }}>{tag}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold tabular-nums" style={{ color: highlight ? '#4338CA' : '#94A3B8' }}>{score}</span>
                  <span className="text-[10px] font-medium ml-0.5" style={{ color: '#94A3B8' }}>/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
