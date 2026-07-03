'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Phone, Mail, Users, MessageSquare, TrendingUp, Building2,
  Handshake, FileText, Target, Trophy, XCircle, ArrowRight, Clock,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';

type Deal = {
  id: string;
  company: string;
  companyId?: string;
  stage: string;
  value?: string;
  contact?: string;
  next?: string;
  daysInStage?: number;
  date: string;
};

type CrmItem = { id: string; company: string; type: string; note: string; date: string; next?: string };

const STAGES = [
  { key: 'Prospecto', color: '#64748B', bg: '#F8FAFC', hint: 'Lead identificado', icon: Target },
  { key: 'Contacto', color: '#1A3FAA', bg: '#EEF2FA', hint: 'Primer acercamiento', icon: Phone },
  { key: 'Reunión', color: '#2D5BE3', bg: '#EEF2FA', hint: 'Discovery / demo', icon: Users },
  { key: 'Propuesta', color: '#7C3AED', bg: '#F3E8FF', hint: 'Propuesta enviada', icon: FileText },
  { key: 'Negociación', color: '#D97706', bg: '#FFF7E6', hint: 'Términos y cierre', icon: Handshake },
  { key: 'Ganado', color: '#00B27A', bg: '#E6FAF3', hint: 'Contrato firmado', icon: Trophy },
  { key: 'Perdido', color: '#FF3B30', bg: '#FFF0EE', hint: 'No avanzó', icon: XCircle },
] as const;

const DEALS: Deal[] = [
  { id: 'd1', company: 'Logística Express', stage: 'Prospecto', value: '$8M COP/mes', contact: 'Carlos Méndez', next: 'Primer contacto', daysInStage: 2, date: new Date().toISOString() },
  { id: 'd2', company: 'Distribuidora Andina', companyId: 'seed-company-002', stage: 'Contacto', value: '$12M COP/mes', contact: 'Laura Méndez', next: 'Agendar reunión Discovery', daysInStage: 5, date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'd3', company: 'TechSales Colombia SAS', companyId: 'seed-company-001', stage: 'Reunión', value: '$15M COP/mes', contact: 'Carlos Restrepo', next: 'Presentar propuesta', daysInStage: 3, date: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'd4', company: 'InnovaRetail', stage: 'Ganado', value: '$10M COP/mes', contact: 'Ana Torres', daysInStage: 30, date: new Date(Date.now() - 30 * 86400000).toISOString() },
];

const activityIcon: Record<string, React.ElementType> = {
  Llamada: Phone,
  Correo: Mail,
  Reunión: Users,
  WhatsApp: MessageSquare,
};

