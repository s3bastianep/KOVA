import { useEffect, useRef, useState } from 'react';
import { Users } from 'lucide-react';
import SectionHeader from '@/components/landing/SectionHeader';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const roles = [
  'Desarrollo de ventas (SDR / BDR)',
  'Ejecutivo comercial',
  'Servicio al cliente',
  'Gerente de cuentas',
  'Gerente comercial',
  'Director comercial',
];

const stats = [
  {
    value: 67,
    title: 'Reducción de entrevistas por contratación',
    description:
      'Al presentar una terna con candidatos previamente evaluados por competencias.',
    accent: BRAND.green,
  },
  {
    value: 92,
    title: 'Alineación con el perfil comercial',
    description:
      'Coincidencia del candidato recomendado con el perfil definido para la vacante.',
    accent: BRAND.blue,
  },
  {
    value: 100,
    title: 'Criterio de evaluación uniforme',
    description:
      'Mismo estándar aplicado a todos los candidatos. Comparación objetiva, no subjetiva.',
    accent: BRAND.green,
  },
  {
    value: 94,
    title: 'Retención al primer año',
    description:
      'Superior al promedio del mercado comercial cuando la contratación se basa en competencias medidas.',
    accent: BRAND.blueMid,
  },
];

function StatCard({ value, title, description, accent, animate }) {
  return (
    <article
      className="relative flex flex-col h-full px-5 py-6 lg:px-6 lg:py-7
        border-b last:border-b-0 border-[#E2E6ED]
        sm:border-b-0 sm:[&:nth-child(-n+2)]:border-b sm:[&:nth-child(odd)]:border-r
        lg:[&:nth-child(-n+2)]:border-b-0 lg:border-r lg:last:border-r-0"
    >
      <div className="flex items-baseline gap-0.5 mb-4">
        <span
          className="font-heading font-bold tabular-nums leading-none"
          style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: BRAND.navy, letterSpacing: '-0.03em' }}
        >
          {value}
        </span>
        <span className="text-lg font-semibold tabular-nums" style={{ color: accent }}>
          %
        </span>
      </div>

      <div
        className="h-1 rounded-full mb-5 overflow-hidden"
        style={{ background: KOVA.border }}
        role="presentation"
      >
        <div
          className="h-full rounded-full"
          style={{
            width: animate ? `${value}%` : '0%',
            background: accent,
            transition: 'width 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </div>

      <h3 className="text-sm font-semibold mb-2 leading-snug" style={{ color: BRAND.navy }}>
        {title}
      </h3>
      <p className="text-[13px] leading-relaxed flex-1" style={{ color: KOVA.body, lineHeight: 1.65 }}>
        {description}
      </p>
    </article>
  );
}

export default function ImpactStats() {
  const gridRef = useRef(null);
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBarsVisible(true);
      return;
    }
    const node = gridRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBarsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="py-12 lg:py-16 px-6 lg:px-8 border-b"
      style={{ background: KOVA.surface, borderColor: KOVA.border }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          align="center"
          className="mb-8 lg:mb-10 max-w-2xl"
          eyebrow="Impacto medible"
          title="Metodología probada. Resultados que hablan por sí solos."
        />

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-xl overflow-hidden bg-white"
          style={{ border: `1px solid ${KOVA.border}`, boxShadow: '0 1px 3px rgba(15,31,61,0.04)' }}
        >
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} animate={barsVisible} />
          ))}
        </div>

        <div
          className="mt-6 rounded-xl overflow-hidden bg-white px-5 py-5 lg:px-8 lg:py-6"
          style={{ border: `1px solid ${KOVA.border}`, boxShadow: '0 1px 3px rgba(15,31,61,0.04)' }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-5 text-center"
            style={{ color: BRAND.blue }}
          >
            Roles que cubrimos
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 list-none p-0 m-0">
            {roles.map((rol) => (
              <li
                key={rol}
                className="flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-lg"
                style={{
                  color: BRAND.navy,
                  background: KOVA.surface,
                  border: `1px solid ${KOVA.border}`,
                }}
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: KOVA.paleGreen }}
                >
                  <Users className="w-3.5 h-3.5" style={{ color: BRAND.green }} strokeWidth={2} />
                </span>
                <span className="leading-snug">{rol}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
