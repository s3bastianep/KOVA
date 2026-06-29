import { useEffect, useRef, useState } from 'react';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const roleAccents = [BRAND.blue, BRAND.green, BRAND.coral, BRAND.blue, BRAND.green];

const roles = [
  {
    title: 'Representante de desarrollo de ventas',
    desc: 'Prospección saliente y generación de cartera de clientes.',
  },
  {
    title: 'Representante de desarrollo comercial',
    desc: 'Expansión de mercado y desarrollo de alianzas.',
  },
  {
    title: 'Ejecutivo de cuentas',
    desc: 'Gestión integral del ciclo comercial y cierre de transacciones.',
  },
  {
    title: 'Gerente de cuentas',
    desc: 'Retención y crecimiento de clientes.',
  },
  {
    title: 'Líder de ventas',
    desc: 'Impulso de cuotas y rendimiento del equipo.',
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
      { threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export default function RolesComerciales() {
  const { ref, visible } = useReveal();

  return (
    <section id="roles" className="relative py-12 lg:py-16 px-6 lg:px-8" style={{ background: KOVA.paleBlue }}>
      <div className="absolute inset-x-0 top-0 flex h-[3px]" aria-hidden>
        <span className="flex-1" style={{ background: BRAND.blue }} />
        <span className="flex-1" style={{ background: BRAND.green }} />
        <span className="flex-1" style={{ background: BRAND.coral }} />
      </div>

      <div ref={ref} className="max-w-6xl mx-auto">
        <header className="text-center max-w-2xl mx-auto mb-7 lg:mb-8">
          <p className="kova-eyebrow-pill mb-4 mx-auto w-fit">Diseñado para cualquier rol comercial</p>
          <h2
            className="font-heading font-bold tracking-tight mb-4 text-balance"
            style={{
              fontSize: 'clamp(1.625rem, 3vw, 2.25rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: BRAND.navy,
            }}
          >
            De representantes de desarrollo de ventas a{' '}
            <span style={{ color: BRAND.blue }}>líderes </span>
            <span style={{ color: BRAND.coral }}>comerciales</span>
          </h2>
          <div className="flex items-center justify-center gap-1.5 mb-4" aria-hidden>
            <span className="w-8 h-1 rounded-full" style={{ background: BRAND.blue }} />
            <span className="w-8 h-1 rounded-full" style={{ background: BRAND.green }} />
            <span className="w-8 h-1 rounded-full" style={{ background: BRAND.coral }} />
          </div>
          <p className="text-sm lg:text-base" style={{ color: KOVA.body, lineHeight: 1.65 }}>
            Cada candidato se evalúa con precisión según los requisitos de su vacante.
          </p>
        </header>

        <div
          className="rounded-2xl p-4 lg:p-5 bg-white"
          style={{
            border: `1px solid #C5D4F0`,
            boxShadow: '0 8px 32px rgba(26, 63, 170, 0.08)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-visible snap-x snap-mandatory scrollbar-hide">
            {roles.map(({ title, desc }, i) => {
              const accent = roleAccents[i];
              return (
                <article
                  key={title}
                  className="kova-role-card-light flex-shrink-0 w-[188px] sm:w-[200px] lg:w-auto snap-start rounded-xl px-4 py-4 lg:py-5 flex flex-col gap-2"
                  style={{
                    borderColor: `${accent}33`,
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.4s ease ${60 + i * 40}ms, border-color 0.2s ease, box-shadow 0.2s ease`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = accent;
                    e.currentTarget.style.boxShadow = `0 4px 16px ${accent}22`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${accent}33`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span
                    className="w-5 h-0.5 rounded-full mb-0.5 flex-shrink-0"
                    style={{ background: accent }}
                    aria-hidden
                  />
                  <h3 className="text-[13px] lg:text-sm font-semibold leading-snug" style={{ color: BRAND.navy }}>
                    {title}
                  </h3>
                  <p className="text-xs lg:text-[13px] leading-snug" style={{ color: KOVA.muted, lineHeight: 1.55 }}>
                    {desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