function formatRelative(dateStr: string) {
  const diff = Math.round((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  if (diff < 7) return `Hace ${diff} días`;
  return new Date(dateStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

export default function PipelineComercialPage() {
  const { data, isLoading } = useQuery({ queryKey: ['crm'], queryFn: dashboardApi.crm });
  const activities = (data as CrmItem[]) ?? [];

  const dealsByStage = useMemo(() => {
    const map: Record<string, Deal[]> = {};
    for (const s of STAGES) map[s.key] = [];
    for (const d of DEALS) map[d.stage]?.push(d);
    return map;
  }, []);

  const stats = useMemo(() => {
    const active = DEALS.filter((d) => !['Ganado', 'Perdido'].includes(d.stage));
    const won = DEALS.filter((d) => d.stage === 'Ganado');
    return {
      total: DEALS.length,
      active: active.length,
      won: won.length,
      inNegotiation: (dealsByStage['Negociación']?.length ?? 0) + (dealsByStage['Propuesta']?.length ?? 0),
    };
  }, [dealsByStage]);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-bold" style={{ color: 'var(--kova-navy)' }}>Pipeline Comercial</h1>
          <p className="text-xs text-slate-500">Prospectos → contacto → reunión → propuesta → cierre</p>
        </div>
        <div className="flex gap-2">
          {[
            { label: 'En pipeline', value: stats.active, color: 'var(--kova-blue)' },
            { label: 'Propuesta+', value: stats.inNegotiation, color: '#7C3AED' },
            { label: 'Ganados', value: stats.won, color: 'var(--kova-green)' },
          ].map((s) => (
            <div key={s.label} className="kova-card px-3 py-2 text-center min-w-[80px]">
              <p className="font-heading font-bold text-lg leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cuerpo: Kanban + Actividad */}
      <div className="grid lg:grid-cols-4 gap-4 flex-1 min-h-0">
        {/* Kanban — 3/4 del ancho */}
        <div className="lg:col-span-3 kova-card p-3 overflow-hidden flex flex-col min-h-0">
          <div className="flex gap-2 overflow-x-auto flex-1 min-h-0 pb-1">
            {STAGES.map((stage, idx) => {
              const deals = dealsByStage[stage.key] ?? [];
              const Icon = stage.icon;
              return (
                <div key={stage.key} className="flex-1 min-w-[130px] flex flex-col">
                  {/* Cabecera de columna */}
                  <div
                    className="rounded-t-lg px-2.5 py-2 mb-1.5"
                    style={{ background: stage.bg, borderTop: `3px solid ${stage.color}` }}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: stage.color }} />
                        <span className="text-xs font-semibold truncate" style={{ color: 'var(--kova-navy)' }}>{stage.key}</span>
                      </div>
                      <span
                        className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: stage.color, color: '#fff' }}
                      >
                        {deals.length}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5 truncate">{stage.hint}</p>
                  </div>

                  {/* Tarjetas */}
                  <div className="space-y-1.5 flex-1 overflow-y-auto px-0.5">
                    {deals.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-slate-200 p-3 text-center">
                        <p className="text-[10px] text-slate-300">Sin deals</p>
                      </div>
                    ) : (
                      deals.map((deal) => (
                        <DealCard key={deal.id} deal={deal} stageColor={stage.color} />
                      ))
                    )}
                  </div>

                  {idx < STAGES.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-200 absolute hidden" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actividad reciente — 1/4 del ancho */}
        <div className="kova-card p-4 flex flex-col min-h-0">
          <h2 className="font-heading font-semibold text-sm flex items-center gap-2 mb-3" style={{ color: 'var(--kova-navy)' }}>
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--kova-blue)' }} />
            Actividad reciente
          </h2>

          {isLoading ? (
            <p className="text-xs text-slate-400">Cargando...</p>
          ) : activities.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
              <MessageSquare className="w-8 h-8 text-slate-200 mb-2" />
              <p className="text-xs text-slate-400">Sin interacciones aún.</p>
              <p className="text-[10px] text-slate-300 mt-1">Las llamadas, correos y reuniones aparecerán aquí.</p>
            </div>
          ) : (
            <div className="space-y-0 overflow-y-auto flex-1 pr-1">
              {activities.map((it, i) => {
                const Icon = activityIcon[it.type] ?? MessageSquare;
                return (
                  <div key={it.id} className="relative pl-4 pb-4 last:pb-0">
                    {i < activities.length - 1 && (
                      <div className="absolute left-[7px] top-4 bottom-0 w-px bg-slate-100" />
                    )}
                    <div className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2 border-white flex items-center justify-center" style={{ background: '#EEF2FA' }}>
                      <Icon className="w-2 h-2" style={{ color: 'var(--kova-blue)' }} />
                    </div>
                    <div className="ml-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold truncate" style={{ color: 'var(--kova-navy)' }}>{it.company}</span>
                        <span className="text-[9px] text-slate-400 shrink-0">{formatRelative(it.date)}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full inline-block mt-0.5" style={{ background: '#EEF2FA', color: 'var(--kova-blue)' }}>
                        {it.type}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">{it.note}</p>
                      {it.next && (
                        <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: 'var(--kova-green)' }}>
                          <ArrowRight className="w-2.5 h-2.5" /> {it.next}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DealCard({ deal, stageColor }: { deal: Deal; stageColor: string }) {
  const content = (
    <div className="p-2.5 rounded-lg bg-white border border-slate-100 hover:shadow-sm hover:border-slate-200 transition-all cursor-pointer group">
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: `${stageColor}15` }}>
          <Building2 className="w-3.5 h-3.5" style={{ color: stageColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate group-hover:underline" style={{ color: 'var(--kova-navy)' }}>{deal.company}</p>
          {deal.contact && <p className="text-[10px] text-slate-400 truncate">{deal.contact}</p>}
        </div>
      </div>

      {deal.value && (
        <p className="text-[10px] font-medium mt-1.5" style={{ color: stageColor }}>{deal.value}</p>
      )}

      {deal.next && (
        <p className="text-[10px] mt-1.5 px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 truncate">
          → {deal.next}
        </p>
      )}

      {deal.daysInStage != null && (
        <p className="text-[9px] text-slate-300 mt-1 flex items-center gap-0.5">
          <Clock className="w-2.5 h-2.5" /> {deal.daysInStage}d en etapa
        </p>
      )}
    </div>
  );

  if (deal.companyId) {
    return <Link href={`/empresas/${deal.companyId}`}>{content}</Link>;
  }
  return content;
}
