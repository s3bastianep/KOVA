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
  sm: { track: 'h-1.5', ball: 'w-4 h-4 text-[8px]', headerPct: 'text-[10px]', headerStep: 'text-[9px]' },
  md: { track: 'h-2', ball: 'w-5 h-5 text-[9px]', headerPct: 'text-xs', headerStep: 'text-[10px]' },
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
        <div className="flex items-center justify-between mb-1.5 gap-2">
          <span className="text-[10px] text-slate-400 shrink-0">Progreso del proceso</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`${s.headerStep} font-semibold text-slate-500`}>
              Etapa {stage.step}/{stage.total}
            </span>
            <span className={`${s.headerPct} font-bold`} style={{ color }}>
              {pct}%
            </span>
          </div>
        </div>
      )}

      <div className="relative py-1">
        <div className={`${s.track} rounded-full bg-slate-100 overflow-hidden`}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        <div
          className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-heading font-bold text-white ${s.ball}`}
          style={{ left: `${ballLeft}%`, background: color }}
          title={`Etapa ${stage.step}: ${stage.label}`}
          aria-label={`Etapa ${stage.step} de ${stage.total}, ${pct}% completado`}
        >
          {stage.step}
        </div>
      </div>
    </div>
  );
}
