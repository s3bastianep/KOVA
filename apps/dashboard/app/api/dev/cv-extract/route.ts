import { NextRequest } from 'next/server';
import { withApiErrors } from '@/lib/api-handler';
import { CvFileReadError, extractCvFromFileBuffer } from '@/lib/cv-extract-server';
import { parseCvUploadForm } from '@/lib/cv-upload-form';

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

  const parsedForm = await parseCvUploadForm(req);
  if (!parsedForm.ok) {
    return Response.json({ message: parsedForm.message }, { status: parsedForm.status });
  }

  const { fileName, mime, buffer } = parsedForm.file;

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
