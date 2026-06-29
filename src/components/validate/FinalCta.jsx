import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BRAND, KOVA } from '@/theme/kovaPalette';

export default function FinalCta() {
  return (
    <section id="contacto-final" className="py-8 lg:py-10 px-6 lg:px-8 bg-white border-t" style={{ borderColor: KOVA.border }}>
      <div className="max-w-xl mx-auto text-center">
        <h2
          className="font-heading font-bold text-balance mb-3"
          style={{
            fontSize: 'clamp(1.375rem, 2.4vw, 1.75rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            color: BRAND.navy,
          }}
        >
          Reciba candidatos comerciales evaluados para su equipo
        </h2>
        <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: KOVA.muted, lineHeight: 1.65 }}>
          Búsqueda, evaluación y presentación con criterio uniforme y evidencia documentada.
        </p>
        <Link
          to="/contacto"
          className="kova-btn-primary inline-flex group items-center gap-2 font-semibold px-7 py-3 rounded-lg text-sm text-white transition-all"
        >
          Solicitar consultoría
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
