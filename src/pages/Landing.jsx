import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMotionValue, useSpring } from 'framer-motion';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useLandingPremiumMotion } from '@/hooks/useLandingPremiumMotion';
import CandidateSearchMorph from '@/components/landing/CandidateSearchMorph';
import { CONTACT_BOOKING_PATH, buildWhatsAppUrl } from '@/lib/contact';
import '@/styles/landing-home-plain.css';
import '@/styles/landing-home-premium.css';

const DIMS = [
  { label: 'Compatibilidad comercial', pct: 94, color: '#c5de4e' },
  { label: 'Competencias de venta', pct: 89, color: '#c5de4e' },
  { label: 'Adaptabilidad', pct: 85, color: '#c5de4e' },
  { label: 'Comunicación', pct: 91, color: '#c5de4e' },
  { label: 'Alineación con la empresa', pct: 88, color: '#c5de4e' },
  { label: 'Potencial de desarrollo', pct: 82, color: '#c5de4e' },
];

const DOLORES = [
  {
    n: '01',
    tag: 'Contratación equivocada',
    text: 'El candidato tenía experiencia, pero nunca logró adaptarse a la forma de vender de tu empresa.',
  },
  {
    n: '02',
    tag: 'Rotación constante',
    text: 'Los buenos vendedores se van porque el perfil y la empresa nunca estuvieron realmente alineados.',
  },
  {
    n: '03',
    tag: 'Meses sin resultados',
    text: 'El tiempo pasa entre inducción, capacitación y adaptación, mientras las metas comerciales siguen esperando.',
  },
  {
    n: '04',
    tag: 'Decisiones sin certeza',
    text: 'Cuando las ventas no llegan, es difícil saber si el problema está en el perfil, el proceso comercial o ambos.',
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
    num: '#c5de4e',
    sub: 'rgba(245,241,232,0.72)',
  },
];

const STAGES = [
  {
    num: '01',
    title: 'Entendemos tu negocio',
    label: 'Cómo vendes tú',
    desc: 'No empezamos buscando candidatos. Primero entendemos cómo vende tu empresa, cómo funciona tu operación comercial y qué necesita realmente el cargo. Solo así podemos definir el perfil adecuado e iniciar la búsqueda con un criterio claro.',
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
    desc: 'Cada empresa vende de forma diferente. Por eso diseñamos las evaluaciones según el modelo comercial de tu empresa, para medir cómo se desempeñaría cada candidato en el contexto real del cargo. Al finalizar, entregamos un informe detallado con la evidencia que respalda cada recomendación.',
    bullets: [
      'Evaluaciones diseñadas para tu modelo comercial.',
      'Simulaciones basadas en situaciones reales de venta.',
      'Entrevistas por competencias comerciales.',
      'Evaluación de prospección, negociación y cierre.',
      'Informe detallado con fortalezas, riesgos y nivel de compatibilidad.',
    ],
  },
  {
    num: '03',
    title: 'Gamificamos el onboarding',
    label: 'Después de firmar',
    desc: 'Una buena contratación necesita un buen arranque. Convertimos los primeros 90 días en un onboarding gamificado: metas claras, retos prácticos y seguimiento, para que el nuevo integrante se adapte más rápido a tu modelo comercial y empiece a generar resultados.',
    bullets: [
      'Recorrido de incorporación con hitos y retos medibles.',
      'Adaptación al modelo comercial, al equipo y al rol.',
      'Seguimiento a los 30, 60 y 90 días con señales de desempeño.',
      'Ajustes tempranos cuando la integración se desvía.',
      'Entrega al líder del equipo con un perfil que ya está rindiendo.',
    ],
  },
];

