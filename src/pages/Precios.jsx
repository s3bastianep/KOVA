import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  ClipboardCheck,
  BarChart3,
  Users,
  Target,
  Shield,
  FileText,
  Handshake,
  Briefcase,
  CheckCircle2,
  UserCheck,
  LineChart,
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const includes = [
  { icon: Target, label: 'Diagnóstico de vacante y perfil ideal' },
  { icon: Search, label: 'Búsqueda activa de talento comercial' },
  { icon: ClipboardCheck, label: 'Evaluación por competencias comerciales' },
  { icon: BarChart3, label: 'Informe comparativo con ranking' },
  { icon: FileText, label: 'Terna argumentada para decidir' },
  { icon: UserCheck, label: 'Especialista dedicado por proyecto' },
  { icon: Briefcase, label: 'Proceso alineado a tu operación comercial' },
  { icon: Users, label: 'Acompañamiento a comercial y talento humano' },
  { icon: Handshake, label: 'Seguimiento hasta la decisión final' },
  { icon: Shield, label: 'Confidencialidad de datos corporativos' },
  { icon: LineChart, label: 'Criterio documentado para cada candidato' },
  { icon: CheckCircle2, label: 'Metodología propia especializada en B2B' },
];

const stats = [
  { value: '100%', label: 'del proceso de reclutamiento a cargo de Kova' },
  { value: '1', label: 'especialista asignado por vacante comercial' },
  { value: '3+', label: 'candidatos comparados con el mismo criterio' },
  { value: '5+', label: 'competencias comerciales evaluadas por rol' },
];

const faqs = [
  {
    q: '¿Cómo funciona la cotización?',
    a: 'Cada vacante comercial es distinta. Después del diagnóstico inicial definimos alcance, perfil ideal y entregables. La propuesta se adapta a lo que tu empresa necesita y a la complejidad del rol.',
  },
  {
    q: '¿Qué incluye el servicio de Kova?',
    a: 'Nos encargamos del proceso completo: entender la vacante, buscar talento, evaluar por competencias comerciales y entregarte una terna comparada con sustento para que decidas con criterio.',
  },
  {
    q: '¿Es una plataforma o un software?',
    a: 'No. Kova es una firma de reclutamiento comercial. Trabajamos contigo de forma programada: un especialista conduce el proceso y tú recibes el informe y la recomendación para contratar.',
  },
  {
    q: '¿Puedo contratar solo la evaluación?',
    a: 'El servicio se diseña según tu necesidad. Si ya tienes candidatos, podemos enfocarnos en evaluación comparativa. Si partes desde cero, incluimos búsqueda, evaluación y terna recomendada.',
  },
  {
    q: '¿Cuánto tarda un proceso?',
    a: 'Depende del rol, del mercado y del nivel de exigencia del perfil. En el diagnóstico inicial te damos un estimado realista según tu vacante y contexto comercial.',
  },
  {
    q: '¿Hay costo por el diagnóstico inicial?',
    a: 'El diagnóstico comercial inicial no tiene costo. Sirve para entender tu vacante, alinear criterios y, si encaja, presentarte una propuesta de servicio clara.',
  },
];

