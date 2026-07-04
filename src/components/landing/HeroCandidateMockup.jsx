import {
  Briefcase,
  Clock,
  FileText,
  Handshake,
  MessageSquare,
  MoreVertical,
  RefreshCw,
  Rocket,
  Search,
  Shield,
  Star,
  Target,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
} from 'lucide-react';
import { BRAND, KOVA } from '@/theme/kovaPalette';
import { TOP_CANDIDATE, TOP_PROFILE } from '@/data/mockEvaluation';

const CANDIDATE_PHOTO =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=face&q=90';

const GRADIENT_ID = 'kovaHeroScoreGradient';

const PREDICTIVE_KPIS = [
  { key: 'kovaScore', label: 'Puntaje Kova', icon: Rocket, iconBg: KOVA.paleGreen, iconColor: BRAND.green },
  { key: 'successProbability', label: 'Prob. de éxito', suffix: '%', icon: Target, iconBg: KOVA.paleBlue, iconColor: BRAND.blue },
  { key: 'culturalFit', label: 'Compat. cultural', suffix: '%', icon: Users, iconBg: KOVA.paleGreen, iconColor: BRAND.greenDark },
  { key: 'quotaPotential', label: 'Potencial de cuota', suffix: '%', icon: TrendingUp, iconBg: KOVA.paleBlue, iconColor: BRAND.blueMid },
  { key: 'modelFit', label: 'Ajuste al modelo', suffix: '%', icon: Briefcase, iconBg: KOVA.paleBlue, iconColor: BRAND.blue },
  { key: 'retention12m', label: 'Retención 12 m', suffix: '%', icon: Clock, iconBg: KOVA.paleGreen, iconColor: BRAND.greenDark },
];

const COMPETENCY_ICONS = {
  'Venta consultiva': Handshake,
  Prospección: Search,
  'Manejo de objeciones': MessageSquare,
  'Orientación al logro': Trophy,
};

const STRENGTH_DOTS = [BRAND.blue, BRAND.green, BRAND.greenDark];

const PROCESS_STATS = [
  { key: 'evaluatedCount', label: 'Evaluados', icon: Users, iconBg: KOVA.paleBlue, iconColor: BRAND.blue },
  { key: 'shortlistSize', label: 'En terna', icon: UserCheck, iconBg: KOVA.paleBlue, iconColor: BRAND.blueMid },
  { key: 'percentile', label: 'Percentil', format: (v) => `${v}.º`, icon: TrendingUp, iconBg: KOVA.paleGreen, iconColor: BRAND.greenDark },
  { key: 'riskLevel', label: 'Riesgo', accent: true, icon: Shield, iconBg: KOVA.paleCoral, iconColor: BRAND.coral },
];

function SectionLabel({ children }) {
  return (
    <p
      className="text-[10px] font-semibold uppercase mb-2.5 leading-none tracking-wide"
      style={{ color: KOVA.muted }}
    >
      {children}
    </p>
  );
}

