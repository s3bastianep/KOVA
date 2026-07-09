import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { getPublicTenantId } from '@/lib/public-tenant';
import { isMockMode, upsertMockPortalCandidate, getMockPortalCandidateByEmail } from '@/lib/mock';
import { splitFullName } from '@/lib/candidate-commercial-profile';
import type { CommercialProfile } from '@/lib/candidate-commercial-profile';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

type RegisterBody = {
  nombre?: string;
  email?: string;
  telefono?: string;
  ciudad?: string;
  password?: string;
  consentimientoDatos?: boolean;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as RegisterBody;

  const nombre = String(body.nombre ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const telefono = String(body.telefono ?? '').trim();
  const ciudad = String(body.ciudad ?? '').trim();
  const password = String(body.password ?? '');
  const consentimientoDatos = Boolean(body.consentimientoDatos);

  if (!nombre || !email || !telefono || !password) {
    return Response.json({ message: 'Completa todos los campos obligatorios' }, { status: 400 });
  }

  if (!/.+@.+\..+/.test(email)) {
    return Response.json({ message: 'Correo electrónico inválido' }, { status: 400 });
  }

  if (password.length < 8) {
    return Response.json({ message: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 });
  }

  if (!consentimientoDatos) {
    return Response.json({ message: 'Debes aceptar el tratamiento de datos personales' }, { status: 400 });
  }

  const { firstName, lastName } = splitFullName(nombre);
  if (!firstName) {
    return Response.json({ message: 'Ingresa tu nombre completo' }, { status: 400 });
  }

  if (isMockMode()) {
    if (getMockPortalCandidateByEmail(email)) {
      return Response.json(
        { message: 'Este correo ya está registrado. Inicia sesión para continuar.' },
        { status: 409 },
      );
    }

    const authUser = {
      id: `mock-candidate-${Date.now()}`,
      email,
      firstName,
      lastName,
      role: 'CANDIDATE' as const,
      tenantId: 'mock-tenant-001',
      companyId: null,
      candidateId: `mock-cand-${Date.now()}`,
    };
    upsertMockPortalCandidate({
      userId: authUser.id,
      tenantId: authUser.tenantId,
      firstName,
      lastName,
      email,
      telefono: telefono || undefined,
      ciudad: ciudad || undefined,
      password,
      commercialProfile: {
        nombre,
        email,
        telefono,
        ...(ciudad ? { ciudad } : {}),
        consentimientoDatos: true,
      },
    });
    return Response.json({
      user: authUser,
      accessToken: signToken(authUser),
      refreshToken: randomBytes(32).toString('hex'),
    });
  }

  try {
    const tenantId = await getPublicTenantId();

    const existingUser = await prisma.user.findFirst({
      where: { tenantId, email },
      select: { id: true },
    });
    if (existingUser) {
      return Response.json(
        { message: 'Este correo ya está registrado. Inicia sesión para continuar.' },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const commercialProfile: CommercialProfile = {
      nombre,
      email,
      telefono,
      ...(ciudad ? { ciudad } : {}),
      consentimientoDatos: true,
    };

    const result = await prisma.$transaction(
      async (tx) => {
        const candidate = await tx.candidate.create({
          data: {
            tenantId,
            firstName,
            lastName,
            email,
            phone: telefono,
            city: ciudad || null,
            source: 'Portal candidato',
            status: 'ACTIVE',
            metadata: {
              registrationType: 'portal_signup',
              registeredAt: new Date().toISOString(),
              profileStatus: 'account_only',
              onboardingStep: 'welcome',
              commercialProfile,
            },
          },
        });

        const user = await tx.user.create({
          data: {
            tenantId,
            email,
            passwordHash,
            firstName,
            lastName,
            phone: telefono,
            role: 'CANDIDATE',
            status: 'ACTIVE',
            emailVerified: false,
          },
        });

        await tx.candidate.update({
          where: { id: candidate.id },
          data: { userId: user.id },
        });

        return { user, candidate };
      },
      { maxWait: 5_000, timeout: 15_000 },
    );

    const authUser = {
      id: result.user.id,
      email: result.user.email,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      role: result.user.role,
      tenantId: result.user.tenantId,
      companyId: result.user.companyId,
      candidateId: result.candidate.id,
    };

    return Response.json({
      user: authUser,
      accessToken: signToken(authUser),
      refreshToken: randomBytes(32).toString('hex'),
    });
  } catch (err) {
    console.error('[auth/candidate/register]', err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return Response.json(
          { message: 'Este correo ya está registrado. Inicia sesión para continuar.' },
          { status: 409 },
        );
      }
      if (err.code === 'P2021' || err.code === 'P2022') {
        return Response.json(
          { message: 'El sistema se está preparando. Espera un minuto e intenta de nuevo.' },
          { status: 503 },
        );
      }
      if (err.code === 'P1001' || err.code === 'P1002' || err.code === 'P2024') {
        return Response.json(
          { message: 'La base de datos está ocupada. Intenta de nuevo en unos segundos.' },
          { status: 503 },
        );
      }
    }

    return Response.json(
      { message: 'No pudimos crear tu cuenta. Intenta de nuevo en unos minutos.' },
      { status: 503 },
    );
  }
}
