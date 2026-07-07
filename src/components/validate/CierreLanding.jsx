import { Link } from 'react-router-dom';
import {
  CN_BRAND_CLOSE_HEADLINE,
  CN_BRAND_CLOSE_PROMPT,
  CN_BRAND_CLOSE_SUBLINE,
  CN_CTA_NOTE,
} from '@/theme/landingConsult';

export default function CierreLanding() {
  return (
    <section
      id="contacto-final"
      className="kv-section kv-section--accent kv-brand-close"
      aria-label="Mensaje de cierre"
    >
      <div className="kv-wrap">
        <div className="kv-brand-close-layout">
          <div className="kv-brand-close-message">
            <h2 className="kv-brand-close-headline font-display">{CN_BRAND_CLOSE_HEADLINE}</h2>
            <p className="kv-brand-close-sub">{CN_BRAND_CLOSE_SUBLINE}</p>
          </div>

          <div className="kv-brand-close-action">
            <Link to="/contacto" className="kv-btn-solid kv-brand-close-btn">
              {CN_BRAND_CLOSE_PROMPT}
            </Link>
            <p className="kv-brand-close-note">{CN_CTA_NOTE}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
