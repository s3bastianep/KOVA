import 'server-only';

import { randomUUID } from 'node:crypto';
import { unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { type CvFileFormat, cvFormatLabel, detectCvFileFormat } from './cv-file-formats';
import { extractCvFromText, type CvExtractionResult } from './cv-extract';

export class CvFileReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CvFileReadError';
  }
}

/** @deprecated Usar CvFileReadError */
export const CvPdfReadError = CvFileReadError;

function assertReadableText(text: string, format: CvFileFormat): string {
  const trimmed = text.trim();
  if (trimmed.length < 40) {
    throw new CvFileReadError(
      `El ${cvFormatLabel(format)} tiene muy poco texto legible. Exporta tu hoja de vida con texto seleccionable (formato ATS).`,
    );
  }
  return trimmed;
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
    throw new CvFileReadError('El archivo DOCX no parece válido. Guarda de nuevo desde Word como .docx.');
  }

  try {
    const mammoth = await import('mammoth');
    const { value } = await mammoth.extractRawText({ buffer });
    const text = assertReadableText(value ?? '', 'docx');
    return { result: extractCvFromText(text, fileName), text };
  } catch (err) {
    if (err instanceof CvFileReadError) throw err;
    throw new CvFileReadError('No pudimos leer el Word (.docx). Verifica que no esté dañado o protegido.');
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
    const text = assertReadableText(doc.getBody() ?? '', 'doc');
    return { result: extractCvFromText(text, fileName), text };
  } catch (err) {
    if (err instanceof CvFileReadError) throw err;
    throw new CvFileReadError('No pudimos leer el Word (.doc). Prueba guardar el archivo como .docx o PDF.');
  } finally {
    await unlink(tempPath).catch(() => undefined);
  }
}

export async function extractCvFromPdfBuffer(
  buffer: Buffer,
  fileName: string,
): Promise<{ result: CvExtractionResult; text: string }> {
  if (buffer.length < 5 || buffer.subarray(0, 4).toString('utf8') !== '%PDF') {
    throw new CvFileReadError('El archivo no parece un PDF válido. Exporta tu HV como PDF desde Word o Google Docs.');
  }

  try {
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const textResult = await parser.getText();
      const text = assertReadableText(textResult.text ?? '', 'pdf');
      return { result: extractCvFromText(text, fileName), text };
    } finally {
      await parser.destroy();
    }
  } catch (err) {
    if (err instanceof CvFileReadError) throw err;
    throw new CvFileReadError(
      'No pudimos leer el PDF. Verifica que no esté protegido, dañado o guardado solo como imagen.',
    );
  }
}
