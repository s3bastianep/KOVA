import { CheckCircle2 } from 'lucide-react';
import SectionHeader from '@/components/landing/SectionHeader';

const pilares = [
  {
    title: 'Especialización comercial',
    desc: 'Contratamos exclusivamente en áreas comerciales. Conocemos los roles, ciclos de venta y competencias que definen el desempeño en cada puesto.',
  },
  {
    title: 'Evaluación por cargo, no plantillas',
    desc: 'Cada vacante tiene su marco de competencias. Definimos qué medir y cómo medirlo según el perfil que necesitas cubrir.',
  },
  {
    title: 'Decisión con respaldo documentado',
    desc: 'Te entregamos una terna comparada con puntajes, evidencia y conclusión del evaluador. Para que elijas con criterio, no con intuición.',
  },
];

const proceso = [
  {
    n: '01',
    title: 'Definimos el perfil ideal',
    desc: 'Definición del perfil ideal, competencias del rol y criterios de éxito.',
  },
  {
    n: '02',
    title: 'Evaluamos con el mismo criterio',
    desc: 'Entrevista por competencias, simulaciones comerciales y evaluación psicométrica según el cargo.',
  },
  {
    n: '03',
    title: 'Recomendamos la terna final',
    desc: 'Ranking comparativo e informe unificado listo para decidir en equipo.',
  },
];

export default function CapacidadDemostrada() {
  return (
    <section id="evaluacion" className="py-24 lg:py-28 px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <div>
            <SectionHeader
              align="left"
              className="mb-8 lg:mb-10 max-w-none"
              eyebrow="Especialistas en contratación comercial"
              title="Contratamos talento comercial midiendo lo que el cargo exige."
              description="Somos una firma dedicada a encontrar y evaluar perfiles comerciales. Un especialista conduce tu vacante, diseña la evaluación según el rol y te entrega una terna lista para decidir."
            />

            <ul className="space-y-5">
              {pilares.map(({ title, desc }) => (
                <li key={title} className="flex gap-3.5">
                  <CheckCircle2
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: '#4338CA' }}
                    strokeWidth={2.25}
                  />
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>{title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748B', lineHeight: 1.7 }}>{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-2xl p-6 lg:p-8"
            style={{ background: '#FAFBFF', border: '1px solid #E2E8F0' }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: '#64748B' }}>
              Cómo trabajamos cada vacante
            </p>

            <ol className="space-y-0">
              {proceso.map(({ n, title, desc }, i) => (
                <li key={n} className="flex gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold tabular-nums"
                      style={{ background: '#EEF2FF', color: '#4338CA' }}
                    >
                      {n}
                    </span>
                    {i < proceso.length - 1 && (
                      <div className="w-px flex-1 min-h-[2rem] my-1" style={{ background: '#E2E8F0' }} />
                    )}
                  </div>
                  <div className={i < proceso.length - 1 ? 'pb-6' : ''}>
                    <p className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>{title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748B', lineHeight: 1.65 }}>{desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E2E8F0' }}>
              <p className="text-xs leading-relaxed" style={{ color: '#64748B', lineHeight: 1.65 }}>
                <span className="font-semibold" style={{ color: '#334155' }}>Resultado: </span>
                tres candidatos evaluados con el mismo criterio, comparados entre sí y documentados en un informe unificado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
