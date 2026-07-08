import { NextRequest } from 'next/server';
import { CV_MAX_BYTES, extractCvFromPdfBuffer } from '../../../../lib/cv-extract';
import { getPublicTenantId } from '../../../../lib/public-tenant';
import { isMockMode } from '../../../../lib/mock';
import { persistCandidateCvFile } from '../../../../lib/persist-candidate-cv';
import { readRegistroMetadata } from '../../../../lib/registro-session';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function validateSession(tenantId: string, candidateId: string, resumeToken: string) {
  const candidate = await prisma.candidate.findFirst({
    where: { id: candidateId, tenantId },
    select: { id: true, metadata: true },
  });
  if (!candidate) return null;
  const meta = readRegistroMetadata(candidate.metadata);
  if (!meta.resumeToken || meta.resumeToken !== resumeToken) return null;
  return candidate;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return Response.json({ message: 'Solicitud inválida.' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return Response.json({ message: 'Sube un archivo PDF con tu hoja de vida.' }, { status: 400 });
  }

  const fileName = String(file.name || 'cv.pdf');
  const mime = String(file.type || '').toLowerCase();
  if (!mime.includes('pdf') && !fileName.toLowerCase().endsWith('.pdf')) {
    return Response.json({ message: 'Solo aceptamos archivos PDF.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.byteLength === 0) {
    return Response.json({ message: 'El archivo está vacío.' }, { status: 400 });
  }
  if (buffer.byteLength > CV_MAX_BYTES) {
    return Response.json({ message: 'El PDF no puede superar 5 MB.' }, { status: 400 });
  }

  let extraction;
  let extractedText = '';
  try {
    const parsed = await extractCvFromPdfBuffer(buffer, fileName);
    extraction = parsed.result;
    extractedText = parsed.text;
  } catch {
    return Response.json(
      { message: 'No pudimos leer el PDF. Verifica que no esté protegido o dañado.' },
      { status: 422 },
    );
  }

  const candidateId = String(formData.get('candidateId') ?? '').trim();
  const resumeToken = String(formData.get('resumeToken') ?? '').trim();

  if (candidateId && resumeToken && !isMockMode()) {
    try {
      const tenantId = await getPublicTenantId();
      const candidate = await validateSession(tenantId, candidateId, resumeToken);
      if (candidate) {
        await persistCandidateCvFile({
          tenantId,
          candidateId,
          fileName,
          buffer,
          extractedText,
          extraction,
        });
      }
    } catch {
      /* extracción sigue disponible aunque falle el guardado */
    }
  }

  return Response.json({
    ok: true,
    ...extraction,
  });
}
