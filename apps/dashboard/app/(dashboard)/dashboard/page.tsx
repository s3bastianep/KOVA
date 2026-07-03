'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Building2, GitBranch, Users, Calendar, ClipboardCheck,
  AlertTriangle, Clock, TrendingUp, CheckCircle2, Plus, ArrowRight,
  Sparkles, ChevronRight,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';

type TodayItem = {
  id: string;
  title: string;
  priority: string;
  type: string;
  processId?: string | null;
  processTitle?: string;
  candidateId?: string;
};

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

type FunnelItem = { stage: string; count: number };

const priorityStyle: Record<string, string> = {
  HIGH: 'bg-red-50 text-red-600 border border-red-100',
  MEDIUM: 'bg-amber-50 text-amber-700 border border-amber-100',
  LOW: 'bg-slate-50 text-slate-500 border border-slate-100',
};

function KpiCard({ label, value, icon: Icon, accent, tone, href }: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  accent: string;
  tone: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="kova-card group relative overflow-hidden px-4 py-3.5 flex items-center gap-3 hover:-translate-y-0.5 transition-all duration-200"
    >
      <span
        className="absolute inset-x-0 top-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: tone }}
      />
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: accent }}>
        <Icon className="w-4.5 h-4.5" style={{ color: tone, width: 18, height: 18 }} />
      </div>
      <div className="min-w-0">
        <p className="font-heading text-2xl font-bold leading-none" style={{ color: 'var(--kova-navy)' }}>{value}</p>
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide truncate mt-1">{label}</p>
      </div>
    </Link>
  );
}

const FUNNEL_COLORS = ['#1A3FAA', '#2D5BE3', '#4B73E8', '#6B8FEF', '#8FA9F4', '#B3C4F8', '#D0DBFB'];

