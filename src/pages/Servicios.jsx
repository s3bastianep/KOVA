import '@/styles/landing-wave-inner.css';
import '@/styles/landing-wave-servicios.css';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SiteLayout from '@/components/landing/SiteLayout';
import Reveal from '@/components/validate/Reveal';
import { usePageMeta } from '@/hooks/usePageMeta';

const HASH_TO_STAGE = {
  '#etapa-diagnostico': 'diagnostico',
  '#comprender': 'diagnostico',
  '#etapa-seleccion': 'seleccion',
  '#elegir': 'seleccion',
  '#etapa-integracion': 'integracion',
  '#acelerar': 'integracion',
};

const HERO_FLOW = ['Diagnóstico', 'Selección', 'Integración'];

const SITUATIONS = [
  {
    id: 'comprender',
    n: '01',
    verb: 'Comprender',
    title: 'No sabemos exactamente qué vendedor necesitamos.',
    body: 'Cada empresa vende de forma diferente. Antes de iniciar una búsqueda analizamos su modelo comercial para definir el perfil correcto.',
    cta: 'Conocer Diagnóstico Comercial',
    href: '#etapa-diagnostico',
  },
  {
    id: 'elegir',
    n: '02',
    verb: 'Elegir',
    title: 'Necesitamos contratar un vendedor.',
    body: 'Buscamos candidatos con alta compatibilidad para la forma en que vende su empresa.',
    cta: 'Conocer Selección Comercial',
    href: '#etapa-seleccion',
  },
  {
    id: 'acelerar',
    n: '03',
    verb: 'Acelerar',
    title: 'Ya contratamos y queremos acelerar los resultados.',
    body: 'Acompañamos la integración para reducir la curva de aprendizaje y facilitar que el nuevo vendedor adopte el modelo comercial de la empresa.',
    cta: 'Conocer Integración Comercial',
    href: '#etapa-integracion',
  },
];

const FRAMEWORK = [
  { key: 'entender', label: 'Entender', stage: 'diagnostico' },
  { key: 'disenar', label: 'Diseñar', stage: 'diagnostico' },
  { key: 'seleccionar', label: 'Seleccionar', stage: 'seleccion' },
  { key: 'integrar', label: 'Integrar', stage: 'integracion' },
  { key: 'seguir', label: 'Seguir', stage: 'integracion' },
];

const STAGES = {
  diagnostico: {
    id: 'etapa-diagnostico',
    n: '01',
    verb: 'Comprender',
    title: 'Diagnóstico Comercial',
    lead: 'Primero entendemos cómo vende su empresa.',
    body: [
      'No iniciamos la búsqueda con una descripción de cargo.',
      'La iniciamos entendiendo cómo funciona su proceso comercial.',
    ],
    listLabel: 'Analizamos aspectos como:',
    items: [
      'Tipo de cliente.',
      'Complejidad de la venta.',
      'Ticket promedio.',
      'Ciclo comercial.',
      'Venta técnica o consultiva.',
      'Competencias críticas.',
      'Objetivos del cargo.',
    ],
    resultTitle: 'Resultado',
    result: [
      'Una definición clara del vendedor que realmente necesita su empresa.',
      'No del vendedor “ideal”. Del vendedor correcto para su contexto.',
    ],
    cta: 'Solicitar Diagnóstico',
  },
  seleccion: {
    id: 'etapa-seleccion',
    n: '02',
    verb: 'Elegir',
    title: 'Selección Comercial',
    lead: 'Encontramos vendedores compatibles con su modelo comercial.',
    body: [
      'No elegimos únicamente por experiencia.',
      'Evaluamos si el candidato tiene las competencias necesarias para vender dentro de su realidad comercial.',
    ],
    listLabel: 'Nuestro proceso incluye:',
    items: [
      'Reclutamiento especializado.',
      'Entrevistas estructuradas.',
      'Simulaciones comerciales.',
      'Evaluación por competencias.',
      'Referencias.',
      'Ranking de candidatos.',
    ],
    resultTitle: 'Resultado',
    result: ['Una terna de candidatos con alta compatibilidad para el cargo.'],
    cta: 'Iniciar proceso',
  },
  integracion: {
    id: 'etapa-integracion',
    n: '03',
    verb: 'Acelerar',
    title: 'Integración Comercial',
    lead: 'La contratación es el inicio, no el final.',
    body: [
      'Una buena selección pierde valor si el vendedor no entiende rápidamente cómo debe vender en su nueva empresa.',
      'Por eso acompañamos la integración comercial.',
    ],
    listLabel: 'Trabajamos en aspectos como:',
    items: [
      'Portafolio.',
      'Proceso comercial.',
      'Prospección.',
      'Planeación.',
      'Seguimiento.',
      'Indicadores.',
      'Objetivos de los primeros 90 días.',
    ],
    resultTitle: 'Resultado',
    result: ['Una integración más estructurada y enfocada en la productividad.'],
    cta: 'Conocer Integración',
  },
};

