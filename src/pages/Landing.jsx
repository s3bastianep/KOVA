import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import '@/styles/landing-home-plain.css';

const WHATSAPP_NUMERO = '573000000000';
const CONTACT_EMAIL = 'hola@kova.com.co';

const DIMS = [
  { label: 'Compatibilidad comercial', pct: 94, color: '#d8f24c' },
  { label: 'Competencias de venta', pct: 89, color: '#d8f24c' },
  { label: 'Adaptabilidad', pct: 85, color: '#d8f24c' },
  { label: 'Comunicación', pct: 91, color: '#d8f24c' },
  { label: 'Alineación cultural', pct: 88, color: '#d8f24c' },
  { label: 'Potencial a largo plazo', pct: 82, color: '#7E86EE' },
];

const DOLORES = [
  {
    n: '01',
    tag: 'Error de contratación',
    text: 'Contrató al candidato perfecto… y tres meses después seguía sin vender.',
  },
  {
    n: '02',
    tag: 'Rotación',
    text: 'Su mejor vendedor renunció y nadie logra reemplazar sus resultados.',
  },
  {
    n: '03',
    tag: 'Tiempo perdido',
    text: 'Pasan meses pagando salario mientras el nuevo vendedor todavía no despega.',
  },
  {
    n: '04',
    tag: 'Incertidumbre',
    text: 'Las ventas no despegan y no sabe si debe cambiar al vendedor o cambiar el proceso.',
  },
];

const COSTOS = [
  {
    n: '01',
    t: 'Horas de liderazgo desperdiciadas',
    d: 'Tiempo de jefatura gastado en corregir y acompañar.',
    bg: '#111311',
    fg: '#F4F5F0',
    num: '#d8f24c',
    sub: '#C0C4B8',
  },
  {
    n: '02',
    t: 'Volver a empezar desde cero',
    d: 'Publicar, filtrar y entrevistar otra vez.',
    bg: '#111311',
    fg: '#F4F5F0',
    num: '#d8f24c',
    sub: '#C0C4B8',
  },
  {
    n: '03',
    t: 'Meses de inducción desperdiciados',
    d: 'Formación invertida que no se recupera.',
    bg: '#111311',
    fg: '#F4F5F0',
    num: '#d8f24c',
    sub: '#C0C4B8',
  },
  {
    n: '04',
    t: 'Ventas que nunca ocurrieron',
    d: 'Cuota perdida mientras el cargo no rinde.',
    bg: '#111311',
    fg: '#F4F5F0',
    num: '#d8f24c',
    sub: '#C0C4B8',
  },
  {
    n: '05',
    t: 'Clientes que podrían no volver',
    d: 'Una mala experiencia cierra puertas por años.',
    bg: '#111311',
    fg: '#F4F5F0',
    num: '#d8f24c',
    sub: '#C0C4B8',
  },
  {
    n: '06',
    t: 'El ciclo vuelve a comenzar',
    d: 'El proceso se repite y el costo se acumula.',
    bg: '#d8f24c',
    fg: '#0A0B0A',
    num: '#0A0B0A',
    sub: 'rgba(10,11,10,0.7)',
  },
];

const STAGES = [
  {
    num: '01',
    title: 'Comprendemos',
    label: 'Entender el negocio',
    desc: 'Antes de iniciar la búsqueda analizamos su modelo comercial: cliente ideal, ciclo de venta, ticket promedio, tipo de venta, cultura y objetivos. Así definimos el perfil correcto antes de evaluar candidatos.',
    bullets: [
      'Cliente ideal y mercado objetivo',
      'Duración y complejidad del ciclo comercial',
      'Venta consultiva, técnica o transaccional',
      'Apertura de mercado o desarrollo de cuentas',
      'Cultura, liderazgo y objetivos del equipo',
    ],
  },
  {
    num: '02',
    title: 'Seleccionamos',
    label: 'Validar compatibilidad',
    desc: 'Evaluamos si el candidato puede vender como ustedes venden. Usamos pruebas, simulaciones y entrevistas estructurales, y lo condensamos en un Kova Score.',
    bullets: [
      'Simulaciones alineadas a su ciclo de venta',
      'Entrevistas por competencias comerciales',
      'Pruebas de manejo de objeciones y cierre',
      'Informe de compatibilidad (Kova Score)',
      'Shortlist priorizada con evidencia',
    ],
  },
  {
    num: '03',
    title: 'Acompañamos',
    label: 'Integrar al equipo',
    desc: 'Después de firmar, acompañamos los primeros 90 días para que la persona venda dentro de su modelo: meta del mes 1, revisiones y corrección de brechas a tiempo.',
    bullets: [
      'Plan de los primeros 30 días',
      'Revisiones a 30, 60 y 90 días',
      'Indicadores de avance comercial',
      'Ajustes sobre brechas detectadas',
      'Traspaso ordenado al liderazgo interno',
    ],
  },
];

