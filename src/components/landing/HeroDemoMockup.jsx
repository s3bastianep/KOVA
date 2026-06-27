import { useState } from 'react';
import { TrendingUp, Users, Target, ShieldCheck, Briefcase, Star, CheckCircle2 } from 'lucide-react';

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
  { label: 'Venta consultiva', value: 92, color: '#4F46E5' },
  { label: 'Prospección', value: 90, color: '#059669' },
  { label: 'Manejo de objeciones', value: 88, color: '#D97706' },
  { label: 'Orientación al logro', value: 95, color: '#0284C7' },
];

const candidatos = [
  { name: 'María López', score: '92', highlight: true, tag: 'Recomendada' },
  { name: 'Candidato B', score: '67', highlight: false, tag: null },
  { name: 'Candidato C', score: '51', highlight: false, tag: null },
];

const CANDIDATE_PHOTO =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face';

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
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#6366F1' }}>
                Candidato destacado
              </p>

              <div
                className="rounded-xl p-4 mb-5"
                style={{ background: '#FAFBFF', border: '1px solid #E0E7FF' }}
              >
                <div className="flex gap-4">
                  <div className="relative flex-shrink-0">
                    <div
                      className="rounded-full p-0.5"
                      style={{ background: 'linear-gradient(135deg, #C7D2FE 0%, #A5B4FC 100%)' }}
                    >
                      <img
                        src={CANDIDATE_PHOTO}
                        alt="María López"
                        className="w-[4.5rem] h-[4.5rem] rounded-full object-cover block"
                        style={{ border: '2px solid #FFFFFF' }}
                      />
                    </div>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                      style={{ background: '#6366F1', border: '2px solid #FFFFFF' }}
                    >
                      <Star className="w-2.5 h-2.5 text-white fill-white" strokeWidth={0} />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold leading-snug" style={{ color: '#0F172A' }}>
                        Candidata María López
                      </p>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
                        style={{ background: '#EEF2FF', color: '#4338CA' }}
                      >
                        <TrendingUp className="w-3 h-3" />
                        +24 vs. promedio
                      </span>
                    </div>

                    <p className="font-heading font-bold text-[1.75rem] leading-none tabular-nums mb-1" style={{ color: '#4338CA' }}>
                      {MATCH_PERCENT}%
                      <span className="text-sm font-semibold ml-1" style={{ color: '#6366F1' }}>de coincidencia</span>
                    </p>
                    <p className="text-[11px] font-medium mb-2.5 leading-snug" style={{ color: '#475569' }}>
                      Cumple el {MATCH_PERCENT}% de las habilidades necesarias para el puesto
                    </p>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#EEF2FF' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${MATCH_PERCENT}%`, background: 'linear-gradient(90deg, #818CF8, #6366F1)' }}
                      />
                    </div>
                    <p className="text-[10px] mt-2" style={{ color: '#94A3B8' }}>
                      5 competencias evaluadas contra el perfil de la vacante
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                {competenciasResumen.map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-medium truncate pr-2" style={{ color: '#334155' }}>{label}</span>
                      <span className="font-bold tabular-nums flex-shrink-0" style={{ color }}>{value}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                      <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="rounded-xl px-4 py-3.5 flex gap-3"
                style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#059669' }} strokeWidth={2.25} />
                <div>
                  <p className="text-[11px] font-semibold mb-1" style={{ color: '#047857' }}>
                    Conclusión del evaluador
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: '#166534', lineHeight: 1.65 }}>
                    Perfil con alta coincidencia ({MATCH_PERCENT}%) con las competencias del rol. Recomendada para la terna final.
                  </p>
                </div>
              </div>
            </>
          )}

          {tab === 'competencias' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: '#F1F5F9' }}>
                <p className="text-xs font-medium" style={{ color: '#64748B' }}>María López · 4 competencias</p>
                <p className="font-heading font-bold text-xl tabular-nums" style={{ color: '#4338CA' }}>{MATCH_PERCENT}%</p>
              </div>
              {competenciasResumen.map(({ label, value, color }) => (
                <div key={label} className="py-1">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium" style={{ color: '#334155' }}>{label}</span>
                    <span className="font-semibold tabular-nums" style={{ color }}>{value}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                    <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
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
