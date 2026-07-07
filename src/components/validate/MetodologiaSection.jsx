import {
  CN_METHOD_HEADLINE,
  CN_METHOD_LANDING,
  CN_METHOD_LANDING_INTRO,
  CN_SIGNATURE_QUOTE,
} from '@/theme/landingConsult';

export default function MetodologiaSection() {
  const { setup, payoffBefore, payoffHighlight, payoffAfter, cite } = CN_SIGNATURE_QUOTE;

  return (
    <section id="metodologia" className="kv-section kv-method-light">
      <div className="kv-wrap">
        <div className="kv-section-head kv-section-head--compact">
          <span className="kv-section-tag font-mono">Cómo trabajamos</span>
          <h2 className="kv-h2 font-display">{CN_METHOD_HEADLINE}</h2>
          <p className="kv-section-lead">{CN_METHOD_LANDING_INTRO}</p>
        </div>

        <div id="metodologia-detalle" className="kv-phil-grid kv-phil-grid--four">
          {CN_METHOD_LANDING.map(({ n, title, body }) => (
            <article key={n} className="kv-phil-tile kv-phil-tile--method">
              <div className="kv-phil-num font-display">{n}</div>
              <div>
                <h4 className="font-display">{title}</h4>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="kv-method-signature kv-method-signature--light">
          <p className="kv-signature-eyebrow font-mono">
            <span className="kv-signature-eyebrow-mark" aria-hidden />
            Por qué importa
          </p>
          <p className="kv-signature-setup">{setup}</p>
          <p className="kv-signature-payoff font-display">
            {payoffBefore}
            <em>{payoffHighlight}</em>
            {payoffAfter}
          </p>
          {cite ? <p className="kv-signature-cite">{cite}</p> : null}
        </div>
      </div>
    </section>
  );
}
