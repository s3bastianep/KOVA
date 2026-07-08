import { NextRequest } from 'next/server';
import { getAvailabilityForDate } from '../../../lib/booking-slots';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const date = String(req.nextUrl.searchParams.get('date') || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: 'Fecha inválida.' }, { status: 400, headers: CORS_HEADERS });
  }

  const slots = await getAvailabilityForDate(date);
  return Response.json({ date, slots }, { headers: CORS_HEADERS });
}
