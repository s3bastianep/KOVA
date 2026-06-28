import { BarChart3, ChevronDown, LayoutGrid, Users } from 'lucide-react';
import {
  RANKING,
  TOP_CANDIDATE,
  TOP_MATCH,
  VACANCY_STATS,
  competencyList,
} from '@/data/mockEvaluation';

const CANDIDATE_PHOTO =
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&fit=crop&crop=face&q=80';

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

  if (active) {
    return (
      <img
        src={CANDIDATE_PHOTO}
        alt={name}
        className={`${cls.split(' ').slice(0, 2).join(' ')} rounded-lg object-cover flex-shrink-0`}
        style={{ border: '1.5px solid #C5D4F0' }}
      />
    );
  }
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  return (
    <div
      className={`${cls} rounded-lg flex items-center justify-center font-bold flex-shrink-0`}
      style={{ background: '#F8F9FB', color: '#1A3FAA' }}
    >
      {initials}
    </div>
  );
}

export default function KovaDashboardMockup({ compact = false, hero = false }) {
  const isCompact = compact && !hero;
  const pad = hero ? 'px-4' : isCompact ? 'px-3' : 'px-4';
  const avatarSize = hero ? 'lg' : isCompact ? 'sm' : 'md';

  return (
    <div className="rounded-xl overflow-hidden w-full text-left" style={{ background: '#FFFFFF' }}>
      <div
        className={`flex items-center justify-between gap-2 ${pad} ${hero ? 'py-3' : isCompact ? 'py-1.5' : 'py-2.5'} border-b`}
        style={{ background: '#F8F9FB', borderColor: '#E2E8F0' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`${hero ? 'w-6 h-6' : 'w-5 h-5'} rounded-md flex items-center justify-center flex-shrink-0`}
            style={{ background: '#1A3FAA' }}
          >
            <span className={`${hero ? 'text-[10px]' : 'text-[9px]'} font-bold text-white`}>K</span>
          </div>
          <span className={`${hero ? 'text-sm' : 'text-[11px]'} font-semibold truncate`} style={{ color: '#0F1F3D' }}>
            Kova
          </span>
          {(hero || !isCompact) && (
            <span className={`hidden sm:inline ${hero ? 'text-xs' : 'text-[10px]'} truncate`} style={{ color: '#94A3B8' }}>
              · Ejecutivo Comercial
            </span>
          )}
        </div>
        {!isCompact && !hero && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {['7d', '30d', '90d'].map((p, i) => (
              <span
                key={p}
                className="text-[8px] font-semibold px-1.5 py-0.5 rounded-md"
                style={{
                  background: i === 1 ? '#1A3FAA' : 'transparent',
                  color: i === 1 ? '#FFFFFF' : '#94A3B8',
                }}
              >
                {p}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={`${pad} ${hero ? 'pt-4 pb-4' : isCompact ? 'pt-2.5 pb-2' : 'pt-4 pb-3'}`}>
        <p
          className={`${hero ? 'text-[11px]' : 'text-[9px]'} font-semibold uppercase tracking-wider mb-1`}
          style={{ color: '#2D5BE3' }}
        >
          Informe de selección
        </p>
        <h3
          className={`font-bold mb-3 ${hero ? 'text-base' : isCompact ? 'text-xs' : 'text-sm'}`}
          style={{ color: '#0F1F3D' }}
        >
          Vacante · Ejecutivo Comercial
        </h3>

        <div className={`grid grid-cols-3 gap-2 ${hero ? 'mb-4' : isCompact ? 'mb-2.5' : 'mb-4'}`}>
          {KPI.map(({ label, value }) => (
            <div
              key={label}
              className={`rounded-lg ${hero ? 'px-3 py-2.5' : isCompact ? 'px-2 py-1.5' : 'px-2.5 py-2'}`}
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
            >
              <p
                className={`font-bold tabular-nums leading-none mb-1 ${hero ? 'text-xl' : isCompact ? 'text-sm' : 'text-base'}`}
                style={{ color: '#1A3FAA' }}
              >
                {value}
              </p>
              <p className={`${hero ? 'text-[11px]' : 'text-[9px]'} leading-tight`} style={{ color: '#3D3D3D' }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`rounded-lg overflow-hidden ${hero ? 'mb-4' : isCompact ? 'mb-2' : 'mb-3'}`}
          style={{ border: '1px solid #E2E8F0' }}
        >
          <div
            className={`flex items-center justify-between ${hero ? 'px-3 py-2.5' : isCompact ? 'px-2.5 py-1.5' : 'px-3 py-2'}`}
            style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}
          >
            <div className="flex items-center gap-2">
              <Users className={`${hero ? 'w-3.5 h-3.5' : 'w-3 h-3'}`} style={{ color: '#2D5BE3' }} />
              <span className={`${hero ? 'text-xs' : 'text-[9px]'} font-semibold`} style={{ color: '#0F1F3D' }}>
                Ranking de terna
              </span>
            </div>
            <ChevronDown className={`${hero ? 'w-3.5 h-3.5' : 'w-3 h-3'}`} style={{ color: '#94A3B8' }} />
          </div>
          <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
            {RANKING.map((c, i) => (
              <div
                key={c.name}
                className={`flex items-center gap-2.5 ${hero ? 'px-3 py-2.5' : isCompact ? 'px-2.5 py-1.5' : 'px-3 py-2'}`}
                style={{ background: c.recommended ? '#E6FAF3' : 'transparent' }}
              >
                <span
                  className={`${hero ? 'text-xs' : 'text-[9px]'} font-bold w-4 tabular-nums`}
                  style={{ color: '#94A3B8' }}
                >
                  {i + 1}
                </span>
                <CandidateAvatar name={c.name} active={c.recommended} size={avatarSize} />
                <div className="flex-1 min-w-0">
                  <p className={`${hero ? 'text-sm' : 'text-[10px]'} font-semibold truncate`} style={{ color: '#0F1F3D' }}>
                    {c.name}
                  </p>
                  {(hero || !isCompact) && (
                    <p className={`${hero ? 'text-xs' : 'text-[9px]'} truncate`} style={{ color: '#94A3B8' }}>
                      {c.role}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className={`${hero ? 'w-14' : isCompact ? 'w-10' : 'w-12'} h-1.5 rounded-full overflow-hidden`}
                    style={{ background: '#E2E8F0' }}
                  >
                    <div className="h-full rounded-full" style={{ width: `${c.match}%`, background: '#2D5BE3' }} />
                  </div>
                  <span
                    className={`${hero ? 'text-sm' : 'text-[11px]'} font-bold tabular-nums`}
                    style={{ color: '#1A3FAA' }}
                  >
                    {c.match}
                  </span>
                  {c.recommended && (
                    <span
                      className={`${hero ? 'text-[9px] px-1.5 py-0.5' : 'text-[7px] px-1 py-0.5'} font-semibold rounded`}
                      style={{ background: '#E6FAF3', color: '#00B27A' }}
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
          className="rounded-lg overflow-hidden"
          style={{ background: '#EEF2FA', border: '1px solid #C5D4F0' }}
        >
          <div
            className={`flex items-center gap-2.5 ${hero ? 'px-3 py-3' : isCompact ? 'px-2.5 py-2' : 'px-3 py-2.5'} border-b`}
            style={{ borderColor: '#C5D4F0', background: '#EEF2FA' }}
          >
            <img
              src={CANDIDATE_PHOTO}
              alt={TOP_CANDIDATE.name}
              className={`${hero ? 'w-10 h-10' : isCompact ? 'w-7 h-7' : 'w-8 h-8'} rounded-lg object-cover`}
              style={{ border: '2px solid #2D5BE3' }}
            />
            <div className="flex-1 min-w-0">
              <p
                className={`${hero ? 'text-[10px]' : 'text-[8px]'} font-semibold uppercase tracking-wide`}
                style={{ color: '#0F1F3D' }}
              >
                Evaluación comercial
              </p>
              <p className={`${hero ? 'text-sm' : 'text-[10px]'} font-semibold truncate`} style={{ color: '#0F1F3D' }}>
                {TOP_CANDIDATE.name} · Recomendada
              </p>
            </div>
            <span className={`font-bold tabular-nums ${hero ? 'text-2xl' : isCompact ? 'text-base' : 'text-lg'}`} style={{ color: '#0F1F3D' }}>
              {TOP_MATCH}
              <span className={`${hero ? 'text-sm' : 'text-[10px]'} font-semibold`} style={{ color: '#2D5BE3' }}>
                %
              </span>
            </span>
          </div>
          <div
            className={`${hero ? 'px-3 py-3 gap-x-3 gap-y-2.5' : isCompact ? 'px-2.5 py-2 gap-x-2 gap-y-1.5' : 'px-3 py-2.5 gap-x-3 gap-y-2'} grid grid-cols-2`}
          >
            {topCompetencies.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between mb-1">
                  <span
                    className={`${hero ? 'text-[11px]' : 'text-[8px]'} truncate pr-1`}
                    style={{ color: '#3D3D3D' }}
                  >
                    {c.label}
                  </span>
                  <span
                    className={`${hero ? 'text-[11px]' : 'text-[8px]'} font-bold tabular-nums`}
                    style={{ color: '#0F1F3D' }}
                  >
                    {c.value}
                  </span>
                </div>
                <div
                  className={`relative ${hero ? 'h-1.5' : 'h-1'} rounded-full overflow-hidden`}
                  style={{ background: '#C5D4F0' }}
                >
                  <div
                    className="absolute top-0 bottom-0 w-px left-1/2 -translate-x-1/2"
                    style={{ background: 'rgba(26,63,170,0.2)' }}
                  />
                  <div className="h-full rounded-full" style={{ width: `${c.value}%`, background: '#1A3FAA' }} />
                </div>
              </div>
            ))}
          </div>
          {!isCompact && !hero && (
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ background: '#EEF2FA', borderTop: '1px solid #C5D4F0' }}
            >
              <BarChart3 className="w-3 h-3 flex-shrink-0" style={{ color: '#0F1F3D' }} />
              <p className="text-[8px] leading-relaxed" style={{ color: '#3D3D3D' }}>
                Mismo criterio para todos. La línea central marca el umbral del rol.
              </p>
            </div>
          )}
        </div>
      </div>

      {!isCompact && !hero && (
        <div
          className="flex items-center gap-4 px-4 py-2 border-t"
          style={{ background: '#F8F9FB', borderColor: '#E2E8F0' }}
        >
          <LayoutGrid className="w-3 h-3" style={{ color: '#1A3FAA' }} />
          <span className="text-[9px] font-medium" style={{ color: '#3D3D3D' }}>Informe comparativo · Exportar PDF</span>
        </div>
      )}
    </div>
  );
}
