import { CN_SOLUTION_INTRO, CN_SOLUTION_TILES } from '@/theme/landingConsult';

export default function SolucionSection() {
  return (
    <section id="solucion" className="kv-section">
      <div className="kv-wrap">
        <div className="kv-section-head">
          <span className="kv-section-tag font-mono">La solución</span>
          <h2 className="kv-h2 font-display">Candidatos emparejados con precisión</h2>
          <p className="kv-section-lead">{CN_SOLUTION_INTRO}</p>
        </div>

        <div className="kv-phil-grid kv-phil-grid--four">
          {CN_SOLUTION_TILES.map(({ n, title, body }) => (
            <article key={n} className="kv-phil-tile">
              <div className="kv-phil-num font-display">{n}</div>
              <div>
                <h4 className="font-display">{title}</h4>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="kv-score-pill">
          <span className="kv-score-pill-dot" aria-hidden>
            ●
          </span>
          Impulsado por <strong>Kova Score</strong>, el índice predictivo que estima el potencial comercial
          de cada candidato en su modelo de negocio.
        </p>
      </div>
    </section>
  );
}