function ScoreRing({ value }) {
  const stroke = 5;
  const radius = 37;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center flex-shrink-0 w-[4.25rem] px-0.5">
      <div className="relative w-full aspect-square">
        <svg
          viewBox="0 0 88 88"
          className="block w-full h-full -rotate-90"
          shapeRendering="geometricPrecision"
          aria-hidden
        >
          <defs>
            <linearGradient id={GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={BRAND.green} />
              <stop offset="100%" stopColor={BRAND.blue} />
            </linearGradient>
          </defs>
          <circle cx="44" cy="44" r={radius} fill="none" stroke={KOVA.border} strokeWidth={stroke} />
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke={`url(#${GRADIENT_ID})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-[14%] flex flex-col items-center justify-center gap-1">
          <span
            className="font-heading font-bold tabular-nums leading-none text-base"
            style={{ color: BRAND.navy, letterSpacing: '-0.04em' }}
          >
            {value}
          </span>
          <span
            className="text-[8px] font-semibold uppercase leading-none tracking-wide"
            style={{ color: KOVA.muted }}
          >
            Afinidad
          </span>
        </div>
      </div>
      <span
        className="mt-2.5 text-[9px] font-semibold px-2.5 py-1 rounded-md"
        style={{ color: BRAND.greenDark, background: KOVA.paleGreen }}
      >
        Excelente
      </span>
    </div>
  );
}

function KpiCard({ icon: Icon, iconBg, iconColor, label, value, highlight }) {
  return (
    <div
      className="flex items-center gap-2 min-w-0 rounded-lg px-2 py-1.5"
      style={{ background: KOVA.white, border: `1px solid ${KOVA.border}` }}
    >
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg }}
      >
        <Icon className="w-3 h-3" style={{ color: iconColor }} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] leading-none mb-0.5 whitespace-nowrap" style={{ color: KOVA.muted }}>
          {label}
        </p>
        <p
          className="font-heading font-semibold tabular-nums leading-none text-xs"
          style={{
            color: highlight ? BRAND.greenDark : BRAND.navy,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function CompetencyBar({ label, value, maxInSet }) {
  const isTop = value === maxInSet;
  const Icon = COMPETENCY_ICONS[label] ?? Target;

  return (
    <div className="flex items-center gap-3 w-full min-w-0">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: isTop ? KOVA.paleGreen : KOVA.paleBlue }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: isTop ? BRAND.greenDark : BRAND.blue }} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <span className="text-[10px] font-medium leading-snug" style={{ color: BRAND.navy }}>
            {label}
          </span>
          <span
            className="font-heading font-semibold tabular-nums text-[10px] leading-none shrink-0 w-9 text-right"
            style={{ color: isTop ? BRAND.greenDark : BRAND.blue, letterSpacing: '-0.02em' }}
          >
            {value}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: KOVA.border }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.round(value)}%`,
              background: isTop
                ? `linear-gradient(90deg, ${BRAND.green} 0%, ${BRAND.greenDark} 100%)`
                : `linear-gradient(90deg, ${BRAND.blue} 0%, ${BRAND.blueMid} 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, display, icon: Icon, iconBg, iconColor, accent }) {
  return (
    <div
      className="flex flex-col items-center text-center rounded-lg px-2 py-2.5 min-w-0"
      style={{ background: KOVA.white, border: `1px solid ${KOVA.border}` }}
    >
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mb-1.5"
        style={{ background: iconBg }}
      >
        <Icon className="w-3 h-3" style={{ color: iconColor }} strokeWidth={2} />
      </div>
      <p className="text-[9px] uppercase mb-1 tracking-wide leading-none" style={{ color: KOVA.muted }}>
        {label}
      </p>
      <p
        className="font-heading font-semibold tabular-nums leading-none text-xs"
        style={{
          color: accent ? BRAND.greenDark : BRAND.navy,
          letterSpacing: '-0.02em',
        }}
      >
        {display}
      </p>
    </div>
  );
}

export default function HeroCandidateMockup({ dark = false }) {
  const profile = TOP_PROFILE;
  const maxCompetency = Math.max(...profile.competencies.map((c) => c.value));

  return (
    <div className="relative w-full min-w-0">
      <div
        className="kova-mockup-crisp kova-ui-crisp relative rounded-xl sm:rounded-2xl overflow-hidden w-full text-left bg-white"
        style={{
          border: `1px solid ${KOVA.border}`,
          boxShadow: dark
            ? '0 12px 40px rgba(15,31,61,0.14)'
            : '0 1px 2px rgba(15, 31, 61, 0.04), 0 16px 40px rgba(15, 31, 61, 0.06)',
        }}
      >
        <div
          className="flex items-center gap-2.5 px-4 py-2.5 border-b"
          style={{ background: KOVA.surface, borderColor: KOVA.border }}
        >
          <div className="flex gap-1.5 flex-shrink-0">
            {['#D1D5DB', '#D1D5DB', '#D1D5DB'].map((c, i) => (
              <span key={i} className="w-[7px] h-[7px] rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="h-[22px] rounded-md flex items-center px-2.5 w-full"
              style={{ background: KOVA.white, border: `1px solid ${KOVA.border}` }}
            >
              <span className="text-[9px] font-medium w-full text-center" style={{ color: KOVA.muted }}>
                Informe de evaluación · Ejecutivo Comercial
              </span>
            </div>
          </div>
          <span
            className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded flex-shrink-0 tracking-wide inline-flex items-center gap-1"
            style={{ color: BRAND.greenDark, background: KOVA.paleGreen }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            En vivo
          </span>
          <MoreVertical className="w-3 h-3 flex-shrink-0" style={{ color: KOVA.muted }} aria-hidden />
        </div>

        <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: KOVA.border }}>
          <div className="relative flex-shrink-0">
            <img
              src={`${CANDIDATE_PHOTO}&w=128`}
              srcSet={`${CANDIDATE_PHOTO}&w=64 1x, ${CANDIDATE_PHOTO}&w=128 2x, ${CANDIDATE_PHOTO}&w=192 3x, ${CANDIDATE_PHOTO}&w=256 4x`}
              alt={TOP_CANDIDATE.name}
              width={44}
              height={44}
              decoding="async"
              className="w-11 h-11 rounded-full object-cover"
              style={{ border: `2px solid ${KOVA.white}`, boxShadow: `0 0 0 1px ${KOVA.border}` }}
            />
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
              style={{ background: BRAND.green, borderColor: KOVA.white }}
              aria-hidden
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-xs font-semibold leading-tight" style={{ color: BRAND.navy }}>
                {TOP_CANDIDATE.name}
              </h3>
              <span
                className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded flex-shrink-0 tracking-wide inline-flex items-center gap-1"
                style={{ color: BRAND.greenDark, background: KOVA.paleGreen }}
              >
                <Star className="w-2 h-2 fill-current" strokeWidth={0} />
                Recomendada
              </span>
            </div>
            <p className="text-[10px]" style={{ color: KOVA.muted }}>
              {TOP_CANDIDATE.role} · B2B consultivo
            </p>
          </div>
          <div className="text-right flex-shrink-0 hidden sm:flex sm:items-center sm:gap-1.5">
            <FileText className="w-3 h-3" style={{ color: KOVA.muted }} aria-hidden />
            <p className="text-[9px] font-semibold tabular-nums" style={{ color: BRAND.navy }}>
              REF. EV-0847
            </p>
          </div>
        </div>

        <div className="px-4 py-3 space-y-3">
          {/* Análisis predictivo — ancho completo, gauge + KPIs 3×2 */}
          <section
            className="rounded-xl p-3.5"
            style={{ background: KOVA.surface, border: `1px solid ${KOVA.border}` }}
          >
            <SectionLabel>Análisis predictivo</SectionLabel>
            <div className="flex gap-4 items-center">
              <ScoreRing value={profile.matchScore} />
              <div className="flex-1 min-w-0 grid grid-cols-3 gap-x-2 gap-y-1.5">
                {PREDICTIVE_KPIS.map(({ key, label, suffix, icon, iconBg, iconColor }, i) => (
                  <KpiCard
                    key={key}
                    icon={icon}
                    iconBg={iconBg}
                    iconColor={iconColor}
                    label={label}
                    value={`${profile[key]}${suffix ?? ''}`}
                    highlight={i === 0}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Competencias — ancho completo, barras horizontales */}
          <section
            className="rounded-xl p-3.5"
            style={{ background: KOVA.surface, border: `1px solid ${KOVA.border}` }}
          >
            <SectionLabel>Competencias comerciales</SectionLabel>
            <div className="space-y-2.5">
              {profile.competencies.map(({ label, value }) => (
                <CompetencyBar key={label} label={label} value={value} maxInSet={maxCompetency} />
              ))}
            </div>
          </section>

          {/* Fortalezas — línea con puntos de color */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-[10px] font-semibold uppercase shrink-0 tracking-wide" style={{ color: KOVA.muted }}>
              Fortalezas
            </span>
            {profile.strengths.map((strength, i) => (
              <span key={strength} className="inline-flex items-center gap-1.5 text-[10px] font-medium" style={{ color: BRAND.navy }}>
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: STRENGTH_DOTS[i % STRENGTH_DOTS.length] }}
                />
                {strength}
              </span>
            ))}
          </div>

          {/* Stats — 4 tarjetas en fila */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PROCESS_STATS.map(({ key, label, format, accent, icon, iconBg, iconColor }) => {
              const raw = profile[key];
              const display = format ? format(raw) : String(raw);
              return (
                <StatCard
                  key={key}
                  label={label}
                  display={display}
                  icon={icon}
                  iconBg={iconBg}
                  iconColor={iconColor}
                  accent={accent && raw === 'Bajo'}
                />
              );
            })}
          </div>
        </div>

        <div
          className="px-4 py-2.5 border-t flex items-center justify-between gap-2"
          style={{ borderColor: KOVA.border, background: KOVA.surface }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: BRAND.navy }}
            >
              <span className="text-[8px] font-bold text-white">K</span>
            </div>
            <span className="text-[9px] font-medium" style={{ color: KOVA.muted }}>
              Kova Intelligence
            </span>
          </div>
          <span className="text-[9px] flex-shrink-0 tabular-nums inline-flex items-center gap-1" style={{ color: KOVA.muted }}>
            <RefreshCw className="w-2.5 h-2.5" aria-hidden />
            Actualizado hace 2 min
          </span>
        </div>
      </div>
    </div>
  );
}
