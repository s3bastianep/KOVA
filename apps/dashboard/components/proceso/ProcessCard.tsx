import Link from 'next/link';
import { Users, Calendar, Trophy, Clock, Briefcase, ArrowUpRight } from 'lucide-react';
import { processStatusLabel, processProgress } from '@/lib/process-status';

type ProcessCardProps = {
  id: string;
  title: string;
  status: string;
  companyName?: string;
  companyId?: string;
  candidatesCount?: number;
  interviewsCount?: number;
  finalistsCount?: number;
  progress?: number;
  dueDate?: string;
  consultantName?: string;
  href?: string;
};

function statusStyle(status: string): { bg: string; color: string; bar: string } {
  const map: Record<string, { bg: string; color: string; bar: string }> = {
    DRAFT: { bg: '#F1F5F9', color: '#64748B', bar: '#94A3B8' },
    DISCOVERY_PENDING: { bg: '#EEF2FA', color: '#1A3FAA', bar: '#1A3FAA' },
    DISCOVERY: { bg: '#EEF2FA', color: '#1A3FAA', bar: '#1A3FAA' },
    PROFILE_BUILDING: { bg: '#EEF2FA', color: '#2D5BE3', bar: '#2D5BE3' },
    APPROVAL_PENDING: { bg: '#FFF7E6', color: '#B7791F', bar: '#F59E0B' },
    SEARCH_ACTIVE: { bg: '#E6FAF3', color: '#047857', bar: '#00B27A' },
    EVALUATION: { bg: '#F3E8FF', color: '#7C3AED', bar: '#7C3AED' },
    FINALISTS: { bg: '#FDF2F8', color: '#BE185D', bar: '#DB2777' },
    OFFER: { bg: '#FFF7ED', color: '#C2410C', bar: '#EA580C' },
    HIRED: { bg: '#E6FAF3', color: '#047857', bar: '#00B27A' },
    CLOSED: { bg: '#F1F5F9', color: '#64748B', bar: '#94A3B8' },
    PAUSED: { bg: '#FFF0EE', color: '#DC2626', bar: '#FF3B30' },
  };
  return map[status] ?? { bg: '#EEF2FA', color: '#1A3FAA', bar: '#1A3FAA' };
}

function initials(name?: string) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

export function ProcessCard({
  id,
  title,
  status,
  companyName,
  companyId,
  candidatesCount = 0,
  interviewsCount = 0,
  finalistsCount = 0,
  progress,
  dueDate,
  consultantName,
  href,
}: ProcessCardProps) {
  const pct = progress ?? processProgress(status);
  const link = href ?? `/procesos/${id}`;
  const st = statusStyle(status);

  return (
    <Link
      href={link}
      className="kova-card group relative overflow-hidden p-5 block hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <span className="absolute inset-x-0 top-0 h-1" style={{ background: st.bar }} />

      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-heading font-bold text-sm"
          style={{ background: st.bg, color: st.color }}
        >
          {initials(companyName)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold leading-tight truncate" style={{ color: 'var(--kova-navy)' }}>
            {companyName ?? 'Sin empresa'}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
            <Briefcase className="w-3 h-3 shrink-0" />
            {title}
          </p>
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--kova-blue)] transition-colors shrink-0" />
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: st.bg, color: st.color }}>
          {processStatusLabel(status)}
        </span>
        <span className="font-heading font-bold text-sm" style={{ color: st.color }}>{pct}%</span>
      </div>

      <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-4">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: st.bar }} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-blue-50/40 transition-colors">
          <Users className="w-3.5 h-3.5 mx-auto text-slate-400 mb-1" />
          <p className="text-base font-bold leading-none" style={{ color: 'var(--kova-navy)' }}>{candidatesCount}</p>
          <p className="text-[10px] text-slate-400 mt-1">Candidatos</p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-blue-50/40 transition-colors">
          <Calendar className="w-3.5 h-3.5 mx-auto text-slate-400 mb-1" />
          <p className="text-base font-bold leading-none" style={{ color: 'var(--kova-navy)' }}>{interviewsCount}</p>
          <p className="text-[10px] text-slate-400 mt-1">Entrevistas</p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-blue-50/40 transition-colors">
          <Trophy className="w-3.5 h-3.5 mx-auto text-slate-400 mb-1" />
          <p className="text-base font-bold leading-none" style={{ color: 'var(--kova-navy)' }}>{finalistsCount}</p>
          <p className="text-[10px] text-slate-400 mt-1">Finalistas</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
        {consultantName && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-semibold text-slate-500">
              {initials(consultantName)}
            </span>
            {consultantName}
          </span>
        )}
        {dueDate && (
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(dueDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>
    </Link>
  );
}
