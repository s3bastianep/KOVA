import { useEffect, useId, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const MAIN_LINKS = [
  { to: '/para-empresas', label: 'Empresas' },
  { to: '/empleo', label: 'Talento' },
  { to: '/guias', label: 'Blog' },
];

const CONTACT_CTA = { to: '/para-empresas#contacto', label: 'Contáctanos' };

const ACTION_LINKS = [
  { to: '/login', label: 'Ingresar' },
  { to: '/registro', label: 'Crear cuenta' },
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
          {MAIN_LINKS.map((item) =>
            item.to.includes('#') ? (
              <Link key={item.label} to={item.to}>
                {item.label}
              </Link>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/para-empresas' || item.to === '/guias'}
                className={({ isActive }) => {
                  const onBlogArticle = item.to === '/guias' && pathname.startsWith('/guia-');
                  return isActive || onBlogArticle ? 'is-active' : undefined;
                }}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </div>

        <div className="kv-nav-actions">
          {ACTION_LINKS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => `kv-nav-quiet${isActive ? ' is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to={CONTACT_CTA.to}
            className="kv-cta-pill kv-cta-pill--lime"
            onClick={() => {
              if (pathname !== '/para-empresas') return;
              window.setTimeout(() => {
                const el = document.getElementById('contacto');
                if (!el) return;
                const lenis = window.__kovaLenis;
                if (lenis) lenis.scrollTo(el, { offset: -88 });
                else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 0);
            }}
          >
            {CONTACT_CTA.label}
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
                to={CONTACT_CTA.to}
                className="kv-cta-pill kv-cta-pill--lime kv-nav-drawer__cta"
                onClick={() => {
                  setOpen(false);
                  if (pathname !== '/para-empresas') return;
                  window.setTimeout(() => {
                    const el = document.getElementById('contacto');
                    if (!el) return;
                    const lenis = window.__kovaLenis;
                    if (lenis) lenis.scrollTo(el, { offset: -88 });
                    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 0);
                }}
              >
                {CONTACT_CTA.label}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
