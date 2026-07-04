import { processProgress, processStageInfo } from '@/lib/process-status';

type ProcessProgressBarProps = {
  status: string;
  progress?: number;
  color?: string;
  size?: 'sm' | 'md';
  showHeader?: boolean;
  className?: string;
};

const SIZE = {
  sm: { track: 'h-2', ball: 'w-5 h-5 text-[9px]', headerPct: 'text-[11px]', headerStep: 'text-[10px]', stage: 'text-xs' },
  md: { track: 'h-2.5', ball: 'w-6 h-6 text-[10px]', headerPct: 'text-sm', headerStep: 'text-[11px]', stage: 'text-sm' },
} as const;

export function ProcessProgressBar({
  status,
  progress,
  color = 'var(--kova-green)',
  size = 'md',
  showHeader = true,
  className = '',
}: ProcessProgressBarProps) {
  const stage = processStageInfo(status);
  const pct = progress ?? stage.progress;
  const ballLeft = Math.min(Math.max(pct, 6), 94);
  const s = SIZE[size];

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-2 gap-3">
          <div className="min-w-0">
            <p className={`font-semibold truncate ${s.stage}`} style={{ color: 'var(--kova-navy)' }}>
              {stage.label}
            </p>
            <p className={`${s.headerStep} text-slate-500 mt-0.5`}>
              Etapa {stage.step} de {stage.total}
            </p>
          </div>
          <span className={`${s.headerPct} font-bold tabular-nums shrink-0`} style={{ color }}>
            {pct}%
          </span>
        </div>
      )}

      <div className="relative py-1.5">
        <div className={`${s.track} rounded-full bg-slate-100 overflow-hidden`}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        <div
          className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md flex items-center justify-center font-heading font-bold text-white ${s.ball}`}
          style={{ left: `${ballLeft}%`, background: color }}
          title={`${stage.label} · Etapa ${stage.step} de ${stage.total}`}
          aria-label={`${stage.label}, etapa ${stage.step} de ${stage.total}, ${pct}% completado`}
        >
          {stage.step}
        </div>
      </div>
    </div>
  );
}
