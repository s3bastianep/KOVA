import { NextRequest } from 'next/server';
import { CvFileReadError, extractCvFromFileBuffer } from '../../../../lib/cv-extract-server';
import { getPublicTenantId } from '../../../../lib/public-tenant';
import { isMockMode } from '../../../../lib/mock';
import { persistCandidateCvFile } from '../../../../lib/persist-candidate-cv';
import { readRegistroMetadata } from '../../../../lib/registro-session';
import { prisma } from '../../../../lib/prisma';
import { isRateLimited } from '../../../../lib/rate-limit';
import { withApiErrors } from '../../../../lib/api-handler';
import { parseCvUploadForm } from '../../../../lib/cv-upload-form';

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

export const POST = withApiErrors('registro/cv', handlePOST);

async function handlePOST(req: NextRequest) {
  if (isRateLimited(req, 'registro-cv', 10, 60_000)) {
    return Response.json(
      { message: 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.' },
      { status: 429 },
    );
  }

  const parsedForm = await parseCvUploadForm(req);
  if (!parsedForm.ok) {
    return Response.json({ message: parsedForm.message }, { status: parsedForm.status });
  }

  // OWASP A04: el parseo de PDF/Word es costoso (CPU). Antes se ejecutaba para
  // cualquier anónimo; ahora exigimos una sesión de registro válida (candidateId +
  // resumeToken emitidos por /api/registro) ANTES de tocar el archivo, así el
  // trabajo caro solo se hace para usuarios reales del funnel.
  const candidateId = String(parsedForm.fields.candidateId ?? '').trim();
  const resumeToken = String(parsedForm.fields.resumeToken ?? '').trim();
  const { fileName, mime, buffer } = parsedForm.file;

  let sessionCandidate: Awaited<ReturnType<typeof validateSession>> = null;
  let tenantId: string | null = null;

  if (!isMockMode()) {
    if (!candidateId || !resumeToken) {
      return Response.json(
        { message: 'Crea tu cuenta primero para poder subir tu hoja de vida.' },
        { status: 401 },
      );
    }
    tenantId = await getPublicTenantId();
    sessionCandidate = await validateSession(tenantId, candidateId, resumeToken);
    if (!sessionCandidate) {
      return Response.json(
        { message: 'Tu sesión de registro expiró. Vuelve a empezar.' },
        { status: 401 },
      );
    }
  }

  let extraction;
  let extractedText = '';
  try {
    const parsed = await extractCvFromFileBuffer(buffer, fileName, mime);
    extraction = parsed.result;
    extractedText = parsed.text;
  } catch (err) {
    const message =
      err instanceof CvFileReadError
        ? err.message
        : 'No pudimos leer el archivo. Verifica que no esté protegido o dañado.';
    return Response.json({ message }, { status: 422 });
  }

  if (sessionCandidate && tenantId) {
    try {
      await persistCandidateCvFile({
        tenantId,
        candidateId,
        fileName,
        buffer,
        extractedText,
        extraction,
        mime,
      });
    } catch {
      /* extracción sigue disponible aunque falle el guardado */
    }
  }

  return Response.json({
    ok: true,
    ...extraction,
  });
}
