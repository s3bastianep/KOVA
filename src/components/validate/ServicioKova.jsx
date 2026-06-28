import {
  ArrowRight,
  FileText,
  GraduationCap,
  Search,
  Target,
} from 'lucide-react';
import SectionHeader from '@/components/landing/SectionHeader';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const pilares = [
  {
    step: '01',
    icon: Search,
    title: 'Selección conducida por especialista',
    subtitle: 'Un consultor dedicado por vacante, de principio a fin.',
    body:
      'Definimos el perfil ideal, buscamos talento comercial activamente y evaluamos con instrumentos ajustados al cargo. Su equipo recibe una terna lista para decidir.',
    accent: BRAND.blue,
  },
  {
    step: '02',
    icon: Target,
    title: 'Evaluación por competencias comerciales',
    subtitle: 'Medir lo que el puesto exige, no lo que un test genérico asume.',
    body:
      'Marco de competencias para su vacante: entrevista por competencias, simulaciones comerciales y psicometría cuando el rol lo requiere. Mismo estándar para todos.',
    accent: BRAND.green,
  },
  {
    step: '03',
    icon: FileText,
    title: 'Informe comparativo documentado',
    subtitle: 'Decida en equipo con el mismo sustento.',
    body:
      'Tres perfiles rankeados con puntaje por competencia, evidencia de cada calificación y recomendación del evaluador. Comparación objetiva, no subjetiva.',
    accent: BRAND.blueMid,
  },
  {
    step: '04',
    icon: GraduationCap,
    title: 'Onboarding comercial especializado',
    subtitle: 'La contratación no termina con la oferta.',
    body:
      'Acompañamos la integración del candidato con inducción y capacitación comercial alineadas a su operación. Menos tiempo hasta la productividad.',
    accent: BRAND.green,
  },
];

function TimelineStep({ step, icon: Icon, title, subtitle, body, accent, id, isLast }) {
  return (
    <div className="relative flex gap-5 lg:gap-8">
      {/* Línea vertical + nodo */}
      <div className="flex flex-col items-center flex-shrink-0 w-10 lg:w-12">
        <div
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center z-10 ring-4 ring-white"
          style={{ background: accent }}
        >
          <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" strokeWidth={2} />
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 min-h-[24px] lg:min-h-[32px] my-1"
            style={{ background: `linear-gradient(to bottom, ${accent}40, ${KOVA.border})` }}
          />
        )}
      </div>

      {/* Tarjeta */}
      <article
        id={id}
        className="flex-1 mb-8 lg:mb-10 last:mb-0 rounded-xl overflow-hidden bg-white"
        style={{
          border: `1px solid ${KOVA.border}`,
          boxShadow: '0 2px 8px rgba(15,31,61,0.04), 0 12px 32px rgba(15,31,61,0.04)',
        }}
      >
        <div className="h-1 w-full" style={{ background: accent }} />
        <div className="p-5 lg:p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <span
              className="text-[11px] font-bold uppercase tracking-[0.14em] tabular-nums"
              style={{ color: accent }}
            >
              Paso {step}
            </span>
            <span
              className="text-4xl lg:text-5xl font-heading font-bold leading-none select-none opacity-[0.07]"
              style={{ color: BRAND.navy, letterSpacing: '-0.04em' }}
              aria-hidden
            >
              {step}
            </span>
          </div>

          <h3 className="text-base lg:text-[17px] font-semibold mb-1 leading-snug pr-8" style={{ color: BRAND.navy }}>
            {title}
          </h3>
          <p className="text-sm font-medium mb-3 leading-snug" style={{ color: accent }}>
            {subtitle}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: KOVA.body, lineHeight: 1.7 }}>
            {body}
          </p>
        </div>
      </article>
    </div>
  );
}

export default function ServicioKova() {
  return (
    <section id="proceso" className="py-16 lg:py-24 px-6 lg:px-8 bg-white border-b" style={{ borderColor: KOVA.border }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-16 items-start mb-14 lg:mb-16">
          {/* Columna izquierda — contexto fijo en desktop */}
          <div className="lg:sticky lg:top-28">
            <SectionHeader
              align="left"
              className="!mb-0 max-w-none"
              eyebrow="El servicio Kova"
              title="De su vacante a la contratación, con criterio en cada paso."
              description="Un especialista conduce el proceso: define el perfil, evalúa candidatos con el mismo estándar y entrega un informe comparativo."
            />

            <div
              className="hidden lg:flex mt-8 items-center gap-2 text-sm font-medium"
              style={{ color: BRAND.blue }}
            >
              <span>4 etapas del proceso</span>
              <ArrowRight className="w-4 h-4" style={{ color: BRAND.green }} />
            </div>
          </div>

          {/* Columna derecha — timeline */}
          <div className="relative">
            {pilares.map((pilar, i) => (
              <TimelineStep
                key={pilar.step}
                {...pilar}
                id={pilar.step === '03' ? 'entregable' : undefined}
                isLast={i === pilares.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
