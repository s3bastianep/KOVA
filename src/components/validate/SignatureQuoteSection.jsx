import { CN_SIGNATURE_QUOTE } from '@/theme/landingConsult';

export default function SignatureQuoteSection() {
  const { setup, payoffBefore, payoffHighlight, payoffAfter, cite } = CN_SIGNATURE_QUOTE;

  return (
    <section className="kv-section kv-section--accent kv-signature-quote">
      <div className="kv-wrap">
        <div className="kv-accent-panel kv-signature-panel">
          <div className="kv-signature-context">
            <p className="kv-signature-eyebrow font-mono">
              <span className="kv-signature-eyebrow-mark" aria-hidden />
              Por qué importa
            </p>
            <p className="kv-signature-setup">{setup}</p>
          </div>

          <div className="kv-signature-main font-display">
            <p className="kv-signature-payoff">
              {payoffBefore}
              <em>{payoffHighlight}</em>
              {payoffAfter}
            </p>
            <p className="kv-signature-cite">{cite}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
