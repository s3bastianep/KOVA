import { Link } from 'react-router-dom';
import { ArrowRight, Check, Compass, Target, Users, X } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { BRAND, KOVA } from '@/theme/kovaPalette';

const pilares = [
  {
    icon: Target,
    title: 'Especialización comercial',
    desc: 'Solo selección de talento comercial. Cada proceso se diseña según el rol, el sector y el modelo de ventas de la organización.',
  },
  {
    icon: Users,
    title: 'Consultores con experiencia real',
    desc: 'Equipo con trayectoria en liderazgo comercial, evaluación de talento y procesos de contratación en empresas de Latinoamérica.',
  },
  {
    icon: Compass,
    title: 'Metodología con evidencia',
    desc: 'Diagnóstico, evaluación estructurada e informe comparativo. Decisiones respaldadas con datos, no con intuición.',
  },
];

const tradicional = [
  'Contratación basada en currículum e impresión en la entrevista.',
  'Pruebas genéricas que no predicen desempeño comercial.',
  'Listas largas de candidatos sin criterio uniforme.',
  'Decisiones tomadas con intuición, no con evidencia.',
];

const kovaMetodo = [
  'Diagnóstico de su producto, mercado y modelo de ventas.',
  'Evaluaciones personalizadas por competencias comerciales.',
  'Solo candidatos previamente evaluados y alineados al perfil.',
  'Informe comparativo con evidencia para decidir con respaldo.',
];

const creencias = [
  {
    title: 'La claridad antes que la velocidad',
    desc: 'Entendemos su negocio antes de buscar. Un buen proceso empieza con diagnóstico, no con volumen de currículums.',
  },
  {
    title: 'Los datos por encima de la intuición',
    desc: 'La entrevista importa, pero no basta. Medimos lo que predice éxito comercial en su contexto.',
  },
  {
    title: 'Especialización comercial',
    desc: 'No reclutamos de todo. Solo talento comercial, porque cada rol de ventas exige competencias distintas.',
  },
  {
    title: 'Evidencia documentada',
    desc: 'Cada recomendación llega con respaldo por competencia. Usted decide con información, no con suposiciones.',
  },
  {
    title: 'Alineación con su negocio',
    desc: 'No aplicamos plantillas. Diseñamos el proceso según su producto, mercado y modelo de ventas.',
  },
  {
    title: 'Compromiso con el resultado',
    desc: 'Nuestro trabajo no termina en entregar nombres. Buscamos que cada contratación reduzca el riesgo para su equipo.',
  },
];

