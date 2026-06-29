import { Link } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';
import HeroDemoMockup from '@/components/landing/HeroDemoMockup';

export default function Hero() {
  return (
    <section className="relative overflow-hidden kova-hero-premium">
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-28 pb-12 lg:pt-36 lg:pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-14 items-center">
          <div className="min-w-0 max-w-xl lg:max-w-[34rem]">
            <span className="kova-hero-eyebrow mb-6">
              <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#8EC5FF' }} strokeWidth={2} />
              Reduzca los riesgos en la contratación de talento comercial
            </span>

            <h1
              className="font-heading font-bold mb-5 text-white text-balance"
              style={{
                fontSize: 'clamp(2.25rem, 4.8vw, 3.375rem)',
                letterSpacing: '-0.035em',
                lineHeight: 1.08,
              }}
            >
              Contrate talento comercial que{' '}
              <span className="kova-hero-highlight">rinda en ventas</span>, no solo que impresione en la
              entrevista.
            </h1>

            <p
              className="text-base lg:text-[17px] mb-9 max-w-lg leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.72 }}
            >
              Kova entiende su proceso comercial, busca y evalúa el perfil ideal para su empresa, y lo
              presenta con evidencia documentada. Todo basado en datos.
            </p>

            <Link
              to="/contacto"
              className="hidden md:inline-flex kova-btn-primary group items-center gap-2 font-semibold px-7 py-3.5 rounded-lg text-sm transition-all text-white"
            >
              Solicitar consultoría
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="min-w-0 w-full relative">
            <div
              className="absolute -inset-4 lg:-inset-6 rounded-3xl opacity-60 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(45,91,227,0.22) 0%, transparent 70%)',
              }}
              aria-hidden
            />
            <div className="relative lg:translate-y-1">
              <HeroDemoMockup dark />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