const PROCESS_FLOW = [
  'Entendemos cómo vende',
  'Buscamos perfiles compatibles',
  'Los evaluamos en situaciones reales',
  'Presentamos solo a los mejores',
  'Acompañamos la integración',
];

const DIAG_CHECKS = [
  'Tipo de cliente',
  'Complejidad de venta',
  'Ticket promedio',
  'Cultura comercial',
  'Estilo de negociación',
];

const METHOD_POINTS = [
  {
    q: '¿Qué es el Kova Score?',
    a: 'Un índice de compatibilidad con el modelo comercial de su empresa.',
  },
  {
    q: '¿Qué obtiene?',
    a: 'Un ranking claro de candidatos y una recomendación objetiva.',
  },
  {
    q: '¿Cómo lo logramos?',
    a: 'Con una metodología propia que evalúa múltiples factores comerciales. El detalle lo vemos juntos en la conversación.',
  },
];

const CASO = {
  sector: 'Empresa industrial B2B',
  role: 'Ejecutivo de cuenta técnica',
  items: [
    { k: 'Tiempo de cierre', v: '28 días' },
    { k: 'Permanencia', v: '2 años+' },
    { k: 'Ramp-up esperado', v: '6 meses' },
    { k: 'Ramp-up logrado', v: '4 meses' },
  ],
};

function fmtMoney(n) {
  return `$${Math.round(n).toLocaleString('es-CO')}`;
}

function fmtCompact(n) {
  const v = Math.round(n / 1000000);
  return `$${v.toLocaleString('es-CO')}M`;
}

