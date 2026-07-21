import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import '@/styles/landing-home-plain.css';
import '@/styles/empleo.css';

const DIMENSIONS = [
  {
    label: 'Compatibilidad comercial',
    pct: 94,
    desc: 'Mide qué tan bien encaja tu forma de vender con el modelo comercial de la empresa: tipo de cliente, ticket, ciclo de venta y ritmo esperado. Un puntaje alto indica que puedes generar resultados en ese contexto, no solo en ventas en general.',
  },
  {
    label: 'Competencias de venta',
    pct: 89,
    desc: 'Evalúa capacidades concretas del oficio comercial: prospección, diagnóstico de necesidad, manejo de objeciones, negociación y cierre. Se pondera según si el rol es consultivo, técnico, transaccional o de desarrollo de cuentas.',
  },
  {
    label: 'Comunicación',
    pct: 91,
    desc: 'Valora cómo presentas valor, escuchas al cliente y sostienes conversaciones difíciles con claridad. En B2B esto incluye alinear stakeholders, defender precio y traducir beneficios técnicos a impacto de negocio.',
  },
  {
    label: 'Alineación con la empresa',
    pct: 88,
    desc: 'Compara tu estilo de trabajo con la cultura comercial del equipo: autonomía vs. proceso, ritmo de metas, nivel de soporte y forma de tomar decisiones. Reduce el riesgo de una contratación que “encaja en papel” pero no en la operación diaria.',
  },
  {
    label: 'Adaptabilidad',
    pct: 85,
    desc: 'Indica qué tan rápido te adaptas a un nuevo producto, vertical o ciclo de venta sin perder productividad. Clave en empresas que abren mercados, cambian de oferta o enfrentan ciclos comerciales variables.',
  },
  {
    label: 'Potencial de desarrollo',
    pct: 82,
    desc: 'Proyecta tu capacidad de crecer en el rol: asumir cuentas más complejas, liderar pipeline o subir a key account / team lead. Las empresas lo usan para contratar con visión de mediano plazo, no solo para cubrir la vacante de hoy.',
  },
];

const BENEFITS = [
  {
    title: 'Gratis para siempre',
    desc: 'Crear y actualizar tu perfil comercial, y postularte a vacantes B2B, no tiene costo. Las empresas asumen el proceso; tú inviertes solo tu tiempo en mostrar cómo vendes.',
  },
  {
    title: 'Siempre informado',
    desc: 'Ves en qué etapa está cada proceso (revisión, evaluación, entrevista, decisión) sin depender de seguimientos por WhatsApp. Menos incertidumbre y más claridad sobre el avance de cada oportunidad.',
  },
  {
    title: 'Un solo perfil para todas las oportunidades',
    desc: 'Defines una vez cómo vendes, en qué sectores te mueves y qué tipo de ciclo dominas. Con eso te conectamos con vacantes donde tu perfil comercial tiene mayor probabilidad de impacto.',
  },
  {
    title: 'Te acompañamos durante tus primeros 90 días',
    desc: 'Si te contratan, el onboarding no termina en el firmado. Te acompañamos en la integración al modelo comercial del equipo para que aceleres tu curva de productividad en el nuevo rol.',
  },
];

const SECTORS = [
  'Energía y minería',
  'Manufactura',
  'Consumo masivo',
  'Servicios financieros',
  'Tecnología',
];

const STEPS = [
  {
    n: '01',
    title: 'Crea tu perfil',
    desc: 'Registra experiencia, sectores y el tipo de venta que dominas: consultiva, técnica o de cuentas.',
  },
  {
    n: '02',
    title: 'Muestra cómo vendes',
    desc: 'Completas una evaluación comercial alineada a escenarios B2B reales, no solo a tu hoja de vida.',
  },
  {
    n: '03',
    title: 'Recibe oportunidades alineadas',
    desc: 'Las empresas te encuentran cuando tu perfil encaja con su ciclo, cliente ideal y metas del cargo.',
  },
];

