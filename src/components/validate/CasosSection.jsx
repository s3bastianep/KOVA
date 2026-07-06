import { CN_FOUNDER } from '@/theme/landingConsult';

export default function CasosSection() {
  return (
    <section id="casos" className="kv-section kv-section--paper-2">
      <div className="kv-wrap">
        <div className="kv-founder-split">
          <div className="kv-founder-stat">
            <div className="kv-founder-num font-display">{CN_FOUNDER.years}</div>
            <p className="kv-founder-num-label">{CN_FOUNDER.yearsLabel}</p>
            <div className="kv-founder-mini">
              <b className="font-display">{CN_FOUNDER.sectorsValue}</b>
              <span>{CN_FOUNDER.sectorsLabel}</span>
            </div>
          </div>
          <div className="kv-founder-copy">
            <span className="kv-section-tag font-mono">Detrás del método</span>
            <h2 className="kv-h2 font-display" style={{ marginTop: '1rem' }}>
              No es una teoría, es lo que hemos vivido liderando equipos comerciales
            </h2>
            <p className="kv-section-lead">{CN_FOUNDER.body}</p>
            <p className="kv-founder-conviction">{CN_FOUNDER.conviction}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
