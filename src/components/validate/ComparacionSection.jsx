import {
  CN_COMPARISON_HEADLINE,
  CN_COMPARISON_LEAD,
  CN_COMPARISON_PAIRS,
} from '@/theme/landingConsult';

export default function ComparacionSection() {
  return (
    <section id="por-que-kova" className="kv-section kv-comparison">
      <div className="kv-wrap">
        <div className="kv-section-head">
          <span className="kv-section-tag kv-section-tag--lime font-mono">La diferencia</span>
          <h2 className="kv-h2 kv-h2--light font-display">{CN_COMPARISON_HEADLINE}</h2>
          <p>{CN_COMPARISON_LEAD}</p>
        </div>

        <div className="kv-compare-matrix">
          <div className="kv-compare-matrix-head">
            <span className="font-display">Selección tradicional</span>
            <span className="font-display">Metodología Kova</span>
          </div>
          {CN_COMPARISON_PAIRS.map(({ traditional, kova }) => (
            <div key={traditional} className="kv-compare-matrix-row">
              <div className="kv-compare-matrix-cell kv-compare-matrix-cell--old">
                <span className="kv-compare-matrix-label font-mono" aria-hidden>
                  Tradicional
                </span>
                <i className="font-mono" aria-hidden>
                  ✕
                </i>
                <span>{traditional}</span>
              </div>
              <div className="kv-compare-matrix-cell kv-compare-matrix-cell--kova">
                <span className="kv-compare-matrix-label font-mono" aria-hidden>
                  Kova
                </span>
                <i className="font-mono" aria-hidden>
                  ✓
                </i>
                <span>{kova}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
