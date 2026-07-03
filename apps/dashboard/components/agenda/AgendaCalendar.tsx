'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Clock,
  History,
  GripVertical,
  AlertCircle,
  Mail,
  Phone,
  Building2,
  User,
  CalendarClock,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import {
  type AgendaItem,
  type AgendaStatus,
  agendaTypeStyle,
  AGENDA_STATUS_LABELS,
  AGENDA_TYPE_STYLES,
  buildMonthGrid,
  dateKey,
  formatAgendaTime,
  monthKey,
  sameDay,
} from '@/lib/agenda';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function toLocalDatetimeInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type AgendaRequest = {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  companyName: string;
  type: string;
  scheduledAt: string;
  endAt?: string;
  purpose?: string;
  status: string;
  moveHistory: { fromDate: string; toDate: string; reason: string }[];
};

type ModalMode =
  | { type: 'detail'; item: AgendaItem }
  | { type: 'reason'; item: AgendaItem; action: 'cancel' | 'reschedule'; targetDate?: string }
  | { type: 'request'; request: AgendaRequest; action: 'reject' | 'reschedule' }
  | null;

export function AgendaCalendar() {
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [modal, setModal] = useState<ModalMode>(null);
  const [dragItem, setDragItem] = useState<AgendaItem | null>(null);
  const [reasonText, setReasonText] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const queryClient = useQueryClient();

  const monthStr = monthKey(cursor.year, cursor.month);

  const { data, isLoading } = useQuery({
    queryKey: ['agenda', monthStr],
    queryFn: () => dashboardApi.agenda(monthStr),
  });

  const { data: pendingData } = useQuery({
    queryKey: ['solicitudes', 'REQUESTED'],
    queryFn: () => dashboardApi.solicitudes('REQUESTED'),
  });

  const items = (data?.items ?? []) as AgendaItem[];
  const pendingRequests = (pendingData?.requests ?? []) as AgendaRequest[];

  const byDay = useMemo(() => {
    const map = new Map<string, AgendaItem[]>();
    for (const item of items) {
      const key = dateKey(new Date(item.date));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, [items]);

  const grid = useMemo(() => buildMonthGrid(cursor.year, cursor.month), [cursor]);

  const mutation = useMutation({
    mutationFn: (payload: {
      itemKey: string;
      body:
        | { action: 'status'; status: AgendaStatus; reason?: string }
        | { action: 'reschedule'; newDate: string; reason: string };
    }) => dashboardApi.updateAgendaItem(payload.itemKey, payload.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
      setModal(null);
      setReasonText('');
    },
  });

  const solicitudMutation = useMutation({
    mutationFn: (payload: {
      id: string;
      body:
        | { action: 'accept'; reason?: string }
        | { action: 'reject'; reason: string }
        | { action: 'reschedule'; newDate: string; reason: string };
    }) => dashboardApi.updateSolicitud(payload.id, payload.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
      setModal(null);
      setReasonText('');
      setRescheduleDate('');
    },
  });

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString('es-CO', {
    month: 'long',
    year: 'numeric',
  });

  const goToday = () => setCursor({ year: today.getFullYear(), month: today.getMonth() });

  const handleDrop = (day: Date) => {
    if (!dragItem) return;
    if (sameDay(day, new Date(dragItem.date))) {
      setDragItem(null);
      return;
    }
    const target = new Date(day);
    const original = new Date(dragItem.date);
    target.setHours(original.getHours(), original.getMinutes(), 0, 0);
    setModal({ type: 'reason', item: dragItem, action: 'reschedule', targetDate: target.toISOString() });
    setDragItem(null);
  };

  const submitReason = () => {
    if (!modal || modal.type !== 'reason') return;
    if (!reasonText.trim()) return;

    if (modal.action === 'cancel') {
      mutation.mutate({
        itemKey: modal.item.itemKey,
        body: { action: 'status', status: 'CANCELLED', reason: reasonText.trim() },
      });
      return;
    }

    if (modal.action === 'reschedule' && modal.targetDate) {
      mutation.mutate({
        itemKey: modal.item.itemKey,
        body: { action: 'reschedule', newDate: modal.targetDate, reason: reasonText.trim() },
      });
    }
  };

  const submitRequestAction = () => {
    if (!modal || modal.type !== 'request') return;

    if (modal.action === 'reject') {
      if (!reasonText.trim()) return;
      solicitudMutation.mutate({
        id: modal.request.id,
        body: { action: 'reject', reason: reasonText.trim() },
      });
      return;
    }

    if (modal.action === 'reschedule') {
      if (!rescheduleDate || !reasonText.trim()) return;
      solicitudMutation.mutate({
        id: modal.request.id,
        body: { action: 'reschedule', newDate: new Date(rescheduleDate).toISOString(), reason: reasonText.trim() },
      });
    }
  };

  const acceptRequest = (request: AgendaRequest) => {
    solicitudMutation.mutate({ id: request.id, body: { action: 'accept' } });
  };

  const setStatus = (item: AgendaItem, status: AgendaStatus) => {
    if (status === 'CANCELLED') {
      setModal({ type: 'reason', item, action: 'cancel' });
      setReasonText('');
      return;
    }
    mutation.mutate({ itemKey: item.itemKey, body: { action: 'status', status } });
  };

  return (
    <div className="space-y-4">
      {/* Solicitudes pendientes */}
      <div className="kova-card p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>Solicitudes pendientes</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Citas solicitadas desde la página pública. Acepta para agendar, rechaza con motivo o reprograma si el horario no sirve.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 shrink-0">
            {pendingRequests.length} pendiente{pendingRequests.length !== 1 ? 's' : ''}
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No hay solicitudes por revisar.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="rounded-lg border border-slate-200 p-3 space-y-2 bg-slate-50/50">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{req.requesterName}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3" /> {req.companyName}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Por revisar
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" /> {req.requesterEmail}</p>
                  <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" /> {req.requesterPhone}</p>
                  <p className="flex items-center gap-1.5">
                    <CalendarClock className="w-3 h-3 text-slate-400" />
                    {new Date(req.scheduledAt).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })}
                    {' · '}
                    {formatAgendaTime(req.scheduledAt)}
                  </p>
                </div>
                {req.moveHistory.length > 0 && (
                  <p className="text-[10px] text-amber-700">Reprogramada {req.moveHistory.length} vez</p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    disabled={solicitudMutation.isPending}
                    onClick={() => acceptRequest(req)}
                    className="text-xs px-2.5 py-1.5 rounded-lg text-white disabled:opacity-50"
                    style={{ background: 'var(--kova-green)' }}
                  >
                    Aceptar
                  </button>
                  <button
                    type="button"
                    disabled={solicitudMutation.isPending}
                    onClick={() => {
                      setModal({ type: 'request', request: req, action: 'reschedule' });
                      setRescheduleDate(toLocalDatetimeInput(req.scheduledAt));
                      setReasonText('');
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    Reprogramar
                  </button>
                  <button
                    type="button"
                    disabled={solicitudMutation.isPending}
                    onClick={() => {
                      setModal({ type: 'request', request: req, action: 'reject' });
                      setReasonText('');
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 bg-white"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setCursor((c) => {
                const d = new Date(c.year, c.month - 1, 1);
                return { year: d.getFullYear(), month: d.getMonth() };
              })
            }
            className="p-2 rounded-lg border border-slate-200 hover:bg-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="font-heading text-lg font-semibold capitalize min-w-[180px] text-center" style={{ color: 'var(--kova-navy)' }}>
            {monthLabel}
          </h2>
          <button
            type="button"
            onClick={() =>
              setCursor((c) => {
                const d = new Date(c.year, c.month + 1, 1);
                return { year: d.getFullYear(), month: d.getMonth() };
              })
            }
            className="p-2 rounded-lg border border-slate-200 hover:bg-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button type="button" onClick={goToday} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white ml-1">
            Hoy
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(AGENDA_TYPE_STYLES).slice(0, 6).map(([type, style]) => (
            <span key={type} className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="w-2 h-2 rounded-full" style={{ background: style.dot }} />
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Calendario */}
      <div className="kova-card overflow-hidden">
        <div className="grid grid-cols-7 border-b" style={{ borderColor: 'var(--kova-border)' }}>
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
              {d}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-sm text-slate-400">Cargando agenda...</div>
        ) : (
          <div className="grid grid-cols-7 auto-rows-fr min-h-[520px] lg:min-h-[640px]">
            {grid.map(({ date, inMonth }) => {
              const key = dateKey(date);
              const dayItems = byDay.get(key) ?? [];
              const isToday = sameDay(date, today);

              return (
                <div
                  key={key}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('bg-blue-50/60');
                  }}
                  onDragLeave={(e) => e.currentTarget.classList.remove('bg-blue-50/60')}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('bg-blue-50/60');
                    handleDrop(date);
                  }}
                  className={`border-r border-b min-h-[88px] lg:min-h-[108px] p-1.5 transition-colors ${inMonth ? 'bg-white' : 'bg-slate-50/80'}`}
                  style={{ borderColor: 'var(--kova-border)' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday ? 'text-white' : inMonth ? 'text-slate-700' : 'text-slate-300'
                      }`}
                      style={isToday ? { background: 'var(--kova-blue)' } : undefined}
                    >
                      {date.getDate()}
                    </span>
                    {dayItems.length > 0 && (
                      <span className="text-[9px] text-slate-400">{dayItems.length}</span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    {dayItems.slice(0, 4).map((item) => (
                      <ActivityChip
                        key={item.itemKey}
                        item={item}
                        onDragStart={() => setDragItem(item)}
                        onClick={() => setModal({ type: 'detail', item })}
                      />
                    ))}
                    {dayItems.length > 4 && (
                      <button
                        type="button"
                        className="text-[9px] text-slate-400 pl-1 hover:text-slate-600"
                        onClick={() => setModal({ type: 'detail', item: dayItems[4] })}
                      >
                        +{dayItems.length - 4} más
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal detalle / motivo */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => !mutation.isPending && setModal(null)}>
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {modal.type === 'detail' && (
              <DetailPanel
                item={modal.item}
                loading={mutation.isPending}
                onClose={() => setModal(null)}
                onStatus={setStatus}
              />
            )}
            {modal.type === 'reason' && (
              <ReasonPanel
                item={modal.item}
                action={modal.action}
                targetDate={modal.targetDate}
                reason={reasonText}
                loading={mutation.isPending}
                error={mutation.error instanceof Error ? mutation.error.message : ''}
                onReasonChange={setReasonText}
                onSubmit={submitReason}
                onClose={() => setModal(null)}
              />
            )}
            {modal.type === 'request' && (
              <RequestActionPanel
                request={modal.request}
                action={modal.action}
                reason={reasonText}
                rescheduleDate={rescheduleDate}
                loading={solicitudMutation.isPending}
                error={solicitudMutation.error instanceof Error ? solicitudMutation.error.message : ''}
                onReasonChange={setReasonText}
                onRescheduleDateChange={setRescheduleDate}
                onSubmit={submitRequestAction}
                onClose={() => setModal(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityChip({
  item,
  onClick,
  onDragStart,
}: {
  item: AgendaItem;
  onClick: () => void;
  onDragStart: () => void;
}) {
  const style = agendaTypeStyle(item.type);
  const dim = item.status !== 'PENDING';
  const rejected = item.status === 'REJECTED';

  return (
    <button
      type="button"
      draggable={!rejected}
      onDragStart={(e) => {
        if (rejected) return;
        e.dataTransfer.effectAllowed = 'move';
        onDragStart();
      }}
      onClick={onClick}
      className={`w-full text-left text-[10px] leading-tight px-1.5 py-1 rounded truncate flex items-center gap-0.5 border-l-2 ${dim ? 'opacity-70' : ''}`}
      style={{
        background: rejected ? '#FEF2F2' : style.bg,
        borderLeftColor: rejected ? '#DC2626' : style.border,
        color: rejected ? '#DC2626' : style.text,
        textDecoration: item.status === 'CANCELLED' || rejected ? 'line-through' : undefined,
      }}
      title={item.title}
    >
      {item.status === 'COMPLETED' && <Check className="w-2.5 h-2.5 shrink-0" />}
      {rejected && <X className="w-2.5 h-2.5 shrink-0" />}
      {item.moveCount > 0 && <History className="w-2.5 h-2.5 shrink-0 opacity-70" />}
      <span className="truncate">{formatAgendaTime(item.date)} {item.title}</span>
    </button>
  );
}

function DetailPanel({
  item,
  loading,
  onClose,
  onStatus,
}: {
  item: AgendaItem;
  loading: boolean;
  onClose: () => void;
  onStatus: (item: AgendaItem, status: AgendaStatus) => void;
}) {
  const style = agendaTypeStyle(item.type);
  const d = new Date(item.date);

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: style.bg, color: style.text }}>
            {item.type}
          </span>
          <h3 className="font-heading font-semibold text-lg mt-2" style={{ color: 'var(--kova-navy)' }}>
            {item.title}
          </h3>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
            <Clock className="w-3.5 h-3.5" />
            {d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
            {' · '}
            {formatAgendaTime(item.date)}
            {item.endDate && ` – ${formatAgendaTime(item.endDate)}`}
          </p>
        </div>
        <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      {(item.companyName || item.vacancyTitle || item.contactName) && (
        <div className="text-sm text-slate-600 space-y-1">
          {item.contactName && (
            <p className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> {item.contactName}</p>
          )}
          {item.companyName && (
            <p className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" /> {item.companyName}{item.vacancyTitle ? ` · ${item.vacancyTitle}` : ''}</p>
          )}
        </div>
      )}

      {item.notes && (
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Contacto</p>
          <p className="text-sm text-slate-600">{item.notes}</p>
        </div>
      )}

      {item.purpose && (
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Objetivo</p>
          <p className="text-sm text-slate-600">{item.purpose}</p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Estado:</span>
        <span className="text-xs font-semibold" style={{ color: 'var(--kova-navy)' }}>
          {AGENDA_STATUS_LABELS[item.status]}
        </span>
        {item.statusReason && (
          <span className="text-xs text-slate-400">— {item.statusReason}</span>
        )}
      </div>

      {item.moveCount > 0 && (
        <div className="rounded-lg p-3 space-y-2" style={{ background: '#FFF7E6' }}>
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#B45309' }}>
            <AlertCircle className="w-4 h-4" />
            Reprogramada {item.moveCount} {item.moveCount === 1 ? 'vez' : 'veces'}
          </div>
          <div className="space-y-2 max-h-36 overflow-y-auto">
            {[...item.moveHistory].reverse().map((m, i) => (
              <div key={i} className="text-xs text-slate-600 border-l-2 pl-2" style={{ borderColor: '#F59E0B' }}>
                <p>
                  {new Date(m.fromDate).toLocaleDateString('es-CO')} →{' '}
                  {new Date(m.toDate).toLocaleDateString('es-CO')}
                </p>
                <p className="text-slate-400 italic">&quot;{m.reason}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-400 flex items-center gap-1">
        <GripVertical className="w-3 h-3" />
        Arrastra la actividad a otro día para reprogramarla (nunca se elimina).
      </p>

      <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: 'var(--kova-border)' }}>
        <button
          type="button"
          disabled={loading || item.status === 'COMPLETED'}
          onClick={() => onStatus(item, 'COMPLETED')}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg text-white disabled:opacity-40"
          style={{ background: 'var(--kova-green)' }}
        >
          <Check className="w-3.5 h-3.5" /> Completada
        </button>
        <button
          type="button"
          disabled={loading || item.status === 'PENDING'}
          onClick={() => onStatus(item, 'PENDING')}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-40"
        >
          <Clock className="w-3.5 h-3.5" /> Pendiente
        </button>
        <button
          type="button"
          disabled={loading || item.status === 'CANCELLED'}
          onClick={() => onStatus(item, 'CANCELLED')}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-red-200 text-red-600 disabled:opacity-40"
        >
          <X className="w-3.5 h-3.5" /> Cancelada
        </button>
      </div>
    </div>
  );
}

function RequestActionPanel({
  request,
  action,
  reason,
  rescheduleDate,
  loading,
  error,
  onReasonChange,
  onRescheduleDateChange,
  onSubmit,
  onClose,
}: {
  request: AgendaRequest;
  action: 'reject' | 'reschedule';
  reason: string;
  rescheduleDate: string;
  loading: boolean;
  error: string;
  onReasonChange: (v: string) => void;
  onRescheduleDateChange: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const title = action === 'reject' ? 'Rechazar solicitud' : 'Reprogramar solicitud';

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading font-semibold" style={{ color: 'var(--kova-navy)' }}>{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{request.requesterName} · {request.companyName}</p>
        </div>
        <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
        <p><strong>Correo:</strong> {request.requesterEmail}</p>
        <p><strong>Teléfono:</strong> {request.requesterPhone}</p>
        <p><strong>Fecha solicitada:</strong> {new Date(request.scheduledAt).toLocaleString('es-CO')}</p>
      </div>

      {action === 'reschedule' && (
        <div>
          <label className="text-xs font-semibold uppercase text-slate-400">Nueva fecha y hora</label>
          <input
            type="datetime-local"
            value={rescheduleDate}
            onChange={(e) => onRescheduleDateChange(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
          />
        </div>
      )}

      <div>
        <label className="text-xs font-semibold uppercase text-slate-400">
          {action === 'reject' ? 'Motivo del rechazo' : 'Motivo del cambio'}
        </label>
        <textarea
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          rows={3}
          placeholder={action === 'reject' ? 'Ej: No tenemos disponibilidad en ese horario...' : 'Ej: Ese día tenemos agenda llena, proponemos otro horario...'}
          className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-100"
          autoFocus
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} disabled={loading} className="text-sm px-4 py-2 rounded-lg border border-slate-200">
          Volver
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !reason.trim() || (action === 'reschedule' && !rescheduleDate)}
          className="text-sm px-4 py-2 rounded-lg text-white disabled:opacity-50"
          style={{ background: action === 'reject' ? '#DC2626' : 'var(--kova-blue)' }}
        >
          {loading ? 'Guardando...' : 'Confirmar'}
        </button>
      </div>
    </div>
  );
}

function ReasonPanel({
  item,
  action,
  targetDate,
  reason,
  loading,
  error,
  onReasonChange,
  onSubmit,
  onClose,
}: {
  item: AgendaItem;
  action: 'cancel' | 'reschedule';
  targetDate?: string;
  reason: string;
  loading: boolean;
  error: string;
  onReasonChange: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const title = action === 'cancel' ? 'Cancelar actividad' : 'Reprogramar actividad';
  const subtitle =
    action === 'reschedule' && targetDate
      ? `Nueva fecha: ${new Date(targetDate).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}`
      : item.title;

  return (
    <div className="p-5 space-y-4">
      <div>
        <h3 className="font-heading font-semibold" style={{ color: 'var(--kova-navy)' }}>{title}</h3>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase text-slate-400">¿Por qué?</label>
        <textarea
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          rows={3}
          placeholder="Ej: Cliente no disponible, conflicto de agenda..."
          className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-100"
          autoFocus
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} disabled={loading} className="text-sm px-4 py-2 rounded-lg border border-slate-200">
          Volver
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !reason.trim()}
          className="text-sm px-4 py-2 rounded-lg text-white disabled:opacity-50"
          style={{ background: 'var(--kova-blue)' }}
        >
          {loading ? 'Guardando...' : 'Confirmar'}
        </button>
      </div>
    </div>
  );
}
