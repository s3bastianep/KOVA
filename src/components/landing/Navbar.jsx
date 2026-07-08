import { Link } from 'react-router-dom';
import { CN_CTA_LABEL_SHORT } from '@/theme/landingConsult';
import { dashboardHref } from '@/lib/dashboardLinks';
import NavLinkItem from '@/components/landing/NavLinkItem';

const navLinks = [
  ['Servicios', '/servicios'],
  ['Busco empleo', '/registro'],
  ['Nuestra metodología', '/como-trabajamos'],
  ['Quiénes somos', '/quienes-somos'],
  ['Blog', '/guias'],
];

export default function Navbar() {
  return (
    <nav className="kova-navbar kv-nav">
      <div className="kova-navbar-inner">
        <Link to="/" className="kv-logo">
          <span className="kv-logo-mark" aria-hidden />
          Kova
        </Link>

        <div className="kv-navlinks">
          {navLinks.map(([label, path]) => (
            <NavLinkItem key={path} to={path}>
              {label}
            </NavLinkItem>
          ))}
        </div>

        <div className="kv-nav-actions">
          <a href={dashboardHref('/login')} className="kova-nav-login kv-nav-login">
            Iniciar sesión
          </a>
          <Link to="/contacto" className="kv-cta-pill">
            {CN_CTA_LABEL_SHORT}
          </Link>
        </div>
      </div>
    </nav>
  );
}
