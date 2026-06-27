import { useState } from 'react';
import { TrendingUp, Users, Target, ShieldCheck } from 'lucide-react';

const tabs = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'competencias', label: 'Competencias' },
  { id: 'ranking', label: 'Ranking' },
];

const MATCH_PERCENT = 92;

const kpis = [
  { label: 'Candidatos evaluados', value: '3', icon: Users },
  { label: 'Competencias definidas', value: '5', icon: Target },
  { label: 'Coincidencia con el puesto', value: `${MATCH_PERCENT}%`, icon: TrendingUp },
];

const competencias = [
  { label: 'Venta consultiva', value: 92, color: '#4F46E5', bg: '#EEF2FF' },
  { label: 'Prospección', value: 88, color: '#059669', bg: '#ECFDF5' },
  { label: 'Manejo de objeciones', value: 90, color: '#D97706', bg: '#FFFBEB' },
  { label: 'Orientación al logro', value: 94, color: '#0284C7', bg: '#F0F9FF' },
];

const promedioCompetencias = Math.round(
  competencias.reduce((sum, c) => sum + c.value, 0) / competencias.length
);

const candidatos = [
  { name: 'Candidato A', score: '92', highlight: true, tag: 'Recomendado' },
  { name: 'Candidato B', score: '67', highlight: false, tag: null },
  { name: 'Candidato C', score: '51', highlight: false, tag: null },
];

export default function HeroDemoMockup() {
  const [tab, setTab] = useState('resumen');

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none lg:mx-0">
      <div
        className="absolute -inset-4 rounded-3xl kova-dot-grid opacity-60 pointer-events-none"
        aria-hidden
      />

      <div
        className="relative rounded-2xl overflow-hidden bg-white"
        style={{
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 6px rgba(15,23,42,0.04), 0 24px 64px rgba(99,102,241,0.12)',
        }}
      >
        <div
          className="flex items-center gap-2 px-4 py-3 border-b"
          style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}
        >
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
          <div className="flex-1 mx-2">
            <div className="h-6 rounded-md flex items-center px-3" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <span className="text-[10px] font-medium truncate w-full text-center" style={{ color: '#94A3B8' }}>
                app.kova.com.co · Informe comparativo
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-b flex items-start justify-between gap-3" style={{ borderColor: '#F1F5F9' }}>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>
              Vacante evaluada
            </p>
            <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>Ejecutivo Comercial</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#64748B' }}>Perfil definido según tu proceso comercial</p>
          </div>
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-md whitespace-nowrap flex items-center gap-1"
            style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' }}
          >
            <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
            Listo para decidir
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 px-5 py-4 border-b" style={{ borderColor: '#F1F5F9', background: '#FAFBFC' }}>
          {kpis.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-lg px-2.5 py-2.5 text-center"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: '#94A3B8' }} strokeWidth={2} />
              <p className="font-heading font-bold text-lg leading-none tabular-nums" style={{ color: '#4338CA' }}>{value}</p>
              <p className="text-[9px] font-medium mt-1 leading-tight" style={{ color: '#64748B' }}>{label}</p>
            </div>
          ))}
        </div>

        <div className="flex border-b px-5 gap-1" style={{ borderColor: '#F1F5F9' }}>
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className="text-[11px] font-semibold px-3 py-2.5 -mb-px transition-colors"
              style={{
                color: tab === id ? '#4338CA' : '#64748B',
                borderBottom: tab === id ? '2px solid #4338CA' : '2px solid transparent',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'resumen' && (
            <>
              <div className="mb-4 pb-4 border-b" style={{ borderColor: '#F1F5F9' }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-[10px] font-medium mb-1" style={{ color: '#94A3B8' }}>Candidato destacado</p>
                    <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>Candidato A</p>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold flex-shrink-0" style={{ background: '#EEF2FF', color: '#4338CA' }}>
                    <TrendingUp className="w-3 h-3" />
                    +24 vs. promedio
                  </div>
                </div>
                <p className="font-heading font-bold text-3xl leading-none tabular-nums mb-2" style={{ color: '#4338CA' }}>
                  {MATCH_PERCENT}<span className="text-lg font-bold">%</span>
                </p>
                <p className="text-xs font-medium mb-2.5 leading-snug" style={{ color: '#334155' }}>
                  Cumple el {MATCH_PERCENT}% de las habilidades necesarias para el puesto
                </p>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#EEF2FF' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${MATCH_PERCENT}%`, background: 'linear-gradient(90deg, #6366F1 0%, #4338CA 100%)' }}
                  />
                </div>
                <p className="text-[10px] mt-1.5" style={{ color: '#64748B' }}>
                  5 competencias evaluadas contra el perfil de la vacante
                </p>
              </div>
              <div className="rounded-xl p-3.5" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <p className="text-[10px] font-semibold mb-1" style={{ color: '#047857' }}>Conclusión del evaluador</p>
                <p className="text-xs leading-relaxed" style={{ color: '#166534', lineHeight: 1.65 }}>
                  Perfil con alta coincidencia ({MATCH_PERCENT}%) con las competencias del rol. Recomendado para la terna final.
                </p>
              </div>
            </>
          )}

          {tab === 'competencias' && (
            <div className="space-y-4">
              <div
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#94A3B8' }}>
                    Promedio evaluado
                  </p>
                  <p className="text-xs font-medium" style={{ color: '#64748B' }}>Candidato A · 4 competencias</p>
                </div>
                <p className="font-heading font-bold text-2xl tabular-nums leading-none" style={{ color: '#4338CA' }}>
                  {promedioCompetencias}
                  <span className="text-xs font-semibold text-slate-400">/100</span>
                </p>
              </div>

              <div className="space-y-2.5">
                {competencias.map((c) => (
                  <div
                    key={c.label}
                    className="rounded-xl px-3.5 py-3"
                    style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: c.color }}
                        />
                        <span className="text-xs font-semibold truncate" style={{ color: '#334155' }}>{c.label}</span>
                      </div>
                      <span
                        className="text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-md flex-shrink-0"
                        style={{ background: c.bg, color: c.color }}
                      >
                        {c.value}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${c.value}%`, backgroundColor: c.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[10px] leading-relaxed px-0.5" style={{ color: '#94A3B8' }}>
                Mismas competencias y escala para todos los candidatos de la vacante.
              </p>
            </div>
          )}

          {tab === 'ranking' && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>
                Ranking de candidatos
              </p>
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
                  <div className="flex items-center gap-2.5">
                    <div className="hidden sm:block w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${score}%`, backgroundColor: highlight ? '#4338CA' : '#CBD5E1' }}
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold tabular-nums" style={{ color: highlight ? '#4338CA' : '#94A3B8' }}>{score}</span>
                      <span className="text-[10px] font-medium ml-0.5" style={{ color: '#94A3B8' }}>/100</span>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-[10px] leading-relaxed pt-2 px-0.5" style={{ color: '#94A3B8' }}>
                Mismo criterio para todos los candidatos evaluados en la vacante.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
