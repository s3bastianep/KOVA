'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Building2, GitBranch, Users, Calendar, ClipboardCheck,
  AlertTriangle, Clock, TrendingUp, ChevronRight, CheckCircle2,
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

type FunnelItem = { stage: string; count: number };

function KpiCard({ label, value, icon: Icon, accent }: { label: string; value: number | string; icon: React.ElementType; accent?: string }) {
  return (
    <div className="kova-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="font-heading text-2xl font-bold mt-1" style={{ color: 'var(--kova-navy)' }}>{value}</p>
        </div>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: accent ?? '#EEF2FA' }}>
          <Icon className="w-4 h-4" style={{ color: 'var(--kova-blue)' }} />
        </div>
      </div>
    </div>
  );
}

function FunnelChart({ title, items }: { title: string; items: FunnelItem[] }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div className="kova-card p-5">
      <h2 className="font-heading font-semibold text-sm mb-4" style={{ color: 'var(--kova-navy)' }}>{title}</h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.stage} className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-24 shrink-0 truncate">{item.stage}</span>
            <div className="flex-1 h-6 rounded bg-slate-50 overflow-hidden relative">
              <div
                className="h-full rounded transition-all flex items-center justify-end pr-2"
                style={{
                  width: `${(item.count / max) * 100}%`,
                  background: `rgba(59, 130, 246, ${0.3 + (0.7 * (1 - i / items.length))})`,
                  minWidth: item.count > 0 ? '2rem' : 0,
                }}
              >
                {item.count > 0 && <span className="text-xs font-semibold text-white">{item.count}</span>}
              </div>
            </div>
            {i < items.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300 shrink-0 rotate-90 sm:rotate-0 hidden sm:block" />}
          </div>
        ))}
      </div>
    </div>
  );
}

const priorityStyle: Record<string, string> = {
  HIGH: 'bg-red-50 text-red-700',
  MEDIUM: 'bg-amber-50 text-amber-700',
  LOW: 'bg-slate-50 text-slate-600',
};

export default function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.metrics });
  const kpis = (data?.kpis ?? {}) as Record<string, number>;
  const todayWork = (data?.todayWork ?? []) as TodayItem[];
  const recruitmentFunnel = (data?.recruitmentFunnel ?? []) as FunnelItem[];
  const commercialFunnel = (data?.commercialFunnel ?? []) as FunnelItem[];
  const alerts = (data?.alerts ?? []) as { id: string; title: string; status: string }[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Tu centro operativo — solo lo que requiere acción hoy.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard label="Clientes activos" value={kpis.activeClients ?? 0} icon={Building2} accent="#E6FAF3" />
            <KpiCard label="Procesos abiertos" value={kpis.activeProcesses ?? kpis.activeVacancies ?? 0} icon={GitBranch} />
            <KpiCard label="Candidatos activos" value={kpis.activeCandidates ?? kpis.candidatesCount ?? 0} icon={Users} />
            <KpiCard label="Entrevistas hoy" value={kpis.interviewsToday ?? kpis.interviewsScheduled ?? 0} icon={Calendar} />
            <KpiCard label="Pruebas por revisar" value={kpis.pendingReviews ?? 0} icon={ClipboardCheck} accent="#FFF0EE" />
            <KpiCard label="Procesos detenidos" value={kpis.stalledProcesses ?? 0} icon={AlertTriangle} accent="#FFF0EE" />
            <KpiCard label="Próximos a vencer" value={kpis.dueSoon ?? 0} icon={Clock} accent="#FFF7E6" />
            <KpiCard label="Negocios activos" value={kpis.activeDeals ?? 0} icon={TrendingUp} accent="#E6FAF3" />
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 kova-card p-6">
              <h2 className="font-heading font-semibold mb-1" style={{ color: 'var(--kova-navy)' }}>Mi trabajo de hoy</h2>
              <p className="text-xs text-slate-400 mb-4">Ordenado por prioridad — el sistema te dice qué hacer.</p>
              <div className="space-y-2">
                {todayWork.length === 0 ? (
                  <p className="text-sm text-slate-400">No hay pendientes para hoy.</p>
                ) : (
                  todayWork.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0" />
                      <div className="flex-1 min-w-0">
                        {item.processId ? (
                          <Link href={`/procesos/${item.processId}`} className="text-sm font-medium hover:underline" style={{ color: 'var(--kova-navy)' }}>
                            {item.title}
                          </Link>
                        ) : (
                          <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{item.title}</p>
                        )}
                        <p className="text-xs text-slate-400">{item.type}{item.processTitle ? ` · ${item.processTitle}` : ''}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${priorityStyle[item.priority] ?? priorityStyle.MEDIUM}`}>
                        {item.priority === 'HIGH' ? 'Alta' : item.priority === 'LOW' ? 'Baja' : 'Media'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {alerts.length > 0 && (
                <div className="kova-card p-5">
                  <h3 className="text-xs font-semibold uppercase text-slate-400 mb-3">Alertas</h3>
                  <div className="space-y-2">
                    {alerts.map((a) => (
                      <div key={a.id} className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 text-sm text-amber-800">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        {a.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Link href="/calendario" className="kova-card p-5 block hover:shadow-md transition-shadow">
                <Calendar className="w-5 h-5 mb-2" style={{ color: 'var(--kova-blue)' }} />
                <p className="font-medium text-sm" style={{ color: 'var(--kova-navy)' }}>Ver calendario</p>
                <p className="text-xs text-slate-400 mt-1">Entrevistas, llamadas y seguimientos</p>
              </Link>
              <Link href="/procesos/nuevo" className="kova-card p-5 block hover:shadow-md transition-shadow border-2 border-dashed border-slate-200">
                <GitBranch className="w-5 h-5 mb-2" style={{ color: 'var(--kova-blue)' }} />
                <p className="font-medium text-sm" style={{ color: 'var(--kova-navy)' }}>Nuevo proceso</p>
                <p className="text-xs text-slate-400 mt-1">Asistente paso a paso</p>
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <FunnelChart title="Embudo de reclutamiento" items={recruitmentFunnel} />
            <FunnelChart title="Embudo comercial" items={commercialFunnel} />
          </div>
        </>
      )}
    </div>
  );
}
