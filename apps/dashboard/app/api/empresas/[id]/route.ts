import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, companyWhereForUser } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { isMockMode, getMockCompany } from '../../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

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
      vacancies: { orderBy: { updatedAt: 'desc' }, take: 10 },
      followUps: { orderBy: { createdAt: 'desc' }, take: 20 },
      crmInteractions: { orderBy: { createdAt: 'desc' }, take: 20 },
      documents: { orderBy: { createdAt: 'desc' }, take: 20 },
      contracts: true,
      invoices: { orderBy: { createdAt: 'desc' }, take: 10 },
      activities: { orderBy: { createdAt: 'desc' }, take: 30 },
    },
  });

  if (!company) return Response.json({ message: 'Empresa no encontrada' }, { status: 404 });
  return Response.json(company);
}
