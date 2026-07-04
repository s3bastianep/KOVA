'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Building2, Search, Filter, ChevronDown, X, MapPin, Mail, Phone, User,
  GitBranch, Users, Calendar, Clock, CheckCircle2, ArrowRight, Plus,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { processStatusLabel } from '@/lib/process-status';

type ProcessSummary = {
  id: string;
  title: string;
  status: string;
  candidates: number;
  progress?: number;
  city?: string;
  nextActionTitle?: string;
  nextActionDetail?: string;
};

type HireRecord = { date: string; role: string; candidate: string };

type Client = {
  id: string;
  name: string;
  sector?: string;
  industry?: string;
  city?: string;
  status: string;
  email?: string;
  phone?: string;
  primaryContact?: string;
  consultantName?: string;
  processes: ProcessSummary[];
  activeProcesses: ProcessSummary[];
  activeProcessCount: number;
  totalProcesses: number;
  totalHires: number;
  lastHireDate?: string | null;
  lastHireRole?: string | null;
  lastHireCandidate?: string | null;
  hireHistory?: HireRecord[];
  lastActivityDate?: string;
  lastActivityNote?: string;
  nextFollowUpDate?: string;
  nextFollowUpTitle?: string;
  relationshipSince?: string;
};

type HireFilter = 'all' | '30d' | '90d' | '180d' | '365d' | 'older' | 'never';
type SortKey = 'lastHire' | 'name' | 'activeProcesses' | 'lastActivity';

const HIRE_FILTERS: { value: HireFilter; label: string }[] = [
  { value: 'all', label: 'Todas las contrataciones' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: '180d', label: 'Últimos 6 meses' },
  { value: '365d', label: 'Último año' },
  { value: 'older', label: 'Hace más de 1 año' },
  { value: 'never', label: 'Sin contrataciones' },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'lastHire', label: 'Última contratación' },
  { value: 'name', label: 'Nombre (A-Z)' },
  { value: 'activeProcesses', label: 'Procesos activos' },
  { value: 'lastActivity', label: 'Última actividad' },
];

