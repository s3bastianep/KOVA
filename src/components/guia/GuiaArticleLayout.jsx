import { Link } from 'react-router-dom';
import { getRelatedGuides } from './guiaRoutes';
import GuiaSidebar from './GuiaSidebar';

export function GuiaHeroSplit({ label, title, readTime, image, imageAlt }) {
  return (
    <header className="pt-[72px] bg-white">
      <div className="grid lg:grid-cols-2 min-h-[420px] lg:min-h-[480px]">
        <div className="flex flex-col justify-between px-6 lg:px-12 xl:px-16 py-12 lg:py-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-6" style={{ color: '#4338CA' }}>
              {label} · Lectura de {readTime}
            </p>
            <h1
              className="font-heading font-bold leading-tight"
              style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.65rem)', letterSpacing: '-0.03em', color: '#0F172A', lineHeight: 1.12 }}
            >
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-3 mt-10 lg:mt-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: '#4338CA' }}
            >
              K
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: '#0F172A' }}>Por Equipo Kova</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Actualizado el 26 de junio de 2026</p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[280px] lg:min-h-full">
          <img src={image} alt={imageAlt} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
}

export function GuiaDivider() {
  return <hr className="my-14 lg:my-16 border-0 h-px" style={{ background: '#E2E8F0' }} />;
}

export function GuiaSectionTitle({ id, children }) {
  return (
    <h2
      id={id}
      className="font-heading font-bold text-[1.65rem] lg:text-[1.75rem] leading-tight mb-5 scroll-mt-28"
      style={{ color: '#0F172A', letterSpacing: '-0.02em' }}
    >
      {children}
    </h2>
  );
}

export function GuiaProse({ children, className = '' }) {
  return (
    <p className={`text-[17px] leading-[1.85] mb-5 ${className}`} style={{ color: '#334155' }}>
      {children}
    </p>
  );
}

export function GuiaNumberedItem({ num, title, children }) {
  return (
    <div className="mb-8 last:mb-0">
      <h3 className="font-heading font-bold text-lg mb-3" style={{ color: '#0F172A' }}>
        {num}. {title}
      </h3>
      <p className="text-[17px] leading-[1.85]" style={{ color: '#334155' }}>
        {children}
      </p>
    </div>
  );
}

export function GuiaCallout({ title, items }) {
  return (
    <div
      className="rounded-xl p-6 lg:p-8 my-10"
      style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}
    >
      <p className="text-[11px] font-bold uppercase tracking-wider mb-5" style={{ color: '#1D4ED8' }}>
        {title}
      </p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[17px] leading-[1.75]" style={{ color: '#1E3A5F' }}>
            <span className="text-blue-600 mt-1.5 flex-shrink-0">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GuiaArticleCTA({ title, description, primaryLabel, primaryTo, secondaryLabel, secondaryTo }) {
  return (
    <div className="pt-14 border-t" style={{ borderColor: '#E2E8F0' }}>
      <h2 className="font-heading font-bold text-[1.65rem] leading-tight mb-5" style={{ color: '#0F172A' }}>
        {title}
      </h2>
      <GuiaProse className="mb-8">{description}</GuiaProse>
      <div className="flex flex-wrap gap-3">
        <Link
          to={primaryTo}
          className="inline-flex items-center justify-center font-semibold px-6 py-3.5 rounded-lg text-sm text-white transition-opacity hover:opacity-95"
          style={{ background: '#4338CA' }}
        >
          {primaryLabel}
        </Link>
        <Link
          to={secondaryTo}
          className="inline-flex items-center justify-center font-semibold px-6 py-3.5 rounded-lg text-sm transition-colors hover:bg-slate-50"
          style={{ background: '#FFFFFF', color: '#334155', border: '1px solid #CBD5E1' }}
        >
          {secondaryLabel}
        </Link>
      </div>
    </div>
  );
}

export function GuiaInlineImage({ src, alt, caption }) {
  return (
    <figure className="my-10">
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
        <img src={src} alt={alt} className="w-full h-auto object-cover" />
      </div>
      {caption && (
        <figcaption className="text-sm mt-3 leading-relaxed" style={{ color: '#64748B' }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function GuiaArticleShell({ currentPath, children }) {
  const related = getRelatedGuides(currentPath);

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_280px] gap-10 xl:gap-14">
          <article className="min-w-0 max-w-[720px] lg:max-w-none mx-auto lg:mx-0">
            {children}
          </article>
          <GuiaSidebar currentPath={currentPath} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="lg:hidden border-t px-6 py-8" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Más recursos de Kova</p>
          <div className="space-y-4">
            {related.map(({ path, title, readTime }) => (
              <Link key={path} to={path} className="block rounded-xl p-4 bg-white" style={{ border: '1px solid #E2E8F0' }}>
                <p className="text-sm font-semibold mb-0.5" style={{ color: '#4338CA' }}>{title}</p>
                <p className="text-xs" style={{ color: '#94A3B8' }}>Lectura de {readTime}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export function GuiaRelatedGuides({ currentPath }) {
  const others = getRelatedGuides(currentPath);
  if (!others.length) return null;

  return (
    <div className="mt-16 pt-10 border-t" style={{ borderColor: '#E2E8F0' }}>
      <p className="text-sm font-semibold mb-5" style={{ color: '#0F172A' }}>Más recursos de Kova</p>
      <div className="space-y-4">
        {others.map(({ path, title, readTime, excerpt }) => (
          <Link key={path} to={path} className="group block">
            <p className="text-base font-semibold group-hover:underline mb-1" style={{ color: '#4338CA' }}>{title}</p>
            {excerpt && (
              <p className="text-sm mb-1 leading-relaxed" style={{ color: '#64748B' }}>{excerpt}</p>
            )}
            <p className="text-xs" style={{ color: '#94A3B8' }}>Lectura de {readTime}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
