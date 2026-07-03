'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  GitBranch, Users, Calendar, ClipboardCheck, TrendingUp,
  ArrowRight, Filter, ChevronRight, Phone, ClipboardList,
  CheckCircle2, Circle, Activity,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { CLIENT_JOURNEY_STAGES } from '@/lib/client-journey';
import { processStatusLabel } from '@/lib/process-status';
import type { ProcessEvalGroup } from '@/lib/evaluations';

type MyDay = {
  interviews: number;
  candidatesToReview: number;
  testsToGrade: number;
  clientsWaiting: number;
  tasks: number;
  proposals: number;
};

type ProcessSummary = {
  id: string;
  title: string;
  company: string;
  status: string;
  candidates: number;
  daysOpen: number;
  trafficLight: string;
};

type ActivityLog = {
  id: string;
  description: string;
  createdAt: string;
  user?: { firstName: string; lastName: string };
};

type AlertItem = { id: string; title: string; status: string; dueDate?: string };

const STAGE_ACTIVITIES: Record<string, string[]> = {
  discovery: ['Agenda reunión', 'Explica el negocio', 'Explica sus productos', 'Explica cómo vende', 'Explica su proceso comercial', 'Solicitud de cubrimiento'],
  ideal_seller: ['Analiza el cargo', 'Documenta el proceso', 'Identifica habilidades', 'Diseña evaluación', 'Define perfil ideal'],
  recruitment: ['Hunting', 'Publicación', 'Filtros'],
  evaluation: ['Pruebas psicotécnicas', 'Entrevistas', 'Evaluaciones comerciales', 'Evaluaciones blandas', 'Validaciones'],
  pre_interview: ['Preselección', 'Informe final'],
  candidate_definition: ['Presentación de finalistas', 'Documentación comercial', 'Seguimiento'],
  client_interview: ['Protocolo de entrevista', 'Entrevista final', 'Contratación'],
  onboarding: ['Inducción', 'Plataforma y dashboard', 'Capacitaciones', 'Manual digital', 'Soporte'],
};

