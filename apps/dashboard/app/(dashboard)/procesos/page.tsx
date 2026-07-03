'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Plus, GitBranch, Filter, List, LayoutGrid, Users, Calendar, Trophy,
  ClipboardList, ChevronLeft, ChevronRight, MoreVertical, TrendingUp,
  PlayCircle, PauseCircle, CheckCircle2, Loader2,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { ProcessCard } from '@/components/proceso/ProcessCard';
import { processStatusLabel, processProgress } from '@/lib/process-status';

type Proceso = {
  id: string;
  title: string;
  status: string;
  city?: string;
  company?: { id: string; name: string };
  _count?: { candidates: number };
  interviewsCount?: number;
  finalistsCount?: number;
  testsCount?: number;
  progress?: number;
  requiredDate?: string;
  createdAt?: string;
  consultantName?: string;
  consultant?: { firstName: string; lastName: string };
  nextActionTitle?: string;
  nextActionDetail?: string;
};

const ACTIVE_STATUSES = ['SEARCH_ACTIVE', 'EVALUATION', 'FINALISTS', 'OFFER', 'PROFILE_BUILDING', 'DISCOVERY', 'DISCOVERY_PENDING'];

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

export default function ProcesosPage() {
  const { data, isLoading } = useQuery({ queryKey: ['vacancies'], queryFn: dashboardApi.vacancies });
  const procesos = (data as Proceso[]) ?? [];
  const [view, setView] = useState<'list' | 'grid'>('list');

  const stats = useMemo(() => {
    const active = procesos.filter((p) => ACTIVE_STATUSES.includes(p.status)).length;
    const review = procesos.filter((p) => p.status === 'APPROVAL_PENDING').length;
    const paused = procesos.filter((p) => p.status === 'PAUSED').length;
    const closed = procesos.filter((p) => p.status === 'CLOSED' || p.status === 'HIRED').length;
    return { active, review, paused, closed };
  }, [procesos]);

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
          <button type="button" className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 bg-white hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" /> Filtros
          </button>
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
          <StatCard icon={PlayCircle} value={stats.active} label="Procesos activos" hint="En progreso" tint="#E6FAF3" tone="var(--kova-green)" />
          <StatCard icon={Loader2} value={stats.review} label="En revisión" hint="Pendientes de acción" tint="#EEF2FA" tone="var(--kova-blue)" />
          <StatCard icon={PauseCircle} value={stats.paused} label="Pausados" hint="Temporales" tint="#FFF7E6" tone="#B7791F" />
          <StatCard icon={CheckCircle2} value={stats.closed} label="Cerrados" hint="Este mes" tint="#F3E8FF" tone="#7C3AED" />
          <div className="kova-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-slate-400">Eficiencia promedio</p>
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            </div>
            <div className="flex items-end gap-2 mt-1">
              <p className="font-heading font-bold text-2xl leading-none" style={{ color: 'var(--kova-navy)' }}>76%</p>
              <span className="text-[10px] font-semibold text-green-600 mb-0.5">+12%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">vs. mes anterior</p>
          </div>
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
      ) : view === 'grid' ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {procesos.map((p) => (
            <ProcessCard
              key={p.id}
              id={p.id}
              title={p.title}
              status={p.status}
              companyName={p.company?.name}
              companyId={p.company?.id}
              candidatesCount={p._count?.candidates ?? 0}
              interviewsCount={p.interviewsCount ?? 0}
              finalistsCount={p.finalistsCount ?? 0}
              progress={p.progress}
              dueDate={p.requiredDate}
              consultantName={p.consultantName ?? (p.consultant ? `${p.consultant.firstName} ${p.consultant.lastName}` : 'María Consultora')}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {procesos.map((p) => <ProcessRow key={p.id} p={p} />)}
          </div>
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-slate-400">Mostrando 1 a {procesos.length} de {procesos.length} procesos</p>
            <div className="flex items-center gap-1">
              <button type="button" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
              <button type="button" className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold text-white" style={{ background: 'var(--kova-blue)' }}>1</button>
              <button type="button" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, value, label, hint, tint, tone }: {
  icon: typeof PlayCircle; value: number; label: string; hint: string; tint: string; tone: string;
}) {
  return (
    <div className="kova-card kova-card-hover p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: tint }}>
        <Icon className="w-5 h-5" style={{ color: tone }} />
      </div>
      <div className="min-w-0">
        <p className="font-heading font-bold text-2xl leading-none" style={{ color: 'var(--kova-navy)' }}>{value}</p>
        <p className="text-[11px] font-medium text-slate-600 mt-1 truncate">{label}</p>
        <p className="text-[10px] text-slate-400 truncate">{hint}</p>
      </div>
    </div>
  );
}

function ProcessRow({ p }: { p: Proceso }) {
  const pct = p.progress ?? processProgress(p.status);
  const color = statusColor(p.status);
  const consultant = p.consultantName ?? (p.consultant ? `${p.consultant.firstName} ${p.consultant.lastName}` : 'María Consultora');
  const created = p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

  return (
    <div className="kova-card kova-card-hover relative overflow-hidden">
      <span className="absolute left-0 top-0 bottom-0 w-1" style={{ background: color }} />
      <div className="p-4 pl-5 grid lg:grid-cols-[minmax(200px,1.2fr)_minmax(200px,1.3fr)_minmax(160px,0.9fr)_auto] gap-4 items-center">
        {/* Empresa + vacante */}
        <Link href={`/procesos/${p.id}`} className="flex items-center gap-3 min-w-0 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-heading font-bold text-xs" style={{ background: `${color}1A`, color }}>
            {initials(p.company?.name)}
          </div>
          <div className="min-w-0">
            <p className="font-heading font-bold text-sm truncate group-hover:underline" style={{ color: 'var(--kova-navy)' }}>{p.company?.name ?? 'Sin empresa'}</p>
            <p className="text-xs text-slate-500 truncate">{p.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${color}1A`, color }}>{processStatusLabel(p.status)}</span>
            </div>
            {created && <p className="text-[10px] text-slate-400 mt-1">Creado: {created} · {consultant}</p>}
          </div>
        </Link>

        {/* Progreso + métricas */}
        <div className="min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-400">Progreso del proceso</span>
            <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-2.5">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
          </div>
          <div className="grid grid-cols-4 gap-1 text-center">
            <Metric icon={Users} value={p._count?.candidates ?? 0} label="Candidatos" />
            <Metric icon={Calendar} value={p.interviewsCount ?? 0} label="Entrevistas" />
            <Metric icon={Trophy} value={p.finalistsCount ?? 0} label="Finalistas" />
            <Metric icon={ClipboardList} value={p.testsCount ?? 0} label="Pruebas" />
          </div>
        </div>

        {/* Próxima acción */}
        <div className="min-w-0">
          <p className="text-[10px] text-slate-400 mb-1">Próxima acción</p>
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--kova-navy)' }}>{p.nextActionTitle ?? 'Sin acción definida'}</p>
              {p.nextActionDetail && <p className="text-[11px] text-slate-400 truncate">{p.nextActionDetail}</p>}
            </div>
          </div>
        </div>

        {/* Menú */}
        <Link href={`/procesos/${p.id}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-colors justify-self-end">
          <MoreVertical className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, value, label }: { icon: typeof Users; value: number; label: string }) {
  return (
    <div className="rounded-lg bg-slate-50 py-1.5">
      <Icon className="w-3 h-3 mx-auto text-slate-400" />
      <p className="text-sm font-bold leading-none mt-0.5" style={{ color: 'var(--kova-navy)' }}>{value}</p>
      <p className="text-[9px] text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}
