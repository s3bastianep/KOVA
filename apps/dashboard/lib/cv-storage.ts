import type { Prisma } from '@prisma/client';
import { prisma } from './prisma';
import { readCandidateCvPdf } from './cv-legacy-storage';

export function cvDownloadUrl(candidateId: string) {
  return `/api/candidatos/${candidateId}/cv`;
}

function toDbBytes(buffer: Buffer): Prisma.Bytes {
  return new Uint8Array(buffer) as Prisma.Bytes;
}

export { toDbBytes };

export async function readCandidateCvBuffer(
  tenantId: string,
  candidateId: string,
): Promise<{ buffer: Buffer; fileName: string } | null> {
  const doc = await prisma.document.findFirst({
    where: { tenantId, candidateId, type: 'CV' },
    select: { id: true, content: true, name: true },
    orderBy: { createdAt: 'desc' },
  });

  if (doc?.content && doc.content.length > 0) {
    return { buffer: Buffer.from(doc.content), fileName: doc.name };
  }

  const legacy = await readCandidateCvPdf(tenantId, candidateId);
  if (!legacy) return null;

  const fileName = doc?.name ?? 'hoja-de-vida.pdf';
  const url = cvDownloadUrl(candidateId);
  const payload = {
    name: fileName,
    url,
    mimeType: 'application/pdf',
    sizeBytes: legacy.byteLength,
    content: toDbBytes(legacy),
  };

  if (doc?.id) {
    await prisma.document.update({ where: { id: doc.id }, data: payload });
  } else {
    await prisma.document.create({
      data: {
        tenantId,
        candidateId,
        type: 'CV',
        ...payload,
      },
    });
  }

  return { buffer: legacy, fileName };
}
