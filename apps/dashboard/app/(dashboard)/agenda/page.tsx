'use client';

import { CalendarDays, Plus } from 'lucide-react';
import { AgendaCalendar } from '@/components/agenda/AgendaCalendar';
import { PageHeader } from '@/components/layout/PageHeader';

export default function AgendaPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Agenda"
        subtitle="Revisa solicitudes de la página pública, acepta o rechaza citas y gestiona el calendario."
        icon={CalendarDays}
        accent="#ECFEFF"
        tone="#0E7490"
      >
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 transition-all"
          style={{ background: 'linear-gradient(135deg, var(--kova-blue), var(--kova-blue-mid))' }}
        >
          <Plus className="w-4 h-4" /> Nueva cita
        </button>
      </PageHeader>
      <AgendaCalendar />
    </div>
  );
}
