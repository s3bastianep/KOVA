import { SlidersHorizontal, ShieldCheck, BarChart3, CircleDollarSign } from 'lucide-react';
import SectionHeader from '@/components/landing/SectionHeader';

const beneficios = [
  {
    icon: SlidersHorizontal,
    title: 'Evaluación personalizada según el cargo',
    desc: 'Cada vacante tiene su propio marco de competencias. Un SDR no se evalúa igual que un account manager: definimos habilidades, simulaciones y criterios según lo que el rol exige en tu operación.',
    color: '#4338CA',
    bg: '#EEF2FF',
  },
  {
    icon: ShieldCheck,
    title: 'Capacidad real, no solo buena entrevista',
    desc: 'Situaciones comerciales, entrevistas por competencias y el mismo criterio para todos los candidatos. Así ves lo que cada perfil demuestra en escenarios parecidos al día a día del puesto, no solo lo que dice en una conversación.',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: BarChart3,
    title: 'Decisiones basadas en evidencia comparada',
    desc: 'Ranking por coincidencia con el puesto, puntaje por competencia y conclusión del evaluador. Compartes el informe con dirección comercial y talento humano para decidir alineados, con el mismo sustento.',
    color: '#0284C7',
    bg: '#F0F9FF',
  },
  {
    icon: CircleDollarSign,
    title: 'Menos errores de contratación desde el inicio',
    desc: 'Elegir mal en comercial cuesta rotación, capacitación y pipeline perdido. Identificar antes quién encaja de verdad con el rol reduce reemplazos y acelera el impacto en ventas.',
    color: '#D97706',
    bg: '#FFFBEB',
  },
];

const metodos = [
  'Diagnóstico de vacante',
  'Entrevista por competencias',
  'Simulación comercial',
  'Evaluación psicométrica',
  'Ranking comparativo',
  'Informe con conclusión',
];

export default function CapacidadDemostrada() {
  return (
    <section id="evaluacion" className="py-24 lg:py-28 px-6 lg:px-8" style={{ background: '#F8FAFC' }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          align="center"
          className="mb-12 lg:mb-14 max-w-3xl mx-auto"
          eyebrow="Nuestra evaluación"
          title="Evaluaciones personalizadas de habilidades comerciales, diseñadas para cada cargo."
          description="No aplicamos una plantilla genérica. Traducimos tu vacante en competencias concretas, medimos desempeño con el mismo criterio para todos y te entregamos una comparación que puedes defender ante tu equipo."
        />

        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6 mb-12 lg:mb-14">
          {beneficios.map(({ icon: Icon, title, desc, color, bg }) => (
            <article
              key={title}
              className="rounded-2xl p-6 lg:p-7 bg-white h-full"
              style={{ border: '1px solid #E2E8F0' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: bg, border: `1px solid ${color}22` }}
              >
                <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
              </div>
              <h3 className="text-sm font-semibold mb-2 leading-snug" style={{ color: '#0F172A' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#64748B', lineHeight: 1.7 }}>{desc}</p>
            </article>
          ))}
        </div>

        <div
          className="rounded-2xl p-6 lg:p-8 bg-white"
          style={{ border: '1px solid #E2E8F0' }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-1" style={{ color: '#6366F1' }}>
            Instrumentos por vacante
          </p>
          <p className="text-sm mb-4 max-w-2xl" style={{ color: '#64748B', lineHeight: 1.65 }}>
            Seleccionamos y combinamos los métodos según el perfil comercial que buscas. Un especialista conduce el proceso mientras tu equipo sigue operando.
          </p>
          <div className="flex flex-wrap gap-2">
            {metodos.map((m) => (
              <span
                key={m}
                className="text-xs font-medium px-3 py-2 rounded-lg"
                style={{ background: '#F8FAFC', color: '#334155', border: '1px solid #E2E8F0' }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
