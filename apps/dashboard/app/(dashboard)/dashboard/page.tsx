'use client';

import { Fragment, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  GitBranch, Users, Calendar, ClipboardCheck, TrendingUp,
  ArrowRight, ChevronRight, Phone, ClipboardList,
  CheckCircle2, Circle, Activity, Briefcase,
} from 'lucide-react';
import { dashboardApi, getStoredUser } from '@/lib/api';
import { CLIENT_JOURNEY_STAGES } from '@/lib/client-journey';
import { processStatusLabel, processProgress, processStageInfo } from '@/lib/process-status';
import { ProcessProgressBar } from '@/components/proceso/ProcessProgressBar';
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

const STAGE_METRICS = ['Procesos', 'Perfiles', 'Candidatos', 'Pruebas', 'Entrevistas', 'Finalistas', 'En entrevista', 'Contratados'] as const;

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
  if (pct >= 80) return '#ECFDF5';
  if (pct >= 70) return '#FFFBEB';
  return '#FEF2F2';
}

function processStatusColor(status: string) {
  const map: Record<string, string> = {
    SEARCH_ACTIVE: 'var(--kova-green)',
    HIRED: 'var(--kova-green)',
    FINALISTS: '#DB2777',
    OFFER: '#EA580C',
    EVALUATION: '#7C3AED',
    PROFILE_BUILDING: '#2563EB',
    APPROVAL_PENDING: '#F59E0B',
    DISCOVERY: '#1D4ED8',
    DISCOVERY_PENDING: '#1D4ED8',
    PAUSED: '#94A3B8',
  };
  return map[status] ?? '#2563EB';
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

function progressFor(p: ProcessSummary): number {
  return processProgress(p.status);
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

  const [greet, setGreet] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  useEffect(() => {
    setGreet(greeting());
    setFirstName(getStoredUser()?.firstName ?? '');
  }, []);

  const totalCandidatesEval = evalProcesses.reduce((s, p) => s + p.candidateCount, 0);
  const totalTests = evalProcesses.reduce((s, p) => s + p.testCount, 0);
  const avgScore = evalProcesses.length
    ? Math.round(evalProcesses.reduce((s, p) => s + p.avgScore, 0) / evalProcesses.length)
    : 0;

  const testSummary = (() => {
    const map = new Map<string, number[]>();
    for (const p of evalProcesses) {
      for (const c of p.candidates) {
        for (const t of c.tests) {
          const arr = map.get(t.type) ?? [];
          arr.push(Math.round((t.score / t.maxScore) * 100));
          map.set(t.type, arr);
        }
      }
    }
    return Array.from(map.entries()).map(([type, scores]) => ({
      type,
      count: scores.length,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }));
  })();

  const distribution = (() => {
    const buckets = [
      { label: '90 - 100', min: 90, max: 100, count: 0, color: 'var(--kova-green)' },
      { label: '70 - 89', min: 70, max: 89, count: 0, color: '#2563EB' },
      { label: '50 - 69', min: 50, max: 69, count: 0, color: '#F59E0B' },
      { label: '0 - 49', min: 0, max: 49, count: 0, color: 'var(--kova-coral)' },
    ];
    for (const p of evalProcesses) {
      for (const c of p.candidates) {
        const b = buckets.find((x) => c.avgScore >= x.min && c.avgScore <= x.max);
        if (b) b.count += 1;
      }
    }
    const total = buckets.reduce((s, b) => s + b.count, 0) || 1;
    return {
      buckets: buckets.map((b) => ({ ...b, pct: Math.round((b.count / total) * 100) })),
      total: buckets.reduce((s, b) => s + b.count, 0),
    };
  })();

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

  return (
    <div className="space-y-5">
      {/* Saludo + KPIs */}
      <div className="grid xl:grid-cols-[minmax(260px,320px)_1fr] gap-4 items-stretch">
        <div className="kova-card p-6 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15), transparent 70%)' }} />
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Panel principal</p>
          <h1 className="font-heading text-2xl sm:text-[1.75rem] font-bold mt-1 tracking-tight" style={{ color: 'var(--kova-navy)' }}>
            {greet ?? 'Hola'}{firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">Resumen de tu operación comercial hoy.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
          <KpiCard label="Procesos activos" value={kpis.activeProcesses ?? 0} icon={GitBranch} tint="#EFF6FF" tone="var(--kova-blue)" href="/procesos" />
          <KpiCard label="Candidatos evaluados" value={totalCandidatesEval} icon={Users} tint="#F5F3FF" tone="#7C3AED" href="/candidatos" />
          <KpiCard label="Pruebas realizadas" value={totalTests} icon={ClipboardList} tint="#ECFEFF" tone="#0E7490" href="/evaluaciones" />
          <KpiCard label="Entrevistas hoy" value={kpis.interviewsToday ?? 0} icon={Calendar} tint="#FDF2F8" tone="#BE185D" href="/agenda" />
          <KpiCard label="Por revisar" value={kpis.pendingReviews ?? 0} icon={ClipboardCheck} tint="#FEF2F2" tone="var(--kova-coral)" href="/evaluaciones" />
          <KpiCard label="Promedio general" value={`${avgScore}%`} icon={TrendingUp} tint={scoreTrack(avgScore)} tone={scoreColor(avgScore)} href="/reportes" />
        </div>
      </div>

      {/* Pipeline + rendimiento */}
      <div className="grid xl:grid-cols-[1fr_300px] gap-4 items-stretch">
        <SectionCard title="Pipeline del proceso de selección" className="min-h-[280px]">
          <div className="relative mt-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2.5">
              {CLIENT_JOURNEY_STAGES.map((stage, i) => (
                <div key={stage.id} className="flex flex-col items-center text-center min-h-[132px]">
                  <div
                    className="w-full rounded-xl border px-2 py-3 min-h-[72px] flex flex-col items-center justify-center"
                    style={{ borderColor: `${stage.color}22`, background: stage.bg }}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: stage.color }}>
                      Etapa {i + 1}
                    </span>
                    <span className="text-xs font-semibold leading-snug mt-1 line-clamp-2" style={{ color: 'var(--kova-navy)' }}>
                      {stage.shortLabel}
                    </span>
                  </div>
                  <p className="font-heading font-bold text-xl mt-2.5 leading-none tabular-nums" style={{ color: stage.color }}>
                    {stageCounts[i]}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight">{STAGE_METRICS[i]}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Rendimiento general" footer={<Link href="/reportes" className="text-xs inline-flex items-center gap-1 hover:underline font-medium" style={{ color: 'var(--kova-blue)' }}>Ver reporte completo <ArrowRight className="w-3 h-3" /></Link>}>
          <div className="flex flex-col sm:flex-row xl:flex-col items-center gap-4 flex-1 justify-center">
            <Donut buckets={distribution.buckets} centerValue={`${avgScore}%`} centerLabel="Promedio" />
            <div className="w-full grid grid-cols-[minmax(0,1fr)_5.25rem_2rem] gap-x-3 gap-y-2.5 text-xs items-center">
              {distribution.buckets.map((b, idx) => (
                <Fragment key={b.label}>
                  <span className="flex items-center gap-2 font-medium min-w-0" style={{ color: 'var(--kova-navy)' }}>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: b.color }} />
                    <span className="truncate">{['Excelentes', 'Buenos', 'Regulares', 'Bajos'][idx]}</span>
                  </span>
                  <span className="text-right tabular-nums" style={{ color: 'var(--kova-navy-muted)' }}>
                    {b.label}
                  </span>
                  <span className="text-right font-semibold tabular-nums" style={{ color: 'var(--kova-navy)' }}>
                    {b.count}
                  </span>
                </Fragment>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Procesos + pendientes */}
      <div className="grid xl:grid-cols-[1fr_300px] gap-4 items-stretch">
        <SectionCard
          title="Mis procesos activos"
          action={<Link href="/procesos" className="text-xs font-semibold hover:underline" style={{ color: 'var(--kova-blue)' }}>Ver todos</Link>}
          className="min-h-[320px]"
        >
          {isLoading ? (
            <div className="space-y-2">{[0, 1, 2].map((i) => <div key={i} className="kova-skeleton h-16 rounded-xl" />)}</div>
          ) : processes.length === 0 ? (
            <EmptyState message="Sin procesos activos." actionLabel="Crear proceso" actionHref="/procesos/nuevo" />
          ) : (
            <div className="space-y-2.5 flex-1">
              {processes.slice(0, 4).map((p) => (
                <ActiveProcessRow key={p.id} process={p} />
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Pendientes de hoy"
          action={<Link href="/tareas" className="text-xs font-semibold hover:underline" style={{ color: 'var(--kova-blue)' }}>Ver todas ({alerts.length})</Link>}
          className="min-h-[320px]"
        >
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-8 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-200 mb-2" />
              <p className="text-sm font-medium text-slate-600">Todo al día</p>
              <p className="text-xs text-slate-400 mt-1">No hay tareas urgentes para hoy</p>
            </div>
          ) : (
            <div className="space-y-1.5 flex-1">
              {alerts.slice(0, 6).map((a, i) => {
                const icons = [Phone, ClipboardCheck, Phone, ClipboardList];
                const Icon = icons[i % icons.length];
                const overdue = a.status === 'OVERDUE';
                return (
                  <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: overdue ? '#FEF2F2' : '#EFF6FF' }}>
                      <Icon className="w-4 h-4" style={{ color: overdue ? 'var(--kova-coral)' : 'var(--kova-blue)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: 'var(--kova-navy)' }}>{a.title}</p>
                      {a.dueDate && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {new Date(a.dueDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                        </p>
                      )}
                    </div>
                    {overdue && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 shrink-0">Vencida</span>}
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Evaluaciones + actividad */}
      <div className="grid lg:grid-cols-2 gap-4 items-stretch">
        <SectionCard title="Evaluaciones por tipo" action={<Link href="/evaluaciones" className="text-xs font-semibold hover:underline" style={{ color: 'var(--kova-blue)' }}>Ver todas</Link>}>
          {testSummary.length === 0 ? (
            <EmptyState message="Sin evaluaciones registradas." actionLabel="Ir a evaluaciones" actionHref="/evaluaciones" />
          ) : (
            <div className="space-y-4">
              {testSummary.map((t) => (
                <div key={t.type}>
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span className="text-sm font-semibold text-slate-800">{t.type}</span>
                    <span className="text-xs text-slate-500">{t.count} completada{t.count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden bg-slate-100">
                    <div className="h-full rounded-full transition-all" style={{ width: `${t.avg}%`, background: scoreColor(t.avg) }} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Promedio {t.avg} · {t.avg >= 70 ? 'Nivel aceptable' : 'Por reforzar'}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Actividad reciente">
          {recentActivity.length === 0 ? (
            <EmptyState message="Sin actividad reciente." />
          ) : (
            <div className="space-y-3">
              {recentActivity.slice(0, 6).map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-50">
                    <Activity className="w-4 h-4" style={{ color: 'var(--kova-blue)' }} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm text-slate-700 leading-snug">{a.description}</p>
                    <p className="text-xs text-slate-500 mt-1">{timeAgo(a.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Detalle por etapa */}
      <SectionCard title="Detalle por etapa del proceso">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 items-stretch">
          {CLIENT_JOURNEY_STAGES.map((stage, i) => (
            <div key={stage.id} className="rounded-xl border border-slate-100 overflow-hidden flex flex-col min-h-[180px]">
              <div className="px-3 py-2.5 border-b border-slate-100/80 shrink-0" style={{ background: stage.bg }}>
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: stage.color }}>Etapa {i + 1}</p>
                <p className="text-xs font-semibold leading-snug mt-0.5" style={{ color: 'var(--kova-navy)' }}>{stage.shortLabel}</p>
              </div>
              <ul className="p-3 space-y-1.5 flex-1">
                {(STAGE_ACTIVITIES[stage.id] ?? []).slice(0, 4).map((act) => (
                  <li key={act} className="text-[11px] text-slate-600 flex items-start gap-1.5 leading-snug">
                    <Circle className="w-1.5 h-1.5 mt-1.5 shrink-0 fill-current" style={{ color: stage.color }} />
                    {act}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({
  title,
  action,
  footer,
  children,
  className = '',
}: {
  title: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`kova-card p-5 flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
        <h2 className="font-heading font-bold text-[15px]" style={{ color: 'var(--kova-navy)' }}>{title}</h2>
        {action}
      </div>
      <div className="flex-1 flex flex-col min-h-0">{children}</div>
      {footer && <div className="mt-4 pt-3 border-t border-slate-100 shrink-0">{footer}</div>}
    </div>
  );
}

function EmptyState({ message, actionLabel, actionHref }: { message: string; actionLabel?: string; actionHref?: string }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-10 text-center">
      <p className="text-sm text-slate-500">{message}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="text-sm font-semibold mt-3 hover:underline" style={{ color: 'var(--kova-blue)' }}>
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}

function ActiveProcessRow({ process: p }: { process: ProcessSummary }) {
  const color = processStatusColor(p.status);
  const pct = progressFor(p);
  const stage = processStageInfo(p.status);
  const traffic =
    p.trafficLight === 'red' ? 'var(--kova-coral)' : p.trafficLight === 'yellow' ? '#F59E0B' : 'var(--kova-green)';

  return (
    <Link
      href={`/procesos/${p.id}`}
      className="group block rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3.5 hover:bg-white hover:border-blue-100 hover:shadow-sm transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white border border-slate-100">
            <Briefcase className="w-4 h-4 text-slate-500 group-hover:text-[var(--kova-blue)]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: traffic }} />
              <p className="font-semibold text-sm truncate group-hover:underline" style={{ color: 'var(--kova-navy)' }}>{p.company}</p>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0" style={{ background: `${color}18`, color }}>
                {processStatusLabel(p.status)}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{p.title}</p>
            <p className="text-xs text-slate-500 mt-1">
              {p.candidates} candidatos · {p.daysOpen} días abiertos · {stage.label}
            </p>
          </div>
        </div>
        <div className="w-full sm:w-44 shrink-0">
          <ProcessProgressBar status={p.status} progress={pct} color={color} size="sm" showHeader={false} />
        </div>
      </div>
    </Link>
  );
}

function KpiCard({ label, value, icon: Icon, tint, tone, href }: {
  label: string; value: number | string; icon: React.ElementType; tint: string; tone: string; href: string;
}) {
  return (
    <Link
      href={href}
      className="kova-card kova-card-hover group p-3.5 sm:p-4 flex flex-col gap-2.5 h-full min-h-[108px]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: tint }}>
          <Icon className="w-5 h-5" style={{ color: tone }} />
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0 mt-0.5" />
      </div>
      <div className="min-w-0 mt-auto">
        <p className="font-heading text-xl sm:text-2xl font-bold leading-none tabular-nums" style={{ color: 'var(--kova-navy)' }}>
          {value}
        </p>
        <p className="text-[11px] sm:text-xs font-medium text-slate-600 mt-1.5 leading-snug whitespace-normal">
          {label}
        </p>
      </div>
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
    <div className="relative w-[7.5rem] h-[7.5rem] mx-auto shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E2E8F0" strokeWidth="3.2" />
        {segments.map((seg) => (
          <circle
            key={seg.label}
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke={seg.color}
            strokeWidth="3.2"
            strokeDasharray={`${seg.dash} ${100 - seg.dash}`}
            strokeDashoffset={-seg.start}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading font-bold text-lg leading-none" style={{ color: 'var(--kova-navy)' }}>{centerValue}</span>
        <span className="text-[10px] text-slate-500 mt-1">{centerLabel}</span>
      </div>
    </div>
  );
}
