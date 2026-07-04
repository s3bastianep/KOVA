'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Building2, Search, Filter, ChevronDown, X, MapPin, Mail, Phone, User,
  GitBranch, Users, Calendar, Clock, CheckCircle2, ArrowRight, Plus,
  Briefcase, TrendingUp, ChevronRight,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { processStatusLabel, processStageInfo } from '@/lib/process-status';

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
  { value: 'lastActivity', label: 'Última actividad' },
  { value: 'lastHire', label: 'Última contratación' },
  { value: 'name', label: 'Nombre (A-Z)' },
  { value: 'activeProcesses', label: 'Procesos activos' },
];

const STAGE_WORDS: Record<string, string> = {
  ASSESSMENT: 'evaluación',
  INTERVIEW: 'entrevista',
  SCREENING: 'preselección',
  CALL: 'llamada',
  APPLIED: 'postulación',
  CLIENT_REVIEW: 'revisión con cliente',
  OFFER: 'oferta',
  HIRED: 'contratación',
};

function fmtDate(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtRelative(iso?: string | null) {
  if (!iso) return '—';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 7) return `Hace ${days} días`;
  if (days < 30) return `Hace ${Math.floor(days / 7)} sem`;
  return fmtDate(iso);
}

function humanizeActivity(note?: string) {
  if (!note) return '';
  return note.replace(/\b[A-Z_]{4,}\b/g, (token) => STAGE_WORDS[token] ?? token.toLowerCase().replace(/_/g, ' '));
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
  if (status === 'ACTIVE') return { bg: '#ECFDF5', color: '#047857', label: 'Activo', bar: '#10B981' };
  if (status === 'PAUSED') return { bg: '#FFFBEB', color: '#B45309', label: 'Pausado', bar: '#F59E0B' };
  return { bg: '#F1F5F9', color: '#475569', label: status, bar: '#94A3B8' };
}

