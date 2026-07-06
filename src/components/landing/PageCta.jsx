import { Link } from 'react-router-dom';
import {
  CN_CTA_LABEL,
  CN_CTA_NOTE,
  CN_CLOSER_LEAD,
  CN_CLOSER_TITLE,
  CN_CLOSER_TITLE_HIGHLIGHT,
} from '@/theme/landingConsult';

export default function PageCta({
  id,
  tag,
  title = CN_CLOSER_TITLE,
  titleHighlight = CN_CLOSER_TITLE_HIGHLIGHT,
  lead = CN_CLOSER_LEAD,
  buttonLabel = CN_CTA_LABEL,
  note = CN_CTA_NOTE,
}) {
  const titleParts = title.split(titleHighlight);

  return (
    <section id={id} className="kv-section kv-section--accent kv-closer">
      <div className="kv-wrap">
        <div className="kv-accent-panel kv-closer-panel">
          <div className="kv-closer-copy">
            {tag ? (
              <p className="kv-closer-eyebrow font-mono">
                <span className="kv-closer-eyebrow-mark" aria-hidden />
                {tag}
              </p>
            ) : null}
            <h2 className="kv-closer-title font-display">
              {titleParts.length > 1 ? (
                <>
                  {titleParts[0]}
                  <em>{titleHighlight}</em>
                  {titleParts[1]}
                </>
              ) : (
                title
              )}
            </h2>
          </div>

          <div className="kv-closer-aside">
            <p className="kv-closer-lead">{lead}</p>
            <div className="kv-closer-cta">
              <Link to="/contacto" className="kv-btn-solid kv-closer-btn">
                {buttonLabel}
              </Link>
              {note ? <p className="kv-closer-note font-mono">{note}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
