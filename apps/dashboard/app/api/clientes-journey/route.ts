import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../lib/auth';
import { listClientJourneys, updateClientJourney } from '../../../lib/client-journey-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const clients = await listClientJourneys(user.tenantId);
  return Response.json({ clients });
}

export async function PATCH(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (user.role === 'CLIENT') {
    return Response.json({ message: 'No autorizado' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { companyId, action, reason } = body as { companyId?: string; action?: string; reason?: string };

  if (!companyId || !['advance', 'hold'].includes(action ?? '')) {
    return Response.json({ message: 'companyId y action (advance|hold) son requeridos' }, { status: 400 });
  }

  try {
    const client = await updateClientJourney(user.tenantId, companyId, action as 'advance' | 'hold', reason);
    if (!client) return Response.json({ message: 'Cliente no encontrado' }, { status: 404 });
    return Response.json({ ok: true, client });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al actualizar';
    return Response.json({ message }, { status: 400 });
  }
}
