import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardCheck, FileCheck, SlidersHorizontal, Target } from 'lucide-react';
import { accentCycle, BRAND, KOVA } from '@/theme/kovaPalette';

const pasos = [
  { n: '01', icon: Target, title: 'Diagnosticar', desc: 'Entendemos su negocio.' },
  { n: '02', icon: SlidersHorizontal, title: 'Diseñar', desc: 'Evaluación a su medida.' },
  { n: '03', icon: ClipboardCheck, title: 'Evaluar', desc: 'Mismo criterio para todos.' },
  { n: '04', icon: FileCheck, title: 'Entregar', desc: 'Terna lista para decidir.' },
];

function PasoColumn({ n, icon: Icon, title, desc, accent, showArrow }) {
  return (
    <article className="group relative flex flex-col px-5 py-6 sm:px-6 sm:py-7 lg:px-7 lg:py-8 transition-colors duration-200 hover:bg-[rgba(26,63,170,0.025)]">
      {showArrow && (
        <span
          className="hidden lg:flex absolute -right-3 top-[2.75rem] z-10 w-6 h-6 rounded-full items-center justify-center"
          style={{ background: KOVA.white, border: `1px solid ${KOVA.border}`, boxShadow: '0 2px 8px rgba(15,31,61,0.06)' }}
          aria-hidden
        >
          <ArrowRight className="w-3 h-3" style={{ color: BRAND.blueMid }} strokeWidth={2.5} />
        </span>
      )}

      <div className="relative w-12 h-12 mb-4 sm:mb-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
          style={{
            background: `linear-gradient(145deg, ${accent.bg} 0%, ${KOVA.white} 100%)`,
            border: `1px solid ${accent.border}`,
            boxShadow: '0 4px 14px rgba(15,31,61,0.06)',
          }}
        >
          <Icon className="w-5 h-5" style={{ color: accent.icon }} strokeWidth={2.25} />
        </div>
        <span
          className="absolute -top-1.5 -right-1.5 min-w-[1.375rem] h-[1.375rem] px-1 rounded-full flex items-center justify-center text-[9px] font-bold tabular-nums text-white"
          style={{ background: accent.icon, boxShadow: '0 2px 6px rgba(15,31,61,0.15)' }}
        >
          {n}
        </span>
      </div>

      <h3 className="text-[15px] sm:text-base font-semibold mb-1.5 leading-snug" style={{ color: BRAND.navy }}>
        {title}
      </h3>
      <p className="text-[13px] sm:text-sm leading-relaxed" style={{ color: KOVA.muted, lineHeight: 1.55 }}>
        {desc}
      </p>
    </article>
  );
}

export default function MetodologiaProceso() {
  return (
    <section
      id="metodologia"
      className="relative py-10 lg:py-16 px-5 sm:px-6 lg:px-8 overflow-hidden border-b"
      style={{ background: KOVA.surface, borderColor: KOVA.border }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 50% 45% at 0% 0%, rgba(26,63,170,0.05) 0%, transparent 55%), radial-gradient(ellipse 45% 40% at 100% 100%, rgba(0,178,122,0.05) 0%, transparent 55%)',
        }}
        aria-hidden
      />

      <div className="max-w-6xl mx-auto relative">
        <header className="text-center max-w-2xl mx-auto mb-7 sm:mb-9 lg:mb-10">
          <span className="kova-solution-eyebrow mb-4 sm:mb-5 mx-auto w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00B27A]" />
            Metodología
          </span>
          <h2 className="font-heading font-bold text-balance mb-3 sm:mb-4 kova-text-h2-section" style={{ color: BRAND.navy }}>
            Cuatro etapas.{' '}
            <span style={{ color: BRAND.blue }}>Un mismo método.</span>
          </h2>
          <p className="kova-text-body leading-relaxed mx-auto" style={{ color: KOVA.body }}>
            Un vistazo al proceso. El detalle completo está en cómo trabajamos.
          </p>
        </header>

        <div
          className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-7 sm:mb-8"
          style={{
            background: KOVA.white,
            border: '1px solid #C5D4F0',
            boxShadow: '0 12px 40px rgba(26, 63, 170, 0.1), 0 2px 8px rgba(15, 31, 61, 0.04)',
          }}
        >
          <div
            className="h-1"
            style={{
              background: `linear-gradient(90deg, ${BRAND.blue} 0%, ${BRAND.blueMid} 50%, ${BRAND.green} 100%)`,
            }}
            aria-hidden
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y lg:divide-y-0 lg:divide-x divide-[#E8ECF2]">
            {pasos.map((paso, i) => (
              <Fragment key={paso.title}>
                <PasoColumn
                  {...paso}
                  accent={accentCycle[i % accentCycle.length]}
                  showArrow={i < pasos.length - 1}
                />
              </Fragment>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            to="/como-trabajamos"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blueMid})`,
              boxShadow: '0 4px 14px rgba(26, 63, 170, 0.28)',
            }}
          >
            Ver metodología completa
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
          </Link>
        </div>
      </div>
    </section>
  );
}
