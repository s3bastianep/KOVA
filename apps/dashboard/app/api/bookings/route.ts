import { NextRequest } from 'next/server';
import {
  AgendaSlotConflictError,
  AgendaUnavailableError,
  createAgendaRequest,
} from '../../../lib/agenda-request-service';
import { isSlotAvailable } from '../../../lib/booking-slots';
import { generateTimeSlots, isBookableDateKey } from '../../../../../shared/schedule.js';
import { isRateLimited } from '../../../lib/rate-limit';
import { withApiErrors } from '../../../lib/api-handler';
import { publicCorsHeaders } from '../../../lib/public-cors';

export const dynamic = 'force-dynamic';

export async function OPTIONS(req: NextRequest) {
  return new Response(null, { status: 204, headers: publicCorsHeaders(req, 'POST, OPTIONS') });
}

function validateBody(body: Record<string, unknown> | null) {
  const { date, time, nombre, correo, telefono, empresa, rolVacante } = body ?? {};
  if (!date || !time || !nombre || !correo || !telefono || !empresa) {
    return 'Completa fecha, hora, nombre, correo, teléfono y empresa.';
  }
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Fecha inválida.';
  if (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) return 'Hora inválida.';
  if (typeof correo !== 'string' || !correo.includes('@')) return 'Correo inválido.';
  // Topes de longitud: endpoint público, evita guardar payloads inflados por bots.
  if (typeof nombre !== 'string' || nombre.trim().length > 120) return 'Nombre demasiado largo.';
  if (correo.length > 160) return 'Correo demasiado largo.';
  if (typeof telefono !== 'string' || telefono.trim().length > 30) return 'Teléfono inválido.';
  if (typeof empresa !== 'string' || empresa.trim().length > 160) return 'Empresa demasiado larga.';
  if (rolVacante != null && (typeof rolVacante !== 'string' || rolVacante.length > 160)) {
    return 'Rol a contratar inválido.';
  }
  if (!isBookableDateKey(date)) return 'La fecha seleccionada no está disponible.';
  const slots = generateTimeSlots(date);
  if (!slots.includes(time)) return 'El horario seleccionado no está disponible.';
  return null;
}

export const POST = withApiErrors('bookings', handlePOST);

async function handlePOST(req: NextRequest) {
  const cors = publicCorsHeaders(req, 'POST, OPTIONS');

  if (isRateLimited(req, 'bookings', 5, 60_000)) {
    return Response.json(
      { error: 'Demasiadas solicitudes seguidas. Espera un minuto e intenta de nuevo.' },
      { status: 429, headers: cors },
    );
  }

  const body = await req.json().catch(() => null);
  const error = validateBody(body);
  if (error) {
    return Response.json({ error }, { status: 400, headers: cors });
  }

  const { date, time, nombre, correo, telefono, empresa, rolVacante } = body as {
    date: string;
    time: string;
    nombre: string;
    correo: string;
    telefono: string;
    empresa: string;
    rolVacante?: string;
  };

  try {
    const available = await isSlotAvailable(date, time);
    if (!available) {
      return Response.json(
        { error: 'Ese horario acaba de ser reservado. Elige otro.' },
        { status: 409, headers: cors },
      );
    }

    const request = await createAgendaRequest({
      date,
      time,
      requesterName: nombre,
      requesterEmail: correo,
      requesterPhone: telefono,
      companyName: empresa,
      notes: typeof rolVacante === 'string' && rolVacante.trim()
        ? `Rol a contratar: ${rolVacante.trim()}`
        : undefined,
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
      { status: 201, headers: cors },
    );
  } catch (err) {
    if (err instanceof AgendaSlotConflictError) {
      return Response.json(
        { error: 'Ese horario acaba de ser reservado. Elige otro.' },
        { status: 409, headers: cors },
      );
    }
    if (err instanceof AgendaUnavailableError) {
      return Response.json(
        { error: 'Agenda temporalmente no disponible. Intenta de nuevo en unos minutos.' },
        { status: 503, headers: cors },
      );
    }
    console.error('[bookings]', err);
    return Response.json(
      { error: 'No se pudo registrar la cita. Intenta de nuevo en unos minutos.' },
      { status: 500, headers: cors },
    );
  }
}
