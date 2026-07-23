import { Link } from 'react-router-dom';

/**
 * Wordmark oficial: "litt hunter" + cuadrado lime.
 * Usar en nav/footer de la landing (Vite).
 */
export default function BrandLogo({ to = '/', className = 'kv-logo', onClick }) {
  const classes = ['lh-mark', className].filter(Boolean).join(' ');
  const inner = (
    <>
      litt hunter
      <span className="lh-mark__sq" aria-hidden="true" />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} aria-label="Litt Hunter">
        {inner}
      </Link>
    );
  }

  return (
    <span className={classes} aria-label="Litt Hunter">
      {inner}
    </span>
  );
}
