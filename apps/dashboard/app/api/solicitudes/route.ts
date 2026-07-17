import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, forbidden, isInternalRole } from '../../../lib/auth';
import { isRateLimited } from '../../../lib/rate-limit';
import { isSlotAvailable } from '../../../lib/booking-slots';
import { generateTimeSlots, isBookableDateKey } from '../../../../../shared/schedule.js';
import {
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

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isInternalRole(user.role)) return forbidden();

  const status = req.nextUrl.searchParams.get('status') as AgendaRequestStatus | null;
  const requests = await listAgendaRequests(user.tenantId, status ?? undefined);
  return Response.json({ requests });
}

export async function POST(req: NextRequest) {
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
  const available = await isSlotAvailable(date, time);
  if (!available) {
    return Response.json(
      { message: 'Ese horario acaba de ser reservado. Elige otro.' },
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
    console.error('[solicitudes]', err);
    return Response.json(
      { message: 'No se pudo registrar la solicitud. Intenta de nuevo en unos minutos.' },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}
