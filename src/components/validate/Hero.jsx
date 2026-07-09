import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  CN_CTA_LABEL,
  CN_HERO_EYEBROW,
  CN_HERO_HEADLINE,
  CN_HERO_HEADLINE_HIGHLIGHT,
  CN_HERO_METHOD_LINK,
  CN_HERO_SUB_BODY,
  CN_HERO_SUB_LEAD,
} from '@/theme/landingConsult';

const HeroShootingStars = lazy(() => import('@/components/validate/HeroShootingStars'));
const HeroReportCard = lazy(() => import('@/components/validate/HeroReportCard'));

function HeroReportFallback() {
  return (
    <div className="kv-report-card kv-hero-report-fallback" aria-hidden>
      <div className="kv-report-topbar">
        <div className="kv-report-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="kv-hero">
      <Suspense fallback={null}>
        <HeroShootingStars />
      </Suspense>
      <div className="kv-wrap kv-hero-grid">
        <div className="kv-hero-copy">
          <p className="kv-eyebrow font-mono">{CN_HERO_EYEBROW}</p>
          <h1 className="font-display">
            {CN_HERO_HEADLINE} <em>{CN_HERO_HEADLINE_HIGHLIGHT}</em>
          </h1>
          <div className="kv-hero-sub">
            <h2 className="kv-hero-sub-lead font-display">{CN_HERO_SUB_LEAD}</h2>
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
          <Suspense fallback={<HeroReportFallback />}>
            <HeroReportCard />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
