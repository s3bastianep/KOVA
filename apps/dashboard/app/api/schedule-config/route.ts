import { SCHEDULE } from '@/lib/booking-schedule';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    slotMinutes: SCHEDULE.slotMinutes,
    daysAhead: SCHEDULE.daysAhead,
    timezone: SCHEDULE.timezone,
    eventTitle: 'Consultoría comercial Kova',
    eventDuration: `${SCHEDULE.slotMinutes} min`,
  });
}
