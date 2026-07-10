import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, isStaffRole } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';
import { isMockMode } from '../../../../../lib/mock';
import { readCandidateCvBuffer } from '../../../../../lib/cv-storage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isStaffRole(user.role)) return unauthorized();

  const { id } = await params;

  if (isMockMode()) {
    return Response.json({ message: 'CV no disponible en modo demo.' }, { status: 404 });
  }

  const candidate = await prisma.candidate.findFirst({
    where: { id, tenantId: user.tenantId },
    select: { id: true },
  });
  if (!candidate) {
    return Response.json({ message: 'Candidato no encontrado.' }, { status: 404 });
  }

  const stored = await readCandidateCvBuffer(user.tenantId, id);
  if (!stored) {
    return Response.json({ message: 'Este candidato no tiene HV cargada.' }, { status: 404 });
  }

  const safeName = stored.fileName.replace(/[^\w.\-áéíóúñÁÉÍÓÚÑ ]/g, '_');

  return new Response(new Uint8Array(stored.buffer), {
    headers: {
      'Content-Type': stored.mimeType,
      'Content-Disposition': `inline; filename="${safeName}"`,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
