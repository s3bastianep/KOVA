import { CN_HERO_METRICS, CN_HERO_SKILLS } from '@/theme/landingConsult';

export default function HeroReportCard() {
  return (
    <div className="kv-report-card">
      <div className="kv-report-topbar">
        <div className="kv-report-dots" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className="kv-report-title font-mono">Informe de evaluación · Ejecutivo comercial</div>
        <div className="kv-report-live font-mono">en vivo</div>
      </div>

      <div className="kv-report-candidate">
        <div className="kv-cand-left">
          <div className="kv-avatar">ML</div>
          <div>
            <div className="kv-cand-name">
              María López <span className="kv-badge-reco font-mono">Recomendada</span>
            </div>
            <div className="kv-cand-role">Ejecutivo comercial · B2B consultivo</div>
          </div>
        </div>
        <div className="kv-cand-score">
          <b className="font-display">92</b>
          <small className="font-mono">Kova Score</small>
          <div className="kv-cand-ref font-mono">REF. EV-0847</div>
        </div>
      </div>

      <div className="kv-report-skills">
        <div className="kv-skills-label font-mono">Dimensiones del Kova Score</div>
        {CN_HERO_SKILLS.map(({ name, value }) => (
          <div key={name} className="kv-skill-row">
            <span className="kv-skill-name">{name}</span>
            <div className="kv-skill-track">
              <div className="kv-skill-fill" style={{ width: `${value}%` }} />
            </div>
            <span className="kv-skill-val font-mono">{value}%</span>
          </div>
        ))}
      </div>

      <div className="kv-report-metrics">
        {CN_HERO_METRICS.map(({ value, label }) => (
          <div key={label} className="kv-metric-stat">
            <b className="font-display">{value}</b>
            <span className="font-mono">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
