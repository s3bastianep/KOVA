function Squiggle({ color = 'var(--kv-indigo)' }) {
  return (
    <svg viewBox="0 0 90 16" width="90" height="16" aria-hidden>
      <path
        d="M0,8 L12,2 L24,14 L36,2 L48,14 L60,8 L72,8 L90,8"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

export default function SquiggleDivider({ label, dark = false }) {
  return (
    <div className={`kv-squiggle${dark ? ' kv-squiggle--dark' : ''}`}>
      <Squiggle color={dark ? 'var(--kv-lime)' : 'var(--kv-indigo)'} />
      <span className="font-mono">{label}</span>
    </div>
  );
}
