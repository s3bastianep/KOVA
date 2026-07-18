import type { NextRequest } from 'next/server';
import { CV_MAX_BYTES } from './cv-extract';
import { detectCvFileFormat } from './cv-file-formats';

export type CvUploadFile = {
  fileName: string;
  mime: string;
  buffer: Buffer;
};

export type CvUploadFormResult =
  | { ok: true; file: CvUploadFile; fields: Record<string, string> }
  | { ok: false; message: string; status: number };

const FILE_FIELD_NAMES = new Set(['file', 'cv', 'documento', 'hojaDeVida']);

/**
 * Parser multipart manual (sin IA, sin deps). Fallback cuando FormData nativo falla.
 */
function parseMultipartManual(
  body: Buffer,
  contentType: string,
): { fields: Record<string, string>; file: CvUploadFile | null } | null {
  const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
  if (!boundaryMatch) return null;

  const boundary = (boundaryMatch[1] || boundaryMatch[2] || '').trim();
  if (!boundary) return null;

  const sep = Buffer.from(`--${boundary}`);
  const fields: Record<string, string> = {};
  let file: CvUploadFile | null = null;

  let start = body.indexOf(sep);
  if (start < 0) return null;
  start += sep.length;

  while (start < body.length) {
    if (body[start] === 0x2d && body[start + 1] === 0x2d) break;
    if (body[start] === 0x0d && body[start + 1] === 0x0a) start += 2;

    const next = body.indexOf(sep, start);
    if (next < 0) break;

    let part = body.subarray(start, next);
    if (part.length >= 2 && part[part.length - 2] === 0x0d && part[part.length - 1] === 0x0a) {
      part = part.subarray(0, part.length - 2);
    }

    const headerEnd = indexOfDoubleCrlf(part);
    if (headerEnd < 0) {
      start = next + sep.length;
      continue;
    }

    const headerText = part.subarray(0, headerEnd).toString('utf8');
    const partBody = part.subarray(headerEnd + 4);
    const nameMatch = /name="([^"]+)"/i.exec(headerText);
    const filenameMatch = /filename="([^"]*)"/i.exec(headerText);
    const name = nameMatch?.[1] ?? '';

    if (filenameMatch) {
      const fileName = (filenameMatch[1] || 'cv.pdf').trim() || 'cv.pdf';
      const mimeMatch = /Content-Type:\s*([^\r\n]+)/i.exec(headerText);
      const mime = (mimeMatch?.[1] || '').trim().toLowerCase();
      if (FILE_FIELD_NAMES.has(name) || !file) {
        file = { fileName, mime, buffer: Buffer.from(partBody) };
      }
    } else if (name) {
      fields[name] = partBody.toString('utf8');
    }

    start = next + sep.length;
  }

  return { fields, file };
}

function indexOfDoubleCrlf(buf: Buffer): number {
  for (let i = 0; i < buf.length - 3; i++) {
    if (buf[i] === 0x0d && buf[i + 1] === 0x0a && buf[i + 2] === 0x0d && buf[i + 3] === 0x0a) {
      return i;
    }
  }
  return -1;
}

function validateUploadFile(
  fileName: string,
  mime: string,
  buffer: Buffer,
): Exclude<CvUploadFormResult, { ok: false }> | Extract<CvUploadFormResult, { ok: false }> {
  if (!detectCvFileFormat(fileName, mime)) {
    return { ok: false, status: 400, message: 'Solo aceptamos PDF, DOC o DOCX.' };
  }
  if (buffer.byteLength === 0) {
    return { ok: false, status: 400, message: 'El archivo está vacío.' };
  }
  if (buffer.byteLength > CV_MAX_BYTES) {
    return { ok: false, status: 400, message: 'El archivo no puede superar 5 MB.' };
  }
  return { ok: true, fields: {}, file: { fileName, mime, buffer } };
}

async function fileFromFormData(
  formData: FormData,
): Promise<{ fields: Record<string, string>; file: CvUploadFile } | { error: string }> {
  const fields: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') fields[key] = value;
  }

  const raw =
    formData.get('file') ??
    formData.get('cv') ??
    formData.get('documento') ??
    formData.get('hojaDeVida');

  if (!raw || typeof raw === 'string') {
    return { error: 'Sube tu hoja de vida en PDF o Word.' };
  }

  const uploaded = raw as File;
  const fileName = String(uploaded.name || 'cv.pdf').trim() || 'cv.pdf';
  const mime = String(uploaded.type || '').toLowerCase();
  const buffer = Buffer.from(await uploaded.arrayBuffer());
  return { fields, file: { fileName, mime, buffer } };
}

/**
 * Lee un multipart de HV de forma robusta (sin IA).
 * Lee el body una sola vez; si FormData nativo falla, usa parser manual.
 */
export async function parseCvUploadForm(req: NextRequest): Promise<CvUploadFormResult> {
  const contentType = String(req.headers.get('content-type') || '').toLowerCase();

  if (!contentType.includes('multipart/form-data')) {
    return {
      ok: false,
      status: 400,
      message: 'Envía el archivo como formulario (PDF, DOC o DOCX).',
    };
  }

  let body: Buffer;
  try {
    body = Buffer.from(await req.arrayBuffer());
  } catch (err) {
    console.error('[cv-upload-form] arrayBuffer failed:', err);
    return {
      ok: false,
      status: 400,
      message:
        'No pudimos recibir el archivo. Recarga la página e inténtalo de nuevo (PDF o Word, máx. 5 MB).',
    };
  }

  if (body.byteLength === 0) {
    return {
      ok: false,
      status: 400,
      message:
        'No pudimos recibir el archivo. Recarga la página e inténtalo de nuevo (PDF o Word, máx. 5 MB).',
    };
  }

  // Native FormData via reconstructed Request (body already buffered).
  try {
    const reconstructed = new Request('http://localhost/cv-upload', {
      method: 'POST',
      headers: { 'content-type': contentType },
      body: new Uint8Array(body),
    });
    const formData = await reconstructed.formData();
    const extracted = await fileFromFormData(formData);
    if ('error' in extracted) {
      return { ok: false, status: 400, message: extracted.error };
    }
    const validated = validateUploadFile(
      extracted.file.fileName,
      extracted.file.mime,
      extracted.file.buffer,
    );
    if (!validated.ok) return validated;
    return { ok: true, fields: extracted.fields, file: validated.file };
  } catch (formErr) {
    console.error('[cv-upload-form] FormData failed, using manual multipart:', formErr);
  }

  const parsed = parseMultipartManual(body, contentType);
  if (!parsed?.file) {
    return {
      ok: false,
      status: 400,
      message: 'Sube tu hoja de vida en PDF o Word.',
    };
  }

  const validated = validateUploadFile(parsed.file.fileName, parsed.file.mime, parsed.file.buffer);
  if (!validated.ok) return validated;
  return { ok: true, fields: parsed.fields, file: validated.file };
}
