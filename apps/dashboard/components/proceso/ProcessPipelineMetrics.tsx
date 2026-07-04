import { Users, UserCheck, ListFilter, ClipboardList, CalendarCheck, Trophy } from 'lucide-react';
import {
  type ProcessPipelineMetrics,
  PROCESS_PIPELINE_METRICS,
  emptyProcessPipelineMetrics,
} from '@/lib/process-metrics';

const ICONS = [Users, UserCheck, ListFilter, ClipboardList, CalendarCheck, Trophy] as const;

type ProcessPipelineMetricsProps = {
  metrics?: Partial<ProcessPipelineMetrics>;
  variant?: 'compact' | 'card' | 'row';
  className?: string;
};

export function ProcessPipelineMetrics({
  metrics,
  variant = 'compact',
  className = '',
}: ProcessPipelineMetricsProps) {
  const values = { ...emptyProcessPipelineMetrics(), ...metrics };

  if (variant === 'row') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {PROCESS_PIPELINE_METRICS.map(({ key, label, short }, index) => {
          const Icon = ICONS[index];
          const count = values[key];
          const active = count > 0;

          return (
            <div
              key={key}
              title={`${label}: ${count}`}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 min-w-[5.5rem] flex-1 sm:flex-none sm:min-w-[6.75rem] ${
                active
                  ? 'border-blue-100 bg-blue-50/80'
                  : 'border-slate-100 bg-slate-50/60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  active ? 'bg-white shadow-sm' : 'bg-white/70'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${active ? 'text-[var(--kova-blue)]' : 'text-slate-400'}`}
                  strokeWidth={2.25}
                />
              </div>
              <div className="min-w-0 leading-none">
                <p
                  className={`text-base font-bold tabular-nums ${active ? '' : 'text-slate-400'}`}
                  style={active ? { color: 'var(--kova-navy)' } : undefined}
                >
                  {count}
                </p>
                <p className={`text-[11px] mt-1 truncate ${active ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                  <span className="hidden xl:inline">{label}</span>
                  <span className="xl:hidden">{short}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`grid grid-cols-3 sm:grid-cols-6 gap-2 ${className}`}>
        {PROCESS_PIPELINE_METRICS.map(({ key, label }, index) => {
          const Icon = ICONS[index];
          const count = values[key];
          const active = count > 0;

          return (
            <div
              key={key}
              className={`p-2.5 rounded-xl border text-center min-w-0 transition-all ${
                active
                  ? 'border-blue-100 bg-blue-50/70 group-hover:bg-blue-50'
                  : 'border-slate-100 bg-slate-50/80 group-hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 mx-auto mb-1.5 ${active ? 'text-[var(--kova-blue)]' : 'text-slate-400'}`} />
              <p
                className={`text-lg font-bold leading-none tabular-nums ${active ? '' : 'text-slate-400'}`}
                style={active ? { color: 'var(--kova-navy)' } : undefined}
              >
                {count}
              </p>
              <p className={`text-[10px] mt-1.5 leading-tight ${active ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                {label}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center ${className}`}>
      {PROCESS_PIPELINE_METRICS.map(({ key, label, short }, index) => {
        const Icon = ICONS[index];
        const count = values[key];
        const active = count > 0;

        return (
          <div
            key={key}
            title={label}
            className={`rounded-xl border py-2 px-1 min-w-0 ${
              active ? 'border-blue-100 bg-blue-50/70' : 'border-slate-100 bg-slate-50/80'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 mx-auto ${active ? 'text-[var(--kova-blue)]' : 'text-slate-400'}`} />
            <p
              className={`text-sm font-bold leading-none mt-1 tabular-nums ${active ? '' : 'text-slate-400'}`}
              style={active ? { color: 'var(--kova-navy)' } : undefined}
            >
              {count}
            </p>
            <p className={`text-[10px] mt-1 leading-tight ${active ? 'text-slate-600' : 'text-slate-400'}`}>
              {short}
            </p>
          </div>
        );
      })}
    </div>
  );
}
