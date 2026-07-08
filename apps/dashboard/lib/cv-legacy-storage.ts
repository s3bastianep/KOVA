import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

/** Solo lectura de archivos legacy guardados en disco antes de migrar a PostgreSQL. */
const LEGACY_ROOT = path.join(process.cwd(), 'storage', 'cvs');

function legacyAbsolutePath(tenantId: string, candidateId: string) {
  return path.join(LEGACY_ROOT, tenantId, `${candidateId}.pdf`);
}

export async function readCandidateCvPdf(tenantId: string, candidateId: string): Promise<Buffer | null> {
  const abs = legacyAbsolutePath(tenantId, candidateId);
  try {
    await access(abs, constants.R_OK);
    return readFile(abs);
  } catch {
    return null;
  }
}
