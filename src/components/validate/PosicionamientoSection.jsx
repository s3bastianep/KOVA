import {
  CN_POSITION_HEADLINE,
  CN_POSITION_LEAD,
  CN_POSITION_PILLARS,
  CN_POSITION_TAG,
} from '@/theme/landingConsult';

export default function PosicionamientoSection() {
  return (
    <section id="posicionamiento" className="kv-section kv-position">
      <div className="kv-wrap">
        <div className="kv-position-intro">
          <span className="kv-section-tag kv-section-tag--lime font-mono">{CN_POSITION_TAG}</span>
          <h2 className="kv-h2 kv-h2--light font-display">{CN_POSITION_HEADLINE}</h2>
          <p className="kv-position-lead">{CN_POSITION_LEAD}</p>
        </div>

        <div className="kv-position-grid">
          {CN_POSITION_PILLARS.map(({ neg, pos }) => (
            <article key={neg} className="kv-position-card">
              <p className="kv-position-neg font-mono">{neg}</p>
              <p className="kv-position-pos font-display">{pos}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
