import { Link } from 'react-router-dom';
import SiteLayout from '@/components/landing/SiteLayout';
import InnerPageHero from '@/components/landing/InnerPageHero';
import { GUIAS } from '@/components/guia/guiaRoutes';

export default function Guias() {
  return (
    <SiteLayout>
      <main>
        <InnerPageHero
          eyebrow="Blog"
          title="Información útil para contratar y evaluar"
          highlight="talento comercial"
          subtitle="Artículos con metodología, criterios y evidencia para tomar mejores decisiones al atraer, evaluar y retener vendedores."
        />

        <section className="kv-section">
          <div className="kv-wrap">
            <div className="kv-guia-grid">
              {GUIAS.map((guia) => (
                <Link key={guia.path} to={guia.path} className="kv-guia-card">
                  <div className="kv-guia-card-media">
                    {guia.image ? (
                      <img src={guia.image} alt="" loading="lazy" />
                    ) : (
                      <div className="kv-guia-card-placeholder" />
                    )}
                  </div>
                  <div className="kv-guia-card-body">
                    <span className="kv-guia-card-meta font-mono">Lectura de {guia.readTime}</span>
                    <h2 className="font-display">{guia.title}</h2>
                    <p>{guia.excerpt}</p>
                    <span className="kv-guia-card-link">Leer artículo</span>
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
