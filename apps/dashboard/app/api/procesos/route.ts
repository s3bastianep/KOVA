import { NextRequest } from 'next/server';
import { PipelineStage, VacancyStatus } from '@prisma/client';
import { getUserFromRequest, unauthorized, companyWhereForUser, isStaffRole } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { portalServerCacheInvalidate } from '../../../lib/portal-server-cache';
import { isMockMode } from '../../../lib/mock';
import type { SelectedStandardQuestion } from '../../../lib/standard-questions';
import { selectedToRequirements } from '../../../lib/standard-questions';

export const dynamic = 'force-dynamic';

const STAGE_MAP: Record<string, PipelineStage> = {
  'Postulados': 'APPLIED',
  'Filtro CV': 'SCREENING',
  'Preseleccionados': 'SCREENING',
  'Llamada': 'CALL',
  'Pruebas': 'ASSESSMENT',
  'Entrevista RH': 'INTERVIEW',
  'Entrevista consultor': 'INTERVIEW',
  'Role Play': 'ROLE_PLAY',
  'Entrevista Cliente': 'CLIENT_REVIEW',
  'Finalistas': 'CLIENT_REVIEW',
  'Oferta': 'OFFER',
  'Contratado': 'HIRED',
};

function mapStage(label: string, index: number): PipelineStage {
  return STAGE_MAP[label] ?? (['APPLIED', 'SCREENING', 'ASSESSMENT', 'INTERVIEW', 'CLIENT_REVIEW', 'OFFER', 'HIRED'][index] as PipelineStage) ?? 'APPLIED';
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isStaffRole(user.role)) return unauthorized();
  if (user.role === 'CLIENT') {
    return Response.json({ message: 'No autorizado' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.title || (!body?.companyId && !body?.companyName)) {
    return Response.json({ message: 'Cliente y cargo son obligatorios' }, { status: 400 });
  }

  if (isMockMode()) {
    return Response.json({ ok: true, id: 'mock-proceso-001' });
  }

  let company: { id: string; name: string; city?: string | null } | null = null;

  if (body.companyId) {
    company = await prisma.company.findFirst({
      where: { id: String(body.companyId), ...companyWhereForUser(user) },
      select: { id: true, name: true, city: true },
    });
    if (!company) {
      return Response.json({ message: 'Cliente no encontrado' }, { status: 404 });
    }
  } else {
    const companies = await prisma.company.findMany({
      where: companyWhereForUser(user),
      select: { id: true, name: true, city: true },
    });

    company = companies.find((c) => c.name.toLowerCase() === String(body.companyName).toLowerCase()) ?? null;
    if (!company) {
      company = await prisma.company.create({
        data: {
          tenantId: user.tenantId,
          name: body.companyName,
          status: 'ACTIVE',
          primaryContact: body.contact ?? undefined,
          city: body.city ?? undefined,
          email: body.email ?? undefined,
          phone: body.phone ?? undefined,
        },
        select: { id: true, name: true, city: true },
      });
    }
  }

  const clientDiscovery = await prisma.commercialDiscovery.findFirst({
    where: { companyId: company.id, vacancyId: null },
    orderBy: { updatedAt: 'desc' },
    select: { step2Data: true },
  });

  const discoveryData = body.discovery ?? clientDiscovery?.step2Data ?? {};

  const requirements = (body.standardQuestions ?? body.requirements ?? []) as SelectedStandardQuestion[];
  const pipelineLabels: string[] = body.pipeline ?? [
    'Postulados', 'Preseleccionados', 'Pruebas', 'Entrevista RH', 'Entrevista Cliente', 'Finalistas', 'Contratado',
  ];

  const result = await prisma.$transaction(async (tx) => {
    const vacancy = await tx.vacancy.create({
      data: {
        tenantId: user.tenantId,
        companyId: company!.id,
        consultantId: user.id,
        title: body.title,
        quantity: Number(body.quantity ?? 1),
        city: body.city ?? company.city ?? null,
        modality: body.modality ?? null,
        variablePay: body.salaryRemuneration ?? body.variablePay ?? null,
        urgency: body.urgency ?? 'MEDIUM',
        status: VacancyStatus.SEARCH_ACTIVE,
        openedAt: new Date(),
        requiredDate: body.dueDate ? new Date(body.dueDate) : null,
        description: body.objective ?? null,
        checklist: body.checklist ?? [],
        metadata: {
          standardQuestions: requirements,
          requirements: selectedToRequirements(requirements),
          workflow: pipelineLabels,
        },
      },
    });

    await tx.commercialDiscovery.create({
      data: {
        tenantId: user.tenantId,
        companyId: company!.id,
        vacancyId: vacancy.id,
        consultantId: user.id,
        status: 'COMPLETED',
        currentStep: 7,
        step1Data: { company: company.name, contact: body.contact, city: body.city ?? company.city },
        step2Data: discoveryData,
        step3Data: body.need ?? {},
        step4Data: {
          title: body.title,
          objective: body.objective,
          functions: body.functions,
          kpis: body.kpis,
          salaryRemuneration: body.salaryRemuneration ?? body.variablePay,
        },
        step5Data: { requirements },
        step6Data: { pipeline: pipelineLabels, tests: body.tests ?? [] },
        step7Data: { summary: body.summary ?? 'Proceso creado desde wizard' },
        completedAt: new Date(),
      },
    });

    await tx.jobProfile.create({
      data: {
        vacancyId: vacancy.id,
        objective: body.objective ?? null,
        functions: body.functions ? [body.functions] : undefined,
        kpis: body.kpis ? [body.kpis] : undefined,
        experience: body.requirements ? { min: body.minExperience, industry: body.industry } : undefined,
        autoGenerated: true,
      },
    });

    for (const [index, label] of pipelineLabels.entries()) {
      await tx.pipelineStageConfig.create({
        data: {
          vacancyId: vacancy.id,
          stage: mapStage(label, index),
          order: index,
          label,
        },
      });
    }

    const checklist: string[] = body.checklistTasks ?? [
      'Buscar candidatos',
      'Contactar candidatos',
      'Enviar pruebas',
      'Agendar entrevistas',
      'Presentar finalistas',
    ];

    for (const title of checklist) {
      await tx.task.create({
        data: {
          tenantId: user.tenantId,
          title,
          description: `Tarea automática del proceso ${body.title}`,
          assigneeId: user.id,
          creatorId: user.id,
          companyId: company!.id,
          vacancyId: vacancy.id,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    await tx.activityLog.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        companyId: company!.id,
        vacancyId: vacancy.id,
        type: 'CREATE',
        entity: 'Vacancy',
        entityId: vacancy.id,
        description: `Proceso creado: ${body.title} para ${company!.name}`,
      },
    });

    return vacancy;
  });

  // A new open vacancy changes what candidates see in the portal's vacancy list/compatibility —
  // without this, that read cache (lib/portal-server-cache.ts) can serve a stale list for up to
  // its TTL after a consultant creates/edits a process.
  portalServerCacheInvalidate('vacantes:');

  return Response.json({ ok: true, id: result.id, title: result.title });
}
