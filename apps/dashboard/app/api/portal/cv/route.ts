import { NextRequest } from 'next/server';
import { CV_MAX_BYTES } from '@/lib/cv-extract';
import { CvFileReadError, extractCvFromFileBuffer } from '@/lib/cv-extract-server';
import { detectCvFileFormat } from '@/lib/cv-file-formats';
import { persistCandidateCvFile } from '@/lib/persist-candidate-cv';
import { readCandidateCvBuffer } from '@/lib/cv-storage';
import { isMockMode } from '@/lib/mock';
import { handlePortalRoute } from '@/lib/portal-api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  return handlePortalRoute(
    req,
    async ({ user, candidate }) => {
      if (isMockMode()) {
        return Response.json({ message: 'CV no disponible en modo demo.' }, { status: 404 });
      }

      const stored = await readCandidateCvBuffer(user.tenantId, candidate.id);
      if (!stored) {
        return Response.json({ message: 'Aún no has subido tu hoja de vida.' }, { status: 404 });
      }

      const safeName = stored.fileName.replace(/[^\w.\-áéíóúñÁÉÍÓÚÑ ]/g, '_');

      return new Response(new Uint8Array(stored.buffer), {
        headers: {
          'Content-Type': stored.mimeType,
          'Content-Disposition': `inline; filename="${safeName}"`,
          'Cache-Control': 'private, max-age=3600',
        },
      });
    },
    'portal/cv',
  );
}

export async function POST(req: NextRequest) {
  return handlePortalRoute(
    req,
    async ({ user, candidate }) => {
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

      if (!isMockMode()) {
        try {
          await persistCandidateCvFile({
            tenantId: user.tenantId,
            candidateId: candidate.id,
            fileName,
            buffer,
            extractedText,
            extraction,
            mime,
          });
        } catch (err) {
          console.error('[portal/cv] persist error:', err);
          return Response.json({ message: 'No pudimos guardar tu archivo.' }, { status: 500 });
        }
      }

      const cv = {
        fileName,
        importedAt: new Date().toISOString(),
        textLength: extractedText.length,
      };

      return Response.json({
        ok: true,
        ...extraction,
        cv,
      });
    },
    'portal/cv',
  );
}
