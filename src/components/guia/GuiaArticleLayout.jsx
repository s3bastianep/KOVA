import { Link } from 'react-router-dom';
import { getRelatedGuides } from './guiaRoutes';

export function GuiaDivider() {
  return <hr className="kv-guia-divider" aria-hidden />;
}

export function GuiaSectionTitle({ id, children }) {
  return (
    <h2 id={id} className="kv-guia-section-title font-display">
      {children}
    </h2>
  );
}

export function GuiaProse({ children, className = '', lead = false }) {
  return (
    <p className={`kv-guia-p${lead ? ' kv-guia-p--lead' : ''}${className ? ` ${className}` : ''}`}>
      {children}
    </p>
  );
}

export function GuiaQuote({ children }) {
  return <blockquote className="kv-guia-quote">{children}</blockquote>;
}

export function GuiaNumberedItem({ num, title, children }) {
  return (
    <div className="kv-guia-numbered">
      <h3 className="font-display">
        <span className="kv-guia-numbered-num">{num}</span>
        {title}
      </h3>
      <p>{children}</p>
    </div>
  );
}

export function GuiaIssueBlock({ id, num, title, paragraphs, solution }) {
  return (
    <article id={id} className="kv-guia-issue">
      <h3 className="font-display">
        <span className="kv-guia-issue-num">{num}</span>
        {title}
      </h3>
      {paragraphs.map((p) => (
        <p key={p.slice(0, 48)}>{p}</p>
      ))}
      <div className="kv-guia-solution">
        <p className="kv-guia-solution-label font-mono">Cómo lo resuelve Kova</p>
        <p>{solution}</p>
      </div>
    </article>
  );
}

export function GuiaFeatureCard({ image, imageAlt, badge, title, children, stats, source }) {
  return (
    <div className="kv-guia-feature">
      <div className="kv-guia-feature-media">
        <img src={image} alt={imageAlt} loading="lazy" />
      </div>
      <div className="kv-guia-feature-body">
        <span className="kv-guia-feature-badge font-mono">{badge}</span>
        <p className="kv-guia-feature-title font-display">{title}</p>
        <div className="kv-guia-feature-copy">{children}</div>
        {stats?.length > 0 && (
          <div className="kv-guia-feature-stats">
            {stats.map(({ value, label, wide }) => (
              <div key={label} className={`kv-guia-feature-stat${wide ? ' kv-guia-feature-stat--wide' : ''}`}>
                <p className="kv-guia-feature-stat-value font-display">{value}</p>
                <p className="kv-guia-feature-stat-label">{label}</p>
              </div>
            ))}
          </div>
        )}
        {source && <p className="kv-guia-feature-source font-mono">{source}</p>}
      </div>
    </div>
  );
}

export function GuiaSkillGrid({ items }) {
  return (
    <div className="kv-guia-skills">
      {items.map(({ title, desc }) => (
        <div key={title} className="kv-guia-skill-card">
          <h4 className="font-display">{title}</h4>
          <p>{desc}</p>
        </div>
      ))}
    </div>
  );
}

export function GuiaCallout({ title, items }) {
  return (
    <div className="kv-guia-callout">
      <p className="kv-guia-callout-label font-mono">{title}</p>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function GuiaCtaBand({ eyebrow, title, description, ctaLabel, ctaTo }) {
  return (
    <div className="kv-guia-cta-band">
      {eyebrow && <p className="kv-guia-cta-band-eyebrow font-mono">{eyebrow}</p>}
      <h3 className="kv-guia-cta-band-title font-display">{title}</h3>
      <p className="kv-guia-cta-band-desc">{description}</p>
      <Link to={ctaTo} className="kv-guia-cta-btn kv-guia-cta-btn--primary kv-guia-cta-band-btn">
        {ctaLabel}
      </Link>
    </div>
  );
}

export function GuiaArticleCTA({ title, description, primaryLabel, primaryTo, secondaryLabel, secondaryTo }) {
  return (
    <div className="kv-guia-article-cta">
      <h2 className="kv-guia-section-title font-display">{title}</h2>
      <GuiaProse>{description}</GuiaProse>
      <div className="kv-guia-article-cta-actions">
        <Link to={primaryTo} className="kv-guia-cta-btn kv-guia-cta-btn--primary">
          {primaryLabel}
        </Link>
        <Link to={secondaryTo} className="kv-guia-cta-btn kv-guia-cta-btn--secondary">
          {secondaryLabel}
        </Link>
      </div>
    </div>
  );
}

export function GuiaInlineImage({ src, alt, caption }) {
  return (
    <figure className="kv-guia-figure">
      <div className="kv-guia-figure-frame">
        <img src={src} alt={alt} loading="lazy" />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function GuiaRelatedGuides({ currentPath }) {
  const others = getRelatedGuides(currentPath);
  if (!others.length) return null;

  return (
    <div className="kv-guia-related">
      <p className="kv-guia-related-title font-display">Más del blog</p>
      <div className="kv-guia-related-list">
        {others.map(({ path, title, readTime, excerpt }) => (
          <Link key={path} to={path} className="kv-guia-related-item">
            <p className="font-display">{title}</p>
            {excerpt && <p>{excerpt}</p>}
            <span className="font-mono">Lectura de {readTime}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
