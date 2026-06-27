import { useState } from 'react';
import {
  TrendingUp,
  Users,
  Target,
  ShieldCheck,
  Briefcase,
  Star,
  MessageSquare,
  Handshake,
  Calendar,
  User,
  Award,
} from 'lucide-react';

const tabs = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'competencias', label: 'Competencias' },
  { id: 'ranking', label: 'Ranking' },
];

const MATCH_PERCENT = 92;

const kpis = [
  { label: 'Candidatos evaluados', value: '3', icon: Users, iconBg: '#EEF2FF', iconColor: '#6366F1' },
  { label: 'Competencias definidas', value: '5', icon: Target, iconBg: '#F0F9FF', iconColor: '#0284C7' },
  { label: 'Coincidencia con el puesto', value: `${MATCH_PERCENT}%`, icon: TrendingUp, iconBg: '#ECFDF5', iconColor: '#059669' },
];

const competenciasResumen = [
  { label: 'Venta consultiva', value: 92, color: '#6366F1', bg: '#EEF2FF', icon: MessageSquare },
  { label: 'Prospección', value: 90, color: '#059669', bg: '#ECFDF5', icon: Target },
  { label: 'Manejo de objeciones', value: 88, color: '#D97706', bg: '#FFFBEB', icon: Users },
  { label: 'Orientación al logro', value: 95, color: '#0284C7', bg: '#F0F9FF', icon: TrendingUp },
  { label: 'Negociación', value: 90, color: '#7C3AED', bg: '#F5F3FF', icon: Handshake },
];

