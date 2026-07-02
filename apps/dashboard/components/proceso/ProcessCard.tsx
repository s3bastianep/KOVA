import Link from 'next/link';
import { Building2, Users, Calendar, Trophy, Clock } from 'lucide-react';
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

  return (
    <Link href={link} className="kova-card p-5 block hover:shadow-md transition-all hover:border-slate-200">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--kova-navy)' }}>{title}</h3>
          {companyName && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <Building2 className="w-3 h-3" />
              {companyId ? (
                <span onClick={(e) => e.preventDefault()} className="pointer-events-none">{companyName}</span>
              ) : (
                companyName
              )}
            </p>
          )}
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 shrink-0">{processStatusLabel(status)}</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">Progreso</span>
          <span className="font-semibold" style={{ color: 'var(--kova-blue)' }}>{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--kova-blue)' }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="p-2 rounded-lg bg-slate-50">
          <Users className="w-3.5 h-3.5 mx-auto text-slate-400 mb-0.5" />
          <p className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>{candidatesCount}</p>
          <p className="text-[10px] text-slate-400">Candidatos</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-50">
          <Calendar className="w-3.5 h-3.5 mx-auto text-slate-400 mb-0.5" />
          <p className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>{interviewsCount}</p>
          <p className="text-[10px] text-slate-400">Entrevistas</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-50">
          <Trophy className="w-3.5 h-3.5 mx-auto text-slate-400 mb-0.5" />
          <p className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>{finalistsCount}</p>
          <p className="text-[10px] text-slate-400">Finalistas</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
        {consultantName && <span>{consultantName}</span>}
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
