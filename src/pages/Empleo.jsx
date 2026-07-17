import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import '@/styles/landing-home-plain.css';
import '@/styles/empleo.css';

const DIMENSIONS = [
  {
    label: 'Compatibilidad comercial',
    pct: 94,
    desc: 'Este indicador refleja qué tan alineado está su perfil con el modelo de negocio, la forma de vender, la filosofía y las necesidades de una empresa, ayudando a identificar oportunidades donde tenga mayores probabilidades de adaptarse, generar resultados y crecer profesionalmente.',
  },
  {
    label: 'Competencias de venta',
    pct: 89,
    desc: 'Evalúa sus habilidades comerciales demostradas — prospección, manejo de objeciones, negociación y cierre — según el tipo de venta en el que mejor se desempeña.',
  },
  {
    label: 'Comunicación',
    pct: 91,
    desc: 'Refleja su capacidad para construir relaciones, presentar ideas con claridad y sostener conversaciones de valor con clientes y equipos.',
  },
  {
    label: 'Alineación con la empresa',
    pct: 88,
    desc: 'Mide la afinidad entre su filosofía de trabajo y la cultura, el modelo comercial y el entorno de la organización.',
  },
  {
    label: 'Adaptabilidad',
    pct: 85,
    desc: 'Indica con qué facilidad se ajusta a nuevos productos, ciclos de venta y tipos de cliente sin perder desempeño.',
  },
  {
    label: 'Potencial de desarrollo',
    pct: 82,
    desc: 'Proyecta su capacidad de crecer en el rol, asumir mayores responsabilidades y desarrollarse profesionalmente en el contexto adecuado.',
  },
];

const BENEFITS = [
  {
    title: 'Gratis para siempre',
    desc: 'Crear su perfil, actualizarlo y postularse a oportunidades no tiene ningún costo.',
  },
  {
    title: 'Siempre informado',
    desc: 'Conozca el estado de cada proceso en tiempo real. Sin incertidumbre ni falta de respuesta.',
  },
  {
    title: 'Un solo perfil para todas las oportunidades',
    desc: 'Cree su perfil una sola vez. Nosotros lo conectamos con las empresas donde realmente puede encajar.',
  },
  {
    title: 'Lo acompañamos en sus primeros 90 días',
    desc: 'Si es contratado, seguimos a su lado durante el proceso de integración para facilitar su adaptación y aumentar sus probabilidades de éxito.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Cree su perfil',
    text: 'En 10 minutos. Cuente lo que ha logrado vendiendo, no llene otro formulario aburrido.',
  },
  {
    n: '02',
    title: 'Muestre lo que sabe hacer',
    text: 'Recibe su Kova Score con base en casos reales. Sus fortalezas, por fin visibles.',
  },
  {
    n: '03',
    title: 'Reciba las oportunidades',
    text: 'Las empresas que buscan su perfil lo contactan. Usted elige, con las condiciones claras.',
  },
];

