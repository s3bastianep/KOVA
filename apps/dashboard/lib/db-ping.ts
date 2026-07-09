import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

const TRANSIENT_DB_CODES = new Set(['P1001', 'P1002', 'P1017']);

export function isTransientDbError(err: unknown): boolean {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return TRANSIENT_DB_CODES.has(err.code);
  }
  if (err instanceof Prisma.PrismaClientInitializationError) return true;

  const message = err instanceof Error ? err.message : String(err);
  return /connect|ECONNREFUSED|timeout|can't reach|database server/i.test(message);
}

export function isSchemaMissingError(err: unknown): boolean {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return err.code === 'P2021' || err.code === 'P2022';
  }
  const message = err instanceof Error ? err.message : String(err);
  return /does not exist|relation .* does not exist/i.test(message);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function pingDatabase(timeoutMs = 4000): Promise<boolean> {
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('database ping timeout')), timeoutMs);
      }),
    ]);
    return true;
  } catch {
    return false;
  }
}

export async function withDbRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (!isTransientDbError(err) || attempt === attempts - 1) throw err;
      await sleep(1500 * (attempt + 1));
    }
  }
  throw lastError;
}