export default function Precios() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 lg:pt-36 lg:pb-24 px-6 lg:px-8 relative overflow-hidden" style={{ background: '#0F172A' }}>
        <div className="absolute inset-0 kova-grid-bg opacity-60 pointer-events-none" />
        <div
          className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', transform: 'translate(20%, -30%)' }}
        />
        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-4" style={{ color: '#A5B4FC' }}>
              Precios Kova
            </p>
            <h1
              className="font-heading font-bold text-white mb-5"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.035em', lineHeight: 1.08 }}
            >
              Mejor talento comercial, vacante a vacante.
            </h1>
            <p className="text-base lg:text-lg mb-8 max-w-lg" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}>
              No vendemos licencias ni autoservicio. Kova recluta, evalúa y te presenta el perfil ideal según lo
              que tu empresa necesita y cómo vende.
            </p>
            <Link
              to="/#acceso"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm text-white transition-all hover:opacity-95"
              style={{ background: '#4338CA', boxShadow: '0 4px 14px rgba(67,56,202,0.35)' }}
            >
              Agendar diagnóstico comercial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="hidden lg:block">
            <div
              className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-4" style={{ color: '#A5B4FC' }}>
                Qué hacemos por ti
              </p>
              <div className="space-y-3">
                {['Definimos el perfil según tu proceso comercial', 'Buscamos y evaluamos candidatos', 'Te entregamos terna comparada con criterio'].map((step, i) => (
                  <div key={step} className="flex items-start gap-3">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'rgba(99,102,241,0.25)', color: '#C7D2FE' }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan card + includes */}
      <section className="py-20 lg:py-24 px-6 lg:px-8" style={{ background: '#FAFBFF' }}>
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-2xl p-8 lg:p-10 mb-10 text-center"
            style={{ background: 'linear-gradient(135deg, #4338CA 0%, #3730A3 100%)', boxShadow: '0 20px 48px rgba(67,56,202,0.25)' }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: '#C7D2FE' }}>
              Servicio completo de reclutamiento comercial
            </p>
            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-white mb-4" style={{ letterSpacing: '-0.025em' }}>
              Proyecto a medida por vacante
            </h2>
            <p className="text-sm lg:text-base max-w-2xl mx-auto mb-8" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.75 }}>
              Cada empresa vende distinto y cada rol exige competencias distintas. Por eso no hay tarifa genérica:
              diseñamos el proceso contigo, buscamos el talento y te entregamos la recomendación para contratar
              con confianza.
            </p>
            <Link
              to="/#acceso"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all hover:opacity-95"
              style={{ background: '#FFFFFF', color: '#4338CA' }}
            >
              Solicitar propuesta
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.14em] mb-8" style={{ color: '#64748B' }}>
            Qué incluye trabajar con Kova
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {includes.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-start gap-3 p-4 rounded-xl bg-white"
                style={{ border: '1px solid #E2E8F0' }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}
                >
                  <Icon className="w-4 h-4" style={{ color: '#4338CA' }} strokeWidth={2} />
                </div>
                <p className="text-sm font-medium leading-snug pt-1.5" style={{ color: '#334155' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 lg:py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2
            className="font-heading font-bold mb-4"
            style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2rem)', color: '#0F172A', letterSpacing: '-0.025em' }}
          >
            Reclutamiento comercial con resultados que importan
          </h2>
          <p className="text-base max-w-2xl mx-auto mb-14" style={{ color: '#64748B', lineHeight: 1.75 }}>
            Nos encargamos del proceso para que contrates al perfil correcto, no al que mejor se vende en una entrevista.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center">
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center mb-4"
                  style={{ background: '#EEF2FF', border: '3px solid #C7D2FE' }}
                >
                  <span className="font-heading font-bold text-2xl tabular-nums" style={{ color: '#4338CA' }}>{value}</span>
                </div>
                <p className="text-sm font-medium max-w-[200px]" style={{ color: '#475569', lineHeight: 1.6 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value prop dark */}
      <section className="py-20 lg:py-24 px-6 lg:px-8 relative overflow-hidden" style={{ background: '#0F172A' }}>
        <div className="absolute inset-0 kova-grid-bg opacity-50 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-white mb-4" style={{ letterSpacing: '-0.025em' }}>
              Somos tu equipo de reclutamiento comercial, no un proveedor de software.
            </h2>
            <p className="text-base mb-6" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}>
              Kova ejecuta el proceso de principio a fin: diagnóstico, búsqueda, evaluación por competencias e
              informe comparativo. Tú te enfocas en decidir; nosotros en encontrar al talento que encaja con tu
              vacante y tu forma de vender.
            </p>
            <Link
              to="/#acceso"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm text-white transition-all hover:opacity-95"
              style={{ background: '#4338CA' }}
            >
              Hablemos de tu vacante
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['Búsqueda activa', 'Evaluación especializada', 'Informe comparativo', 'Terna recomendada'].map((item) => (
              <div
                key={item}
                className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <CheckCircle2 className="w-5 h-5 mx-auto mb-2" style={{ color: '#818CF8' }} strokeWidth={2} />
                <p className="text-sm font-medium text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2
            className="font-heading font-bold text-center mb-10"
            style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2rem)', color: '#0F172A', letterSpacing: '-0.025em' }}
          >
            Preguntas frecuentes
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={q} value={`item-${i}`} style={{ borderColor: '#E2E8F0' }}>
                <AccordionTrigger className="text-left font-semibold hover:no-underline" style={{ color: '#0F172A' }}>
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed" style={{ color: '#64748B', lineHeight: 1.75 }}>
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
}
