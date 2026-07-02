'use client';

import { useQuery } from '@tanstack/react-query';
import { Phone, Mail, Users, MessageSquare, TrendingUp } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

type Deal = { id: string; company: string; stage: string; value?: string; next?: string; date: string };

const COMMERCIAL_STAGES = ['Prospecto', 'Contacto', 'Reunión', 'Propuesta', 'Negociación', 'Ganado', 'Perdido'];

const stageIcon: Record<string, React.ElementType> = {
  Contacto: Phone,
  Correo: Mail,
  Reunión: Users,
  WhatsApp: MessageSquare,
};

export default function PipelineComercialPage() {
  const { data, isLoading } = useQuery({ queryKey: ['crm'], queryFn: dashboardApi.crm });
  const items = (data as { id: string; company: string; type: string; note: string; date: string; next?: string }[]) ?? [];

  const dealsByStage: Record<string, Deal[]> = {
    Prospecto: [{ id: 'd1', company: 'Logística Express', stage: 'Prospecto', date: new Date().toISOString(), next: 'Primer contacto' }],
    Contacto: [{ id: 'd2', company: 'Distribuidora Andina', stage: 'Contacto', date: new Date(Date.now() - 86400000).toISOString(), next: 'Agendar reunión' }],
    Reunión: [{ id: 'd3', company: 'TechSales Colombia SAS', stage: 'Reunión', date: new Date(Date.now() - 2 * 86400000).toISOString(), next: 'Presentar propuesta' }],
    Propuesta: [],
    Negociación: [],
    Ganado: [{ id: 'd4', company: 'InnovaRetail', stage: 'Ganado', date: new Date(Date.now() - 30 * 86400000).toISOString() }],
    Perdido: [],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Pipeline Comercial</h1>
        <p className="text-sm text-slate-500">Prospectos, reuniones, propuestas y negociaciones con clientes.</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {COMMERCIAL_STAGES.map((stage) => (
          <div key={stage} className="shrink-0 w-48">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>{stage}</h3>
              <span className="text-xs text-slate-400">{(dealsByStage[stage] ?? []).length}</span>
            </div>
            <div className="space-y-2 min-h-[100px] p-2 rounded-lg bg-slate-50">
              {(dealsByStage[stage] ?? []).map((deal) => (
                <div key={deal.id} className="p-3 rounded-lg bg-white border border-slate-100">
                  <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{deal.company}</p>
                  {deal.next && <p className="text-xs text-slate-400 mt-1">{deal.next}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="kova-card p-6">
        <h2 className="font-heading font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--kova-navy)' }}>
          <TrendingUp className="w-5 h-5" /> Actividad comercial reciente
        </h2>
        {isLoading ? (
          <p className="text-sm text-slate-500">Cargando...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-400">No hay interacciones registradas.</p>
        ) : (
          <div className="space-y-3">
            {items.map((it) => {
              const Icon = stageIcon[it.type] ?? MessageSquare;
              return (
                <div key={it.id} className="flex gap-4 p-3 rounded-lg border border-slate-100">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#EEF2FA' }}>
                    <Icon className="w-4 h-4" style={{ color: 'var(--kova-blue)' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--kova-navy)' }}>{it.company}</h3>
                      <span className="text-xs text-slate-400">{new Date(it.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{it.note}</p>
                    {it.next && <p className="text-xs mt-1" style={{ color: 'var(--kova-blue)' }}>Próximo: {it.next}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
