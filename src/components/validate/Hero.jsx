import { Link } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';
import HeroDemoMockup from '@/components/landing/HeroDemoMockup';

export default function Hero() {
  return (
    <section className="relative overflow-hidden kova-hero-premium">
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10 lg:pt-36 lg:pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-7 sm:gap-10 lg:gap-12 xl:gap-14 items-center">
          <div className="min-w-0 max-w-xl lg:max-w-[34rem]">
            <span className="kova-hero-eyebrow mb-4 sm:mb-6 max-w-full">
              <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#8EC5FF' }} strokeWidth={2} />
              Reduzca los riesgos en la contratación de talento comercial
            </span>

            <h1 className="font-heading font-bold mb-4 sm:mb-5 text-white text-balance kova-text-h1">
              Contrate vendedores que{' '}
              <span className="kova-hero-highlight">generen resultados</span>, no solo buenas entrevistas.
            </h1>

            <p
              className="kova-text-body mb-6 sm:mb-9 max-w-lg"
              style={{ color: 'rgba(255,255,255,0.68)' }}
            >
              Kova entiende su proceso comercial, busca y evalúa el perfil ideal para su empresa, y lo presenta
              con evidencia documentada. Todo basado en datos.
            </p>

            <Link
              to="/contacto"
              className="hidden md:inline-flex kova-btn-primary group items-center gap-2 font-semibold px-7 py-3.5 rounded-lg text-sm transition-all text-white"
            >
              Solicitar consultoría
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="min-w-0 w-full relative -mx-0.5 sm:mx-0">
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
