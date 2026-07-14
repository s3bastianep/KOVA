import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="kova-navbar kv-nav" aria-label="Principal">
      <div className="kova-navbar-inner">
        <Link to="/" className="kv-logo">
          kova<span className="kv-logo-dot">.</span>
        </Link>

        <div className="kv-navlinks" aria-label="Secciones">
          <Link to={{ pathname: '/', hash: 'metodologia' }}>Metodología</Link>
          <Link to="/servicios">Servicios</Link>
          <Link to="/guias">Blog</Link>
        </div>

        <div className="kv-nav-actions">
          <Link to="/registro" className="kv-nav-quiet">
            Busco empleo
          </Link>
          <Link to="/login" className="kv-nav-quiet">
            Entrar
          </Link>
          <Link to={{ pathname: '/', hash: 'contacto' }} className="kv-cta-pill">
            Agendar
          </Link>
        </div>
      </div>
    </nav>
  );
}
