import '@/lib/loadLandingPagesStyles';
import {
  BarChart3,
  Building2,
  Search,
  Target,
  UserCheck,
  Users,
} from 'lucide-react';
import SiteLayout from '@/components/landing/SiteLayout';
import InnerPageHero from '@/components/landing/InnerPageHero';
import PageCta from '@/components/landing/PageCta';
import { CN_CTA_LABEL } from '@/theme/landingConsult';
import HeroReportCard from '@/components/validate/HeroReportCard';

const toneClass = {
  indigo: 'kv-step-badge--indigo',
  lime: 'kv-step-badge--lime',
  rose: 'kv-step-badge--rose',
  ink: 'kv-step-badge--ink',
};

const publico = [
  {
    icon: Users,
    title: 'Equipos comerciales en crecimiento',
    body: 'Empresas que necesitan contratar vendedores con criterio, sin ampliar el equipo de selección interno.',
  },
  {
    icon: Building2,
    title: 'Sin reclutador comercial dedicado',
    body: 'Dirección comercial o talento humano que necesita un partner especializado en perfiles de ventas.',
  },
  {
    icon: Target,
    title: 'Contrataciones que no funcionaron',
    body: 'Organizaciones que ya vivieron una mala contratación comercial y quieren un proceso con evidencia.',
  },
  {
    icon: UserCheck,
    title: 'Vacantes comerciales exigentes',
    body: 'Roles donde la entrevista sola no basta: venta consultiva, ciclos largos o productos técnicos.',
  },
];

const pasos = [
  {
    n: '01',
    label: 'Diagnosticar',
    tone: 'indigo',
    title: 'Entendemos su negocio antes de buscar',
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
    tone: 'lime',
    title: 'Construimos evaluaciones personalizadas para su vacante',
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
    tone: 'rose',
    title: 'Buscamos, evaluamos y comparamos con el mismo criterio',
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
    tone: 'ink',
    title: 'Recibe candidatos listos para decidir, con respaldo completo',
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
    icon: BarChart3,
    title: 'Metodología estructurada',
    items: [
      'Pruebas de habilidades personalizadas por vacante',
      'Kova Score como índice predictivo de desempeño',
      'Evaluación uniforme para todos los candidatos',
      'Informe comparativo con evidencia por competencia',
    ],
  },
  consultor: {
    icon: Search,
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
    <article
      className={`kv-process-step kv-process-step--${paso.tone}${isLast ? ' kv-process-step--last' : ''}`}
    >
      <span className={`kv-step-badge kv-step-badge--sm font-display ${toneClass[paso.tone]}`}>
        {paso.n}
      </span>
      <div className="kv-process-step-body">
        <p className="kv-process-step-label font-mono">{paso.label}</p>
        <h3 className="kv-process-step-title font-display">{paso.title}</h3>
        <p className="kv-process-step-desc">{paso.desc}</p>
        <ul className="kv-process-items">
          {paso.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="kv-process-highlight">{paso.highlight}</p>
      </div>
    </article>
  );
}

export default function ComoTrabajamos() {
  const MetodologiaIcon = enfoque.metodologia.icon;
  const ConsultorIcon = enfoque.consultor.icon;

  return (
    <SiteLayout>
      <main>
        <InnerPageHero
          eyebrow="Nuestra metodología"
          title="Una metodología diseñada para reducir el riesgo de contratar mal"
          subtitle="No evaluamos candidatos desde el primer día. Primero entendemos cómo vende su empresa, definimos el perfil comercial correcto y solo entonces evaluamos quién realmente puede generar resultados en su organización."
          ctaLabel={CN_CTA_LABEL}
        />

        <div className="kv-page-band kv-page-band--light">
          <section className="kv-section">
            <div className="kv-wrap">
              <div className="kv-section-head-center">
                <span className="kv-section-tag font-mono">Para quién</span>
                <h2 className="kv-h2 font-display">Para quién está diseñado</h2>
                <p className="kv-section-lead">
                  Kova está pensado para empresas que contratan talento comercial y necesitan un proceso
                  riguroso, no más volumen de currículums.
                </p>
              </div>
              <div className="kv-audience-grid">
                {publico.map(({ icon: Icon, title, body }) => (
                  <article key={title} className="kv-audience-card">
                    <div className="kv-audience-icon" aria-hidden>
                      <Icon strokeWidth={2} />
                    </div>
                    <h3 className="font-display">{title}</h3>
                    <p>{body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="kv-section kv-section--paper-2">
            <div className="kv-wrap kv-process-wrap">
              <header className="kv-section-head kv-process-header">
                <span className="kv-section-tag font-mono">Proceso</span>
                <h2 className="kv-h2 font-display">Cómo funciona</h2>
                <p className="kv-section-lead">
                  Un proceso estructurado en cuatro etapas. Usted sabe qué esperar en cada fase y qué recibe
                  al final.
                </p>
              </header>
              <div className="kv-process-steps">
                {pasos.map((paso, i) => (
                  <ProcesoStep key={paso.n} paso={paso} isLast={i === pasos.length - 1} />
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="kv-page-band kv-page-band--dark">
          <section className="kv-section kv-enfoque-section">
            <div className="kv-wrap">
              <div className="kv-section-head-center kv-enfoque-head">
                <span className="kv-enfoque-eyebrow font-mono">Metodología + consultor</span>
                <h2 className="kv-h2 font-display">Nuestro enfoque</h2>
                <p className="kv-section-lead">
                  Combinamos evaluación estructurada con acompañamiento de un consultor especializado en
                  selección comercial.
                </p>
              </div>
              <div className="kv-enfoque-grid">
                <article className="kv-enfoque-card">
                  <div className="kv-enfoque-icon" aria-hidden>
                    <MetodologiaIcon strokeWidth={2} />
                  </div>
                  <h3 className="font-display">{enfoque.metodologia.title}</h3>
                  <ul className="kv-enfoque-list">
                    {enfoque.metodologia.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
                <article className="kv-enfoque-card kv-enfoque-card--accent">
                  <div className="kv-enfoque-icon kv-enfoque-icon--highlight" aria-hidden>
                    <ConsultorIcon strokeWidth={2} />
                  </div>
                  <h3 className="font-display">{enfoque.consultor.title}</h3>
                  <ul className="kv-enfoque-list">
                    {enfoque.consultor.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </section>
        </div>

        <div className="kv-page-band kv-page-band--light">
          <section className="kv-section kv-section--paper-2">
            <div className="kv-wrap">
              <div className="kv-section-head-center">
                <span className="kv-section-tag font-mono">Ejemplo de entregable</span>
                <h2 className="kv-h2 font-display">Lo que recibe</h2>
                <p className="kv-section-lead">
                  Cada candidato llega con evaluación por competencias, Kova Score, evidencia documentada y
                  recomendación para su decisión de contratación.
                </p>
              </div>
              <div className="kv-deliverable-stage">
                <div className="kv-deliverable-mockup">
                  <HeroReportCard />
                </div>
              </div>
            </div>
          </section>
        </div>

        <PageCta />
      </main>
    </SiteLayout>
  );
}
