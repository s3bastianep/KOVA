import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMotionValue, useSpring } from 'framer-motion';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useLandingPremiumMotion } from '@/hooks/useLandingPremiumMotion';
import CandidateSearchMorph from '@/components/landing/CandidateSearchMorph';
import '@/styles/landing-home-plain.css';
import '@/styles/landing-home-premium.css';

const WHATSAPP_NUMERO = '573000000000';
const CONTACT_EMAIL = 'hola@kova.com.co';

const DIMS = [
  { label: 'Compatibilidad comercial', pct: 94, color: '#c9d94f' },
  { label: 'Competencias de venta', pct: 89, color: '#d8f24c' },
  { label: 'Adaptabilidad', pct: 85, color: '#c9d94f' },
  { label: 'Comunicación', pct: 91, color: '#d8f24c' },
  { label: 'Alineación cultural', pct: 88, color: '#c9d94f' },
  { label: 'Potencial a largo plazo', pct: 82, color: '#c9d94f' },
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
    bg: 'rgba(255,255,255,0.03)',
    fg: '#F4F1EB',
    num: '#A39E96',
    sub: '#8A857C',
  },
  {
    n: '02',
    t: 'Volver a empezar desde cero',
    d: 'Publicar, filtrar y entrevistar otra vez.',
    bg: 'rgba(255,255,255,0.03)',
    fg: '#F4F1EB',
    num: '#A39E96',
    sub: '#8A857C',
  },
  {
    n: '03',
    t: 'Meses de inducción desperdiciados',
    d: 'Formación invertida que no se recupera.',
    bg: 'rgba(255,255,255,0.03)',
    fg: '#F4F1EB',
    num: '#A39E96',
    sub: '#8A857C',
  },
  {
    n: '04',
    t: 'Ventas que nunca ocurrieron',
    d: 'Cuota perdida mientras el cargo no rinde.',
    bg: 'rgba(255,255,255,0.03)',
    fg: '#F4F1EB',
    num: '#A39E96',
    sub: '#8A857C',
  },
  {
    n: '05',
    t: 'Clientes que podrían no volver',
    d: 'Una mala experiencia cierra puertas por años.',
    bg: 'rgba(255,255,255,0.03)',
    fg: '#F4F1EB',
    num: '#A39E96',
    sub: '#8A857C',
  },
  {
    n: '06',
    t: 'El ciclo vuelve a comenzar',
    d: 'El proceso se repite y el costo se acumula.',
    bg: 'rgba(201,217,79,0.14)',
    fg: '#F5F1E8',
    num: '#E4F070',
    sub: 'rgba(245,241,232,0.72)',
  },
];

const STAGES = [
  {
    num: '01',
    title: 'Entendemos su negocio',
    label: 'Cómo vende usted',
    desc: 'No empezamos buscando candidatos. Primero entendemos cómo vende su empresa, cómo funciona su operación comercial y qué necesita realmente el cargo. Solo así podemos definir el perfil adecuado e iniciar la búsqueda con un criterio claro.',
    bullets: [
      'Cliente ideal y mercado objetivo.',
      'Proceso, ciclo y complejidad de la venta.',
      'Tipo de venta: consultiva, técnica o transaccional.',
      'Apertura de mercado o desarrollo de cuentas.',
      'Rol, expectativas y nivel de desempeño esperado.',
    ],
  },
  {
    num: '02',
    title: 'Evaluamos con evidencia',
    label: 'Si puede vender',
    desc: 'Cada empresa vende de forma diferente. Por eso diseñamos las evaluaciones según el modelo comercial de su empresa, para medir cómo se desempeñaría cada candidato en el contexto real del cargo. Al finalizar, entregamos un informe detallado con la evidencia que respalda cada recomendación.',
    bullets: [
      'Evaluaciones diseñadas para su modelo comercial.',
      'Simulaciones basadas en situaciones reales de venta.',
      'Entrevistas por competencias comerciales.',
      'Evaluación de prospección, negociación y cierre.',
      'Informe detallado con fortalezas, riesgos y nivel de compatibilidad.',
    ],
  },
  {
    num: '03',
    title: 'Acompañamos la integración',
    label: 'Después de firmar',
    desc: 'Una buena contratación necesita una buena integración. Durante los primeros 90 días acompañamos el proceso para que el nuevo integrante se adapte a su equipo, entienda su modelo comercial y tenga las herramientas necesarias para empezar a generar resultados.',
    bullets: [
      'Plan de integración para los primeros 30 días.',
      'Seguimiento a los 30, 60 y 90 días.',
      'Monitoreo del proceso de adaptación y desempeño.',
      'Recomendaciones y ajustes cuando sea necesario.',
      'Cierre del proceso con la entrega al líder del equipo.',
    ],
  },
];

