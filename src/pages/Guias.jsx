import '@/styles/landing-wave-inner.css';
import '@/styles/landing-wave-guia.css';
import '@/styles/landing-wave-blog-light.css';
import { Link } from 'react-router-dom';
import SiteLayout from '@/components/landing/SiteLayout';
import { GUIAS } from '@/components/guia/guiaRoutes';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function Guias() {
  usePageMeta({
    title: 'Blog',
    description:
      'Artículos con metodología, criterios y evidencia para atraer, evaluar y retener talento comercial.',
    path: '/guias',
  });

  const [featured, ...rest] = GUIAS;

  return (
    <SiteLayout className="kv-blog-light">
      <main className="kv-blog-index">
        <section className="kv-blog-hero">
          <div className="kv-wrap">
            <p className="kv-eyebrow font-mono">Blog</p>
            <h1 className="kv-blog-hero-title font-display">
              Criterio para contratar y evaluar{' '}
              <em>talento comercial</em>
            </h1>
            <p className="kv-blog-hero-lead">
              Metodología, señales y evidencia para atraer, evaluar y retener vendedores
              con más certeza.
            </p>
          </div>
        </section>

        {featured ? (
          <section className="kv-blog-featured" aria-label="Artículo destacado">
            <div className="kv-wrap">
              <Link to={featured.path} className="kv-blog-feature">
                <div className="kv-blog-feature-media">
                  {featured.image ? (
                    <img src={featured.image} alt="" loading="eager" />
                  ) : (
                    <div className="kv-blog-feature-placeholder" />
                  )}
                </div>
                <div className="kv-blog-feature-copy">
                  <span className="kv-blog-meta font-mono">
                    Destacado · {featured.readTime}
                  </span>
                  <h2>{featured.title}</h2>
                  <p>{featured.excerpt}</p>
                  <span className="kv-blog-read">
                    Leer artículo
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </div>
          </section>
        ) : null}

        <section className="kv-blog-list" aria-label="Más artículos">
          <div className="kv-wrap">
            <p className="kv-blog-list-label font-mono">Más artículos</p>
            <div className="kv-blog-grid">
              {rest.map((guia, index) => (
                <Link
                  key={guia.path}
                  to={guia.path}
                  className="kv-blog-item"
                  data-delay={index}
                >
                  <div className="kv-blog-item-media">
                    {guia.image ? (
                      <img src={guia.image} alt="" loading="lazy" />
                    ) : (
                      <div className="kv-blog-item-placeholder" />
                    )}
                  </div>
                  <div className="kv-blog-item-copy">
                    <span className="kv-blog-meta font-mono">{guia.readTime}</span>
                    <h2>{guia.title}</h2>
                    <p>{guia.excerpt}</p>
                    <span className="kv-blog-read">
                      Leer
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
