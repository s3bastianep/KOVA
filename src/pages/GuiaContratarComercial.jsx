import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2, BookOpen } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const issues = [
  {
    num: '01',
    title: 'Roles mal definidos',
    problem: 'Sin claridad sobre responsabilidades y expectativas, es imposible saber si un candidato encaja. Eso genera confusión en el desempeño y falta de accountability desde el primer día.',
    solution: 'Kova empieza mapeando la vacante: contexto comercial, tipo de venta y criterios de éxito antes de evaluar a nadie.',
  },
  {
    num: '02',
    title: 'Caer en el buen discurso',
    problem: 'Los comerciales saben venderse en la entrevista. Un buen rapport no demuestra que puedan prospectar, manejar objeciones o cerrar en tu mercado.',
    solution: 'Evaluamos habilidades comerciales demostradas, no solo lo que el candidato dice que puede hacer.',
  },
  {
    num: '03',
    title: 'Mirar solo el currículum',
    problem: 'Priorizar títulos, empresas anteriores o años de experiencia no garantiza desempeño. A menudo se pasa por alto talento con el perfil comercial correcto.',
    solution: 'Definimos competencias clave por vacante y comparamos candidatos con criterio objetivo, alineado al rol real.',
  },
  {
    num: '04',
    title: 'Alta rotación por mala contratación',
    problem: 'La rotación en ventas puede triplicar la de otros roles. Contratar mal significa meses perdidos, pipeline estancado y costos de reemplazo.',
    solution: 'Entregamos una terna argumentada con sustento para que decidas con más certeza y reduzcas errores de contratación.',
  },
  {
    num: '05',
    title: 'Evaluaciones genéricas de RH',
    problem: 'Tests de personalidad o evaluaciones estándar no miden venta consultiva, prospección ni manejo de objeciones. El candidato parece apto, pero no lo es para comercial.',
    solution: 'Nuestra metodología está diseñada exclusivamente para selección comercial: competencias, comparación y recomendación especializada.',
  },
];

const skills = [
  {
    title: 'Construcción de relaciones',
    desc: 'Entender necesidades del cliente, generar confianza y construir relaciones comerciales sostenibles.',
  },
  {
    title: 'Orientación a resultados',
    desc: 'Prospectar, negociar y cerrar con foco en metas comerciales y cuota.',
  },
  {
    title: 'Comunicación efectiva',
    desc: 'Escuchar activamente, presentar propuestas de valor y manejar objeciones con claridad.',
  },
  {
    title: 'Gestión del tiempo',
    desc: 'Priorizar oportunidades, hacer seguimiento y coordinar el pipeline con eficiencia.',
  },
  {
    title: 'Resiliencia comercial',
    desc: 'Mantener motivación ante rechazos, aprender de cada ciclo y sostener desempeño bajo presión.',
  },
  {
    title: 'Aprendizaje continuo',
    desc: 'Adaptarse a productos, mercados y técnicas de venta en entornos que cambian rápido.',
  },
];

