import { CN_BEYOND_INTRO, CN_BEYOND_TILES } from '@/theme/landingConsult';
import Reveal from '@/components/validate/Reveal';

export default function MasAllaSection() {
  return (
    <section id="mas-alla" className="kv-section kv-section--paper-2">
      <div className="kv-wrap">
        <div className="kv-phil-head">
          <span className="kv-section-tag font-mono">Más allá de la contratación</span>
          <h2 className="kv-h2 font-display" style={{ marginTop: '1rem' }}>
            No se trata solo de contratar bien. Se trata de que su equipo venda cada vez mejor.
          </h2>
          <p className="kv-section-lead">{CN_BEYOND_INTRO}</p>
        </div>
        <div className="kv-phil-grid kv-phil-grid--six">
          {CN_BEYOND_TILES.map(({ n, title, body }) => (
            <Reveal key={n} className="kv-phil-tile kv-phil-tile--white">
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
