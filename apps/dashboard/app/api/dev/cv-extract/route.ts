import { NextRequest } from 'next/server';
import { withApiErrors } from '@/lib/api-handler';
import { CV_MAX_BYTES } from '@/lib/cv-extract';
import { CvFileReadError, extractCvFromFileBuffer } from '@/lib/cv-extract-server';
import { detectCvFileFormat } from '@/lib/cv-file-formats';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Dev-only, no-auth CV extraction endpoint. Runs the exact same deterministic engine as
 * /api/portal/cv (extractCvFromFileBuffer → extractCvFromText) but skips authentication and
 * database persistence, so the /dev/onboarding-preview harness can prove the parser actually
 * reads a real PDF/DOCX and returns structured data. Never served in production.
 */
export const POST = withApiErrors('dev/cv-extract', handlePOST);

async function handlePOST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ message: 'Not found' }, { status: 404 });
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return Response.json({ message: 'Solicitud inválida.' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return Response.json({ message: 'Sube tu hoja de vida en PDF o Word.' }, { status: 400 });
  }

  const fileName = String(file.name || 'cv.pdf');
  const mime = String(file.type || '').toLowerCase();
  if (!detectCvFileFormat(fileName, mime)) {
    return Response.json({ message: 'Solo aceptamos PDF, DOC o DOCX.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.byteLength === 0) {
    return Response.json({ message: 'El archivo está vacío.' }, { status: 400 });
  }
  if (buffer.byteLength > CV_MAX_BYTES) {
    return Response.json({ message: 'El archivo no puede superar 5 MB.' }, { status: 400 });
  }

  try {
    const parsed = await extractCvFromFileBuffer(buffer, fileName, mime);
    return Response.json({
      ok: true,
      ...parsed.result,
      cv: {
        fileName,
        importedAt: new Date().toISOString(),
        textLength: parsed.text.length,
      },
      _debug: {
        textPreview: parsed.text.slice(0, 400),
      },
    });
  } catch (err) {
    const message =
      err instanceof CvFileReadError
        ? err.message
        : 'No pudimos leer el archivo. Verifica que no esté protegido o dañado.';
    return Response.json({ message }, { status: 422 });
  }
}
