import { PrismaClient, UserRole, CompanyStatus, VacancyStatus, CandidateStatus, PipelineStage } from '@prisma/client';
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

  const company2 = await prisma.company.upsert({
    where: { id: 'seed-company-002' },
    update: {},
    create: {
      id: 'seed-company-002',
      tenantId: tenant.id,
      name: 'Distribuidora Andina',
      sector: 'Distribución',
      industry: 'Consumo masivo',
      employeeCount: 120,
      city: 'Medellín',
      status: CompanyStatus.ACTIVE,
      email: 'comercial@andina.co',
      phone: '+57 310 987 6543',
    },
  });

  const vacancy2 = await prisma.vacancy.upsert({
    where: { id: 'seed-vacancy-002' },
    update: {},
    create: {
      id: 'seed-vacancy-002',
      tenantId: tenant.id,
      companyId: company2.id,
      consultantId: consultant.id,
      title: 'Gerente Comercial Regional',
      quantity: 1,
      city: 'Medellín',
      modality: 'Presencial',
      status: VacancyStatus.DISCOVERY,
      priority: 'MEDIUM',
      openedAt: new Date(),
    },
  });

  const candidates = [
    {
      id: 'seed-candidate-001',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@email.com',
      phone: '+57 301 555 1234',
      city: 'Bogotá',
      source: 'LinkedIn',
      compatibility: 92,
      ranking: 1,
      stage: PipelineStage.INTERVIEW,
      vacancyId: vacancy.id,
      profileSummary: 'Ejecutivo comercial B2B con 6 años de experiencia en software. Fuerte en prospección y cierre consultivo.',
      experience: {
        company: 'SoftCorp',
        role: 'Ejecutivo de Ventas',
        results: 'Superó la meta anual 130% dos años seguidos.',
      },
      note: 'Muy buena actitud en la primera llamada. Fuerte en venta consultiva.',
    },
    {
      id: 'seed-candidate-002',
      firstName: 'Ana',
      lastName: 'Gómez',
      email: 'ana.gomez@email.com',
      phone: '+57 302 555 5678',
      city: 'Bogotá',
      source: 'Referido',
      compatibility: 87,
      ranking: 2,
      stage: PipelineStage.ASSESSMENT,
      vacancyId: vacancy.id,
      profileSummary: 'Asesora comercial senior con experiencia liderando equipos pequeños. Excelente comunicación.',
      experience: {
        company: 'VentasPro',
        role: 'Asesora Comercial Senior',
        results: 'Lideró equipo de 5 vendedores.',
      },
      note: 'Excelente comunicación. Validar experiencia en ticket alto.',
    },
    {
      id: 'seed-candidate-003',
      firstName: 'Carlos',
      lastName: 'Ruiz',
      email: 'carlos.ruiz@email.com',
      phone: '+57 310 555 9012',
      city: 'Medellín',
      source: 'Computrabajo',
      compatibility: 78,
      ranking: 1,
      stage: PipelineStage.SCREENING,
      vacancyId: vacancy2.id,
      profileSummary: 'Gerente regional con trayectoria en consumo masivo. Experiencia construyendo equipos comerciales.',
      experience: {
        company: 'Distribuidora Norte',
        role: 'Gerente Regional',
        results: 'Creció la región 45% en 3 años.',
      },
      note: 'Perfil sólido para gerencia regional. Agendar Discovery.',
    },
  ];

  for (const c of candidates) {
    await prisma.candidate.upsert({
      where: { id: c.id },
      update: {
        compatibility: c.compatibility,
        ranking: c.ranking,
        profileSummary: c.profileSummary,
      },
      create: {
        id: c.id,
        tenantId: tenant.id,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        city: c.city,
        source: c.source,
        status: CandidateStatus.ACTIVE,
        compatibility: c.compatibility,
        ranking: c.ranking,
        profileSummary: c.profileSummary,
      },
    });

    await prisma.candidateVacancy.upsert({
      where: { candidateId_vacancyId: { candidateId: c.id, vacancyId: c.vacancyId } },
      update: { stage: c.stage, ranking: c.ranking },
      create: {
        candidateId: c.id,
        vacancyId: c.vacancyId,
        stage: c.stage,
        ranking: c.ranking,
        source: c.source,
      },
    });

    const existingExp = await prisma.workExperience.findFirst({ where: { candidateId: c.id } });
    if (!existingExp) {
      await prisma.workExperience.create({
        data: {
          candidateId: c.id,
          company: c.experience.company,
          role: c.experience.role,
          startDate: new Date('2020-01-01'),
          isCurrent: true,
          results: c.experience.results,
        },
      });
    }

    const existingNote = await prisma.note.findFirst({ where: { candidateId: c.id } });
    if (!existingNote) {
      await prisma.note.create({
        data: {
          tenantId: tenant.id,
          candidateId: c.id,
          authorId: consultant.id,
          content: c.note,
        },
      });
    }
  }

  console.log('Seed completed:');
  console.log({
    tenant: tenant.slug,
    admin: admin.email,
    consultant: consultant.email,
    client: client.email,
    company: company.name,
    vacancy: vacancy.title,
    candidates: candidates.length,
  });
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