const promedioCompetencias = Math.round(
  competenciasResumen.reduce((sum, c) => sum + c.value, 0) / competenciasResumen.length
);

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
        className="absolute -inset-4 rounded-3xl kova-dot-grid opacity-60 pointer-events-none"
        aria-hidden
      />

      <div
        className="relative rounded-2xl overflow-hidden bg-white"
        style={{
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 6px rgba(15,23,42,0.04), 0 24px 64px rgba(99,102,241,0.14)',
        }}
      >
        {/* Header vacante */}
        <div className="px-5 py-4 border-b flex items-start justify-between gap-3" style={{ borderColor: '#F1F5F9' }}>
          <div className="flex gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#4338CA', boxShadow: '0 4px 12px rgba(67,56,202,0.25)' }}
            >
              <Briefcase className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#6366F1' }}>
                Vacante evaluada
              </p>
              <p className="text-base font-semibold truncate" style={{ color: '#0F172A' }}>Ejecutivo Comercial</p>
              <p className="text-[11px] mt-0.5 truncate" style={{ color: '#64748B' }}>
                Perfil definido según tu proceso comercial
              </p>
            </div>
          </div>
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1 flex-shrink-0"
            style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' }}
          >
            <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
            Listo para decidir
          </span>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-2.5 px-5 py-4 border-b" style={{ borderColor: '#F1F5F9', background: '#FAFBFC' }}>
          {kpis.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
            <div
              key={label}
              className="rounded-xl px-2 py-3 text-center"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                style={{ background: iconBg }}
              >
                <Icon className="w-4 h-4" style={{ color: iconColor }} strokeWidth={2} />
              </div>
              <p className="font-heading font-bold text-lg leading-none tabular-nums" style={{ color: '#4338CA' }}>{value}</p>
              <p className="text-[9px] font-medium mt-1.5 leading-tight px-0.5" style={{ color: '#64748B' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
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
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#6366F1' }}>
                Candidato destacado
              </p>

              <div
                className="rounded-xl p-4 mb-4"
                style={{ background: '#FAFBFF', border: '1px solid #E0E7FF' }}
              >
                <div className="flex gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={CANDIDATE_PHOTO}
                      alt="María López"
                      className="w-16 h-16 rounded-full object-cover"
                      style={{ border: '3px solid #6366F1' }}
                    />
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: '#4338CA', border: '2px solid #FFFFFF' }}
                    >
                      <Star className="w-2.5 h-2.5 text-white fill-white" strokeWidth={0} />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold truncate" style={{ color: '#0F172A' }}>
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
                    <p className="font-heading font-bold text-3xl leading-none tabular-nums mb-0.5" style={{ color: '#4338CA' }}>
                      {MATCH_PERCENT}<span className="text-sm font-semibold ml-0.5" style={{ color: '#6366F1' }}>% de coincidencia</span>
                    </p>
                    <p className="text-[11px] font-medium mb-2.5 leading-snug" style={{ color: '#475569' }}>
                      Cumple el {MATCH_PERCENT}% de las habilidades necesarias para el puesto
                    </p>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#EEF2FF' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${MATCH_PERCENT}%`, background: 'linear-gradient(90deg, #818CF8, #4338CA)' }}
                      />
                    </div>
                    <p className="text-[10px] mt-1.5" style={{ color: '#94A3B8' }}>
                      5 competencias evaluadas contra el perfil de la vacante
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini cards competencias */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 mb-4">
                {competenciasResumen.map(({ label, value, color, bg, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-lg px-1.5 py-2.5 text-center"
                    style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
                  >
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center mx-auto mb-1.5"
                      style={{ background: bg }}
                    >
                      <Icon className="w-3 h-3" style={{ color }} strokeWidth={2.25} />
                    </div>
                    <p className="text-[8px] font-medium leading-tight mb-1 line-clamp-2 min-h-[20px]" style={{ color: '#64748B' }}>
                      {label}
                    </p>
                    <p className="text-[11px] font-bold tabular-nums mb-1.5" style={{ color }}>{value}%</p>
                    <div className="h-1 rounded-full overflow-hidden mx-auto max-w-[40px]" style={{ background: '#F1F5F9' }}>
                      <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Conclusión */}
              <div
                className="relative rounded-xl px-4 py-3.5 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)', border: '1px solid #BBF7D0' }}
              >
                <div
                  className="absolute inset-0 opacity-[0.07] pointer-events-none"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, #059669 0, #059669 1px, transparent 0, transparent 50%)',
                    backgroundSize: '12px 12px',
                  }}
                  aria-hidden
                />
                <div className="relative flex gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#059669' }}
                  >
                    <Award className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold mb-1" style={{ color: '#047857' }}>Conclusión del evaluador</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#166534', lineHeight: 1.65 }}>
                      Perfil con alta coincidencia ({MATCH_PERCENT}%) con las competencias del rol. Recomendada para la terna final.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer meta */}
              <div
                className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 text-[10px]"
                style={{ borderTop: '1px solid #F1F5F9', color: '#94A3B8' }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" strokeWidth={2} />
                  Evaluado el 20 de mayo de 2024
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-3 h-3" strokeWidth={2} />
                  Evaluador: Ana Martínez
                </span>
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
                  <p className="text-xs font-medium" style={{ color: '#64748B' }}>María López · 5 competencias</p>
                </div>
                <p className="font-heading font-bold text-2xl tabular-nums leading-none" style={{ color: '#4338CA' }}>
                  {promedioCompetencias}
                  <span className="text-xs font-semibold text-slate-400">/100</span>
                </p>
              </div>

              <div className="space-y-2.5">
                {competenciasResumen.map((c) => {
                  const Icon = c.icon;
                  return (
                  <div
                    key={c.label}
                    className="rounded-xl px-3.5 py-3"
                    style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: c.bg }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: c.color }} strokeWidth={2} />
                        </span>
                        <span className="text-xs font-semibold truncate" style={{ color: '#334155' }}>{c.label}</span>
                      </div>
                      <span
                        className="text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-md flex-shrink-0"
                        style={{ background: c.bg, color: c.color }}
                      >
                        {c.value}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${c.value}%`, backgroundColor: c.color }}
                      />
                    </div>
                  </div>
                  );
                })}
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
                    {highlight ? (
                      <img
                        src={CANDIDATE_PHOTO}
                        alt={name}
                        className="w-8 h-8 rounded-full object-cover"
                        style={{ border: '2px solid #6366F1' }}
                      />
                    ) : (
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold"
                        style={{ background: '#F1F5F9', color: '#64748B' }}
                      >
                        {name.slice(-1)}
                      </span>
                    )}
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
                      <span className="text-[10px] font-medium ml-0.5" style={{ color: '#94A3B8' }}>%</span>
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
