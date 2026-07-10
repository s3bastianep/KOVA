import { NextRequest } from 'next/server';
import { ActivityType, PipelineStage, TaskPriority } from '@prisma/client';
import { getUserFromRequest, unauthorized, companyWhereForUser, isStaffRole } from '../../../../../../lib/auth';
import { prisma } from '../../../../../../lib/prisma';
import { recordStageAutomation } from '../../../../../../lib/automations';
import { isMockMode, getMockCandidateStage, setMockCandidateStage } from '../../../../../../lib/mock';
import { PIPELINE_STAGES, stageIndex } from '../../../../../../lib/stages';

export const dynamic = 'force-dynamic';

const STAGE_ORDER: PipelineStage[] = [
  'APPLIED',
  'SCREENING',
  'CALL',
  'INTERVIEW',
  'ASSESSMENT',
  'CLIENT_REVIEW',
  'OFFER',
  'HIRED',
];

const NEXT_TASK_BY_STAGE: Partial<Record<PipelineStage, string>> = {
  SCREENING: 'Revisar CV y validar requisitos obligatorios',
  CALL: 'Llamar candidato y validar interés',
  INTERVIEW: 'Agendar entrevista con consultor',
  ASSESSMENT: 'Enviar pruebas configuradas',
  CLIENT_REVIEW: 'Enviar perfil del candidato al cliente',
  OFFER: 'Preparar oferta y validarla con cliente',
  HIRED: 'Cerrar proceso y confirmar contratación',
};

function isPipelineStage(value: unknown): value is PipelineStage {
  return typeof value === 'string' && [...STAGE_ORDER, 'REJECTED', 'WITHDRAWN', 'ONBOARDING'].includes(value);
}

function nextStage(current: PipelineStage) {
  const index = STAGE_ORDER.indexOf(current);
  if (index < 0 || index >= STAGE_ORDER.length - 1) return current;
  return STAGE_ORDER[index + 1];
}

