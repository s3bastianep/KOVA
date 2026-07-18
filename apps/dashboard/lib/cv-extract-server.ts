import 'server-only';

import { randomUUID } from 'node:crypto';
import { unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { type CvFileFormat, cvFormatLabel, detectCvFileFormat } from './cv-file-formats';
import { extractCvFromText, type CvExtractionResult } from './cv-extract';
import { htmlToStructuredText, normalizeCvText } from './cv-text-pipeline';

export class CvFileReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CvFileReadError';
  }
}

/** @deprecated Usar CvFileReadError */
export const CvPdfReadError = CvFileReadError;

function assertReadableText(text: string, format: CvFileFormat): string {
  const normalized = normalizeCvText(text);
  if (normalized.length < 40) {
    throw new CvFileReadError(
      `El ${cvFormatLabel(format)} tiene muy poco texto legible. Exporta tu hoja de vida con texto seleccionable (no como imagen escaneada).`,
    );
  }
  return normalized;
}

function joinPdfPages(textResult: {
  text?: string;
  pages?: Array<{ text?: string }>;
}): string {
  const pageTexts = (textResult.pages ?? [])
    .map((page) => page.text?.trim())
    .filter((t): t is string => Boolean(t));

  if (pageTexts.length > 1) {
    return normalizeCvText(pageTexts.join('\n\n'));
  }

  return normalizeCvText(textResult.text ?? '');
}

export async function extractCvFromFileBuffer(
  buffer: Buffer,
  fileName: string,
  mime = '',
): Promise<{ result: CvExtractionResult; text: string; format: CvFileFormat }> {
  const format = detectCvFileFormat(fileName, mime);
  if (!format) {
    throw new CvFileReadError('Formato no soportado. Usa PDF, DOC o DOCX.');
  }

  if (format === 'pdf') {
    const parsed = await extractCvFromPdfBuffer(buffer, fileName);
    return { ...parsed, format };
  }
  if (format === 'docx') {
    const parsed = await extractCvFromDocxBuffer(buffer, fileName);
    return { ...parsed, format };
  }
  const parsed = await extractCvFromDocBuffer(buffer, fileName);
  return { ...parsed, format };
}

export async function extractCvFromDocxBuffer(
  buffer: Buffer,
  fileName: string,
): Promise<{ result: CvExtractionResult; text: string }> {
  if (buffer.length < 4 || buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
    throw new CvFileReadError(
      'El archivo DOCX no parece válido. Guarda de nuevo desde Word como .docx.',
    );
  }

  try {
    const mammoth = await import('mammoth');
    const htmlResult = await mammoth.convertToHtml(
      { buffer },
      {
        styleMap: [
          "p[style-name='Heading 1'] => h1",
          "p[style-name='Heading 2'] => h2",
          "p[style-name='Título 1'] => h1",
          "p[style-name='Título 2'] => h2",
          "p[style-name='Heading 3'] => h3",
          "p[style-name='Título 3'] => h3",
        ],
      },
    );

    let text = htmlToStructuredText(htmlResult.value ?? '');

    if (text.length < 80) {
      const rawResult = await mammoth.extractRawText({ buffer });
      const rawText = normalizeCvText(rawResult.value ?? '');
      if (rawText.length > text.length) text = rawText;
    }

    text = assertReadableText(text, 'docx');
    return { result: extractCvFromText(text, fileName), text };
  } catch (err) {
    if (err instanceof CvFileReadError) throw err;
    throw new CvFileReadError(
      'No pudimos leer el Word (.docx). Verifica que no esté dañado o protegido.',
    );
  }
}

export async function extractCvFromDocBuffer(
  buffer: Buffer,
  fileName: string,
): Promise<{ result: CvExtractionResult; text: string }> {
  const tempPath = join(tmpdir(), `kova-cv-${randomUUID()}.doc`);
  try {
    await writeFile(tempPath, buffer);
    const WordExtractor = (await import('word-extractor')).default;
    const extractor = new WordExtractor();
    const doc = await extractor.extract(tempPath);
    const parts = [doc.getBody(), doc.getHeaders({ includeFooters: false })].filter(Boolean);
    const text = assertReadableText(parts.join('\n\n'), 'doc');
    return { result: extractCvFromText(text, fileName), text };
  } catch (err) {
    if (err instanceof CvFileReadError) throw err;
    throw new CvFileReadError(
      'No pudimos leer el Word (.doc). Prueba guardar el archivo como .docx o PDF.',
    );
  } finally {
    await unlink(tempPath).catch(() => undefined);
  }
}

async function extractPdfTextPrimary(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import('pdf-parse');
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const textResult = await parser.getText({
      lineThreshold: 4,
      cellThreshold: 7,
      pageJoiner: '\n\n',
    });
    return joinPdfPages(textResult);
  } finally {
    await parser.destroy().catch(() => undefined);
  }
}

/** Fallback: API node de pdf-parse / getText sin opciones finas. */
async function extractPdfTextFallback(buffer: Buffer): Promise<string> {
  try {
    const mod = await import('pdf-parse/node');
    const PDFParse =
      (mod as { PDFParse?: unknown }).PDFParse ?? (mod as { default?: unknown }).default;
    if (typeof PDFParse !== 'function') return '';
    // @ts-expect-error — constructor tipado de forma distinta entre builds
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const textResult = await parser.getText();
      return joinPdfPages(textResult);
    } finally {
      await parser.destroy?.().catch(() => undefined);
    }
  } catch {
    return '';
  }
}

export async function extractCvFromPdfBuffer(
  buffer: Buffer,
  fileName: string,
): Promise<{ result: CvExtractionResult; text: string }> {
  if (buffer.length < 5 || buffer.subarray(0, 4).toString('utf8') !== '%PDF') {
    throw new CvFileReadError(
      'El archivo no parece un PDF válido. Exporta tu HV como PDF desde Word o Google Docs.',
    );
  }

  let text = '';
  let primaryError: unknown;

  try {
    text = await extractPdfTextPrimary(buffer);
  } catch (err) {
    primaryError = err;
    console.error('[cv-extract-server] pdf primary failed:', err);
  }

  if (normalizeCvText(text).length < 40) {
    const fallback = await extractPdfTextFallback(buffer);
    if (normalizeCvText(fallback).length > normalizeCvText(text).length) {
      text = fallback;
    }
  }

  try {
    text = assertReadableText(text, 'pdf');
  } catch (err) {
    if (err instanceof CvFileReadError) {
      if (primaryError) {
        throw new CvFileReadError(
          'No pudimos leer el PDF. Verifica que tenga texto seleccionable (no solo imagen escaneada) y que no esté protegido.',
        );
      }
      throw err;
    }
    throw err;
  }

  return { result: extractCvFromText(text, fileName), text };
}
