import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { GUIAS } from '@/components/guia/guiaRoutes';
import { BRAND, KOVA } from '@/theme/kovaPalette';

export default function Guias() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden kova-hero-premium">
          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 lg:pb-16">
            <p className="kova-hero-eyebrow mb-4 sm:mb-5">Recursos</p>
            <h1 className="font-heading font-bold leading-tight mb-4 sm:mb-5 text-white text-balance kova-text-h1 max-w-3xl">
              Guías para contratar y evaluar <span className="kova-hero-highlight">talento comercial</span>
            </h1>
            <p
              className="text-[15px] sm:text-base leading-relaxed max-w-2xl"
              style={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.72 }}
            >
              Metodología, criterios y evidencia para tomar mejores decisiones al atraer, evaluar y retener vendedores.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GUIAS.map((guia) => (
              <Link
                key={guia.path}
                to={guia.path}
                className="group flex flex-col rounded-2xl bg-white overflow-hidden transition-all hover:-translate-y-1"
                style={{ border: `1px solid ${KOVA.border}`, boxShadow: '0 1px 3px rgba(15,31,61,0.04)' }}
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  {guia.image ? (
                    <img
                      src={guia.image}
                      alt={guia.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: KOVA.paleBlue }}>
                      <BookOpen className="w-8 h-8" style={{ color: BRAND.blue }} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-1.5 mb-3 text-xs font-medium" style={{ color: KOVA.muted }}>
                    <Clock className="w-3.5 h-3.5" />
                    Lectura de {guia.readTime}
                  </div>
                  <h2
                    className="font-heading font-semibold text-lg leading-snug mb-2 transition-colors"
                    style={{ color: BRAND.navy }}
                  >
                    {guia.title}
                  </h2>
                  <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: KOVA.muted }}>
                    {guia.excerpt}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                    style={{ color: BRAND.blue }}
                  >
                    Leer guía
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