const PROCESS_FLOW = [
  { num: '01', title: 'Entendemos tu negocio.' },
  { num: '02', title: 'Diseñamos el perfil de éxito.' },
  { num: '03', title: 'Encontramos el talento más alineado.' },
  { num: '04', title: 'Evaluamos con evidencia.' },
  { num: '05', title: 'Gamificamos el onboarding 90 días.' },
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
    a: 'Una forma clara de ver qué tan bien encaja alguien con cómo vende tu empresa.',
  },
  {
    q: '¿Qué obtienes?',
    a: 'Una lista corta de candidatos priorizados y una recomendación que puedes defender.',
  },
  {
    q: '¿Cómo lo logramos?',
    a: 'Con un método propio. El detalle lo vemos juntos en la conversación, no en un brochure.',
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
  const v = Math.round((n / 1000000) * 10) / 10;
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
          background: `linear-gradient(to right, #c5de4e 0%, #c5de4e ${pct}%, rgba(255,255,255,0.2) ${pct}%, rgba(255,255,255,0.2) 100%)`,
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
  const navigate = useNavigate();
  usePageMeta({
    title: 'Contrata talento comercial alineado con tu estrategia de ventas',
    description:
      'Las mejores contrataciones comienzan entendiendo cómo vende tu empresa, no revisando hojas de vida.',
    path: '/para-empresas',
  });
  useLandingPremiumMotion();

  useEffect(() => {
    document.documentElement.classList.add('kova-home-chrome');
    return () => document.documentElement.classList.remove('kova-home-chrome');
  }, []);

  const [activeStage, setActiveStage] = useState(0);
  const [salario, setSalario] = useState(5000000);
  const [form, setForm] = useState({ nombre: '', tel: '', empresa: '', cargo: '', msg: '' });
  const [formErrors, setFormErrors] = useState({});

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
  // On mobile the collage is hidden — light the mockup directly.
  const [heroView, setHeroView] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches
      ? 'report'
      : 'morph',
  );
  const [morphVisible, setMorphVisible] = useState(() => heroView === 'morph');
  const [lit, setLit] = useState(false);
  const [scoreNum, setScoreNum] = useState(0);
  const onMorphComplete = useCallback(() => {
    setHeroView('report');
    // Keep particles a beat so they dissolve into the mockup instead of cutting off
    window.setTimeout(() => setMorphVisible(false), 480);
  }, []);

  useEffect(() => {
    if (heroView === 'report') return undefined;
    const mq = window.matchMedia('(max-width: 900px)');
    const sync = () => {
      if (mq.matches) {
        setHeroView('report');
        setMorphVisible(false);
      }
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [heroView]);

  useEffect(() => {
    if (heroView !== 'report') return undefined;
    // Start score count with the card reveal (not before floaters)
    const start = setTimeout(() => setLit(true), 280);
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
    const cargas = 1.5;
    const meses = 6;
    const cSalarios = salario * cargas * meses;
    const cIndemnizacion = salario * 0.5;
    const total = cSalarios + cIndemnizacion;
    return { cSalarios, cIndemnizacion, total, periodo: meses };
  }, [salario]);

  const setField = (key) => (e) => {
    const value = key === 'tel' ? e.target.value.replace(/[^\d+ ]/g, '') : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => (prev[key] ? { ...prev, [key]: false } : prev));
  };

  const validateForm = () => {
    const errors = {
      nombre: !form.nombre.trim(),
      tel: !form.tel.trim(),
      empresa: !form.empresa.trim(),
      cargo: !form.cargo.trim(),
    };
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const goToCalendar = () => {
    if (!validateForm()) return;
    navigate(CONTACT_BOOKING_PATH, {
      state: {
        lead: {
          nombre: form.nombre.trim(),
          telefono: form.tel.trim(),
          empresa: form.empresa.trim(),
          rolVacante: form.cargo.trim(),
          notas: form.msg.trim(),
        },
      },
    });
  };

  const sendWhatsApp = () => {
    if (!validateForm()) return;
    const tel = form.tel.trim();
    const txt = `Hola Kova, soy ${form.nombre.trim() || '...'}${
      form.cargo.trim() ? `, ${form.cargo.trim()}` : ''
    }${
      form.empresa.trim() ? ` de ${form.empresa.trim()}` : ''
    }.${tel ? ` Mi WhatsApp: ${tel}.` : ''} Quiero hablar de mi próxima contratación.${
      form.msg.trim() ? ` ${form.msg.trim()}` : ''
    }`;
    window.open(buildWhatsAppUrl(txt), '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="kova-home-plain kova-boutique"
      onPointerMove={(e) => {
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        mx.set((e.clientX / w) * 100);
        my.set((e.clientY / h) * 100);
      }}
    >
      <header id="top" className="kh-hero">
        <div className="kh-hero__grid">
          <div className="kh-hero__copy">
            <span className="kh-pill">Especialistas en talento comercial</span>
            <h1>
              Contrata talento comercial alineado con{' '}
              <span className="kh-accent">tu estrategia de ventas</span>.
            </h1>

            {/* Mobile-only: mockup de evaluación (compacto). Desktop usa el collage. */}
            <div className="kh-hero__visual-m">
              <div className="kh-score-shell kh-score-shell--mobile">
                <div className="kh-score">
                  <div className="kh-score__top">
                    <span className="kh-score__toplabel">Así se ve una evaluación</span>
                    <span className="kh-score__live">
                      <span className="kh-pill__dot" aria-hidden />
                      Ejemplo
                    </span>
                  </div>
                  <div className="kh-score__person">
                    <div>
                      <div className="kh-score__name-row">
                        <span className="kh-score__name">Candidato ejemplo</span>
                      </div>
                      <div className="kh-score__meta">
                        <span className="kh-score__sub">Key Account Manager B2B</span>
                      </div>
                    </div>
                    <div className="kh-score__num">
                      <strong>{scoreNum}%</strong>
                      <span>Compatibilidad</span>
                    </div>
                  </div>
                  <div className="kh-score__dims-label">Dimensiones</div>
                  <div className="kh-dims" key={lit ? 'm-dims-on' : 'm-dims-off'}>
                    {DIMS.slice(0, 4).map((d) => (
                      <div key={d.label} className="kh-dim">
                        <span className="kh-dim__label">{d.label}</span>
                        <div className="kh-dim__track">
                          <div
                            className="kh-dim__fill"
                            style={{
                              transform: `scaleX(${lit ? d.pct / 100 : 0})`,
                              background: d.color,
                            }}
                          />
                        </div>
                        <span className="kh-dim__pct">{d.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <p className="kh-hero__lead">
              No somos una agencia tradicional. Buscamos solo perfiles comerciales:
              entendemos cómo vende tu empresa y te presentamos candidatos que
              encajan de verdad.
            </p>
            <div className="kh-hero__ctas">
              <a href="#contacto" className="kh-btn kh-btn--lime">
                <span className="kh-cta-long">Agenda tu diagnóstico comercial</span>
                <span className="kh-cta-short">Agendar diagnóstico</span>
              </a>
              <a href="#metodologia" className="kh-btn kh-btn--outline">
                Ver cómo lo hacemos
              </a>
            </div>
            <div className="kh-hero__checks">
              <span>
                <em>✓</em> 100% talento comercial
              </span>
              <span>
                <em>✓</em> Asesoría sin costo
              </span>
              <span>
                <em>✓</em> Onboarding gamificado
              </span>
            </div>
          </div>

          <div
            className={`kh-hero__collage kh-hero__collage--desk${
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
                <strong>Alta compatibilidad</strong>
                Alineado a tu modelo comercial
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
                <div>
                  <div className="kh-score__name-row">
                    <span className="kh-score__name">Candidato ejemplo</span>
                  </div>
                  <div className="kh-score__meta">
                    <span className="kh-score__sub">Key Account Manager B2B</span>
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
              stroke="#c5de4e"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="620" cy="96" r="5.5" fill="#c5de4e" stroke="#c5de4e" strokeWidth="1.8" />
            <circle cx="1020" cy="44" r="6.5" fill="#c5de4e" stroke="#c5de4e" strokeWidth="2.2" />
          </svg>
        </div>
      </header>

      <section
        className="kh-trust"
        aria-label="Para equipos comerciales en distintos sectores: Energía y minería, Manufactura, Consumo masivo, Servicios financieros, Tecnología"
      >
        <div className="kh-trust__inner">
          <p className="kh-trust__label">
            Especialistas en distintos sectores
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
                El perfil equivocado
              </span>
              <span className="kh-accent kh-dolores-band__title-punch">
                frena el crecimiento.
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

        </div>
      </section>

      <section id="calculadora" className="kh-section">
        <div className="kh-wrap">
          <div className="kh-costo-head">
            <h2 className="kh-h2 kh-h2--regular">
              El verdadero costo no aparece{' '}
              <span className="kh-accent">en la nómina.</span>
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
              <h3>¿Cuánto te cuesta contratar al vendedor equivocado?</h3>

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
                  <span>Cuota incumplida (estimada)</span>
                  <span className="kh-calc__infinity">∞</span>
                </div>
              </div>

              <div className="kh-calc__total">
                <div>
                  <div className="kh-calc__total-label">Costo estimado</div>
                  <div className="kh-calc__total-value">{fmtCompact(calc.total)} + ∞</div>
                  <p className="kh-calc__total-sub">en ~{calc.periodo} meses</p>
                </div>
              </div>

              <a href="#contacto" className="kh-btn kh-btn--lime">
                Cuéntanos qué perfil necesitas
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
            <span className="kh-eyebrow__label">Búsqueda especializada</span>
          </div>
          <h2 className="kh-h2 kh-h2--regular" style={{ maxWidth: '22ch' }}>
            No empezamos por la hoja de vida.{' '}
            <span className="kh-accent">Empezamos por entender tu negocio</span>.
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
                </button>
              ))}
            </div>
            <div className="kh-stage-panel" role="tabpanel" key={activeStage}>
              <div className="kh-stage-panel__head">
                {stage.num} · {stage.title}
              </div>
              <p className="kh-stage-panel__desc">{stage.desc}</p>
              <div className="kh-stage-panel__bullets">
                {stage.bullets.map((b) => (
                  <div key={b}>
                    <em aria-hidden>·</em>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="kh-method-cta">
            <a href="#contacto" className="kh-btn kh-btn--outline-lime">
              Empecemos por entender tu equipo
            </a>
            <p>30 minutos · sin compromiso</p>
          </div>

          <div className="kh-perfil">
            <h3>
              Todo cambia cuando se define{' '}
              <span className="kh-accent">el perfil correcto</span>.
            </h3>
            <p className="kh-perfil__lead">
              Antes de publicar o buscar, traducimos tu operación comercial en un perfil de
              éxito: cliente, ciclo, ticket y resultados esperados del cargo. Con ese mapa
              encontramos talento con mayor probabilidad de vender en tu contexto.
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
                <div className="kh-perfil-card__label">Perfil definido para tu empresa</div>
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

      <section id="metodo" className="kh-section kh-artifact">
        <div className="kh-wrap">
          <h2 className="kh-h2 kh-h2--regular" style={{ maxWidth: '14ch' }}>
            Nuestro <span className="kh-accent">método</span>
          </h2>
          <p className="kh-artifact__lead">
            Cada contratación importante merece un método claro. Entendemos tu negocio,
            definimos el perfil adecuado y encontramos el talento con mayor alineación.
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

            <article className="kh-mock" aria-label="Ejemplo de lista corta priorizada">
              <div className="kh-mock__chrome">
                <span className="kh-mock__dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="kh-mock__file">lista corta priorizada</span>
              </div>
              <div className="kh-mock__body">
                <div className="kh-mock__head">
                  <span>Lista corta</span>
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
          <div className="kh-platform kh-platform--slim">
            <header className="kh-platform__intro">
              <div className="kh-eyebrow">
                <span className="kh-eyebrow__dot" aria-hidden />
                <span className="kh-eyebrow__label">Para empresas</span>
              </div>
              <h2>
                Onboarding{' '}
                <span className="kh-accent">gamificado</span>
                {' '}para mejores resultados.
              </h2>
              <p className="kh-platform__lead">
                Contratar bien no alcanza si la persona se pierde en los primeros meses.
                Gamificamos el onboarding de tus nuevos comerciales: metas claras, retos
                prácticos y seguimiento en los primeros{' '}
                <strong>90 días</strong>, para que se adapten más rápido a cómo vende tu
                empresa y generen resultados desde el inicio.
              </p>
            </header>

            <ol className="kh-platform__track">
              <li>
                <span className="kh-platform__mark">Arranque</span>
                <strong>Entra con rumbo</strong>
                <span>
                  Retos y metas de la primera semana alineados a tu modelo comercial, tu
                  equipo y lo que el rol debe lograr.
                </span>
              </li>
              <li>
                <span className="kh-platform__mark">30 · 60</span>
                <strong>Progreso visible</strong>
                <span>
                  Hitos claros de adaptación y ritmo de ventas. Tú ves avances; el
                  nuevo integrante sabe exactamente qué mejorar.
                </span>
              </li>
              <li>
                <span className="kh-platform__mark">Día 90</span>
                <strong>Resultados tempranos</strong>
                <span>
                  Menos curva de aprendizaje improvisada. Más tracción comercial y
                  señales a tiempo si algo no encaja.
                </span>
              </li>
            </ol>

            <div className="kh-platform__end">
              <p className="kh-platform__close">
                <span className="kh-platform__close-punch">
                  Una vacante llena no basta. Necesita un vendedor que{' '}
                  <em>empiece a rendir</em>.
                </span>
              </p>
              <a href="#contacto" className="kh-btn kh-btn--outline-lime">
                Quiero ese onboarding
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="garantia" className="kh-section kh-guarantee">
        <div className="kh-wrap">
          <div className="kh-guarantee__panel">
            <div className="kh-guarantee__badge" aria-hidden>
              <span className="kh-guarantee__ring" />
              <strong>6</strong>
              <span>meses de garantía</span>
            </div>
            <div className="kh-guarantee__copy">
              <h2 className="kh-h2 kh-h2--regular">
                Contrata con <span className="kh-accent">garantía de 6 meses</span>.
              </h2>
              <p className="kh-guarantee__lead">
                Confiamos en nuestro proceso. Si la persona contratada no se consolida en
                el rol durante los primeros 6 meses, repetimos la búsqueda sin costo
                adicional.
              </p>
              <ul className="kh-guarantee__points">
                <li>Onboarding gamificado durante los primeros 90 días</li>
                <li>Reemplazo sin costo adicional</li>
                <li>Condiciones claras desde el inicio</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="kh-contact">
        <div className="kh-contact__grid">
          <div className="kh-contact__copy">
            <h2>
              Encuentra el talento comercial que hará{' '}
              <span className="kh-accent">crecer tu empresa</span>.
            </h2>
            <p className="kh-contact__lead">
              Agenda una asesoría con nuestros especialistas. Queremos conocer tu
              empresa, entender el perfil que buscas y mostrarte cómo encontraremos
              al profesional que mejor encaje con tu equipo.
            </p>
            <p className="kh-contact__pitch">
              Cada búsqueda comienza entendiendo tu empresa. No buscamos llenar una
              vacante; buscamos encontrar el profesional adecuado para impulsar tus
              resultados.
            </p>
          </div>

          <div className="kh-form kh-form--asesoria">
            <div className="kh-form-row">
              <label>
                <span>Nombre</span>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  required
                  className={formErrors.nombre ? 'kh-input--error' : undefined}
                  value={form.nombre}
                  onChange={setField('nombre')}
                />
              </label>
              <label>
                <span>WhatsApp</span>
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="+57"
                  required
                  className={formErrors.tel ? 'kh-input--error' : undefined}
                  value={form.tel}
                  onChange={setField('tel')}
                />
              </label>
            </div>
            <div className="kh-form-row">
              <label>
                <span>Empresa</span>
                <input
                  type="text"
                  placeholder="¿Cómo se llama tu empresa?"
                  required
                  className={formErrors.empresa ? 'kh-input--error' : undefined}
                  value={form.empresa}
                  onChange={setField('empresa')}
                />
              </label>
              <label>
                <span>Cargo</span>
                <input
                  type="text"
                  placeholder="¿Cuál es tu cargo?"
                  required
                  className={formErrors.cargo ? 'kh-input--error' : undefined}
                  value={form.cargo}
                  onChange={setField('cargo')}
                />
              </label>
            </div>
            <label>
              <span>
                Cuéntanos qué estás buscando{' '}
                <span className="kh-form__opt">(opcional)</span>
              </span>
              <textarea
                rows={3}
                placeholder="¿Qué tipo de profesional necesitas? ¿Qué retos tendrá? Cualquier contexto que nos compartas nos ayudará a orientarte mejor."
                value={form.msg}
                onChange={setField('msg')}
              />
            </label>

            <ul className="kh-form__trust">
              <li>
                <em aria-hidden>✓</em>
                <span>Asesoría sin costo</span>
              </li>
              <li>
                <em aria-hidden>✓</em>
                <span>Especialistas exclusivamente en talento comercial</span>
              </li>
              <li>
                <em aria-hidden>✓</em>
                <span>Onboarding gamificado en los primeros 90 días</span>
              </li>
            </ul>

            {Object.values(formErrors).some(Boolean) && (
              <p className="kh-form__error" role="alert">
                Completa todos los campos obligatorios.
              </p>
            )}

            <button type="button" className="kh-btn kh-btn--lime" onClick={goToCalendar}>
              Quiero hablar con un especialista
            </button>
            <button type="button" className="kh-btn kh-btn--wa" onClick={sendWhatsApp}>
              Prefiero hablar por WhatsApp
            </button>
            <p className="kh-form__note">
              Te responderemos lo antes posible para coordinar la asesoría.
            </p>
          </div>
        </div>
      </section>

      <footer className="kh-footer">
        <div className="kh-footer__inner">
          <div className="kh-footer__top">
            <a href="#top" className="kh-footer__brand">
              kova<span>.</span>
            </a>
            <p className="kh-footer__copy">© 2026 Kova</p>
          </div>
        </div>
      </footer>

      <Link
        className="kh-agenda-float"
        to={CONTACT_BOOKING_PATH}
        aria-label="Agenda una asesoría"
      >
        <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden focusable="false">
          <path
            fill="currentColor"
            d="M8 6h16a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2zm2 4v2h12v-2H10zm0 5v2h12v-2H10zm0 5v2h8v-2h-8z"
          />
        </svg>
      </Link>
    </div>
  );
}
