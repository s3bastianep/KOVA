'use client';

import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Plus, GitBranch, Filter, List, LayoutGrid,
  PlayCircle, PauseCircle, CheckCircle2, Loader2, Archive,
  ChevronRight, Calendar, ArrowUpRight,
  ChevronLeft,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { ProcessCard } from '@/components/proceso/ProcessCard';
import { ProcessProgressBar } from '@/components/proceso/ProcessProgressBar';
import { ProcessPipelineMetrics } from '@/components/proceso/ProcessPipelineMetrics';
import {
  processStatusLabel,
  processProgress,
  ACTIVE_STATUSES,
  countProcessesByBucket,
  suggestProcessNextAction,
} from '@/lib/process-status';
import type { ProcessPipelineMetrics as ProcessPipelineMetricsType } from '@/lib/process-metrics';

type Proceso = {
  id: string;
  title: string;
  status: string;
  city?: string;
  company?: { id: string; name: string };
  _count?: { candidates: number };
  pipelineMetrics?: ProcessPipelineMetricsType;
  progress?: number;
  requiredDate?: string;
  createdAt?: string;
  consultantName?: string;
  consultant?: { firstName: string; lastName: string };
  nextActionTitle?: string;
  nextActionDetail?: string;
};

const ACTIVE_STATUSES_LIST = ACTIVE_STATUSES;

function statusColor(status: string): string {
  const map: Record<string, string> = {
    SEARCH_ACTIVE: '#00B27A', HIRED: '#00B27A',
    FINALISTS: '#DB2777', OFFER: '#EA580C',
    EVALUATION: '#7C3AED', PROFILE_BUILDING: '#2D5BE3',
    APPROVAL_PENDING: '#F59E0B', DISCOVERY: '#1A3FAA', DISCOVERY_PENDING: '#1A3FAA',
    PAUSED: '#94A3B8', CLOSED: '#94A3B8', DRAFT: '#94A3B8',
  };
  return map[status] ?? '#1A3FAA';
}

function initials(name?: string) {
  if (!name) return '?';
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
}

const PAGE_SIZE = 10;

type StatusFilter = 'all' | 'active' | 'review' | 'paused' | 'closed' | 'archived';