function CompactFunnel({ title, items, accent }: { title: string; items: FunnelItem[]; accent?: string }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  const total = items.reduce((s, i) => s + i.count, 0);
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{title}</h3>
        <span className="text-[10px] text-slate-400">{total} total</span>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={item.stage} className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 w-[72px] shrink-0 truncate text-right">{item.stage}</span>
            <div className="flex-1 h-4 rounded-md bg-slate-50 overflow-hidden">
              <div
                className="h-full rounded-md flex items-center justify-end pr-1.5 transition-all duration-500"
                style={{
                  width: `${Math.max((item.count / max) * 100, item.count > 0 ? 8 : 0)}%`,
                  background: accent ?? FUNNEL_COLORS[Math.min(i, FUNNEL_COLORS.length - 1)],
                }}
              >
                {item.count > 0 && <span className="text-[9px] font-bold text-white leading-none">{item.count}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.metrics });
  const kpis = (data?.kpis ?? {}) as Record<string, number>;
  const todayWork = (data?.todayWork ?? []) as TodayItem[];
  const recruitmentFunnel = (data?.recruitmentFunnel ?? []) as FunnelItem[];
  const commercialFunnel = (data?.commercialFunnel ?? []) as FunnelItem[];
  const alerts = (data?.alerts ?? []) as { id: string; title: string; status: string }[];
  const myDay = (data?.myDay ?? {}) as MyDay;
  const processes = (data?.processes ?? []) as ProcessSummary[];

  const myDayItems = [
    { label: 'entrevistas', count: myDay.interviews ?? 0, href: '/entrevistas' },
    { label: 'por revisar', count: myDay.candidatesToReview ?? 0, href: '/candidatos' },
    { label: 'pruebas', count: myDay.testsToGrade ?? 0, href: '/evaluaciones' },
    { label: 'clientes', count: myDay.clientsWaiting ?? 0, href: '/procesos' },
    { label: 'tareas', count: myDay.tasks ?? 0, href: '/tareas' },
    { label: 'propuestas', count: myDay.proposals ?? 0, href: '/pipeline-comercial' },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Header con gradiente */}
      <div
        className="rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(120deg, #0F1F3D 0%, #1A3FAA 60%, #2D5BE3 100%)' }}
      >
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10" style={{ background: '#fff' }} />
        <div className="absolute right-24 -bottom-12 w-32 h-32 rounded-full opacity-10" style={{ background: '#fff' }} />
        <div className="relative">
          <p className="text-xs text-blue-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> {greeting()}
          </p>
          <h1 className="font-heading text-2xl font-bold mt-1">Tu centro operativo</h1>
          <p className="text-sm text-blue-100/80 mt-0.5">Solo lo que requiere tu acción hoy.</p>
        </div>
        <div className="relative flex items-center gap-2">
          <Link href="/calendario" className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors font-medium">
            <Calendar className="w-4 h-4" /> Calendario
          </Link>
          <Link href="/procesos/nuevo" className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2.5 rounded-lg bg-white text-[var(--kova-navy)] hover:bg-blue-50 transition-colors font-semibold shadow-sm">
            <Plus className="w-4 h-4" /> Nuevo proceso
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="kova-card px-4 py-3.5 animate-pulse flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100" />
              <div className="space-y-2">
                <div className="h-5 w-10 bg-slate-100 rounded" />
                <div className="h-2 w-14 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
            <KpiCard label="Clientes" value={kpis.activeClients ?? 0} icon={Building2} accent="#E6FAF3" tone="var(--kova-green)" href="/crm" />
            <KpiCard label="Procesos" value={kpis.activeProcesses ?? kpis.activeVacancies ?? 0} icon={GitBranch} accent="#EEF2FA" tone="var(--kova-blue)" href="/procesos" />
            <KpiCard label="Candidatos" value={kpis.activeCandidates ?? kpis.candidatesCount ?? 0} icon={Users} accent="#F3E8FF" tone="#7C3AED" href="/candidatos" />
            <KpiCard label="Entrevistas" value={kpis.interviewsToday ?? kpis.interviewsScheduled ?? 0} icon={Calendar} accent="#ECFEFF" tone="#0E7490" href="/entrevistas" />
            <KpiCard label="Por revisar" value={kpis.pendingReviews ?? 0} icon={ClipboardCheck} accent="#FFF0EE" tone="var(--kova-coral)" href="/evaluaciones" />
            <KpiCard label="Detenidos" value={kpis.stalledProcesses ?? 0} icon={AlertTriangle} accent="#FFF0EE" tone="var(--kova-coral)" href="/procesos" />
            <KpiCard label="Por vencer" value={kpis.dueSoon ?? 0} icon={Clock} accent="#FFF7E6" tone="#B7791F" href="/tareas" />
            <KpiCard label="Negocios" value={kpis.activeDeals ?? 0} icon={TrendingUp} accent="#E6FAF3" tone="var(--kova-green)" href="/pipeline-comercial" />
          </div>

          {/* Cuerpo principal: 3 columnas */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Columna 1: Mi trabajo de hoy */}
            <div className="kova-card p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--kova-navy)' }}>
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: '#EEF2FA' }}>
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--kova-blue)' }} />
                  </span>
                  Mi trabajo de hoy
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{todayWork.length} pendientes</span>
              </div>
              <div className="space-y-2 overflow-y-auto flex-1 pr-1 min-h-[220px]">
                {todayWork.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <CheckCircle2 className="w-10 h-10 text-slate-200 mb-2" />
                    <p className="text-sm text-slate-400">Todo al día. Sin pendientes.</p>
                  </div>
                ) : (
                  todayWork.map((item) => (
                    <div key={item.id} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors group">
                      <span className="w-1.5 h-8 rounded-full shrink-0" style={{ background: item.priority === 'HIGH' ? 'var(--kova-coral)' : item.priority === 'LOW' ? '#CBD5E1' : '#F59E0B' }} />
                      <div className="flex-1 min-w-0">
                        {item.processId ? (
                          <Link href={`/procesos/${item.processId}`} className="text-xs font-medium hover:underline block truncate" style={{ color: 'var(--kova-navy)' }}>
                            {item.title}
                          </Link>
                        ) : (
                          <p className="text-xs font-medium truncate" style={{ color: 'var(--kova-navy)' }}>{item.title}</p>
                        )}
                        <p className="text-[10px] text-slate-400 truncate">{item.type}{item.processTitle ? ` · ${item.processTitle}` : ''}</p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full shrink-0 ${priorityStyle[item.priority] ?? priorityStyle.MEDIUM}`}>
                        {item.priority === 'HIGH' ? 'Alta' : item.priority === 'LOW' ? 'Baja' : 'Media'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Columna 2: Mi día + Mis procesos */}
            <div className="flex flex-col gap-4">
              <div className="kova-card p-5">
                <h2 className="font-heading font-semibold text-sm mb-3" style={{ color: 'var(--kova-navy)' }}>Mi día</h2>
                <div className="grid grid-cols-3 gap-2.5">
                  {myDayItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/40 p-3 text-center transition-all group"
                    >
                      <p className="font-heading font-bold text-2xl leading-none" style={{ color: item.count > 0 ? 'var(--kova-blue)' : '#CBD5E1' }}>{item.count}</p>
                      <p className="text-[10px] text-slate-500 mt-1.5 truncate capitalize">{item.label}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="kova-card p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-heading font-semibold text-sm" style={{ color: 'var(--kova-navy)' }}>Mis procesos</h2>
                  <Link href="/procesos" className="text-[10px] inline-flex items-center gap-0.5 hover:underline" style={{ color: 'var(--kova-blue)' }}>
                    Ver todos <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-2 overflow-y-auto flex-1 pr-1 min-h-[120px]">
                  {processes.length === 0 ? (
                    <p className="text-sm text-slate-400 py-4 text-center">Sin procesos activos.</p>
                  ) : (
                    processes.map((p) => (
                      <Link key={p.id} href={`/procesos/${p.id}`} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors group">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: p.trafficLight === 'red' ? 'var(--kova-coral)' : p.trafficLight === 'yellow' ? '#F59E0B' : 'var(--kova-green)' }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: 'var(--kova-navy)' }}>{p.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{p.company} · {p.daysOpen}d · {p.candidates} cand.</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0" />
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Columna 3: Alertas + Embudos */}
            <div className="flex flex-col gap-4">
              {alerts.length > 0 && (
                <div className="kova-card p-5">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2.5">Alertas</h3>
                  <div className="space-y-2">
                    {alerts.map((a) => (
                      <div key={a.id} className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span className="leading-snug">{a.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="kova-card p-5 flex flex-col gap-5 flex-1">
                <CompactFunnel title="Embudo de reclutamiento" items={recruitmentFunnel} />
                <div className="border-t border-slate-100" />
                <CompactFunnel title="Embudo comercial" items={commercialFunnel} accent="#00B27A" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
