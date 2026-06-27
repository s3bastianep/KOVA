import { useState } from 'react';
import { Users } from 'lucide-react';

const tabs = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'comparativo', label: 'Comparativo' },
  { id: 'recomendacion', label: 'Recomendación' },
];

const MATCH = 92;

const competencias = [
  { label: 'Venta consultiva', value: 92 },
  { label: 'Prospección', value: 88 },
  { label: 'Manejo de objeciones', value: 90 },
  { label: 'Orientación al logro', value: 94 },
];

const candidatos = [
  { id: 'A', name: 'María López', score: 92, tag: 'Recomendada', highlight: true },
  { id: 'B', name: 'Candidato B', score: 67, tag: null, highlight: false },
  { id: 'C', name: 'Candidato C', score: 51, tag: null, highlight: false },
];

const BAR = '#6366F1';

export default function EntregableReportMockup() {
  const [tab, setTab] = useState('resumen');

  return (
    <div className="relative w-full">
      <div
        className="relative rounded-2xl overflow-hidden bg-white"
        style={{
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 16px 40px rgba(15,23,42,0.05)',
        }}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="w-2 h-2 rounded-full bg-slate-300" />
          </div>
          <div className="flex-1 mx-2">
            <div className="h-5 rounded-md flex items-center px-3 mx-auto max-w-xs" style={{ background: '#FFF', border: '1px solid #E2E8F0' }}>
              <span className="text-[10px] font-medium truncate w-full text-center" style={{ color: '#94A3B8' }}>
                Informe de selección · Ejecutivo Comercial
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-b flex items-center justify-between gap-3" style={{ borderColor: '#F1F5F9' }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>Informe comparativo</p>
            <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>3 candidatos evaluados</p>
          </div>
          <span className="text-[10px] font-medium px-2 py-1 rounded-md" style={{ background: '#F8FAFC', color: '#64748B' }}>
            Terna lista
          </span>
        </div>

        <div className="flex border-b px-5 gap-1" style={{ borderColor: '#F1F5F9' }}>
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className="text-[11px] font-medium px-3 py-2 -mb-px transition-colors"
              style={{
                color: tab === id ? '#4338CA' : '#94A3B8',
                borderBottom: tab === id ? '2px solid #6366F1' : '2px solid transparent',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'resumen' && (
            <>
              <div className="flex items-end justify-between mb-5 pb-5 border-b" style={{ borderColor: '#F1F5F9' }}>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>María López</p>
                  <p className="text-xs mb-2" style={{ color: '#64748B' }}>Mejor coincidencia con el puesto</p>
                  <p className="font-heading font-bold text-3xl leading-none tabular-nums" style={{ color: '#4338CA' }}>
                    {MATCH}%
                  </p>
                </div>
                <p className="text-[10px] tabular-nums" style={{ color: '#94A3B8' }}>+24 vs. promedio</p>
              </div>

              <div className="space-y-2.5 mb-5">
                {competencias.map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-medium" style={{ color: '#475569' }}>{label}</span>
                      <span className="tabular-nums" style={{ color: '#64748B' }}>{value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${value}%`, background: BAR, opacity: 0.35 + (value / 100) * 0.65 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg px-3.5 py-3" style={{ background: '#F8FAFC', border: '1px solid #E8ECF1' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#64748B' }}>
                  Conclusión del evaluador
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#334155', lineHeight: 1.65 }}>
                  Alta coincidencia con las competencias del rol. Recomendada para la terna final.
                </p>
              </div>
            </>
          )}

          {tab === 'comparativo' && (
            <>
              <p className="text-xs mb-4 flex items-center gap-1.5" style={{ color: '#64748B' }}>
                <Users className="w-3.5 h-3.5" />
                Ranking por coincidencia con el puesto
              </p>
              <div className="space-y-1.5">
                {candidatos.map(({ id, name, score, tag, highlight }) => (
                  <div
                    key={id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                    style={{
                      background: highlight ? '#F8FAFC' : 'transparent',
                      border: `1px solid ${highlight ? '#E2E8F0' : 'transparent'}`,
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                        style={{ background: highlight ? '#EEF2FF' : '#F1F5F9', color: highlight ? '#4338CA' : '#94A3B8' }}
                      >
                        {id}
                      </span>
                      <div>
                        <span className="text-xs font-medium block" style={{ color: '#334155' }}>{name}</span>
                        {tag && <span className="text-[10px]" style={{ color: '#64748B' }}>{tag}</span>}
                      </div>
                    </div>
                    <span className="text-sm font-semibold tabular-nums" style={{ color: highlight ? '#4338CA' : '#94A3B8' }}>
                      {score}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'recomendacion' && (
            <div className="space-y-4">
              <p className="text-xs font-medium" style={{ color: '#64748B' }}>Terna recomendada</p>
              <ol className="space-y-2">
                {[
                  'María López · prioridad alta (92%)',
                  'Candidato B · alternativa viable (67%)',
                  'Candidato C · no recomendado (51%)',
                ].map((line, i) => (
                  <li
                    key={line}
                    className="text-sm pl-3 border-l-2"
                    style={{
                      color: i === 0 ? '#0F172A' : '#64748B',
                      borderColor: i === 0 ? '#6366F1' : '#E2E8F0',
                      fontWeight: i === 0 ? 600 : 400,
                    }}
                  >
                    {line}
                  </li>
                ))}
              </ol>
              <p className="text-xs leading-relaxed pt-2 border-t" style={{ color: '#64748B', borderColor: '#F1F5F9', lineHeight: 1.65 }}>
                Informe listo para compartir con dirección comercial y talento humano.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
