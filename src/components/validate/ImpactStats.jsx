import { useEffect, useRef, useState } from 'react';
import { BRAND } from '@/theme/kovaPalette';

const stats = [
  { value: 67, title: 'Reducción de entrevistas por contratación' },
  { value: 92, title: 'Alineación con el perfil comercial' },
  { value: 100, title: 'Criterio de evaluación uniforme' },
  { value: 94, title: 'Retención al primer año' },
];

function useCountUp(target, active, duration = 1400) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    let frame = 0;
    let start = 0;

    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return count;
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function StatCard({ value, title, active }) {
  const count = useCountUp(value, active);

  return (
    <article className="kova-stat-card relative px-3 py-5 sm:px-4 sm:py-6 lg:py-7 flex flex-col items-center text-center h-full min-h-0 sm:min-h-[152px]">
      <span
        className="absolute top-0 inset-x-0 h-[3px]"
        style={{ background: BRAND.green }}
        aria-hidden
      />
      <div className="flex items-baseline justify-center gap-0.5 h-12 sm:h-14 mb-2 sm:mb-3">
        <span
          className="font-heading font-bold tabular-nums leading-none text-white kova-text-stat"
        >
          {count}
        </span>
        <span className="text-sm font-semibold tabular-nums" style={{ color: BRAND.green }}>
          %
        </span>
      </div>
      <div className="w-8 h-0.5 rounded-full mb-3 sm:mb-4 flex-shrink-0" style={{ background: BRAND.green }} />
      <p
        className="text-xs sm:text-[13px] lg:text-sm font-medium leading-snug max-w-[14rem] sm:max-w-[11.5rem]"
        style={{ color: 'rgba(255,255,255,0.82)' }}
      >
        {title}
      </p>
    </article>
  );
}

export default function ImpactStats() {
  const { ref, visible } = useReveal();

  return (
    <section className="relative py-10 lg:py-16 px-5 sm:px-6 lg:px-8 overflow-hidden kova-section-results">
      <div
        className="pointer-events-none absolute -bottom-20 -right-16 w-80 h-80 rounded-full kova-results-orb-b"
        style={{ background: 'radial-gradient(circle, rgba(0,178,122,0.1) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div ref={ref} className="max-w-6xl mx-auto relative">
        <header
          className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-9 px-0.5"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          <p className="kova-eyebrow-results mb-4 sm:mb-5 mx-auto w-fit">Resultados con evidencia</p>
          <h2 className="font-heading font-bold text-white text-balance mb-3 sm:mb-4 kova-text-h2" style={{ lineHeight: 1.2 }}>
            Resultados reales para equipos de selección comercial
          </h2>
          <p className="kova-text-body leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)' }}>
            Metodología estructurada con criterio uniforme, evidencia documentada y evaluación diseñada para talento
            comercial.
          </p>
        </header>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-xl sm:rounded-2xl overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] items-stretch"
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.5s ease 80ms',
          }}
        >
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} active={visible} />
          ))}
        </div>

        <p
          className="text-center text-[11px] mt-6 lg:mt-7 tracking-wide"
          style={{
            color: 'rgba(255,255,255,0.35)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.5s ease 400ms',
          }}
        >
          Indicadores referenciales de procesos de selección comercial B2B con evaluación por competencias
        </p>
      </div>
    </section>
  );
}
