import { CN_STATS_BAND, CN_STATS_DISCLAIMER } from '@/theme/landingConsult';
import Reveal from '@/components/validate/Reveal';

export default function StatsBand() {
  return (
    <section className="kv-stats-band">
      <div className="kv-wrap kv-stats-grid">
        {CN_STATS_BAND.map(({ value, label }) => (
          <Reveal key={value} className="kv-stat-cell">
            <b className="font-display">{value}</b>
            <span>{label}</span>
          </Reveal>
        ))}
      </div>
      <p className="kv-stats-disclaimer font-mono">{CN_STATS_DISCLAIMER}</p>
    </section>
  );
}
