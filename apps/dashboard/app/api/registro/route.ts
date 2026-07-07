import { NextRequest } from 'next/server';
import {
  type CommercialProfile,
  profileToStandardAnswers,
  splitFullName,
} from '../../../lib/candidate-commercial-profile';
import { getPublicTenantId } from '../../../lib/public-tenant';
import { prisma } from '../../../lib/prisma';
import { isMockMode } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    title: 'Panel de candidato',
    subtitle:
      'Completa tu perfil comercial en 6 pasos. Te contactaremos si hay vacantes compatibles. No verás puntajes ni ofertas aquí.',
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const profile = (body.profile ?? {}) as CommercialProfile;
  const split = splitFullName(
    String(body.firstName && body.lastName ? `${body.firstName} ${body.lastName}` : profile.nombre ?? ''),
  );
  const firstName = String(body.firstName ?? split.firstName).trim();
  const lastName = String(body.lastName ?? split.lastName).trim();
  const email = String(profile.email ?? body.email ?? '').trim().toLowerCase();

  if (!firstName || !lastName || !email) {
    return Response.json({ message: 'Nombre y correo son obligatorios' }, { status: 400 });
  }

  if (!/.+@.+\..+/.test(email)) {
    return Response.json({ message: 'Correo electrónico no válido' }, { status: 400 });
  }

  const standardAnswers = profileToStandardAnswers({ ...profile, email, nombre: `${firstName} ${lastName}` });

  if (isMockMode()) {
    return Response.json({
      ok: true,
      message: 'Perfil registrado correctamente. Te contactaremos si hay vacantes compatibles.',
    });
  }

  const tenantId = await getPublicTenantId();

  const existing = await prisma.candidate.findFirst({
    where: { tenantId, email: { equals: email, mode: 'insensitive' } },
    select: { id: true, metadata: true },
  });

  const prevMeta =
    existing?.metadata && typeof existing.metadata === 'object'
      ? (existing.metadata as Record<string, unknown>)
      : {};

  const metadata = {
    ...prevMeta,
    registrationType: 'talent_pool',
    registeredAt: new Date().toISOString(),
    commercialProfile: { ...profile, email, nombre: `${firstName} ${lastName}` },
    standardAnswers,
  };

  const data = {
    firstName,
    lastName,
    email,
    phone: null as string | null,
    city: profile.ciudad?.trim() || standardAnswers.city || null,
    linkedinUrl: null as string | null,
    source: 'Registro web',
    status: 'ACTIVE' as const,
    metadata,
  };

  if (existing) {
    await prisma.candidate.update({ where: { id: existing.id }, data });
    return Response.json({
      ok: true,
      candidateId: existing.id,
      updated: true,
      message: 'Actualizamos tu perfil. Te contactaremos si hay vacantes compatibles.',
    });
  }

  const candidate = await prisma.candidate.create({
    data: { tenantId, ...data },
  });

  return Response.json({
    ok: true,
    candidateId: candidate.id,
    updated: false,
    message: 'Perfil registrado correctamente. Te contactaremos si hay vacantes compatibles.',
  });
}