export default function GuiaContratarComercial() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="pt-28 pb-16 lg:pt-32 lg:pb-20" style={{ background: '#FAFBFF' }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors hover:opacity-80"
            style={{ color: '#64748B' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[11px] font-semibold"
            style={{ background: '#FFFFFF', color: '#4338CA', border: '1px solid #E0E7FF' }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Recursos · Selección comercial
          </div>

          <h1
            className="font-heading font-bold mb-6"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', lineHeight: 1.12, color: '#0F172A' }}
          >
            5 problemas al contratar comercial y cómo resolverlos
          </h1>

          <p className="text-base lg:text-lg leading-relaxed mb-4" style={{ color: '#64748B', lineHeight: 1.8 }}>
            Contratar vendedores no debería depender de intuición ni de quién mejor se vende en la entrevista. Las vacantes comerciales están entre las más difíciles de llenar porque el proceso tradicional no demuestra quién realmente puede desempeñar el rol.
          </p>
          <p className="text-base leading-relaxed" style={{ color: '#64748B', lineHeight: 1.8 }}>
            En Kova vemos estos cinco problemas una y otra vez. Aquí te explicamos por qué ocurren y cómo abordarlos con selección basada en competencias.
          </p>
        </div>
      </article>

      <section className="py-16 lg:py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-xl mb-4" style={{ color: '#0F172A' }}>
            ¿Por qué es tan difícil contratar comercial?
          </h2>
          <p className="text-base leading-relaxed mb-6" style={{ color: '#64748B', lineHeight: 1.8 }}>
            Sin un equipo comercial sólido, la calidad del producto importa poco. Pero las posiciones de venta enfrentan presión constante por generar ingresos, y los métodos habituales (entrevistas, hojas de vida, referencias) rara vez prueban desempeño real.
          </p>
          <p className="text-base leading-relaxed" style={{ color: '#64748B', lineHeight: 1.8 }}>
            El resultado: contrataciones costosas, rotación elevada y equipos que tardan meses en ser productivos. La buena noticia es que cada uno de estos problemas tiene una solución concreta cuando el proceso está diseñado para ventas.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 px-6 lg:px-8" style={{ background: '#F8FAFC' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading font-bold text-xl mb-10 text-center" style={{ color: '#0F172A' }}>
            Los 5 problemas más comunes
          </h2>

          <div className="space-y-6">
            {issues.map(({ num, title, problem, solution }) => (
              <article key={num} className="kova-card rounded-2xl overflow-hidden">
                <div className="p-6 lg:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <span
                      className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg text-xs font-bold text-white"
                      style={{ background: '#4338CA' }}
                    >
                      {num}
                    </span>
                    <h3 className="font-heading font-semibold text-lg leading-snug pt-1" style={{ color: '#0F172A' }}>
                      {title}
                    </h3>
                  </div>
                  <p className="text-base leading-relaxed pl-[52px]" style={{ color: '#64748B', lineHeight: 1.75 }}>
                    {problem}
                  </p>
                </div>
                <div
                  className="px-6 lg:px-8 py-5 flex items-start gap-3"
                  style={{ background: '#F8FAFF', borderTop: '1px solid #E0E7FF' }}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: '#4338CA' }} strokeWidth={2} />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#6366F1' }}>
                      Cómo lo resuelve Kova
                    </p>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: '#334155', lineHeight: 1.7 }}>
                      {solution}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-xl mb-4" style={{ color: '#0F172A' }}>
            ¿Es la selección por competencias la respuesta?
          </h2>
          <p className="text-base leading-relaxed mb-6" style={{ color: '#64748B', lineHeight: 1.8 }}>
            Sí, cuando está diseñada para ventas. La selección basada en competencias no se trata de descartar candidatos por su historial, sino de medir si pueden hacer el trabajo: prospectar, comunicar valor, manejar objeciones y cerrar en tu contexto.
          </p>
          <p className="text-base leading-relaxed" style={{ color: '#64748B', lineHeight: 1.8 }}>
            Kova aplica este enfoque de forma especializada: diagnosticamos la vacante, evaluamos competencias comerciales y entregamos un informe comparativo para que dirección comercial y talento humano decidan con el mismo criterio.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 px-6 lg:px-8" style={{ background: '#F8FAFC' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading font-bold text-xl mb-3 text-center" style={{ color: '#0F172A' }}>
            6 competencias clave al contratar comercial
          </h2>
          <p className="text-base text-center mb-10 max-w-2xl mx-auto" style={{ color: '#64748B', lineHeight: 1.75 }}>
            Independientemente del rol (SDR, ejecutivo, account manager o director comercial), estas son las capacidades que Kova evalúa en cada vacante.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {skills.map(({ title, desc }) => (
              <div key={title} className="kova-card rounded-xl p-5 lg:p-6">
                <h3 className="font-heading font-semibold text-sm mb-2" style={{ color: '#0F172A' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748B', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 px-6 lg:px-8" style={{ background: '#0F172A' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-4" style={{ color: '#A5B4FC' }}>
            Próximo paso
          </p>
          <h2 className="font-heading font-bold text-2xl lg:text-3xl text-white mb-5 leading-tight" style={{ letterSpacing: '-0.02em' }}>
            Deja de contratar comercial a ciegas.
          </h2>
          <p className="text-base mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>
            Agenda un diagnóstico comercial sin costo. Te orientamos sobre tu vacante y cómo evaluar candidatos con criterio especializado.
          </p>
          <Link
            to="/#acceso"
            className="group inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all text-white hover:opacity-95"
            style={{ background: '#4338CA', boxShadow: '0 4px 14px rgba(67,56,202,0.35)' }}
          >
            Agendar diagnóstico comercial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
