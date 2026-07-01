import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BRAND, KOVA } from '@/theme/kovaPalette';

export default function FinalCta() {
  return (
    <section
      id="contacto-final"
      className="px-5 sm:px-6 lg:px-8 py-6 sm:py-7"
      style={{ background: KOVA.paleBlue }}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className="relative overflow-hidden rounded-xl sm:rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 px-5 py-5 sm:px-6 sm:py-5 lg:px-7 lg:py-6"
          style={{
            background: KOVA.white,
            border: `1px solid ${KOVA.border}`,
            boxShadow: '0 1px 3px rgba(15, 31, 61, 0.04)',
          }}
        >
          <span
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl sm:rounded-l-2xl"
            style={{ background: BRAND.coral }}
            aria-hidden
          />

          <div
            className="pointer-events-none absolute -right-16 -top-16 w-48 h-48 rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, rgba(26,63,170,0.06) 0%, transparent 70%)' }}
            aria-hidden
          />

          <div className="relative min-w-0 flex-1 pl-2 sm:pl-3">
            <h2
              className="font-heading font-bold text-balance mb-1.5 sm:mb-2"
              style={{
                fontSize: 'clamp(1.0625rem, 2vw, 1.3125rem)',
                color: BRAND.navy,
                letterSpacing: '-0.025em',
                lineHeight: 1.25,
              }}
            >
              Contratar talento comercial excepcional está a solo una conversación de distancia.
            </h2>
            <p className="text-[13px] sm:text-sm leading-relaxed max-w-xl" style={{ color: KOVA.muted, lineHeight: 1.6 }}>
              Contacte con nuestro equipo y descubra cómo{' '}
              <strong className="font-semibold" style={{ color: BRAND.navy }}>
                Kova
              </strong>{' '}
              puede ayudar a su equipo a crecer más rápido y mejor.
            </p>
          </div>

          <Link
            to="/contacto"
            className="relative kova-btn-primary inline-flex group items-center justify-center gap-2 font-semibold px-5 py-2.5 rounded-lg text-sm text-white transition-all flex-shrink-0 w-full sm:w-auto sm:ml-2"
          >
            Ponte en contacto
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
