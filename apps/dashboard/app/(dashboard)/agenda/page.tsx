'use client';

import { CalendarDays } from 'lucide-react';
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
      />
      <AgendaCalendar />
    </div>
  );
}
