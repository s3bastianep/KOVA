'use client';

import { journeyEncouragement } from '@/lib/portal-onboarding-unified';

type Props = {
  percent: number;
  size?: number;
};

export function PortalOnboardingProgressRing({ percent, size = 88 }: Props) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="ob-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          className="ob-ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
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
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ob-ring__label">
        <strong>{percent}%</strong>
        <span>Completado</span>
        <em>{journeyEncouragement(percent)}</em>
      </div>
    </div>
  );
}
