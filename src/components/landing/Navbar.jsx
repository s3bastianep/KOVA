import { useEffect, useId, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import BrandLogo from '@/components/BrandLogo';

const MAIN_LINKS = [
  { to: '/para-empresas', label: 'Para empresas' },
  { to: '/empleo', label: 'Para talento' },
  { to: '/guias', label: 'Blog' },
];

const CONTACT_CTA = { to: '/para-empresas#contacto', label: 'Contratar' };

const LOGIN_LINK = { to: '/login', label: 'Ingresar' };
const REGISTER_CTA = { to: '/registro', label: 'Crear perfil' };

function scrollToContacto() {
  window.setTimeout(() => {
    const el = document.getElementById('contacto');
    if (!el) return;
    const lenis = window.__kovaLenis;
    if (lenis) lenis.scrollTo(el, { offset: -88 });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.dispatchEvent(new CustomEvent('kova:deep-link-scroll'));
  }, 0);
}

export default function Navbar() {
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const hideContactCta = pathname === '/empleo' || pathname.startsWith('/empleo/');
  const hideAuthLinks =
    pathname === '/para-empresas' || pathname.startsWith('/para-empresas/');
  const showTalentGroup = !hideAuthLinks;
  const showCompanyCta = !hideContactCta;
  const showSeparator = showTalentGroup && showCompanyCta;

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
        <BrandLogo onClick={() => setOpen(false)} />

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
          {showTalentGroup ? (
            <div className="kv-nav-actions__group kv-nav-actions__group--talent" aria-label="Para talento">
              <NavLink
                to={LOGIN_LINK.to}
                className={({ isActive }) => `kv-nav-quiet${isActive ? ' is-active' : ''}`}
              >
                {LOGIN_LINK.label}
              </NavLink>
              <NavLink
                to={REGISTER_CTA.to}
                className={({ isActive }) =>
                  `kv-cta-pill kv-cta-pill--ghost${isActive ? ' is-active' : ''}`
                }
              >
                {REGISTER_CTA.label}
              </NavLink>
            </div>
          ) : null}

          {showSeparator ? <span className="kv-nav-actions__sep" aria-hidden /> : null}

          {showCompanyCta ? (
            <div className="kv-nav-actions__group kv-nav-actions__group--company" aria-label="Para empresas">
              <Link
                to={CONTACT_CTA.to}
                className="kv-cta-pill kv-cta-pill--lime"
                onClick={() => {
                  if (pathname !== '/para-empresas') return;
                  scrollToContacto();
                }}
              >
                {CONTACT_CTA.label}
              </Link>
            </div>
          ) : null}

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
              {showTalentGroup ? (
                <div className="kv-nav-drawer__group">
                  <p className="kv-nav-drawer__group-label">Talento</p>
                  <Link to={LOGIN_LINK.to} onClick={() => setOpen(false)}>
                    {LOGIN_LINK.label}
                  </Link>
                  <Link
                    to={REGISTER_CTA.to}
                    className="kv-cta-pill kv-cta-pill--ghost kv-nav-drawer__cta"
                    onClick={() => setOpen(false)}
                  >
                    {REGISTER_CTA.label}
                  </Link>
                </div>
              ) : null}
              {showCompanyCta ? (
                <div className="kv-nav-drawer__group">
                  <p className="kv-nav-drawer__group-label">Empresas</p>
                  <Link
                    to={CONTACT_CTA.to}
                    className="kv-cta-pill kv-cta-pill--lime kv-nav-drawer__cta"
                    onClick={() => {
                      setOpen(false);
                      if (pathname !== '/para-empresas') return;
                      scrollToContacto();
                    }}
                  >
                    {CONTACT_CTA.label}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
