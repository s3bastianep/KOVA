'use client';

import { journeyEncouragement } from '@/lib/portal-onboarding-unified';

type Props = {
  percent: number;
  compact?: boolean;
};

export function PortalOnboardingProgressIndicator({ percent, compact }: Props) {
  const status = journeyEncouragement(percent);

  return (
    <div
      className={`ob-progress${compact ? ' ob-progress--compact' : ''}`}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${percent}% completado`}
    >
      <div className="ob-progress__head">
        <strong>{percent}%</strong>
        {status && !compact ? <span>{status}</span> : null}
      </div>
      <div className="ob-progress__track">
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
