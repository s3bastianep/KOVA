import { NextRequest } from 'next/server';
import type { Candidate } from '@prisma/client';
import { prisma } from './prisma';
import { AuthUser, getUserFromRequest, unauthorized } from './auth';

export async function getCandidateForUser(userId: string): Promise<Candidate | null> {
  return prisma.candidate.findFirst({ where: { userId } });
}

export async function requireCandidateUser(
  req: NextRequest,
): Promise<{ user: AuthUser; candidate: Candidate } | Response> {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (user.role !== 'CANDIDATE') {
    return Response.json({ message: 'Acceso solo para candidatos' }, { status: 403 });
  }

  const candidate = await getCandidateForUser(user.id);
  if (!candidate) {
    return Response.json({ message: 'Perfil de candidato no encontrado' }, { status: 404 });
  }

  return { user, candidate };
}
