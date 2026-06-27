import { useState } from 'react';
import { TrendingUp, Users, Target, ShieldCheck, Briefcase } from 'lucide-react';

const tabs = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'competencias', label: 'Competencias' },
  { id: 'ranking', label: 'Ranking' },
];

const MATCH_PERCENT = 92;

const kpis = [
  { label: 'Candidatos', value: '3', icon: Users },
  { label: 'Competencias', value: '5', icon: Target },
  { label: 'Coincidencia', value: `${MATCH_PERCENT}%`, icon: TrendingUp },
];

const competenciasResumen = [
  { label: 'Venta consultiva', value: 92 },
  { label: 'Prospección', value: 90 },
  { label: 'Manejo de objeciones', value: 88 },
  { label: 'Orientación al logro', value: 95 },
];

const candidatos = [
  { name: 'María López', score: '92', highlight: true, tag: 'Recomendada' },
  { name: 'Candidato B', score: '67', highlight: false, tag: null },
  { name: 'Candidato C', score: '51', highlight: false, tag: null },
];

const CANDIDATE_PHOTO =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face';

const barFill = (value) =>
  `linear-gradient(90deg, rgba(99,102,241,${0.45 + (value / 100) * 0.55}) 0%, #6366F1 100%)`;

export default function HeroDemoMockup() {
  const [tab, setTab] = useState('resumen');

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none lg:mx-0">
      <div
        className="absolute -inset-3 rounded-3xl pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div
        className="relative rounded-2xl overflow-hidden bg-white"
        style={{
          border: '1px solid #E8ECF1',
          boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 20px 48px rgba(15,23,42,0.06)',
        }}
      >
        <div className="px-5 py-4 border-b flex items-start justify-between gap-3" style={{ borderColor: '#F1F5F9' }}>
          <div className="flex gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#F5F3FF', border: '1px solid #E0E7FF' }}
            >
              <Briefcase className="w-4 h-4" style={{ color: '#6366F1' }} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider mb-0.5" style={{ color: '#94A3B8' }}>
                Vacante evaluada
              </p>
              <p className="text-[15px] font-semibold truncate" style={{ color: '#0F172A' }}>Ejecutivo Comercial</p>
            </div>
          </div>
          <span
            className="text-[10px] font-medium px-2 py-1 rounded-md whitespace-nowrap flex items-center gap-1 flex-shrink-0"
            style={{ background: '#F0FDF4', color: '#15803D' }}
          >
            <ShieldCheck className="w-3 h-3" strokeWidth={2} />
            Listo para decidir
          </span>
        </div>

        <div className="grid grid-cols-3 divide-x" style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFBFC' }}>
          {kpis.map(({ label, value, icon: Icon }) => (
            <div key={label} className="px-3 py-3.5 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon className="w-3 h-3" style={{ color: '#94A3B8' }} strokeWidth={2} />
                <p className="font-heading font-bold text-base tabular-nums leading-none" style={{ color: '#4338CA' }}>{value}</p>
              </div>
              <p className="text-[9px] font-medium leading-tight" style={{ color: '#94A3B8' }}>{label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-0.5 px-5 pt-3 border-b" style={{ borderColor: '#F1F5F9' }}>
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className="text-[11px] font-medium px-3 py-2 rounded-t-md transition-colors"
              style={{
                color: tab === id ? '#4338CA' : '#94A3B8',
                background: tab === id ? '#FFFFFF' : 'transparent',
                borderBottom: tab === id ? '2px solid #6366F1' : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'resumen' && (
            <>
              <div className="flex gap-4 mb-5">
                <img
                  src={CANDIDATE_PHOTO}
                  alt="María López"
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  style={{ border: '2px solid #E0E7FF' }}
                />
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold truncate" style={{ color: '#0F172A' }}>María López</p>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md flex-shrink-0 tabular-nums"
                      style={{ background: '#F8FAFC', color: '#64748B' }}
                    >
                      +24 vs. promedio
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="font-heading font-bold text-2xl tabular-nums leading-none" style={{ color: '#4338CA' }}>
                      {MATCH_PERCENT}%
                    </span>
                    <span className="text-xs font-medium" style={{ color: '#64748B' }}>coincidencia con el puesto</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: '#F1F5F9' }}>
                    <div className="h-full rounded-full" style={{ width: `${MATCH_PERCENT}%`, background: '#6366F1' }} />
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 mb-5">
                {competenciasResumen.map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-medium truncate pr-2" style={{ color: '#475569' }}>{label}</span>
                      <span className="font-semibold tabular-nums flex-shrink-0" style={{ color: '#4338CA' }}>{value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                      <div className="h-full rounded-full" style={{ width: `${value}%`, background: barFill(value) }} />
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="rounded-lg px-3.5 py-3"
                style={{ background: '#F8FAFC', border: '1px solid #E8ECF1' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#64748B' }}>
                  Conclusión del evaluador
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#334155', lineHeight: 1.65 }}>
                  Alta coincidencia con las competencias del rol. Recomendada para la terna final.
                </p>
              </div>
            </>
          )}

          {tab === 'competencias' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: '#F1F5F9' }}>
                <p className="text-xs font-medium" style={{ color: '#64748B' }}>María López · 4 competencias</p>
                <p className="font-heading font-bold text-xl tabular-nums" style={{ color: '#4338CA' }}>{MATCH_PERCENT}%</p>
              </div>
              {competenciasResumen.map(({ label, value }) => (
                <div key={label} className="py-1">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium" style={{ color: '#334155' }}>{label}</span>
                    <span className="font-semibold tabular-nums" style={{ color: '#4338CA' }}>{value}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                    <div className="h-full rounded-full" style={{ width: `${value}%`, background: '#6366F1' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'ranking' && (
            <div className="space-y-2">
              {candidatos.map(({ name, score, highlight, tag }) => (
                <div
                  key={name}
                  className="flex items-center justify-between px-3.5 py-3 rounded-lg"
                  style={{
                    background: highlight ? '#FAFBFF' : 'transparent',
                    border: `1px solid ${highlight ? '#E0E7FF' : '#F1F5F9'}`,
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {highlight ? (
                      <img src={CANDIDATE_PHOTO} alt={name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                        style={{ background: '#F1F5F9', color: '#94A3B8' }}
                      >
                        {name.slice(-1)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <span className="text-xs font-semibold block truncate" style={{ color: '#334155' }}>{name}</span>
                      {tag && <span className="text-[10px]" style={{ color: '#6366F1' }}>{tag}</span>}
                    </div>
                  </div>
                  <span className="text-sm font-bold tabular-nums flex-shrink-0 ml-2" style={{ color: highlight ? '#4338CA' : '#94A3B8' }}>
                    {score}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