function scoreColor(pct: number) {
  if (pct >= 80) return 'var(--kova-green)';
  if (pct >= 70) return '#B7791F';
  return 'var(--kova-coral)';
}
function scoreTrack(pct: number) {
  if (pct >= 80) return '#E6FAF3';
  if (pct >= 70) return '#FFF7E6';
  return '#FFF0EE';
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Hace unos minutos';
  if (h < 24) return `Hace ${h} hora${h !== 1 ? 's' : ''}`;
  const d = Math.floor(h / 24);
  return `Hace ${d} día${d !== 1 ? 's' : ''}`;
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.metrics });
  const { data: evalData } = useQuery({ queryKey: ['assessments'], queryFn: () => dashboardApi.assessments() });

  const kpis = (data?.kpis ?? {}) as Record<string, number>;
  const myDay = (data?.myDay ?? {}) as MyDay;
  const processes = (data?.processes ?? []) as ProcessSummary[];
  const alerts = (data?.alerts ?? []) as AlertItem[];
  const recentActivity = (data?.recentActivity ?? []) as ActivityLog[];
  const evalProcesses = (evalData?.processes ?? []) as ProcessEvalGroup[];

  const totalCandidatesEval = evalProcesses.reduce((s, p) => s + p.candidateCount, 0);
  const totalTests = evalProcesses.reduce((s, p) => s + p.testCount, 0);
  const avgScore = evalProcesses.length
    ? Math.round(evalProcesses.reduce((s, p) => s + p.avgScore, 0) / evalProcesses.length)
    : 0;

  // Resumen por prueba
  const testSummary = (() => {
    const map = new Map<string, number[]>();
    for (const p of evalProcesses) for (const c of p.candidates) for (const t of c.tests) {
      const arr = map.get(t.type) ?? [];
      arr.push(Math.round((t.score / t.maxScore) * 100));
      map.set(t.type, arr);
    }
    return Array.from(map.entries()).map(([type, scores]) => ({
      type, count: scores.length,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }));
  })();

  // Distribución de puntajes por candidato
  const distribution = (() => {
    const buckets = [
      { label: '90 – 100', min: 90, max: 100, count: 0, color: 'var(--kova-green)' },
      { label: '70 – 89', min: 70, max: 89, count: 0, color: '#2D5BE3' },
      { label: '50 – 69', min: 50, max: 69, count: 0, color: '#F59E0B' },
      { label: '0 – 49', min: 0, max: 49, count: 0, color: 'var(--kova-coral)' },
    ];
    for (const p of evalProcesses) for (const c of p.candidates) {
      const b = buckets.find((x) => c.avgScore >= x.min && c.avgScore <= x.max);
      if (b) b.count += 1;
    }
    const total = buckets.reduce((s, b) => s + b.count, 0) || 1;
    return { buckets: buckets.map((b) => ({ ...b, pct: Math.round((b.count / total) * 100) })), total: buckets.reduce((s, b) => s + b.count, 0) };
  })();

  // Pipeline 8 etapas — conteos derivados
  const stageCounts = [
    kpis.activeProcesses ?? processes.length,
    kpis.activeProcesses ?? processes.length,
    totalCandidatesEval || kpis.activeCandidates || 0,
    totalTests,
    kpis.interviewsToday ?? 0,
    kpis.stalledProcesses != null ? Math.max(0, (kpis.activeProcesses ?? 0) - 1) : 0,
    myDay.interviews ?? 0,
    kpis.hiresThisMonth ?? 0,
  ];

  const now = new Date();
  const monthShort = now.toLocaleDateString('es-CO', { month: 'short' });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--kova-navy)' }}>
            ¡{greeting()}, María! <span className="text-xl">👋</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Este es el resumen de tu operación hoy.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 bg-white hover:bg-slate-50 transition-colors">
            <Calendar className="w-3.5 h-3.5" /> 1 {monthShort} – 31 {monthShort} {now.getFullYear()}
          </button>
          <button type="button" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 bg-white hover:bg-slate-50 transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filtros
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard label="Procesos activos" value={kpis.activeProcesses ?? 0} icon={GitBranch} tint="#EEF2FA" tone="var(--kova-blue)" href="/procesos" />
        <KpiCard label="Candidatos evaluados" value={totalCandidatesEval} icon={Users} tint="#F3E8FF" tone="#7C3AED" href="/candidatos" />
        <KpiCard label="Pruebas realizadas" value={totalTests} icon={ClipboardList} tint="#ECFEFF" tone="#0E7490" href="/evaluaciones" />
        <KpiCard label="Entrevistas hoy" value={kpis.interviewsToday ?? 0} icon={Calendar} tint="#FDF2F8" tone="#BE185D" href="/agenda" />
        <KpiCard label="Por revisar" value={kpis.pendingReviews ?? 0} icon={ClipboardCheck} tint="#FFF0EE" tone="var(--kova-coral)" href="/evaluaciones" />
        <KpiCard label="Promedio general" value={`${avgScore}%`} icon={TrendingUp} tint={scoreTrack(avgScore)} tone={scoreColor(avgScore)} href="/reportes" />
      </div>

      {/* Pipeline 8 etapas + Rendimiento */}
      <div className="grid xl:grid-cols-[1fr_320px] gap-4 items-start">
        <div className="kova-card p-5">
          <h2 className="font-heading font-bold text-sm mb-4" style={{ color: 'var(--kova-navy)' }}>Pipeline del proceso de selección</h2>
          <div className="flex items-stretch gap-1 overflow-x-auto pb-2">
            {CLIENT_JOURNEY_STAGES.map((stage, i) => (
              <div key={stage.id} className="flex items-stretch shrink-0">
                <div className="w-[116px] text-center">
                  <div className="rounded-xl border p-2.5 h-full flex flex-col items-center justify-start" style={{ borderColor: stage.bg, background: stage.bg }}>
                    <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: stage.color }}>Etapa {i + 1}</span>
                    <span className="text-[10px] font-medium leading-tight mt-1" style={{ color: 'var(--kova-navy)' }}>{stage.label.split(' + ')[0]}</span>
                  </div>
                  <p className="font-heading font-bold text-lg mt-2 leading-none" style={{ color: stage.color }}>{stageCounts[i]}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{['Procesos', 'Procesos', 'Candidatos', 'Pruebas', 'Entrevistas', 'Finalistas', 'En entrevista', 'Contratados'][i]}</p>
                </div>
                {i < CLIENT_JOURNEY_STAGES.length - 1 && (
                  <div className="flex items-center px-0.5 pt-6">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="kova-card p-5">
          <h2 className="font-heading font-bold text-sm mb-3" style={{ color: 'var(--kova-navy)' }}>Rendimiento general</h2>
          <div className="flex items-center gap-4">
            <Donut buckets={distribution.buckets} centerValue={`${avgScore}%`} centerLabel="Promedio" />
            <div className="flex-1 space-y-1.5">
              {distribution.buckets.map((b, idx) => (
                <div key={b.label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} />
                    {['Excelentes', 'Buenos', 'Regulares', 'Bajos'][idx]}
                  </span>
                  <span className="text-slate-400">{b.label}</span>
                  <span className="font-semibold text-slate-700 w-12 text-right">{b.count} ({b.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/reportes" className="text-xs inline-flex items-center gap-1 mt-3 hover:underline" style={{ color: 'var(--kova-blue)' }}>
            Ver reporte completo <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Procesos activos + Pendientes */}
      <div className="grid xl:grid-cols-[1fr_320px] gap-4 items-start">
        <div className="kova-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-sm" style={{ color: 'var(--kova-navy)' }}>Mis procesos activos</h2>
          </div>
          {isLoading ? (
            <div className="space-y-2">{[0, 1].map((i) => <div key={i} className="kova-skeleton h-14 rounded-xl" />)}</div>
          ) : processes.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">Sin procesos activos.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                    <th className="pb-2 font-semibold">Proceso / Empresa</th>
                    <th className="pb-2 font-semibold hidden sm:table-cell">Estado</th>
                    <th className="pb-2 font-semibold text-center">Cand.</th>
                    <th className="pb-2 font-semibold hidden md:table-cell">Próxima acción</th>
                    <th className="pb-2 font-semibold text-right">Progreso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {processes.map((p) => {
                    const pct = progressFor(p);
                    return (
                      <tr key={p.id} className="group hover:bg-slate-50/60 transition-colors">
                        <td className="py-3">
                          <Link href={`/procesos/${p.id}`} className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.trafficLight === 'red' ? 'var(--kova-coral)' : p.trafficLight === 'yellow' ? '#F59E0B' : 'var(--kova-green)' }} />
                            <span className="min-w-0">
                              <span className="block font-semibold truncate group-hover:underline" style={{ color: 'var(--kova-navy)' }}>{p.company}</span>
                              <span className="block text-xs text-slate-400 truncate">{p.title}</span>
                            </span>
                          </Link>
                        </td>
                        <td className="py-3 hidden sm:table-cell">
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 whitespace-nowrap">{processStatusLabel(p.status)}</span>
                        </td>
                        <td className="py-3 text-center font-medium text-slate-600">{p.candidates}</td>
                        <td className="py-3 hidden md:table-cell text-xs text-slate-500">{p.daysOpen}d abiertos</td>
                        <td className="py-3">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden hidden sm:block">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: scoreColor(pct) }} />
                            </div>
                            <span className="text-xs font-bold" style={{ color: scoreColor(pct) }}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <Link href="/procesos" className="text-xs inline-flex items-center gap-1 mt-3 hover:underline" style={{ color: 'var(--kova-blue)' }}>
            Ver todos los procesos <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="kova-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-sm" style={{ color: 'var(--kova-navy)' }}>Pendientes de hoy</h2>
            <Link href="/tareas" className="text-[10px] hover:underline" style={{ color: 'var(--kova-blue)' }}>Ver todas ({alerts.length})</Link>
          </div>
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="w-9 h-9 text-slate-200 mb-2" />
              <p className="text-sm text-slate-400">Todo al día.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {alerts.map((a, i) => {
                const icons = [Phone, ClipboardCheck, Phone, ClipboardList];
                const Icon = icons[i % icons.length];
                const times = ['09:00', '10:30', '11:30', '15:30'];
                return (
                  <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: a.status === 'OVERDUE' ? '#FFF0EE' : '#EEF2FA' }}>
                      <Icon className="w-4 h-4" style={{ color: a.status === 'OVERDUE' ? 'var(--kova-coral)' : 'var(--kova-blue)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--kova-navy)' }}>{a.title}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{times[i % times.length]}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Evaluaciones + Distribución + Actividad */}
      <div className="grid lg:grid-cols-3 gap-4 items-start">
        <div className="kova-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-sm" style={{ color: 'var(--kova-navy)' }}>Evaluaciones</h2>
            <Link href="/evaluaciones" className="text-[10px] hover:underline" style={{ color: 'var(--kova-blue)' }}>Ver todas</Link>
          </div>
          {testSummary.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Sin evaluaciones aún.</p>
          ) : (
            <div className="space-y-3">
              {testSummary.map((t) => (
                <div key={t.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700">{t.type}</span>
                    <span className="text-[10px] text-slate-400">{t.count} completada{t.count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: scoreTrack(t.avg) }}>
                    <div className="h-full rounded-full" style={{ width: `${t.avg}%`, background: scoreColor(t.avg) }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Promedio {t.avg}/100</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="kova-card p-5">
          <h2 className="font-heading font-bold text-sm mb-3" style={{ color: 'var(--kova-navy)' }}>Distribución de puntajes</h2>
          <Donut buckets={distribution.buckets} centerValue={String(distribution.total)} centerLabel="Candidatos" />
          <div className="mt-3 space-y-1.5">
            {distribution.buckets.map((b) => (
              <div key={b.label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} /> {b.label}
                </span>
                <span className="font-semibold text-slate-700">{b.count} ({b.pct}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="kova-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-sm" style={{ color: 'var(--kova-navy)' }}>Actividad reciente</h2>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Sin actividad reciente.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#EEF2FA' }}>
                    <Activity className="w-3.5 h-3.5" style={{ color: 'var(--kova-blue)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-snug">{a.description}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{timeAgo(a.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detalle por etapa */}
      <div className="kova-card p-5">
        <h2 className="font-heading font-bold text-sm mb-4" style={{ color: 'var(--kova-navy)' }}>Detalle por etapa del proceso</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
          {CLIENT_JOURNEY_STAGES.map((stage, i) => (
            <div key={stage.id} className="rounded-xl border border-slate-100 overflow-hidden">
              <div className="px-3 py-2 border-b border-slate-100" style={{ background: stage.bg }}>
                <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: stage.color }}>Etapa {i + 1}</p>
                <p className="text-[11px] font-semibold leading-tight mt-0.5" style={{ color: 'var(--kova-navy)' }}>{stage.shortLabel}</p>
              </div>
              <ul className="p-3 space-y-1.5">
                {(STAGE_ACTIVITIES[stage.id] ?? []).map((act) => (
                  <li key={act} className="text-[10px] text-slate-500 flex items-start gap-1.5 leading-snug">
                    <Circle className="w-1.5 h-1.5 mt-1 shrink-0 fill-current" style={{ color: stage.color }} />
                    {act}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function progressFor(p: ProcessSummary): number {
  const map: Record<string, number> = {
    DRAFT: 5, DISCOVERY_PENDING: 15, DISCOVERY: 15, PROFILE_BUILDING: 25, APPROVAL_PENDING: 35,
    SEARCH_ACTIVE: 55, EVALUATION: 70, FINALISTS: 85, OFFER: 92, HIRED: 100,
  };
  return map[p.status] ?? 40;
}

function KpiCard({ label, value, icon: Icon, tint, tone, href }: {
  label: string; value: number | string; icon: React.ElementType; tint: string; tone: string; href: string;
}) {
  return (
    <Link href={href} className="kova-card kova-card-hover group px-4 py-3.5 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: tint }}>
        <Icon className="w-5 h-5" style={{ color: tone }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-heading text-2xl font-bold leading-none" style={{ color: 'var(--kova-navy)' }}>{value}</p>
        <p className="text-[10px] font-medium text-slate-400 truncate mt-1">{label}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-slate-400 shrink-0" />
    </Link>
  );
}

function Donut({ buckets, centerValue, centerLabel }: {
  buckets: { label: string; count: number; pct: number; color: string }[];
  centerValue: string;
  centerLabel: string;
}) {
  const total = buckets.reduce((s, b) => s + b.count, 0);
  let cumulative = 0;
  const segments = total > 0 ? buckets.filter((b) => b.count > 0).map((b) => {
    const start = cumulative;
    cumulative += b.pct;
    return { ...b, start, dash: b.pct };
  }) : [];

  return (
    <div className="relative w-28 h-28 mx-auto shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EEF1F6" strokeWidth="3.4" />
        {segments.map((seg) => (
          <circle key={seg.label} cx="18" cy="18" r="15.9" fill="none"
            stroke={seg.color} strokeWidth="3.4"
            strokeDasharray={`${seg.dash} ${100 - seg.dash}`}
            strokeDashoffset={-seg.start}
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading font-bold text-lg" style={{ color: 'var(--kova-navy)' }}>{centerValue}</span>
        <span className="text-[9px] text-slate-400">{centerLabel}</span>
      </div>
    </div>
  );
}
