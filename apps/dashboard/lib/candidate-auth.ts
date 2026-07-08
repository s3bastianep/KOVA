import { NextRequest } from 'next/server';
import type { Candidate } from '@prisma/client';
import { prisma } from './prisma';
import { AuthUser, getUserFromRequest, unauthorized } from './auth';

export async function getCandidateForUser(user: AuthUser): Promise<Candidate | null> {
  try {
    const linked = await prisma.candidate.findFirst({ where: { userId: user.id } });
    if (linked) return linked;
  } catch (error) {
    console.error('[candidate-auth] lookup by userId failed:', error);
  }

  try {
    const byEmail = await prisma.candidate.findFirst({
      where: {
        tenantId: user.tenantId,
        email: { equals: user.email, mode: 'insensitive' },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!byEmail) return null;

    if (!byEmail.userId) {
      try {
        return await prisma.candidate.update({
          where: { id: byEmail.id },
          data: { userId: user.id },
        });
      } catch (linkError) {
        console.error('[candidate-auth] auto-link userId failed:', linkError);
        return byEmail;
      }
    }

    return byEmail.userId === user.id ? byEmail : null;
  } catch (error) {
    console.error('[candidate-auth] lookup by email failed:', error);
    return null;
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