const PROCESS_FLOW = [
  { num: '01', title: 'Entendemos su negocio.' },
  { num: '02', title: 'Definimos el perfil ideal.' },
  { num: '03', title: 'Identificamos a los mejores candidatos.' },
  { num: '04', title: 'Evaluamos con evidencia.' },
  { num: '05', title: 'Acompañamos la integración.' },
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
    a: 'Una forma clara de ver qué tan bien encaja alguien con cómo vende su empresa.',
  },
  {
    q: '¿Qué obtiene?',
    a: 'Una lista corta de candidatos priorizados y una recomendación que puede defender.',
  },
  {
    q: '¿Cómo lo logramos?',
    a: 'Con un método propio. El detalle lo vemos juntos en la conversación — no en un brochure.',
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
  const pct = ((value - min) / (max - min)) * 100;

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
        style={{
          background: `linear-gradient(to right, #d8f24c 0%, #d8f24c ${pct}%, rgba(255,255,255,0.2) ${pct}%, rgba(255,255,255,0.2) 100%)`,
        }}
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
    title: 'Te ayudamos a encontrar vendedores que realmente den resultados',
    description:
      'Las mejores contrataciones comienzan entendiendo cómo vende su empresa, no revisando hojas de vida.',
    path: '/para-empresas',
  });
  useLandingPremiumMotion();

  useEffect(() => {
    document.documentElement.classList.add('kova-home-chrome');
    return () => document.documentElement.classList.remove('kova-home-chrome');
  }, []);

  const [activeStage, setActiveStage] = useState(0);
  const [salario, setSalario] = useState(5000000);
  const [form, setForm] = useState({ nombre: '', tel: '', empresa: '', msg: '' });

  // Subtle ambient light follow (Framer Motion springs → CSS vars)
  const mx = useMotionValue(50);
  const my = useMotionValue(30);
  const smx = useSpring(mx, { stiffness: 40, damping: 20, mass: 0.4 });
  const smy = useSpring(my, { stiffness: 40, damping: 20, mass: 0.4 });

  useEffect(() => {
    const root = document.querySelector('.kova-home-plain');
    if (!root) return undefined;
    const apply = () => {
      root.style.setProperty('--kh-mx', `${smx.get()}%`);
      root.style.setProperty('--kh-my', `${smy.get()}%`);
    };
    const ux = smx.on('change', apply);
    const uy = smy.on('change', apply);
    apply();
    return () => {
      ux();
      uy();
    };
  }, [smx, smy]);

  // Hero sequence: world search → explode → reunite → evaluation report
  const [heroView, setHeroView] = useState('morph'); // morph | report
  const [morphVisible, setMorphVisible] = useState(true);
  const [lit, setLit] = useState(false);
  const [scoreNum, setScoreNum] = useState(0);
  const onMorphComplete = useCallback(() => {
    setHeroView('report');
    // Keep particles a beat so they dissolve into the mockup instead of cutting off
    window.setTimeout(() => setMorphVisible(false), 560);
  }, []);

  useEffect(() => {
    if (heroView !== 'report') return undefined;
    const start = setTimeout(() => setLit(true), 160);
    return () => clearTimeout(start);
  }, [heroView]);

  useEffect(() => {
    if (!lit) return undefined;
    const target = 92;
    const durationMs = 1100;
    const startAt = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - startAt) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setScoreNum(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [lit]);

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
      `Hablemos de su próxima contratación: ${form.empresa.trim() || 'Kova'}`,
    )}&body=${encodeURIComponent(cuerpo)}`;
  };

  const sendWhatsApp = () => {
    const txt = `Hola Kova, soy ${form.nombre.trim() || '...'}${
      form.empresa.trim() ? ` de ${form.empresa.trim()}` : ''
    }. Quiero hablar de mi próxima contratación.${form.msg.trim() ? ` ${form.msg.trim()}` : ''}`;
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(txt)}`, '_blank');
  };

  return (
    <div
      className="kova-home-plain"
      onPointerMove={(e) => {
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        mx.set((e.clientX / w) * 100);
        my.set((e.clientY / h) * 100);
      }}
    >
      <header id="top" className="kh-hero">
        <div className="kh-hero__grid">
          <div>
            <span className="kh-pill">Hecho para equipos comerciales</span>
            <h1>
              Te ayudamos a encontrar vendedores que{' '}
              <span className="kh-accent">realmente den resultados</span>.
            </h1>
            <p className="kh-hero__lead">
              Las mejores contrataciones comienzan entendiendo cómo vende su empresa, no
              revisando hojas de vida.
            </p>
            <div className="kh-hero__ctas">
              <a href="#contacto" className="kh-btn kh-btn--lime">
                Hablemos de su próximo vendedor
                <span className="kh-btn__icon" aria-hidden>
                  ↗
                </span>
              </a>
              <a href="#metodologia" className="kh-btn kh-btn--outline">
                Así trabajamos
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
                <em>✓</em> No desaparecemos al firmar
              </span>
            </div>
          </div>

          <div
            className={`kh-hero__collage${
              heroView === 'morph' ? ' is-morphing' : ' is-revealed is-report'
            }`}
          >
            {morphVisible ? (
              <CandidateSearchMorph active={heroView === 'morph'} onComplete={onMorphComplete} />
            ) : null}
            <img
              className="kh-collage__photo kh-collage__photo--a"
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Ejecutiva comercial"
              loading="eager"
            />
            <img
              className="kh-collage__photo kh-collage__photo--b"
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Ejecutivo comercial"
              loading="eager"
            />
            <div className="kh-collage__chip" aria-hidden>
              <span className="kh-collage__chip-icon">✓</span>
              <span className="kh-collage__chip-text">
                <strong>Encaja</strong>
                Puede vender como ustedes
              </span>
            </div>
            <div className="kh-score-shell">
            <div className="kh-score">
              <div className="kh-score__top">
                <span className="kh-score__toplabel">Así se ve una evaluación</span>
                <span className="kh-score__live">
                  <span className="kh-pill__dot" aria-hidden />
                  Ejemplo
                </span>
              </div>
              <div className="kh-score__person">
                <div className="kh-score__avatar">ML</div>
                <div>
                  <div className="kh-score__name-row">
                    <span className="kh-score__name">Candidato ejemplo</span>
                  </div>
                  <div className="kh-score__meta">
                    <span className="kh-score__sub">Ejecutivo comercial · B2B consultivo</span>
                  </div>
                </div>
                <div className="kh-score__num">
                  <strong>{scoreNum}%</strong>
                  <span>Compatibilidad</span>
                </div>
              </div>
              <div className="kh-score__dims-label">Dimensiones del Kova Score</div>
              <div className="kh-dims" key={lit ? 'dims-on' : 'dims-off'}>
                {DIMS.map((d) => (
                  <div key={d.label} className="kh-dim">
                    <span className="kh-dim__label">{d.label}</span>
                    <div className="kh-dim__track">
                      <div
                        className="kh-dim__fill"
                        style={{ transform: `scaleX(${lit ? d.pct / 100 : 0})`, background: d.color }}
                      />
                    </div>
                    <span className="kh-dim__pct">{d.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="kh-score__stats" key={lit ? 'stats-on' : 'stats-off'}>
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
          </div>
        </div>

        <div className="kh-chart">
          <div className="kh-chart__head">
            <div className="kh-chart__cap">
              <strong>Contratar a ciegas</strong>
              <p>mucho riesgo, poca claridad</p>
            </div>
            <div className="kh-chart__cap kh-chart__cap--end">
              <strong>Contratar con Kova</strong>
              <p>menos sorpresas, más resultados</p>
            </div>
          </div>

          <svg
            className="kh-chart__svg"
            viewBox="0 0 1200 148"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="De contratar a ciegas a contratar con Kova"
          >
            <path
              d="M36,96 C78,128 118,128 160,96 C202,64 242,64 284,96 C326,128 366,128 408,96 C450,64 490,64 532,96 C564,120 592,112 620,96"
              fill="none"
              stroke="#5c574f"
              strokeWidth="1.9"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M36,96 C78,64 118,64 160,96 C202,128 242,128 284,96 C326,64 366,64 408,96 C450,128 490,128 532,96 C564,72 592,80 620,96"
              fill="none"
              stroke="#7a746a"
              strokeWidth="1.9"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M620,96 C760,94 900,68 1020,44 C1100,28 1155,26 1184,24"
              fill="none"
              stroke="#c9d94f"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="620" cy="96" r="5.5" fill="#c9d94f" stroke="#c9d94f" strokeWidth="1.8" />
            <circle cx="1020" cy="44" r="6.5" fill="#c9d94f" stroke="#c9d94f" strokeWidth="2.2" />
          </svg>
        </div>
      </header>

      <section
        className="kh-trust"
        aria-label="Para equipos comerciales en distintos sectores: Energía y minería, Manufactura, Consumo masivo, Servicios financieros, Tecnología"
      >
        <div className="kh-trust__inner">
          <p className="kh-trust__label">
            Para equipos comerciales
            <br />
            en distintos sectores
          </p>
          <div className="kh-trust__marquee" aria-hidden="true">
            <ul className="kh-trust__brands kh-trust__brands--track">
              {[
                'Energía y minería',
                'Manufactura',
                'Consumo masivo',
                'Servicios financieros',
                'Tecnología',
                'Energía y minería',
                'Manufactura',
                'Consumo masivo',
                'Servicios financieros',
                'Tecnología',
              ].map((sector, i) => (
                <li key={`${sector}-${i}`}>{sector}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="kh-section kh-section--tight kh-dolores-band">
        <div className="kh-wrap">
          <div className="kh-dolores-band__head">
            <h2 className="kh-h2 kh-dolores-band__title">
              <span className="kh-dolores-band__title-main">
                Una mala contratación comercial
                <br />
                afecta mucho más que las ventas.
              </span>
              <span className="kh-accent kh-dolores-band__title-punch">
                Afecta el crecimiento de toda la empresa.
              </span>
            </h2>
            <p className="kh-dolores-band__aside">
              Hay decisiones comerciales que cuestan más de lo que parecen.
              Contratar es una de ellas.
            </p>
          </div>

          <div className="kh-dolores-band__rail" aria-hidden>
            <span className="kh-dolores-band__rail-dot" />
            <span className="kh-dolores-band__rail-line" />
            <span className="kh-dolores-band__rail-target">
              <i />
              <i />
              <i />
            </span>
          </div>

          <div className="kh-dolores">
            {DOLORES.map((q) => (
              <article key={q.n} className="kh-dolor">
                <span className="kh-dolor__n">{q.n}</span>
                <span className="kh-dolor__rule" aria-hidden />
                <h3 className="kh-dolor__tag">{q.tag}</h3>
                <p>{q.text}</p>
              </article>
            ))}
          </div>

          <div className="kh-dolores-band__footer">
            <a href="#contacto" className="kh-dolores-band__go" aria-label="Ir a contacto">
              <span aria-hidden>→</span>
            </a>
            <p>
              En Kova convertimos la duda en{' '}
              <em>una decisión que puede defender</em>.
            </p>
          </div>
        </div>
      </section>

      <section id="calculadora" className="kh-section">
        <div className="kh-wrap">
          <div className="kh-costo-head">
            <h2 className="kh-h2 kh-h2--regular">
              Una mala contratación comercial no cuesta solo un salario.{' '}
              <span className="kh-accent">Cuesta todo esto.</span>
            </h2>
          </div>

          <div className="kh-costo-grid">
            <div className="kh-costos">
              {COSTOS.map((c, i) => (
                <div
                  key={c.n}
                  className={`kh-costo-card${i === COSTOS.length - 1 ? ' kh-costo-card--accent' : ''}`}
                >
                  <span className="kh-costo-card__n">{c.n}</span>
                  <div className="kh-costo-card__t">{c.t}</div>
                  <p className="kh-costo-card__d">{c.d}</p>
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
                Cuéntenos qué perfil necesita →
              </a>
              <p className="kh-calc__ref">
                Es una estimación con supuestos fijos. Sirve para ver el tamaño del problema.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="metodologia" className="kh-section">
        <div className="kh-wrap">
          <div className="kh-eyebrow">
            <span className="kh-eyebrow__dot" aria-hidden />
            <span className="kh-eyebrow__label">Así trabajamos</span>
          </div>
          <h2 className="kh-h2 kh-h2--regular" style={{ maxWidth: '22ch' }}>
            No empezamos por la hoja de vida.{' '}
            <span className="kh-accent">Empezamos por entender su negocio y el perfil que necesita</span>.
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
              Empecemos por entender su equipo →
            </a>
            <p>30 minutos · sin compromiso</p>
          </div>

          <div className="kh-perfil">
            <div className="kh-perfil__tag">Lo que cambia cuando define bien el perfil</div>
            <h3>
              Definir bien el perfil{' '}
              <span className="kh-accent">cambia toda la búsqueda</span>.
            </h3>
            <p className="kh-perfil__lead">
              La calidad de una contratación depende de la calidad del perfil. Cuando el cargo
              se define con precisión, la búsqueda deja de basarse en requisitos generales y
              empieza a enfocarse en las capacidades que realmente necesita su empresa.
            </p>
            <div className="kh-perfil-grid">
              <div className="kh-perfil-card kh-perfil-card--generic">
                <div className="kh-perfil-card__label">Perfil tradicional</div>
                <ul>
                  <li>Años de experiencia.</li>
                  <li>Competencias generales.</li>
                  <li>Requisitos estándar.</li>
                  <li>Habilidades blandas.</li>
                  <li>Funciones del cargo.</li>
                </ul>
              </div>
              <div className="kh-perfil-card kh-perfil-card--real">
                <div className="kh-perfil-card__label">Perfil definido para su empresa</div>
                <ul>
                  <li>Tipo de clientes que atenderá.</li>
                  <li>Modelo comercial que deberá dominar.</li>
                  <li>Ciclo de venta que gestionará.</li>
                  <li>Nivel de negociación que exige el cargo.</li>
                  <li>Resultados que se esperan del rol.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="metodo"
        className="kh-section kh-artifact"
        style={{ borderTop: '1px solid var(--kv-line)' }}
      >
        <div className="kh-wrap">
          <h2 className="kh-h2 kh-h2--regular" style={{ maxWidth: '14ch' }}>
            Nuestro <span className="kh-accent">método</span>
          </h2>
          <p className="kh-artifact__lead">
            Cada contratación importante merece un proceso claro. Por eso seguimos una
            metodología que nos permite entender su negocio, reducir el riesgo de una mala
            contratación y recomendar únicamente a los candidatos con mayor compatibilidad.
          </p>

          <ol className="kh-flow">
            {PROCESS_FLOW.map((step) => (
              <li key={step.num}>
                <span>
                  <em className="kh-flow__n">{step.num}</em>
                  {step.title}
                </span>
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

            <article className="kh-mock" aria-label="Ejemplo de shortlist priorizada">
              <div className="kh-mock__chrome">
                <span className="kh-mock__dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="kh-mock__file">shortlist priorizada</span>
              </div>
              <div className="kh-mock__body">
                <div className="kh-mock__head">
                  <span>Shortlist</span>
                  <em>Ejemplo</em>
                </div>
                <ul className="kh-mock__rank">
                  <li>
                    <span className="kh-mock__rank-n">1</span>
                    <span className="kh-mock__rank-name">Candidato A</span>
                    <span className="kh-mock__rank-score is-top">92%</span>
                  </li>
                  <li>
                    <span className="kh-mock__rank-n">2</span>
                    <span className="kh-mock__rank-name">Candidato B</span>
                    <span className="kh-mock__rank-score">81%</span>
                  </li>
                  <li>
                    <span className="kh-mock__rank-n">3</span>
                    <span className="kh-mock__rank-name">Candidato C</span>
                    <span className="kh-mock__rank-score">74%</span>
                  </li>
                </ul>
                <div className="kh-mock__result">
                  <span>Recomendación</span>
                  <strong>Priorizar Candidato A</strong>
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
              <div className="kh-perfil__tag">Así se ve una buena contratación</div>
              <p>
                <strong>{CASO.sector}</strong>
                <span aria-hidden> · </span>
                {CASO.role}
              </p>
            </div>
            <div className="kh-case-panel__stats">
              {CASO.items.map((item) => {
                const m = String(item.v).match(/^(\d+(?:[.,]\d+)?)(.*)$/);
                return (
                  <div key={item.k} className="kh-case-stat">
                    <span>{item.k}</span>
                    <strong
                      data-count-original={item.v}
                      data-count-value={m?.[1] ?? ''}
                      data-count-suffix={m?.[2] ?? ''}
                    >
                      {item.v}
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="kh-section kh-platform-band">
        <div className="kh-wrap">
          <div className="kh-platform">
            <header className="kh-platform__intro">
              <h2>
                Acompañamos la{' '}
                <span className="kh-accent">integración</span>
              </h2>
              <p className="kh-platform__lead">
                Contratar a la persona correcta es solo la mitad del camino. Muchas
                contrataciones fracasan durante los primeros meses por falta de seguimiento,
                expectativas poco claras o una integración deficiente. Por eso acompañamos los
                primeros 90 días para identificar riesgos a tiempo y proteger una decisión en
                la que su empresa ya invirtió tiempo, dinero y confianza.
              </p>
            </header>
            <div className="kh-platform__grid">
              <div>
                <strong>Integración al modelo comercial</strong>
                <span>
                  El nuevo integrante conoce cómo vende su empresa, cómo trabaja el equipo y qué
                  se espera de su rol desde el primer día.
                </span>
              </div>
              <div>
                <strong>Seguimiento estructurado</strong>
                <span>
                  Revisiones a los 30, 60 y 90 días para acompañar su adaptación y medir su
                  evolución.
                </span>
              </div>
              <div>
                <strong>Detección temprana de riesgos</strong>
                <span>
                  Identificamos brechas de adaptación, desempeño o alineación antes de que
                  afecten al equipo o al negocio.
                </span>
              </div>
              <div>
                <strong>Una contratación con mayor probabilidad de éxito</strong>
                <span>
                  Reducimos el riesgo de una salida temprana y aumentamos las posibilidades de
                  consolidar una contratación exitosa.
                </span>
              </div>
            </div>
            <div className="kh-platform__end">
              <p className="kh-platform__close">
                <span className="kh-platform__close-setup">Llenar una vacante es fácil.</span>
                <span className="kh-platform__close-punch">
                  Construir una contratación que siga generando resultados meses después es lo
                  que <em>realmente importa</em>.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="kh-contact">
        <div className="kh-contact__grid">
          <div className="kh-contact__copy">
            <h2>
              Hablemos de su próxima{' '}
              <span className="kh-accent">contratación</span>
            </h2>
            <p className="kh-contact__lead">
              Cuéntanos qué necesita tu empresa. Nosotros nos encargamos de entender el resto.
            </p>
            <ul className="kh-contact__checks">
              <li>
                <em aria-hidden>✓</em>
                <span>Primera conversación sin costo.</span>
              </li>
              <li>
                <em aria-hidden>✓</em>
                <span>Respuesta en menos de 24 horas.</span>
              </li>
              <li>
                <em aria-hidden>✓</em>
                <span>Acompañamiento durante los primeros 90 días.</span>
              </li>
            </ul>
          </div>

          <div className="kh-form">
            <div className="kh-form-row">
              <label>
                <span>Nombre</span>
                <input
                  type="text"
                  placeholder="¿Cómo se llama?"
                  value={form.nombre}
                  onChange={setField('nombre')}
                />
              </label>
              <label>
                <span>Teléfono o WhatsApp</span>
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
                placeholder="¿Cuál es el nombre de su empresa?"
                value={form.empresa}
                onChange={setField('empresa')}
              />
            </label>
            <label>
              <span>
                Cuéntenos sobre la vacante{' '}
                <span style={{ opacity: 0.6 }}>(opcional)</span>
              </span>
              <textarea
                rows={3}
                placeholder="¿Qué cargo busca? ¿Qué espera que logre esta persona? ¿Hay algún reto específico que quiera resolver?"
                value={form.msg}
                onChange={setField('msg')}
              />
            </label>
            <button type="button" className="kh-btn kh-btn--lime" onClick={sendMail}>
              Agendar una conversación
            </button>
            <button type="button" className="kh-btn kh-btn--wa" onClick={sendWhatsApp}>
              Hablar por WhatsApp
            </button>
            <p className="kh-form__note">Le responderemos en menos de 24 horas hábiles.</p>
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
              <a href="#metodologia">Así trabajamos</a>
              <a href="#calculadora">Costo real</a>
              <Link to="/guias">Blog</Link>
              <Link to="/registro">Empleo</Link>
              <a href="#contacto">Hablemos</a>
              <Link to="/login">Entrar</Link>
            </nav>
            <p className="kh-footer__copy">© 2026 Kova</p>
          </div>
        </div>
      </footer>

      <a
        className="kh-wa-float"
        href={`https://wa.me/${WHATSAPP_NUMERO}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
      >
        <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden focusable="false">
          <path
            fill="currentColor"
            d="M16.003 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.59 4.46 1.71 6.402L3.2 28.8l6.57-1.723a12.74 12.74 0 006.233 1.588h.005c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.8-12.805-12.665zM16.01 26.49h-.004a10.63 10.63 0 01-5.42-1.486l-.389-.231-4.028 1.057 1.075-3.928-.253-.403a10.6 10.6 0 01-1.626-5.7c0-5.867 4.774-10.64 10.646-10.64 2.842 0 5.514 1.108 7.523 3.12a10.57 10.57 0 013.117 7.526c-.003 5.867-4.777 10.638-10.644 10.638zm5.834-7.968c-.32-.16-1.892-.933-2.185-1.04-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.35-.498-2.571-1.587-.95-.848-1.592-1.895-1.779-2.215-.187-.32-.02-.493.14-.652.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.735-.986-2.375-.26-.624-.524-.539-.72-.549l-.613-.011c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667 0 1.573 1.146 3.093 1.306 3.307.16.213 2.253 3.44 5.46 4.827.763.33 1.36.527 1.824.674.767.244 1.464.21 2.016.127.615-.092 1.892-.773 2.159-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z"
          />
        </svg>
      </a>
    </div>
  );
}
