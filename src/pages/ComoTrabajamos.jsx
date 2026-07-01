import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Building2,
  ClipboardCheck,
  FileCheck,
  Search,
  Target,
  UserCheck,
  Users,
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import HeroCandidateMockup from '@/components/landing/HeroCandidateMockup';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const publico = [
  {
    icon: Users,
    title: 'Equipos comerciales en crecimiento',
    desc: 'Empresas que necesitan contratar vendedores con criterio, sin ampliar el equipo de selección interno.',
  },
  {
    icon: Building2,
    title: 'Sin reclutador comercial dedicado',
    desc: 'Dirección comercial o talento humano que necesita un partner especializado en perfiles de ventas.',
  },
  {
    icon: Target,
    title: 'Contrataciones que no funcionaron',
    desc: 'Organizaciones que ya vivieron una mala contratación comercial y quieren un proceso con evidencia.',
  },
  {
    icon: UserCheck,
    title: 'Vacantes comerciales exigentes',
    desc: 'Roles donde la entrevista sola no basta: venta consultiva, ciclos largos o productos técnicos.',
  },
];

const pasos = [
  {
    n: '01',
    label: 'Diagnosticar',
    title: 'Entendemos su negocio antes de buscar.',
    desc: 'Nos sentamos con su equipo para analizar producto, mercado, clientes, proceso comercial y modelo de ventas. Sin ese contexto, cualquier evaluación es genérica.',
    items: [
      'Sesión de diagnóstico con dirección comercial y talento humano',
      'Mapeo del perfil ideal y competencias críticas del rol',
      'Definición de criterios de éxito comercial en su contexto',
      'Alineación sobre el tipo de vendedor que necesita contratar',
    ],
    highlight: 'El proceso empieza por entender cómo vende su empresa, no por publicar la vacante.',
  },
  {
    n: '02',
    label: 'Diseñar',
    title: 'Construimos evaluaciones personalizadas para su vacante.',
    desc: 'Con base en el diagnóstico, diseñamos pruebas de habilidades y criterios de evaluación que miden lo que realmente predice éxito en ese cargo.',
    items: [
      'Pruebas de habilidades comerciales adaptadas a su modelo de ventas',
      'Rúbrica de competencias alineada al rol y al sector',
      'Kova Score calibrado para su organización',
      'Proceso de selección documentado y repetible',
    ],
    highlight: 'No usamos plantillas. Cada vacante tiene su propio marco de evaluación.',
  },
  {
    n: '03',
    label: 'Evaluar',
    title: 'Buscamos, evaluamos y comparamos con el mismo criterio.',
    desc: 'Activamos la búsqueda de candidatos y los evaluamos con los instrumentos diseñados. Cada perfil recibe el mismo estándar técnico.',
    items: [
      'Búsqueda activa de talento comercial alineado al perfil',
      'Evaluación por competencias con evidencia documentada',
      'Kova Score y ranking comparativo entre candidatos',
      'Validación de ajuste al rol antes de presentar la terna',
    ],
    highlight: 'Solo avanzan candidatos que cumplen el umbral definido para su vacante.',
  },
  {
    n: '04',
    label: 'Entregar',
    title: 'Recibe candidatos listos para decidir, con respaldo completo.',
    desc: 'Le presentamos una terna de perfiles evaluados con informe comparativo: puntajes por competencia, evidencia y recomendación del consultor.',
    items: [
      'Terna de candidatos previamente evaluados y rankeados',
      'Informe comparativo con puntaje por competencia',
      'Evidencia documentada de cada evaluación',
      'Recomendación clara para la decisión de contratación',
    ],
    highlight: 'No necesita más currículums. Necesita candidatos validados, comparados y listos para entrevistar.',
  },
];

const enfoque = {
  metodologia: {
    title: 'Metodología estructurada',
    items: [
      'Pruebas de habilidades personalizadas por vacante',
      'Kova Score como índice predictivo de desempeño',
      'Evaluación uniforme para todos los candidatos',
      'Informe comparativo con evidencia por competencia',
    ],
  },
  consultor: {
    title: 'Consultor dedicado',
    items: [
      'Diagnóstico comercial con su equipo',
      'Diseño del proceso según su modelo de ventas',
      'Entrevistas técnicas y validación de perfiles',
      'Acompañamiento hasta la decisión de contratación',
    ],
  },
};

