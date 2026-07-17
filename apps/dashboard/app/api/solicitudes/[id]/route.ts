import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, forbidden, isInternalRole } from '../../../../lib/auth';
import {
  acceptAgendaRequest,
  rejectAgendaRequest,
  rescheduleAgendaRequest,
} from '../../../../lib/agenda-request-service';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isInternalRole(user.role)) return forbidden();

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { action, reason, newDate } = body as {
    action?: string;
    reason?: string;
    newDate?: string;
  };

  try {
    if (action === 'accept') {
      const result = await acceptAgendaRequest(user.tenantId, id, reason);
      if (!result) return Response.json({ message: 'Solicitud no encontrada o ya gestionada' }, { status: 404 });
      return Response.json({ ok: true, ...result });
    }

    if (action === 'reject') {
      const result = await rejectAgendaRequest(user.tenantId, id, reason ?? '');
      if (!result) return Response.json({ message: 'Solicitud no encontrada o ya gestionada' }, { status: 404 });
      return Response.json({ ok: true, ...result });
    }

    if (action === 'reschedule') {
      if (!newDate) return Response.json({ message: 'Fecha requerida' }, { status: 400 });
      const request = await rescheduleAgendaRequest(user.tenantId, id, newDate, reason ?? '');
      if (!request) return Response.json({ message: 'Solicitud no encontrada o ya gestionada' }, { status: 404 });
      return Response.json({ ok: true, request });
    }

    return Response.json({ message: 'Acción no válida' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al actualizar solicitud';
    return Response.json({ message }, { status: 400 });
  }
}
