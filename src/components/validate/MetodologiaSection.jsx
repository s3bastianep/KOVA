import { CN_METHOD, CN_METHOD_HEADLINE, CN_METHOD_INTRO } from '@/theme/landingConsult';

const toneClass = {
  indigo: 'kv-step-badge--indigo',
  lime: 'kv-step-badge--lime',
  rose: 'kv-step-badge--rose',
  ink: 'kv-step-badge--ink',
};

export default function MetodologiaSection() {
  return (
    <section id="metodologia" className="kv-section">
      <div className="kv-wrap">
        <div className="kv-section-head">
          <span className="kv-section-tag font-mono">Nuestra metodología</span>
          <h2 className="kv-h2 font-display">{CN_METHOD_HEADLINE}</h2>
          <p className="kv-section-lead kv-section-lead--narrow">{CN_METHOD_INTRO}</p>
        </div>

        <div id="metodologia-detalle" className="kv-method-list">
          {CN_METHOD.map(({ n, title, body, tone }) => (
            <div key={n} className="kv-method-item">
              <span className={`kv-step-badge kv-step-badge--sm font-display ${toneClass[tone]}`}>
                {n}
              </span>
              <div>
                <h4 className="font-display">{title}</h4>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
