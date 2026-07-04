import { useEffect, useRef, useState } from 'react';
import { ClipboardCheck, Compass, FileText, Users } from 'lucide-react';
import { BRAND } from '@/theme/kovaPalette';

const entregables = [
  {
    icon: Compass,
    title: 'Discovery comercial',
    desc: 'Perfil ideal, competencias y criterios de éxito definidos antes de abrir la búsqueda.',
  },
  {
    icon: ClipboardCheck,
    title: 'Evaluación uniforme',
    desc: 'Cada candidato pasa por el mismo marco de competencias, sin criterios cambiantes.',
  },
  {
    icon: FileText,
    title: 'Informe con evidencia',
    desc: 'Puntajes, observaciones y conclusión del evaluador documentados por candidato.',
  },
  {
    icon: Users,
    title: 'Terna comparada',
    desc: 'Ranking final listo para decidir en equipo, con respaldo claro por perfil.',
  },
];

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

function EntregableCard({ icon: Icon, title, desc, active }) {
  return (
    <article
      className="kova-stat-card relative px-4 py-6 sm:px-5 sm:py-7 lg:py-8 flex flex-col items-center text-center h-full min-h-0 sm:min-h-[196px]"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <span
        className="absolute top-0 inset-x-0 h-[3px]"
        style={{ background: BRAND.green }}
        aria-hidden
      />
      <div
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
        style={{
          background: 'rgba(0, 178, 122, 0.12)',
          border: '1px solid rgba(0, 178, 122, 0.28)',
        }}
      >
        <Icon className="w-5 h-5" style={{ color: BRAND.green }} strokeWidth={2.25} />
      </div>
      <h3 className="font-heading font-semibold text-[15px] sm:text-base text-white mb-2 leading-snug">
        {title}
      </h3>
      <div className="w-8 h-0.5 rounded-full mb-3 flex-shrink-0" style={{ background: BRAND.green }} />
      <p
        className="text-xs sm:text-[13px] lg:text-sm font-medium leading-relaxed max-w-[15rem] sm:max-w-[12.5rem]"
        style={{ color: 'rgba(255,255,255,0.72)' }}
      >
        {desc}
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
          <p className="kova-eyebrow-results mb-4 sm:mb-5 mx-auto w-fit">Entregables del proceso</p>
          <h2 className="font-heading font-bold text-white text-balance mb-3 sm:mb-4 kova-text-h2" style={{ lineHeight: 1.2 }}>
            Valor concreto para equipos de selección comercial
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
          {entregables.map((item) => (
            <EntregableCard key={item.title} {...item} active={visible} />
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
          Metodología aplicada en procesos de selección comercial B2B con evaluación por competencias
        </p>
      </div>
    </section>
  );
}
