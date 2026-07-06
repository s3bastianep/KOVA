import { Link } from 'react-router-dom';
import HeroReportCard from '@/components/validate/HeroReportCard';
import HeroShootingStars from '@/components/validate/HeroShootingStars';
import {
  CN_CTA_LABEL,
  CN_HERO_EYEBROW,
  CN_HERO_HEADLINE_HIGHLIGHT,
  CN_HERO_METHOD_LINK,
  CN_HERO_SUB_BODY,
} from '@/theme/landingConsult';

export default function Hero() {
  return (
    <section className="kv-hero">
      <HeroShootingStars />
      <div className="kv-wrap kv-hero-grid">
        <div className="kv-hero-copy">
          <p className="kv-eyebrow font-mono">{CN_HERO_EYEBROW}</p>
          <h1 className="font-display">
            Contrate con <em>{CN_HERO_HEADLINE_HIGHLIGHT}</em>, no solo con intuición
          </h1>
          <div className="kv-hero-sub">
            <h2 className="kv-hero-sub-lead font-display">
              Cada empresa vende de forma <em>diferente</em>
            </h2>
            <p className="kv-hero-sub-body">{CN_HERO_SUB_BODY}</p>
          </div>
          <div className="kv-hero-ctas">
            <Link to="/contacto" className="kv-btn-solid kv-hero-cta-primary">
              {CN_CTA_LABEL}
            </Link>
            <Link to="/como-trabajamos" className="kv-btn-line kv-hero-cta-secondary">
              {CN_HERO_METHOD_LINK}
            </Link>
          </div>
        </div>
        <div className="kv-hero-visual">
          <HeroReportCard />
        </div>
      </div>
    </section>
  );
}