function ProcesoStep({ paso, isLast }) {
  return (
    <article className="relative pl-12 sm:pl-16 pb-10 sm:pb-14 last:pb-0">
      {!isLast && (
        <span
          className="absolute left-[1.125rem] sm:left-[1.375rem] top-10 bottom-0 w-px"
          style={{ background: '#C5D4F0' }}
          aria-hidden
        />
      )}
      <span
        className="absolute left-0 top-0 font-heading font-bold tabular-nums leading-none"
        style={{ fontSize: 'clamp(2rem, 6vw, 2.75rem)', color: 'rgba(26,63,170,0.15)', letterSpacing: '-0.04em' }}
        aria-hidden
      >
        {paso.n}
      </span>
      <p
        className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] mb-2"
        style={{ color: BRAND.blue }}
      >
        {paso.label}
      </p>
      <h3
        className="font-heading font-bold text-balance mb-3"
        style={{ fontSize: 'clamp(1.125rem, 3.5vw, 1.375rem)', color: BRAND.navy, letterSpacing: '-0.02em', lineHeight: 1.25 }}
      >
        {paso.title}
      </h3>
      <p className="text-[14px] sm:text-[15px] leading-relaxed mb-4 max-w-2xl" style={{ color: KOVA.body, lineHeight: 1.7 }}>
        {paso.desc}
      </p>
      <ul
        className="rounded-xl p-4 sm:p-5 mb-4 space-y-2.5"
        style={{ background: KOVA.white, border: `1px solid ${KOVA.border}` }}
      >
        {paso.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-[14px]" style={{ color: KOVA.body, lineHeight: 1.55 }}>
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: BRAND.green }} />
            {item}
          </li>
        ))}
      </ul>
      <p
        className="rounded-xl px-4 py-3.5 text-[13px] sm:text-[14px] leading-relaxed"
        style={{ background: KOVA.paleBlue, border: '1px solid #C5D4F0', color: BRAND.navy, lineHeight: 1.6 }}
      >
        {paso.highlight}
      </p>
    </article>
  );
}

