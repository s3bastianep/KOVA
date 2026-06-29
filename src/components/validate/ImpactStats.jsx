import { useEffect, useRef, useState } from 'react';
import { BRAND } from '@/theme/kovaPalette';

const stats = [
  { value: 67, title: 'Reducción de entrevistas por contratación', accent: BRAND.green },
  { value: 92, title: 'Alineación con el perfil comercial', accent: BRAND.green },
  { value: 100, title: 'Criterio de evaluación uniforme', accent: BRAND.green },
  { value: 94, title: 'Retención al primer año', accent: BRAND.green },
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

function StatCard({ value, title, accent, index, active }) {
  const count = useCountUp(value, active);
  const delay = index * 90;

  return (
    <article
      className="kova-stat-card relative rounded-2xl px-4 py-5 lg:px-5 lg:py-6 flex flex-col items-center text-center overflow-hidden"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      <span
        className="absolute top-0 inset-x-0 h-[3px] rounded-t-2xl"
        style={{ background: accent }}
        aria-hidden
      />
      <div className="flex items-baseline gap-0.5 mb-3">
        <span
          className="font-heading font-bold tabular-nums leading-none text-white"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 3.25rem)', letterSpacing: '-0.04em' }}
        >
          {count}
        </span>
        <span className="text-xl font-semibold tabular-nums" style={{ color: accent }}>
          %
        </span>
      </div>
      <div
        className="w-full max-w-[120px] h-1 rounded-full mb-5 overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: active ? `${value}%` : '0%',
            background: accent,
            transition: `width 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${delay + 200}ms`,
          }}
        />
      </div>
      <p
        className="text-[13px] lg:text-sm font-medium leading-snug max-w-[12rem]"
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
    <section className="relative py-12 lg:py-16 px-6 lg:px-8 overflow-hidden kova-section-results">
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full kova-results-orb-a"
        style={{ background: 'radial-gradient(circle, rgba(255,59,48,0.12) 0%, transparent 70%)' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-16 w-80 h-80 rounded-full kova-results-orb-b"
        style={{ background: 'radial-gradient(circle, rgba(45,91,227,0.14) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div ref={ref} className="max-w-5xl mx-auto relative">
        <header
          className="text-center max-w-2xl mx-auto mb-8 lg:mb-9"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <p className="kova-eyebrow-results mb-5 mx-auto w-fit">Resultados con evidencia</p>
          <h2
            className="font-heading font-bold text-white text-balance mb-4"
            style={{
              fontSize: 'clamp(1.625rem, 2.8vw, 2.125rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            Resultados reales para equipos de selección comercial
          </h2>
          <p className="text-sm lg:text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)', lineHeight: 1.7 }}>
            Metodología estructurada con criterio uniforme, evidencia documentada y evaluación diseñada para talento
            comercial.
          </p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.title} {...stat} index={i} active={visible} />
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
