'use client';

type Props = {
  percent: number;
  size?: number;
};

export function PortalOnboardingProgressRing({ percent, size = 88 }: Props) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;

  const isComplete = percent >= 100;

  return (
    <div
      className={`ob-ring${isComplete ? ' ob-ring--complete' : ''}`}
      style={{ width: size, height: size }}
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
        <strong>{percent}%</strong>
        <span>Completado</span>
      </div>
    </div>
  );
}
