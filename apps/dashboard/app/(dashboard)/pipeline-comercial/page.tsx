'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  TrendingUp, Building2, ArrowRight, Clock, Check, Pause, ChevronRight,
  MessageSquare, Phone, Mail, Users,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import {
  CLIENT_JOURNEY_STAGES,
  getStageById,
  getStageIndex,
  nextStageId,
  type ClientJourneyRecord,
} from '@/lib/client-journey';

type CrmItem = { id: string; company: string; type: string; note: string; date: string; next?: string };

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
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [holdReason, setHoldReason] = useState('');
  const [showHoldModal, setShowHoldModal] = useState<string | null>(null);

  const { data: journeyData, isLoading } = useQuery({
    queryKey: ['client-journey'],
    queryFn: () => dashboardApi.clientJourney(),
  });
  const { data: crmData, isLoading: crmLoading } = useQuery({
    queryKey: ['crm'],
    queryFn: dashboardApi.crm,
  });

  const clients = (journeyData?.clients ?? []) as ClientJourneyRecord[];
  const activities = (crmData as CrmItem[]) ?? [];

  const clientsByStage = useMemo(() => {
    const map: Record<string, ClientJourneyRecord[]> = {};
    for (const s of CLIENT_JOURNEY_STAGES) map[s.id] = [];
    for (const c of clients) map[c.currentStageId]?.push(c);
    return map;
  }, [clients]);

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter((c) => c.currentStageId !== 'onboarding').length,
    inEvaluation: clients.filter((c) => ['evaluation', 'pre_interview', 'candidate_definition'].includes(c.currentStageId)).length,
    completed: clients.filter((c) => c.currentStageId === 'onboarding').length,
  }), [clients]);

  const mutation = useMutation({
    mutationFn: (payload: { companyId: string; action: 'advance' | 'hold'; reason?: string }) =>
      dashboardApi.updateClientJourney(payload.companyId, { action: payload.action, reason: payload.reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-journey'] });
      setShowHoldModal(null);
      setHoldReason('');
    },
  });

  const selected = clients.find((c) => c.companyId === selectedId) ?? clients[0] ?? null;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-bold" style={{ color: 'var(--kova-navy)' }}>Pipeline Comercial</h1>
          <p className="text-xs text-slate-500">
            8 etapas del servicio Kova — el asesor decide cuándo avanzar o mantener al cliente en cada paso.
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { label: 'Clientes activos', value: stats.active, color: 'var(--kova-blue)' },
            { label: 'En evaluación+', value: stats.inEvaluation, color: '#7C3AED' },
            { label: 'Onboarding', value: stats.completed, color: 'var(--kova-green)' },
          ].map((s) => (
            <div key={s.label} className="kova-card px-3 py-2 text-center min-w-[90px]">
              <p className="font-heading font-bold text-lg leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stepper global */}
      <div className="kova-card p-3 overflow-x-auto">
        <div className="flex items-start gap-1 min-w-[900px]">
          {CLIENT_JOURNEY_STAGES.map((stage, idx) => {
            const count = clientsByStage[stage.id]?.length ?? 0;
            return (
              <div key={stage.id} className="flex items-start flex-1 min-w-0">
                <div className="flex-1 text-center px-1">
                  <div
                    className="mx-auto w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white mb-1"
                    style={{ background: stage.color }}
                  >
                    {stage.order}
                  </div>
                  <p className="text-[9px] font-semibold leading-tight" style={{ color: 'var(--kova-navy)' }}>{stage.shortLabel}</p>
                  <span className="text-[9px] text-slate-400">{count} cliente{count !== 1 ? 's' : ''}</span>
                </div>
                {idx < CLIENT_JOURNEY_STAGES.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-300 mt-2 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4 flex-1 min-h-0">
        {/* Kanban por etapa */}
        <div className="lg:col-span-3 kova-card p-3 overflow-hidden flex flex-col min-h-[480px]">
          {isLoading ? (
            <p className="text-sm text-slate-400 p-4">Cargando clientes...</p>
          ) : (
            <div className="flex gap-2 overflow-x-auto flex-1 min-h-0 pb-1">
              {CLIENT_JOURNEY_STAGES.map((stage) => {
                const stageClients = clientsByStage[stage.id] ?? [];
                return (
                  <div key={stage.id} className="flex-1 min-w-[155px] flex flex-col">
                    <div
                      className="rounded-t-lg px-2 py-2 mb-1.5"
                      style={{ background: stage.bg, borderTop: `3px solid ${stage.color}` }}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white" style={{ background: stage.color }}>
                          {stage.order}
                        </span>
                        <span className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-white/80 text-slate-600">
                          {stageClients.length}
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold mt-1 leading-tight" style={{ color: 'var(--kova-navy)' }}>{stage.shortLabel}</p>
                    </div>
                    <div className="space-y-1.5 flex-1 overflow-y-auto px-0.5">
                      {stageClients.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-slate-200 p-2 text-center">
                          <p className="text-[9px] text-slate-300">Vacío</p>
                        </div>
                      ) : (
                        stageClients.map((client) => (
                          <ClientCard
                            key={client.companyId}
                            client={client}
                            stageColor={stage.color}
                            isSelected={selected?.companyId === client.companyId}
                            onSelect={() => setSelectedId(client.companyId)}
                            onAdvance={() => mutation.mutate({ companyId: client.companyId, action: 'advance' })}
                            onHold={() => setShowHoldModal(client.companyId)}
                            loading={mutation.isPending}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Panel lateral: detalle + actividad */}
        <div className="space-y-4 min-h-0 flex flex-col">
          {selected && (
            <ClientDetailPanel
              client={selected}
              onAdvance={() => mutation.mutate({ companyId: selected.companyId, action: 'advance' })}
              onHold={() => setShowHoldModal(selected.companyId)}
              loading={mutation.isPending}
            />
          )}

          <div className="kova-card p-4 flex flex-col flex-1 min-h-0">
            <h2 className="font-heading font-semibold text-sm flex items-center gap-2 mb-3" style={{ color: 'var(--kova-navy)' }}>
              <TrendingUp className="w-4 h-4" style={{ color: 'var(--kova-blue)' }} />
              Actividad reciente
            </h2>
            {crmLoading ? (
              <p className="text-xs text-slate-400">Cargando...</p>
            ) : activities.length === 0 ? (
              <p className="text-xs text-slate-400">Sin interacciones aún.</p>
            ) : (
              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {activities.slice(0, 6).map((it) => {
                  const Icon = activityIcon[it.type] ?? MessageSquare;
                  return (
                    <div key={it.id} className="flex gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: '#EEF2FA' }}>
                        <Icon className="w-3 h-3" style={{ color: 'var(--kova-blue)' }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: 'var(--kova-navy)' }}>{it.company}</p>
                        <p className="text-[10px] text-slate-500">{it.type} · {formatRelative(it.date)}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{it.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal no avanzar */}
      {showHoldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowHoldModal(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading font-semibold" style={{ color: 'var(--kova-navy)' }}>No avanzar de etapa</h3>
            <p className="text-sm text-slate-500">El cliente se mantiene en la etapa actual. Indica por qué no avanza.</p>
            <textarea
              value={holdReason}
              onChange={(e) => setHoldReason(e.target.value)}
              rows={3}
              placeholder="Ej: Falta completar discovery, cliente no ha confirmado perfil..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowHoldModal(null)} className="px-4 py-2 text-sm rounded-lg border border-slate-200">Cancelar</button>
              <button
                type="button"
                disabled={!holdReason.trim() || mutation.isPending}
                onClick={() => mutation.mutate({ companyId: showHoldModal, action: 'hold', reason: holdReason.trim() })}
                className="px-4 py-2 text-sm rounded-lg text-white disabled:opacity-50"
                style={{ background: '#D97706' }}
              >
                {mutation.isPending ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClientCard({
  client,
  stageColor,
  isSelected,
  onSelect,
  onAdvance,
  onHold,
  loading,
}: {
  client: ClientJourneyRecord;
  stageColor: string;
  isSelected: boolean;
  onSelect: () => void;
  onAdvance: () => void;
  onHold: () => void;
  loading: boolean;
}) {
  const next = nextStageId(client.currentStageId);
  const isFinal = !next;

  return (
    <div
      className={`rounded-lg border p-2.5 transition-all cursor-pointer ${isSelected ? 'border-[var(--kova-blue)] shadow-sm ring-1 ring-blue-100' : 'border-slate-100 bg-white hover:border-slate-200'}`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: `${stageColor}15` }}>
          <Building2 className="w-3.5 h-3.5" style={{ color: stageColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: 'var(--kova-navy)' }}>{client.companyName}</p>
          {client.contact && <p className="text-[10px] text-slate-400 truncate">{client.contact}</p>}
        </div>
      </div>
      {client.value && <p className="text-[10px] font-medium mt-1.5" style={{ color: stageColor }}>{client.value}</p>}
      <p className="text-[9px] text-slate-300 mt-1 flex items-center gap-0.5">
        <Clock className="w-2.5 h-2.5" /> {client.daysInStage}d en etapa
      </p>
      <div className="flex gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
        {!isFinal && (
          <button
            type="button"
            disabled={loading}
            onClick={onAdvance}
            className="flex-1 text-[9px] py-1 rounded border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50 flex items-center justify-center gap-0.5"
          >
            <Check className="w-2.5 h-2.5" /> Avanzar
          </button>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={onHold}
          className="flex-1 text-[9px] py-1 rounded border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 flex items-center justify-center gap-0.5"
        >
          <Pause className="w-2.5 h-2.5" /> No avanzar
        </button>
      </div>
    </div>
  );
}

function ClientDetailPanel({
  client,
  onAdvance,
  onHold,
  loading,
}: {
  client: ClientJourneyRecord;
  onAdvance: () => void;
  onHold: () => void;
  loading: boolean;
}) {
  const current = getStageById(client.currentStageId);
  const next = nextStageId(client.currentStageId);
  const nextStage = next ? getStageById(next) : null;
  const currentIdx = getStageIndex(client.currentStageId);

  return (
    <div className="kova-card p-4 space-y-4">
      <div>
        <Link href={`/empresas/${client.companyId}`} className="font-heading font-semibold hover:underline" style={{ color: 'var(--kova-navy)' }}>
          {client.companyName}
        </Link>
        {client.contact && <p className="text-xs text-slate-500 mt-0.5">{client.contact}{client.city ? ` · ${client.city}` : ''}</p>}
      </div>

      {/* Stepper del cliente */}
      <div className="space-y-1">
        <p className="text-[10px] font-semibold uppercase text-slate-400">Progreso del servicio</p>
        <div className="grid grid-cols-4 gap-1">
          {CLIENT_JOURNEY_STAGES.map((stage, idx) => {
            const done = idx < currentIdx;
            const active = idx === currentIdx;
            return (
              <div
                key={stage.id}
                title={stage.label}
                className={`rounded px-1 py-1.5 text-center border ${active ? 'border-[var(--kova-blue)] bg-blue-50' : done ? 'border-green-200 bg-green-50' : 'border-slate-100 bg-slate-50'}`}
              >
                <p className="text-[8px] font-bold" style={{ color: active ? 'var(--kova-blue)' : done ? 'var(--kova-green)' : '#94A3B8' }}>
                  {stage.order}
                </p>
                <p className="text-[7px] leading-tight mt-0.5 truncate" style={{ color: active ? 'var(--kova-navy)' : '#94A3B8' }}>{stage.shortLabel}</p>
              </div>
            );
          })}
        </div>
      </div>

      {current && (
        <div className="rounded-lg p-3" style={{ background: current.bg }}>
          <p className="text-xs font-semibold" style={{ color: current.color }}>Etapa {current.order}: {current.label}</p>
          <p className="text-[11px] text-slate-600 mt-1">{current.description}</p>
          <p className="text-[10px] text-slate-400 mt-2">{client.daysInStage} días en esta etapa</p>
        </div>
      )}

      <div className="flex gap-2">
        {nextStage && (
          <button
            type="button"
            disabled={loading}
            onClick={onAdvance}
            className="flex-1 text-xs py-2 rounded-lg text-white disabled:opacity-50 flex items-center justify-center gap-1"
            style={{ background: 'var(--kova-green)' }}
          >
            <Check className="w-3.5 h-3.5" />
            Avanzar a {nextStage.shortLabel}
          </button>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={onHold}
          className="flex-1 text-xs py-2 rounded-lg border border-amber-200 text-amber-700 bg-amber-50 disabled:opacity-50 flex items-center justify-center gap-1"
        >
          <Pause className="w-3.5 h-3.5" />
          No avanzar
        </button>
      </div>

      {client.history.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase text-slate-400 mb-2">Historial</p>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {[...client.history].reverse().slice(0, 5).map((h, i) => {
              const stage = getStageById(h.stageId);
              return (
                <div key={i} className="text-[10px] text-slate-600 flex gap-1.5">
                  {h.action === 'advance' ? (
                    <ArrowRight className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                  ) : h.action === 'hold' ? (
                    <Pause className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <Check className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                  )}
                  <span>
                    <strong>{stage?.shortLabel}</strong>
                    {h.action === 'hold' && ' — no avanzó'}
                    {h.reason && `: ${h.reason}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
