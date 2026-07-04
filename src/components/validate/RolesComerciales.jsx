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
    <section id="roles" className="relative pt-10 pb-6 lg:pt-14 lg:pb-10 px-5 sm:px-6 lg:px-8 border-t" style={{ background: KOVA.surface, borderColor: KOVA.border }}>
      <div className="absolute inset-x-0 top-0 flex h-[3px]" aria-hidden>
        <span className="flex-1" style={{ background: BRAND.blue }} />
        <span className="flex-1" style={{ background: BRAND.green }} />
        <span className="flex-1" style={{ background: BRAND.coral }} />
      </div>

      <div ref={ref} className="max-w-6xl mx-auto">
        <header className="text-center max-w-2xl mx-auto mb-5 sm:mb-7 lg:mb-8">
          <p className="kova-eyebrow-pill mb-3 sm:mb-4 mx-auto w-fit text-[10px] sm:text-xs">
            Diseñado para cualquier rol comercial
          </p>
          <h2
            className="font-heading font-bold tracking-tight mb-3 sm:mb-4 text-balance px-1 kova-text-h2-section"
            style={{ color: BRAND.navy }}
          >
            <span className="sm:hidden">
              De representantes a{' '}
              <span style={{ color: BRAND.blue }}>líderes </span>
              <span style={{ color: BRAND.coral }}>comerciales</span>
            </span>
            <span className="hidden sm:inline">
              De representantes de desarrollo de ventas a{' '}
              <span style={{ color: BRAND.blue }}>líderes </span>
              <span style={{ color: BRAND.coral }}>comerciales</span>
            </span>
          </h2>
          <p
            className="text-[13px] sm:text-sm lg:text-base max-w-md sm:max-w-none mx-auto px-1"
            style={{ color: KOVA.body, lineHeight: 1.6 }}
          >
            Cada candidato se evalúa con precisión según los requisitos de su vacante.
          </p>
        </header>

        <div
          className="rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 bg-white"
          style={{
            border: `1px solid #C5D4F0`,
            boxShadow: '0 8px 32px rgba(26, 63, 170, 0.08)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 items-stretch">
            {roles.map(({ title, desc }, i) => {
              const accent = roleAccents[i];
              return (
                <article
                  key={title}
                  className="kova-role-card-light rounded-xl px-3.5 py-3.5 sm:px-4 sm:py-4 lg:py-5 flex flex-col gap-1.5 sm:gap-2 min-w-0 h-full"
                  style={{
                    borderColor: `${accent}33`,
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.4s ease ${60 + i * 40}ms, border-color 0.2s ease, box-shadow 0.2s ease`,
                  }}
                  onMouseEnter={(e) => {
                    if (!window.matchMedia('(hover: hover)').matches) return;
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
                  <h3
                    className="text-[13px] sm:text-[13px] lg:text-sm font-semibold leading-snug"
                    style={{ color: BRAND.navy }}
                  >
                    {title}
                  </h3>
                  <p className="text-xs sm:text-[13px] leading-snug" style={{ color: KOVA.body, lineHeight: 1.55 }}>
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
