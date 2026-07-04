import { AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const points = [
  {
    title: 'Los currículums no revelan quién sabe vender realmente.',
    desc: 'Para encontrar al candidato ideal para el puesto, se requiere un proceso de selección más exhaustivo.',
  },
  {
    title: 'Las entrevistas premian la confianza, no la capacidad.',
    desc: 'Los mejores entrevistadores no siempre son los mejores vendedores.',
  },
  {
    title: 'Cada contratación se siente como una apuesta.',
    desc: 'Es difícil predecir el éxito de ventas basándose únicamente en currículums, entrevistas e intuición.',
  },
  {
    title: 'El costo de equivocarse es enorme.',
    desc: 'Tiempo de ramp-up, pérdida de ingresos y costos de contratación. Una mala contratación retrasa meses a su equipo.',
  },
];

const costSignals = [
  {
    icon: Clock,
    title: 'Ramp-up perdido',
    desc: 'Meses formando a alguien que no encaja con su ciclo comercial ni con el perfil del cargo.',
  },
  {
    icon: TrendingDown,
    title: 'Pipeline estancado',
    desc: 'Vacantes abiertas demasiado tiempo mientras el equipo comercial asume la carga.',
  },
  {
    icon: AlertTriangle,
    title: 'Rotación temprana',
    desc: 'Contrataciones que no duran: el costo se multiplica en reclutamiento, formación y oportunidad perdida.',
  },
];

function ProblemPoint({ title, desc }) {
  return (
    <article className="flex gap-4 items-start">
      <span
        className="w-[3px] rounded-full shrink-0 mt-1"
        style={{ height: '2.75rem', background: BRAND.coral }}
        aria-hidden
      />
      <div className="min-w-0 flex-1 pt-0.5">
        <h3 className="text-[15px] sm:text-base font-semibold mb-1.5 leading-snug" style={{ color: BRAND.navy }}>
          {title}
        </h3>
        <p className="text-sm sm:text-[15px] leading-relaxed" style={{ color: KOVA.muted, lineHeight: 1.65 }}>
          {desc}
        </p>
      </div>
    </article>
  );
}

function CostSignal({ icon: Icon, title, desc }) {
  return (
    <li className="flex gap-3.5 items-start">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.22)' }}
      >
        <Icon className="w-[18px] h-[18px]" style={{ color: BRAND.coral }} strokeWidth={2.1} />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm font-semibold text-white mb-1 leading-snug">{title}</p>
        <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)' }}>
          {desc}
        </p>
      </div>
    </li>
  );
}

export default function Problema() {
  return (
    <section id="problema" className="py-10 lg:py-16 px-5 sm:px-6 lg:px-8 bg-white border-b" style={{ borderColor: KOVA.border }}>
      <div className="kova-page-container">
        <div className="kova-rail-grid kova-rail-grid--start">
          {/* Columna izquierda: encabezado + puntos */}
          <div>
            <header className="mb-7 sm:mb-8 lg:mb-9">
              <p className="kova-eyebrow-pill kova-eyebrow-coral mb-3 sm:mb-4">El problema</p>
              <h2 className="font-heading font-bold leading-tight text-balance max-w-xl kova-text-h2-section" style={{ color: BRAND.navy }}>
                La contratación de talento comercial es diferente.
              </h2>
            </header>

            <div className="flex flex-col gap-5 sm:gap-6">
              {points.map(({ title, desc }) => (
                <ProblemPoint key={title} title={title} desc={desc} />
              ))}
            </div>
          </div>

          {/* Columna derecha: tarjeta centrada en el rail */}
          <aside
            className="rounded-2xl p-6 sm:p-7 lg:p-8 w-full max-w-[360px] lg:w-[360px] lg:justify-self-center lg:sticky lg:top-24 flex flex-col mx-auto lg:mx-0"
            style={{
              background: 'linear-gradient(168deg, #0F1F3D 0%, #121E32 50%, #152238 100%)',
              boxShadow: '0 12px 40px rgba(15,31,61,0.14)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Lo que está en juego
            </p>
            <p className="text-lg sm:text-xl font-semibold text-white leading-snug mb-6 sm:mb-7">
              Una mala contratación comercial cuesta más que un salario mal invertido.
            </p>

            <ul className="flex flex-col gap-5 sm:gap-6">
              {costSignals.map((signal) => (
                <CostSignal key={signal.title} {...signal} />
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
