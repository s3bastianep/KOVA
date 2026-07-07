import { CN_FOUNDER } from '@/theme/landingConsult';

export default function CasosSection() {
  const { tag, years, yearsLabel, sectors, headline, summary } = CN_FOUNDER;

  return (
    <section id="casos" className="kv-section kv-founder-brief">
      <div className="kv-wrap">
        <article className="kv-founder-brief-card">
          <header className="kv-founder-brief-head">
            <span className="kv-section-tag font-mono">{tag}</span>
            <h2 className="kv-h2 font-display">{headline}</h2>
            <p className="kv-founder-brief-summary">{summary}</p>
          </header>

          <footer className="kv-founder-brief-foot">
            <div className="kv-founder-brief-metric">
              <span className="kv-founder-brief-years font-display">{years}</span>
              <span className="kv-founder-brief-years-label">{yearsLabel}</span>
            </div>
            <ul className="kv-founder-brief-sectors" aria-label="Sectores">
              {sectors.map((sector) => (
                <li key={sector}>{sector}</li>
              ))}
              <li className="kv-founder-brief-more">+ más</li>
            </ul>
          </footer>
        </article>
      </div>
    </section>
  );
}
