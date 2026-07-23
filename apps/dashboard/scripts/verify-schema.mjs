import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  await prisma.$queryRaw`SELECT 1 FROM "tenants" LIMIT 1`;
  console.log('[litt-hunter] Tabla tenants verificada.');
} catch (error) {
  console.error('[litt-hunter] Esquema incompleto:', error instanceof Error ? error.message : error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
