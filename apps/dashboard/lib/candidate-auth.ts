import { NextRequest } from 'next/server';
import type { Candidate } from '@prisma/client';
import { prisma } from './prisma';
import { AuthUser, getUserFromRequest, unauthorized } from './auth';

async function createCandidateForUser(user: AuthUser): Promise<Candidate | null> {
  try {
    return await prisma.candidate.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        firstName: user.firstName || 'Candidato',
        lastName: user.lastName || 'Nuevo',
        email: user.email?.trim().toLowerCase() || null,
      },
    });
  } catch (error) {
    console.error('[candidate-auth] auto-create candidate failed:', error);
    try {
      return await prisma.candidate.findFirst({ where: { userId: user.id } });
    } catch {
      return null;
    }
  }
}

async function tryLinkCandidateUser(candidate: Candidate, userId: string) {
  if (candidate.userId === userId) return candidate;
  if (candidate.userId) return null;

  try {
    return await prisma.candidate.update({
      where: { id: candidate.id },
      data: { userId },
    });
  } catch (error) {
    console.error('[candidate-auth] auto-link userId failed:', error);
    return candidate;
  }
}

export async function getCandidateForUser(user: AuthUser): Promise<Candidate | null> {
  if (user.candidateId) {
    try {
      const byId = await prisma.candidate.findFirst({
        where: { id: user.candidateId, tenantId: user.tenantId },
      });
      if (byId) return tryLinkCandidateUser(byId, user.id);
    } catch (error) {
      console.error('[candidate-auth] lookup by candidateId failed:', error);
    }
  }

  try {
    const linked = await prisma.candidate.findFirst({ where: { userId: user.id } });
    if (linked) return linked;
  } catch (error) {
    console.error('[candidate-auth] lookup by userId failed:', error);
  }

  const email = user.email.trim().toLowerCase();
  if (!email) return null;

  try {
    const byEmail = await prisma.candidate.findFirst({
      where: {
        tenantId: user.tenantId,
        email,
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!byEmail) return createCandidateForUser(user);
    return tryLinkCandidateUser(byEmail, user.id);
  } catch (error) {
    console.error('[candidate-auth] lookup by email failed:', error);
    return createCandidateForUser(user);
  }
}

export async function requireCandidateUser(
  req: NextRequest,
): Promise<{ user: AuthUser; candidate: Candidate } | Response> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return unauthorized();
    if (user.role !== 'CANDIDATE') {
      return Response.json({ message: 'Acceso solo para candidatos' }, { status: 403 });
    }

    const candidate = await getCandidateForUser(user);
    if (!candidate) {
      return Response.json({ message: 'Perfil de candidato no encontrado' }, { status: 404 });
    }

    return { user, candidate };
  } catch (error) {
    console.error('[candidate-auth] requireCandidateUser failed:', error);
    return Response.json(
      { message: 'No pudimos validar tu perfil de candidato.' },
      { status: 500 },
    );
  }
}
