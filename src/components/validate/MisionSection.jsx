import {
  CN_MISSION_BODY,
  CN_MISSION_HEADLINE,
  CN_MISSION_TAG,
  CN_MISSION_VISION,
} from '@/theme/landingConsult';

export default function MisionSection() {
  return (
    <section id="mision" className="kv-section kv-mision">
      <div className="kv-wrap kv-mision-grid">
        <div>
          <span className="kv-section-tag kv-section-tag--lime font-mono">{CN_MISSION_TAG}</span>
          <h2 className="kv-h2 kv-h2--light font-display">{CN_MISSION_HEADLINE}</h2>
        </div>
        <div className="kv-mision-copy">
          <p>{CN_MISSION_BODY}</p>
          <p>{CN_MISSION_VISION}</p>
        </div>
      </div>
    </section>
  );
}
