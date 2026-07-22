import { NextRequest } from 'next/server';
import { AgendaUnavailableError } from '../../../lib/agenda-request-service';
import { getAvailabilityForDate } from '../../../lib/booking-slots';
import { withApiErrors } from '../../../lib/api-handler';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export const GET = withApiErrors('availability', handleGET, { headers: CORS_HEADERS });

async function handleGET(req: NextRequest) {
  const date = String(req.nextUrl.searchParams.get('date') || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: 'Fecha inválida.' }, { status: 400, headers: CORS_HEADERS });
  }

  try {
    const slots = await getAvailabilityForDate(date);
    return Response.json({ date, slots }, { headers: CORS_HEADERS });
  } catch (err) {
    if (err instanceof AgendaUnavailableError) {
      return Response.json(
        { error: 'Agenda temporalmente no disponible. Intenta de nuevo en unos minutos.' },
        { status: 503, headers: CORS_HEADERS },
      );
    }
    throw err;
  }
}
