import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, companyWhereForUser } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_COMPANIES } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  if (isMockMode()) return Response.json(MOCK_COMPANIES);

  const companies = await prisma.company.findMany({
    where: companyWhereForUser(user),
    include: {
      consultants: {
        include: { consultant: { select: { id: true, firstName: true, lastName: true, email: true } } },
      },
      _count: { select: { vacancies: true, contacts: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return Response.json(companies);
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (user.role === 'CLIENT') {
    return Response.json({ message: 'No autorizado' }, { status: 403 });
  }

  const dto = await req.json().catch(() => ({}));
  if (!dto.name) {
    return Response.json({ message: 'El nombre es obligatorio' }, { status: 400 });
  }

  const company = await prisma.company.create({
    data: {
      tenantId: user.tenantId,
      name: dto.name,
      sector: dto.sector,
      industry: dto.industry,
      employeeCount: dto.employeeCount,
      city: dto.city,
      address: dto.address,
      website: dto.website,
      status: dto.status,
      primaryContact: dto.primaryContact,
      commercialDir: dto.commercialDir,
      generalManager: dto.generalManager,
      phone: dto.phone,
      email: dto.email,
      notes: dto.notes,
      consultants:
        user.role === 'CONSULTANT'
          ? { create: { consultantId: user.id, isPrimary: true } }
          : dto.consultantId
            ? { create: { consultantId: dto.consultantId, isPrimary: true } }
            : undefined,
    },
  });

  await prisma.activityLog.create({
    data: {
      tenantId: user.tenantId,
      userId: user.id,
      companyId: company.id,
      type: 'CREATE',
      entity: 'Company',
      entityId: company.id,
      description: `Empresa "${company.name}" creada`,
    },
  });

  return Response.json(company, { status: 201 });
}
