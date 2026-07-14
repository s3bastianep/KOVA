import { Link } from 'react-router-dom';

export default function InnerPageHero({
  eyebrow,
  title,
  highlight,
  subtitle,
  ctaLabel = null,
  ctaTo = '/contacto',
  ctaHref = null,
  children = null,
  compact = false,
}) {
  return (
    <section className={`kv-inner-hero${compact ? ' kv-inner-hero--compact' : ''}`}>
      <div className={`kv-wrap${children ? ' kv-inner-hero-grid' : ''}`}>
        <div>
          {eyebrow && <p className="kv-eyebrow font-mono">{eyebrow}</p>}
          <h1 className="font-display">
            {title}
            {highlight && (
              <>
                {' '}
                <em>{highlight}</em>
              </>
            )}
          </h1>
          {subtitle && <p className="kv-inner-hero-sub">{subtitle}</p>}
          {ctaLabel &&
            (ctaHref ? (
              <a href={ctaHref} className="kv-btn-solid">
                {ctaLabel}
              </a>
            ) : (
              <Link to={ctaTo} className="kv-btn-solid">
                {ctaLabel}
              </Link>
            ))}
        </div>
        {children}
      </div>
    </section>
  );
}
