import { BarChart3, ChevronDown, LayoutGrid, Users } from 'lucide-react';
import { BRAND, KOVA } from '@/theme/kovaPalette';
import {
  RANKING,
  TOP_CANDIDATE,
  TOP_MATCH,
  VACANCY_STATS,
  competencyList,
} from '@/data/mockEvaluation';

const CANDIDATE_PHOTO =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face&auto=format&q=90';

const topCompetencies = competencyList(TOP_CANDIDATE.scores);

const KPI = [
  { label: 'Candidatos evaluados', value: String(VACANCY_STATS.evaluatedCount) },
  { label: 'En terna final', value: String(RANKING.length) },
  { label: 'Coincidencia top', value: `${TOP_MATCH}%` },
];

function CandidateAvatar({ name, active, size = 'md' }) {
  const sizes = {
    sm: 'w-7 h-7 text-[9px]',
    md: 'w-8 h-8 text-[9px]',
    lg: 'w-9 h-9 text-[10px]',
  };
  const cls = sizes[size] || sizes.md;
  const dim = cls.split(' ').slice(0, 2).join(' ');

  if (active) {
    return (
      <img
        src={CANDIDATE_PHOTO}
        alt={name}
        className={`${dim} rounded-full object-cover flex-shrink-0`}
        style={{ boxShadow: '0 0 0 1.5px rgba(26,63,170,0.12), 0 0 0 3px rgba(26,63,170,0.06)' }}
      />
    );
  }
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  return (
    <div
      className={`${cls} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}
      style={{ background: KOVA.surfaceAlt, color: KOVA.muted }}
    >
      {initials}
    </div>
  );
}

function MetricBar({ value, accent = false, className = '' }) {
  return (
    <div className={`h-1 rounded-full overflow-hidden ${className}`} style={{ background: KOVA.surfaceAlt }}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${value}%`,
          background: accent
            ? `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.blueMid})`
            : KOVA.borderSoft,
        }}
      />
    </div>
  );
}

