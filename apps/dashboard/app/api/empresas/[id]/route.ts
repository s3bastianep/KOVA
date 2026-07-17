import { NextRequest } from 'next/server';
import { withApiErrors } from '@/lib/api-handler';
import { getUserFromRequest, unauthorized, companyWhereForUser, isStaffRole } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { isMockMode, getMockCompany } from '../../../../lib/mock';
import { computeProcessPipelineMetrics } from '../../../../lib/process-metrics';

export const dynamic = 'force-dynamic';

export const GET = withApiErrors('empresas/[id]', handleGET);

async function handleGET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isStaffRole(user.role)) return unauthorized();

  const { id } = await params;

  if (isMockMode()) {
    const company = getMockCompany(id);
    if (!company) return Response.json({ message: 'Empresa no encontrada' }, { status: 404 });
    return Response.json(company);
  }

  const company = await prisma.company.findFirst({
    where: { id, ...companyWhereForUser(user) },
    include: {
      contacts: true,
      consultants: {
        include: { consultant: { select: { id: true, firstName: true, lastName: true, email: true } } },
      },
      vacancies: {
        orderBy: { updatedAt: 'desc' },
        include: { candidates: { select: { stage: true } } },
      },
      followUps: { orderBy: { createdAt: 'desc' }, take: 20 },
      crmInteractions: { orderBy: { createdAt: 'desc' }, take: 20 },
      documents: { orderBy: { createdAt: 'desc' }, take: 20 },
      contracts: true,
      invoices: { orderBy: { createdAt: 'desc' }, take: 10 },
      activities: { orderBy: { createdAt: 'desc' }, take: 30 },
      discoveries: {
        where: { vacancyId: null },
        orderBy: { updatedAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!company) return Response.json({ message: 'Empresa no encontrada' }, { status: 404 });

  const { vacancies, ...rest } = company;
  return Response.json({
    ...rest,
    vacancies: vacancies.map(({ candidates, ...vacancy }) => ({
      ...vacancy,
      _count: { candidates: candidates.length },
      pipelineMetrics: computeProcessPipelineMetrics(candidates.map((c) => c.stage)),
    })),
  });
}

export const PATCH = withApiErrors('empresas/[id]', handlePATCH);

async function handlePATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isStaffRole(user.role)) return unauthorized();
  if (user.role === 'CLIENT') {
    return Response.json({ message: 'No autorizado' }, { status: 403 });
  }

  const { id } = await params;
  const dto = await req.json().catch(() => ({}));

  if (isMockMode()) {
    const company = getMockCompany(id);
    if (!company) return Response.json({ message: 'Empresa no encontrada' }, { status: 404 });
    return Response.json(company);
  }

  const existing = await prisma.company.findFirst({
    where: { id, ...companyWhereForUser(user) },
  });
  if (!existing) return Response.json({ message: 'Empresa no encontrada' }, { status: 404 });

  const discovery = dto.discovery as Record<string, unknown> | undefined;

  const company = await prisma.company.update({
    where: { id },
    data: {
      name: dto.name ?? existing.name,
      sector: dto.sector ?? undefined,
      industry: dto.industry ?? undefined,
      city: dto.city ?? undefined,
      address: dto.address ?? undefined,
      website: dto.website ?? undefined,
      primaryContact: dto.primaryContact ?? undefined,
      commercialDir: dto.commercialDir ?? undefined,
      phone: dto.phone ?? undefined,
      email: dto.email ?? undefined,
      status: dto.status ?? undefined,
      metadata: discovery ? ({ discovery } as object) : undefined,
    },
  });

  if (discovery) {
    const clientDiscovery = await prisma.commercialDiscovery.findFirst({
      where: { companyId: id, vacancyId: null },
      orderBy: { updatedAt: 'desc' },
    });

    const step1Data = {
      company: dto.name ?? existing.name,
      contact: dto.primaryContact,
      city: dto.city,
      email: dto.email,
      phone: dto.phone,
    };

    if (clientDiscovery) {
      await prisma.commercialDiscovery.update({
        where: { id: clientDiscovery.id },
        data: {
          step1Data,
          step2Data: discovery as object,
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });
    } else {
      await prisma.commercialDiscovery.create({
        data: {
          tenantId: user.tenantId,
          companyId: id,
          consultantId: user.id,
          status: 'COMPLETED',
          currentStep: 2,
          step1Data,
          step2Data: discovery as object,
          completedAt: new Date(),
        },
      });
    }
  }

  await prisma.activityLog.create({
    data: {
      tenantId: user.tenantId,
      userId: user.id,
      companyId: id,
      type: 'UPDATE',
      entity: 'Company',
      entityId: id,
      description: `Empresa "${company.name}" actualizada`,
    },
  });

  return Response.json(company);
}
