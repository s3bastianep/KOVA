import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const diferenciales = [
  'Equipo 100% enfocado en talento comercial.',
  'Evaluación diseñada para cada rol, no genérica.',
  'Simulaciones que miden desempeño real en ventas.',
  'Recomendación con evidencia para decidir con confianza.',
  'Resultados probados con empresas en Latinoamérica.',
  'Seguimiento completo hasta que contrate.',
];

export default function AccesoAnticipado() {
  return (
    <section
      id="acceso"
      className="py-14 lg:py-20 px-6 lg:px-8 relative overflow-hidden"
      style={{ background: KOVA.white }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-14 items-center">
          <div>
            <p className="kova-eyebrow-pill mb-5">Hablemos con Kova</p>
            <h2
              className="font-heading font-bold leading-tight mb-4 text-balance"
              style={{
                fontSize: 'clamp(1.75rem, 2.8vw, 2.375rem)',
                letterSpacing: '-0.03em',
                color: BRAND.navy,
              }}
            >
              Descubra cómo Kova encuentra el talento comercial que su empresa necesita.
            </h2>
            <p className="text-base leading-relaxed mb-6 max-w-lg" style={{ color: KOVA.body, lineHeight: 1.75 }}>
              Selección comercial ejecutada con rigor. Búsqueda, evaluación y recomendación en un proceso
              estructurado y transparente.
            </p>

            <ul className="space-y-3.5 mb-8">
              {diferenciales.map((item) => (
                <li key={item} className="flex items-start gap-3.5">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: BRAND.blue }}
                  >
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-[15px] leading-snug" style={{ color: KOVA.body, lineHeight: 1.6 }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              to="/contacto"
              className="hidden md:inline-flex group kova-btn-primary items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all text-white"
            >
              Contáctenos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-3 rounded-2xl opacity-60 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(26,63,170,0.08), rgba(0,178,122,0.06))' }}
              aria-hidden
            />
            <img
              src="/images/equipo-kova.png"
              alt="Equipo Kova colaborando en evaluación de talento comercial"
              className="relative w-full rounded-2xl object-cover aspect-[4/3] shadow-lg"
              style={{ boxShadow: '0 8px 32px rgba(15,31,61,0.12)' }}
            />
          </div>
        </div>

        <p
          className="text-center text-sm mt-10 lg:mt-12 max-w-2xl mx-auto"
          style={{ color: KOVA.muted, lineHeight: 1.65 }}
        >
          Selección comercial basada en competencias, no en experiencia declarada.
        </p>
      </div>
    </section>
  );
}
