import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import '@/styles/landing-home-plain.css';
import '@/styles/empleo.css';

const DIMENSIONS = [
  {
    label: 'Compatibilidad comercial',
    pct: 94,
    desc: 'Las empresas ven de inmediato que usted vende como ellas necesitan, no un CV genérico más.',
  },
  {
    label: 'Competencias de venta',
    pct: 89,
    desc: 'Su prospección, manejo de objeciones y cierre quedan demostrados con casos reales, no solo escritos.',
  },
  {
    label: 'Adaptabilidad',
    pct: 85,
    desc: 'Demuestra que puede rendir con nuevos productos, ciclos de venta y tipos de cliente.',
  },
  {
    label: 'Comunicación',
    pct: 91,
    desc: 'Su capacidad de convencer queda visible desde el primer contacto, no escondida en una hoja de vida.',
  },
  {
    label: 'Alineación cultural',
    pct: 88,
    desc: 'Lo conectamos con equipos donde de verdad va a querer quedarse, no solo con el primero que llame.',
  },
  {
    label: 'Potencial a largo plazo',
    pct: 82,
    desc: 'Las empresas apuestan por su crecimiento y su carrera, no solo por lo que rinde este mes.',
  },
];

const BENEFITS = [
  {
    title: 'Gratis para siempre',
    desc: 'No paga nada por crear su perfil ni por postularse a las vacantes.',
  },
  {
    title: 'Siempre informado',
    desc: 'Sabe en todo momento en qué va su proceso. Le contamos cada avance, sin dejarlo en el aire.',
  },
  {
    title: 'Cree su perfil una sola vez',
    desc: 'Sirve para todas las vacantes compatibles. Nunca más reenvíe su hoja de vida.',
  },
  {
    title: 'No lo dejamos solo',
    desc: 'Si lo contratan, lo acompañamos durante sus primeros 90 días en el cargo.',
  },
];

const STEPS = [
  {
    n: '1',
    title: 'Cree su perfil',
    text: 'En 10 minutos. Cuente lo que ha logrado vendiendo, no llene otro formulario aburrido.',
  },
  {
    n: '2',
    title: 'Muestre lo que sabe hacer',
    text: 'Recibe su Kova Score con base en casos reales. Sus fortalezas, por fin visibles.',
  },
  {
    n: '3',
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
    title: 'Contacto directo con la empresa',
    text: 'Sin intermediarios que filtran su perfil. Habla con quien realmente va a contratar.',
  },
  {
    ico: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M12 3v3M12 18v3M4.2 12H1M23 12h-3.2M6 6l1.8 1.8M16.2 16.2 18 18M18 6l-1.8 1.8M7.8 16.2 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
    title: 'Usted pone las condiciones',
    text: 'Diga cuánto quiere ganar, dónde y en qué industria. Solo verá lo que le sirve.',
  },
  {
    ico: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M4 5h16v11H8l-4 4V5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Razones claras si no avanza',
    text: 'Si una vacante no sigue adelante, le explicamos por qué. Nunca se queda sin respuesta.',
  },
];

export default function Empleo() {
  usePageMeta({
    title: 'Encuentre el trabajo comercial hecho para usted',
    description:
      'Cree su perfil comercial gratis, muestre lo que sabe hacer y deje que las empresas que buscan su talento lo encuentren.',
    path: '/empleo',
  });

  const [lit, setLit] = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLit(true), 200);
    return () => clearTimeout(t);
  }, []);

  const dim = DIMENSIONS[selected];

  return (
    <div className="kova-home-plain kova-empleo">
      {/* HERO */}
      <header id="top" className="emp-hero">
        <div className="emp-wrap emp-hero__grid">
          <div>
            <span className="kh-pill">Para vendedores y líderes comerciales</span>
            <h1>
              Encuentre el trabajo comercial <em>hecho para usted</em>.
            </h1>
            <p className="emp-hero__lead">
              Deje de enviar su hoja de vida al vacío. Cree su perfil una vez y deje que las
              empresas que buscan justo su talento lo encuentren, con las condiciones claras
              desde el inicio.
            </p>
            <div className="emp-hero__ctas">
              <Link to="/registro" className="kh-btn kh-btn--lime">
                Crear mi perfil gratis
                <span className="kh-btn__icon" aria-hidden>↗</span>
              </Link>
              <a href="#beneficios" className="kh-btn kh-btn--outline">
                Ver qué gano
              </a>
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
              <span className="emp-float__arrow">↑</span>
              <div>
                <strong>+47% este mes</strong>
                <span>Visibilidad del perfil</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* DARK BENEFITS BAND */}
      <section className="emp-band">
        <div className="emp-wrap">
          <h2 className="emp-band__title">
            Sin trucos. Sin letra pequeña. <em>Sin dejarlo esperando</em>.
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
      <section id="beneficios" className="emp-sec">
        <div className="emp-wrap">
          <div className="emp-eyebrow">Su verdadera carta de presentación</div>
          <h2 className="emp-h2 emp-head">
            Lo ven por lo que <em>sabe hacer</em>, no por su hoja de vida.
          </h2>
          <p className="emp-sub">
            Su Kova Score le muestra a cada empresa sus fortalezas comerciales reales. Toque cada
            una para ver qué destacan de usted.
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
              <span className="emp-detail__badge">Lo que ven de usted</span>
              <div className="emp-detail__num">{dim.pct}%</div>
              <div className="emp-detail__name">{dim.label}</div>
              <p className="emp-detail__desc">{dim.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE + FAN-OUT INFOGRAPHIC */}
      <section className="emp-sec emp-sec--tight">
        <div className="emp-wrap emp-feature">
          <div>
            <h2 className="emp-h2 emp-h2--sub">
              Deje de perseguir vacantes. Deje que <em>lo busquen a usted</em>.
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
              <strong>Su perfil</strong>
            </div>
            <svg className="emp-fan__lines" viewBox="0 0 300 40" preserveAspectRatio="none">
              <path d="M150 0 C150 20 60 20 60 40" fill="none" stroke="#0f7a40" strokeWidth="2" opacity="0.5" />
              <path d="M150 0 L150 40" fill="none" stroke="#0f7a40" strokeWidth="2" opacity="0.5" />
              <path d="M150 0 C150 20 240 20 240 40" fill="none" stroke="#0f7a40" strokeWidth="2" opacity="0.5" />
            </svg>
            <div className="emp-fan__jobs">
              {[
                { title: 'Ejecutivo B2B', pct: 92 },
                { title: 'Key Account', pct: 88 },
                { title: 'Ventas técnicas', pct: 85 },
              ].map((j) => (
                <div key={j.title} className="emp-fan__job">
                  <span className="emp-fan__job-ring">{j.pct}%</span>
                  <strong>{j.title}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY INFOGRAPHIC */}
      <section className="emp-sec emp-sec--tight" style={{ background: '#efe9dc' }}>
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
      <section className="emp-sec emp-cta">
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
              <Link to="/">Empresas</Link>
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
