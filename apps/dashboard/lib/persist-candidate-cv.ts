import type { Prisma } from '@prisma/client';
import { prisma } from './prisma';
import { cvDownloadUrl, toDbBytes } from './cv-storage';
import { mergeRegistroMetadata, readRegistroMetadata, type RegistroMetadata } from './registro-session';
import type { CvExtractionResult } from './cv-extract';

export async function persistCandidateCvFile(params: {
  tenantId: string;
  candidateId: string;
  fileName: string;
  buffer: Buffer;
  extractedText: string;
  extraction?: CvExtractionResult;
  metadataPatch?: RegistroMetadata;
}) {
  const { tenantId, candidateId, fileName, buffer, extractedText, extraction, metadataPatch } = params;
  const url = cvDownloadUrl(candidateId);

  const candidate = await prisma.candidate.findFirst({
    where: { id: candidateId, tenantId },
    select: { id: true, metadata: true },
  });
  if (!candidate) return;

  const prevMeta = readRegistroMetadata(candidate.metadata);
  const metadata = mergeRegistroMetadata(prevMeta, {
    cvImportedAt: new Date().toISOString(),
    cvFileName: fileName,
    cvTextLength: extractedText.length,
    cvExtraction: extraction
      ? {
          suggestions: extraction.suggestions,
          warnings: extraction.warnings,
          reviewFields: extraction.reviewFields,
        }
      : prevMeta.cvExtraction,
    ...(metadataPatch ?? {}),
  });

  const existingDoc = await prisma.document.findFirst({
    where: { tenantId, candidateId, type: 'CV' },
    select: { id: true },
  });

  const docData = {
    name: fileName,
    url,
    mimeType: 'application/pdf',
    sizeBytes: buffer.byteLength,
    content: toDbBytes(buffer),
  };

  await prisma.$transaction([
    prisma.candidate.update({
      where: { id: candidateId },
      data: {
        cvText: extractedText,
        metadata: metadata as Prisma.InputJsonValue,
      },
    }),
    existingDoc
      ? prisma.document.update({
          where: { id: existingDoc.id },
          data: docData,
        })
      : prisma.document.create({
          data: {
            tenantId,
            candidateId,
            type: 'CV',
            ...docData,
          },
        }),
  ]);
}
