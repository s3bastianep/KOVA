import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, forbidden, isInternalRole } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_TASKS } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isInternalRole(user.role)) return forbidden();

  if (isMockMode()) return Response.json(MOCK_TASKS);

  const tasks = await prisma.task.findMany({
    where: {
      tenantId: user.tenantId,
      ...(user.role === 'CONSULTANT' && {
        OR: [{ assigneeId: user.id }, { creatorId: user.id }],
      }),
    },
    include: {
      company: { select: { name: true } },
      vacancy: { select: { title: true } },
    },
    orderBy: { dueDate: 'asc' },
    // Tope defensivo: sin él, un tenant con años de tareas carga todo en una respuesta.
    take: 500,
  });

  return Response.json(tasks);
}
