'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Building2, Users, Star, Upload, Plus, Search, Filter, ChevronDown,
  ChevronLeft, ChevronRight, List, LayoutGrid, Calendar, ClipboardList,
  Clock, Bell, MoreHorizontal, BarChart3, X, ArrowDownUp, Check,
  Mail, Copy, Archive, Sparkles, Loader2,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { stageLabel } from '@/lib/stages';
import { useToast } from '@/components/ui/Toast';
import { candidateMatchesSkills, SKILL_CATALOG } from '@/lib/candidate-skills';

const PAGE_SIZE = 10;

type Scores = { experiencia: number; habilidades: number; educacion: number; cultura: number };

type CandidateRow = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  city?: string;
  status: string;
  source?: string;
  compatibility?: number;
  ranking?: number;
  currentStage?: string;
  vacancyTitle?: string;
  companyName?: string;
  scores?: Scores;
  skills?: string[];
};

function statusBadge(status: string, stage?: string) {
  if (stage === 'ASSESSMENT') return { label: 'Prueba pendiente', bg: '#FFF7E6', color: '#B7791F' };
  if (stage === 'INTERVIEW') return { label: 'En proceso', bg: '#EEF2FA', color: 'var(--kova-blue)' };
  if (status === 'ACTIVE' && (stage === 'APPLIED' || stage === 'SCREENING')) return { label: 'Nuevo', bg: '#F3E8FF', color: '#7C3AED' };
  return { label: 'En proceso', bg: '#EEF2FA', color: 'var(--kova-blue)' };
}

function stageBadge(stage?: string) {
  const map: Record<string, { bg: string; color: string; icon: typeof Calendar }> = {
    INTERVIEW: { bg: '#EEF2FA', color: 'var(--kova-blue)', icon: Calendar },
    ASSESSMENT: { bg: '#FFF7E6', color: '#B7791F', icon: ClipboardList },
    SCREENING: { bg: '#F1F5F9', color: '#64748B', icon: Search },
    APPLIED: { bg: '#F3E8FF', color: '#7C3AED', icon: Users },
  };
  return map[stage ?? ''] ?? { bg: '#F1F5F9', color: '#64748B', icon: Clock };
}

function coincidencia(pct: number) {
  if (pct >= 90) return 'Excelente coincidencia';
  if (pct >= 80) return 'Buena coincidencia';
  if (pct >= 70) return 'Alta coincidencia';
  return 'Coincidencia media';
}

function scoreColor(pct: number) {
  if (pct >= 85) return 'var(--kova-green)';
  if (pct >= 70) return '#B7791F';
  return 'var(--kova-coral)';
}

type SortKey = 'compatibility' | 'ranking' | 'name' | 'recent';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'compatibility', label: 'Compatibilidad' },
  { value: 'ranking', label: 'Ranking' },
  { value: 'name', label: 'Nombre (A-Z)' },
  { value: 'recent', label: 'Más recientes' },
];

const COMPAT_OPTIONS: { value: string; label: string }[] = [
  { value: '90', label: '90% o más · Excelente' },
  { value: '80', label: '80% o más · Buena' },
  { value: '70', label: '70% o más · Alta' },
  { value: '0', label: 'Menos de 70%' },
];

export default function CandidatosPage() {
  return (
    <Suspense fallback={<div className="kova-skeleton h-96 rounded-2xl" />}>
      <CandidatosContent />
    </Suspense>
  );
}

