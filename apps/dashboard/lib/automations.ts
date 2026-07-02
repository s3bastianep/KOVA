import { ActivityType, PipelineStage, Prisma, TaskPriority } from '@prisma/client';
import { calculateCompatibility, profileFromCandidate, requirementsFromMetadata } from './compatibility';

type Tx = Prisma.TransactionClient;

export async function runCandidateAddedAutomation(
  tx: Tx,
  opts: {
    tenantId: string;
    userId: string;
    companyId: string;
    vacancyId: string;
    candidateId: string;
    candidateVacancyId: string;
    consultantId: string;
    vacancyTitle: string;
    candidateName: string;
    vacancyMetadata: unknown;
    candidate: Parameters<typeof profileFromCandidate>[0];
  },
) {
  const requirements = requirementsFromMetadata(opts.vacancyMetadata);
  const profile = profileFromCandidate(opts.candidate);
  const { total, breakdown } = calculateCompatibility(requirements, profile);

  await tx.candidate.update({
    where: { id: opts.candidateId },
    data: {
      compatibility: total,
      metadata: { profile, compatibilityBreakdown: breakdown },
    },
  });

  await tx.candidateVacancy.update({
    where: { id: opts.candidateVacancyId },
    data: { score: total },
  });

  await tx.activityLog.create({
    data: {
      tenantId: opts.tenantId,
      userId: opts.userId,
      companyId: opts.companyId,
      vacancyId: opts.vacancyId,
      candidateId: opts.candidateId,
      type: ActivityType.AUTO_GENERATED,
      entity: 'Candidate',
      entityId: opts.candidateId,
      description: `${opts.candidateName} ingresó al proceso con ${total}% de compatibilidad`,
      metadata: { compatibility: total, breakdown },
    },
  });

  const task = await tx.task.create({
    data: {
      tenantId: opts.tenantId,
      title: `Revisar candidato: ${opts.candidateName} (${total}%)`,
      description: `Automatización: validar compatibilidad y decidir si avanza en ${opts.vacancyTitle}.`,
      priority: total >= 80 ? TaskPriority.MEDIUM : TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      assigneeId: opts.consultantId,
      creatorId: opts.userId,
      companyId: opts.companyId,
      vacancyId: opts.vacancyId,
    },
  });

  await tx.notification.create({
    data: {
      userId: opts.consultantId,
      type: 'TASK',
      title: 'Nuevo candidato en proceso',
      message: `${opts.candidateName} — compatibilidad ${total}%`,
      link: `/procesos/${opts.vacancyId}`,
    },
  });

  return { compatibility: total, breakdown, taskId: task.id };
}

export async function recordStageAutomation(
  tx: Tx,
  opts: {
    tenantId: string;
    userId: string;
    companyId: string;
    vacancyId: string;
    candidateId: string;
    consultantId: string;
    candidateName: string;
    vacancyTitle: string;
    targetStage: PipelineStage;
    rejectReason?: string | null;
    emailTemplate?: string;
  },
) {
  if (opts.targetStage === 'REJECTED') {
    await tx.notification.create({
      data: {
        userId: opts.consultantId,
        type: 'INFO',
        title: 'Candidato descartado',
        message: `${opts.candidateName} — ${opts.rejectReason ?? 'Sin motivo'}`,
        link: `/candidatos/${opts.candidateId}`,
      },
    });

    await tx.activityLog.create({
      data: {
        tenantId: opts.tenantId,
        userId: opts.userId,
        companyId: opts.companyId,
        vacancyId: opts.vacancyId,
        candidateId: opts.candidateId,
        type: ActivityType.EMAIL,
        entity: 'Candidate',
        entityId: opts.candidateId,
        description: `Correo de agradecimiento registrado para ${opts.candidateName}`,
        metadata: { template: 'rejection_thanks', reason: opts.rejectReason },
      },
    });

    return { email: `Correo de agradecimiento registrado para ${opts.candidateName}` };
  }

  return { email: null };
}