export default function ProcesosPage() {
  const { data, isLoading } = useQuery({ queryKey: ['vacancies'], queryFn: dashboardApi.vacancies });
  const procesos = (data as Proceso[]) ?? [];
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    switch (statusFilter) {
      case 'active': return procesos.filter((p) => ACTIVE_STATUSES_LIST.includes(p.status));
      case 'review': return procesos.filter((p) => p.status === 'APPROVAL_PENDING');
      case 'paused': return procesos.filter((p) => p.status === 'PAUSED');
      case 'closed': return procesos.filter((p) => p.status === 'HIRED');
      case 'archived': return procesos.filter((p) => p.status === 'CLOSED');
      default: return procesos;
    }
  }, [procesos, statusFilter]);

  useEffect(() => setPage(1), [statusFilter, view]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const filterLabels: Record<StatusFilter, string> = {
    all: 'Todos',
    active: 'Activos',
    review: 'En revisión',
    paused: 'Pausados',
    closed: 'Cerrados',
    archived: 'Archivados',
  };

  const stats = useMemo(() => countProcessesByBucket(procesos), [procesos]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF2FA', color: 'var(--kova-blue)' }}>
            <GitBranch className="w-[18px] h-[18px]" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold leading-tight" style={{ color: 'var(--kova-navy)' }}>Procesos</h1>
            <p className="text-sm text-slate-500 mt-0.5">Cada proceso contiene todo: perfil, pipeline, candidatos, entrevistas, pruebas y cierre.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen((o) => !o)}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm transition-colors ${statusFilter !== 'all' ? 'border-[var(--kova-blue)] bg-blue-50 text-[var(--kova-blue)] font-medium' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'}`}
            >
              <Filter className="w-4 h-4" /> {filterLabels[statusFilter]}
            </button>
            {filterOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setFilterOpen(false)} />
                <div className="absolute right-0 mt-1.5 z-40 w-44 rounded-xl border border-slate-200 bg-white shadow-lg p-1">
                  {(Object.keys(filterLabels) as StatusFilter[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setStatusFilter(key); setFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === key ? 'bg-blue-50 text-[var(--kova-blue)] font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {filterLabels[key]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5">
            <button type="button" onClick={() => setView('grid')} className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-blue-50 text-[var(--kova-blue)]' : 'text-slate-400'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setView('list')} className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-blue-50 text-[var(--kova-blue)]' : 'text-slate-400'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
          <Link href="/procesos/nuevo" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 transition-all" style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>
            <Plus className="w-4 h-4" /> Nuevo proceso
          </Link>
        </div>
      </div>

      {/* KPIs */}
      {!isLoading && procesos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          <StatCard icon={PlayCircle} value={stats.active} label="Procesos activos" hint="En progreso" tint="#E6FAF3" tone="var(--kova-green)" active={statusFilter === 'active'} onClick={() => setStatusFilter('active')} />
          <StatCard icon={Loader2} value={stats.review} label="En revisión" hint="Pendientes de acción" tint="#EEF2FA" tone="var(--kova-blue)" active={statusFilter === 'review'} onClick={() => setStatusFilter('review')} />
          <StatCard icon={PauseCircle} value={stats.paused} label="Pausados" hint="Temporales" tint="#FFF7E6" tone="#B7791F" active={statusFilter === 'paused'} onClick={() => setStatusFilter('paused')} />
          <StatCard icon={CheckCircle2} value={stats.closed} label="Cerrados" hint="Contratados" tint="#F3E8FF" tone="#7C3AED" active={statusFilter === 'closed'} onClick={() => setStatusFilter('closed')} />
          <StatCard icon={Archive} value={stats.archived} label="Archivados" hint="Histórico" tint="#F1F5F9" tone="#64748B" active={statusFilter === 'archived'} onClick={() => setStatusFilter('archived')} />
        </div>
      )}

      {/* Contenido */}
      {isLoading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="kova-skeleton h-24 rounded-2xl" />)}</div>
      ) : procesos.length === 0 ? (
        <div className="kova-card p-12 text-center">
          <p className="text-slate-400 text-sm mb-4">No hay procesos activos.</p>
          <Link href="/procesos/nuevo" className="text-sm font-medium" style={{ color: 'var(--kova-blue)' }}>Crear primer proceso →</Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="kova-card p-12 text-center">
          <p className="text-slate-400 text-sm mb-4">No hay procesos con este filtro.</p>
          {statusFilter !== 'all' && (
            <button type="button" onClick={() => setStatusFilter('all')} className="text-sm font-medium" style={{ color: 'var(--kova-blue)' }}>Ver todos →</button>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((p) => (
            <ProcessCard
              key={p.id}
              id={p.id}
              title={p.title}
              status={p.status}
              companyName={p.company?.name}
              companyId={p.company?.id}
              pipelineMetrics={p.pipelineMetrics}
              progress={p.progress}
              dueDate={p.requiredDate}
              consultantName={p.consultantName ?? (p.consultant ? `${p.consultant.firstName} ${p.consultant.lastName}` : 'María Consultora')}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginated.map((p) => <ProcessRow key={p.id} p={p} />)}
          </div>
          {filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-slate-400">
                {(safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, filtered.length)} de {filtered.length} procesos
              </p>
              <div className="flex items-center gap-1">
                <button type="button" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-xs text-slate-500 px-2">{safePage} / {totalPages}</span>
                <button type="button" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, value, label, hint, tint, tone, active, onClick }: {
  icon: typeof PlayCircle; value: number; label: string; hint: string; tint: string; tone: string;
  active?: boolean; onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`kova-card kova-card-hover p-4 flex items-center gap-3 text-left w-full transition-all ${
        active ? 'ring-2 ring-[var(--kova-blue)] ring-offset-1' : ''
      }`}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: tint }}>
        <Icon className="w-5 h-5" style={{ color: tone }} />
      </div>
      <div className="min-w-0">
        <p className="font-heading font-bold text-2xl leading-none tabular-nums" style={{ color: 'var(--kova-navy)' }}>{value}</p>
        <p className="text-xs font-medium text-slate-600 mt-1 truncate">{label}</p>
        <p className="text-[11px] text-slate-400 truncate">{hint}</p>
      </div>
    </button>
  );
}

function ProcessRow({ p }: { p: Proceso }) {
  const pct = p.progress ?? processProgress(p.status);
  const color = statusColor(p.status);
  const consultant = p.consultantName ?? (p.consultant ? `${p.consultant.firstName} ${p.consultant.lastName}` : 'María Consultora');
  const created = p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) : null;
  const due = p.requiredDate
    ? new Date(p.requiredDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
    : null;
  const suggested = suggestProcessNextAction(p.status, p.pipelineMetrics);
  const nextTitle = p.nextActionTitle ?? suggested.title;
  const nextDetail = p.nextActionDetail ?? suggested.detail;
  const totalCandidates = p.pipelineMetrics?.candidates ?? p._count?.candidates ?? 0;

  return (
    <div className="kova-card kova-card-hover relative overflow-hidden">
      <span className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full" style={{ background: color }} />

      <div className="p-4 pl-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
          {/* Identidad del proceso */}
          <Link href={`/procesos/${p.id}`} className="flex items-start gap-3 min-w-0 lg:w-[280px] xl:w-[320px] shrink-0 group">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-heading font-bold text-sm shadow-sm"
              style={{ background: `${color}18`, color }}
            >
              {initials(p.company?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-heading font-bold text-[15px] leading-snug group-hover:underline" style={{ color: 'var(--kova-navy)' }}>
                  {p.company?.name ?? 'Sin empresa'}
                </p>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--kova-blue)] shrink-0 mt-0.5 transition-colors" />
              </div>
              <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">{p.title}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold" style={{ background: `${color}18`, color }}>
                  {processStatusLabel(p.status)}
                </span>
                {totalCandidates > 0 && (
                  <span className="text-[11px] text-slate-500 font-medium">
                    {totalCandidates} candidato{totalCandidates !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {created && (
                <p className="text-[11px] text-slate-400 mt-2">
                  Creado {created} · {consultant}
                </p>
              )}
            </div>
          </Link>

          {/* Progreso + pipeline */}
          <div className="flex-1 min-w-0 space-y-3">
            <ProcessProgressBar status={p.status} progress={pct} color={color} size="md" />
            <ProcessPipelineMetrics metrics={p.pipelineMetrics} variant="row" />
          </div>

          {/* Siguiente paso */}
          <div className="lg:w-[220px] xl:w-[240px] shrink-0 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Siguiente paso</p>
            <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--kova-navy)' }}>
              {nextTitle}
            </p>
            {nextDetail && (
              <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{nextDetail}</p>
            )}
            {due && (
              <p className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-200/80 w-full">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                Entrega objetivo: {due}
              </p>
            )}
            <Link
              href={`/procesos/${p.id}`}
              className="inline-flex items-center gap-1 text-[11px] font-semibold mt-3 hover:underline"
              style={{ color: 'var(--kova-blue)' }}
            >
              Abrir proceso
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
