import { Sparkles } from 'lucide-react';
import { BRAND, KOVA } from '@/theme/kovaPalette';
import { TOP_CANDIDATE, TOP_MATCH, VACANCY_STATS } from '@/data/mockEvaluation';

const CANDIDATE_PHOTO =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face&auto=format&q=90';

const FIT_METRICS = [
  { label: 'Ajuste al rol', value: 94 },
  { label: 'Competencias comerciales', value: 93 },
  { label: 'Modelo de ventas', value: 88 },
];

const FOOTER_STATS = [
  { value: String(VACANCY_STATS.evaluatedCount), label: 'Evaluados' },
  { value: '3', label: 'En terna' },
  { value: `${TOP_MATCH}%`, label: 'Kova Score' },
  { value: '1er', label: 'Percentil' },
];

function FitBar({ label, value }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-medium truncate" style={{ color: KOVA.body }}>
          {label}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[12px] font-semibold tabular-nums" style={{ color: BRAND.navy }}>
            {value}%
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: KOVA.paleGreen, color: BRAND.greenDark }}
          >
            Alto
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: KOVA.surfaceAlt }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${BRAND.green}, ${BRAND.greenDark})`,
          }}
        />
      </div>
    </div>
  );
}

export default function HeroCandidateMockup({ dark = false }) {
  return (
    <div className="relative w-full min-w-0 py-2 lg:py-4">
      <div
        className={`relative rounded-2xl overflow-hidden w-full text-left ${dark ? 'kova-hero-mockup-glow' : ''}`}
        style={{
          background: KOVA.white,
          border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(226,230,237,0.95)',
        }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: KOVA.border }}>
          <div className="flex items-start gap-3.5">
            <img
              src={CANDIDATE_PHOTO}
              alt={TOP_CANDIDATE.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              style={{ boxShadow: '0 0 0 2px rgba(26,63,170,0.1)' }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-[15px] font-semibold truncate" style={{ color: BRAND.navy }}>
                  {TOP_CANDIDATE.name}
                </h3>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: KOVA.paleGreen, color: BRAND.greenDark }}
                >
                  Recomendada
                </span>
              </div>
              <p className="text-[12px] leading-snug" style={{ color: KOVA.muted }}>
                {TOP_CANDIDATE.role} · Vacante activa
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p
                className="text-[9px] font-semibold uppercase mb-0.5"
                style={{ color: KOVA.muted, letterSpacing: '0.12em' }}
              >
                Proceso
              </p>
              <p className="text-[12px] font-semibold" style={{ color: BRAND.blue }}>
                Informe listo
              </p>
            </div>
          </div>
        </div>

        {/* Match section */}
        <div className="px-5 py-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h4 className="text-[13px] font-semibold mb-0.5" style={{ color: BRAND.navy }}>
                Coincidencia con el perfil ideal
              </h4>
              <p className="text-[11px]" style={{ color: KOVA.muted }}>
                Evaluación por competencias · Ejecutivo Comercial
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p
                className="font-heading font-bold tabular-nums leading-none"
                style={{ fontSize: '2rem', color: BRAND.blue, letterSpacing: '-0.03em' }}
              >
                {TOP_MATCH}
              </p>
              <p
                className="text-[9px] font-semibold uppercase mt-1"
                style={{ color: KOVA.muted, letterSpacing: '0.1em' }}
              >
                Coincidencia
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {FIT_METRICS.map((m) => (
              <FitBar key={m.label} {...m} />
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="mx-5 mb-5 rounded-xl px-4 py-3.5" style={{ background: KOVA.paleBlue, border: '1px solid #C5D4F0' }}>
          <div className="flex items-start gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'rgba(26,63,170,0.12)' }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: BRAND.blue }} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[12px] font-semibold mb-1" style={{ color: BRAND.blue }}>
                Recomendación Kova
              </p>
              <p className="text-[11px] leading-relaxed" style={{ color: KOVA.body, lineHeight: 1.65 }}>
                Perfil con mayor ajuste al rol. Evidencia documentada en venta consultiva, prospección y manejo de
                objeciones. Lista para decisión de contratación.
              </p>
            </div>
          </div>
        </div>

        {/* Footer stats */}
        <div
          className="grid grid-cols-4 gap-2 px-5 py-4 border-t"
          style={{ borderColor: KOVA.border, background: KOVA.surface }}
        >
          {FOOTER_STATS.map(({ value, label }) => (
            <div key={label} className="text-center min-w-0">
              <p className="text-[15px] font-heading font-bold tabular-nums leading-none mb-1" style={{ color: BRAND.blue }}>
                {value}
              </p>
              <p className="text-[9px] font-medium uppercase truncate" style={{ color: KOVA.muted, letterSpacing: '0.06em' }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
