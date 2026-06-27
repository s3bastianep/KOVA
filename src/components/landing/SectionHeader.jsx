export default function SectionHeader({ eyebrow, title, description, align = 'center', dark = false, className = '' }) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  const maxW = align === 'center' ? 'max-w-2xl' : 'max-w-xl';

  return (
    <div className={`${alignClass} ${maxW} mb-14 lg:mb-16 ${className}`}>
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-4"
        style={{ color: dark ? '#A5B4FC' : '#6366F1' }}
      >
        {eyebrow}
      </p>
      <h2
        className="font-heading font-bold leading-tight mb-4"
        style={{
          fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
          color: dark ? '#FFFFFF' : '#0F172A',
          letterSpacing: '-0.025em',
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="text-base leading-relaxed"
          style={{ color: dark ? 'rgba(255,255,255,0.65)' : '#64748B', lineHeight: 1.75 }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
