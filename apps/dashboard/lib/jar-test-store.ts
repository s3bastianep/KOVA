import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getMockPortalCandidate, patchMockPortalMetadata } from '@/lib/mock';
import { isMockMode } from '@/lib/mock';
import { readRegistroMetadata, type RegistroMetadata } from '@/lib/registro-session';
import type { RiskJarResult } from '@/lib/risk-jar-game';

export type JarTestRecord = {
  completedAt: string;
  totalPoints: number;
  result: RiskJarResult;
};

export type JarTestStatus = {
  completed: boolean;
  completedAt?: string;
  totalPoints?: number;
};

export function readJarTest(metadata: unknown): JarTestRecord | null {
  const meta = readRegistroMetadata(metadata) as RegistroMetadata & { jarTest?: JarTestRecord };
  if (!meta.jarTest?.completedAt) return null;
  return meta.jarTest;
}

export function jarTestStatus(metadata: unknown): JarTestStatus {
  const record = readJarTest(metadata);
  if (!record) return { completed: false };
  return {
    completed: true,
    completedAt: record.completedAt,
    totalPoints: record.totalPoints,
  };
}

function mergeJarTestMeta(metadata: unknown, record: JarTestRecord): Prisma.InputJsonValue {
  const prev = readRegistroMetadata(metadata);
  return { ...prev, jarTest: record } as Prisma.InputJsonValue;
}

export async function persistJarTest(
  tenantId: string,
  candidateId: string,
  userId: string,
  result: RiskJarResult,
): Promise<JarTestRecord> {
  const record: JarTestRecord = {
    completedAt: new Date().toISOString(),
    totalPoints: result.totalSecured,
    result,
  };

  if (isMockMode()) {
    const existing = getMockPortalCandidate(userId);
    if (!existing) throw new Error('Candidato no encontrado');
    patchMockPortalMetadata(userId, { jarTest: record });
    return record;
  }

  const candidate = await prisma.candidate.findFirst({
    where: { id: candidateId, tenantId },
    select: { metadata: true },
  });
  if (!candidate) throw new Error('Candidato no encontrado');

  await prisma.candidate.update({
    where: { id: candidateId },
    data: { metadata: mergeJarTestMeta(candidate.metadata, record) },
  });

  return record;
}
