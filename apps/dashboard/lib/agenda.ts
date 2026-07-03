export type AgendaStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';

export type AgendaMoveEntry = {
  fromDate: string;
  toDate: string;
  reason: string;
  movedAt: string;
};

export type AgendaItem = {
  id: string;
  itemKey: string;
  title: string;
  type: string;
  date: string;
  endDate?: string;
  status: AgendaStatus;
  statusReason?: string;
  moveCount: number;
  moveHistory: AgendaMoveEntry[];
  companyName?: string;
  vacancyTitle?: string;
  contactName?: string;
  location?: string;
  purpose?: string;
  notes?: string;
};

export type AgendaTypeStyle = {
  bg: string;
  border: string;
  text: string;
  dot: string;
};

export const AGENDA_TYPE_STYLES: Record<string, AgendaTypeStyle> = {
  Discovery: { bg: '#EEF2FA', border: '#1A3FAA', text: '#1A3FAA', dot: '#1A3FAA' },
  'Reunión cliente': { bg: '#E6FAF3', border: '#00B27A', text: '#047857', dot: '#00B27A' },
  Llamada: { bg: '#FFF7E6', border: '#D97706', text: '#B45309', dot: '#F59E0B' },
  'Entrevista cliente': { bg: '#F3E8FF', border: '#7C3AED', text: '#6D28D9', dot: '#7C3AED' },
  Entrevista: { bg: '#F3E8FF', border: '#7C3AED', text: '#6D28D9', dot: '#7C3AED' },
  Seguimiento: { bg: '#FFF0EE', border: '#FF3B30', text: '#DC2626', dot: '#FF3B30' },
  Tarea: { bg: '#ECFEFF', border: '#0891B2', text: '#0E7490', dot: '#06B6D4' },
  Visita: { bg: '#FFF7ED', border: '#EA580C', text: '#C2410C', dot: '#F97316' },
  Consultoría: { bg: '#EEF2FA', border: '#1A3FAA', text: '#1A3FAA', dot: '#1A3FAA' },
};

export function agendaTypeStyle(type: string): AgendaTypeStyle {
  return AGENDA_TYPE_STYLES[type] ?? { bg: '#F1F5F9', border: '#94A3B8', text: '#475569', dot: '#64748B' };
}

export const AGENDA_STATUS_LABELS: Record<AgendaStatus, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
  REJECTED: 'Rechazada',
};

export function parseMonthParam(month?: string | null): { year: number; month: number } {
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split('-').map(Number);
    return { year: y, month: m - 1 };
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

export function monthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = (first.getDay() + 6) % 7;
  const days: { date: Date; inMonth: boolean }[] = [];

  for (let i = startPad - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month, -i), inMonth: false });
  }
  for (let d = 1; d <= last.getDate(); d++) {
    days.push({ date: new Date(year, month, d), inMonth: true });
  }
  while (days.length % 7 !== 0) {
    const next = days.length - startPad - last.getDate() + 1;
    days.push({ date: new Date(year, month + 1, next), inMonth: false });
  }
  return days;
}

export function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatAgendaTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}
