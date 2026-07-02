import { NextRequest } from 'next/server';
import { randomUUID } from 'node:crypto';
import { generateTimeSlots, isBookableDateKey } from '@/lib/booking-schedule';
import { addBooking, findBookingConflict } from '@/lib/booking-store';

export const dynamic = 'force-dynamic';

function validateBookingBody(body: Record<string, unknown> | null) {
  const { date, time, nombre, correo, telefono, empresa } = body ?? {};
  if (!date || !time || !String(nombre ?? '').trim() || !String(correo ?? '').trim() || !String(telefono ?? '').trim() || !String(empresa ?? '').trim()) {
    return 'Completa fecha, hora, nombre, correo, teléfono y empresa.';
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) return 'Fecha inválida.';
  if (!/^\d{2}:\d{2}$/.test(String(time))) return 'Hora inválida.';
  if (!String(correo).includes('@')) return 'Correo inválido.';
  if (!isBookableDateKey(String(date))) return 'La fecha seleccionada no está disponible.';
  const slots = generateTimeSlots(String(date));
  if (!slots.includes(String(time))) return 'El horario seleccionado no está disponible.';
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const error = validateBookingBody(body);
  if (error) return Response.json({ error }, { status: 400 });

  const { date, time, nombre, correo, telefono, empresa } = body as Record<string, string>;
  const conflict = await findBookingConflict(date, time);
  if (conflict) {
    return Response.json({ error: 'Ese horario acaba de ser reservado. Elige otro.' }, { status: 409 });
  }

  const booking = {
    id: randomUUID(),
    date,
    time,
    nombre: nombre.trim(),
    correo: correo.trim().toLowerCase(),
    telefono: telefono.trim(),
    empresa: empresa.trim(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  await addBooking(booking);
  return Response.json(
    {
      ok: true,
      booking: {
        id: booking.id,
        date: booking.date,
        time: booking.time,
        nombre: booking.nombre,
      },
    },
    { status: 201 },
  );
}
