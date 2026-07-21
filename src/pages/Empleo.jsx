import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import '@/styles/landing-home-plain.css';
import '@/styles/empleo.css';

const DIMENSIONS = [
  {
    label: 'Compatibilidad comercial',
    pct: 94,
    desc: 'Refleja el nivel de alineación entre tu perfil y el modelo de negocio, la cultura y la forma de vender de cada empresa.',
  },
  {
    label: 'Competencias de venta',
    pct: 89,
    desc: 'Evalúa tus competencias comerciales según el tipo de venta en el que mejor te desempeñas.',
  },
  {
    label: 'Comunicación',
    pct: 91,
    desc: 'Refleja tu capacidad para construir relaciones, presentar ideas con claridad y sostener conversaciones de valor con clientes y equipos.',
  },
  {
    label: 'Alineación con la empresa',
    pct: 88,
    desc: 'Mide la afinidad entre tu filosofía de trabajo y la cultura, el modelo comercial y el entorno de la organización.',
  },
  {
    label: 'Adaptabilidad',
    pct: 85,
    desc: 'Indica con qué facilidad te ajustas a nuevos productos, ciclos de venta y tipos de cliente sin perder desempeño.',
  },
  {
    label: 'Potencial de desarrollo',
    pct: 82,
    desc: 'Proyecta tu capacidad de crecer en el rol, asumir mayores responsabilidades y desarrollarse profesionalmente en el contexto adecuado.',
  },
];

const BENEFITS = [
  {
    title: 'Gratis para siempre',
    desc: 'Crear tu perfil, actualizarlo y postularte a oportunidades nunca tendrá costo.',
  },
  {
    title: 'Siempre informado',
    desc: 'Conoce el estado de cada proceso en tiempo real. Sin incertidumbre ni silencios.',
  },
  {
    title: 'Un solo perfil para todas las oportunidades',
    desc: 'Crea tu perfil una sola vez y conecta con empresas donde tus habilidades y forma de trabajar realmente encajen.',
  },
  {
    title: 'Te acompañamos durante tus primeros 90 días',
    desc: 'Si te contratan, te acompañamos en la integración para facilitar tu adaptación al modelo del equipo.',
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
  { n: '01', title: 'Crea tu perfil' },
  { n: '02', title: 'Muestra cómo vendes' },
  { n: '03', title: 'Recibe oportunidades alineadas' },
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
                <strong>Perfil comercial</strong>
                <span>Excelente compatibilidad</span>
              </div>
            </div>

            <div className="emp-float emp-float--checks">
              <div>
                <em>✓</em> Perfil completo
              </div>
              <div>
                <em>✓</em> Perfil listo
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
            Cada perfil se evalúa para destacar las habilidades, conocimientos y nivel de
            alineación que realmente influyen en el éxito de una contratación comercial.
            Selecciona cada dimensión para ver qué representa.
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

      {/* JOURNEY */}
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