function processStatusColor(status: string) {
  const map: Record<string, { bg: string; color: string }> = {
    SEARCH_ACTIVE: { bg: '#ECFDF5', color: '#047857' },
    HIRED: { bg: '#ECFDF5', color: '#047857' },
    FINALISTS: { bg: '#FDF2F8', color: '#BE185D' },
    OFFER: { bg: '#FFF7ED', color: '#C2410C' },
    EVALUATION: { bg: '#F5F3FF', color: '#6D28D9' },
    PROFILE_BUILDING: { bg: '#EFF6FF', color: '#2563EB' },
    APPROVAL_PENDING: { bg: '#FFFBEB', color: '#B45309' },
    DISCOVERY: { bg: '#EFF6FF', color: '#1D4ED8' },
    DISCOVERY_PENDING: { bg: '#EFF6FF', color: '#1D4ED8' },
    PAUSED: { bg: '#F8FAFC', color: '#64748B' },
    CLOSED: { bg: '#F1F5F9', color: '#64748B' },
  };
  return map[status] ?? { bg: '#EFF6FF', color: '#2563EB' };
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
            <p className="text-sm text-slate-600 mt-0.5">Expediente, procesos activos, contrataciones y seguimiento comercial.</p>
          </div>
        </div>
        <Link href="/clientes/nuevo" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 transition-all" style={{ background: 'linear-gradient(135deg, var(--kova-green), #00996a)' }}>
          <Plus className="w-4 h-4" /> Crear cliente
        </Link>
      </div>

      {!isLoading && list.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Building2} value={stats.total} label="Clientes en cartera" tint="#EFF6FF" tone="var(--kova-blue)" onClick={() => { setStatusFilter(null); setActiveOnly(false); setHireFilter('all'); }} active={!hasFilters} />
          <StatCard icon={CheckCircle2} value={stats.active} label="Relación activa" tint="#ECFDF5" tone="var(--kova-green)" onClick={() => setStatusFilter((s) => s === 'ACTIVE' ? null : 'ACTIVE')} active={statusFilter === 'ACTIVE'} />
          <StatCard icon={GitBranch} value={stats.withProcesses} label="Con búsquedas abiertas" tint="#F5F3FF" tone="#7C3AED" onClick={() => setActiveOnly((v) => !v)} active={activeOnly} />
          <StatCard icon={TrendingUp} value={stats.recentHires} label="Contrataciones · 90 días" tint="#FFFBEB" tone="#B45309" onClick={() => setHireFilter((h) => h === '90d' ? 'all' : '90d')} active={hireFilter === '90d'} />
        </div>
      )}

      <div className="kova-card p-3 sm:p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[var(--kova-ring)] focus-within:bg-white">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente, sector, ciudad, contacto..." className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
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

            {hasFilters && (
              <button type="button" onClick={() => { setSearch(''); setSectorFilter(null); setStatusFilter(null); setHireFilter('all'); setActiveOnly(false); }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100">
                <X className="w-4 h-4" /> Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-600">
            {filtered.length} cliente{filtered.length === 1 ? '' : 's'}
            {activeOnly && <span className="text-slate-400 font-normal"> · con procesos activos</span>}
          </p>
          <FilterBtn label={SORT_OPTIONS.find((s) => s.value === sort)?.label ?? 'Ordenar'} active={false} open={sortOpen} onToggle={() => setSortOpen((o) => !o)} compact prefix="Ordenar:" align="right">
            {SORT_OPTIONS.map((s) => (
              <button key={s.value} type="button" onClick={() => { setSort(s.value); setSortOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${sort === s.value ? 'bg-blue-50 text-[var(--kova-blue)] font-medium' : 'hover:bg-slate-50'}`}>{s.label}</button>
            ))}
          </FilterBtn>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="kova-skeleton h-44 rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="kova-card p-10 text-center">
          <p className="text-slate-500 text-sm mb-3">No se encontraron clientes con estos filtros.</p>
          {hasFilters && (
            <button type="button" onClick={() => { setSearch(''); setSectorFilter(null); setStatusFilter(null); setHireFilter('all'); setActiveOnly(false); }} className="text-sm font-medium" style={{ color: 'var(--kova-blue)' }}>
              Ver todos los clientes →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => <ClientCard key={c.id} client={c} />)}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, value, label, tint, tone, active, onClick }: {
  icon: typeof Building2; value: number; label: string; tint: string; tone: string;
  active?: boolean; onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`kova-card kova-card-hover p-4 flex items-center gap-3 text-left w-full transition-all ${active ? 'ring-2 ring-[var(--kova-blue)] ring-offset-1' : ''}`}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: tint }}>
        <Icon className="w-5 h-5" style={{ color: tone }} />
      </div>
      <div className="min-w-0">
        <p className="font-heading font-bold text-2xl leading-none tabular-nums" style={{ color: 'var(--kova-navy)' }}>{value}</p>
        <p className="text-xs font-medium text-slate-600 mt-1.5 leading-snug">{label}</p>
      </div>
    </button>
  );
}

function FilterBtn({ label, active, open, onToggle, children, compact, prefix, align = 'left' }: {
  label: string; active: boolean; open: boolean; onToggle: () => void;
  children: React.ReactNode; compact?: boolean; prefix?: string; align?: 'left' | 'right';
}) {
  return (
    <div className="relative">
      <button type="button" onClick={onToggle} className={`inline-flex items-center gap-2 rounded-xl border text-sm transition-colors whitespace-nowrap ${compact ? 'px-3 py-2 text-xs' : 'px-3.5 py-2.5'} ${active ? 'border-[var(--kova-blue)] bg-blue-50 text-[var(--kova-blue)] font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
        {!compact && <Filter className={`w-4 h-4 ${active ? '' : 'text-slate-400'}`} />}
        {prefix && <span className="text-slate-500">{prefix}</span>}
        {label}
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={onToggle} />
          <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1.5 z-40 w-52 rounded-xl border border-slate-200 bg-white shadow-lg p-1 max-h-64 overflow-auto`}>{children}</div>
        </>
      )}
    </div>
  );
}

function ClientCard({ client: c }: { client: Client }) {
  const st = statusStyle(c.status);
  const initials = c.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
  const visibleProcesses = c.processes.slice(0, 3);
  const hiddenCount = c.processes.length - visibleProcesses.length;
  const activityNote = humanizeActivity(c.lastActivityNote);

  return (
    <article className="kova-card kova-card-hover overflow-hidden">
      <span className="block h-1" style={{ background: `linear-gradient(90deg, ${st.bar}, ${st.bar}88)` }} />

      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-6">
          {/* Identidad */}
          <div className="flex gap-3 min-w-0 xl:w-[300px] shrink-0">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-sm shrink-0 shadow-sm" style={{ background: st.bg, color: st.color }}>
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/empresas/${c.id}`} className="font-heading font-bold text-[15px] hover:underline leading-snug" style={{ color: 'var(--kova-navy)' }}>
                  {c.name}
                </Link>
                <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold" style={{ background: st.bg, color: st.color }}>
                  {st.label}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <span>{c.sector ?? 'Sin sector'}</span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{c.city ?? '—'}</span>
              </p>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
                {c.primaryContact && (
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c.primaryContact}</span>
                  </span>
                )}
                {c.email && (
                  <span className="inline-flex items-center gap-1.5 min-w-0 max-w-full">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </span>
                )}
                {c.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {c.phone}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Consultor: <span className="font-medium text-slate-700">{c.consultantName ?? '—'}</span>
                {c.relationshipSince && (
                  <span className="text-slate-400"> · Cliente desde {fmtDate(c.relationshipSince)}</span>
                )}
              </p>
            </div>
          </div>

          {/* Procesos */}
          <div className="flex-1 min-w-0 xl:border-l xl:border-slate-100 xl:pl-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Procesos · {c.activeProcessCount} activo{c.activeProcessCount === 1 ? '' : 's'} de {c.totalProcesses}
              </p>
              {c.totalProcesses > 0 && (
                <Link href={`/empresas/${c.id}`} className="text-xs font-semibold hover:underline shrink-0" style={{ color: 'var(--kova-blue)' }}>
                  Ver todos
                </Link>
              )}
            </div>

            {c.processes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-5 text-center">
                <p className="text-sm text-slate-500">Sin procesos registrados</p>
                <Link href="/procesos/nuevo" className="text-xs font-semibold mt-2 inline-block hover:underline" style={{ color: 'var(--kova-blue)' }}>
                  Abrir búsqueda →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {visibleProcesses.map((p) => {
                  const ps = processStatusColor(p.status);
                  const stage = processStageInfo(p.status);
                  return (
                    <Link
                      key={p.id}
                      href={`/procesos/${p.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3 hover:bg-white hover:border-blue-100 hover:shadow-sm transition-all"
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-white border border-slate-100">
                        <Briefcase className="w-4 h-4 text-slate-500 group-hover:text-[var(--kova-blue)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--kova-navy)' }}>{p.title}</p>
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0" style={{ background: ps.bg, color: ps.color }}>
                            {processStatusLabel(p.status)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" />{p.candidates} candidatos</span>
                          {p.city && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{p.city}</span>}
                          <span>{stage.label} · Etapa {stage.step}/{stage.total}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--kova-blue)] shrink-0" />
                    </Link>
                  );
                })}
                {hiddenCount > 0 && (
                  <Link href={`/empresas/${c.id}`} className="block text-xs font-semibold text-center py-1 hover:underline" style={{ color: 'var(--kova-blue)' }}>
                    +{hiddenCount} proceso{hiddenCount !== 1 ? 's' : ''} más en el expediente
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Resumen comercial + acciones */}
          <div className="xl:w-[260px] shrink-0 xl:border-l xl:border-slate-100 xl:pl-6 flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2">
              <MiniStat label="Procesos" value={c.totalProcesses} />
              <MiniStat label="Activos" value={c.activeProcessCount} highlight={c.activeProcessCount > 0} />
              <MiniStat label="Contrat." value={c.totalHires} highlight={c.totalHires > 0} />
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 space-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">Última contratación</p>
                {c.lastHireDate ? (
                  <>
                    <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--kova-green)' }}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      {fmtDate(c.lastHireDate)}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                      {c.lastHireRole}
                      {c.lastHireCandidate ? ` · ${c.lastHireCandidate}` : ''}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">Sin contrataciones aún</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200/80">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">Seguimiento</p>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700">{fmtRelative(c.lastActivityDate)}</p>
                    {activityNote && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{activityNote}</p>}
                  </div>
                </div>
                {c.nextFollowUpTitle && (
                  <div className="flex items-start gap-2 mt-2.5 pt-2.5 border-t border-slate-200/60">
                    <Calendar className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--kova-blue)' }} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-snug" style={{ color: 'var(--kova-navy)' }}>{c.nextFollowUpTitle}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{fmtDate(c.nextFollowUpDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link href={`/empresas/${c.id}`} className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm" style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>
                Ver expediente <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/agenda" className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-700 bg-white hover:bg-slate-50">
                <Calendar className="w-4 h-4" /> Agendar seguimiento
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function MiniStat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border px-2 py-2.5 text-center ${highlight ? 'border-blue-100 bg-blue-50/70' : 'border-slate-100 bg-white'}`}>
      <p className={`text-lg font-bold tabular-nums leading-none ${highlight ? '' : 'text-slate-700'}`} style={highlight ? { color: 'var(--kova-navy)' } : undefined}>
        {value}
      </p>
      <p className="text-[10px] font-medium text-slate-500 mt-1">{label}</p>
    </div>
  );
}
