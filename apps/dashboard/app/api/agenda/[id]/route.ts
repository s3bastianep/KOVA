import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../../lib/auth';
import { rescheduleAgendaItem, updateAgendaStatus } from '../../../../lib/agenda-service';
import type { AgendaStatus } from '../../../../lib/agenda';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const { id: itemKey } = await params;
  const body = await req.json().catch(() => ({}));
  const { action } = body as { action?: string };

  try {
    if (action === 'status') {
      const { status, reason } = body as { status: AgendaStatus; reason?: string };
      if (!['PENDING', 'COMPLETED', 'CANCELLED'].includes(status)) {
        return Response.json({ message: 'Estado inválido' }, { status: 400 });
      }
      const item = await updateAgendaStatus(user.tenantId, decodeURIComponent(itemKey), status, reason);
      if (!item) return Response.json({ message: 'Actividad no encontrada' }, { status: 404 });
      return Response.json({ ok: true, item });
    }

    if (action === 'reschedule') {
      const { newDate, reason } = body as { newDate: string; reason: string };
      if (!newDate) return Response.json({ message: 'Fecha requerida' }, { status: 400 });
      const item = await rescheduleAgendaItem(user.tenantId, decodeURIComponent(itemKey), newDate, reason ?? '');
      if (!item) return Response.json({ message: 'Actividad no encontrada' }, { status: 404 });
      return Response.json({ ok: true, item });
    }

    return Response.json({ message: 'Acción no válida' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al actualizar';
    return Response.json({ message }, { status: 400 });
  }
}
