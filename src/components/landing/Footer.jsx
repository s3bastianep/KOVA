import { Link } from 'react-router-dom';

/** Site chrome footer for wave inner pages (`SiteLayout`). */
export default function Footer() {
  return (
    <footer className="kv-footer">
      <div className="kv-wrap">
        <p className="kv-footer-meta">
          © {new Date().getFullYear()}{' '}
          <Link to="/">Kova</Link>
        </p>
      </div>
    </footer>
  );
}