export default function ComoTrabajamos() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden kova-hero-premium">
          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 lg:pb-16">
            <div className="max-w-3xl">
              <p className="kova-hero-eyebrow mb-4 sm:mb-5">Cómo trabajamos</p>
              <h1
                  className="font-heading font-bold text-white text-balance mb-4 sm:mb-5 kova-text-h1"
              >
                Su sistema de{' '}
                <span className="kova-hero-highlight">selección comercial</span>, de principio a fin.
              </h1>
              <p
                className="text-[15px] sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-xl"
                style={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.72 }}
              >
                Cuatro etapas claras: diagnosticamos su negocio, diseñamos la evaluación, calificamos candidatos con
                evidencia y le entregamos una terna lista para decidir.
              </p>
              <Link
                to="/contacto"
                className="kova-btn-primary inline-flex group items-center gap-2 font-semibold px-6 py-3.5 rounded-lg text-sm text-white transition-all"
              >
                Agendar consultoría
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Para quién */}
        <section className="py-10 lg:py-16 px-5 sm:px-6 lg:px-8 bg-white border-b" style={{ borderColor: KOVA.border }}>
          <div className="max-w-6xl mx-auto">
            <header className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <p className="kova-eyebrow-pill mb-4 mx-auto w-fit">Para quién</p>
              <h2
                className="font-heading font-bold text-balance mb-3"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: BRAND.navy, letterSpacing: '-0.03em' }}
              >
                Para quién está diseñado
              </h2>
              <p className="text-[15px] leading-relaxed" style={{ color: KOVA.body, lineHeight: 1.7 }}>
                Kova está pensado para empresas que contratan talento comercial y necesitan un proceso riguroso, no
                más volumen de currículums.
              </p>
            </header>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {publico.map(({ icon: Icon, title, desc }) => (
                <article
                  key={title}
                  className="rounded-xl p-4 sm:p-5 h-full"
                  style={{ background: KOVA.surface, border: `1px solid ${KOVA.border}` }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: KOVA.paleBlue }}
                  >
                    <Icon className="w-4 h-4" style={{ color: BRAND.blue }} strokeWidth={2} />
                  </div>
                  <h3 className="font-heading font-semibold text-[15px] mb-1.5" style={{ color: BRAND.navy }}>
                    {title}
                  </h3>
                  <p className="text-[13px] sm:text-sm leading-relaxed" style={{ color: KOVA.muted, lineHeight: 1.6 }}>
                    {desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Proceso */}
        <section className="py-10 lg:py-16 px-5 sm:px-6 lg:px-8 kova-section-warm">
          <div className="max-w-3xl mx-auto">
            <header className="mb-8 sm:mb-10">
              <p className="kova-eyebrow-pill kova-eyebrow-coral mb-4 w-fit">Proceso</p>
              <h2
                className="font-heading font-bold text-balance mb-3"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: BRAND.navy, letterSpacing: '-0.03em' }}
              >
                Cómo funciona
              </h2>
              <p className="text-[15px] leading-relaxed max-w-2xl" style={{ color: KOVA.body, lineHeight: 1.7 }}>
                Un proceso estructurado en cuatro etapas. Usted sabe qué esperar en cada fase y qué recibe al final.
              </p>
            </header>

            <div>
              {pasos.map((paso, i) => (
                <ProcesoStep key={paso.n} paso={paso} isLast={i === pasos.length - 1} />
              ))}
            </div>
          </div>
        </section>

        {/* Enfoque */}
        <section className="py-10 lg:py-16 px-5 sm:px-6 lg:px-8 bg-white border-y" style={{ borderColor: KOVA.border }}>
          <div className="max-w-6xl mx-auto">
            <header className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <p className="kova-eyebrow-pill mb-4 mx-auto w-fit">Metodología + consultor</p>
              <h2
                className="font-heading font-bold text-balance mb-3"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: BRAND.navy, letterSpacing: '-0.03em' }}
              >
                Nuestro enfoque
              </h2>
              <p className="text-[15px] leading-relaxed" style={{ color: KOVA.body, lineHeight: 1.7 }}>
                Combinamos evaluación estructurada con acompañamiento de un consultor especializado en selección
                comercial.
              </p>
            </header>

            <div className="grid md:grid-cols-2 gap-4 lg:gap-5 max-w-4xl mx-auto">
              <article
                className="rounded-xl sm:rounded-2xl p-5 sm:p-6 h-full"
                style={{ background: KOVA.white, border: `1px solid ${KOVA.border}` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: KOVA.paleBlue }}
                >
                  <BarChart3 className="w-5 h-5" style={{ color: BRAND.blue }} strokeWidth={2} />
                </div>
                <h3 className="font-heading font-semibold text-base mb-4" style={{ color: BRAND.navy }}>
                  {enfoque.metodologia.title}
                </h3>
                <ul className="space-y-2.5">
                  {enfoque.metodologia.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px]" style={{ color: KOVA.body, lineHeight: 1.55 }}>
                      <ClipboardCheck className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: BRAND.green }} strokeWidth={2.25} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              <article
                className="rounded-xl sm:rounded-2xl p-5 sm:p-6 h-full"
                style={{
                  background: KOVA.white,
                  border: `2px solid ${BRAND.green}`,
                  boxShadow: '0 8px 32px rgba(0,178,122,0.08)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: KOVA.paleGreen }}
                >
                  <Search className="w-5 h-5" style={{ color: BRAND.greenDark }} strokeWidth={2} />
                </div>
                <h3 className="font-heading font-semibold text-base mb-4" style={{ color: BRAND.navy }}>
                  {enfoque.consultor.title}
                </h3>
                <ul className="space-y-2.5">
                  {enfoque.consultor.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px]" style={{ color: KOVA.body, lineHeight: 1.55 }}>
                      <FileCheck className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: BRAND.greenDark }} strokeWidth={2.25} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* Entregable */}
        <section className="py-10 lg:py-16 px-5 sm:px-6 lg:px-8 kova-section-solution">
          <div className="max-w-6xl mx-auto">
            <header className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <p className="kova-solution-eyebrow mb-4 sm:mb-5 mx-auto w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00B27A]" />
                Ejemplo de entregable
              </p>
              <h2
                className="font-heading font-bold text-balance mb-3"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: BRAND.navy, letterSpacing: '-0.03em' }}
              >
                Lo que recibe
              </h2>
              <p className="text-[15px] leading-relaxed" style={{ color: KOVA.body, lineHeight: 1.7 }}>
                Cada candidato llega con evaluación por competencias, Kova Score, evidencia documentada y
                recomendación para su decisión de contratación.
              </p>
            </header>

            <div className="max-w-lg mx-auto">
              <HeroCandidateMockup />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 lg:py-14 px-5 sm:px-6 lg:px-8" style={{ background: KOVA.paleBlue }}>
          <div className="max-w-6xl mx-auto">
            <div
              className="rounded-xl sm:rounded-2xl px-5 py-8 sm:px-8 sm:py-10 text-center"
              style={{ background: BRAND.navy, boxShadow: '0 12px 40px rgba(15, 31, 61, 0.14)' }}
            >
              <h2
                className="font-heading font-bold text-white text-balance mb-3"
                style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', letterSpacing: '-0.03em' }}
              >
                ¿Listo para ver cómo funciona en su vacante?
              </h2>
              <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'rgba(255,255,255,0.62)', lineHeight: 1.65 }}>
                Cuéntenos su necesidad de contratación comercial y diseñemos juntos el proceso ideal para su equipo.
              </p>
              <Link
                to="/contacto"
                className="kova-btn-primary inline-flex group items-center justify-center gap-2 font-semibold px-7 py-3.5 rounded-lg text-sm text-white transition-all w-full sm:w-auto"
              >
                Agendar consultoría
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
