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

function decodeRfc5987Filename(raw: string): string {
  try {
    const match = /^[\w-]+''(.+)$/i.exec(raw.trim());
    if (match) return decodeURIComponent(match[1].replace(/\+/g, ' '));
    return decodeURIComponent(raw.replace(/\+/g, ' '));
  } catch {
    return raw;
  }
}

function sniffCvFormat(buffer: Buffer): { fileName: string; mime: string } | null {
  if (buffer.length >= 5 && buffer.subarray(0, 5).toString('utf8') === '%PDF-') {
    return { fileName: 'cv.pdf', mime: 'application/pdf' };
  }
  // ZIP/DOCX local file header
  if (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b) {
    return {
      fileName: 'cv.docx',
      mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
  }
  // Legacy DOC often starts with D0 CF 11 E0
  if (
    buffer.length >= 4 &&
    buffer[0] === 0xd0 &&
    buffer[1] === 0xcf &&
    buffer[2] === 0x11 &&
    buffer[3] === 0xe0
  ) {
    return { fileName: 'cv.doc', mime: 'application/msword' };
  }
  return null;
}

/**
 * Parser multipart manual. No usar toLowerCase() sobre el Content-Type completo:
 * el boundary es case-sensitive y si se altera el archivo nunca aparece.
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
    if (body[start] === 0x2d && body[start + 1] === 0x2d) break; // closing --
    if (body[start] === 0x0d && body[start + 1] === 0x0a) start += 2;
    else if (body[start] === 0x0a) start += 1;

    const next = body.indexOf(sep, start);
    if (next < 0) break;

    let part = body.subarray(start, next);
    if (part.length >= 2 && part[part.length - 2] === 0x0d && part[part.length - 1] === 0x0a) {
      part = part.subarray(0, part.length - 2);
    } else if (part.length >= 1 && part[part.length - 1] === 0x0a) {
      part = part.subarray(0, part.length - 1);
    }

    const headerEnd = indexOfHeaderBodySplit(part);
    if (headerEnd < 0) {
      start = next + sep.length;
      continue;
    }

    const headerText = part.subarray(0, headerEnd.index).toString('utf8');
    const partBody = part.subarray(headerEnd.index + headerEnd.sepLen);
    const nameMatch = /name="([^"]+)"/i.exec(headerText) ?? /name=([^;\s]+)/i.exec(headerText);
    const filenameStar = /filename\*=([^;\r\n]+)/i.exec(headerText);
    const filenamePlain =
      /filename="([^"]*)"/i.exec(headerText) ?? /filename=([^;\s]+)/i.exec(headerText);
    const name = (nameMatch?.[1] ?? '').trim();

    let fileName = '';
    if (filenameStar?.[1]) {
      fileName = decodeRfc5987Filename(filenameStar[1].trim().replace(/^"|"$/g, ''));
    } else if (filenamePlain) {
      fileName = (filenamePlain[1] || '').trim();
    }

    if (filenameStar || filenamePlain) {
      fileName = (fileName || 'cv.pdf').trim() || 'cv.pdf';
      const mimeMatch = /Content-Type:\s*([^\r\n]+)/i.exec(headerText);
      let mime = (mimeMatch?.[1] || '').trim().toLowerCase();
      let buffer = Buffer.from(partBody);

      if (!detectCvFileFormat(fileName, mime)) {
        const sniffed = sniffCvFormat(buffer);
        if (sniffed) {
          fileName = sniffed.fileName;
          mime = sniffed.mime;
        }
      }

      if (FILE_FIELD_NAMES.has(name) || !file) {
        file = { fileName, mime, buffer };
      }
    } else if (name) {
      fields[name] = partBody.toString('utf8');
    }

    start = next + sep.length;
  }

  return { fields, file };
}

function indexOfHeaderBodySplit(buf: Buffer): { index: number; sepLen: number } | null {
  for (let i = 0; i < buf.length - 3; i++) {
    if (buf[i] === 0x0d && buf[i + 1] === 0x0a && buf[i + 2] === 0x0d && buf[i + 3] === 0x0a) {
      return { index: i, sepLen: 4 };
    }
  }
  for (let i = 0; i < buf.length - 1; i++) {
    if (buf[i] === 0x0a && buf[i + 1] === 0x0a) {
      return { index: i, sepLen: 2 };
    }
  }
  return null;
}

function validateUploadFile(
  fileName: string,
  mime: string,
  buffer: Buffer,
): CvUploadFormResult {
  let resolvedName = fileName;
  let resolvedMime = mime;

  if (!detectCvFileFormat(resolvedName, resolvedMime)) {
    const sniffed = sniffCvFormat(buffer);
    if (sniffed) {
      resolvedName = sniffed.fileName;
      resolvedMime = sniffed.mime;
    }
  }

  if (!detectCvFileFormat(resolvedName, resolvedMime)) {
    return { ok: false, status: 400, message: 'Solo aceptamos PDF, DOC o DOCX.' };
  }
  if (buffer.byteLength === 0) {
    return { ok: false, status: 400, message: 'El archivo está vacío.' };
  }
  if (buffer.byteLength > CV_MAX_BYTES) {
    return { ok: false, status: 400, message: 'El archivo no puede superar 5 MB.' };
  }
  return {
    ok: true,
    fields: {},
    file: { fileName: resolvedName, mime: resolvedMime, buffer },
  };
}

async function fileFromFormData(
  formData: FormData,
): Promise<{ fields: Record<string, string>; file: CvUploadFile } | { error: string }> {
  const fields: Record<string, string> = {};
  let file: CvUploadFile | null = null;

  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      fields[key] = value;
      continue;
    }

    const uploaded = value as File;
    const fileName = String(uploaded.name || 'cv.pdf').trim() || 'cv.pdf';
    const mime = String(uploaded.type || '').toLowerCase();
    const buffer = Buffer.from(await uploaded.arrayBuffer());

    if (FILE_FIELD_NAMES.has(key) || !file) {
      file = { fileName, mime, buffer };
    }
  }

  if (!file) {
    return { error: 'Sube tu hoja de vida en PDF o Word.' };
  }

  return { fields, file };
}

/**
 * Lee un multipart de HV de forma robusta (sin IA).
 * 1) Parser manual (boundary case-sensitive)
 * 2) Fallback FormData nativo sobre el body ya bufferizado
 */
export async function parseCvUploadForm(req: NextRequest): Promise<CvUploadFormResult> {
  // Preserve original casing — boundary is case-sensitive.
  const contentType = String(req.headers.get('content-type') || '');
  const contentTypeLower = contentType.toLowerCase();

  if (!contentTypeLower.includes('multipart/form-data')) {
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

  const manual = parseMultipartManual(body, contentType);
  if (manual?.file) {
    const validated = validateUploadFile(
      manual.file.fileName,
      manual.file.mime,
      manual.file.buffer,
    );
    if (!validated.ok) return validated;
    return { ok: true, fields: manual.fields, file: validated.file };
  }

  try {
    const reconstructed = new Request('http://localhost/cv-upload', {
      method: 'POST',
      headers: { 'content-type': contentType },
      body: new Uint8Array(body),
    });
    const formData = await reconstructed.formData();
    const extracted = await fileFromFormData(formData);
    if (!('error' in extracted)) {
      const validated = validateUploadFile(
        extracted.file.fileName,
        extracted.file.mime,
        extracted.file.buffer,
      );
      if (!validated.ok) return validated;
      return { ok: true, fields: extracted.fields, file: validated.file };
    }
  } catch (formErr) {
    console.error('[cv-upload-form] FormData fallback failed:', formErr);
  }

  console.error('[cv-upload-form] could not extract file', {
    bodyBytes: body.byteLength,
    contentType,
    hasBoundary: /boundary=/i.test(contentType),
    manualHadParts: Boolean(manual),
  });

  return {
    ok: false,
    status: 400,
    message:
      'No pudimos leer el archivo subido. Prueba de nuevo con un PDF o Word (máx. 5 MB).',
  };
}
