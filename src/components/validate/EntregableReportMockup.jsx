import { useState } from 'react';
import { CheckCircle2, TrendingUp, Users, ShieldCheck } from 'lucide-react';

const tabs = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'comparativo', label: 'Comparativo' },
  { id: 'recomendacion', label: 'Recomendación' },
];

const competencias = [
  { label: 'Venta consultiva', value: 92 },
  { label: 'Prospección', value: 88 },
  { label: 'Manejo de objeciones', value: 90 },
  { label: 'Orientación al logro', value: 94 },
];

const candidatos = [
  { id: 'A', name: 'Candidato A', score: 92, tag: 'Recomendado', highlight: true },
  { id: 'B', name: 'Candidato B', score: 67, tag: null, highlight: false },
  { id: 'C', name: 'Candidato C', score: 51, tag: null, highlight: false },
];

export default function EntregableReportMockup() {
  const [tab, setTab] = useState('resumen');

  return (
    <div className="relative w-full">
      <div
        className="absolute -inset-6 rounded-3xl kova-dot-grid opacity-50 pointer-events-none"
        aria-hidden
      />
      <div
        className="relative rounded-2xl overflow-hidden bg-white"
        style={{
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 6px rgba(15,23,42,0.04), 0 24px 64px rgba(99,102,241,0.12)',
        }}
      >
        {/* Chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
          <div className="flex-1 mx-2">
            <div className="h-6 rounded-md flex items-center px-3 mx-auto max-w-xs" style={{ background: '#FFF', border: '1px solid #E2E8F0' }}>
              <span className="text-[10px] font-medium truncate w-full text-center" style={{ color: '#94A3B8' }}>
                app.kova.com.co · Reporte de selección
              </span>
            </div>
          </div>
        </div>

        {/* Report header */}
        <div className="px-5 py-4 border-b flex items-start justify-between gap-3" style={{ borderColor: '#F1F5F9' }}>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>
              Vacante · Ejecutivo Comercial B2B
            </p>
            <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>
              Informe de ajuste comercial
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>3 candidatos evaluados · Metodología Kova</p>
          </div>
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-md whitespace-nowrap flex items-center gap-1"
            style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' }}
          >
            <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
            Listo para decidir
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-5 gap-1" style={{ borderColor: '#F1F5F9', background: '#FAFBFC' }}>
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className="text-xs font-semibold px-4 py-2.5 -mb-px transition-colors"
              style={{
                color: tab === id ? '#4338CA' : '#64748B',
                borderBottom: tab === id ? '2px solid #4338CA' : '2px solid transparent',
                background: tab === id ? '#FFFFFF' : 'transparent',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-5 lg:p-6">
          {tab === 'resumen' && (
            <>
              <div className="flex items-end justify-between mb-6 pb-5 border-b" style={{ borderColor: '#F1F5F9' }}>
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: '#94A3B8' }}>Candidato destacado</p>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#0F172A' }}>Candidato A</p>
                  <p className="font-heading font-bold text-4xl leading-none tabular-nums" style={{ color: '#4338CA' }}>
                    92<span className="text-lg font-semibold text-slate-400">/100</span>
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold" style={{ background: '#EEF2FF', color: '#4338CA' }}>
                    <TrendingUp className="w-3 h-3" />
                    +24 pts vs. promedio
                  </div>
                  <p className="text-[10px]" style={{ color: '#94A3B8' }}>vs. otros evaluados</p>
                </div>
              </div>
              <div className="space-y-3.5 mb-5">
                {competencias.map((c) => (
                  <div key={c.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium" style={{ color: '#475569' }}>{c.label}</span>
                      <span className="font-bold tabular-nums" style={{ color: '#0F172A' }}>{c.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${c.value}%`, background: 'linear-gradient(90deg, #6366F1, #4338CA)' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-4" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#047857' }}>Conclusión del evaluador</p>
                <p className="text-sm leading-relaxed" style={{ color: '#166534', lineHeight: 1.65 }}>
                  Perfil alineado con venta consultiva B2B. Recomendado para incluir en la terna final y avanzar a entrevista con dirección comercial.
                </p>
              </div>
            </>
          )}

          {tab === 'comparativo' && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-4 flex items-center gap-1.5" style={{ color: '#94A3B8' }}>
                <Users className="w-3.5 h-3.5" />
                Ranking de candidatos evaluados
              </p>
              <div className="space-y-2 mb-5">
                {candidatos.map(({ id, name, score, tag, highlight }) => (
                  <div
                    key={id}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl"
                    style={{
                      background: highlight ? '#F8FAFF' : '#FAFBFC',
                      border: `1px solid ${highlight ? '#C7D2FE' : '#E2E8F0'}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: highlight ? '#4338CA' : '#F1F5F9', color: highlight ? '#FFF' : '#64748B' }}
                      >
                        {id}
                      </span>
                      <div>
                        <span className="text-sm font-semibold block" style={{ color: '#0F172A' }}>{name}</span>
                        {tag && <span className="text-[10px] font-semibold" style={{ color: '#059669' }}>{tag}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:block w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${score}%`, background: highlight ? '#4338CA' : '#CBD5E1' }} />
                      </div>
                      <span className="text-lg font-bold tabular-nums" style={{ color: highlight ? '#4338CA' : '#94A3B8' }}>
                        {score}<span className="text-xs font-medium text-slate-400">/100</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs leading-relaxed px-1" style={{ color: '#64748B' }}>
                Comparación por competencias definidas para la vacante. Mismo criterio para todos los candidatos evaluados.
              </p>
            </>
          )}

          {tab === 'recomendacion' && (
            <>
              <div className="rounded-xl p-5 mb-4" style={{ background: '#F8FAFF', border: '1px solid #E0E7FF' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#6366F1' }}>
                  Terna recomendada
                </p>
                <div className="space-y-2">
                  {['Candidato A — Prioridad alta (92/100)', 'Candidato B — Alternativa viable (67/100)', 'Candidato C — No recomendado (51/100)'].map((line, i) => (
                    <div key={line} className="flex items-center gap-2.5 text-sm" style={{ color: i === 0 ? '#0F172A' : '#64748B', fontWeight: i === 0 ? 600 : 400 }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: i === 0 ? '#4338CA' : '#CBD5E1' }}>
                        {i + 1}
                      </span>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  'Informe listo para compartir con dirección comercial y talento humano',
                  'Sustento por competencia para respaldar la decisión de contratación',
                  'Reduce el riesgo de contratar por intuición o solo por entrevista',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm" style={{ color: '#334155' }}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#059669' }} strokeWidth={2} />
                    {item}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
