import { Compass, FileCheck, Gauge, Shield, SlidersHorizontal } from 'lucide-react';
import { accentCycle, BRAND, KOVA } from '@/theme/kovaPalette';

const pillars = [
  {
    icon: SlidersHorizontal,
    title: 'Ajuste al rol',
    desc: 'Evaluaciones diseñadas para su modelo de ventas, no pruebas genéricas que no predicen desempeño.',
  },
  {
    icon: Compass,
    title: 'Diagnóstico comercial',
    desc: 'Analizamos producto, mercado, clientes y modelo de ventas antes de definir el perfil y el proceso de selección.',
  },
  {
    icon: FileCheck,
    title: 'Evaluación con evidencia',
    desc: 'Cada candidato evaluado con el mismo criterio técnico y respaldo documentado por competencia.',
  },
  {
    icon: Gauge,
    title: 'Kova Score',
    desc: 'Índice predictivo que estima el potencial comercial de cada candidato en su organización.',
  },
];

export default function HeroCapabilities() {
  return (
    <section
      id="proceso"
      className="relative py-10 lg:py-16 px-5 sm:px-6 lg:px-8 border-b overflow-hidden kova-section-solution"
      style={{ borderColor: '#C5D4F0' }}
    >
      <div className="max-w-6xl mx-auto relative">
        <header className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10 px-0.5">
          <span className="kova-solution-eyebrow mb-4 sm:mb-5 mx-auto w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00B27A]" />
            La solución
          </span>
          <h2 className="font-heading font-bold text-balance mb-4 sm:mb-5 kova-text-h2-section" style={{ color: BRAND.navy }}>
            Candidatos emparejados{' '}
            <span style={{ color: BRAND.green }}>con precisión.</span>
          </h2>
          <p className="kova-text-body leading-relaxed mx-auto max-w-2xl" style={{ color: KOVA.body }}>
            Cada candidato pasa por un proceso de selección basado en evidencia documentada, diseñado para
            reducir el riesgo de contratación y ayudarte a enfocarte en el talento adecuado.
          </p>
        </header>

        <div
          className="rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6 mb-5 sm:mb-6 lg:mb-8"
          style={{
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid rgba(197,212,240,0.8)',
            boxShadow: '0 8px 32px rgba(26,63,170,0.08), 0 2px 8px rgba(15,31,61,0.04)',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {pillars.map(({ icon: Icon, title, desc }, i) => {
              const accent = accentCycle[i % accentCycle.length];
              return (
                <article
                  key={title}
                  className="group rounded-xl p-4 sm:p-5 lg:p-6 h-full transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: KOVA.white,
                    border: `1px solid ${accent.border}`,
                    boxShadow: '0 2px 12px rgba(15,31,61,0.06)',
                  }}
                >
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-200 group-hover:scale-105"
                    style={{ background: accent.bg }}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accent.icon }} strokeWidth={2.25} />
                  </div>
                  <h3 className="text-[15px] sm:text-base font-semibold mb-1.5 sm:mb-2 leading-snug" style={{ color: BRAND.navy }}>
                    {title}
                  </h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: KOVA.body, lineHeight: 1.6 }}>
                    {desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <div
          className="max-w-4xl mx-auto rounded-xl px-4 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:gap-5"
          style={{
            background: `linear-gradient(135deg, ${BRAND.navy} 0%, #1A2D4A 100%)`,
            boxShadow: '0 12px 40px rgba(15,31,61,0.2)',
          }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(0,178,122,0.15)', border: '1px solid rgba(0,178,122,0.3)' }}
          >
            <Shield className="w-5 h-5" style={{ color: BRAND.green }} strokeWidth={2} />
          </div>
          <p className="text-[13px] sm:text-sm lg:text-[15px] leading-relaxed flex-1 min-w-0" style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.65 }}>
            <span className="font-semibold text-white">Impulsado por Kova Score</span>
            <span style={{ color: 'rgba(255,255,255,0.72)' }}>
              , el índice predictivo que estima el potencial comercial de cada candidato en su modelo de negocio.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
