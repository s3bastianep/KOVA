import { PrismaClient, UserRole, CompanyStatus, VacancyStatus, CandidateStatus, PipelineStage, AssessmentType } from '@prisma/client';
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
      primaryContact: 'Carlos Restrepo',
      commercialDir: 'Carlos Restrepo',
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
      metadata: {
        standardQuestions: [
          { id: 'experience_years', weight: 25, expected: '5' },
          { id: 'industry', weight: 20, expected: 'Software,Tecnología' },
          { id: 'sales_type', weight: 15, expected: 'B2B,Consultiva' },
          { id: 'skills', weight: 20, expected: 'Prospección,Cierre de ventas,Negociación,Venta consultiva' },
          { id: 'crm', weight: 10, expected: 'Salesforce,HubSpot' },
          { id: 'english_level', weight: 5, expected: 'B2' },
          { id: 'availability', weight: 5, expected: 'Inmediata' },
        ],
      },
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
      primaryContact: 'Laura Méndez',
      commercialDir: 'Laura Méndez',
    },
  });

  await prisma.companyConsultant.upsert({
    where: { companyId_consultantId: { companyId: company2.id, consultantId: consultant.id } },
    update: {},
    create: {
      companyId: company2.id,
      consultantId: consultant.id,
      isPrimary: true,
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
      status: VacancyStatus.DISCOVERY_PENDING,
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
        metadata: {
          standardAnswers: {
            experience_years: c.id === 'seed-candidate-001' ? '6' : c.id === 'seed-candidate-002' ? '5' : '8',
            skills:
              c.id === 'seed-candidate-001'
                ? 'Prospección,Cierre de ventas,Negociación,Presentación comercial,Manejo de objeciones'
                : c.id === 'seed-candidate-002'
                  ? 'Prospección,Cierre de ventas,Negociación'
                  : 'Prospección,Negociación,Cuentas clave',
            industry: c.id === 'seed-candidate-003' ? 'Distribución' : 'Tecnología',
            sales_type: 'B2B',
            crm: c.id === 'seed-candidate-001' ? 'Salesforce' : 'HubSpot',
            education: 'Profesional',
            english_level: c.id === 'seed-candidate-002' ? 'A2' : 'B2',
            availability: 'Inmediata',
            city: 'Bogotá',
          },
        },
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

  const assessments = [
    { id: 'seed-assessment-001', candidateId: 'seed-candidate-001', vacancyId: vacancy.id, type: AssessmentType.COMMERCIAL, title: 'Venta consultiva', score: 90, result: 'Aprobado', minutes: 42, comments: JSON.stringify({ feedback: 'Excelente manejo de objeciones y cierre consultivo.', mistakes: ['Pregunta 7: No detalló el proceso de calificación de prospectos BANT'] }) },
    { id: 'seed-assessment-002', candidateId: 'seed-candidate-001', vacancyId: vacancy.id, type: AssessmentType.ROLE_PLAY, title: 'Negociación', score: 85, result: 'Aprobado', minutes: 28, comments: JSON.stringify({ feedback: 'Buen manejo de la negociación, reforzar propuesta de valor.', mistakes: ['Escenario 2: Cedió descuento antes de validar necesidad', 'Escenario 4: Propuesta de valor genérica'] }) },
    { id: 'seed-assessment-003', candidateId: 'seed-candidate-002', vacancyId: vacancy.id, type: AssessmentType.BEHAVIORAL, title: 'Resiliencia', score: 78, result: 'Aprobado', minutes: 35, comments: JSON.stringify({ feedback: 'Responde bien bajo presión. Comunicación clara.', mistakes: ['Pregunta 3: Ejemplo de rechazo sin acción concreta', 'Pregunta 8: Tendencia a culpar al mercado'] }) },
    { id: 'seed-assessment-004', candidateId: 'seed-candidate-002', vacancyId: vacancy.id, type: AssessmentType.COMMERCIAL, title: 'Prospección', score: 82, result: 'Aprobado', minutes: 38, comments: JSON.stringify({ feedback: 'Buena estructura de prospección B2B.', mistakes: ['Pregunta 5: Canales limitados a LinkedIn', 'Pregunta 9: No midió tasa de conversión'] }) },
    { id: 'seed-assessment-005', candidateId: 'seed-candidate-003', vacancyId: vacancy2.id, type: AssessmentType.COMMERCIAL, title: 'Planeación', score: 72, result: 'En revisión', minutes: 55, comments: JSON.stringify({ feedback: 'Plan comercial sólido pero le falta profundidad en KPIs.', mistakes: ['Pregunta 2: KPIs sin metas numéricas', 'Pregunta 6: Sin plan de contingencia', 'Pregunta 10: Proyección sin respaldo histórico'] }) },
    { id: 'seed-assessment-006', candidateId: 'seed-candidate-003', vacancyId: vacancy2.id, type: AssessmentType.TECHNICAL, title: 'Gestión de equipos', score: 68, result: 'En revisión', minutes: 47, comments: JSON.stringify({ feedback: 'Experiencia relevante, validar liderazgo en campo.', mistakes: ['Pregunta 4: Sin método de coaching 1:1', 'Pregunta 7: Indicadores incompletos', 'Pregunta 11: Sin plan de retención'] }) },
  ];

  for (const a of assessments) {
    const started = new Date(Date.now() - a.minutes * 60000 - 86400000);
    const completed = new Date(started.getTime() + a.minutes * 60000);
    await prisma.assessment.upsert({
      where: { id: a.id },
      update: { score: a.score, result: a.result, comments: a.comments, completedAt: completed },
      create: {
        id: a.id,
        tenantId: tenant.id,
        candidateId: a.candidateId,
        vacancyId: a.vacancyId,
        type: a.type,
        title: a.title,
        score: a.score,
        maxScore: 100,
        result: a.result,
        comments: a.comments,
        createdAt: started,
        completedAt: completed,
      },
    });
  }

  const calendarEvents = [
    {
      id: 'seed-cal-001',
      companyId: company2.id,
      vacancyId: vacancy2.id,
      userId: consultant.id,
      title: 'Discovery comercial - Distribuidora Andina',
      type: 'Discovery',
      daysFromNow: 1,
      hour: 10,
      durationMin: 60,
      location: 'Google Meet',
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      purpose: 'Levantar información del negocio, proceso comercial y perfil ideal del cargo.',
      notes: 'Confirmar asistencia del gerente general. Llevar propuesta de metodología Kova.',
    },
    {
      id: 'seed-cal-002',
      companyId: company.id,
      vacancyId: vacancy.id,
      userId: consultant.id,
      title: 'Presentación de finalistas - TechSales',
      type: 'Reunión cliente',
      daysFromNow: 2,
      hour: 14,
      durationMin: 60,
      location: 'Oficina TechSales, Bogotá',
      purpose: 'Presentar 3 finalistas con informe comparativo. Definir entrevistas finales con el cliente.',
      notes: 'Enviar informe PDF 24h antes. Candidatos: Juan Pérez, Ana Gómez, Carlos Ruiz.',
    },
    {
      id: 'seed-cal-003',
      companyId: company.id,
      vacancyId: vacancy.id,
      userId: consultant.id,
      title: 'Seguimiento post-entrevista - TechSales',
      type: 'Llamada',
      daysFromNow: 3,
      hour: 9,
      durationMin: 30,
      purpose: 'Recoger feedback de entrevistas y avanzar a fase de pruebas comerciales.',
      notes: 'Preguntar por disponibilidad para role play la próxima semana.',
    },
    {
      id: 'seed-cal-004',
      companyId: company.id,
      vacancyId: vacancy.id,
      userId: consultant.id,
      title: 'Entrevista cliente - Ana Gómez',
      type: 'Entrevista cliente',
      daysFromNow: 4,
      hour: 11,
      durationMin: 60,
      location: 'Presencial - TechSales',
      purpose: 'Entrevista final del candidato Ana Gómez con el cliente. Coordinar llegada 15 min antes.',
      notes: 'Candidata: Ana Gómez · Tel. +57 320 555 8899',
    },
  ];

  for (const ev of calendarEvents) {
    const startAt = new Date(Date.now() + ev.daysFromNow * 86400000);
    startAt.setHours(ev.hour, 0, 0, 0);
    const endAt = new Date(startAt.getTime() + ev.durationMin * 60000);
    const description = `type:${ev.type}\npurpose:${ev.purpose}${ev.notes ? `\nnotes:${ev.notes}` : ''}`;
    await prisma.calendarEvent.upsert({
      where: { id: ev.id },
      update: {
        title: ev.title,
        description,
        startAt,
        endAt,
        location: ev.location ?? null,
        meetingUrl: ev.meetingUrl ?? null,
      },
      create: {
        id: ev.id,
        tenantId: tenant.id,
        userId: ev.userId,
        companyId: ev.companyId,
        vacancyId: ev.vacancyId,
        title: ev.title,
        description,
        startAt,
        endAt,
        location: ev.location ?? null,
        meetingUrl: ev.meetingUrl ?? null,
      },
    });
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
    assessments: assessments.length,
    calendarEvents: calendarEvents.length,
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
