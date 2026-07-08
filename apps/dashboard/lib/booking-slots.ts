import {
  SCHEDULE,
  filterBookedSlots,
  formatDateKey,
  generateTimeSlots,
  isBookableDateKey,
} from '../../../shared/schedule.js';
import { listAgendaRequests, resolveDefaultTenantId } from './agenda-request-service';

function formatTimeInBogota(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: SCHEDULE.timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));
}

async function activeBookings() {
  const tenantId = await resolveDefaultTenantId();
  const requests = await listAgendaRequests(tenantId);
  return requests
    .filter((r) => r.status !== 'REJECTED')
    .map((r) => ({
      date: formatDateKey(new Date(r.scheduledAt)),
      time: formatTimeInBogota(r.scheduledAt),
      status: 'pending',
    }));
}

export async function getAvailabilityForDate(date: string): Promise<string[]> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isBookableDateKey(date)) return [];
  const bookings = await activeBookings();
  const allSlots = generateTimeSlots(date);
  return filterBookedSlots(date, allSlots, bookings);
}

export async function isSlotAvailable(date: string, time: string): Promise<boolean> {
  const slots = await getAvailabilityForDate(date);
  return slots.includes(time);
}
