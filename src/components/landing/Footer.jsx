import { Link } from 'react-router-dom';

/** Site chrome footer for wave inner pages (`SiteLayout`). */
export default function Footer() {
  return (
    <footer className="kv-footer">
      <div className="kv-wrap">
        <p className="kv-footer-meta">
          <Link to="/" className="kv-footer-meta">
            Kova
          </Link>
          {' · Reclutamiento comercial, con evidencia'}
        </p>
      </div>
    </footer>
  );
}
