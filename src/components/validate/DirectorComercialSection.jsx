import {
  CN_DIRECTOR_HEADLINE,
  CN_DIRECTOR_LEAD,
  CN_DIRECTOR_QUESTIONS,
  CN_DIRECTOR_TAG,
} from '@/theme/landingConsult';

export default function DirectorComercialSection() {
  return (
    <section id="director-comercial" className="kv-section kv-director">
      <div className="kv-wrap">
        <div className="kv-section-head-center">
          <span className="kv-section-tag font-mono">{CN_DIRECTOR_TAG}</span>
          <h2 className="kv-h2 font-display">{CN_DIRECTOR_HEADLINE}</h2>
          <p className="kv-section-lead">{CN_DIRECTOR_LEAD}</p>
        </div>

        <ol className="kv-director-list">
          {CN_DIRECTOR_QUESTIONS.map((question, index) => (
            <li key={question} className="kv-director-item">
              <span className="kv-director-num font-mono" aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </span>
              <p>{question}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