function CandidatosContent() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const { data, isLoading } = useQuery({ queryKey: ['candidates'], queryFn: () => dashboardApi.candidates() });
  const list = (data as CandidateRow[]) ?? [];
  const [newOpen, setNewOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [processFilter, setProcessFilter] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [compatFilter, setCompatFilter] = useState<string | null>(null);
  const [skillsFilter, setSkillsFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('compatibility');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  const processOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of list) {
      const key = `${c.companyName ?? ''}|${c.vacancyTitle ?? ''}`;
      if (key === '|') continue;
      const label = [c.companyName, c.vacancyTitle].filter(Boolean).join(' · ');
      if (!map.has(key)) map.set(key, label);
    }
    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [list]);

  const stageOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of list) if (c.currentStage) set.add(c.currentStage);
    return Array.from(set, (value) => ({ value, label: stageLabel(value) }));
  }, [list]);

  const skillOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const skill of SKILL_CATALOG) counts.set(skill, 0);
    for (const c of list) {
      for (const s of c.skills ?? []) {
        counts.set(s, (counts.get(s) ?? 0) + 1);
      }
    }
    return SKILL_CATALOG.map((skill) => ({
      value: skill,
      label: skill,
      count: counts.get(skill) ?? 0,
    }));
  }, [list]);

  const hasFilters = !!(search || processFilter || stageFilter || compatFilter || skillsFilter.length > 0);

  const clearFilters = () => {
    setSearch('');
    setProcessFilter(null);
    setStageFilter(null);
    setCompatFilter(null);
    setSkillsFilter([]);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = list.filter((c) => {
      if (q && !(
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        (c.vacancyTitle ?? '').toLowerCase().includes(q) ||
        (c.companyName ?? '').toLowerCase().includes(q)
      )) return false;
      if (processFilter && `${c.companyName ?? ''}|${c.vacancyTitle ?? ''}` !== processFilter) return false;
      if (stageFilter && c.currentStage !== stageFilter) return false;
      if (compatFilter) {
        const pct = Math.round(c.compatibility ?? 0);
        if (compatFilter === '0' ? pct >= 70 : pct < Number(compatFilter)) return false;
      }
      if (!candidateMatchesSkills(c.skills, skillsFilter)) return false;
      return true;
    });

    arr = [...arr].sort((a, b) => {
      switch (sort) {
        case 'ranking': return (a.ranking ?? 999) - (b.ranking ?? 999);
        case 'name': return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'recent': return (b.ranking ?? 0) - (a.ranking ?? 0);
        default: return (b.compatibility ?? 0) - (a.compatibility ?? 0);
      }
    });
    return arr;
  }, [list, search, processFilter, stageFilter, compatFilter, skillsFilter, sort]);

  useEffect(() => setPage(1), [search, processFilter, stageFilter, compatFilter, skillsFilter, sort, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#F3E8FF', color: '#7C3AED' }}>
            <Users className="w-[18px] h-[18px]" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold leading-tight" style={{ color: 'var(--kova-navy)' }}>Candidatos</h1>
            <p className="text-sm text-slate-500 mt-0.5">Base de talento comercial: filtra por habilidades para reutilizar candidatos en nuevas búsquedas.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toast('Importación de CV disponible próximamente', 'info')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors"
          >
            <Upload className="w-4 h-4" /> Importar CV
          </button>
          <button type="button" onClick={() => setNewOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 transition-all" style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>
            <Plus className="w-4 h-4" /> Nuevo candidato
          </button>
        </div>
      </div>

      {newOpen && (
        <NewCandidateModal
          onClose={() => setNewOpen(false)}
          onCreated={(name) => { setNewOpen(false); toast(`Candidato ${name} agregado`); }}
        />
      )}

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[220px] rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[var(--kova-ring)] focus-within:border-[var(--kova-blue)] transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar candidato por nombre, cargo, empresa..." className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400" />
        </div>
        <FilterDropdown icon={Building2} allLabel="Todos los procesos" options={processOptions} value={processFilter} onChange={setProcessFilter} />
        <FilterDropdown icon={Filter} allLabel="Todas las etapas" options={stageOptions} value={stageFilter} onChange={setStageFilter} />
        <SkillsFilterDropdown options={skillOptions} value={skillsFilter} onChange={setSkillsFilter} />
        <FilterDropdown icon={BarChart3} allLabel="Compatibilidad" options={COMPAT_OPTIONS} value={compatFilter} onChange={setCompatFilter} />
        {hasFilters && (
          <button type="button" onClick={clearFilters} className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors">
            <X className="w-4 h-4" /> Limpiar
          </button>
        )}
      </div>

      {/* Barra de resultados */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{filtered.length} candidato{filtered.length === 1 ? '' : 's'} encontrado{filtered.length === 1 ? '' : 's'}</p>
        <div className="flex items-center gap-3">
          <FilterDropdown
            icon={ArrowDownUp}
            prefix="Ordenar por:"
            allLabel="Compatibilidad"
            options={SORT_OPTIONS}
            value={sort}
            onChange={(v) => setSort((v ?? 'compatibility') as SortKey)}
            hideAllOption
            compact
          />
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5">
            <button type="button" onClick={() => setView('list')} className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-blue-50 text-[var(--kova-blue)]' : 'text-slate-400'}`}>
              <List className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setView('grid')} className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-blue-50 text-[var(--kova-blue)]' : 'text-slate-400'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="kova-skeleton h-36 rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="kova-card p-10 text-center text-slate-400 text-sm">No se encontraron candidatos.</div>
      ) : (
        <div className={view === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'space-y-4'}>
          {paginated.map((c) => (
            <CandidateCard key={c.id} c={c} highlightSkills={skillsFilter} onArchive={() => toast('Candidato archivado')} />
          ))}
        </div>
      )}

      {/* Paginación */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            <button type="button" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-xs text-slate-500 px-2">{safePage} / {totalPages}</span>
            <button type="button" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            Mostrar
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 rounded-lg border border-slate-200 text-slate-600 bg-white outline-none"
            >
              {[10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            por página · {(safePage - 1) * pageSize + 1}-{Math.min(safePage * pageSize, filtered.length)} de {filtered.length}
          </div>
        </div>
      )}
    </div>
  );
}

