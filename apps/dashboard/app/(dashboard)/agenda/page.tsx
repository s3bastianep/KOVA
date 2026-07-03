'use client';

import { AgendaCalendar } from '@/components/agenda/AgendaCalendar';

export default function AgendaPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--kova-navy)' }}>Agenda</h1>
        <p className="text-sm text-slate-500 mt-1">
          Revisa solicitudes de la página pública, acepta o rechaza citas, y gestiona el calendario con arrastre y reprogramación.
        </p>
      </div>
      <AgendaCalendar />
    </div>
  );
}
