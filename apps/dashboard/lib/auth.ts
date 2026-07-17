import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { prisma } from './prisma';
import { isMockMode, MOCK_USER } from './mock';

if (!process.env.JWT_SECRET) {
  throw new Error(
    'JWT_SECRET no está definido. Configúralo en tu .env (ver .env.example) — no hay valor por defecto porque ' +
      'un secreto público en el código permite falsificar tokens de cualquier rol, incluido SUPER_ADMIN.',
  );
}

const JWT_SECRET = process.env.JWT_SECRET;
// Access token corto: si lo roban (p. ej. vía XSS en localStorage) vale máximo 1 hora.
// La sesión larga vive en el refresh token HttpOnly con revocación en DB (lib/session.ts).
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1h';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  companyId?: string | null;
  candidateId?: string | null;
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
      ...(user.candidateId ? { candidateId: user.candidateId } : {}),
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
      candidateId?: string | null;
    };

    if (isMockMode()) {
      return {
        id: payload.sub,
        email: payload.email,
        firstName: payload.firstName ?? MOCK_USER.firstName,
        lastName: payload.lastName ?? '',
        role: payload.role,
        tenantId: payload.tenantId,
        companyId: payload.companyId ?? null,
        candidateId: payload.candidateId ?? null,
      };
    }

    // CANDIDATE tokens are now validated against the DB too (below), same as staff — a token
    // for a deleted/suspended candidate account must stop working before its 7-day expiry.

    try {
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
      return {
        ...user,
        candidateId: payload.candidateId ?? null,
      };
    } catch (dbError) {
      console.error('[auth] DB lookup failed:', dbError);
      return null;
    }
  } catch {
    return null;
  }
}

export function unauthorized() {
  return Response.json({ message: 'No autorizado' }, { status: 401 });
}

/**
 * 403 para usuarios autenticados sin permiso (p. ej. CLIENT en rutas internas).
 * Debe ser 403 y no 401: el cliente interpreta 401 como sesión expirada y cierra sesión.
 */
export function forbidden() {
  return Response.json({ message: 'No tienes permiso para acceder a esta sección' }, { status: 403 });
}

/**
 * True for every role except CANDIDATE. Self-registered portal candidates share a tenant with
 * ATS staff/clients, so every internal (non-portal) route MUST reject CANDIDATE explicitly —
 * tenantId scoping alone does not separate them. Use as: `if (!isStaffRole(user.role)) return unauthorized();`
 */
export function isStaffRole(role: UserRole): boolean {
  return role !== 'CANDIDATE';
}

/**
 * Roles internos de Kova (excluye CLIENT y CANDIDATE). Las herramientas operativas
 * (CRM, agenda, tareas, reportes, etc.) contienen datos de TODOS los clientes del tenant,
 * así que un usuario CLIENT (empresa cliente) no debe poder consultarlas.
 * Usar como: `if (!isInternalRole(user.role)) return unauthorized();`
 */
export function isInternalRole(role: UserRole): boolean {
  return role !== 'CANDIDATE' && role !== 'CLIENT';
}

/**
 * Fragmento `where` de Prisma para queries sobre Candidate. Un usuario CLIENT solo puede
 * ver candidatos vinculados a vacantes de SU empresa; los roles internos ven todo el tenant.
 */
export function candidateWhereForUser(user: AuthUser) {
  if (user.role === 'CLIENT') {
    return {
      tenantId: user.tenantId,
      vacancies: { some: { vacancy: { companyId: user.companyId ?? 'none' } } },
    };
  }
  return { tenantId: user.tenantId };
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
