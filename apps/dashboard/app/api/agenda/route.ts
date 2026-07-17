import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, forbidden, isInternalRole } from '../../../lib/auth';
import { listAgendaItems, createAgendaItem } from '../../../lib/agenda-service';
import { parseMonthParam, monthKey } from '../../../lib/agenda';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isInternalRole(user.role)) return forbidden();

  const monthParam = req.nextUrl.searchParams.get('month');
  const { year, month } = parseMonthParam(monthParam);
  const items = await listAgendaItems(user.tenantId, year, month);

  return Response.json({ month: monthKey(year, month), items });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isInternalRole(user.role)) return forbidden();

  const body = await req.json().catch(() => ({}));

  try {
    const item = await createAgendaItem(user.tenantId, {
      title: body.title,
      type: body.type,
      scheduledAt: body.scheduledAt,
      endAt: body.endAt,
      companyName: body.companyName,
      contactName: body.contactName,
      location: body.location,
      purpose: body.purpose,
      notes: body.notes,
    });
    return Response.json({ ok: true, item });
  } catch (err) {
    return Response.json(
      { message: err instanceof Error ? err.message : 'No se pudo crear la cita' },
      { status: 400 },
    );
  }
}
