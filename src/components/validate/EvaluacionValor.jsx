import { CN, CN_BRAND_ANCHOR } from '@/theme/landingConsult';

const GRADIENT_ID = 'kovaEvalCompatGradient';

const metricas = [
  { label: 'Venta consultiva', value: 94 },
  { label: 'Prospección', value: 89 },
  { label: 'Manejo de objeciones', value: 91 },
];

export default function EvaluacionValor() {
  const stroke = 4;
  const radius = 52;
  const score = 92;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <section id="evaluacion" className="cn-section cn-section--score px-5 sm:px-6 lg:px-8">
      <div className="kova-page-container">
        <div className="cn-section-header cn-section-header--center max-w-2xl mx-auto mb-10 sm:mb-12 text-center">
          <p className="cn-eyebrow">Score Kova</p>
          <h2 className="cn-heading font-heading font-bold text-balance">
            La métrica que responde la pregunta correcta.
          </h2>
          <p className="cn-lead mx-auto">
            No mide si es un buen vendedor en abstracto. Evalúa si se adaptará al modelo comercial de su
            empresa.
          </p>
        </div>

        <div className="cn-score-showcase">
          <div className="cn-score-showcase__glow" aria-hidden />

          <div className="cn-score-showcase__ring-wrap">
            <svg viewBox="0 0 128 128" className="cn-score-showcase__ring" aria-hidden>
              <defs>
                <linearGradient id={GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={CN.navy} />
                  <stop offset="100%" stopColor={CN.positive} />
                </linearGradient>
              </defs>
              <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(26,63,170,0.12)" strokeWidth={stroke} />
              <circle
                cx="64"
                cy="64"
                r={radius}
                fill="none"
                stroke={`url(#${GRADIENT_ID})`}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="-rotate-90 origin-center"
                style={{ transformOrigin: 'center' }}
              />
            </svg>
            <div className="cn-score-showcase__value">
              <span className="cn-score-showcase__num font-heading">{score}</span>
              <span className="cn-score-showcase__unit">/ 100</span>
            </div>
          </div>

          <div className="cn-score-showcase__meta">
            <p className="cn-score-showcase__brand font-heading font-bold">Score Kova™</p>
            <p className="cn-score-showcase__tag">Índice de compatibilidad comercial</p>
            <p className="cn-score-showcase__anchor">{CN_BRAND_ANCHOR}</p>
          </div>

          <div className="cn-score-showcase__metrics">
            {metricas.map(({ label, value }) => (
              <div key={label} className="cn-score-showcase__metric">
                <div className="cn-score-showcase__metric-head">
                  <span>{label}</span>
                  <span className="font-heading font-bold tabular-nums">{value}%</span>
                </div>
                <div className="cn-score-showcase__metric-track">
                  <div className="cn-score-showcase__metric-fill" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
