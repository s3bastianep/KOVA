import { useEffect, useId, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MAIN_LINKS = [
  { to: { pathname: '/', hash: 'metodologia' }, label: 'Metodología' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/guias', label: 'Blog' },
];

const ACTION_LINKS = [
  { to: '/registro', label: 'Busco empleo' },
  { to: '/login', label: 'Entrar' },
];

export default function Navbar() {
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <nav className="kova-navbar kv-nav" aria-label="Principal">
      <div className="kova-navbar-inner">
        <Link to="/" className="kv-logo" onClick={() => setOpen(false)}>
          kova<span className="kv-logo-dot">.</span>
        </Link>

        <div className="kv-navlinks" aria-label="Secciones">
          {MAIN_LINKS.map((item) => (
            <Link key={item.label} to={item.to}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="kv-nav-actions">
          {ACTION_LINKS.map((item) => (
            <Link key={item.label} to={item.to} className="kv-nav-quiet">
              {item.label}
            </Link>
          ))}
          <Link to={{ pathname: '/', hash: 'contacto' }} className="kv-cta-pill">
            Agendar
          </Link>
          <button
            type="button"
            className="kv-nav-toggle"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="kv-nav-toggle__bars" data-open={open ? 'true' : 'false'} aria-hidden />
          </button>
        </div>
      </div>

      {open ? (
        <div className="kv-nav-drawer" id={panelId}>
          <button
            type="button"
            className="kv-nav-drawer__backdrop"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <div className="kv-nav-drawer__panel" role="dialog" aria-modal="true" aria-label="Menú">
            <div className="kv-nav-drawer__links">
              {MAIN_LINKS.map((item) => (
                <Link key={item.label} to={item.to} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="kv-nav-drawer__actions">
              {ACTION_LINKS.map((item) => (
                <Link key={item.label} to={item.to} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <Link
                to={{ pathname: '/', hash: 'contacto' }}
                className="kv-cta-pill kv-nav-drawer__cta"
                onClick={() => setOpen(false)}
              >
                Agendar
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
