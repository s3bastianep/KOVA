import { NextRequest } from 'next/server';
import { getQuestionById, standardQuestionsFromMetadata } from '../../../../../lib/standard-questions';
import { compatibilityFromVacancyAndAnswers } from '../../../../../lib/compatibility';
import { prisma } from '../../../../../lib/prisma';
import { isMockMode } from '../../../../../lib/mock';
import { runCandidateAddedAutomation } from '../../../../../lib/automations';

export const dynamic = 'force-dynamic';

type VacancyMeta = {
  title: string;
  company: { name: string };
  metadata: unknown;
  consultantId: string | null;
  companyId: string;
  tenantId: string;
};

async function loadVacancy(id: string): Promise<VacancyMeta | null> {
  if (isMockMode()) {
    return {
      title: 'Ejecutivo Comercial B2B',
      company: { name: 'TechSales Colombia SAS' },
      metadata: {},
      consultantId: 'mock-user-001',
      companyId: 'seed-company-001',
      tenantId: 'mock-tenant-001',
    };
  }
  const vacancy = await prisma.vacancy.findFirst({
    where: { id, status: { notIn: ['CLOSED', 'HIRED'] } },
    select: {
      title: true,
      metadata: true,
      consultantId: true,
      companyId: true,
      tenantId: true,
      company: { select: { name: true } },
    },
  });
  if (!vacancy) return null;
  return vacancy;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vacancy = await loadVacancy(id);
  if (!vacancy) return Response.json({ message: 'Proceso no encontrado' }, { status: 404 });

  const selected = standardQuestionsFromMetadata(vacancy.metadata);
  const questions = selected.map((s) => {
    const def = getQuestionById(s.id);
    return {
      id: s.id,
      label: def?.label ?? s.id,
      category: def?.category ?? 'General',
      inputType: def?.inputType ?? 'text',
      options: def?.options ?? [],
      placeholder: def?.placeholder,
      helpText: def?.helpText,
    };
  });

  return Response.json({
    vacancyId: id,
    title: vacancy.title,
    companyName: vacancy.company.name,
    questions,
  });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { firstName, lastName, email, phone, answers } = body;

  if (!firstName || !lastName || !email) {
    return Response.json({ message: 'Nombre, apellido y correo son obligatorios' }, { status: 400 });
  }

  const vacancy = await loadVacancy(id);
  if (!vacancy) return Response.json({ message: 'Proceso no encontrado' }, { status: 404 });

  const standardAnswers = (answers ?? {}) as Record<string, string | number>;
  const { total, breakdown } = compatibilityFromVacancyAndAnswers(vacancy.metadata, standardAnswers);

  if (isMockMode()) {
    return Response.json({
      ok: true,
      compatibility: total,
      breakdown,
      message: `Postulación registrada con ${total}% de compatibilidad (modo demo)`,
    });
  }

  const consultantId = vacancy.consultantId;
  if (!consultantId) {
    return Response.json({ message: 'Proceso sin consultor asignado' }, { status: 400 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const candidate = await tx.candidate.create({
      data: {
        tenantId: vacancy.tenantId,
        firstName,
        lastName,
        email,
        phone: phone ?? null,
        city: String(standardAnswers.city ?? ''),
        source: 'Formulario web',
        status: 'ACTIVE',
        compatibility: total,
        metadata: { standardAnswers, compatibilityBreakdown: breakdown },
      },
    });

    const candidateVacancy = await tx.candidateVacancy.create({
      data: {
        candidateId: candidate.id,
        vacancyId: id,
        stage: 'APPLIED',
        score: total,
        source: 'Formulario web',
      },
    });

    await runCandidateAddedAutomation(tx, {
      tenantId: vacancy.tenantId,
      userId: consultantId,
      companyId: vacancy.companyId,
      vacancyId: id,
      candidateId: candidate.id,
      candidateVacancyId: candidateVacancy.id,
      consultantId,
      vacancyTitle: vacancy.title,
      candidateName: `${firstName} ${lastName}`,
      vacancyMetadata: vacancy.metadata,
      candidate: { metadata: { standardAnswers }, experiences: [] },
    });

    return { candidate, compatibility: total, breakdown };
  });

  return Response.json({
    ok: true,
    candidateId: result.candidate.id,
    compatibility: result.compatibility,
    breakdown: result.breakdown,
    message: `Postulación registrada. Compatibilidad: ${result.compatibility}%`,
  });
}
