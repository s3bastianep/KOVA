import { Users, UserCheck, ListFilter, ClipboardList, CalendarCheck, Trophy } from 'lucide-react';
import {
  type ProcessPipelineMetrics,
  PROCESS_PIPELINE_METRICS,
  emptyProcessPipelineMetrics,
} from '@/lib/process-metrics';

const ICONS = [Users, UserCheck, ListFilter, ClipboardList, CalendarCheck, Trophy] as const;

type ProcessPipelineMetricsProps = {
  metrics?: Partial<ProcessPipelineMetrics>;
  variant?: 'compact' | 'card';
  className?: string;
};

export function ProcessPipelineMetrics({
  metrics,
  variant = 'compact',
  className = '',
}: ProcessPipelineMetricsProps) {
  const values = { ...emptyProcessPipelineMetrics(), ...metrics };

  if (variant === 'card') {
    return (
      <div className={`grid grid-cols-3 sm:grid-cols-6 gap-2 text-center ${className}`}>
        {PROCESS_PIPELINE_METRICS.map(({ key, label }, index) => {
          const Icon = ICONS[index];
          return (
            <div
              key={key}
              className="p-2 rounded-xl bg-slate-50 group-hover:bg-blue-50/40 transition-colors min-w-0"
            >
              <Icon className="w-3.5 h-3.5 mx-auto text-slate-400 mb-1" />
              <p className="text-base font-bold leading-none" style={{ color: 'var(--kova-navy)' }}>
                {values[key]}
              </p>
              <p className="text-[9px] text-slate-400 mt-1 leading-tight">{label}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-3 sm:grid-cols-6 gap-1 text-center ${className}`}>
      {PROCESS_PIPELINE_METRICS.map(({ key, label }, index) => {
        const Icon = ICONS[index];
        return (
          <div key={key} className="rounded-lg bg-slate-50 py-1.5 px-0.5 min-w-0">
            <Icon className="w-3 h-3 mx-auto text-slate-400" />
            <p className="text-sm font-bold leading-none mt-0.5" style={{ color: 'var(--kova-navy)' }}>
              {values[key]}
            </p>
            <p className="text-[8px] text-slate-400 mt-0.5 leading-tight">{label}</p>
          </div>
        );
      })}
    </div>
  );
}