export default function KovaDashboardMockup({ compact = false, hero = false }) {
  const isCompact = compact && !hero;
  const pad = hero ? 'px-5' : isCompact ? 'px-3' : 'px-4';
  const avatarSize = hero ? 'lg' : isCompact ? 'sm' : 'md';

  return (
    <div className="rounded-2xl overflow-hidden w-full text-left" style={{ background: KOVA.white }}>
      <div
        className={`flex items-center justify-between gap-3 ${pad} ${hero ? 'py-3.5' : isCompact ? 'py-1.5' : 'py-2.5'} border-b`}
        style={{ background: KOVA.surface, borderColor: KOVA.border }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {hero && (
            <div className="hidden sm:flex items-center gap-1.5 mr-1">
              {['#E2E6ED', '#E2E6ED', '#E2E6ED'].map((c, i) => (
                <span key={i} className="w-2 h-2 rounded-full" style={{ background: c }} />
              ))}
            </div>
          )}
          <div
            className={`${hero ? 'w-6 h-6' : 'w-5 h-5'} rounded-md flex items-center justify-center flex-shrink-0`}
            style={{ background: BRAND.navy }}
          >
            <span className={`${hero ? 'text-[9px]' : 'text-[8px]'} font-bold text-white tracking-tight`}>K</span>
          </div>
          <div className="min-w-0 leading-tight">
            <span className={`${hero ? 'text-[13px]' : 'text-[11px]'} font-semibold block truncate`} style={{ color: BRAND.navy }}>
              Kova
            </span>
            {(hero || !isCompact) && (
              <span className={`${hero ? 'text-[11px]' : 'text-[9px]'} truncate block`} style={{ color: KOVA.muted }}>
                Ejecutivo Comercial
              </span>
            )}
          </div>
        </div>
        {hero && (
          <span
            className="text-[10px] font-medium px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ background: KOVA.paleGreen, color: BRAND.greenDark }}
          >
            Informe listo
          </span>
        )}
        {!isCompact && !hero && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {['7d', '30d', '90d'].map((p, i) => (
              <span
                key={p}
                className="text-[8px] font-medium px-1.5 py-0.5 rounded-md"
                style={{
                  background: i === 1 ? BRAND.blue : 'transparent',
                  color: i === 1 ? KOVA.white : KOVA.muted,
                }}
              >
                {p}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={`${pad} ${hero ? 'pt-5 pb-5' : isCompact ? 'pt-2.5 pb-2' : 'pt-4 pb-3'}`}>
        <p
          className={`${hero ? 'text-[10px]' : 'text-[9px]'} font-medium uppercase mb-1.5`}
          style={{ color: KOVA.muted, letterSpacing: '0.14em' }}
        >
          Informe de selección
        </p>
        <h3
          className={`font-heading font-semibold mb-4 ${hero ? 'text-[15px]' : isCompact ? 'text-xs' : 'text-sm'}`}
          style={{ color: BRAND.navy, letterSpacing: '-0.02em' }}
        >
          Vacante · Ejecutivo Comercial
        </h3>

        <div className={`grid grid-cols-3 gap-2.5 ${hero ? 'mb-5' : isCompact ? 'mb-2.5' : 'mb-4'}`}>
          {KPI.map(({ label, value }) => (
            <div
              key={label}
              className={`rounded-xl ${hero ? 'px-3 py-3' : isCompact ? 'px-2 py-1.5' : 'px-2.5 py-2'}`}
              style={{ background: KOVA.surface }}
            >
              <p
                className={`font-heading font-semibold tabular-nums leading-none mb-1.5 ${hero ? 'text-lg' : isCompact ? 'text-sm' : 'text-base'}`}
                style={{ color: BRAND.navy }}
              >
                {value}
              </p>
              <p className={`${hero ? 'text-[10px]' : 'text-[9px]'} leading-snug`} style={{ color: KOVA.muted }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`rounded-xl overflow-hidden ${hero ? 'mb-5' : isCompact ? 'mb-2' : 'mb-3'}`}
          style={{ border: `1px solid ${KOVA.border}` }}
        >
          <div
            className={`flex items-center justify-between ${hero ? 'px-4 py-2.5' : isCompact ? 'px-2.5 py-1.5' : 'px-3 py-2'}`}
            style={{ borderBottom: `1px solid ${KOVA.border}` }}
          >
            <div className="flex items-center gap-2">
              <Users className={`${hero ? 'w-3.5 h-3.5' : 'w-3 h-3'}`} style={{ color: KOVA.muted }} strokeWidth={1.75} />
              <span className={`${hero ? 'text-xs' : 'text-[9px]'} font-medium`} style={{ color: BRAND.navy }}>
                Ranking de terna
              </span>
            </div>
            <ChevronDown className={`${hero ? 'w-3.5 h-3.5' : 'w-3 h-3'}`} style={{ color: '#CBD5E1' }} strokeWidth={1.75} />
          </div>
          <div>
            {RANKING.map((c, i) => (
              <div
                key={c.name}
                className={`relative flex items-center gap-3 ${hero ? 'px-4 py-3' : isCompact ? 'px-2.5 py-1.5' : 'px-3 py-2'}`}
                style={{
                  background: c.recommended ? 'rgba(248,249,251,0.9)' : KOVA.white,
                  borderTop: i > 0 ? `1px solid ${KOVA.border}` : 'none',
                  boxShadow: c.recommended ? 'inset 3px 0 0 0 #00B27A' : 'none',
                }}
              >
                <span
                  className={`${hero ? 'text-[11px]' : 'text-[9px]'} font-medium w-4 tabular-nums`}
                  style={{ color: '#CBD5E1' }}
                >
                  {i + 1}
                </span>
                <CandidateAvatar name={c.name} active={c.recommended} size={avatarSize} />
                <div className="flex-1 min-w-0">
                  <p className={`${hero ? 'text-[13px]' : 'text-[10px]'} font-medium truncate`} style={{ color: BRAND.navy }}>
                    {c.name}
                  </p>
                  {(hero || !isCompact) && (
                    <p className={`${hero ? 'text-[11px]' : 'text-[9px]'} truncate`} style={{ color: KOVA.muted }}>
                      {c.role}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0 min-w-[72px]">
                  <MetricBar value={c.match} accent={c.recommended} className={`flex-1 ${hero ? 'w-12' : 'w-10'}`} />
                  <span
                    className={`${hero ? 'text-[13px]' : 'text-[11px]'} font-semibold tabular-nums w-6 text-right`}
                    style={{ color: c.recommended ? BRAND.navy : KOVA.muted }}
                  >
                    {c.match}
                  </span>
                  {c.recommended && (
                    <span
                      className={`${hero ? 'text-[9px] px-2 py-0.5' : 'text-[7px] px-1 py-0.5'} font-medium rounded-full`}
                      style={{ background: KOVA.paleGreen, color: BRAND.greenDark }}
                    >
                      Top
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: KOVA.white,
            border: `1px solid ${KOVA.border}`,
            boxShadow: '0 1px 2px rgba(15,31,61,0.03)',
          }}
        >
          <div
            className={`flex items-center gap-3 ${hero ? 'px-4 py-3.5' : isCompact ? 'px-2.5 py-2' : 'px-3 py-2.5'}`}
            style={{ borderBottom: `1px solid ${KOVA.border}`, background: KOVA.surface }}
          >
            <img
              src={CANDIDATE_PHOTO}
              alt={TOP_CANDIDATE.name}
              className={`${hero ? 'w-10 h-10' : isCompact ? 'w-7 h-7' : 'w-8 h-8'} rounded-full object-cover flex-shrink-0`}
              style={{ boxShadow: '0 0 0 1.5px rgba(15,31,61,0.08)' }}
            />
            <div className="flex-1 min-w-0">
              <p
                className={`${hero ? 'text-[10px]' : 'text-[8px]'} font-medium uppercase`}
                style={{ color: KOVA.muted, letterSpacing: '0.12em' }}
              >
                Evaluación comercial
              </p>
              <p className={`${hero ? 'text-[13px]' : 'text-[10px]'} font-medium truncate`} style={{ color: BRAND.navy }}>
                {TOP_CANDIDATE.name}
                <span style={{ color: KOVA.muted }}> · Recomendada</span>
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className={`font-heading font-semibold tabular-nums ${hero ? 'text-xl' : isCompact ? 'text-base' : 'text-lg'}`} style={{ color: BRAND.navy }}>
                {TOP_MATCH}
              </span>
              <span className={`${hero ? 'text-xs' : 'text-[10px]'} font-medium ml-0.5`} style={{ color: KOVA.muted }}>
                %
              </span>
            </div>
          </div>
          <div
            className={`${hero ? 'px-4 py-4 gap-x-4 gap-y-3.5' : isCompact ? 'px-2.5 py-2 gap-x-2 gap-y-2' : 'px-3 py-3 gap-x-3 gap-y-2.5'} grid grid-cols-2`}
          >
            {topCompetencies.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between items-baseline mb-1.5 gap-2">
                  <span className={`${hero ? 'text-[11px]' : 'text-[8px]'} truncate font-medium`} style={{ color: KOVA.body }}>
                    {c.label}
                  </span>
                  <span className={`${hero ? 'text-[11px]' : 'text-[8px]'} font-semibold tabular-nums flex-shrink-0`} style={{ color: BRAND.navy }}>
                    {c.value}
                  </span>
                </div>
                <MetricBar value={c.value} accent className="w-full" />
              </div>
            ))}
          </div>
          {!isCompact && !hero && (
            <div
              className="flex items-center gap-2 px-3 py-2.5"
              style={{ background: KOVA.surface, borderTop: `1px solid ${KOVA.border}` }}
            >
              <BarChart3 className="w-3 h-3 flex-shrink-0" style={{ color: KOVA.muted }} strokeWidth={1.75} />
              <p className="text-[8px] leading-relaxed" style={{ color: KOVA.muted }}>
                Mismo criterio para todos. La línea central marca el umbral del rol.
              </p>
            </div>
          )}
        </div>
      </div>

      {!isCompact && !hero && (
        <div
          className="flex items-center gap-4 px-4 py-2 border-t"
          style={{ background: KOVA.surface, borderColor: KOVA.border }}
        >
          <LayoutGrid className="w-3 h-3" style={{ color: KOVA.muted }} strokeWidth={1.75} />
          <span className="text-[9px] font-medium" style={{ color: KOVA.muted }}>Informe comparativo · Exportar PDF</span>
        </div>
      )}
    </div>
  );
}
