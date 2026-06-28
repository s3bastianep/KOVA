import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroDemoMockup from '@/components/landing/HeroDemoMockup';
import { BRAND, KOVA } from '@/theme/kovaPalette';

export default function Hero() {
  return (
    <section className="relative overflow-hidden kova-hero-light">
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-28 pb-12 lg:pt-36 lg:pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="min-w-0 max-w-lg">
            <span className="kova-eyebrow-pill mb-5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.green }} />
              Expertos en selección comercial
            </span>

            <h1
              className="font-heading font-bold mb-4"
              style={{
                fontSize: 'clamp(2.125rem, 4vw, 3rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1.06,
                color: BRAND.navy,
              }}
            >
              Mejores{' '}
              <span className="kova-gradient-text">contrataciones</span>
              , cada vez.
            </h1>

            <p className="text-base lg:text-lg mb-8 max-w-[400px]" style={{ color: KOVA.body, lineHeight: 1.65 }}>
              El talento comercial ideal comienza con nosotros.
            </p>

            <Link
              to="/contacto"
              className="kova-btn-primary group inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-lg text-sm transition-all text-white"
            >
              Hablar con un experto
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="min-w-0 w-full">
            <HeroDemoMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
