import { NextRequest } from 'next/server';
import type { Candidate } from '@prisma/client';
import { prisma } from './prisma';
import { AuthUser, getUserFromRequest, unauthorized } from './auth';
import { getMockPortalCandidate, ensureMockPortalCandidate, isMockMode } from './mock';

async function resolveCanonicalUser(user: AuthUser): Promise<AuthUser> {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        tenantId: true,
        companyId: true,
      },
    });
    if (!dbUser) return user;
    return {
      ...dbUser,
      candidateId: user.candidateId ?? null,
    };
  } catch (error) {
    console.error('[candidate-auth] resolve canonical user failed:', error);
    return user;
  }
}

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
  const canonical = await resolveCanonicalUser(user);

  if (canonical.candidateId) {
    try {
      const byId = await prisma.candidate.findFirst({
        where: { id: canonical.candidateId, tenantId: canonical.tenantId },
      });
      if (byId) return tryLinkCandidateUser(byId, user.id);
    } catch (error) {
      console.error('[candidate-auth] lookup by candidateId failed:', error);
    }

    try {
      const byIdAnyTenant = await prisma.candidate.findUnique({
        where: { id: canonical.candidateId },
      });
      if (byIdAnyTenant) return tryLinkCandidateUser(byIdAnyTenant, canonical.id);
    } catch (error) {
      console.error('[candidate-auth] lookup by candidateId (any tenant) failed:', error);
    }
  }

  try {
    const linked = await prisma.candidate.findFirst({ where: { userId: canonical.id } });
    if (linked) return linked;
  } catch (error) {
    console.error('[candidate-auth] lookup by userId failed:', error);
  }

  const email = canonical.email.trim().toLowerCase();
  if (!email) return createCandidateForUser(canonical);

  try {
    const byEmail = await prisma.candidate.findFirst({
      where: {
        tenantId: canonical.tenantId,
        email,
      },
      orderBy: { createdAt: 'desc' },
    });
    if (byEmail) return tryLinkCandidateUser(byEmail, canonical.id);

    const byEmailAnyTenant = await prisma.candidate.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });
    if (byEmailAnyTenant) return tryLinkCandidateUser(byEmailAnyTenant, canonical.id);

    return createCandidateForUser(canonical);
  } catch (error) {
    console.error('[candidate-auth] lookup by email failed:', error);
    return createCandidateForUser(canonical);
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

    if (isMockMode()) {
      const mock =
        getMockPortalCandidate(user.id) ??
        ensureMockPortalCandidate({
          userId: user.id,
          tenantId: user.tenantId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });

      return {
        user,
        candidate: {
          id: mock.id,
          tenantId: mock.tenantId,
          firstName: mock.firstName,
          lastName: mock.lastName,
          email: mock.email,
          phone: mock.phone,
          city: mock.city,
          linkedinUrl: null,
          source: 'Portal candidato',
          status: 'ACTIVE',
          overallScore: null,
          compatibility: null,
          ranking: null,
          cvText: null,
          profileSummary: null,
          flaggedRisks: null,
          metadata: mock.metadata,
          userId: mock.userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Candidate,
      };
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