export default function QuienesSomos() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden kova-hero-premium">
          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 lg:pb-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="min-w-0">
                <p className="kova-hero-eyebrow mb-4 sm:mb-5">Acerca de Kova</p>
                <h1
                  className="font-heading font-bold leading-tight mb-4 sm:mb-5 text-white text-balance kova-text-h1"
                >
                  Creamos Kova para solucionar la{' '}
                  <span className="kova-hero-highlight">contratación comercial</span> con criterio y evidencia.
                </h1>
                <p
                  className="text-[15px] sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-lg"
                  style={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.72 }}
                >
                  Nacimos de la experiencia en liderazgo comercial y selección. Vimos empresas contratar por
                  currículum e intuición — y descubrir meses después que el perfil no vendía.
                </p>
                <Link
                  to="/contacto"
                  className="kova-btn-primary inline-flex group items-center gap-2 font-semibold px-6 py-3.5 rounded-lg text-sm text-white transition-all"
                >
                  Agendar consultoría
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="relative min-w-0">
                <div
                  className="absolute -inset-2 rounded-2xl opacity-50 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at center, rgba(45,91,227,0.25) 0%, transparent 70%)' }}
                  aria-hidden
                />
                <img
                  src="/images/equipo-kova.png"
                  alt="Equipo Kova"
                  className="relative w-full rounded-xl sm:rounded-2xl object-cover aspect-[5/4] lg:aspect-[4/3]"
                  style={{
                    boxShadow: '0 24px 48px rgba(0,0,0,0.28)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Historia */}
        <section className="py-10 lg:py-16 px-5 sm:px-6 lg:px-8 bg-white border-b" style={{ borderColor: KOVA.border }}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="kova-eyebrow-pill mb-4 mx-auto w-fit">Nuestra historia</p>
            <h2
              className="font-heading font-bold mb-6 sm:mb-8 text-balance"
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                letterSpacing: '-0.03em',
                color: BRAND.navy,
                lineHeight: 1.15,
              }}
            >
              Nuestra historia
            </h2>
            <div className="space-y-5 text-left sm:text-center">
              <p className="text-[15px] leading-relaxed" style={{ color: KOVA.muted, lineHeight: 1.75 }}>
                Durante años vimos el mismo patrón: dirección comercial y talento humano alineados en la urgencia de
                cubrir la vacante, pero sin un método que midiera si el candidato realmente podía vender en ese
                contexto.
              </p>
              <p
                className="text-[15px] sm:text-base font-semibold leading-relaxed"
                style={{ color: BRAND.navy, lineHeight: 1.75 }}
              >
                El problema no era la falta de candidatos. Era la falta de un proceso que evaluara competencias
                comerciales con el rigor que el rol exige.
              </p>
              <p className="text-[15px] leading-relaxed" style={{ color: KOVA.muted, lineHeight: 1.75 }}>
                Kova nació para cambiar eso: primero entender el negocio del cliente, diseñar evaluaciones a la medida
                y presentar talento respaldado por evidencia objetiva.
              </p>
              <p className="text-[15px] font-semibold pt-1" style={{ color: BRAND.blue }}>
                Esa convicción se convirtió en Kova.
              </p>
            </div>
          </div>
        </section>

        {/* Diferenciador */}
        <section className="py-10 lg:py-16 px-5 sm:px-6 lg:px-8 kova-section-warm">
          <div className="max-w-6xl mx-auto">
            <header className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <p className="kova-eyebrow-pill mb-4 mx-auto w-fit">Nuestro enfoque</p>
              <h2
                className="font-heading font-bold text-balance mb-4"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.125rem)',
                  letterSpacing: '-0.03em',
                  color: BRAND.navy,
                  lineHeight: 1.15,
                }}
              >
                Lo que hacemos{' '}
                <span style={{ color: BRAND.green }}>diferente</span>
              </h2>
              <p className="text-[15px] leading-relaxed" style={{ color: KOVA.body, lineHeight: 1.7 }}>
                La selección comercial exige más que filtrar currículums. Requiere entender su negocio y evaluar con
                criterio técnico.
              </p>
            </header>

            <div className="grid md:grid-cols-2 gap-4 lg:gap-5 max-w-4xl mx-auto">
              <div
                className="rounded-xl sm:rounded-2xl p-5 sm:p-6 h-full"
                style={{ background: KOVA.white, border: `1px solid ${KOVA.border}` }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-4"
                  style={{ color: BRAND.coral }}
                >
                  Selección tradicional
                </p>
                <ul className="space-y-3">
                  {tradicional.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: KOVA.paleCoral }}
                      >
                        <X className="w-3 h-3" style={{ color: BRAND.coral }} strokeWidth={2.5} />
                      </span>
                      <span className="text-[14px] leading-snug" style={{ color: KOVA.body, lineHeight: 1.55 }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-xl sm:rounded-2xl p-5 sm:p-6 h-full"
                style={{
                  background: KOVA.white,
                  border: `2px solid ${BRAND.green}`,
                  boxShadow: '0 8px 32px rgba(0,178,122,0.1)',
                }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-4"
                  style={{ color: BRAND.greenDark }}
                >
                  Metodología Kova
                </p>
                <ul className="space-y-3">
                  {kovaMetodo.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: KOVA.paleGreen }}
                      >
                        <Check className="w-3 h-3" style={{ color: BRAND.greenDark }} strokeWidth={3} />
                      </span>
                      <span className="text-[14px] font-medium leading-snug" style={{ color: BRAND.navy, lineHeight: 1.55 }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pilares */}
        <section className="py-10 lg:py-14 px-5 sm:px-6 lg:px-8 bg-white border-b" style={{ borderColor: KOVA.border }}>
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {pilares.map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="kova-card rounded-xl p-5 h-full"
                style={{ boxShadow: '0 1px 2px rgba(15,31,61,0.04), 0 4px 16px rgba(15,31,61,0.05)' }}
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
                <p className="text-sm leading-relaxed" style={{ color: KOVA.body, lineHeight: 1.6 }}>
                  {desc}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Misión */}
        <section className="py-10 lg:py-16 px-5 sm:px-6 lg:px-8 kova-section-solution">
          <div className="max-w-3xl mx-auto text-center">
            <p className="kova-solution-eyebrow mb-4 sm:mb-5 mx-auto w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B27A]" />
              Nuestra misión
            </p>
            <h2
              className="font-heading font-bold mb-5 sm:mb-6 text-balance"
              style={{
                fontSize: 'clamp(1.375rem, 3.5vw, 1.75rem)',
                letterSpacing: '-0.03em',
                color: BRAND.navy,
                lineHeight: 1.2,
              }}
            >
              Nuestra misión
            </h2>
            <div
              className="rounded-xl sm:rounded-2xl px-5 py-6 sm:px-8 sm:py-8 text-left sm:text-center"
              style={{ background: KOVA.white, border: `1px solid #C5D4F0` }}
            >
              <p
                className="text-base sm:text-lg font-heading font-semibold leading-snug mb-3"
                style={{ color: BRAND.navy }}
              >
                Ayudar a las empresas a contratar talento comercial con criterio técnico y evidencia documentada.
              </p>
              <p className="text-[15px] leading-relaxed" style={{ color: KOVA.body, lineHeight: 1.75 }}>
                Reemplazamos la contratación basada en intuición por un sistema estructurado: diagnóstico comercial,
                evaluación por competencias e informe comparativo para que dirección comercial y talento humano
                decidan con el mismo criterio.
              </p>
            </div>
            <p className="text-[15px] font-medium mt-5 sm:mt-6" style={{ color: BRAND.greenDark }}>
              Menos apuestas. Más decisiones informadas.
            </p>
          </div>
        </section>

        {/* Valores */}
        <section className="py-10 lg:py-16 px-5 sm:px-6 lg:px-8 bg-white border-b" style={{ borderColor: KOVA.border }}>
          <div className="max-w-6xl mx-auto">
            <header className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <p className="kova-eyebrow-pill mb-4 mx-auto w-fit">Nuestros valores</p>
              <h2
                className="font-heading font-bold text-balance"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  letterSpacing: '-0.03em',
                  color: BRAND.navy,
                }}
              >
                Lo que creemos
              </h2>
            </header>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {creencias.map(({ title, desc }) => (
                <article
                  key={title}
                  className="rounded-xl p-4 sm:p-5 h-full"
                  style={{ background: KOVA.surface, border: `1px solid ${KOVA.border}` }}
                >
                  <h3 className="font-heading font-semibold text-[15px] mb-2 leading-snug" style={{ color: BRAND.navy }}>
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

        {/* CTA final */}
        <section className="py-10 lg:py-14 px-5 sm:px-6 lg:px-8" style={{ background: KOVA.paleBlue }}>
          <div className="max-w-6xl mx-auto">
            <div
              className="rounded-xl sm:rounded-2xl px-5 py-6 sm:px-8 sm:py-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-10"
              style={{
                background: BRAND.navy,
                boxShadow: '0 12px 40px rgba(15, 31, 61, 0.14)',
              }}
            >
              <div className="min-w-0 flex-1 text-center lg:text-left">
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3"
                  style={{ color: '#8EC5FF' }}
                >
                  Conversemos
                </p>
                <h2
                  className="font-heading font-bold text-white text-balance mb-2"
                  style={{
                    fontSize: 'clamp(1.25rem, 4vw, 1.625rem)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.2,
                  }}
                >
                  Programe una consultoría con nuestro equipo
                </h2>
                <p className="text-sm max-w-md mx-auto lg:mx-0" style={{ color: 'rgba(255,255,255,0.62)', lineHeight: 1.65 }}>
                  30 minutos para entender su necesidad y explicarle cómo Kova puede apoyar su próxima contratación
                  comercial.
                </p>
              </div>

              <Link
                to="/contacto"
                className="kova-btn-primary inline-flex group items-center justify-center gap-2 font-semibold px-7 py-3.5 rounded-lg text-sm text-white transition-all flex-shrink-0 w-full sm:w-auto"
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
