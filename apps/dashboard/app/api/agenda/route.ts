import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../lib/auth';
import { listAgendaItems } from '../../../lib/agenda-service';
import { parseMonthParam, monthKey } from '../../../lib/agenda';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const monthParam = req.nextUrl.searchParams.get('month');
  const { year, month } = parseMonthParam(monthParam);
  const items = await listAgendaItems(user.tenantId, year, month);

  return Response.json({ month: monthKey(year, month), items });
}
