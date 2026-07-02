'use client';

import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

type Event = { id: string; title: string; type: string; date: string };

export default function CalendarioPage() {
  const { data, isLoading } = useQuery({ queryKey: ['calendar'], queryFn: dashboardApi.calendar });
  const events = (data as Event[]) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Calendario</h1>
        <p className="text-sm text-slate-500">Próximos eventos y actividades agendadas.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : events.length === 0 ? (
        <div className="kova-card p-8 text-center text-slate-400 text-sm">No hay eventos agendados.</div>
      ) : (
        <div className="space-y-3">
          {events.map((e) => {
            const d = new Date(e.date);
            return (
              <div key={e.id} className="kova-card p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg flex flex-col items-center justify-center shrink-0" style={{ background: '#EEF2FA' }}>
                  <span className="font-heading font-bold text-lg leading-none" style={{ color: 'var(--kova-blue)' }}>{d.getDate()}</span>
                  <span className="text-xs text-slate-400">{d.toLocaleDateString('es-CO', { month: 'short' })}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--kova-navy)' }}>{e.title}</p>
                  <p className="text-xs text-slate-400">{e.type} · {d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <Calendar className="w-4 h-4 text-slate-300" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
