import '@/lib/loadLandingPagesStyles';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SiteLayout from '@/components/landing/SiteLayout';
import CierreLanding from '@/components/validate/CierreLanding';
import Reveal from '@/components/validate/Reveal';
import {
  CN_CTA_LABEL,
  CN_SERVICES,
  CN_SERVICES_HERO_FACES,
  CN_SERVICES_INTRO,
  CN_SERVICES_STATS,
  CN_SERVICES_TEAM,
} from '@/theme/landingConsult';

export default function Servicios() {
  return (
    <SiteLayout>
      <main>
        <section className="kv-inner-hero kv-servicios-hero">
          <div className="kv-wrap kv-servicios-hero-grid">
            <div className="kv-servicios-hero-copy">
              <p className="kv-eyebrow font-mono">Servicios</p>
              <h1 className="font-display kv-servicios-headline">
                <span>Soluciones que</span>
                <span className="kv-servicios-headline-accent">conectan</span>
                <span>empresas y talento comercial.</span>
              </h1>
              <p className="kv-inner-hero-sub">{CN_SERVICES_INTRO}</p>
              <Link to="/contacto" className="kv-btn-solid">
                {CN_CTA_LABEL}
              </Link>
            </div>

            <div className="kv-servicios-collage" aria-hidden>
              <div className="kv-servicios-collage-main">
                <img
                  src="/images/guia-habilidades-hero.png"
                  alt=""
                  loading="eager"
                />
              </div>
              <div className="kv-servicios-collage-faces">
                {CN_SERVICES_HERO_FACES.map((face) => (
                  <img key={face.src} src={face.src} alt="" loading="eager" />
                ))}
              </div>
              <p className="kv-servicios-collage-caption font-mono">
                + talento comercial evaluado
              </p>
            </div>
          </div>
        </section>

        <div className="kv-page-band kv-page-band--light">
          <section className="kv-section kv-servicios-stats" aria-label="Resultados del proceso">
            <div className="kv-wrap">
              <div className="kv-servicios-stats-grid">
                {CN_SERVICES_STATS.map((stat) => (
                  <div key={stat.label} className="kv-servicios-stat">
                    <p className="kv-servicios-stat-value font-display">{stat.value}</p>
                    <p className="kv-servicios-stat-label">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            className="kv-section kv-section--paper-2 kv-servicios-section"
            aria-label="Nuestros servicios"
          >
            <div className="kv-wrap">
              <div className="kv-section-head-center kv-servicios-head">
                <span className="kv-section-tag font-mono">Lo que ofrecemos</span>
                <h2 className="kv-h2 font-display">Tres servicios, un mismo estándar</h2>
                <p className="kv-section-lead">
                  Cada solución se adapta a cómo vende su empresa. El diagnóstico, las pruebas y la
                  presentación de candidatos comparten el mismo rigor técnico.
                </p>
              </div>

              <div className="kv-servicios-cards">
                {CN_SERVICES.map((service, index) => (
                  <Reveal key={service.n}>
                    <article
                      className={`kv-servicio-card kv-servicio-card--${service.tone}${index % 2 === 1 ? ' kv-servicio-card--reverse' : ''}`}
                    >
                      <div className="kv-servicio-card-media">
                        <div className="kv-servicio-card-frame">
                          <img src={service.image} alt={service.imageAlt} loading="lazy" />
                        </div>
                        <span className="kv-servicio-card-num font-display" aria-hidden>
                          {service.n}
                        </span>
                      </div>
                      <div className="kv-servicio-card-body">
                        <p className="kv-servicio-card-label font-mono">{service.label}</p>
                        <h3 className="kv-servicio-title font-display">{service.title}</h3>
                        <p className="kv-servicio-body">{service.body}</p>
                        <ul className="kv-servicio-items">
                          {service.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                        <p className="kv-servicio-highlight">{service.highlight}</p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>

              <p className="kv-servicios-method-link">
                <Link to="/como-trabajamos">
                  Ver cómo funciona el proceso completo
                  <ArrowRight strokeWidth={2} aria-hidden />
                </Link>
              </p>
            </div>
          </section>
        </div>

        <div className="kv-page-band kv-page-band--dark">
          <section className="kv-section kv-servicios-team" aria-label="Nuestro equipo">
            <div className="kv-wrap kv-servicios-team-grid">
              <Reveal>
                <div className="kv-servicios-team-media">
                  <img
                    src={CN_SERVICES_TEAM.image}
                    alt={CN_SERVICES_TEAM.imageAlt}
                    loading="lazy"
                  />
                  <div className="kv-servicios-team-badge font-mono">Consultores Kova</div>
                </div>
              </Reveal>
              <Reveal>
                <div className="kv-servicios-team-copy">
                  <span className="kv-enfoque-eyebrow font-mono">{CN_SERVICES_TEAM.tag}</span>
                  <h2 className="kv-h2 font-display">{CN_SERVICES_TEAM.headline}</h2>
                  <p className="kv-servicios-team-body">{CN_SERVICES_TEAM.body}</p>
                  <ul className="kv-enfoque-list">
                    <li>Diagnóstico comercial con su dirección de ventas</li>
                    <li>Entrevistas técnicas y validación de perfiles</li>
                    <li>Acompañamiento hasta la decisión de contratación</li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        <CierreLanding />
      </main>
    </SiteLayout>
  );
}
