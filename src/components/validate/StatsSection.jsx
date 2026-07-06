import { CN_MANAGER_QUOTES } from '@/theme/landingConsult';
import SquiggleDivider from '@/components/validate/SquiggleDivider';
import Reveal from '@/components/validate/Reveal';

export default function StatsSection() {
  return (
    <section id="panorama" className="kv-section kv-quotes">
      <div className="kv-wrap">
        <div className="kv-section-head">
          <SquiggleDivider label="Conversaciones con gerentes" dark />
          <h2 className="kv-h2 kv-h2--light font-display">Lo que escuchamos cada semana</h2>
        </div>
        <div className="kv-quote-list">
          {CN_MANAGER_QUOTES.map((quote) => (
            <Reveal key={quote} className="kv-quote-row">
              <span className="kv-quote-mark" aria-hidden>
                “
              </span>
              <p className="font-display">{quote}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
