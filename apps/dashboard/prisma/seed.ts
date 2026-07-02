import { PrismaClient, UserRole, CompanyStatus, VacancyStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Kova2026!', 12);

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'kova' },
    update: {},
    create: {
      name: 'Kova Talent OS',
      slug: 'kova',
      plan: 'enterprise',
    },
  });

  const admin = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@kova.co' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@kova.co',
      passwordHash,
      firstName: 'Admin',
      lastName: 'Kova',
      role: UserRole.SUPER_ADMIN,
    },
  });

  const consultant = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'consultor@kova.co' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'consultor@kova.co',
      passwordHash,
      firstName: 'María',
      lastName: 'Consultora',
      role: UserRole.CONSULTANT,
    },
  });

  const company = await prisma.company.upsert({
    where: { id: 'seed-company-001' },
    update: {},
    create: {
      id: 'seed-company-001',
      tenantId: tenant.id,
      name: 'TechSales Colombia SAS',
      sector: 'Tecnología B2B',
      industry: 'Software',
      employeeCount: 85,
      city: 'Bogotá',
      status: CompanyStatus.ACTIVE,
      email: 'contacto@techsales.co',
      phone: '+57 300 123 4567',
    },
  });

  await prisma.companyConsultant.upsert({
    where: { companyId_consultantId: { companyId: company.id, consultantId: consultant.id } },
    update: {},
    create: {
      companyId: company.id,
      consultantId: consultant.id,
      isPrimary: true,
    },
  });

  const client = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'cliente@techsales.co' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'cliente@techsales.co',
      passwordHash,
      firstName: 'Carlos',
      lastName: 'Cliente',
      role: UserRole.CLIENT,
      companyId: company.id,
    },
  });

  const vacancy = await prisma.vacancy.upsert({
    where: { id: 'seed-vacancy-001' },
    update: {},
    create: {
      id: 'seed-vacancy-001',
      tenantId: tenant.id,
      companyId: company.id,
      consultantId: consultant.id,
      title: 'Ejecutivo Comercial B2B',
      quantity: 1,
      city: 'Bogotá',
      modality: 'Híbrido',
      status: VacancyStatus.SEARCH_ACTIVE,
      priority: 'HIGH',
      openedAt: new Date(),
    },
  });

  console.log('Seed completed:');
  console.log({ tenant: tenant.slug, admin: admin.email, consultant: consultant.email, client: client.email, company: company.name, vacancy: vacancy.title });
  console.log('Password for all users: Kova2026!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
