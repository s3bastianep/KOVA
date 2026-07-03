'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Building2, GitBranch, Users, Calendar, ClipboardCheck,
  AlertTriangle, Clock, TrendingUp, CheckCircle2, Plus, ArrowRight,
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
  HIGH: 'bg-red-50 text-red-700',
  MEDIUM: 'bg-amber-50 text-amber-700',
  LOW: 'bg-slate-50 text-slate-600',
};

function MiniKpi({ label, value, icon: Icon, accent, tone }: { label: string; value: number | string; icon: React.ElementType; accent?: string; tone?: string }) {
  return (
    <div className="kova-card px-3 py-2.5 flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: accent ?? '#EEF2FA' }}>
        <Icon className="w-4 h-4" style={{ color: tone ?? 'var(--kova-blue)' }} />
      </div>
      <div className="min-w-0">
        <p className="font-heading text-lg font-bold leading-none" style={{ color: 'var(--kova-navy)' }}>{value}</p>
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide truncate">{label}</p>
      </div>
    </div>
  );
}

function CompactFunnel({ title, items }: { title: string; items: FunnelItem[] }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">{title}</h3>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={item.stage} className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 w-20 shrink-0 truncate">{item.stage}</span>
            <div className="flex-1 h-3.5 rounded bg-slate-50 overflow-hidden">
              <div
                className="h-full rounded flex items-center justify-end pr-1.5"
                style={{
                  width: `${(item.count / max) * 100}%`,
                  background: `rgba(45, 91, 227, ${0.35 + 0.55 * (1 - i / items.length)})`,
                  minWidth: item.count > 0 ? '1.25rem' : 0,
                }}
              >
                {item.count > 0 && <span className="text-[9px] font-semibold text-white leading-none">{item.count}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
    { label: 'propuestas', count: myDay.proposals ?? 0, href: '/crm' },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold" style={{ color: 'var(--kova-navy)' }}>Dashboard</h1>
          <p className="text-xs text-slate-500">Tu centro operativo — solo lo que requiere acción hoy.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/calendario" className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-slate-200 hover:bg-white transition-colors" style={{ color: 'var(--kova-navy)' }}>
            <Calendar className="w-4 h-4" style={{ color: 'var(--kova-blue)' }} /> Calendario
          </Link>
          <Link href="/procesos/nuevo" className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg text-white transition-colors" style={{ background: 'var(--kova-blue)' }}>
            <Plus className="w-4 h-4" /> Nuevo proceso
          </Link>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : (
        <>
          {/* Fila de KPIs compactos */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5">
            <MiniKpi label="Clientes" value={kpis.activeClients ?? 0} icon={Building2} accent="#E6FAF3" tone="var(--kova-green)" />
            <MiniKpi label="Procesos" value={kpis.activeProcesses ?? kpis.activeVacancies ?? 0} icon={GitBranch} />
            <MiniKpi label="Candidatos" value={kpis.activeCandidates ?? kpis.candidatesCount ?? 0} icon={Users} />
            <MiniKpi label="Entrevistas" value={kpis.interviewsToday ?? kpis.interviewsScheduled ?? 0} icon={Calendar} />
            <MiniKpi label="Por revisar" value={kpis.pendingReviews ?? 0} icon={ClipboardCheck} accent="#FFF0EE" tone="var(--kova-coral)" />
            <MiniKpi label="Detenidos" value={kpis.stalledProcesses ?? 0} icon={AlertTriangle} accent="#FFF0EE" tone="var(--kova-coral)" />
            <MiniKpi label="Por vencer" value={kpis.dueSoon ?? 0} icon={Clock} accent="#FFF7E6" tone="#B7791F" />
            <MiniKpi label="Negocios" value={kpis.activeDeals ?? 0} icon={TrendingUp} accent="#E6FAF3" tone="var(--kova-green)" />
          </div>

          {/* Cuerpo principal: 3 columnas */}
          <div className="grid lg:grid-cols-3 gap-4 flex-1 min-h-0">
            {/* Columna 1: Mi trabajo de hoy */}
            <div className="kova-card p-4 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-heading font-semibold text-sm" style={{ color: 'var(--kova-navy)' }}>Mi trabajo de hoy</h2>
                <span className="text-[10px] text-slate-400">{todayWork.length} pendientes</span>
              </div>
              <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
                {todayWork.length === 0 ? (
                  <p className="text-sm text-slate-400">No hay pendientes para hoy.</p>
                ) : (
                  todayWork.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0" />
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
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ${priorityStyle[item.priority] ?? priorityStyle.MEDIUM}`}>
                        {item.priority === 'HIGH' ? 'Alta' : item.priority === 'LOW' ? 'Baja' : 'Media'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Columna 2: Mi día + Mis procesos */}
            <div className="flex flex-col gap-4 min-h-0">
              <div className="kova-card p-4">
                <h2 className="font-heading font-semibold text-sm mb-2" style={{ color: 'var(--kova-navy)' }}>Mi día</h2>
                <div className="grid grid-cols-3 gap-2">
                  {myDayItems.map((item) => (
                    <Link key={item.label} href={item.href} className="rounded-lg border border-slate-100 hover:bg-slate-50 p-2 text-center transition-colors">
                      <p className="font-heading font-bold text-lg leading-none" style={{ color: 'var(--kova-blue)' }}>{item.count}</p>
                      <p className="text-[10px] text-slate-500 mt-1 truncate">{item.label}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="kova-card p-4 flex flex-col min-h-0 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-heading font-semibold text-sm" style={{ color: 'var(--kova-navy)' }}>Mis procesos</h2>
                  <Link href="/procesos" className="text-[10px] inline-flex items-center gap-0.5 hover:underline" style={{ color: 'var(--kova-blue)' }}>
                    Ver todos <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
                  {processes.length === 0 ? (
                    <p className="text-sm text-slate-400">Sin procesos activos.</p>
                  ) : (
                    processes.map((p) => (
                      <Link key={p.id} href={`/procesos/${p.id}`} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                        <span className="text-sm shrink-0">{p.trafficLight === 'red' ? '🔴' : p.trafficLight === 'yellow' ? '🟡' : '🟢'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: 'var(--kova-navy)' }}>{p.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{p.company} · {p.daysOpen}d · {p.candidates} cand.</p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Columna 3: Alertas + Embudos */}
            <div className="flex flex-col gap-4 min-h-0">
              {alerts.length > 0 && (
                <div className="kova-card p-4">
                  <h3 className="text-[11px] font-semibold uppercase text-slate-400 mb-2">Alertas</h3>
                  <div className="space-y-1.5">
                    {alerts.map((a) => (
                      <div key={a.id} className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 text-xs text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span className="truncate">{a.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="kova-card p-4 flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto">
                <CompactFunnel title="Embudo de reclutamiento" items={recruitmentFunnel} />
                <CompactFunnel title="Embudo comercial" items={commercialFunnel} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
