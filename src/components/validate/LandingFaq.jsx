import {
  ArrowRight,
  Briefcase,
  Building2,
  ClipboardCheck,
  FileCheck,
  Gauge,
  Handshake,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { accentCycle, BRAND, KOVA } from '@/theme/kovaPalette';

function FaqListItem({ title, children }) {
  return (
    <li className="space-y-0.5">
      <p className="font-semibold" style={{ color: BRAND.navy }}>
        {title}
      </p>
      <p>{children}</p>
    </li>
  );
}

const faqs = [
  {
    icon: Briefcase,
    q: '¿Qué roles comerciales cubren?',
    a: 'SDR (Desarrollo de Ventas), BDR (Desarrollo de Negocio), Ejecutivo Comercial, Servicio al Cliente, Gerente de Cuentas, Gerente Comercial y Director Comercial. Nuestra metodología se adapta al modelo de negocio de cada organización: B2B, B2C, retail, servicios e industria.',
  },
  {
    icon: ClipboardCheck,
    q: '¿Cómo evalúan a los candidatos?',
    answer: (
      <div className="space-y-4">
        <p>
          Cada proceso inicia con una sesión de diagnóstico para definir las competencias críticas del rol según
          el contexto comercial de la organización. A partir de ese criterio se diseña una batería de evaluación
          estructurada y uniforme, aplicada a todos los candidatos del proceso.
        </p>
        <div>
          <p className="font-semibold mb-2.5" style={{ color: BRAND.navy }}>
            Instrumentos de evaluación:
          </p>
          <ul className="space-y-3">
            <FaqListItem title="Entrevista por competencias">
              Estructurada con base en el perfil definido. Se evalúan comportamientos demostrados en contextos
              comerciales reales.
            </FaqListItem>
            <FaqListItem title="Simulaciones comerciales">
              Escenarios diseñados específicamente para el rol: prospección, manejo de objeciones, negociación o
              cierre, según las exigencias de la vacante.
            </FaqListItem>
            <FaqListItem title="Evaluación psicométrica">
              Aplicada cuando el perfil lo requiere. Mide variables de personalidad y aptitud con impacto directo en
              el desempeño comercial.
            </FaqListItem>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-2" style={{ color: BRAND.navy }}>
            Entregable del proceso:
          </p>
          <p>
            Informe comparativo por candidato con criterio uniforme, evidencia documentada y recomendación
            argumentada para la toma de decisión.
          </p>
        </div>
      </div>
    ),
  },
  {
    icon: FileCheck,
    q: '¿Qué recibo al cerrar el proceso?',
    answer: (
      <div className="space-y-4">
        <p>
          Al cierre de cada proceso de selección, la organización recibe un informe comparativo estructurado con
          la siguiente información:
        </p>
        <ul className="space-y-3">
          <FaqListItem title="Ranking de candidatos">
            Tres perfiles evaluados y ordenados según su nivel de ajuste al rol definido.
          </FaqListItem>
          <FaqListItem title="Puntaje por competencia">
            Calificación individual por cada competencia crítica establecida en el diagnóstico inicial.
          </FaqListItem>
          <FaqListItem title="Evidencia documentada">
            Respaldo técnico de cada calificación asignada, basado en los instrumentos de evaluación aplicados.
          </FaqListItem>
          <FaqListItem title="Recomendación del consultor">
            Argumentación técnica sobre el candidato recomendado para la posición, con criterio comercial
            especializado.
          </FaqListItem>
          <FaqListItem title="Formato ejecutivo">
            Diseñado para ser presentado y compartido entre dirección comercial y talento humano sin trabajo
            adicional de interpretación.
          </FaqListItem>
        </ul>
        <p className="font-medium" style={{ color: BRAND.navy }}>
          Un solo documento. Toda la información necesaria para tomar la decisión de contratación con criterio y
          evidencia.
        </p>
      </div>
    ),
  },
  {
    icon: Building2,
    q: '¿Para qué tipo de empresas es Kova?',
    answer: (
      <div className="space-y-4">
        <p>
          Kova está diseñado para organizaciones de cualquier sector que requieran gestionar procesos de selección
          comercial con criterio técnico y evidencia documentada.
        </p>
        <div>
          <p className="font-semibold mb-2.5" style={{ color: BRAND.navy }}>
            Trabajamos con:
          </p>
          <ul className="space-y-3">
            <FaqListItem title="Empresas con vacantes estratégicas">
              Organizaciones que necesitan cubrir una posición comercial clave y no pueden permitirse una decisión
              equivocada.
            </FaqListItem>
            <FaqListItem title="Áreas comerciales en expansión">
              Equipos en crecimiento que requieren incorporar talento de forma estructurada y con criterio uniforme
              en cada proceso.
            </FaqListItem>
            <FaqListItem title="Direcciones comerciales y de talento humano">
              Que necesitan alinear el criterio de selección entre ambas áreas y tomar decisiones respaldadas con
              evidencia.
            </FaqListItem>
            <FaqListItem title="Cualquier sector">
              B2B, B2C, retail, servicios e industria. La metodología se adapta al modelo comercial de cada
              organización.
            </FaqListItem>
          </ul>
        </div>
        <p className="font-medium" style={{ color: BRAND.navy }}>
          Si su organización necesita contratar talento comercial con criterio, Kova gestiona el proceso de
          principio a fin.
        </p>
      </div>
    ),
  },
  {
    icon: Target,
    q: '¿Cómo definen el perfil ideal para mi organización?',
    a: 'Antes de iniciar cualquier búsqueda, nuestro consultor analiza su organización, proceso comercial e indicadores de desempeño para definir con precisión qué perfil necesita su equipo.',
  },
  {
    icon: Gauge,
    q: '¿Qué es el Kova Score?',
    a: 'Es un índice predictivo que estima la probabilidad de éxito de cada candidato en su organización y modelo de ventas específico. No reemplaza la decisión, la respalda con evidencia real.',
  },
  {
    icon: Handshake,
    q: '¿Qué incluye trabajar con ustedes?',
    answer: (
      <div className="space-y-4">
        <p>
          Cada proceso de selección es gestionado por un consultor especializado en talento comercial, asignado
          exclusivamente a la vacante. No se trabaja con plantillas genéricas ni procesos estandarizados. Cada
          proceso se diseña según el contexto comercial de la organización.
        </p>
        <div>
          <p className="font-semibold mb-2.5" style={{ color: BRAND.navy }}>
            El proceso incluye:
          </p>
          <ul className="space-y-3">
            <FaqListItem title="Consultor dedicado por vacante">
              Un especialista en talento comercial asignado exclusivamente al proceso, con conocimiento del mercado y
              del área comercial.
            </FaqListItem>
            <FaqListItem title="Búsqueda activa de talento">
              Identificación y atracción de perfiles comerciales mediante metodología estructurada, sin depender
              únicamente de candidatos inbound.
            </FaqListItem>
            <FaqListItem title="Evaluación personalizada por cargo">
              Batería de evaluación diseñada específicamente para el rol, con instrumentos adaptados al contexto
              comercial de la organización.
            </FaqListItem>
            <FaqListItem title="Informe comparativo por vacante">
              Documento ejecutivo con ranking de candidatos, puntaje por competencia, evidencia documentada y
              recomendación argumentada.
            </FaqListItem>
            <FaqListItem title="Acompañamiento hasta la decisión final">
              El consultor asignado acompaña el proceso hasta que la organización toma la decisión de contratación
              con criterio y respaldo técnico.
            </FaqListItem>
          </ul>
        </div>
        <p className="font-medium" style={{ color: BRAND.navy }}>
          Un proceso integral. Un consultor dedicado. Una decisión respaldada con evidencia.
        </p>
      </div>
    ),
  },
];

export default function LandingFaq() {
  return (
    <section
      id="faq"
      className="py-12 lg:py-16 px-6 lg:px-8 relative overflow-hidden"
      style={{ background: KOVA.white, borderTop: `1px solid ${KOVA.border}` }}
    >
      <div
        className="pointer-events-none absolute -top-32 right-0 w-[480px] h-[480px] rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(26,63,170,0.06) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-[minmax(0,320px)_1fr] gap-8 lg:gap-10 xl:gap-12 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="kova-eyebrow-pill mb-5">Preguntas frecuentes</p>
            <h2
              className="font-heading font-bold leading-tight mb-4 text-balance"
              style={{
                fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
                color: BRAND.navy,
                letterSpacing: '-0.025em',
              }}
            >
              Lo que suelen preguntarnos.
            </h2>
            <p className="text-[15px] leading-relaxed mb-8" style={{ color: KOVA.body, lineHeight: 1.75 }}>
              Resolvemos las dudas más comunes antes de iniciar una vacante comercial con nosotros.
            </p>

            <div
              className="hidden lg:flex flex-col gap-3 rounded-xl p-5"
              style={{ background: KOVA.surface, border: `1px solid ${KOVA.border}` }}
            >
              <p className="text-sm font-semibold" style={{ color: BRAND.navy }}>
                ¿Tu pregunta no está aquí?
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: KOVA.muted, lineHeight: 1.65 }}>
                Un especialista responde en menos de 24 horas hábiles.
              </p>
              <Link
                to="/contacto"
                className="group inline-flex items-center gap-2 text-sm font-semibold mt-1 transition-colors hover:opacity-80"
                style={{ color: BRAND.blue }}
              >
                Escríbenos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map(({ icon: Icon, q, a, answer }, i) => {
              const accent = accentCycle[i % accentCycle.length];
              return (
                <AccordionItem
                  key={q}
                  value={`item-${i}`}
                  className="group border border-b-0 rounded-xl px-4 sm:px-5 transition-all duration-200 data-[state=open]:shadow-md data-[state=open]:border-[var(--faq-border)]"
                  style={{
                    background: KOVA.white,
                    borderColor: KOVA.border,
                    boxShadow: '0 1px 2px rgba(15,31,61,0.04), 0 4px 16px rgba(15,31,61,0.04)',
                    '--faq-border': accent.border,
                    '--faq-accent': accent.icon,
                  }}
                >
                  <AccordionTrigger
                    className="hover:no-underline py-4 sm:py-[18px] gap-4 [&>svg]:text-[#94A3B8] [&>svg]:w-4 [&>svg]:h-4 group-data-[state=open]:[&>svg]:text-[var(--faq-accent)]"
                    style={{ '--faq-accent': accent.icon }}
                  >
                    <span className="flex items-start sm:items-center gap-3.5 text-left flex-1 min-w-0">
                      <span
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-data-[state=open]:scale-105"
                        style={{ background: accent.bg }}
                      >
                        <Icon className="w-4 h-4" style={{ color: accent.icon }} strokeWidth={2} />
                      </span>
                      <span
                        className="text-[14px] sm:text-[15px] font-semibold leading-snug pt-1.5 sm:pt-0"
                        style={{ color: BRAND.navy }}
                      >
                        {q}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent
                    className="text-[13px] sm:text-sm leading-relaxed pb-5 sm:pb-[22px] pl-0 sm:pl-[3.25rem] pr-1 sm:pr-2"
                    style={{ color: KOVA.body, lineHeight: 1.75 }}
                  >
                    {answer ?? a}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

        </div>
      </div>
    </section>
  );
}
