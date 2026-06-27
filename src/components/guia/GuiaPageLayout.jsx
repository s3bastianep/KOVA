import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero editorial: texto + imagen (referencia Vervoe) */}
      <header className="pt-28 lg:pt-32 bg-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors hover:opacity-80"
            style={{ color: '#64748B' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Recursos para atraer talento comercial
          </Link>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-0 items-stretch">
          <div className="flex flex-col justify-between px-6 lg:px-8 xl:pl-8 pb-10 lg:pb-14 lg:pr-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: '#4338CA' }}>
                Recursos para atraer talento comercial · Lectura de {readTime}
              </p>
              <h1
                className="font-heading font-bold leading-tight"
                style={{
                  fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                  letterSpacing: '-0.03em',
                  color: '#0F172A',
                  lineHeight: 1.12,
                }}
              >
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-3 mt-10">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: '#4338CA' }}
              >
                K
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>Equipo Kova</p>
                <p className="text-xs" style={{ color: '#64748B' }}>
                  Especialistas en selección comercial B2B
                </p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[280px] lg:min-h-[400px]">
            <img
              src={heroImage}
              alt={heroImageAlt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Cuerpo: TOC | contenido | artículos relacionados */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px] gap-10 xl:gap-14">
          <GuiaTableOfContents items={tocItems} activeId={activeId} className="hidden xl:block" />

          <main className="min-w-0 max-w-[720px] lg:max-w-none mx-auto lg:mx-0 xl:col-start-2">
            {children}
          </main>

          <div className="xl:col-start-3">
            <GuiaSidebar currentPath={currentPath} />
          </div>
        </div>
      </div>

      {/* Mobile: artículos + TOC */}
      <div className="xl:hidden border-t px-6 py-8 space-y-8" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
        {related.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Artículos recientes</p>
            <div className="space-y-4">
              {related.map(({ path, title: t, readTime: rt }) => (
                <Link
                  key={path}
                  to={path}
                  className="block rounded-xl p-4 bg-white"
                  style={{ border: '1px solid #E2E8F0' }}
                >
                  <p className="text-sm font-semibold mb-0.5" style={{ color: '#4338CA' }}>{t}</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>Lectura de {rt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>En esta publicación</p>
          <div className="flex flex-wrap gap-2">
            {tocItems.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="text-xs font-medium px-3 py-2 rounded-lg"
                style={{ background: '#FFFFFF', color: '#4338CA', border: '1px solid #E0E7FF' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
