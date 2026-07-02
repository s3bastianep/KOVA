import { NextRequest } from 'next/server';
import { filterBookedSlots, generateTimeSlots, isBookableDateKey } from '@/lib/booking-schedule';
import { readBookings } from '@/lib/booking-store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const date = String(req.nextUrl.searchParams.get('date') || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: 'Fecha inválida.' }, { status: 400 });
  }
  if (!isBookableDateKey(date)) {
    return Response.json({ date, slots: [] });
  }

  const bookings = await readBookings();
  const allSlots = generateTimeSlots(date);
  const slots = filterBookedSlots(date, allSlots, bookings);
  return Response.json({ date, slots });
}