const FEATURES = [
  {
    ico: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M4 12h11M11 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Un solo perfil para crecer',
    text: 'Cree su perfil una sola vez. Nosotros lo conectamos con empresas donde sus habilidades, experiencia, valores y forma de trabajar tengan mayores probabilidades de generar resultados.',
  },
  {
    ico: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M12 3v3M12 18v3M4.2 12H1M23 12h-3.2M6 6l1.8 1.8M16.2 16.2 18 18M18 6l-1.8 1.8M7.8 16.2 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
    title: 'Oportunidades alineadas con usted',
    text: 'Defina sus expectativas salariales, ubicación, industrias de interés y tipo de empresa. Solo le mostraremos oportunidades compatibles con su perfil.',
  },
  {
    ico: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M4 5h16v11H8l-4 4V5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Procesos claros de principio a fin',
    text: 'Conozca el estado de cada proceso y reciba una respuesta, incluso cuando una oportunidad no continúe. Porque el respeto también hace parte de una buena experiencia.',
  },
  {
    ico: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M12 3v18M8 7h8M7 11h10M9 15h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="12" cy="20" r="1.2" fill="currentColor" />
      </svg>
    ),
    title: 'Lo acompañamos en sus primeros 90 días',
    text: 'Si es contratado, seguimos a su lado durante su integración para facilitar la adaptación al negocio, acelerar su curva de aprendizaje y ayudarle a comenzar con el pie derecho.',
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
          <div className="emp-band__sectors">
            <span className="emp-band__sectors-label">Empresas que lo buscan en</span>
            <div className="emp-band__sectors-pills">
              {['Energía y minería', 'Manufactura', 'Consumo masivo', 'Servicios financieros', 'Tecnología'].map(
                (s) => (
                  <span key={s} className="emp-pill">{s}</span>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SCORE EXPLORER */}
      <section id="beneficios" className="emp-sec emp-sec--dark">
        <div className="emp-wrap">
          <div className="emp-eyebrow">Su verdadera carta de presentación</div>
          <h2 className="emp-h2 emp-head">
            Una hoja de vida cuenta su experiencia. El Kova Score muestra{' '}
            <em>el valor que puede aportar</em> a una empresa.
          </h2>
          <p className="emp-sub">
            Cada perfil se evalúa para destacar las habilidades, conocimientos y nivel de
            alineación que realmente influyen en el éxito de una contratación comercial.
            Seleccione cada dimensión para ver qué representa.
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

      {/* FEATURE + FAN-OUT INFOGRAPHIC */}
      <section className="emp-sec emp-sec--tight emp-sec--light">
        <div className="emp-wrap emp-feature">
          <div>
            <h2 className="emp-h2 emp-h2--sub">
              Deje de perseguir oportunidades. Deje que{' '}
              <em>las oportunidades correctas lo encuentren</em>.
            </h2>
            <div className="emp-feature__list">
              {FEATURES.map((f) => (
                <div key={f.title} className="emp-feature__item">
                  <span className="emp-feature__ico" aria-hidden>
                    {f.ico}
                  </span>
                  <div>
                    <strong>{f.title}</strong>
                    <span>{f.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="emp-fan" aria-hidden>
            <div className="emp-fan__you">
              <span className="emp-fan__you-dot">JP</span>
              <div className="emp-fan__you-meta">
                <strong>Su perfil</strong>
                <span>Kova Score listo</span>
              </div>
              <span className="emp-fan__you-check">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
                  <path
                    d="M5 12.5 10 17.5 19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <svg className="emp-fan__lines" viewBox="0 0 300 56" preserveAspectRatio="none">
              <path className="emp-fan__line" d="M150 2 C150 30 52 26 52 54" />
              <path className="emp-fan__line" d="M150 2 C150 22 150 36 150 54" />
              <path className="emp-fan__line" d="M150 2 C150 30 248 26 248 54" />
              <circle className="emp-fan__spark" r="3">
                <animateMotion
                  dur="2.6s"
                  begin="0s"
                  repeatCount="indefinite"
                  path="M150 2 C150 30 52 26 52 54"
                />
              </circle>
              <circle className="emp-fan__spark" r="3">
                <animateMotion
                  dur="2.6s"
                  begin="0.9s"
                  repeatCount="indefinite"
                  path="M150 2 C150 22 150 36 150 54"
                />
              </circle>
              <circle className="emp-fan__spark" r="3">
                <animateMotion
                  dur="2.6s"
                  begin="1.8s"
                  repeatCount="indefinite"
                  path="M150 2 C150 30 248 26 248 54"
                />
              </circle>
            </svg>
            <div className="emp-fan__jobs">
              {[
                { title: 'Ejecutivo B2B', pct: 92, top: true },
                { title: 'Key Account', pct: 88 },
                { title: 'Ventas técnicas', pct: 85 },
              ].map((j) => (
                <div
                  key={j.title}
                  className={`emp-fan__job${j.top ? ' emp-fan__job--top' : ''}`}
                  style={{ '--p': j.pct }}
                >
                  {j.top && <span className="emp-fan__job-badge">Mejor match</span>}
                  <span className="emp-fan__job-ring">
                    <b>{j.pct}%</b>
                  </span>
                  <strong>{j.title}</strong>
                  <span className="emp-fan__job-sub">Compatibilidad</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY INFOGRAPHIC */}
      <section className="emp-sec emp-sec--tight emp-sec--dark">
        <div className="emp-wrap">
          <h2 className="emp-h2 emp-h2--sub emp-head">
            De donde está hoy a su próxima <em>gran oportunidad</em>.
          </h2>
          <div className="emp-journey">
            {STEPS.map((s) => (
              <div key={s.n} className="emp-step">
                <div className="emp-step__n">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
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
              <span className="emp-cta__eyebrow">Su próxima oportunidad empieza aquí</span>
              <h2>
                El trabajo que merece <em>no depende de la suerte</em>.
              </h2>
              <p className="emp-cta__lead">
                Cree su perfil una vez, deje que las empresas lo encuentren y avance con
                condiciones claras desde el primer contacto.
              </p>
              <div className="emp-cta__ctas">
                <Link to="/registro" className="emp-btn emp-btn--light">
                  Crear mi perfil gratis
                  <span aria-hidden>↗</span>
                </Link>
                <Link to="/login" className="emp-btn emp-btn--ghost">
                  Ya tengo cuenta
                </Link>
              </div>
              <p className="emp-cta__note">10 minutos · gratis · sin compromiso</p>
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
            <nav className="kh-footer__nav" aria-label="Pie de página">
              <Link to="/para-empresas">Empresas</Link>
              <a href="#beneficios">Beneficios</a>
              <Link to="/guias">Blog</Link>
              <Link to="/registro">Crear perfil</Link>
              <Link to="/login">Entrar</Link>
            </nav>
            <p className="kh-footer__copy">© 2026 Kova</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
