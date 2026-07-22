import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, forbidden, isInternalRole } from '../../../lib/auth';
import { isRateLimited } from '../../../lib/rate-limit';
import { withApiErrors } from '../../../lib/api-handler';
import { isSlotAvailable } from '../../../lib/booking-slots';
import { generateTimeSlots, isBookableDateKey } from '../../../../../shared/schedule.js';
import {
  AgendaSlotConflictError,
  AgendaUnavailableError,
  createAgendaRequest,
  listAgendaRequests,
  type AgendaRequestStatus,
} from '../../../lib/agenda-request-service';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export const GET = withApiErrors('solicitudes', handleGET);

async function handleGET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isInternalRole(user.role)) return forbidden();

  const status = req.nextUrl.searchParams.get('status') as AgendaRequestStatus | null;
  try {
    const requests = await listAgendaRequests(user.tenantId, status ?? undefined);
    return Response.json({ requests });
  } catch (err) {
    if (err instanceof AgendaUnavailableError) {
      return Response.json(
        { message: 'Agenda temporalmente no disponible. Intenta de nuevo en unos minutos.' },
        { status: 503 },
      );
    }
    throw err;
  }
}

export const POST = withApiErrors('solicitudes', handlePOST, { headers: CORS_HEADERS });

async function handlePOST(req: NextRequest) {
  // Endpoint público (CORS abierto): mismo límite defensivo que /api/bookings.
  if (isRateLimited(req, 'solicitudes', 5, 60_000)) {
    return Response.json(
      { message: 'Demasiadas solicitudes seguidas. Espera un minuto e intenta de nuevo.' },
      { status: 429, headers: CORS_HEADERS },
    );
  }

  const body = await req.json().catch(() => null);
  const { date, time, nombre, correo, telefono, empresa } = body ?? {};

  if (!date || !time || !nombre?.trim() || !correo?.trim() || !telefono?.trim() || !empresa?.trim()) {
    return Response.json(
      { message: 'Completa fecha, hora, nombre, correo, teléfono y empresa.' },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ message: 'Fecha inválida.' }, { status: 400, headers: CORS_HEADERS });
  }
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return Response.json({ message: 'Hora inválida.' }, { status: 400, headers: CORS_HEADERS });
  }
  if (!String(correo).includes('@')) {
    return Response.json({ message: 'Correo inválido.' }, { status: 400, headers: CORS_HEADERS });
  }
  if (
    String(nombre).length > 120 ||
    String(correo).length > 160 ||
    String(telefono).length > 30 ||
    String(empresa).length > 160
  ) {
    return Response.json({ message: 'Datos demasiado largos.' }, { status: 400, headers: CORS_HEADERS });
  }

  // OWASP A04: mismas reglas de negocio que /api/bookings. Sin esto, cualquier
  // fecha/hora con formato válido (domingos, 3 a.m., fechas pasadas) se guardaba
  // como solicitud basura en la agenda del staff.
  if (!isBookableDateKey(date)) {
    return Response.json(
      { message: 'La fecha seleccionada no está disponible.' },
      { status: 400, headers: CORS_HEADERS },
    );
  }
  if (!generateTimeSlots(date).includes(time)) {
    return Response.json(
      { message: 'El horario seleccionado no está disponible.' },
      { status: 400, headers: CORS_HEADERS },
    );
  }
  try {
    const available = await isSlotAvailable(date, time);
    if (!available) {
      return Response.json(
        { message: 'Ese horario acaba de ser reservado. Elige otro.' },
        { status: 409, headers: CORS_HEADERS },
      );
    }

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
        request: {
          id: request.id,
          date,
          time,
          nombre: request.requesterName,
          status: request.status,
        },
        message: 'Solicitud enviada. Te confirmaremos pronto.',
      },
      { status: 201, headers: CORS_HEADERS },
    );
  } catch (err) {
    if (err instanceof AgendaSlotConflictError) {
      return Response.json(
        { message: 'Ese horario acaba de ser reservado. Elige otro.' },
        { status: 409, headers: CORS_HEADERS },
      );
    }
    if (err instanceof AgendaUnavailableError) {
      return Response.json(
        { message: 'Agenda temporalmente no disponible. Intenta de nuevo en unos minutos.' },
        { status: 503, headers: CORS_HEADERS },
      );
    }
    console.error('[solicitudes]', err);
    return Response.json(
      { message: 'No se pudo registrar la solicitud. Intenta de nuevo en unos minutos.' },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}
