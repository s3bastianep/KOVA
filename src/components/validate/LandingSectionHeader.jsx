import { LT } from '@/theme/landingTheme';

export default function LandingSectionHeader({
  index,
  eyebrow,
  title,
  accent,
  description,
  align = 'left',
  dark = false,
  className = '',
  palette = LT,
}) {
  const P = palette;
  const centered = align === 'center';

  return (
    <header
      className={`kova-b2b-header ${centered ? 'text-center mx-auto' : ''} ${className}`}
      style={{ maxWidth: centered ? '40rem' : undefined }}
    >
      {(index || eyebrow) && (
        <p className="kova-b2b-eyebrow mb-4" style={{ color: dark ? P.textMutedDark : P.textMuted }}>
          {index && (
            <span className="tabular-nums font-medium" style={{ color: dark ? (P.goldBright || P.amber) : (P.emerald || P.tealMid) }}>
              {index}
            </span>
          )}
          {index && eyebrow && <span className="mx-2 opacity-40" aria-hidden>·</span>}
          {eyebrow}
        </p>
      )}

      <h2
        className="font-heading font-bold kova-b2b-title text-balance"
        style={{ color: dark ? P.textOnDark : P.textDark }}
      >
        {title}
        {accent && (
          <>
            {' '}
            <span style={{ color: dark ? (P.goldBright || P.amberBright) : (P.emerald || P.tealMid) }}>{accent}</span>
          </>
        )}
      </h2>

      {description && (
        <p
          className={`kova-b2b-lead mt-4 text-balance ${centered ? 'mx-auto' : ''}`}
          style={{ color: dark ? P.textSoft : P.textBody }}
        >
          {description}
        </p>
      )}
    </header>
  );
}