const DELIVERABLES = [
  {
    etapa: 'Diagnóstico',
    items: ['Perfil comercial', 'Competencias', 'Riesgos', 'Recomendaciones'],
  },
  {
    etapa: 'Selección',
    items: ['Shortlist', 'Ranking', 'Evaluación', 'Informe'],
  },
  {
    etapa: 'Integración',
    items: ['Plan 30-60-90', 'Seguimiento', 'Acompañamiento', 'Indicadores'],
  },
];

const PRINCIPLE_FLOW = [
  'Modelo Comercial',
  'Perfil',
  'Compatibilidad',
  'Integración',
  'Resultados',
];

const PICKERS = [
  {
    need: 'Todavía no sabe qué perfil necesita.',
    go: 'Diagnóstico',
    href: '#etapa-diagnostico',
    n: '01',
    verb: 'Comprender',
  },
  {
    need: 'Necesita contratar.',
    go: 'Selección',
    href: '#etapa-seleccion',
    n: '02',
    verb: 'Elegir',
  },
  {
    need: 'Ya contrató.',
    go: 'Integración',
    href: '#etapa-integracion',
    n: '03',
    verb: 'Acelerar',
  },
];

export default function Servicios() {
  const { hash } = useLocation();
  const [activeStage, setActiveStage] = useState('diagnostico');
  const stage = STAGES[activeStage];

  usePageMeta({
    title: 'Sistema Kova',
    description:
      'Metodología para construir equipos comerciales de alto desempeño: diagnóstico, selección e integración diseñados para reducir el riesgo de contratación.',
    path: '/servicios',
  });

  useEffect(() => {
    const mapped = HASH_TO_STAGE[hash];
    if (!mapped) return undefined;
    setActiveStage(mapped);
    const targetId = hash.slice(1);
    const timer = window.setTimeout(() => {
      const node =
        document.getElementById(STAGES[mapped].id) ||
        document.getElementById(targetId);
      node?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <SiteLayout>
      <main className="kv-sistema">
        {/* HERO */}
        <section className="kv-sistema-hero">
          <div className="kv-wrap kv-sistema-hero__inner">
            <p className="kv-eyebrow font-mono">Sistema Kova</p>
            <h1 className="font-display kv-sistema-hero__title">
              Una metodología para construir equipos comerciales de alto
              desempeño.
            </h1>
            <p className="kv-sistema-hero__sub">
              Desde definir el perfil correcto hasta acelerar la integración del
              nuevo vendedor. Cada solución responde a una etapa crítica del
              proceso comercial y está diseñada para reducir el riesgo de
              contratación.
            </p>
            <Link to="/contacto" className="kv-btn-solid">
              Agendar un diagnóstico
            </Link>

            <ol className="kv-sistema-hero__flow" aria-label="Flujo del sistema">
              {HERO_FLOW.map((step, i) => (
                <li key={step}>
                  <span>{step}</span>
                  {i < HERO_FLOW.length - 1 ? (
                    <span className="kv-sistema-hero__arrow" aria-hidden>
                      ↓
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SITUATION */}
        <section className="kv-section kv-sistema-where" aria-labelledby="kv-where-title">
          <div className="kv-wrap">
            <div className="kv-sistema-intro">
              <span className="kv-section-tag kv-section-tag--lime font-mono">
                Tres puntos de entrada
              </span>
              <h2 id="kv-where-title" className="kv-h2 font-display">
                ¿Dónde está hoy su empresa?
              </h2>
              <p className="kv-sistema-lead">
                El Sistema Kova está compuesto por tres soluciones que pueden
                contratarse de forma independiente o como un proceso integral.
              </p>
            </div>

            <div className="kv-sistema-situations">
              {SITUATIONS.map((item) => (
                <Reveal key={item.id}>
                  <article className="kv-sistema-situation" id={item.id}>
                    <p className="kv-sistema-situation__meta font-mono">
                      <span>{item.n}</span>
                      <span>{item.verb}</span>
                    </p>
                    <h3 className="font-display">{item.title}</h3>
                    <p>{item.body}</p>
                    <a href={item.href} className="kv-sistema-link">
                      {item.cta}
                      <span aria-hidden>→</span>
                    </a>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FRAMEWORK + STAGES */}
        <section
          className="kv-section kv-sistema-framework"
          aria-labelledby="kv-framework-title"
        >
          <div className="kv-wrap">
            <div className="kv-sistema-intro kv-sistema-intro--center">
              <span className="kv-section-tag kv-section-tag--lime font-mono">
                El método
              </span>
              <h2 id="kv-framework-title" className="kv-h2 kv-h2--light font-display">
                El Sistema Kova
              </h2>
              <p className="kv-sistema-lead">
                Un recorrido continuo. Cada etapa se abre cuando su empresa la
                necesita.
              </p>
            </div>

            <div className="kv-sistema-steps" role="tablist" aria-label="Etapas del sistema">
              {FRAMEWORK.map((step, i) => {
                const selected = activeStage === step.stage;
                return (
                  <button
                    key={step.key}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    className={`kv-sistema-step${selected ? ' is-active' : ''}`}
                    onClick={() => setActiveStage(step.stage)}
                  >
                    <span className="kv-sistema-step__label font-mono">{step.label}</span>
                    {i < FRAMEWORK.length - 1 ? (
                      <span className="kv-sistema-step__sep" aria-hidden>
                        ↓
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div
              className="kv-sistema-stage"
              id={stage.id}
              role="tabpanel"
              key={stage.id}
            >
              <div className="kv-sistema-stage__head">
                <p className="kv-sistema-stage__meta font-mono">
                  <span>Etapa {stage.n}</span>
                  <span>{stage.verb}</span>
                </p>
                <h3 className="font-display">{stage.title}</h3>
                <p className="kv-sistema-stage__lead">{stage.lead}</p>
              </div>

              <div className="kv-sistema-stage__body">
                {stage.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}

                <p className="kv-sistema-stage__list-label">{stage.listLabel}</p>
                <ul className="kv-sistema-checks">
                  {stage.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="kv-sistema-result">
                  <p className="kv-sistema-result__label font-mono">{stage.resultTitle}</p>
                  {stage.result.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>

                <Link to="/contacto" className="kv-btn-solid">
                  {stage.cta}
                </Link>
              </div>
            </div>

            <div className="kv-sistema-stage-switch" aria-label="Cambiar de etapa">
              {Object.entries(STAGES).map(([key, s]) => (
                <button
                  key={key}
                  type="button"
                  className={`kv-sistema-stage-switch__btn${activeStage === key ? ' is-active' : ''}`}
                  onClick={() => setActiveStage(key)}
                  aria-pressed={activeStage === key}
                >
                  <span className="font-mono">{s.n}</span>
                  {s.verb}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* DELIVERABLES TABLE */}
        <section
          className="kv-section kv-sistema-table-section"
          aria-labelledby="kv-table-title"
        >
          <div className="kv-wrap">
            <div className="kv-sistema-intro">
              <span className="kv-section-tag kv-section-tag--lime font-mono">
                Entregables
              </span>
              <h2 id="kv-table-title" className="kv-h2 font-display">
                ¿Qué recibe en cada etapa?
              </h2>
            </div>

            <div className="kv-sistema-table-wrap">
              <table className="kv-sistema-table">
                <thead>
                  <tr>
                    {DELIVERABLES.map((col) => (
                      <th key={col.etapa} scope="col">
                        {col.etapa}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DELIVERABLES[0].items.map((_, rowIndex) => (
                    <tr key={DELIVERABLES[0].items[rowIndex]}>
                      {DELIVERABLES.map((col) => (
                        <td key={`${col.etapa}-${col.items[rowIndex]}`}>
                          {col.items[rowIndex]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PRINCIPLE */}
        <section
          className="kv-section kv-sistema-principle"
          aria-labelledby="kv-principle-title"
        >
          <div className="kv-wrap kv-sistema-principle__inner">
            <p className="kv-eyebrow font-mono">Principio</p>
            <h2 id="kv-principle-title" className="font-display">
              Todas nuestras soluciones comparten el mismo principio.
            </h2>
            <p className="kv-sistema-principle__statement">
              No buscamos al mejor vendedor.
              <br />
              Buscamos el vendedor correcto para la forma en que vende su
              empresa.
            </p>

            <ol className="kv-sistema-principle__flow" aria-label="Cadena de valor">
              {PRINCIPLE_FLOW.map((step, i) => (
                <li key={step}>
                  <span>{step}</span>
                  {i < PRINCIPLE_FLOW.length - 1 ? (
                    <span className="kv-sistema-principle__arrow" aria-hidden>
                      ↓
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PICKER */}
        <section
          className="kv-section kv-sistema-pick"
          aria-labelledby="kv-pick-title"
        >
          <div className="kv-wrap">
            <div className="kv-sistema-intro kv-sistema-intro--center">
              <h2 id="kv-pick-title" className="kv-h2 font-display">
                ¿Cuál solución necesita?
              </h2>
            </div>

            <div className="kv-sistema-pickers">
              {PICKERS.map((item) => (
                <Reveal key={item.go}>
                  <a href={item.href} className="kv-sistema-picker">
                    <p className="kv-sistema-picker__meta font-mono">
                      <span>{item.n}</span>
                      <span>{item.verb}</span>
                    </p>
                    <p className="kv-sistema-picker__need">{item.need}</p>
                    <p className="kv-sistema-picker__go">
                      → {item.go}
                    </p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="kv-section kv-sistema-cta" aria-label="Agendar conversación">
          <div className="kv-wrap kv-sistema-cta__inner">
            <h2 className="font-display">
              Construyamos juntos el equipo comercial que su empresa necesita.
            </h2>
            <p>
              Cuéntenos cómo vende su empresa y le recomendaremos la solución
              que mejor se adapte a su situación.
            </p>
            <Link to="/contacto" className="kv-btn-solid">
              Agendar conversación
            </Link>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