export default function Empleo() {
  usePageMeta({
    title: 'Los buenos vendedores no persiguen oportunidades',
    description:
      'Crea tu perfil una vez y conecta con empresas que buscan profesionales como tú.',
    path: '/empleo',
  });

  const [lit, setLit] = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLit(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('kova-home-chrome');
    return () => document.documentElement.classList.remove('kova-home-chrome');
  }, []);

  const dim = DIMENSIONS[selected];

  return (
    <div className="kova-home-plain kova-empleo">
      {/* HERO */}
      <header id="top" className="emp-hero">
        <div className="emp-wrap emp-hero__grid">
          <div>
            <span className="kh-pill">Para profesionales comerciales</span>
            <h1>
              Los buenos vendedores no persiguen oportunidades.{' '}
              <em>Las oportunidades los encuentran.</em>
            </h1>
            <p className="emp-hero__lead">
              Crea tu perfil una vez y conecta con empresas que buscan profesionales como tú.
            </p>
            <div className="emp-hero__ctas">
              <Link to="/registro" className="kh-btn kh-btn--lime">
                Crear mi perfil gratis
              </Link>
            </div>
          </div>

          <div className="emp-mosaic" aria-hidden>
            <div className="emp-mosaic__grid">
              <img
                className="emp-mosaic__photo emp-mosaic__photo--1"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop"
                alt=""
                loading="eager"
              />
              <img
                className="emp-mosaic__photo emp-mosaic__photo--2"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=700&auto=format&fit=crop"
                alt=""
                loading="eager"
              />
              <img
                className="emp-mosaic__photo emp-mosaic__photo--3"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop"
                alt=""
                loading="eager"
              />
              <img
                className="emp-mosaic__photo emp-mosaic__photo--4"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop"
                alt=""
                loading="eager"
              />
            </div>

            <div className="emp-float emp-float--score">
              <div className="emp-float__ring">89%</div>
              <div>
                <strong>Kova Score</strong>
                <span>Excelente compatibilidad</span>
              </div>
            </div>

            <div className="emp-float emp-float--checks">
              <div>
                <em>✓</em> Perfil completo
              </div>
              <div>
                <em>✓</em> Kova Score listo
              </div>
              <div>
                <em>✓</em> Visible para empresas
              </div>
            </div>

            <div className="emp-float emp-float--match">
              <span className="emp-float__tag">Nueva vacante</span>
              <strong>Ejecutivo de cuentas</strong>
              <span>Bogotá · Remoto</span>
            </div>

            <div className="emp-float emp-float--stat">
              <span className="emp-float__arrow" aria-hidden>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path
                    d="M4 16 10 10 14 14 20 6M20 6h-5M20 6v5"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <strong>Visibilidad del perfil</strong>
                <span>+47% este mes</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* DARK BENEFITS BAND */}
      <section className="emp-band">
        <div className="emp-wrap">
          <h2 className="emp-band__title">
            Condiciones claras. Procesos transparentes. <em>Acompañamiento real</em>.
          </h2>
          <div className="emp-band__grid">
            {BENEFITS.map((b) => (
              <div key={b.title} className="emp-benefit">
                <span className="emp-benefit__ico" aria-hidden>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                    <path
                      d="M5 12.5L10 17.5L19 7.5"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <strong>{b.title}</strong>
                <span>{b.desc}</span>
              </div>
            ))}
          </div>
          <div
            className="emp-band__sectors"
            aria-label={`Especialistas en distintos sectores: ${SECTORS.join(', ')}`}
          >
            <p className="emp-band__sectors-label">
              Especialistas
              <br />
              en distintos sectores
            </p>
            <div className="emp-band__sectors-marquee" aria-hidden="true">
              <ul className="emp-band__sectors-track">
                {[...SECTORS, ...SECTORS].map((sector, i) => (
                  <li key={`${sector}-${i}`}>{sector}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SCORE EXPLORER */}
      <section id="beneficios" className="emp-sec emp-sec--dark">
        <div className="emp-wrap">
          <div className="emp-eyebrow">Tu verdadera carta de presentación</div>
          <h2 className="emp-h2 emp-head">
            Una hoja de vida cuenta tu experiencia. Nosotros mostramos{' '}
            <em>el valor que puedes aportar</em> a una empresa.
          </h2>
          <p className="emp-sub">
            Tu perfil se evalúa con el mismo criterio que usan las empresas B2B para decidir:
            modelo comercial, ciclo de venta, competencias del rol y ajuste al equipo.
            Selecciona cada dimensión para ver qué mide y por qué importa al contratar.
          </p>

          <div className="emp-explorer">
            <div className="emp-dims">
              {DIMENSIONS.map((d, i) => (
                <button
                  key={d.label}
                  type="button"
                  className={`emp-dim${i === selected ? ' is-active' : ''}`}
                  onClick={() => setSelected(i)}
                  aria-pressed={i === selected}
                >
                  <span className="emp-dim__label">{d.label}</span>
                  <span className="emp-dim__pct">{d.pct}%</span>
                  <span className="emp-dim__track">
                    <span
                      className="emp-dim__fill"
                      style={{ transform: `scaleX(${lit ? d.pct / 100 : 0})` }}
                    />
                  </span>
                </button>
              ))}
            </div>

            <div className="emp-detail">
              <span className="emp-detail__badge">Lo que representa</span>
              <div className="emp-detail__num">{dim.pct}%</div>
              <div className="emp-detail__name">{dim.label}</div>
              <p className="emp-detail__desc">{dim.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY INFOGRAPHIC */}
      <section className="emp-sec emp-sec--tight emp-sec--dark">
        <div className="emp-wrap">
          <h2 className="emp-h2 emp-h2--sub emp-head">
            Así conectamos tu perfil con las <em>empresas correctas</em>.
          </h2>
          <div className="emp-journey">
            {STEPS.map((s) => (
              <div key={s.n} className="emp-step">
                <div className="emp-step__n">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="emp-sec emp-cta emp-sec--light">
        <div className="emp-wrap">
          <div className="emp-cta__panel">
            <div className="emp-cta__col">
              <span className="emp-cta__eyebrow">Tu próxima oportunidad empieza aquí</span>
              <h2>
                El trabajo que mereces <em>no depende de la suerte</em>.
              </h2>
              <p className="emp-cta__lead">
                Crea tu perfil una vez, deja que las empresas te encuentren y avanza con
                condiciones claras desde el primer contacto.
              </p>
              <div className="emp-cta__ctas">
                <Link to="/registro" className="emp-btn emp-btn--light">
                  Crear mi perfil gratis
                </Link>
                <Link to="/login" className="emp-btn emp-btn--ghost">
                  Ya tengo cuenta
                </Link>
              </div>
            </div>

            <div className="emp-cta__recap">
              {BENEFITS.map((b) => (
                <div key={b.title} className="emp-cta__recap-row">
                  <span aria-hidden>✓</span>
                  {b.title}
                </div>
              ))}
            </div>
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
    </div>
  );
}
