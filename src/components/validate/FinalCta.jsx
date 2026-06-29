import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BRAND, KOVA } from '@/theme/kovaPalette';

export default function FinalCta() {
  return (
    <section id="contacto-final" className="px-6 lg:px-8 py-8 lg:py-10" style={{ background: KOVA.paleBlue }}>
      <div className="max-w-5xl mx-auto">
        <div
          className="rounded-2xl px-6 py-7 lg:px-8 lg:py-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-10"
          style={{
            background: BRAND.navy,
            boxShadow: '0 12px 40px rgba(15, 31, 61, 0.14)',
          }}
        >
          <div className="min-w-0 flex-1">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3"
              style={{ color: '#8EC5FF' }}
            >
              Empiece hoy
            </p>
            <h2
              className="font-heading font-bold text-white text-balance mb-2"
              style={{
                fontSize: 'clamp(1.25rem, 2.2vw, 1.625rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >
              Reciba candidatos comerciales evaluados para su equipo
            </h2>
            <p className="text-sm max-w-md" style={{ color: 'rgba(255,255,255,0.62)', lineHeight: 1.65 }}>
              Criterio uniforme y evidencia documentada en cada recomendación.
            </p>
          </div>

          <Link
            to="/contacto"
            className="kova-btn-primary inline-flex group items-center justify-center gap-2 font-semibold px-7 py-3.5 rounded-lg text-sm text-white transition-all flex-shrink-0 w-full sm:w-auto"
          >
            Solicitar consultoría
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
