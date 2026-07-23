import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@/styles/landing-kova-dark.css';

const PANEL_BARS = [
  { label: 'Negocio', value: 91 },
  { label: 'Rol', value: 88 },
  { label: 'Cultura', value: 93 },
  { label: 'Valores', value: 89 },
  { label: 'Capacidades', value: 90 },
  { label: 'Motivaciones', value: 86 },
];

const METHOD_SIDES = [
  {
    id: 'empresa',
    kicker: 'Si contratas',
    title: 'Reduce el riesgo de una mala contratación',
    promise:
      'Perfil de éxito defendible, evaluación con evidencia y acompañamiento de la integración en los primeros 90 días.',
    points: [
      {
        title: 'Sabes a quién necesitas antes de buscar',
        text: 'Diagnosticamos tu modelo de venta y definimos el perfil del rol: cliente, ciclo, ticket y cultura del equipo.',
      },
      {
        title: 'Eliges con evidencia, no con corazonada',
        text: 'Comparamos candidatos con un estándar comercial claro. Menos intuición de entrevista; más decisión argumentada.',
      },
      {
        title: 'Acompañamos la integración 90 días',
        text: 'Hitos 30 · 60 · 90 para adoptar el modelo, el proceso y el ritmo del equipo, con seguimiento y ajustes a tiempo.',
      },
    ],
    cta: { to: '/para-empresas', label: 'Empieza a contratar' },
  },
  {
    id: 'talento',
    kicker: 'Si buscas empleo',
    title: 'Crece con transparencia y acompañamiento',
    promise:
      'Siempre estás informado. Te acompañamos en el arranque y después, con retroalimentación de tu carrera comercial.',
    points: [
      {
        title: 'Siempre sabes en qué va tu proceso',
        text: 'Te mantenemos al tanto en cada etapa: qué se evalúa, qué falta y por qué avanzas o no. Sin silencio ni sorpresas.',
      },
      {
        title: 'Beneficios pensados para tu desarrollo',
        text: 'Condiciones claras, feedback útil y empresas alineadas a tu estilo de venta, para crecer donde realmente aportas.',
      },
      {
        title: 'Acompañamiento más allá de 90 días',
        text: 'Seguimos contigo en la integración y después, con seguimiento y retroalimentación de cómo avanza tu carrera.',
      },
    ],
    cta: { to: '/empleo', label: 'Encontrar un empleo' },
  },
];

