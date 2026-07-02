import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { prisma } from './prisma';
import { isMockMode, MOCK_USER } from './mock';

const JWT_SECRET = process.env.JWT_SECRET ?? 'kova-dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  companyId?: string | null;
}

export function signToken(user: AuthUser): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      firstName: user.firstName,
      lastName: user.lastName,
      companyId: user.companyId,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions,
  );
}

export async function getUserFromRequest(req: NextRequest): Promise<AuthUser | null> {
  const header = req.headers.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      email: string;
      role: UserRole;
      tenantId: string;
      firstName?: string;
      lastName?: string;
      companyId?: string | null;
    };

    if (isMockMode()) {
      return {
        id: payload.sub,
        email: payload.email,
        firstName: payload.firstName ?? MOCK_USER.firstName,
        lastName: payload.lastName ?? MOCK_USER.lastName,
        role: payload.role,
        tenantId: payload.tenantId,
        companyId: payload.companyId ?? null,
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        tenantId: true,
        companyId: true,
        status: true,
      },
    });
    if (!user || user.status !== 'ACTIVE') return null;
    return user;
  } catch {
    return null;
  }
}

export function unauthorized() {
  return Response.json({ message: 'No autorizado' }, { status: 401 });
}

export function companyWhereForUser(user: AuthUser) {
  if (user.role === 'SUPER_ADMIN' || user.role === 'COORDINATOR') {
    return { tenantId: user.tenantId };
  }
  if (user.role === 'CLIENT') {
    return { tenantId: user.tenantId, id: user.companyId ?? 'none' };
  }
  return { tenantId: user.tenantId, consultants: { some: { consultantId: user.id } } };
}
