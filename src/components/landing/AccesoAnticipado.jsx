import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const reasons = [
  {
    title: 'No se permite adivinar con el currículum.',
    desc: 'Obtenga visibilidad clara sobre el ajuste del candidato, su experiencia comercial y las señales que importan para su modelo de ventas.',
  },
  {
    title: 'Ninguna entrevista desperdiciada.',
    desc: 'Solo se reúne con candidatos previamente evaluados y alineados al perfil que su organización definió.',
  },
  {
    title: 'No confíe en la intuición.',
    desc: 'Un proceso de selección respaldado por datos, evaluación por competencias y recomendación documentada.',
  },
];

const comparisons = [
  {
    old: 'Revisión del currículum y percepción intuitiva',
    kova: 'Evaluación por competencias según los criterios específicos de su modelo de ventas.',
  },
  {
    old: 'Esperar que el candidato sepa vender de verdad.',
    kova: 'Visibilidad sobre la idoneidad comercial del candidato, su experiencia y las señales relevantes para el rol.',
  },
  {
    old: 'Entrevistar a todos los que parezcan adecuados',
    kova: 'Solo se presentan candidatos previamente evaluados y alineados al perfil definido.',
  },
  {
    old: 'Descubrir una mala contratación a los 6 meses',
    kova: 'Tome decisiones de contratación más informadas desde el primer día.',
  },
];

function useRevealStagger() {
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
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function CompareRow({ old, kova, index, visible }) {
  const delay = 80 + index * 70;

  const rowBase =
    'rounded-xl px-3.5 py-3 sm:px-4 sm:py-3.5 lg:px-5 lg:py-4 transition-all duration-200';

  return (
    <div
      className="space-y-2 flex-1 flex flex-col justify-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      <div
        className={`${rowBase} flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3 hover:shadow-sm`}
        style={{ background: KOVA.paleCoral, border: '1px solid #FFD4CF' }}
      >
        <span
          className="self-start text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full whitespace-nowrap order-1 sm:order-2 sm:flex-shrink-0"
          style={{ background: BRAND.coral, color: '#FFFFFF' }}
        >
          Antigua
        </span>
        <p
          className="text-[13px] sm:text-[14px] lg:text-[15px] leading-relaxed line-through flex-1 min-w-0 order-2 sm:order-1"
          style={{ color: '#94A3B8', lineHeight: 1.55 }}
        >
          {old}
        </p>
      </div>
      <div
        className={`${rowBase} flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3 hover:shadow-md hover:-translate-y-px`}
        style={{ background: KOVA.paleBlue, border: '1px solid #C5D4F0' }}
      >
        <span
          className="self-start text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full whitespace-nowrap order-1 sm:order-2 sm:flex-shrink-0"
          style={{ background: BRAND.blue, color: '#FFFFFF' }}
        >
          Kova
        </span>
        <p
          className="text-[13px] sm:text-[14px] lg:text-[15px] font-medium leading-relaxed flex-1 min-w-0 order-2 sm:order-1"
          style={{ color: BRAND.navy, lineHeight: 1.55 }}
        >
          {kova}
        </p>
      </div>
    </div>
  );
}

export default function AccesoAnticipado() {
  const { ref, visible } = useRevealStagger();

  return (
    <section
      id="acceso"
      className="py-10 lg:py-16 px-5 sm:px-6 lg:px-8 relative overflow-hidden bg-white border-t"
      style={{ borderColor: KOVA.border }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 0% 50%, rgba(26,63,170,0.04) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 100% 50%, rgba(0,178,122,0.04) 0%, transparent 60%)',
        }}
        aria-hidden
      />

      <div className="max-w-6xl mx-auto relative">
        <div
          ref={ref}
          className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] gap-6 sm:gap-8 lg:gap-10 xl:gap-12 lg:items-stretch"
        >
          <div className="flex flex-col max-w-xl lg:max-w-none">
            <p className="kova-eyebrow-pill mb-5">¿Por qué elegir Kova?</p>
            <h2 className="font-heading font-bold leading-tight mb-4 text-balance kova-text-h2-section" style={{ color: BRAND.navy }}>
              Por qué las organizaciones eligen Kova
            </h2>
            <p className="kova-text-body leading-relaxed mb-6 lg:mb-7" style={{ color: KOVA.body }}>
              Kova nace para resolver un problema concreto: contratar vendedores con el mismo rigor que exige el
              desempeño comercial. Menos apuestas, más evidencia en cada decisión.
            </p>

            <ul className="space-y-4 lg:flex-1 lg:flex lg:flex-col lg:justify-between lg:gap-4 lg:space-y-0">
              {reasons.map(({ title, desc }, i) => (
                <li
                  key={title}
                  className="flex items-start gap-4 rounded-xl px-4 py-4 lg:px-5 lg:py-5 lg:flex-1"
                  style={{
                    background: KOVA.surface,
                    border: `1px solid ${KOVA.border}`,
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0)' : 'translateX(-10px)',
                    transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 80}ms`,
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: KOVA.paleGreen }}
                  >
                    <Check className="w-4 h-4" style={{ color: BRAND.greenDark }} strokeWidth={2.5} />
                  </span>
                  <div>
                    <p className="text-[15px] lg:text-base font-semibold mb-1 leading-snug" style={{ color: BRAND.navy }}>
                      {title}
                    </p>
                    <p className="text-[14px] leading-relaxed" style={{ color: KOVA.muted, lineHeight: 1.65 }}>
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-7 xl:p-8 flex flex-col h-full"
            style={{
              background: KOVA.white,
              border: `1px solid ${KOVA.border}`,
              boxShadow: '0 12px 40px rgba(15,31,61,0.07)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s ease 60ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) 60ms',
            }}
          >
            <p
              className="text-base lg:text-lg font-semibold mb-5 lg:mb-6 pb-4 lg:pb-5 border-b flex-shrink-0"
              style={{ color: BRAND.navy, borderColor: KOVA.border }}
            >
              Forma antigua frente a Kova
            </p>
            <div className="space-y-4 lg:flex-1 lg:flex lg:flex-col lg:justify-between lg:gap-4 lg:space-y-0">
              {comparisons.map(({ old, kova }, i) => (
                <CompareRow key={old} old={old} kova={kova} index={i} visible={visible} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
