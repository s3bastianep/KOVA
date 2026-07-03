'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  MapPin, Building2, Users, Star, Upload, Plus, Search, Filter, ChevronDown,
  ChevronLeft, ChevronRight, List, LayoutGrid, Calendar, ClipboardList,
  Clock, Bell, MoreHorizontal, BarChart3,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { stageLabel } from '@/lib/stages';

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

function nextAction(stage?: string) {
  if (stage === 'INTERVIEW') return { title: 'Entrevista agendada', detail: '20 May 2024, 10:00 AM' };
  if (stage === 'ASSESSMENT') return { title: 'Prueba asignada', detail: 'DISC · Pendiente' };
  return { title: 'Última actividad', detail: 'Hace 2 días' };
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

export default function CandidatosPage() {
  const { data, isLoading } = useQuery({ queryKey: ['candidates'], queryFn: () => dashboardApi.candidates() });
  const list = (data as CandidateRow[]) ?? [];
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      (c.vacancyTitle ?? '').toLowerCase().includes(q) ||
      (c.companyName ?? '').toLowerCase().includes(q),
    );
  }, [list, search]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: '#F3E8FF', color: '#7C3AED' }}>
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold leading-tight" style={{ color: 'var(--kova-navy)' }}>Candidatos</h1>
            <p className="text-sm text-slate-500 mt-0.5">Gestiona y evalúa candidatos en tus procesos de selección.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors">
            <Upload className="w-4 h-4" /> Importar CV
          </button>
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 transition-all" style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}>
            <Plus className="w-4 h-4" /> Nuevo candidato
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[220px] rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[var(--kova-ring)] focus-within:border-[var(--kova-blue)] transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar candidato por nombre, cargo, empresa..." className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400" />
        </div>
        <FilterChip icon={Building2} label="Todos los procesos" />
        <FilterChip icon={Filter} label="Todas las etapas" />
        <FilterChip icon={BarChart3} label="Compatibilidad" />
        <button type="button" className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 bg-white hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </div>

      {/* Barra de resultados */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{filtered.length} candidato{filtered.length === 1 ? '' : 's'} encontrado{filtered.length === 1 ? '' : 's'}</p>
        <div className="flex items-center gap-3">
          <button type="button" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 bg-white hover:bg-slate-50 transition-colors">
            Ordenar por: <span className="font-semibold text-slate-700">Compatibilidad</span> <ChevronDown className="w-3.5 h-3.5" />
          </button>
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
          {filtered.map((c) => (
            <CandidateCard key={c.id} c={c} />
          ))}
        </div>
      )}

      {/* Paginación */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            <button type="button" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
            <button type="button" className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold text-white" style={{ background: 'var(--kova-blue)' }}>1</button>
            <button type="button" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            Mostrar
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 text-slate-600">10 <ChevronDown className="w-3 h-3" /></span>
            por página
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({ icon: Icon, label }: { icon: typeof Building2; label: string }) {
  return (
    <button type="button" className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 bg-white hover:bg-slate-50 transition-colors whitespace-nowrap">
      <Icon className="w-4 h-4 text-slate-400" /> {label} <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
    </button>
  );
}

function CandidateCard({ c }: { c: CandidateRow }) {
  const compat = Math.round(c.compatibility ?? 0);
  const sb = statusBadge(c.status, c.currentStage);
  const stg = stageBadge(c.currentStage);
  const StageIcon = stg.icon;
  const action = nextAction(c.currentStage);
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
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: sb.bg, color: sb.color }}>{sb.label}</span>
          </div>
          <p className="text-xs text-slate-400 truncate mt-1">{c.email ?? '—'}</p>
          {c.companyName && (
            <p className="text-xs mt-1.5 inline-flex items-center gap-1 font-medium truncate max-w-full" style={{ color: 'var(--kova-blue)' }}>
              <Building2 className="w-3 h-3 shrink-0" /> <span className="truncate">Postula a {c.companyName}</span>
            </p>
          )}
          {c.vacancyTitle && <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.vacancyTitle}</p>}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5 text-[10px] text-slate-400">
            {c.city && <span className="inline-flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {c.city}</span>}
            {c.source && <span>· Fuente: {c.source}</span>}
          </div>
        </div>
      </div>

      {/* Etapa + próxima acción */}
      <div className="flex flex-col gap-2 min-w-0 xl:border-l xl:border-slate-100 xl:pl-6">
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium self-start whitespace-nowrap" style={{ background: stg.bg, color: stg.color }}>
          <StageIcon className="w-3.5 h-3.5" /> {stageLabel(c.currentStage)}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: 'var(--kova-navy)' }}>{action.title}</p>
          <p className="text-[11px] text-slate-400 truncate">{action.detail}</p>
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
          <button type="button" className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            {isAssessment ? <><Bell className="w-3.5 h-3.5" /> Enviar recordatorio</> : <><Calendar className="w-3.5 h-3.5" /> Agendar</>}
          </button>
          <button type="button" className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-50 transition-colors">
            <MoreHorizontal className="w-3.5 h-3.5" /> Más acciones
          </button>
        </div>
      </div>
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
