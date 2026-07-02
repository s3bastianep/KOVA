'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { Briefcase, Building2, Users, Clock, Calendar, CheckSquare, TrendingUp } from 'lucide-react';

function KpiCard({ label, value, icon: Icon, accent }: { label: string; value: number | string; icon: React.ElementType; accent?: string }) {
  return (
    <div className="kova-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="font-heading text-3xl font-bold mt-2" style={{ color: 'var(--kova-navy)' }}>{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: accent ?? '#EEF2FA' }}>
          <Icon className="w-5 h-5" style={{ color: 'var(--kova-blue)' }} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.metrics });

  const kpis = (data?.kpis ?? {}) as Record<string, number>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Dashboard ejecutivo</h1>
        <p className="text-sm text-slate-500 mt-1">Resumen operativo de reclutamiento comercial</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando métricas...</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard label="Vacantes activas" value={kpis.activeVacancies ?? 0} icon={Briefcase} />
            <KpiCard label="Clientes activos" value={kpis.activeClients ?? 0} icon={Building2} accent="#E6FAF3" />
            <KpiCard label="Candidatos" value={kpis.candidatesCount ?? 0} icon={Users} />
            <KpiCard label="Contrataciones del mes" value={kpis.hiresThisMonth ?? 0} icon={TrendingUp} accent="#FFF0EE" />
            <KpiCard label="Entrevistas programadas" value={kpis.interviewsScheduled ?? 0} icon={Calendar} />
            <KpiCard label="Tareas pendientes" value={kpis.pendingTasks ?? 0} icon={CheckSquare} />
            <KpiCard label="Vacantes cerradas" value={kpis.closedVacancies ?? 0} icon={Clock} />
            <KpiCard label="Consultores activos" value={kpis.activeConsultants ?? 0} icon={Users} accent="#EEF2FA" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="kova-card p-6">
              <h2 className="font-heading font-semibold mb-4" style={{ color: 'var(--kova-navy)' }}>Pipeline por etapa</h2>
              <div className="space-y-3">
                {((data?.pipeline as { stage: string; _count: { stage: number } }[]) ?? []).map((item) => (
                  <div key={item.stage} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{item.stage.replace(/_/g, ' ')}</span>
                    <span className="font-semibold" style={{ color: 'var(--kova-navy)' }}>{item._count.stage}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="kova-card p-6">
              <h2 className="font-heading font-semibold mb-4" style={{ color: 'var(--kova-navy)' }}>Actividad reciente</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {((data?.recentActivity as { description: string; createdAt: string; user?: { firstName: string; lastName: string } }[]) ?? []).map((a, i) => (
                  <div key={i} className="text-sm border-b pb-3 last:border-0" style={{ borderColor: 'var(--kova-border)' }}>
                    <p className="text-slate-700">{a.description}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {a.user ? `${a.user.firstName} ${a.user.lastName} · ` : ''}{new Date(a.createdAt).toLocaleString('es-CO')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
