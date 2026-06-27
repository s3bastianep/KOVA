import {
  Target,
  MessageSquare,
  Mic,
  Brain,
  BarChart3,
  FileText,
} from 'lucide-react';
import SectionHeader from '@/components/landing/SectionHeader';

const metodos = [
  {
    icon: Target,
    title: 'Definición del perfil',
    desc: 'Definimos competencias, contexto comercial y criterios de éxito antes de evaluar a nadie.',
    color: '#4338CA',
    bg: '#EEF2FF',
  },
  {
    icon: MessageSquare,
    title: 'Entrevista por competencias',
    desc: 'Profundizamos en prospección, cierre, manejo de objeciones y estilo de venta según el rol.',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: Mic,
    title: 'Simulación de escenarios',
    desc: 'El candidato resuelve situaciones comerciales reales: llamada, reunión, negociación o seguimiento.',
    color: '#D97706',
    bg: '#FFFBEB',
  },
  {
    icon: Brain,
    title: 'Evaluación psicométrica comercial',
    desc: 'Pruebas alineadas al perfil del rol, no cuestionarios genéricos de recursos humanos.',
    color: '#0284C7',
    bg: '#F0F9FF',
  },
  {
    icon: BarChart3,
    title: 'Ranking comparativo',
    desc: 'Todos los candidatos en la misma escala. Ves quién cumple más con las habilidades del puesto.',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    icon: FileText,
    title: 'Informe con conclusión',
    desc: 'Terna documentada para que dirección comercial y talento humano decidan con el mismo sustento.',
    color: '#4338CA',
    bg: '#EEF2FF',
  },
];

export default function MetodosEvaluacion() {
  return (
    <section id="evaluacion" className="py-24 lg:py-28 px-6 lg:px-8 relative overflow-hidden" style={{ background: '#F8FAFC' }}>
      <div
        className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', transform: 'translate(-30%, -40%)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader
          eyebrow="Cómo evaluamos"
          title="Evidencia concreta en cada etapa del proceso."
          description="Combinamos métodos estructurados para medir capacidad comercial real. Sin pruebas genéricas ni decisiones basadas solo en la entrevista."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {metodos.map(({ icon: Icon, title, desc, color, bg }) => (
            <article
              key={title}
              className="rounded-2xl p-6 bg-white transition-shadow hover:shadow-md"
              style={{ border: '1px solid #E2E8F0' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: bg, border: `1px solid ${color}22` }}
              >
                <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
              </div>
              <h3 className="font-heading font-semibold text-sm mb-2" style={{ color: '#0F172A' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#64748B', lineHeight: 1.7 }}>{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
