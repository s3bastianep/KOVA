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
    const created = await createCandidateAccount({
      email,
      firstName,
      lastName,
      telefono,
      ciudad,
      password,
      nombre,
    });

    const authUser = {
      id: created.user.id,
      email: created.user.email,
      firstName: created.user.firstName,
      lastName: created.user.lastName,
      role: created.user.role,
      tenantId: created.user.tenantId,
      companyId: created.user.companyId,
      candidateId: created.candidate.id,
    };

    return Response.json({
      user: authUser,
      accessToken: signToken(authUser),
      refreshToken: randomBytes(32).toString('hex'),
    });
  } catch (err) {
    console.error('[auth/candidate/register]', err);

    if (err instanceof Error && err.message === 'EMAIL_EXISTS') {
      return Response.json(
        { message: 'Este correo ya está registrado. Inicia sesión para continuar.' },
        { status: 409 },
      );
    }

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
    }

    return Response.json(
      { message: 'No pudimos crear tu cuenta. Intenta de nuevo en unos minutos.' },
      { status: 503 },
    );
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isSchemaMissingError(err: unknown) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return err.code === 'P2021' || err.code === 'P2022';
  }
  const message = err instanceof Error ? err.message : String(err);
  return /does not exist|relation .* does not exist/i.test(message);
}

async function createCandidateAccount(input: {
  email: string;
  firstName: string;
  lastName: string;
  telefono: string;
  ciudad: string;
  password: string;
  nombre: string;
}) {
  const { email, firstName, lastName, telefono, ciudad, password, nombre } = input;
  let lastError: unknown;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const tenantId = await getPublicTenantId();

      const existingUser = await prisma.user.findFirst({
        where: { tenantId, email },
        select: { id: true },
      });
      if (existingUser) {
        const conflict = new Error('EMAIL_EXISTS');
        (conflict as Error & { statusCode: number }).statusCode = 409;
        throw conflict;
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const commercialProfile: CommercialProfile = {
        nombre,
        email,
        telefono,
        ...(ciudad ? { ciudad } : {}),
        consentimientoDatos: true,
      };

      return await prisma.$transaction(async (tx) => {
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
      });
    } catch (err) {
      lastError = err;
      if (err instanceof Error && err.message === 'EMAIL_EXISTS') throw err;
      if (!isSchemaMissingError(err) || attempt === 4) throw err;
      await sleep(2000 * (attempt + 1));
    }
  }

  throw lastError;
}