function CalcSlider({ label, value, display, min, max, step, onChange, minLabel, maxLabel }) {
  return (
    <div className="kh-calc__control">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label}: ${display}`}
      />
      <div className="kh-calc__range-labels">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      <div className="kh-calc__row kh-calc__row--live">
        <span>{label}</span>
        <span>{display}</span>
      </div>
    </div>
  );
}

export default function Landing() {
  usePageMeta({
    title: 'Selección comercial con evidencia',
    description:
      'Contrate talento comercial alineado con su estrategia de ventas. Empezamos entendiendo cómo vende su empresa.',
    path: '/',
  });

  const [activeStage, setActiveStage] = useState(0);
  const [salario, setSalario] = useState(5000000);
  const [form, setForm] = useState({ nombre: '', tel: '', empresa: '', msg: '' });

  const stage = STAGES[activeStage];

  const calc = useMemo(() => {
    const cargas = 1.52;
    const meses = 6;
    const mesesSeleccion = 2;
    const ratioCuota = 3;
    const mesesCuota = 4;
    const cSalarios = salario * cargas * meses;
    const cIndemnizacion = salario;
    const cProceso = salario * cargas * mesesSeleccion;
    const cVentas = salario * ratioCuota * mesesCuota;
    const total = cSalarios + cIndemnizacion + cProceso + cVentas;
    return { cSalarios, cIndemnizacion, cProceso, cVentas, total, periodo: meses + mesesSeleccion };
  }, [salario]);

  const setField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const sendMail = () => {
    const cuerpo = [
      `Nombre: ${form.nombre.trim()}`,
      `Empresa: ${form.empresa.trim()}`,
      `Teléfono: ${form.tel.trim()}`,
      '',
      form.msg.trim(),
    ].join('\n');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `Solicitud de consultoría: ${form.empresa.trim() || 'Kova'}`,
    )}&body=${encodeURIComponent(cuerpo)}`;
  };

  const sendWhatsApp = () => {
    const txt = `Hola Kova, soy ${form.nombre.trim() || '...'}${
      form.empresa.trim() ? ` de ${form.empresa.trim()}` : ''
    }. Quiero agendar un diagnóstico comercial.${form.msg.trim() ? ` ${form.msg.trim()}` : ''}`;
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(txt)}`, '_blank');
  };

  return (
    <div className="kova-home-plain">
      <header id="top" className="kh-hero">
        <div className="kh-hero__grid">
          <div>
            <span className="kh-pill">
              <span className="kh-pill__dot" aria-hidden />
              Selección comercial
            </span>
            <h1>
              Contrate talento comercial{' '}
              <span className="kh-accent">alineado con su estrategia de ventas</span>.
            </h1>
            <p className="kh-hero__lead">
              Las mejores contrataciones comienzan entendiendo cómo vende su empresa, no
              revisando hojas de vida.
            </p>
            <div className="kh-hero__ctas">
              <a href="#contacto" className="kh-btn kh-btn--lime">
                Agendar diagnóstico comercial
              </a>
              <a href="#metodologia" className="kh-btn kh-btn--outline">
                Ver cómo trabajamos
              </a>
            </div>
            <div className="kh-hero__checks">
              <span>
                <em>✓</em> Sin costo inicial
              </span>
              <span>
                <em>✓</em> Respuesta en 24 horas
              </span>
              <span>
                <em>✓</em> Acompañamiento los primeros 90 días
              </span>
            </div>
          </div>

          <div className="kh-score">
            <div className="kh-score__top">
              <span className="kh-score__toplabel">Informe de evaluación</span>
              <span className="kh-score__live">
                <span className="kh-pill__dot" aria-hidden />
                Ejemplo ilustrativo
              </span>
            </div>
            <div className="kh-score__person">
              <div className="kh-score__avatar">ML</div>
              <div>
                <div className="kh-score__name-row">
                  <span className="kh-score__name">Candidato ejemplo</span>
                  <span className="kh-score__badge">Recomendada</span>
                </div>
                <div className="kh-score__sub">Ejecutivo comercial · B2B consultivo</div>
              </div>
              <div className="kh-score__num">
                <strong>92</strong>
                <span>Kova Score</span>
              </div>
            </div>
            <div className="kh-score__dims-label">Dimensiones del Kova Score</div>
            <div className="kh-dims">
              {DIMS.map((d) => (
                <div key={d.label} className="kh-dim">
                  <span className="kh-dim__label">{d.label}</span>
                  <div className="kh-dim__track">
                    <div
                      className="kh-dim__fill"
                      style={{ width: `${d.pct}%`, background: d.color }}
                    />
                  </div>
                  <span className="kh-dim__pct">{d.pct}%</span>
                </div>
              ))}
            </div>
            <div className="kh-score__stats">
              <div className="kh-score__stat">
                <strong>88%</strong>
                <span>Probabilidad de éxito</span>
              </div>
              <div className="kh-score__stat">
                <strong>95%</strong>
                <span>Potencial de cuota</span>
              </div>
              <div className="kh-score__stat">
                <strong className="is-lime">Bajo</strong>
                <span>Riesgo a 12 meses</span>
              </div>
            </div>
          </div>
        </div>

        <div className="kh-chart">
          <div className="kh-chart__head">
            <div className="kh-chart__cap">
              <strong>Percepción</strong>
              <p>sin evidencia ni estructura</p>
            </div>
            <div className="kh-chart__cap kh-chart__cap--end">
              <strong>Decisión clara</strong>
              <p>al trabajar con nosotros</p>
            </div>
          </div>

          <svg
            className="kh-chart__svg"
            viewBox="0 0 1200 148"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="De la percepción a una decisión clara al trabajar con Kova"
          >
            <path
              d="M36,96 C78,128 118,128 160,96 C202,64 242,64 284,96 C326,128 366,128 408,96 C450,64 490,64 532,96 C564,120 592,112 620,96"
              fill="none"
              stroke="#E0554E"
              strokeWidth="1.9"
              strokeLinecap="round"
              opacity="0.72"
            />
            <path
              d="M36,96 C78,64 118,64 160,96 C202,128 242,128 284,96 C326,64 366,64 408,96 C450,128 490,128 532,96 C564,72 592,80 620,96"
              fill="none"
              stroke="#4B54E6"
              strokeWidth="1.9"
              strokeLinecap="round"
              opacity="0.72"
            />
            <path
              d="M620,96 C760,94 900,68 1020,44 C1100,28 1155,26 1184,24"
              fill="none"
              stroke="#d8f24c"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="620" cy="96" r="5.5" fill="#0A0B0A" stroke="#C0C4B8" strokeWidth="1.8" />
            <circle cx="1020" cy="44" r="6.5" fill="#0A0B0A" stroke="#d8f24c" strokeWidth="2.2" />
          </svg>
        </div>
      </header>

      <section className="kh-trust">
        <div className="kh-trust__inner">
          <span className="kh-trust__label">
            Para equipos comerciales en distintos sectores
          </span>
          <div className="kh-trust__brands">
            <span>Energía y minería</span>
            <span>Manufactura</span>
            <span>Consumo masivo</span>
            <span>Servicios financieros</span>
            <span>Tecnología</span>
          </div>
        </div>
      </section>

      <section className="kh-section kh-section--tight">
        <div className="kh-wrap">
          <div className="kh-eyebrow">
            <span className="kh-eyebrow__dot" aria-hidden />
            <span className="kh-eyebrow__label">¿Le pasó algo así?</span>
          </div>
          <h2 className="kh-h2" style={{ maxWidth: '18ch' }}>
            Si dirige un equipo comercial, probablemente{' '}
            <span className="kh-accent">este problema ya le costó dinero</span>.
          </h2>
          <div className="kh-dolores">
            {DOLORES.map((q) => (
              <div key={q.n} className="kh-dolor">
                <div className="kh-dolor__top">
                  <span className="kh-dolor__n">{q.n}</span>
                  <span className="kh-dolor__tag">{q.tag}</span>
                </div>
                <p>{q.text}</p>
              </div>
            ))}
          </div>
          <p className="kh-mirror-close">
            No es mala suerte: es contratar sin validar si{' '}
            <span className="kh-accent">encajan con cómo vende su empresa</span>.
          </p>
        </div>
      </section>

      <section id="calculadora" className="kh-section">
        <div className="kh-wrap">
          <div className="kh-eyebrow">
            <span className="kh-eyebrow__dot" aria-hidden />
            <span className="kh-eyebrow__label">El costo real</span>
          </div>
          <div className="kh-costo-head">
            <h2 className="kh-h2 kh-h2--regular">
              Un mal fichaje comercial no se paga solo con el salario.{' '}
              <span className="kh-accent">Se paga con todo esto.</span>
            </h2>
          </div>

          <div className="kh-costo-grid">
            <div className="kh-costos">
              {COSTOS.map((c) => (
                <div
                  key={c.n}
                  className="kh-costo-card"
                  style={{ background: c.bg, color: c.fg }}
                >
                  <span className="kh-costo-card__n" style={{ color: c.num }}>
                    {c.n}
                  </span>
                  <div className="kh-costo-card__t">{c.t}</div>
                  <p className="kh-costo-card__d" style={{ color: c.sub }}>
                    {c.d}
                  </p>
                </div>
              ))}
            </div>

            <div className="kh-calc">
              <div className="kh-calc__tag">
                <span className="kh-pill__dot" aria-hidden />
                <span>Calculadora de riesgo</span>
              </div>
              <h3>¿Cuánto le cuesta contratar al vendedor equivocado?</h3>

              <CalcSlider
                label="Salario mensual del cargo"
                value={salario}
                display={fmtMoney(salario)}
                min={2000000}
                max={20000000}
                step={500000}
                onChange={setSalario}
                minLabel="$2.000.000"
                maxLabel="$20.000.000"
              />

              <div className="kh-calc__rows">
                <div className="kh-calc__row">
                  <span>Salarios + carga prestacional (6 meses)</span>
                  <span>{fmtCompact(calc.cSalarios)}</span>
                </div>
                <div className="kh-calc__row">
                  <span>Indemnización por despido sin justa causa</span>
                  <span>{fmtCompact(calc.cIndemnizacion)}</span>
                </div>
                <div className="kh-calc__row">
                  <span>Selección e inducción (2 meses)</span>
                  <span>{fmtCompact(calc.cProceso)}</span>
                </div>
                <div className="kh-calc__row">
                  <span>Cuota incumplida (estimada)</span>
                  <span>{fmtCompact(calc.cVentas)}</span>
                </div>
              </div>

              <div className="kh-calc__total">
                <div>
                  <div className="kh-calc__total-label">Costo estimado</div>
                  <div className="kh-calc__total-value">{fmtCompact(calc.total)}</div>
                  <p className="kh-calc__total-sub">en ~{calc.periodo} meses</p>
                </div>
              </div>

              <a href="#contacto" className="kh-btn kh-btn--lime">
                Quiero un diagnóstico comercial →
              </a>
              <p className="kh-calc__ref">
                Cálculo estimado con supuestos fijos de mercado; úselo como referencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="metodologia" className="kh-section">
        <div className="kh-wrap">
          <div className="kh-eyebrow">
            <span className="kh-eyebrow__dot" aria-hidden />
            <span className="kh-eyebrow__label">Cómo trabajamos</span>
          </div>
          <h2 className="kh-h2 kh-h2--regular" style={{ maxWidth: '22ch' }}>
            Nuestro proceso no empieza con candidatos.{' '}
            <span className="kh-accent">Empieza con su negocio</span>.
          </h2>

          <div className="kh-method-grid">
            <div className="kh-stages" role="tablist" aria-label="Pasos del proceso">
              {STAGES.map((s, i) => (
                <button
                  key={s.num}
                  type="button"
                  role="tab"
                  aria-selected={i === activeStage}
                  className={`kh-stage-btn${i === activeStage ? ' is-active' : ''}`}
                  onClick={() => setActiveStage(i)}
                >
                  <span className="kh-stage-btn__n">{s.num}</span>
                  <span className="kh-stage-btn__t">{s.title}</span>
                  <span className="kh-stage-btn__label">{s.label}</span>
                </button>
              ))}
            </div>
            <div className="kh-stage-panel" role="tabpanel">
              <div className="kh-stage-panel__head">
                {stage.num} · {stage.title}
              </div>
              <p className="kh-stage-panel__desc">{stage.desc}</p>
              <div className="kh-stage-panel__bullets">
                {stage.bullets.map((b) => (
                  <div key={b}>
                    <em>→</em>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="kh-method-cta">
            <a href="#contacto" className="kh-btn kh-btn--outline-lime">
              Agendar diagnóstico comercial →
            </a>
            <p>30 minutos · sin compromiso</p>
          </div>

          <div className="kh-perfil">
            <div className="kh-perfil__tag">Entregable del perfil</div>
            <h3>
              El aviso genérico no selecciona bien.{' '}
              <span className="kh-accent">El perfil real del cargo, sí.</span>
            </h3>
            <div className="kh-perfil-grid">
              <div className="kh-perfil-card kh-perfil-card--generic">
                <div className="kh-perfil-card__label">Perfil genérico</div>
                <ul>
                  <li>&quot;Experiencia mínima de 3 años&quot;</li>
                  <li>&quot;Buena actitud y trabajo en equipo&quot;</li>
                  <li>&quot;Orientado a resultados&quot;</li>
                  <li>&quot;Manejo de Office&quot;</li>
                </ul>
              </div>
              <div className="kh-perfil-card kh-perfil-card--real">
                <div className="kh-perfil-card__label">Perfil real</div>
                <ul>
                  <li>
                    Puede <strong>abrir mercado</strong> en minería
                  </li>
                  <li>
                    Vende <strong>soluciones técnicas B2B</strong>, no solo producto
                  </li>
                  <li>
                    Soporta <strong>ciclos de venta de 6 meses</strong>
                  </li>
                  <li>
                    Negocia con <strong>gerentes de mantenimiento</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="metodo" className="kh-section kh-artifact" style={{ borderTop: '1px solid rgba(244,245,240,0.07)' }}>
        <div className="kh-wrap">
          <div className="kh-eyebrow">
            <span className="kh-eyebrow__dot" aria-hidden />
            <span className="kh-eyebrow__label">Así funciona Kova</span>
          </div>
          <h2 className="kh-h2 kh-h2--regular" style={{ maxWidth: '16ch' }}>
            Un método propio.{' '}
            <span className="kh-accent">Resultados claros</span>.
          </h2>
          <p className="kh-artifact__lead">
            No improvisamos. Hay un proceso. El detalle de cómo lo ejecutamos lo reservamos para
            la conversación con usted.
          </p>

          <ol className="kh-flow">
            {PROCESS_FLOW.map((step) => (
              <li key={step}>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="kh-mocks">
            <article className="kh-mock" aria-label="Ejemplo de resultado del diagnóstico">
              <div className="kh-mock__chrome">
                <span className="kh-mock__dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="kh-mock__file">diagnóstico comercial</span>
              </div>
              <div className="kh-mock__body">
                <div className="kh-mock__head">
                  <span>Diagnóstico</span>
                  <em>Ejemplo</em>
                </div>
                <ul className="kh-mock__checks">
                  {DIAG_CHECKS.map((item) => (
                    <li key={item}>
                      <em>✓</em>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="kh-mock__result">
                  <span>Resultado</span>
                  <strong>Perfil Hunter Consultivo</strong>
                </div>
              </div>
            </article>

            <article className="kh-mock kh-mock--score" aria-label="Ejemplo de Kova Score">
              <div className="kh-mock__chrome">
                <span className="kh-mock__dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="kh-mock__file">kova score</span>
              </div>
              <div className="kh-mock__body kh-mock__body--score">
                <div className="kh-mock__score-big">
                  <span className="kh-mock__score-label">Kova Score</span>
                  <strong>92%</strong>
                  <span className="kh-mock__score-level">Compatibilidad alta</span>
                  <div className="kh-mock__score-bar" aria-hidden>
                    <div style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="kh-method-qa">
            {METHOD_POINTS.map((item) => (
              <div key={item.q} className="kh-method-qa__item">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>

          <div className="kh-case-panel kh-case-panel--compact">
            <div className="kh-case-panel__copy">
              <div className="kh-perfil__tag">Caso ilustrativo</div>
              <p>
                <strong>{CASO.sector}</strong>
                <span aria-hidden> · </span>
                {CASO.role}
              </p>
            </div>
            <div className="kh-case-panel__stats">
              {CASO.items.map((item) => (
                <div key={item.k} className="kh-case-stat">
                  <span>{item.k}</span>
                  <strong>{item.v}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="kh-section">
        <div className="kh-wrap">
          <div className="kh-platform">
            <div className="kh-eyebrow">
              <span className="kh-eyebrow__dot" aria-hidden />
              <span className="kh-eyebrow__label kh-eyebrow__label--lime">
                Después de firmar
              </span>
            </div>
            <h2>
              La contratación no termina con el contrato.{' '}
              <span className="kh-accent">Ahí empieza a probarse el encaje.</span>
            </h2>
            <p className="kh-platform__lead">
              Durante los primeros 90 días acompañamos la integración del nuevo vendedor para
              acelerar su productividad y detectar desviaciones antes de que afecten los
              resultados.
            </p>
            <div className="kh-platform__grid">
              <div>
                <strong>Proceso comercial documentado</strong>
                <span>cómo se vende en su empresa, claro para el rol</span>
              </div>
              <div>
                <strong>Seguimiento con indicadores</strong>
                <span>revisión estructurada a 30, 60 y 90 días</span>
              </div>
              <div>
                <strong>Corrección temprana</strong>
                <span>brechas detectadas antes de que duelan</span>
              </div>
              <div>
                <strong>Consistencia comercial</strong>
                <span>mismo criterio en el equipo, menos improvisación</span>
              </div>
            </div>
            <p className="kh-platform__close">
              El verdadero éxito no es llenar una vacante. Es que el vendedor siga generando
              resultados <em>seis meses después</em>.
            </p>
            <a href="#contacto" className="kh-btn kh-btn--lime">
              Quiero reducir el riesgo de contratación →
            </a>
          </div>
        </div>
      </section>

      <section id="contacto" className="kh-contact">
        <div className="kh-contact__grid">
          <div className="kh-contact__copy">
            <div className="kh-eyebrow">
              <span className="kh-eyebrow__dot" aria-hidden />
              <span className="kh-eyebrow__label">Conversemos</span>
            </div>
            <h2>
              Descubramos qué vendedor{' '}
              <span className="kh-accent">necesita realmente</span> su empresa.
            </h2>
            <p className="kh-contact__lead">
              Todo comienza con una conversación de 30 minutos. Sin compromiso.
              Aterrizamos su modelo comercial y el perfil con más probabilidad de
              éxito, sin partir de la hoja de vida.
            </p>
            <ul className="kh-contact__checks">
              <li>
                <em aria-hidden>✓</em>
                <span>Diagnóstico inicial sin costo</span>
              </li>
              <li>
                <em aria-hidden>✓</em>
                <span>Respuesta en menos de 24 horas</span>
              </li>
              <li>
                <em aria-hidden>✓</em>
                <span>Acompañamiento los primeros 90 días</span>
              </li>
            </ul>
          </div>

          <div className="kh-form">
            <div className="kh-form-row">
              <label>
                <span>Nombre</span>
                <input
                  type="text"
                  placeholder="Cómo se llama"
                  value={form.nombre}
                  onChange={setField('nombre')}
                />
              </label>
              <label>
                <span>Teléfono / WhatsApp</span>
                <input
                  type="tel"
                  placeholder="+57"
                  value={form.tel}
                  onChange={setField('tel')}
                />
              </label>
            </div>
            <label>
              <span>Empresa</span>
              <input
                type="text"
                placeholder="Nombre de la empresa"
                value={form.empresa}
                onChange={setField('empresa')}
              />
            </label>
            <label>
              <span>
                Cuéntenos su reto <span style={{ opacity: 0.6 }}>(opcional)</span>
              </span>
              <textarea
                rows={2}
                placeholder="Qué perfil busca o cuál es el reto de su equipo comercial"
                value={form.msg}
                onChange={setField('msg')}
              />
            </label>
            <button type="button" className="kh-btn kh-btn--lime" onClick={sendMail}>
              Agendar diagnóstico comercial
            </button>
            <button type="button" className="kh-btn kh-btn--wa" onClick={sendWhatsApp}>
              Escribir por WhatsApp
            </button>
            <p className="kh-form__note">Le respondemos en menos de 24 horas hábiles.</p>
          </div>
        </div>
      </section>

      <footer className="kh-footer">
        <div className="kh-footer__inner">
          <div className="kh-footer__top">
            <a href="#top" className="kh-footer__brand">
              kova<span>.</span>
            </a>
            <nav className="kh-footer__nav" aria-label="Pie de página">
              <a href="#metodologia">Metodología</a>
              <Link to="/servicios">Servicios</Link>
              <a href="#calculadora">Costo real</a>
              <Link to="/guias">Blog</Link>
              <Link to="/registro">Empleo</Link>
              <a href="#contacto">Agendar</a>
              <Link to="/login">Entrar</Link>
            </nav>
          </div>
          <div className="kh-footer__bottom">
            <p className="kh-footer__copy">© 2026 Kova</p>
            <a className="kh-footer__mail" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
