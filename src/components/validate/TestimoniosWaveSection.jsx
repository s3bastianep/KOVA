import { CN_TESTIMONIALS } from '@/theme/landingConsult';

export default function TestimoniosWaveSection() {
  return (
    <section id="testimonios" className="kv-section kv-testimonios-wave">
      <div className="kv-wrap">
        <div className="kv-section-head-center">
          <span className="kv-section-tag font-mono">Voces de clientes</span>
          <h2 className="kv-h2 font-display">Impacto en el negocio, no solo en el proceso</h2>
        </div>

        <div className="kv-testimonios-grid">
          {CN_TESTIMONIALS.map(({ quote, name, role, company, photo }) => (
            <blockquote key={name} className="kv-testimonio-card">
              <p className="kv-testimonio-quote">&ldquo;{quote}&rdquo;</p>
              <footer className="kv-testimonio-author">
                <img src={photo} alt="" loading="lazy" />
                <div>
                  <cite>{name}</cite>
                  <p>
                    {role} · {company}
                  </p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
