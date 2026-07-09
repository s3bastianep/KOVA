import { prisma } from './prisma';

let schemaReady: boolean | null = null;

export async function isSchemaReady(): Promise<boolean> {
  if (schemaReady) return true;
  try {
    await prisma.$queryRaw`SELECT 1 FROM "tenants" LIMIT 1`;
    schemaReady = true;
    return true;
  } catch {
    return false;
  }
}

export async function waitForSchema(maxWaitMs = 20_000): Promise<boolean> {
  if (await isSchemaReady()) return true;

  const started = Date.now();
  while (Date.now() - started < maxWaitMs) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (await isSchemaReady()) return true;
  }

  return false;
}
