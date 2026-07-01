import { BRAND, KOVA } from '@/theme/kovaPalette';
import { TOP_CANDIDATE, TOP_PROFILE } from '@/data/mockEvaluation';

const CANDIDATE_PHOTO =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face&auto=format&q=90';

const GRADIENT_ID = 'kovaHeroScoreGradient';

const PREDICTIVE_KPIS = [
  { key: 'kovaScore', label: 'Puntaje Kova' },
  { key: 'successProbability', label: 'Prob. de éxito', suffix: '%' },
  { key: 'culturalFit', label: 'Compat. cultural', suffix: '%' },
  { key: 'modelFit', label: 'Ajuste al modelo', suffix: '%' },
  { key: 'quotaPotential', label: 'Potencial de cuota', suffix: '%' },
  { key: 'retention12m', label: 'Retención 12 m', suffix: '%' },
];

const PROCESS_STATS = [
  { key: 'evaluatedCount', label: 'Evaluados' },
  { key: 'shortlistSize', label: 'En terna' },
  { key: 'percentile', label: 'Percentil', format: (v) => `${v}.º` },
  { key: 'riskLevel', label: 'Riesgo', accent: true },
];

function SectionLabel({ children }) {
  return (
    <p
      className="text-[9px] font-semibold uppercase mb-2.5 leading-none"
      style={{ color: '#94A3B8', letterSpacing: '0.12em' }}
    >
      {children}
    </p>
  );
}

function ScoreRing({ value, size = 76 }) {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="block -rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EEF2F6" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${GRADIENT_ID})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id={GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={BRAND.blue} />
            <stop offset="100%" stopColor={BRAND.green} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-heading font-bold tabular-nums leading-none"
          style={{ fontSize: '1.25rem', color: BRAND.navy, letterSpacing: '-0.04em' }}
        >
          {value}
        </span>
        <span
          className="text-[6.5px] font-medium uppercase mt-0.5"
          style={{ color: '#94A3B8', letterSpacing: '0.08em' }}
        >
          Afinidad
        </span>
      </div>
    </div>
  );
}

function KpiCell({ label, value, highlight }) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] leading-none mb-1 truncate" style={{ color: '#94A3B8' }}>
        {label}
      </p>
      <p
        className="font-heading font-semibold tabular-nums leading-none"
        style={{
          fontSize: '0.8125rem',
          color: highlight ? BRAND.greenDark : BRAND.navy,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </p>
    </div>
  );
}