function dueTomorrow() {
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; candidateVacancyId: string }> },
) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isStaffRole(user.role)) return unauthorized();

  const { id, candidateVacancyId } = await params;
  const body = await req.json().catch(() => ({}));
  const action = body.action as 'advance' | 'move' | 'reject' | undefined;

  if (isMockMode()) {
    if (action === 'move' && typeof body.stage === 'string') {
      setMockCandidateStage(candidateVacancyId, body.stage);
      return Response.json({ ok: true, stage: body.stage });
    }
    if (action === 'advance') {
      const current = getMockCandidateStage(candidateVacancyId, 'SCREENING');
      const idx = stageIndex(current);
      const next = idx >= 0 && idx < PIPELINE_STAGES.length - 1
        ? PIPELINE_STAGES[idx + 1]
        : current;
      setMockCandidateStage(candidateVacancyId, next);
      return Response.json({ ok: true, stage: next });
    }
    if (action === 'reject') {
      setMockCandidateStage(candidateVacancyId, 'REJECTED');
      return Response.json({ ok: true, stage: 'REJECTED' });
    }
    return Response.json({ ok: true, message: 'Acción inválida' }, { status: 400 });
  }

  const companies = await prisma.company.findMany({
    where: companyWhereForUser(user),
    select: { id: true },
  });
  const companyIds = companies.map((c) => c.id);

  const candidateVacancy = await prisma.candidateVacancy.findFirst({
    where: {
      id: candidateVacancyId,
      vacancyId: id,
      vacancy: { tenantId: user.tenantId, companyId: { in: companyIds } },
    },
    include: {
      candidate: { select: { id: true, firstName: true, lastName: true } },
      vacancy: { select: { id: true, title: true, tenantId: true, companyId: true, consultantId: true } },
    },
  });

  if (!candidateVacancy) {
    return Response.json({ message: 'Candidato no encontrado en este proceso' }, { status: 404 });
  }

  let targetStage: PipelineStage;
  let rejectReason: string | null = null;
  let description: string;

  if (action === 'reject') {
    targetStage = 'REJECTED';
    rejectReason = typeof body.reason === 'string' && body.reason.trim() ? body.reason.trim() : 'Otro';
    description = `${candidateVacancy.candidate.firstName} ${candidateVacancy.candidate.lastName} rechazado. Motivo: ${rejectReason}`;
  } else if (action === 'move') {
    if (!isPipelineStage(body.stage)) {
      return Response.json({ message: 'Etapa inválida' }, { status: 400 });
    }
    targetStage = body.stage;
    description = `${candidateVacancy.candidate.firstName} ${candidateVacancy.candidate.lastName} movido a ${targetStage}`;
  } else if (action === 'advance') {
    targetStage = nextStage(candidateVacancy.stage);
    description = `${candidateVacancy.candidate.firstName} ${candidateVacancy.candidate.lastName} avanzado a ${targetStage}`;
  } else {
    return Response.json({ message: 'Acción inválida' }, { status: 400 });
  }

  const fromStage = candidateVacancy.stage;
  const stageOrder = STAGE_ORDER.indexOf(targetStage);
  const nextTaskTitle = NEXT_TASK_BY_STAGE[targetStage];

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.candidateVacancy.update({
      where: { id: candidateVacancy.id },
      data: {
        stage: targetStage,
        stageOrder: stageOrder >= 0 ? stageOrder : candidateVacancy.stageOrder,
        enteredStageAt: new Date(),
        rejectedAt: targetStage === 'REJECTED' ? new Date() : null,
        rejectReason,
        hiredAt: targetStage === 'HIRED' ? new Date() : candidateVacancy.hiredAt,
      },
    });

    await tx.pipelineStageHistory.create({
      data: {
        candidateVacancyId: candidateVacancy.id,
        fromStage,
        toStage: targetStage,
        changedById: user.id,
        reason: rejectReason,
      },
    });

    await tx.activityLog.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        companyId: candidateVacancy.vacancy.companyId,
        vacancyId: candidateVacancy.vacancy.id,
        candidateId: candidateVacancy.candidate.id,
        type: targetStage === 'REJECTED' ? ActivityType.UPDATE : ActivityType.STAGE_CHANGE,
        entity: 'CandidateVacancy',
        entityId: candidateVacancy.id,
        description,
        metadata: {
          action,
          fromStage,
          toStage: targetStage,
          rejectReason,
        },
      },
    });

    let task = null;
    if (nextTaskTitle && targetStage !== 'REJECTED') {
      task = await tx.task.create({
        data: {
          tenantId: user.tenantId,
          title: nextTaskTitle,
          description: `Automatización: siguiente paso para ${candidateVacancy.candidate.firstName} ${candidateVacancy.candidate.lastName} en ${candidateVacancy.vacancy.title}.`,
          priority: targetStage === 'OFFER' || targetStage === 'HIRED' ? TaskPriority.HIGH : TaskPriority.MEDIUM,
          dueDate: dueTomorrow(),
          assigneeId: candidateVacancy.vacancy.consultantId ?? user.id,
          creatorId: user.id,
          companyId: candidateVacancy.vacancy.companyId,
          vacancyId: candidateVacancy.vacancy.id,
        },
      });
    }

    if (targetStage === 'HIRED') {
      await tx.candidate.update({
        where: { id: candidateVacancy.candidate.id },
        data: { status: 'HIRED' },
      });
      await tx.vacancy.update({
        where: { id: candidateVacancy.vacancy.id },
        data: { status: 'HIRED', closedAt: new Date() },
      });
    }

    const emailResult = await recordStageAutomation(tx, {
      tenantId: user.tenantId,
      userId: user.id,
      companyId: candidateVacancy.vacancy.companyId,
      vacancyId: candidateVacancy.vacancy.id,
      candidateId: candidateVacancy.candidate.id,
      consultantId: candidateVacancy.vacancy.consultantId ?? user.id,
      candidateName: `${candidateVacancy.candidate.firstName} ${candidateVacancy.candidate.lastName}`,
      vacancyTitle: candidateVacancy.vacancy.title,
      targetStage,
      rejectReason,
    });

    return { updated, task, emailResult };
  });

  return Response.json({
    ok: true,
    candidateVacancy: result.updated,
    automation: {
      activity: description,
      task: result.task?.title ?? null,
      email: result.emailResult.email ?? null,
    },
  });
}
