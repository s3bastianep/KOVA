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
import PreciosCandidatoDashboard from '@/components/landing/PreciosCandidatoDashboard';

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
  {
    pct: 67,
    label: 'Menos entrevistas por contratación al evaluar competencias comerciales antes de decidir.',
  },
  {
    pct: 80,
    label: 'Mayor acierto cuando la selección se basa en desempeño evaluado, no solo en la entrevista.',
  },
  {
    pct: 44,
    label: 'Menor rotación temprana frente a contratar sin evaluación comercial especializada.',
  },
  {
    pct: 90,
    label: 'Decisiones más ágiles cuando dirección comercial y talento humano usan el mismo informe.',
  },
];

function StatRing({ pct, label }) {
  const size = 120;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-5" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="block -rotate-90" aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#4338CA"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading font-bold text-2xl tabular-nums leading-none" style={{ color: '#4338CA' }}>
            {pct}%
          </span>
        </div>
      </div>
      <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: '#475569', lineHeight: 1.65 }}>
        {label}
      </p>
    </div>
  );
}

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
            <p className="text-base lg:text-lg mb-3 max-w-lg" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}>
              Reclutamos, evaluamos por competencias comerciales y te presentamos el talento ideal según lo
              que tu empresa necesita y cómo vende.
            </p>
            <p className="text-sm mb-8 max-w-lg" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
              Cada vacante recibe un informe comparativo con el sustento para decidir con criterio.
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
          <div className="mt-8 lg:mt-0">
            <PreciosCandidatoDashboard />
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
            Resultados que construyen valor en cada contratación
          </h2>
          <p className="text-base max-w-2xl mx-auto mb-14" style={{ color: '#64748B', lineHeight: 1.75 }}>
            Contratar comercial con criterio reduce errores, acelera la decisión y mejora la retención del equipo.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {stats.map(({ pct, label }) => (
              <StatRing key={label} pct={pct} label={label} />
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

      <Footer />
    </div>
  );
}
