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

const noSomos = [
  'Un portal de empleo o bolsa de vacantes.',
  'Una agencia de reclutamiento generalista.',
  'Un proveedor de pruebas genéricas sin contexto comercial.',
  'Una consultora que entrega listas sin evaluación rigurosa.',
];

const siSomos = [
  'Una firma especializada en selección comercial.',
  'Un equipo que opera el proceso de punta a punta.',
  'Un aliado para dirección comercial y talento humano.',
  'Un partner con metodología propia adaptada a cada vacante.',
];

export default function QuienesSomos() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="pt-24 pb-8 lg:pb-10 px-6 lg:px-8 kova-section-warm">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div>
              <p className="kova-eyebrow-pill mb-4">Quiénes somos</p>
              <h1
                className="font-heading font-bold leading-tight mb-4 text-balance"
                style={{
                  fontSize: 'clamp(1.75rem, 2.8vw, 2.375rem)',
                  letterSpacing: '-0.03em',
                  color: BRAND.navy,
                }}
              >
                Expertos en selección comercial para empresas que contratan con criterio.
              </h1>
              <p className="text-[15px] leading-relaxed max-w-lg" style={{ color: KOVA.body, lineHeight: 1.7 }}>
                Kova nació de la experiencia directa en selección, liderazgo y desarrollo de equipos comerciales.
                Conocemos lo que exige un rol comercial porque lo hemos vivido desde adentro.
              </p>
            </div>

            <div className="relative">
              <div
                className="absolute -inset-2 rounded-2xl opacity-60 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(26,63,170,0.08), rgba(0,178,122,0.06))' }}
                aria-hidden
              />
              <img
                src="/images/equipo-kova.png"
                alt="Equipo Kova"
                className="relative w-full rounded-2xl object-cover aspect-[5/4] lg:aspect-[4/3] shadow-lg"
                style={{ boxShadow: '0 8px 32px rgba(15,31,61,0.1)' }}
              />
            </div>
          </div>
        </section>

        <section className="py-8 lg:py-10 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8 lg:space-y-10">
          <div className="grid md:grid-cols-3 gap-4 lg:gap-5">
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
                <h2 className="font-heading font-semibold text-[15px] mb-1.5" style={{ color: BRAND.navy }}>
                  {title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: KOVA.body, lineHeight: 1.6 }}>
                  {desc}
                </p>
              </article>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 lg:gap-5">
            <div className="kova-card rounded-xl p-5 lg:p-6">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-4"
                style={{ color: KOVA.muted }}
              >
                Lo que no somos
              </p>
              <ul className="space-y-2.5">
                {noSomos.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: '#FEE2E2' }}
                    >
                      <X className="w-3 h-3" style={{ color: '#DC2626' }} strokeWidth={2.5} />
                    </span>
                    <span className="text-sm" style={{ color: KOVA.body, lineHeight: 1.55 }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl p-5 lg:p-6 kova-cta-band">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-4"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                Lo que sí somos
              </p>
              <ul className="space-y-2.5">
                {siSomos.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(0,178,122,0.25)' }}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </span>
                    <span className="text-sm font-medium text-white" style={{ lineHeight: 1.55 }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="grid lg:grid-cols-2 gap-6 lg:gap-10 rounded-xl p-5 lg:p-6"
            style={{ background: KOVA.surface, border: `1px solid ${KOVA.border}` }}
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: BRAND.blue }}>
                Nuestra misión
              </p>
              <p className="text-base font-heading font-semibold leading-snug mb-2" style={{ color: BRAND.navy }}>
                Ayudar a las empresas a contratar talento comercial con criterio técnico y evidencia documentada.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: KOVA.body, lineHeight: 1.65 }}>
                Diseñamos y ejecutamos procesos de selección comercial que reducen el riesgo de contratación y
                alinean a dirección comercial y talento humano en una misma decisión.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: BRAND.blue }}>
                Nuestra visión
              </p>
              <p className="text-base font-heading font-semibold leading-snug mb-2" style={{ color: BRAND.navy }}>
                Ser la referencia en selección comercial especializada en Latinoamérica.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: KOVA.body, lineHeight: 1.65 }}>
                Un mercado donde las empresas contratan comercial por competencias medidas, no por currículum ni
                por buena entrevista.
              </p>
            </div>
          </div>
          </div>
        </section>

        <section className="pb-12 lg:pb-14 pt-2 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
          <div
            className="rounded-xl px-6 py-7 lg:px-8 lg:py-8 text-center"
            style={{ background: KOVA.surface, border: `1px solid ${KOVA.border}` }}
          >
            <h2
              className="font-heading font-bold text-lg lg:text-xl mb-2"
              style={{ color: BRAND.navy, letterSpacing: '-0.02em' }}
            >
              ¿Listo para conocer cómo trabajamos?
            </h2>
            <p className="text-sm mb-5 max-w-md mx-auto" style={{ color: KOVA.body, lineHeight: 1.65 }}>
              Cuéntenos su vacante. Un especialista de Kova le responde en menos de 24 horas hábiles.
            </p>
            <Link
              to="/contacto"
              className="group kova-btn-primary inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm transition-all text-white"
            >
              Contáctenos
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
