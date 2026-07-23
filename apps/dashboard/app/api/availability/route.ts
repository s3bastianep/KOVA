import { NextRequest } from 'next/server';
import { AgendaUnavailableError } from '../../../lib/agenda-request-service';
import { getAvailabilityForDate } from '../../../lib/booking-slots';
import { withApiErrors } from '../../../lib/api-handler';
import { publicCorsHeaders } from '../../../lib/public-cors';

export const dynamic = 'force-dynamic';

export async function OPTIONS(req: NextRequest) {
  return new Response(null, { status: 204, headers: publicCorsHeaders(req, 'GET, OPTIONS') });
}

export const GET = withApiErrors('availability', handleGET);

async function handleGET(req: NextRequest) {
  const cors = publicCorsHeaders(req, 'GET, OPTIONS');
  const date = String(req.nextUrl.searchParams.get('date') || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: 'Fecha inválida.' }, { status: 400, headers: cors });
  }

  try {
    const slots = await getAvailabilityForDate(date);
    return Response.json({ date, slots }, { headers: cors });
  } catch (err) {
    if (err instanceof AgendaUnavailableError) {
      return Response.json(
        { error: 'Agenda temporalmente no disponible. Intenta de nuevo en unos minutos.' },
        { status: 503, headers: cors },
      );
    }
    throw err;
  }
}
