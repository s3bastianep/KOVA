import { CN_PHILOSOPHY_HEADLINE, CN_PHILOSOPHY_LEAD, CN_PRINCIPLES } from '@/theme/landingConsult';
import SquiggleDivider from '@/components/validate/SquiggleDivider';
import Reveal from '@/components/validate/Reveal';

export default function FilosofiaSection() {
  return (
    <section id="filosofia" className="kv-section kv-section--paper-2">
      <div className="kv-wrap">
        <div className="kv-phil-head">
          <SquiggleDivider label="Nuestra filosofía" />
          <h2 className="kv-h2 font-display">{CN_PHILOSOPHY_HEADLINE}</h2>
          <p className="kv-section-lead">{CN_PHILOSOPHY_LEAD}</p>
        </div>
        <div className="kv-phil-grid">
          {CN_PRINCIPLES.map(({ n, title, body }) => (
            <Reveal key={n} className="kv-phil-tile">
              <div className="kv-phil-num font-display">{n}</div>
              <div>
                <h4 className="font-display">{title}</h4>
                <p>{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