function CompetencyBar({ label, value, maxInSet }) {
  const isTop = value === maxInSet;
  return (
    <div className="grid items-center gap-x-2.5" style={{ gridTemplateColumns: '1fr 2.5rem' }}>
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="text-[10px] leading-none truncate" style={{ color: KOVA.body }}>
            {label}
          </span>
          <span
            className="font-heading font-semibold tabular-nums text-[10px] leading-none flex-shrink-0"
            style={{ color: isTop ? BRAND.greenDark : BRAND.navy, letterSpacing: '-0.02em' }}
          >
            {value}%
          </span>
        </div>
        <div className="h-[3px] rounded-full overflow-hidden" style={{ background: '#EEF2F6' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${value}%`,
              background: isTop
                ? `linear-gradient(90deg, ${BRAND.green} 0%, ${BRAND.greenDark} 100%)`
                : `linear-gradient(90deg, ${BRAND.blue} 0%, ${BRAND.blueMid} 100%)`,
              opacity: isTop ? 1 : 0.55,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function HeroCandidateMockup({ dark = false }) {
  const profile = TOP_PROFILE;
  const maxCompetency = Math.max(...profile.competencies.map((c) => c.value));

  return (
    <div className="relative w-full min-w-0 py-1 sm:py-2 lg:py-4">
      <div
        className={`relative rounded-xl sm:rounded-2xl overflow-hidden w-full text-left bg-white ${dark ? 'kova-hero-mockup-glow-light' : ''}`}
        style={{
          border: '1px solid #E2E8F0',
          boxShadow: dark
            ? undefined
            : '0 1px 2px rgba(15, 31, 61, 0.04), 0 16px 40px rgba(15, 31, 61, 0.06)',
        }}
      >
        {/* Chrome */}
        <div
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 border-b"
          style={{ background: '#FAFBFC', borderColor: '#EEF2F6' }}
        >
          <div className="flex gap-1 flex-shrink-0">
            {['#E2E8F0', '#E2E8F0', '#E2E8F0'].map((c, i) => (
              <span key={i} className="w-[7px] h-[7px] rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div className="flex-1 min-w-0 mx-1">
            <div
              className="h-[22px] rounded-md flex items-center px-2.5 mx-auto max-w-[16rem]"
              style={{ background: KOVA.white, border: '1px solid #EEF2F6' }}
            >
              <span className="text-[9px] font-medium truncate w-full text-center" style={{ color: '#94A3B8' }}>
                Informe de evaluación · Ejecutivo Comercial
              </span>
            </div>
          </div>
          <span
            className="text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded flex-shrink-0"
            style={{ color: BRAND.greenDark, background: KOVA.paleGreen, letterSpacing: '0.06em' }}
          >
            En vivo
          </span>
        </div>

        {/* Encabezado candidato */}
        <div
          className="px-4 sm:px-5 py-3.5 border-b flex items-center gap-3"
          style={{ borderColor: '#F1F5F9' }}
        >
          <img
            src={CANDIDATE_PHOTO}
            alt={TOP_CANDIDATE.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            style={{ boxShadow: '0 0 0 1px rgba(226,232,240,0.8), 0 0 0 2.5px rgba(26,63,170,0.06)' }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-[13px] font-semibold leading-tight truncate" style={{ color: BRAND.navy }}>
                {TOP_CANDIDATE.name}
              </h3>
              <span
                className="text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded flex-shrink-0"
                style={{ color: BRAND.greenDark, background: KOVA.paleGreen, letterSpacing: '0.05em' }}
              >
                Recomendada
              </span>
            </div>
            <p className="text-[10px] truncate" style={{ color: '#94A3B8' }}>
              {TOP_CANDIDATE.role} · B2B consultivo
            </p>
          </div>
          <div className="text-right flex-shrink-0 sm:block hidden">
            <p className="text-[8px] uppercase mb-0.5" style={{ color: '#94A3B8', letterSpacing: '0.08em' }}>
              Ref.
            </p>
            <p className="text-[9px] font-medium tabular-nums" style={{ color: KOVA.muted }}>
              EV-0847
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-5 py-3.5 sm:py-4 space-y-4">
          {/* Análisis predictivo */}
          <section>
            <SectionLabel>Análisis predictivo</SectionLabel>
            <div
              className="rounded-lg p-3 sm:p-3.5"
              style={{ background: '#FAFBFC', border: '1px solid #F1F5F9' }}
            >
              <div className="flex gap-4 sm:gap-5">
                <ScoreRing value={profile.matchScore} />
                <div className="flex-1 min-w-0 grid grid-cols-2 gap-x-3 gap-y-2.5 content-center">
                  {PREDICTIVE_KPIS.map(({ key, label, suffix }, i) => (
                    <KpiCell
                      key={key}
                      label={label}
                      value={`${profile[key]}${suffix ?? ''}`}
                      highlight={i === 0}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Competencias + fortalezas */}
          <section>
            <SectionLabel>Competencias comerciales</SectionLabel>
            <div className="space-y-2.5 mb-3">
              {profile.competencies.map(({ label, value }) => (
                <CompetencyBar key={label} label={label} value={value} maxInSet={maxCompetency} />
              ))}
            </div>
            <div
              className="flex flex-wrap items-center gap-x-1.5 gap-y-1 pt-2.5 border-t"
              style={{ borderColor: '#F1F5F9' }}
            >
              <span
                className="text-[9px] font-semibold uppercase flex-shrink-0"
                style={{ color: '#94A3B8', letterSpacing: '0.1em' }}
              >
                Fortalezas
              </span>
              <span className="text-[9px]" style={{ color: '#CBD5E1' }}>
                ·
              </span>
              {profile.strengths.map((strength, i) => (
                <span key={strength} className="inline-flex items-center gap-1.5">
                  {i > 0 && (
                    <span className="text-[9px]" style={{ color: '#CBD5E1' }}>
                      ·
                    </span>
                  )}
                  <span className="text-[10px] font-medium" style={{ color: BRAND.navy }}>
                    {strength}
                  </span>
                </span>
              ))}
            </div>
          </section>

          {/* Contexto del proceso */}
          <section
            className="rounded-lg grid grid-cols-4 divide-x overflow-hidden"
            style={{ border: '1px solid #F1F5F9', background: '#FAFBFC' }}
          >
            {PROCESS_STATS.map(({ key, label, format, accent }) => {
              const raw = profile[key];
              const display = format ? format(raw) : String(raw);
              const isRisk = key === 'riskLevel';
              return (
                <div key={key} className="px-2 py-2.5 text-center min-w-0" style={{ borderColor: '#F1F5F9' }}>
                  <p className="text-[8px] uppercase mb-1 truncate" style={{ color: '#94A3B8', letterSpacing: '0.06em' }}>
                    {label}
                  </p>
                  <p
                    className="font-heading font-semibold tabular-nums leading-none truncate"
                    style={{
                      fontSize: isRisk ? '0.6875rem' : '0.8125rem',
                      color: accent && raw === 'Bajo' ? BRAND.greenDark : BRAND.navy,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {display}
                  </p>
                </div>
              );
            })}
          </section>
        </div>

        {/* Footer */}
        <div
          className="px-4 sm:px-5 py-2 border-t flex items-center justify-between gap-2"
          style={{ borderColor: '#F1F5F9', background: '#FAFBFC' }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: BRAND.navy }}
            >
              <span className="text-[7px] font-bold text-white">K</span>
            </div>
            <span className="text-[9px] font-medium truncate" style={{ color: '#94A3B8' }}>
              Kova Intelligence
            </span>
          </div>
          <span className="text-[8px] flex-shrink-0 tabular-nums" style={{ color: '#CBD5E1' }}>
            Actualizado hace 2 min
          </span>
        </div>
      </div>
    </div>
  );
}
