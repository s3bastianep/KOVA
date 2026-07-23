/**
 * Quita duplicados de (tenantId, slotKey) en agenda_requests antes de
 * aplicar el UNIQUE, dejando la fila más reciente por createdAt.
 * Si la tabla aún no existe, no hace nada.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  const result = await prisma.$executeRaw`
    DELETE FROM agenda_requests
    WHERE id IN (
      SELECT id FROM (
        SELECT id,
               ROW_NUMBER() OVER (
                 PARTITION BY "tenantId", "slotKey"
                 ORDER BY "createdAt" DESC, id DESC
               ) AS rn
        FROM agenda_requests
        WHERE "slotKey" IS NOT NULL
      ) ranked
      WHERE rn > 1
    )
  `;
  console.log(`[litt-hunter] Dedupe agenda_requests: ${result} fila(s) eliminada(s).`);
} catch (error) {
  const msg = error instanceof Error ? error.message : String(error);
  if (/does not exist|relation .* does not exist/i.test(msg)) {
    console.log('[litt-hunter] agenda_requests aún no existe; se omite dedupe.');
  } else {
    console.error('[litt-hunter] Dedupe agenda_requests falló:', msg);
    process.exit(1);
  }
} finally {
  await prisma.$disconnect();
}
