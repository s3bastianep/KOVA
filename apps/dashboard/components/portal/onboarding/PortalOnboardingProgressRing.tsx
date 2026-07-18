'use client';

type Props = {
  percent: number;
  size?: number;
};

export function PortalOnboardingProgressRing({ percent, size = 88 }: Props) {
  const stroke = Math.max(4, Math.round(size * 0.055));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));
  const offset = circumference - (clamped / 100) * circumference;
  const isComplete = clamped >= 100;
  // Keep the number well inside the stroke; never compete with a long label.
  const valueSize = Math.round(size * 0.28);

  return (
    <div
      className={`ob-ring${isComplete ? ' ob-ring--complete' : ''}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${clamped}% completado`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          className="ob-ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          shapeRendering="geometricPrecision"
        />
        <circle
          className="ob-ring__progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          shapeRendering="geometricPrecision"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ob-ring__label">
        <strong style={{ fontSize: valueSize }}>{clamped}%</strong>
      </div>
    </div>
  );
}