export default function HomeDarkDesktop() {
  useEffect(() => {
    document.documentElement.style.background = '#0d0f0f';
    document.body.style.margin = '0';
    return () => {
      document.documentElement.style.background = '';
      document.body.style.margin = '';
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll('.kova-dark [data-reveal]'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      els.forEach((el) => el.classList.add('kd-in'));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('kd-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    // Marca lo ya visible ANTES de activar el hide, para no flash SEO/above-fold.
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        el.classList.add('kd-in');
      } else {
        io.observe(el);
      }
    });
    root.classList.add('kd-motion');

    return () => {
      io.disconnect();
      root.classList.remove('kd-motion');
    };
  }, []);

  useEffect(() => {
    const num = document.querySelector('.kova-dark .kd-score-num');
    const panel = document.querySelector('.kova-dark .kd-dashboard');
    if (!num || !panel) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    num.textContent = '0';
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        const target = 94;
        const duration = 900;
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - progress) ** 3;
          num.textContent = String(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(panel);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const visual = document.querySelector('.kova-dark .kd-visual');
    const img = document.querySelector('.kova-dark .kd-visual__img');
    if (!visual || !img) return undefined;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;

    const onMove = (event) => {
      const bounds = visual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      img.style.setProperty('--ix', `${x * 12}px`);
      img.style.setProperty('--iy', `${y * 12}px`);
    };
    const onLeave = () => {
      img.style.setProperty('--ix', '0px');
      img.style.setProperty('--iy', '0px');
    };
    visual.addEventListener('pointermove', onMove);
    visual.addEventListener('pointerleave', onLeave);
    return () => {
      visual.removeEventListener('pointermove', onMove);
      visual.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <main className="kova-dark">
      {/* 01 · HERO — vender la promesa */}
      <section className="kd-hero" id="inicio" aria-labelledby="kd-hero-title">
        <svg className="kd-thread" viewBox="0 0 1320 780" preserveAspectRatio="none" aria-hidden>
          <path pathLength="1" d="M77 121 C115 142 166 154 226 154 C316 155 456 154 560 154 C624 154 672 192 672 244 V765" />
          <path pathLength="1" d="M50 94 L96 111 L77 121 L86 143 Z M50 94 L77 121" />
          {/* Branch to Talento: tip outside the button, clear of the longer label */}
          <path
            pathLength="1"
            className="kd-thread__actions"
            d="M672 715 V644 C672 608 645 582 598 582 H420"
          />
          <path pathLength="1" className="kd-thread__pointer" d="M429 573 L420 582 L429 591" />
        </svg>

        <div className="kd-hero-content">
          <div className="kd-hero-copy">
            <p className="kd-eyebrow">Especialistas en talento comercial</p>
            <h1 id="kd-hero-title">
              Empresas y talento
              <br />
              comercial <span>alineados</span>
              <br />
              para crecer.
            </h1>
            <p className="kd-hero-sub">
              Entendemos tu negocio, la cultura y el potencial de cada profesional para
              construir equipos de alto desempeño y relaciones laborales con futuro.
            </p>
            <div className="kd-hero-actions">
              <Link className="kd-btn kd-btn--lime" to="/para-empresas">
                Empieza a contratar
              </Link>
              <Link className="kd-btn kd-btn--ghost" to="/empleo">
                Encontrar un empleo
              </Link>
            </div>
          </div>
        </div>

        <div
          className="kd-visual"
          role="img"
          aria-label="Profesionales comerciales colaborando y revisando estrategia en equipo"
        >
          <svg className="kd-visual__frame" viewBox="0 0 650 500" preserveAspectRatio="none" aria-hidden>
            <defs>
              <clipPath id="kd-bubble-clip">
                <path d="M63 2.4 H585.5 C620.5 2.4 647.6 28.5 647.6 63 V356.5 C647.6 391.8 620.5 419.8 585.5 419.8 H69 C45 422 28 438 17 463 C7 484 3 523 1 581 C0.7 593 0.4 603 0 610 L0 63 C0 28.5 28.5 2.4 63 2.4 Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#kd-bubble-clip)">
              <g className="kd-visual__media">
                <image
                  className="kd-visual__img"
                  href="/landing/lh-home-hero.jpg"
                  x="-12"
                  y="-12"
                  width="674"
                  height="444"
                  preserveAspectRatio="xMidYMid slice"
                />
                <image
                  href="/landing/lh-home-hero.jpg"
                  x="0"
                  y="418"
                  width="80"
                  height="192"
                  preserveAspectRatio="xMinYMax slice"
                />
              </g>
              <rect x="0" y="0" width="650" height="610" fill="#0a9b63" opacity="0.05" />
            </g>
            <path
              className="kd-visual__shape"
              d="M585.5 2.4 C620.5 2.4 647.6 28.5 647.6 63 V356.5 C647.6 391.8 620.5 419.8 585.5 419.8 H69 C45 422 28 438 17 463 C7 484 3 523 1 581 C0.7 593 0.4 603 0 610 L0 63 C0 28.5 28.5 2.4 63 2.4 H585.5"
            />
          </svg>
        </div>

        <div className="kd-node" aria-hidden>
          <span />
        </div>
      </section>

      {/* 02 · DOS CAMINOS — la línea se ramifica hacia cada público */}
      <section className="kd-paths" id="caminos" aria-labelledby="kd-paths-title">
        <div className="kd-branch" data-reveal aria-hidden>
          <svg viewBox="0 0 1160 250" preserveAspectRatio="xMidYMin meet">
            <path pathLength="1" style={{ '--pd': '0ms' }} d="M580 0 V56" />
            <path
              pathLength="1"
              style={{ '--pd': '300ms' }}
              d="M580 56 C576 100 420 102 320 118 C215 136 130 158 120 196"
            />
            <path
              pathLength="1"
              style={{ '--pd': '380ms' }}
              d="M580 56 C580 108 495 124 460 146 C432 164 423 182 420 204"
            />
            <path
              pathLength="1"
              style={{ '--pd': '460ms' }}
              d="M580 56 C580 108 665 124 700 146 C728 164 737 182 740 204"
            />
            <path
              pathLength="1"
              style={{ '--pd': '540ms' }}
              d="M580 56 C584 100 740 102 840 118 C945 136 1030 158 1040 196"
            />
          </svg>
          <span className="kd-branch__end" style={{ left: '10.35%', top: '78.4%', '--bd': '900ms' }}>
            <svg viewBox="0 0 24 24">
              <rect x="5" y="4" width="14" height="17" rx="1.5" />
              <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01M3 21h18" />
            </svg>
          </span>
          <span className="kd-branch__end" style={{ left: '36.2%', top: '81.6%', '--bd': '990ms' }}>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="3.6" />
              <path d="M5.5 20c.8-3.6 3.4-5.4 6.5-5.4s5.7 1.8 6.5 5.4" />
            </svg>
          </span>
          <span className="kd-branch__end" style={{ left: '63.8%', top: '81.6%', '--bd': '1080ms' }}>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8.5" />
              <path d="M8.5 12.2l2.4 2.4 4.6-5" />
            </svg>
          </span>
          <span className="kd-branch__end" style={{ left: '89.65%', top: '78.4%', '--bd': '1170ms' }}>
            <svg viewBox="0 0 24 24">
              <rect x="6" y="3" width="12" height="18" rx="2" />
              <path d="M9.5 8h5M9.5 12h5M9.5 16h3" />
            </svg>
          </span>
        </div>

        <div className="kd-section-head kd-section-head--center" data-reveal>
          <h2 id="kd-paths-title">
            Dos caminos.
            <br />
            <span>Una conexión.</span>
          </h2>
          <p>
            Redefinimos cómo el talento comercial y las grandes empresas se encuentran.
          </p>
        </div>

        <div className="kd-doors" data-reveal>
          <article className="kd-door kd-door--lime">
            <span className="kd-door__icon">
              <svg viewBox="0 0 24 24" aria-hidden>
                <rect x="5" y="4" width="14" height="17" rx="1.5" />
                <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01M3 21h18" />
              </svg>
            </span>
            <span className="kd-door__body">
              <span className="kd-door__tag">01 · Empresas</span>
              <h3>Contrata para generar resultados</h3>
              <p>
                Antes de recomendar un profesional, entendemos tu negocio, tu proceso
                comercial y el perfil que realmente necesita tu empresa para crecer.
              </p>
            </span>
          </article>

          <article className="kd-door">
            <span className="kd-door__icon">
              <svg viewBox="0 0 24 24" aria-hidden>
                <circle cx="12" cy="12" r="8.5" />
                <path d="M8.5 12.2l2.4 2.4 4.6-5" />
              </svg>
            </span>
            <span className="kd-door__body">
              <span className="kd-door__tag">02 · Empresas</span>
              <h3>Mucho más que un currículo</h3>
              <p>
                Evaluamos habilidades, personalidad, motivaciones, cultura y objetivos
                para identificar profesionales con una verdadera alineación con tu
                organización.
              </p>
            </span>
          </article>

          <article className="kd-door">
            <span className="kd-door__icon">
              <svg viewBox="0 0 24 24" aria-hidden>
                <circle cx="12" cy="8" r="3.6" />
                <path d="M5.5 20c.8-3.6 3.4-5.4 6.5-5.4s5.7 1.8 6.5 5.4" />
              </svg>
            </span>
            <span className="kd-door__body">
              <span className="kd-door__tag">03 · Talento</span>
              <h3>Tu experiencia merece una evaluación más completa</h3>
              <p>
                No nos quedamos con tu hoja de vida. Entendemos tus habilidades, tu forma
                de trabajar y tus objetivos para conectarte con empresas donde realmente
                puedas aportar valor.
              </p>
            </span>
          </article>

          <article className="kd-door kd-door--lime">
            <span className="kd-door__icon">
              <svg viewBox="0 0 24 24" aria-hidden>
                <rect x="6" y="3" width="12" height="18" rx="2" />
                <path d="M9.5 8h5M9.5 12h5M9.5 16h3" />
              </svg>
            </span>
            <span className="kd-door__body">
              <span className="kd-door__tag">04 · Talento</span>
              <h3>Crece donde realmente puedas destacar</h3>
              <p>
                Conecta con empresas que buscan talento alineado con su cultura,
                su forma de vender y sus objetivos de negocio.
              </p>
            </span>
          </article>
        </div>

      </section>

      {/* 03 · TENSIÓN — hoja de vida vs alineación */}
      <section className="kd-diff" aria-labelledby="kd-diff-title">
        <div className="kd-diff-head" data-reveal>
          <h2 id="kd-diff-title">
            La experiencia abre la puerta.
            <br />
            <span>La alineación determina lo que ocurre después.</span>
          </h2>
          <p className="kd-diff-sub">
            Una persona puede tener una gran trayectoria y no encontrar el entorno donde
            pueda dar lo mejor. Una empresa puede contratar experiencia y no obtener el
            impacto que esperaba.
          </p>
        </div>

        <div className="kd-compare" data-reveal>
          <article className="kd-compare__card kd-compare__card--cv">
            <header>
              <span className="kd-compare__tag">Hoja de vida</span>
              <span className="kd-compare__caption">Lo que los otros ven</span>
            </header>
            <ul>
              <li>Cargos anteriores</li>
              <li>Años de experiencia</li>
              <li>Empresas y títulos</li>
              <li>Logros en papel</li>
            </ul>
          </article>

          <div className="kd-compare__bridge" aria-hidden>
            <span className="kd-compare__wire" />
            <span className="kd-compare__node">
              <span className="kd-compare__ring" />
              <i />
            </span>
            <span className="kd-compare__wire kd-compare__wire--b" />
          </div>

          <article className="kd-compare__card kd-compare__card--lh">
            <header>
              <span className="kd-compare__tag">Perfil comercial</span>
              <span className="kd-compare__caption">Lo que nosotros vemos</span>
            </header>
            <ul>
              <li style={{ '--d': '0ms' }}>Cómo vende y negocia</li>
              <li style={{ '--d': '120ms' }}>Cultura y valores</li>
              <li style={{ '--d': '240ms' }}>Forma de trabajar</li>
              <li style={{ '--d': '360ms' }}>Motivaciones reales</li>
            </ul>
          </article>
        </div>
      </section>

      {/* 03 · MÉTODO + CONDICIONES (empresa y talento) */}
      <section className="kd-method" id="metodo" aria-labelledby="kd-method-title">
        <div className="kd-section-head kd-section-head--center" data-reveal>
          <h2 id="kd-method-title">
            Certeza al contratar.
            <br />
            Claridad al crecer.
          </h2>
          <p>
            Si contratas, te ayudamos a elegir bien y a acompañar la integración. Si buscas
            empleo, te damos condiciones claras y te conectamos donde realmente puedas
            aportar.
          </p>
        </div>

        <div className="kd-method-split" data-reveal>
          {METHOD_SIDES.map((side) => (
            <article
              key={side.id}
              className={`kd-method-panel kd-method-panel--${side.id}`}
            >
              <header className="kd-method-panel__head">
                <p className="kd-method-panel__kicker">{side.kicker}</p>
                <h3 className="kd-method-panel__title">{side.title}</h3>
                <p className="kd-method-panel__promise">{side.promise}</p>
              </header>
              <ul className="kd-method-panel__list">
                {side.points.map((point, i) => (
                  <li key={point.title}>
                    <span className="kd-method-panel__n" aria-hidden>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="kd-method-panel__body">
                      <strong>{point.title}</strong>
                      <span>{point.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                className={`kd-btn ${side.id === 'empresa' ? 'kd-btn--lime' : 'kd-btn--ghost'}`}
                to={side.cta.to}
              >
                {side.cta.label}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 05 · METODOLOGÍA PROPIA — perfil de alineación */}
      <section className="kd-score" id="alineacion" aria-labelledby="kd-score-title">
        <div className="kd-score-grid">
          <div className="kd-score-copy" data-reveal>
            <h2 id="kd-score-title">
              La alineación no se supone.
              <br />
              <span>Se analiza.</span>
            </h2>
            <p>
              Combinamos metodología, evaluación humana y tecnología para tomar decisiones
              con más contexto.
            </p>
            <Link className="kd-btn kd-btn--lime" to="/para-empresas#metodologia">
              Conoce cómo evaluamos la alineación
            </Link>
          </div>

          <div className="kd-dashboard" data-reveal>
            <div className="kd-dashboard__head">
              <span>Perfil comercial</span>
              <span className="kd-dashboard__badge">Ejemplo ilustrativo</span>
            </div>
            <p className="kd-dashboard__score">
              <span className="kd-score-num">94</span>
              <i>%</i>
            </p>
            <p className="kd-dashboard__reco">Perfil altamente recomendado</p>
            <ul className="kd-dashboard__bars">
              {PANEL_BARS.map((bar) => (
                <li key={bar.label} className="kd-bar" style={{ '--w': `${bar.value}%` }}>
                  <span className="kd-bar__label">{bar.label}</span>
                  <span className="kd-bar__track">
                    <i />
                  </span>
                  <span className="kd-bar__value">{bar.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 05b · GARANTÍA */}
      <section className="kd-guarantee" id="garantia" aria-labelledby="kd-guarantee-title">
        <div className="kd-guarantee-inner" data-reveal>
          <div className="kd-guarantee-badge" aria-hidden>
            <span className="kd-guarantee-badge__ring" />
            <span className="kd-guarantee-badge__num">6</span>
            <span className="kd-guarantee-badge__label">meses de garantía</span>
          </div>
          <div className="kd-guarantee-copy">
            <h2 id="kd-guarantee-title">
              Contrata con <span>garantía de 6 meses</span>.
            </h2>
            <p className="kd-guarantee-lead">
              Confiamos en nuestro proceso. Si la persona contratada no se consolida en el
              rol durante los primeros 6 meses, repetimos la búsqueda sin costo adicional.
            </p>
            <ul className="kd-guarantee-points">
              <li>Acompañamiento durante los primeros 90 días</li>
              <li>Reemplazo sin costo adicional</li>
              <li>Condiciones claras desde el inicio</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 06 · CIERRE */}
      <section className="kd-final" id="contacto" aria-labelledby="kd-final-title">
        <div className="kd-final-shell" data-reveal>
          <div className="kd-final-split">
            <div className="kd-final-copy">
              <h2 id="kd-final-title">
                El talento <span>correcto</span>
                <br />
                necesita el entorno <span>correcto</span>.
              </h2>
              <p className="kd-final-lead">
                Cuando una empresa encuentra a la persona adecuada y un profesional encuentra
                dónde desarrollar su potencial, ambos crecen.
              </p>
              <div className="kd-final-actions">
                <Link className="kd-btn kd-btn--lime" to="/para-empresas">
                  Para empresas
                </Link>
                <Link className="kd-btn kd-btn--ink" to="/empleo">
                  Para talento
                </Link>
              </div>
            </div>

            <div className="kd-final-cards">
              <div className="kd-final-card kd-final-card--empresas">
                <img
                  className="kd-final-card__photo"
                  src="/landing/people/lh-final-empresas.png"
                  alt="Equipo comercial revisando candidatos en Litt Hunter"
                  loading="lazy"
                  decoding="async"
                />
                <span className="kd-final-card__chip">
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden>
                    <circle cx="8" cy="5.2" r="2.4" stroke="currentColor" strokeWidth="1.4" />
                    <path
                      d="M3.2 13.2c.7-2.4 2.4-3.6 4.8-3.6s4.1 1.2 4.8 3.6"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  Empresas
                </span>
              </div>

              <div className="kd-final-card kd-final-card--talento">
                <img
                  className="kd-final-card__photo"
                  src="/landing/people/lh-final-talento.png"
                  alt="Profesional comercial listo para una vacante con Litt Hunter"
                  loading="lazy"
                  decoding="async"
                />
                <span className="kd-final-card__chip">
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden>
                    <circle cx="8" cy="5.2" r="2.4" stroke="currentColor" strokeWidth="1.4" />
                    <path
                      d="M3.2 13.2c.7-2.4 2.4-3.6 4.8-3.6s4.1 1.2 4.8 3.6"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  Talento
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="kd-footer">
        <Link className="kd-brand lh-mark" to="/">
          litt hunter
          <span className="lh-mark__sq" aria-hidden="true" />
        </Link>
        <p>© {new Date().getFullYear()} Litt Hunter</p>
      </footer>
    </main>
  );
}
