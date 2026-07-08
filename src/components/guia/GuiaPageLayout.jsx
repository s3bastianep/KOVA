import '@/lib/loadLandingPagesStyles';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SiteLayout from '@/components/landing/SiteLayout';
import GuiaTableOfContents from './GuiaTableOfContents';
import GuiaSidebar from './GuiaSidebar';
import useGuiaActiveSection from './useGuiaActiveSection';
import { getRelatedGuides } from './guiaRoutes';

export default function GuiaPageLayout({
  currentPath,
  title,
  readTime,
  heroImage,
  heroImageAlt,
  tocItems,
  children,
}) {
  const activeId = useGuiaActiveSection(tocItems);
  const related = getRelatedGuides(currentPath);

  return (
    <SiteLayout>
      <header className="kv-guia-hero">
        <div className="kv-wrap">
          <Link to="/guias" className="kv-guia-back">
            <ArrowLeft className="kv-guia-back-icon" aria-hidden />
            Volver al blog
          </Link>
        </div>
        <div className="kv-wrap kv-guia-hero-grid">
          <div>
            <p className="kv-eyebrow font-mono">
              Blog · Lectura de {readTime}
            </p>
            <h1 className="font-display">{title}</h1>
            <div className="kv-guia-author">
              <div className="kv-guia-author-avatar">K</div>
              <div>
                <p className="kv-guia-author-name">Equipo Kova</p>
                <p className="kv-guia-author-role">Especialistas en áreas comerciales</p>
              </div>
            </div>
          </div>
          <div className="kv-guia-hero-media">
            <img src={heroImage} alt={heroImageAlt} loading="eager" />
          </div>
        </div>
      </header>

      <div className="kv-wrap kv-guia-body">
        <div className="kv-guia-layout">
          <GuiaTableOfContents items={tocItems} activeId={activeId} className="hidden xl:block" />

          <main className="kv-guia-article kv-prose">{children}</main>

          <GuiaSidebar currentPath={currentPath} />
        </div>
      </div>

      <div className="kv-guia-mobile-footer xl:hidden">
        <div className="kv-wrap">
          {related.length > 0 && (
            <div>
              <p className="kv-guia-mobile-title font-display">Artículos recientes</p>
              <div className="kv-guia-mobile-links">
                {related.map(({ path, title: t, readTime: rt }) => (
                  <Link key={path} to={path} className="kv-guia-mobile-link">
                    <p className="font-display">{t}</p>
                    <span className="font-mono">Lectura de {rt}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="kv-guia-mobile-title font-display">En esta publicación</p>
            <div className="kv-guia-toc-pills">
              {tocItems.map(({ id, label }) => (
                <a key={id} href={`#${id}`} className="kv-guia-toc-pill">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
