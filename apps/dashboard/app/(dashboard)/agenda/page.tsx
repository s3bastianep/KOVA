'use client';

import { AgendaCalendar } from '@/components/agenda/AgendaCalendar';

export default function AgendaPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Agenda</h1>
        <p className="text-sm text-slate-500 mt-1">
          Calendario de actividades — arrastra para reprogramar, marca estado y registra el motivo de cada cambio.
        </p>
      </div>
      <AgendaCalendar />
    </div>
  );
}