function fmtDate(iso?: string | null) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysAgo(iso?: string | null) {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

function matchesHireFilter(client: Client, filter: HireFilter) {
  if (filter === 'all') return true;
  if (filter === 'never') return !client.lastHireDate;
  const days = daysAgo(client.lastHireDate);
  if (days == null) return false;
  switch (filter) {
    case '30d': return days <= 30;
    case '90d': return days <= 90;
    case '180d': return days <= 180;
    case '365d': return days <= 365;
    case 'older': return days > 365;
    default: return true;
  }
}

function statusStyle(status: string) {
  if (status === 'ACTIVE') return { bg: '#E6FAF3', color: '#047857', label: 'Activo' };
  if (status === 'PAUSED') return { bg: '#FFF7E6', color: '#B7791F', label: 'Pausado' };
  return { bg: '#F1F5F9', color: '#64748B', label: status };
}

export default function ClientesPage() {
  const { data, isLoading } = useQuery({ queryKey: ['clients'], queryFn: dashboardApi.clients });
  const list = (data as Client[]) ?? [];
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [hireFilter, setHireFilter] = useState<HireFilter>('all');
  const [activeOnly, setActiveOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('lastActivity');
  const [sectorOpen, setSectorOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [hireOpen, setHireOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const sectors = useMemo(() => {
    const set = new Set<string>();
    for (const c of list) if (c.sector) set.add(c.sector);
    return Array.from(set).sort();
  }, [list]);

  const stats = useMemo(() => ({
    total: list.length,
    active: list.filter((c) => c.status === 'ACTIVE').length,
    withProcesses: list.filter((c) => c.activeProcessCount > 0).length,
    recentHires: list.filter((c) => daysAgo(c.lastHireDate) != null && daysAgo(c.lastHireDate)! <= 90).length,
  }), [list]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = list.filter((c) => {
      if (q && !(
        c.name.toLowerCase().includes(q) ||
        (c.sector ?? '').toLowerCase().includes(q) ||
        (c.city ?? '').toLowerCase().includes(q) ||
        (c.primaryContact ?? '').toLowerCase().includes(q)
      )) return false;
      if (sectorFilter && c.sector !== sectorFilter) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      if (activeOnly && c.activeProcessCount === 0) return false;
      if (!matchesHireFilter(c, hireFilter)) return false;
      return true;
    });

    arr = [...arr].sort((a, b) => {
      switch (sort) {
        case 'name': return a.name.localeCompare(b.name);
        case 'activeProcesses': return b.activeProcessCount - a.activeProcessCount;
        case 'lastHire': {
          const ta = a.lastHireDate ? new Date(a.lastHireDate).getTime() : 0;
          const tb = b.lastHireDate ? new Date(b.lastHireDate).getTime() : 0;
          return tb - ta;
        }
        default: {
          const ta = a.lastActivityDate ? new Date(a.lastActivityDate).getTime() : 0;
          const tb = b.lastActivityDate ? new Date(b.lastActivityDate).getTime() : 0;
          return tb - ta;
        }
      }
    });
    return arr;
  }, [list, search, sectorFilter, statusFilter, hireFilter, activeOnly, sort]);

  const hasFilters = !!(search || sectorFilter || statusFilter || hireFilter !== 'all' || activeOnly);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF2FA', color: 'var(--kova-blue)' }}>
            <Building2 className="w-[18px] h-[18px]" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold leading-tight" style={{ color: 'var(--kova-navy)' }}>Clientes</h1>
            <p className="text-sm text-slate-500 mt-0.5">Expediente, procesos activos, contrataciones y seguimiento comercial.</p>
          </div>
        </div>
        <Link href="/clientes/nuevo" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 transition-all" style={{ background: 'linear-gradient(135deg, var(--kova-green), #00996a)' }}>
          <Plus className="w-4 h-4" /> Crear cliente
        </Link>
      </div>

      {!isLoading && list.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Clientes" value={stats.total} hint="En cartera" />
          <StatCard label="Activos" value={stats.active} hint="Relación vigente" />
          <StatCard label="Con procesos" value={stats.withProcesses} hint="Búsquedas abiertas" />
          <StatCard label="Contrataciones recientes" value={stats.recentHires} hint="Últimos 90 días" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[220px] rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[var(--kova-ring)]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente, sector, ciudad, contacto..." className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400" />
        </div>

        <FilterBtn label={sectorFilter ?? 'Sector'} active={!!sectorFilter} open={sectorOpen} onToggle={() => setSectorOpen((o) => !o)}>
          <button type="button" onClick={() => { setSectorFilter(null); setSectorOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-50">Todos</button>
          {sectors.map((s) => (
            <button key={s} type="button" onClick={() => { setSectorFilter(s); setSectorOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${sectorFilter === s ? 'bg-blue-50 text-[var(--kova-blue)] font-medium' : 'hover:bg-slate-50'}`}>{s}</button>
          ))}
        </FilterBtn>

        <FilterBtn label={statusFilter ? statusStyle(statusFilter).label : 'Estado'} active={!!statusFilter} open={statusOpen} onToggle={() => setStatusOpen((o) => !o)}>
          <button type="button" onClick={() => { setStatusFilter(null); setStatusOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-50">Todos</button>
          {['ACTIVE', 'PAUSED'].map((s) => (
            <button key={s} type="button" onClick={() => { setStatusFilter(s); setStatusOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${statusFilter === s ? 'bg-blue-50 text-[var(--kova-blue)] font-medium' : 'hover:bg-slate-50'}`}>{statusStyle(s).label}</button>
          ))}
        </FilterBtn>

        <FilterBtn label={HIRE_FILTERS.find((h) => h.value === hireFilter)?.label ?? 'Contratación'} active={hireFilter !== 'all'} open={hireOpen} onToggle={() => setHireOpen((o) => !o)}>
          {HIRE_FILTERS.map((h) => (
            <button key={h.value} type="button" onClick={() => { setHireFilter(h.value); setHireOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${hireFilter === h.value ? 'bg-blue-50 text-[var(--kova-blue)] font-medium' : 'hover:bg-slate-50'}`}>{h.label}</button>
          ))}
        </FilterBtn>

        <button
          type="button"
          onClick={() => setActiveOnly((v) => !v)}
          className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm transition-colors ${activeOnly ? 'border-[var(--kova-blue)] bg-blue-50 text-[var(--kova-blue)] font-medium' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
        >
          <GitBranch className="w-4 h-4" /> Con procesos activos
        </button>

        {hasFilters && (
          <button type="button" onClick={() => { setSearch(''); setSectorFilter(null); setStatusFilter(null); setHireFilter('all'); setActiveOnly(false); }} className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 bg-white hover:bg-slate-50">
            <X className="w-4 h-4" /> Limpiar
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{filtered.length} cliente{filtered.length === 1 ? '' : 's'}</p>
        <FilterBtn label={SORT_OPTIONS.find((s) => s.value === sort)?.label ?? 'Ordenar'} active={false} open={sortOpen} onToggle={() => setSortOpen((o) => !o)} compact prefix="Ordenar:">
          {SORT_OPTIONS.map((s) => (
            <button key={s.value} type="button" onClick={() => { setSort(s.value); setSortOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${sort === s.value ? 'bg-blue-50 text-[var(--kova-blue)] font-medium' : 'hover:bg-slate-50'}`}>{s.label}</button>
          ))}
        </FilterBtn>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="kova-skeleton h-40 rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="kova-card p-10 text-center text-slate-400 text-sm">No se encontraron clientes.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => <ClientCard key={c.id} client={c} />)}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="kova-card p-4">
      <p className="font-heading font-bold text-2xl" style={{ color: 'var(--kova-navy)' }}>{value}</p>
      <p className="text-[11px] font-medium text-slate-600 mt-1">{label}</p>
      <p className="text-[10px] text-slate-400">{hint}</p>
    </div>
  );
}

function FilterBtn({ label, active, open, onToggle, children, compact, prefix }: {
  label: string; active: boolean; open: boolean; onToggle: () => void;
  children: React.ReactNode; compact?: boolean; prefix?: string;
}) {
  return (
    <div className="relative">
      <button type="button" onClick={onToggle} className={`inline-flex items-center gap-2 rounded-xl border text-sm transition-colors whitespace-nowrap ${compact ? 'px-3 py-2 text-xs' : 'px-3.5 py-2.5'} ${active ? 'border-[var(--kova-blue)] bg-blue-50 text-[var(--kova-blue)] font-medium' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
        <Filter className={`w-4 h-4 ${active ? '' : 'text-slate-400'}`} />
        {prefix && <span className="text-slate-400">{prefix}</span>}
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={onToggle} />
          <div className="absolute left-0 mt-1.5 z-40 w-52 rounded-xl border border-slate-200 bg-white shadow-lg p-1 max-h-64 overflow-auto">{children}</div>
        </>
      )}
    </div>
  );
}

function ClientCard({ client: c }: { client: Client }) {
  const st = statusStyle(c.status);
  const initials = c.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('');

  return (
    <div className="kova-card kova-card-hover overflow-hidden">
      <div className="p-5 grid lg:grid-cols-[minmax(220px,1fr)_minmax(200px,1fr)_minmax(200px,1fr)_auto] gap-5 items-start">
        {/* Cliente */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center font-heading font-bold text-sm shrink-0" style={{ background: '#EEF2FA', color: 'var(--kova-blue)' }}>
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/empresas/${c.id}`} className="font-heading font-bold text-sm hover:underline truncate" style={{ color: 'var(--kova-navy)' }}>{c.name}</Link>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: st.bg, color: st.color }}>{st.label}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{c.sector ?? '-'} · {c.city ?? '-'}</p>
            <div className="mt-2 space-y-1 text-[11px] text-slate-500">
              {c.primaryContact && <p className="flex items-center gap-1.5"><User className="w-3 h-3" /> {c.primaryContact}</p>}
              {c.email && <p className="flex items-center gap-1.5 truncate"><Mail className="w-3 h-3 shrink-0" /> {c.email}</p>}
              {c.phone && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {c.phone}</p>}
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Consultor: {c.consultantName ?? '-'}</p>
          </div>
        </div>

        {/* Procesos */}
        <div className="min-w-0 lg:border-l lg:border-slate-100 lg:pl-5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-2">Procesos ({c.activeProcessCount} activo{c.activeProcessCount === 1 ? '' : 's'})</p>
          {c.processes.length === 0 ? (
            <p className="text-xs text-slate-400">Sin procesos registrados.</p>
          ) : (
            <div className="space-y-2">
              {c.processes.map((p) => (
                <Link key={p.id} href={`/procesos/${p.id}`} className="block rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--kova-navy)' }}>{p.title}</p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 shrink-0">{processStatusLabel(p.status)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                    <span className="inline-flex items-center gap-0.5"><Users className="w-3 h-3" /> {p.candidates}</span>
                    {p.city && <span className="inline-flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {p.city}</span>}
                    {p.progress != null && <span>{p.progress}% avance</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Contrataciones */}
        <div className="min-w-0 lg:border-l lg:border-slate-100 lg:pl-5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-2">Contrataciones</p>
          <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Total histórico</span>
              <span className="text-sm font-bold" style={{ color: 'var(--kova-navy)' }}>{c.totalHires}</span>
            </div>
            {c.lastHireDate ? (
              <>
                <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--kova-green)' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Última: {fmtDate(c.lastHireDate)}
                </div>
                {c.lastHireRole && <p className="text-[11px] text-slate-600">{c.lastHireRole}{c.lastHireCandidate ? ` · ${c.lastHireCandidate}` : ''}</p>}
              </>
            ) : (
              <p className="text-xs text-slate-400">Sin contrataciones registradas</p>
            )}
            {c.relationshipSince && (
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">Cliente desde {fmtDate(c.relationshipSince)}</p>
            )}
          </div>
        </div>

        {/* Seguimiento */}
        <div className="min-w-0 lg:border-l lg:border-slate-100 lg:pl-5 flex flex-col gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-2">Seguimiento</p>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-slate-600">Última actividad</p>
                  <p className="text-slate-400">{fmtDate(c.lastActivityDate)}</p>
                  {c.lastActivityNote && <p className="text-slate-500 mt-0.5 leading-snug">{c.lastActivityNote}</p>}
                </div>
              </div>
              {c.nextFollowUpTitle && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--kova-blue)' }} />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--kova-navy)' }}>{c.nextFollowUpTitle}</p>
                    <p className="text-slate-400">{fmtDate(c.nextFollowUpDate)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5 mt-auto">
            <Link href={`/empresas/${c.id}`} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>
              Ver expediente <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/agenda" className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50">
              <Calendar className="w-3.5 h-3.5" /> Agendar seguimiento
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
