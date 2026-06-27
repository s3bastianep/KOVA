import { ArrowRight, CheckCircle2, FileSearch, BarChart3, ClipboardCheck, Users2 } from 'lucide-react';
import SectionHeader from '@/components/landing/SectionHeader';
import EntregableReportMockup from '@/components/validate/EntregableReportMockup';

const entregables = [
  {
    icon: FileSearch,
    title: 'Diagnóstico de vacante',
    desc: 'Definimos competencias, contexto comercial y criterios de éxito del rol antes de evaluar candidatos.',
  },
  {
    icon: BarChart3,
    title: 'Evaluación comparativa',
    desc: 'Ranking con puntaje por competencia. Ves quién destaca y por qué, con el mismo criterio para todos.',
  },
  {
    icon: ClipboardCheck,
    title: 'Recomendación argumentada',
    desc: 'Terna final con sustento documentado para que elijas al talento ideal con confianza, no con corazonada.',
  },
  {
    icon: Users2,
    title: 'Informe para decidir en equipo',
    desc: 'Formato pensado para que dirección comercial y talento humano hablen el mismo idioma.',
  },
];

const outcomes = [
  { value: '3', label: 'Candidatos comparados' },
  { value: '1', label: 'Informe unificado' },
  { value: 'B2B', label: 'Enfoque especializado' },
];

export default function Entregable() {
  const scrollToAcceso = () => document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="entregable" className="py-24 lg:py-32 px-6 lg:px-8 relative overflow-hidden" style={{ background: '#F8FAFC' }}>
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', transform: 'translate(30%, -40%)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 xl:gap-20 items-center">
          <div>
            <SectionHeader
              align="left"
              className="mb-8 lg:mb-10"
              eyebrow="Qué recibes"
              title="No recibes hojas de vida. Recibes el talento comparado con criterio."
              description="Un entregable concreto que te ayuda a identificar al perfil comercial ideal y alinea a comercial y talento humano en la misma decisión."
            />

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {entregables.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-xl p-4 lg:p-5 bg-white transition-shadow hover:shadow-md"
                  style={{ border: '1px solid #E2E8F0' }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}
                  >
                    <Icon className="w-4 h-4" style={{ color: '#4338CA' }} strokeWidth={2} />
                  </div>
                  <h3 className="font-heading font-semibold text-sm mb-1.5" style={{ color: '#0F172A' }}>{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#64748B', lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>

            <div
              className="flex flex-wrap gap-6 lg:gap-8 mb-8 py-5 px-6 rounded-xl"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              {outcomes.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-heading font-bold text-2xl tabular-nums" style={{ color: '#4338CA' }}>{value}</p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: '#64748B' }}>{label}</p>
                </div>
              ))}
            </div>

            <ul className="space-y-3 mb-8">
              {[
                'Menos rotación por perfiles mal alineados al rol',
                'Decisión documentada que puedes compartir con dirección',
                'Criterio objetivo: dejas de depender solo de la entrevista',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#059669' }} strokeWidth={2.5} />
                  <span className="text-sm font-medium" style={{ color: '#334155', lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={scrollToAcceso}
              className="group inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm text-white transition-all hover:opacity-95"
              style={{ background: '#4338CA', boxShadow: '0 4px 14px rgba(67,56,202,0.28)' }}
            >
              Quiero ver cómo aplicaría a mi vacante
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <EntregableReportMockup />
        </div>
      </div>
    </section>
  );
}
