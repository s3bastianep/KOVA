'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Video,
  Building2,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';

type Event = {
  id: string;
  title: string;
  type: string;
  date: string;
  endDate?: string;
  companyId?: string;
  companyName?: string;
  vacancyTitle?: string;
  contactName?: string;
  contactRole?: string;
  contactPhone?: string;
  contactEmail?: string;
  location?: string;
  meetingUrl?: string;
  purpose?: string;
  notes?: string;
};

const TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  Discovery: { bg: '#EEF2FA', color: 'var(--kova-blue)' },
  'Reunión cliente': { bg: '#E6FAF3', color: 'var(--kova-green)' },
  Llamada: { bg: '#FFF7E6', color: '#B7791F' },
  'Entrevista cliente': { bg: '#F3E8FF', color: '#7C3AED' },
  Seguimiento: { bg: '#FFF0EE', color: 'var(--kova-coral)' },
};

function typeStyle(type: string) {
  return TYPE_STYLES[type] ?? { bg: '#F1F5F9', color: '#475569' };
}

function whatsappUrl(phone: string, text: string) {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function formatTimeRange(start: Date, end?: Date) {
  const opts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  const startStr = start.toLocaleTimeString('es-CO', opts);
  if (!end) return startStr;
  return `${startStr} – ${end.toLocaleTimeString('es-CO', opts)}`;
}

function groupLabel(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Mañana';
  if (diff > 1 && diff <= 7) return 'Esta semana';
  return 'Próximos';
}

export default function CalendarioPage() {
  const { data, isLoading } = useQuery({ queryKey: ['calendar'], queryFn: dashboardApi.calendar });
  const events = (data as Event[]) ?? [];
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'client'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return events;
    return events.filter((e) => e.companyName);
  }, [events, filter]);

  const grouped = useMemo(() => {
    const order = ['Hoy', 'Mañana', 'Esta semana', 'Próximos'];
    const map = new Map<string, Event[]>();
    for (const e of filtered) {
      const label = groupLabel(new Date(e.date));
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(e);
    }
    return order.filter((k) => map.has(k)).map((k) => ({ label: k, items: map.get(k)! }));
  }, [filtered]);

  const thisWeek = events.filter((e) => {
    const d = new Date(e.date);
    const now = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 86400000);
    return d >= now && d <= weekEnd;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Calendario</h1>
          <p className="text-sm text-slate-500">
            Entrevistas, reuniones de discovery y seguimientos programados con contacto del cliente.
          </p>
        </div>
        {!isLoading && events.length > 0 && (
          <div className="kova-card px-4 py-2 text-sm">
            <span className="font-semibold" style={{ color: 'var(--kova-navy)' }}>{thisWeek}</span>
            <span className="text-slate-500"> eventos esta semana</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {(['all', 'client'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className="text-xs px-3 py-1.5 rounded-full border transition-colors"
            style={
              filter === f
                ? { background: 'var(--kova-navy)', color: '#fff', borderColor: 'var(--kova-navy)' }
                : { background: '#fff', color: '#64748b', borderColor: '#e2e8f0' }
            }
          >
            {f === 'all' ? 'Todos' : 'Con cliente'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : filtered.length === 0 ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No hay eventos agendados.</div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ label, items }) => (
            <div key={label} className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</h2>
              {items.map((e) => {
                const d = new Date(e.date);
                const end = e.endDate ? new Date(e.endDate) : undefined;
                const style = typeStyle(e.type);
                const isOpen = open === e.id;
                const waText = `Hola${e.contactName ? ` ${e.contactName.split(' ')[0]}` : ''}, te escribo de Kova Talent OS respecto a: ${e.title}.`;

                return (
                  <div key={e.id} className="kova-card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : e.id)}
                      className="w-full p-4 flex items-start gap-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div
                        className="w-14 h-14 rounded-lg flex flex-col items-center justify-center shrink-0"
                        style={{ background: style.bg }}
                      >
                        <span className="font-heading font-bold text-lg leading-none" style={{ color: style.color }}>
                          {d.getDate()}
                        </span>
                        <span className="text-xs text-slate-400">{d.toLocaleDateString('es-CO', { month: 'short' })}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: style.bg, color: style.color }}>
                            {e.type}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {formatTimeRange(d, end)}
                          </span>
                        </div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--kova-navy)' }}>{e.title}</p>
                        {e.companyName && (
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            {e.companyId ? (
                              <Link href={`/empresas/${e.companyId}`} onClick={(ev) => ev.stopPropagation()} className="hover:underline">
                                {e.companyName}
                              </Link>
                            ) : (
                              e.companyName
                            )}
                            {e.vacancyTitle && (
                              <>
                                <span>·</span>
                                <Briefcase className="w-3 h-3" />
                                {e.vacancyTitle}
                              </>
                            )}
                          </p>
                        )}
                        {e.contactName && (
                          <p className="text-xs text-slate-500 mt-1">
                            Contacto: <span className="font-medium">{e.contactName}</span>
                            {e.contactRole ? ` · ${e.contactRole}` : ''}
                          </p>
                        )}
                      </div>

                      {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 border-t border-slate-100 pt-4 space-y-4">
                        {e.purpose && (
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Objetivo</p>
                            <p className="text-sm text-slate-600">{e.purpose}</p>
                          </div>
                        )}

                        {(e.location || e.meetingUrl) && (
                          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                            {e.location && (
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                {e.location}
                              </span>
                            )}
                            {e.meetingUrl && (
                              <a
                                href={e.meetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 hover:underline"
                                style={{ color: 'var(--kova-blue)' }}
                              >
                                <Video className="w-4 h-4" />
                                Unirse a la reunión
                              </a>
                            )}
                          </div>
                        )}

                        {e.notes && (
                          <p className="text-sm text-slate-500 p-3 rounded-lg bg-slate-50">{e.notes}</p>
                        )}

                        {(e.contactPhone || e.contactEmail) && (
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Contactar cliente</p>
                            <div className="flex flex-wrap gap-2">
                              {e.contactPhone && (
                                <>
                                  <a
                                    href={`tel:${e.contactPhone.replace(/\s/g, '')}`}
                                    className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                                  >
                                    <Phone className="w-4 h-4" style={{ color: 'var(--kova-blue)' }} />
                                    Llamar
                                  </a>
                                  <a
                                    href={whatsappUrl(e.contactPhone, waText)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                                  >
                                    <MessageCircle className="w-4 h-4" style={{ color: '#25D366' }} />
                                    WhatsApp
                                  </a>
                                </>
                              )}
                              {e.contactEmail && (
                                <a
                                  href={`mailto:${e.contactEmail}?subject=${encodeURIComponent(e.title)}`}
                                  className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                                >
                                  <Mail className="w-4 h-4" style={{ color: 'var(--kova-coral)' }} />
                                  Correo
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                              {e.contactPhone && `${e.contactPhone}`}
                              {e.contactPhone && e.contactEmail && ' · '}
                              {e.contactEmail && e.contactEmail}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
