export type CvFileFormat = 'pdf' | 'docx' | 'doc';

export const CV_FILE_ACCEPT =
  '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export function detectCvFileFormat(fileName: string, mime = ''): CvFileFormat | null {
  const lower = fileName.toLowerCase().trim();
  const m = mime.toLowerCase();

  if (lower.endsWith('.pdf') || m.includes('pdf')) return 'pdf';
  if (
    lower.endsWith('.docx') ||
    m.includes('wordprocessingml') ||
    m.includes('officedocument.wordprocessingml')
  ) {
    return 'docx';
  }
  if (lower.endsWith('.doc') || m === 'application/msword') return 'doc';

  return null;
}

export function cvMimeType(format: CvFileFormat): string {
  if (format === 'pdf') return 'application/pdf';
  if (format === 'docx') {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  return 'application/msword';
}

export function cvFormatLabel(format: CvFileFormat): string {
  if (format === 'pdf') return 'PDF';
  if (format === 'docx') return 'Word (DOCX)';
  return 'Word (DOC)';
}