type VacancyOption = { id: string; title: string; company?: { name?: string } | null };

function NewCandidateModal({ onClose, onCreated }: { onClose: () => void; onCreated: (name: string) => void }) {
  const queryClient = useQueryClient();
  const { data: vacData, isLoading: loadingVacancies } = useQuery({
    queryKey: ['vacancies'],
    queryFn: () => dashboardApi.vacancies(),
  });
  const vacancies = (vacData as VacancyOption[]) ?? [];

  const [form, setForm] = useState({ vacancyId: '', firstName: '', lastName: '', email: '', phone: '', city: '', source: 'Manual' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!form.vacancyId && vacancies.length > 0) {
      setForm((f) => ({ ...f, vacancyId: vacancies[0].id }));
    }
  }, [vacancies, form.vacancyId]);

  const mutation = useMutation({
    mutationFn: () => dashboardApi.createCandidate({
      vacancyId: form.vacancyId,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      city: form.city.trim() || undefined,
      source: form.source,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['vacancy', form.vacancyId] });
      onCreated(`${form.firstName.trim()} ${form.lastName.trim()}`.trim());
    },
    onError: (e) => setError(e instanceof Error ? e.message : 'No se pudo crear el candidato'),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.vacancyId) { setError('Selecciona el proceso al que pertenece el candidato.'); return; }
    if (!form.firstName.trim() || !form.lastName.trim()) { setError('Nombre y apellido son obligatorios.'); return; }
    mutation.mutate();
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:ring-2 focus:ring-[var(--kova-ring)] focus:border-[var(--kova-blue)] transition-all';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => !mutation.isPending && onClose()}>
      <form onSubmit={submit} className="w-full max-w-lg kova-card p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-lg" style={{ color: 'var(--kova-navy)' }}>Nuevo candidato</h3>
            <p className="text-sm text-slate-500 mt-0.5">Agrega un candidato a un proceso de selección.</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <div>
          <label htmlFor="nc-vacancy" className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-1.5">Proceso *</label>
          <select
            id="nc-vacancy"
            name="vacancyId"
            value={form.vacancyId}
            onChange={(e) => setForm((f) => ({ ...f, vacancyId: e.target.value }))}
            className={inputCls}
            disabled={loadingVacancies}
          >
            {loadingVacancies && <option value="">Cargando procesos...</option>}
            {!loadingVacancies && vacancies.length === 0 && <option value="">No hay procesos disponibles</option>}
            {vacancies.map((v) => (
              <option key={v.id} value={v.id}>{v.title}{v.company?.name ? ` · ${v.company.name}` : ''}</option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="nc-first" className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-1.5">Nombre *</label>
            <input id="nc-first" name="firstName" autoComplete="given-name" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label htmlFor="nc-last" className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-1.5">Apellido *</label>
            <input id="nc-last" name="lastName" autoComplete="family-name" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} className={inputCls} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="nc-email" className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-1.5">Correo</label>
            <input id="nc-email" name="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label htmlFor="nc-phone" className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-1.5">Teléfono</label>
            <input id="nc-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputCls} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="nc-city" className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-1.5">Ciudad</label>
            <input id="nc-city" name="city" autoComplete="address-level2" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label htmlFor="nc-source" className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-1.5">Fuente</label>
            <select id="nc-source" name="source" value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} className={inputCls}>
              {['Manual', 'LinkedIn', 'Referido', 'Computrabajo', 'Base de datos'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {error && <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} disabled={mutation.isPending} className="text-sm px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancelar</button>
          <button type="submit" disabled={mutation.isPending || !form.vacancyId} className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl text-white font-semibold disabled:opacity-50" style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>
            {mutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : <><Plus className="w-4 h-4" /> Agregar candidato</>}
          </button>
        </div>
      </form>
    </div>
  );
}

function SkillsFilterDropdown({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; count: number }[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const active = value.length > 0;
  const label = active
    ? value.length === 1 ? value[0] : `${value.length} habilidades`
    : 'Habilidades';

  const toggle = (skill: string) => {
    onChange(value.includes(skill) ? value.filter((s) => s !== skill) : [...value, skill]);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-colors whitespace-nowrap ${active ? 'border-[var(--kova-blue)] bg-blue-50 text-[var(--kova-blue)] font-medium' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
      >
        <Sparkles className={`w-4 h-4 ${active ? '' : 'text-slate-400'}`} />
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''} ${active ? '' : 'text-slate-400'}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-1.5 z-40 w-72 max-h-80 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg p-1">
            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Filtra por habilidades (debe tener todas)
            </p>
            {value.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="w-full text-left px-3 py-1.5 mb-1 text-xs text-[var(--kova-blue)] hover:bg-blue-50 rounded-lg"
              >
                Limpiar selección
              </button>
            )}
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => toggle(o.value)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${value.includes(o.value) ? 'bg-blue-50 text-[var(--kova-blue)] font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <span className="truncate">{o.label}</span>
                <span className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] text-slate-400">{o.count}</span>
                  {value.includes(o.value) && <Check className="w-3.5 h-3.5" />}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FilterDropdown({
  icon: Icon, allLabel, options, value, onChange, prefix, hideAllOption, compact,
}: {
  icon: typeof Building2;
  allLabel: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (v: string | null) => void;
  prefix?: string;
  hideAllOption?: boolean;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const active = value != null;
  const currentLabel = active ? (options.find((o) => o.value === value)?.label ?? allLabel) : allLabel;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-2 rounded-xl border text-sm transition-colors whitespace-nowrap ${compact ? 'px-3 py-2 text-xs' : 'px-3.5 py-2.5'} ${active ? 'border-[var(--kova-blue)] bg-blue-50 text-[var(--kova-blue)] font-medium' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
      >
        <Icon className={`w-4 h-4 ${active ? '' : 'text-slate-400'}`} />
        {prefix && <span className="text-slate-400">{prefix}</span>}
        <span className={compact ? 'font-semibold text-slate-700' : ''}>{currentLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''} ${active ? '' : 'text-slate-400'}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-1.5 z-40 w-60 max-h-72 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg p-1">
            {!hideAllOption && (
              <MenuItem selected={value == null} onClick={() => { onChange(null); setOpen(false); }}>{allLabel}</MenuItem>
            )}
            {options.length === 0 && (
              <p className="px-3 py-2 text-xs text-slate-400">Sin opciones disponibles</p>
            )}
            {options.map((o) => (
              <MenuItem key={o.value} selected={value === o.value} onClick={() => { onChange(o.value); setOpen(false); }}>
                {o.label}
              </MenuItem>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({ children, selected, onClick }: { children: React.ReactNode; selected?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${selected ? 'bg-blue-50 text-[var(--kova-blue)] font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
    >
      <span className="truncate">{children}</span>
      {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
    </button>
  );
}

function CandidateCard({ c, highlightSkills, onArchive }: { c: CandidateRow; highlightSkills?: string[]; onArchive: () => void }) {
  const compat = Math.round(c.compatibility ?? 0);
  const sb = statusBadge(c.status, c.currentStage);
  const stg = stageBadge(c.currentStage);
  const StageIcon = stg.icon;
  const scores = c.scores ?? { experiencia: compat, habilidades: compat, educacion: compat, cultura: compat };
  const isAssessment = c.currentStage === 'ASSESSMENT';

  return (
    <div className="kova-card kova-card-hover p-5 grid grid-cols-1 xl:grid-cols-[minmax(240px,280px)_minmax(180px,1fr)_minmax(280px,340px)_auto] gap-5 xl:gap-6 items-center">
      {/* Perfil */}
      <div className="flex items-start gap-3 min-w-0">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-sm text-white" style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>
            {c.firstName[0]}{c.lastName[0]}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white" style={{ background: isAssessment ? '#F59E0B' : 'var(--kova-green)' }} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--kova-navy)' }}>{c.firstName} {c.lastName}</h3>
            {c.ranking != null && (
              <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
                <Star className="w-2.5 h-2.5 fill-current" /> #{c.ranking}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 truncate mt-0.5">{c.email ?? '-'}</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5 text-[10px] text-slate-400">
            {c.city && <span className="inline-flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {c.city}</span>}
            {c.source && <span>· Fuente: {c.source}</span>}
          </div>
          {(c.skills?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {c.skills!.slice(0, 4).map((s) => {
                const hit = highlightSkills?.includes(s);
                return (
                  <span
                    key={s}
                    className="text-[9px] px-1.5 py-0.5 rounded-md font-medium truncate max-w-[120px]"
                    style={{
                      color: hit ? 'var(--kova-blue)' : '#64748B',
                      background: hit ? '#EEF2FA' : '#F1F5F9',
                    }}
                    title={s}
                  >
                    {s}
                  </span>
                );
              })}
              {c.skills!.length > 4 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-md text-slate-400 bg-slate-50">+{c.skills!.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Proceso: empresa + cargo + etapa */}
      <div className="min-w-0 xl:border-l xl:border-slate-100 xl:pl-6">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">Proceso</p>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 space-y-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: '#EEF2FA' }}>
              <Building2 className="w-3.5 h-3.5" style={{ color: 'var(--kova-blue)' }} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--kova-navy)' }}>{c.companyName ?? 'Sin empresa'}</p>
              {c.vacancyTitle && <p className="text-[11px] text-slate-500 truncate">{c.vacancyTitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
            <span className="text-[10px] text-slate-400">Etapa:</span>
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium whitespace-nowrap" style={{ background: stg.bg, color: stg.color }}>
              <StageIcon className="w-3 h-3" /> {stageLabel(c.currentStage)}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: sb.bg, color: sb.color }}>{sb.label}</span>
          </div>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-4 gap-3 xl:border-l xl:border-slate-100 xl:pl-6">
        <MiniScore label="Experiencia" value={scores.experiencia} />
        <MiniScore label="Habilidades" value={scores.habilidades} />
        <MiniScore label="Educación" value={scores.educacion} />
        <MiniScore label="Cultura" value={scores.cultura} />
      </div>

      {/* Compatibilidad + acciones */}
      <div className="flex items-center gap-5 xl:border-l xl:border-slate-100 xl:pl-6 justify-between xl:justify-start">
        <div className="text-center shrink-0 w-[76px]">
          <CompatRing value={compat} />
          <p className="text-[10px] mt-1.5 font-medium leading-tight" style={{ color: scoreColor(compat) }}>{coincidencia(compat)}</p>
        </div>
        <div className="flex flex-col gap-1.5 w-40 shrink-0">
          <Link href={`/candidatos/${c.id}`} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>
            Ver perfil <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link href="/agenda" className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            {isAssessment ? <><Bell className="w-3.5 h-3.5" /> Enviar recordatorio</> : <><Calendar className="w-3.5 h-3.5" /> Agendar</>}
          </Link>
          <ActionsMenu c={c} onArchive={onArchive} />
        </div>
      </div>
    </div>
  );
}

function ActionsMenu({ c, onArchive }: { c: CandidateRow; onArchive: () => void }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    if (c.email && typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(c.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch { /* ignore */ }
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-50 transition-colors"
      >
        <MoreHorizontal className="w-3.5 h-3.5" /> Más acciones
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 bottom-full mb-1.5 z-40 w-52 rounded-xl border border-slate-200 bg-white shadow-lg p-1">
            <Link href={`/candidatos/${c.id}`} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <Users className="w-4 h-4 text-slate-400" /> Ver perfil
            </Link>
            <Link href="/agenda" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <Calendar className="w-4 h-4 text-slate-400" /> Agendar entrevista
            </Link>
            {c.email && (
              <a href={`mailto:${c.email}`} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                <Mail className="w-4 h-4 text-slate-400" /> Enviar correo
              </a>
            )}
            <button
              type="button"
              onClick={copyEmail}
              disabled={!c.email}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-4 h-4 text-[var(--kova-green)]" /> : <Copy className="w-4 h-4 text-slate-400" />}
              {copied ? 'Correo copiado' : 'Copiar correo'}
            </button>
            <div className="my-1 border-t border-slate-100" />
            <button
              type="button"
              onClick={() => { setOpen(false); onArchive(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Archive className="w-4 h-4" /> Archivar candidato
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function MiniScore({ label, value }: { label: string; value: number }) {
  const color = scoreColor(value);
  return (
    <div className="flex flex-col items-center text-center min-w-0">
      <p className="text-[9px] text-slate-400 leading-tight w-full truncate" title={label}>{label}</p>
      <p className="text-sm font-bold leading-none mt-1" style={{ color }}>{value}%</p>
      <div className="h-1 w-full rounded-full bg-slate-100 overflow-hidden mt-1.5">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function CompatRing({ value }: { value: number }) {
  const size = 60, stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = scoreColor(value);
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEF1F6" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading font-bold text-sm" style={{ color }}>{value}%</span>
      </div>
    </div>
  );
}
