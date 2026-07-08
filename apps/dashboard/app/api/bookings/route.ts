import { NextRequest } from 'next/server';
import { createAgendaRequest } from '../../../lib/agenda-request-service';
import { isSlotAvailable } from '../../../lib/booking-slots';
import { generateTimeSlots, isBookableDateKey } from '../../../../../shared/schedule.js';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

function validateBody(body: Record<string, unknown> | null) {
  const { date, time, nombre, correo, telefono, empresa } = body ?? {};
  if (!date || !time || !nombre || !correo || !telefono || !empresa) {
    return 'Completa fecha, hora, nombre, correo, teléfono y empresa.';
  }
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Fecha inválida.';
  if (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) return 'Hora inválida.';
  if (typeof correo !== 'string' || !correo.includes('@')) return 'Correo inválido.';
  if (!isBookableDateKey(date)) return 'La fecha seleccionada no está disponible.';
  const slots = generateTimeSlots(date);
  if (!slots.includes(time)) return 'El horario seleccionado no está disponible.';
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const error = validateBody(body);
  if (error) {
    return Response.json({ error }, { status: 400, headers: CORS_HEADERS });
  }

  const { date, time, nombre, correo, telefono, empresa } = body as {
    date: string;
    time: string;
    nombre: string;
    correo: string;
    telefono: string;
    empresa: string;
  };

  const available = await isSlotAvailable(date, time);
  if (!available) {
    return Response.json(
      { error: 'Ese horario acaba de ser reservado. Elige otro.' },
      { status: 409, headers: CORS_HEADERS },
    );
  }

  try {
    const request = await createAgendaRequest({
      date,
      time,
      requesterName: nombre,
      requesterEmail: correo,
      requesterPhone: telefono,
      companyName: empresa,
    });

    return Response.json(
      {
        ok: true,
        booking: {
          id: request.id,
          date,
          time,
          nombre: request.requesterName,
        },
        message: 'Solicitud enviada. Te confirmaremos pronto.',
      },
      { status: 201, headers: CORS_HEADERS },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'No se pudo registrar la cita.';
    return Response.json({ error: message }, { status: 500, headers: CORS_HEADERS });
  }
}
