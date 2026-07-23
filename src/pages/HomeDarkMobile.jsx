import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@/styles/landing-kova-dark-m.css';

const PANEL_BARS = [
  { label: 'Negocio', value: 91 },
  { label: 'Rol', value: 88 },
  { label: 'Cultura', value: 93 },
  { label: 'Valores', value: 89 },
  { label: 'Capacidades', value: 90 },
  { label: 'Motivaciones', value: 86 },
];

export default function HomeDarkMobile() {

  useEffect(() => {
    document.documentElement.style.background = '#0d0f0f';
    document.body.style.margin = '0';
    return () => {
      document.documentElement.style.background = '';
      document.body.style.margin = '';
    };
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.kova-dark-m [data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('kd-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const num = document.querySelector('.kova-dark-m .kd-score-num');
    const panel = document.querySelector('.kova-dark-m .kd-dashboard');
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
    const visual = document.querySelector('.kova-dark-m .kd-visual');
    const img = document.querySelector('.kova-dark-m .kd-visual__img');
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
    <main className="kova-dark-m">
      {/* 01 · HERO — vender la promesa */}
      <section className="kd-hero" id="inicio" aria-labelledby="kd-hero-title">
        <svg className="kd-thread" viewBox="0 0 1320 780" preserveAspectRatio="none" aria-hidden>
          <path pathLength="1" d="M77 121 C115 142 166 154 226 154 C316 155 456 154 560 154 C624 154 672 192 672 244 V765" />
          <path pathLength="1" d="M50 94 L96 111 L77 121 L86 143 Z M50 94 L77 121" />
          <path pathLength="1" className="kd-thread__actions" d="M672 715 V644 C672 608 645 582 598 582 H400" />
          <path pathLength="1" className="kd-thread__pointer" d="M409 573 L400 582 L409 591" />
        </svg>

        <div className="kd-hero-content">
          <div className="kd-hero-copy">
            <p className="kd-eyebrow">Especialistas en talento comercial</p>
            <h1 id="kd-hero-title">
              Empresas y talento comercial alineados para{' '}
              <span className="kd-grow">
                crecer
                <svg className="kd-plane" viewBox="0 0 24 24" aria-hidden>
                  <path d="M22 2.6 2.6 10.4 10.7 13.3 13.6 21.4Z" />
                  <path className="fold" d="M22 2.6 10.7 13.3" />
                </svg>
              </span>
              .
            </h1>

            <div
              className="kd-visual"
              role="img"
              aria-label="Profesionales comerciales colaborando y revisando estrategia en equipo"
            >
              <svg className="kd-frame" viewBox="-4 -3 658 505" preserveAspectRatio="xMidYMid meet" aria-hidden>
                <defs>
                  <clipPath id="kd-hero-clip">
                    <path d="M63 2.4 H585.5 C620.5 2.4 647.6 28.5 647.6 63 V356.5 C647.6 391.8 620.5 419.8 585.5 419.8 H69 C46 421 30 435 20 452 C11 468 4 482 1 495 C0.7 499 0.4 499 0 499 L0 63 C0 28.5 28.5 2.4 63 2.4 Z" />
                  </clipPath>
                </defs>
                <g clipPath="url(#kd-hero-clip)">
                  <g className="kd-visual__media">
                    <image
                      className="kd-visual__img"
                      href="/landing/kova-home-hero.jpg"
                      x="-30"
                      y="-30"
                      width="710"
                      height="680"
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </g>
                  <rect x="0" y="0" width="650" height="500" fill="#0a9b63" opacity="0.05" />
                </g>
                <path
                  className="shape"
                  d="M585.5 2.4 C620.5 2.4 647.6 28.5 647.6 63 V356.5 C647.6 391.8 620.5 419.8 585.5 419.8 H69 C46 421 30 435 20 452 C11 468 4 482 1 495 C0.7 499 0.4 499 0 499 L0 63 C0 28.5 28.5 2.4 63 2.4 H585.5"
                />
              </svg>
            </div>

            <p className="kd-hero-sub">
              Entendemos tu negocio, la cultura y el potencial de cada profesional para
              construir equipos de alto desempeño y relaciones laborales con futuro.
            </p>
            <div className="kd-hero-actions">
              <Link className="kd-btn kd-btn--empresa" to="/para-empresas">
                Empieza a contratar
              </Link>
              <Link className="kd-btn kd-btn--talento" to="/empleo">
                Encontrar un empleo
              </Link>
            </div>
          </div>
        </div>

        <div className="kd-node" aria-hidden>
          <span />
        </div>
      </section>

      {/* 02 · DOS CAMINOS — timeline empresas / profesionales */}
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

        <div className="kd-timeline" data-reveal>
          <div className="kd-timeline__group">
            <p className="kd-timeline__label" data-reveal>
              <span className="kd-timeline__mark" aria-hidden />
              Para empresas
            </p>

            <article className="kd-timeline__step" data-reveal>
              <span className="kd-timeline__num" aria-hidden>
                01
              </span>
              <div className="kd-timeline__card kd-timeline__card--lime">
                <span className="kd-timeline__icon">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <rect x="5" y="4" width="14" height="17" rx="1.5" />
                    <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01M3 21h18" />
                  </svg>
                </span>
                <h3>Contrata para generar resultados</h3>
                <p>
                  Antes de buscar, diagnosticamos tu modelo comercial: cliente ideal, ciclo,
                  ticket y lo que el cargo debe lograr. Solo con ese criterio recomendamos
                  perfiles con probabilidad real de impacto.
                </p>
              </div>
            </article>

            <article className="kd-timeline__step" data-reveal>
              <span className="kd-timeline__num" aria-hidden>
                02
              </span>
              <div className="kd-timeline__card">
                <span className="kd-timeline__icon">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M8.5 12.2l2.4 2.4 4.6-5" />
                  </svg>
                </span>
                <h3>Mucho más que un currículo</h3>
                <p>
                  Evaluamos competencias de venta, comunicación, cultura y motivación en el
                  contexto de tu operación. Así priorizas candidatos defendibles ante
                  dirección comercial, no solo hojas de vida atractivas.
                </p>
              </div>
            </article>
          </div>

          <div className="kd-timeline__group">
            <p className="kd-timeline__label" data-reveal>
              <span className="kd-timeline__mark" aria-hidden />
              Para talento
            </p>

            <article className="kd-timeline__step" data-reveal>
              <span className="kd-timeline__num" aria-hidden>
                03
              </span>
              <div className="kd-timeline__card">
                <span className="kd-timeline__icon">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <circle cx="12" cy="8" r="3.6" />
                    <path d="M5.5 20c.8-3.6 3.4-5.4 6.5-5.4s5.7 1.8 6.5 5.4" />
                  </svg>
                </span>
                <h3>Tu experiencia merece una evaluación más completa</h3>
                <p>
                  Más allá de tu trayectoria, medimos cómo vendes: ciclo, tipo de cliente y
                  estilo comercial. Así te conectamos con empresas donde tu forma de trabajar
                  genera resultados, no solo encaje cultural genérico.
                </p>
              </div>
            </article>

            <article className="kd-timeline__step" data-reveal>
              <span className="kd-timeline__num" aria-hidden>
                04
              </span>
              <div className="kd-timeline__card kd-timeline__card--lime">
                <span className="kd-timeline__icon">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <rect x="6" y="3" width="12" height="18" rx="2" />
                    <path d="M9.5 8h5M9.5 12h5M9.5 16h3" />
                  </svg>
                </span>
                <h3>Crece donde realmente puedas destacar</h3>
                <p>
                  Accede a vacantes B2B donde el modelo de venta, el ticket y las metas del
                  cargo coinciden con tu perfil. Menos postulaciones a ciegas; más procesos
                  con criterio comercial claro.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 03 · TENSIÓN — hoja de vida vs alineación */}
      <section className="dx" id="diferencia" aria-labelledby="dx-title" data-reveal>

        <h2 className="dx__title" id="dx-title">
          <span className="lead">La experiencia abre la puerta.</span>{' '}
          <span className="accent">La alineación determina lo que ocurre después.</span>
        </h2>

        <p className="dx__sub">
          Una persona puede tener una gran trayectoria y no encontrar el entorno donde
          pueda dar lo mejor. Una empresa puede contratar experiencia y no obtener el
          impacto que esperaba.
        </p>

        <div className="cmp">
          <div className="cmp__block cmp__block--surface">
            <div className="cmp__meta">
              <span className="cmp__idx">01</span>
              <span className="cmp__tag">Hoja de vida</span>
            </div>
            <div className="cmp__cap">Lo que los otros ven</div>
            <ul className="cmp__list">
              <li>
                <span className="cmp__dash" aria-hidden />
                Cargos anteriores
              </li>
              <li>
                <span className="cmp__dash" aria-hidden />
                Años de experiencia
              </li>
              <li>
                <span className="cmp__dash" aria-hidden />
                Empresas y títulos
              </li>
              <li>
                <span className="cmp__dash" aria-hidden />
                Logros en papel
              </li>
            </ul>
          </div>

          <div className="cmp__rule">
            <span>Más allá</span>
          </div>

          <div className="cmp__block cmp__block--kova">
            <div className="cmp__meta">
              <span className="cmp__idx">02</span>
              <span className="cmp__tag">Perfil comercial</span>
            </div>
            <div className="cmp__cap">Lo que nosotros vemos</div>
            <ul className="cmp__list">
              <li>
                <span className="cmp__check" aria-hidden>
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12.5l4.2 4.2L19 7" />
                  </svg>
                </span>
                Cómo vende y negocia
              </li>
              <li>
                <span className="cmp__check" aria-hidden>
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12.5l4.2 4.2L19 7" />
                  </svg>
                </span>
                Cultura y valores
              </li>
              <li>
                <span className="cmp__check" aria-hidden>
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12.5l4.2 4.2L19 7" />
                  </svg>
                </span>
                Forma de trabajar
              </li>
              <li>
                <span className="cmp__check" aria-hidden>
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12.5l4.2 4.2L19 7" />
                  </svg>
                </span>
                Motivaciones reales
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 03 · MÉTODO + CONDICIONES (empresa y talento) */}
      <section className="mt" id="metodo" aria-labelledby="mt-title" data-reveal>
        <p className="mt__eyebrow">
          <i aria-hidden />
          Elige tu camino
        </p>
        <h2 className="mt__title" id="mt-title">
          Certeza al contratar. Claridad al crecer.
        </h2>
        <p className="mt__sub">
          Si contratas, te ayudamos a elegir bien y a acompañar la integración. Si buscas
          empleo, te damos condiciones claras y te conectamos donde realmente puedas
          aportar.
        </p>

        <div className="mt__split">
          <div className="mt__panel mt__panel--empresa">
            <header className="mt__panel-head">
              <p className="mt__panel-kicker">Si contratas</p>
              <h3 className="mt__panel-title">Reduce el riesgo de una mala contratación</h3>
              <p className="mt__panel-promise">
                Perfil de éxito defendible, evaluación con evidencia y acompañamiento de la
                integración en los primeros 90 días.
              </p>
            </header>
            <div className="mt__list">
              <article className="mt__card">
                <span className="mt__n" aria-hidden>
                  01
                </span>
                <div>
                  <h3 className="mt__t">Sabes a quién necesitas antes de buscar</h3>
                  <p className="mt__d">
                    Diagnosticamos tu modelo de venta y definimos el perfil del rol: cliente,
                    ciclo, ticket y cultura del equipo.
                  </p>
                </div>
              </article>
              <article className="mt__card">
                <span className="mt__n" aria-hidden>
                  02
                </span>
                <div>
                  <h3 className="mt__t">Eliges con evidencia, no con corazonada</h3>
                  <p className="mt__d">
                    Comparamos candidatos con un estándar comercial claro. Menos intuición;
                    más decisión argumentada.
                  </p>
                </div>
              </article>
              <article className="mt__card">
                <span className="mt__n" aria-hidden>
                  03
                </span>
                <div>
                  <h3 className="mt__t">Acompañamos la integración 90 días</h3>
                  <p className="mt__d">
                    Hitos 30 · 60 · 90 para adoptar el modelo, el proceso y el ritmo del
                    equipo, con seguimiento y ajustes a tiempo.
                  </p>
                </div>
              </article>
            </div>
            <Link className="kd-btn kd-btn--lime mt__panel-cta" to="/para-empresas">
              Empieza a contratar
            </Link>
          </div>

          <div className="mt__panel mt__panel--talento">
            <header className="mt__panel-head">
              <p className="mt__panel-kicker">Si buscas empleo</p>
              <h3 className="mt__panel-title">Crece con transparencia y acompañamiento</h3>
              <p className="mt__panel-promise">
                Siempre estás informado. Te acompañamos en el arranque y después, con
                retroalimentación de tu carrera comercial.
              </p>
            </header>
            <div className="mt__list">
              <article className="mt__card">
                <span className="mt__n" aria-hidden>
                  01
                </span>
                <div>
                  <h3 className="mt__t">Siempre sabes en qué va tu proceso</h3>
                  <p className="mt__d">
                    Te mantenemos al tanto en cada etapa: qué se evalúa, qué falta y por qué
                    avanzas o no. Sin silencio ni sorpresas.
                  </p>
                </div>
              </article>
              <article className="mt__card">
                <span className="mt__n" aria-hidden>
                  02
                </span>
                <div>
                  <h3 className="mt__t">Beneficios pensados para tu desarrollo</h3>
                  <p className="mt__d">
                    Condiciones claras, feedback útil y empresas alineadas a tu estilo de
                    venta, para crecer donde realmente aportas.
                  </p>
                </div>
              </article>
              <article className="mt__card">
                <span className="mt__n" aria-hidden>
                  03
                </span>
                <div>
                  <h3 className="mt__t">Acompañamiento más allá de 90 días</h3>
                  <p className="mt__d">
                    Seguimos contigo en la integración y después, con seguimiento y
                    retroalimentación de cómo avanza tu carrera.
                  </p>
                </div>
              </article>
            </div>
            <Link className="kd-btn kd-btn--ghost mt__panel-cta" to="/empleo">
              Encontrar un empleo
            </Link>
          </div>
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
            </div>

            <div className="kd-final-cards" aria-hidden>
              <div className="kd-final-card kd-final-card--empresas">
                <img
                  className="kd-final-card__photo"
                  src="/landing/people/kova-final-empresas.jpg"
                  alt=""
                  loading="lazy"
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
                  src="/landing/people/kova-final-talento.jpg"
                  alt=""
                  loading="lazy"
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

            <div className="kd-final-cta">
              <div className="kd-final-actions">
                <Link className="kd-btn kd-btn--lime" to="/para-empresas">
                  Para empresas
                </Link>
                <Link className="kd-btn kd-btn--ink" to="/empleo">
                  Para talento
                </Link>
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
