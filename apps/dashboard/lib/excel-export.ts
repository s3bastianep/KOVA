import ExcelJS from 'exceljs';
import type { AuthUser } from './auth';
import { companyWhereForUser } from './auth';
import { prisma } from './prisma';
import {
  isMockMode,
  MOCK_CANDIDATES,
  MOCK_ASSESSMENTS,
  MOCK_INTERVIEWS,
  MOCK_TASKS,
  getMockClients,
  getMockVacanciesForList,
  ASSESSMENT_TYPE_LABELS,
} from './mock';

type SheetDef = { name: string; headers: string[]; rows: (string | number | null | undefined)[][] };

function fmtDate(value?: Date | string | null) {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function addSheet(workbook: ExcelJS.Workbook, { name, headers, rows }: SheetDef) {
  const sheet = workbook.addWorksheet(name.slice(0, 31));
  sheet.addRow(headers);
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3341C4' } };
  headerRow.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  for (const row of rows) {
    sheet.addRow(row.map((cell) => (cell == null ? '' : cell)));
  }

  sheet.columns.forEach((col) => {
    let max = 12;
    col.eachCell?.({ includeEmpty: true }, (cell) => {
      const len = String(cell.value ?? '').length;
      if (len > max) max = Math.min(len + 2, 48);
    });
    col.width = max;
  });
}

async function gatherSheets(user: AuthUser): Promise<SheetDef[]> {
  if (isMockMode()) {
    const clients = getMockClients();
    const processes = getMockVacanciesForList();
    const candidates = MOCK_CANDIDATES;
    const pipeline = candidates.flatMap((c) =>
      c.vacancies.map((v) => [
        `${c.firstName} ${c.lastName}`,
        c.email ?? '',
        v.vacancy.title,
        v.vacancy.company?.name ?? '',
        v.stage ?? c.currentStage ?? '',
        c.compatibility ?? '',
        c.source ?? '',
      ]),
    );

    return [
      {
        name: 'Clientes',
        headers: ['Empresa', 'Sector', 'Ciudad', 'Estado', 'Correo', 'Teléfono', 'Procesos activos', 'Total contrataciones', 'Consultor'],
        rows: clients.map((c) => [
          c.name,
          c.sector ?? '',
          c.city ?? '',
          c.status ?? '',
          c.email ?? '',
          c.phone ?? '',
          c.activeProcessCount ?? 0,
          c.totalHires ?? 0,
          c.consultantName ?? '',
        ]),
      },
      {
        name: 'Procesos',
        headers: ['Cargo', 'Cliente', 'Estado', 'Ciudad', 'Modalidad', 'Prioridad', 'Candidatos', 'Progreso %', 'Consultor'],
        rows: processes.map((p) => [
          p.title,
          p.company?.name ?? '',
          p.status ?? '',
          p.city ?? '',
          p.modality ?? '',
          p.priority ?? '',
          p._count?.candidates ?? 0,
          p.progress ?? '',
          p.consultantName ?? '',
        ]),
      },
      {
        name: 'Candidatos',
        headers: ['Nombre', 'Correo', 'Teléfono', 'Ciudad', 'Estado', 'Fuente', 'Compatibilidad', 'Etapa actual', 'Proceso', 'Cliente'],
        rows: candidates.map((c) => [
          `${c.firstName} ${c.lastName}`,
          c.email ?? '',
          c.phone ?? '',
          c.city ?? '',
          c.status ?? '',
          c.source ?? '',
          c.compatibility ?? '',
          c.currentStage ?? '',
          c.vacancies[0]?.vacancy.title ?? '',
          c.vacancies[0]?.vacancy.company?.name ?? '',
        ]),
      },
      {
        name: 'Pipeline',
        headers: ['Candidato', 'Correo', 'Proceso', 'Cliente', 'Etapa', 'Compatibilidad', 'Fuente'],
        rows: pipeline,
      },
      {
        name: 'Evaluaciones',
        headers: ['Candidato', 'Proceso', 'Cliente', 'Tipo', 'Competencia', 'Puntaje', 'Máximo', 'Resultado', 'Duración'],
        rows: MOCK_ASSESSMENTS.map((a) => [
          a.candidateName,
          a.vacancyTitle ?? '',
          a.companyName ?? '',
          a.type,
          a.competency ?? '',
          a.score,
          a.maxScore,
          a.result ?? '',
          a.durationMinutes ? `${a.durationMinutes} min` : '',
        ]),
      },
      {
        name: 'Entrevistas',
        headers: ['Candidato', 'Proceso', 'Estado', 'Fecha', 'Puntaje'],
        rows: MOCK_INTERVIEWS.map((i) => [
          i.candidateName,
          i.vacancy ?? '',
          i.status ?? '',
          fmtDate(i.scheduledAt),
          i.score ?? '',
        ]),
      },
      {
        name: 'Tareas',
        headers: ['Tarea', 'Estado', 'Cliente', 'Proceso'],
        rows: MOCK_TASKS.map((t) => [
          t.title,
          t.status ?? '',
          t.company?.name ?? '',
          t.vacancy?.title ?? '',
        ]),
      },
    ];
  }

  const companyWhere = companyWhereForUser(user);
  const companies = await prisma.company.findMany({
    where: companyWhere,
    include: {
      consultants: { include: { consultant: { select: { firstName: true, lastName: true } } }, take: 1 },
      vacancies: {
        select: {
          id: true,
          title: true,
          status: true,
          city: true,
          modality: true,
          priority: true,
        },
        orderBy: { updatedAt: 'desc' },
      },
    },
    orderBy: { name: 'asc' },
  });

  const companyIds = companies.map((c) => c.id);
  const vacancies = await prisma.vacancy.findMany({
    where: { tenantId: user.tenantId, companyId: { in: companyIds } },
    include: {
      company: { select: { name: true } },
      _count: { select: { candidates: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const consultantIds = [...new Set(vacancies.map((v) => v.consultantId).filter((id): id is string => !!id))];
  const consultants = consultantIds.length
    ? await prisma.user.findMany({
        where: { id: { in: consultantIds } },
        select: { id: true, firstName: true, lastName: true },
      })
    : [];
  const consultantNameById = new Map(
    consultants.map((u) => [u.id, `${u.firstName} ${u.lastName}`.trim()]),
  );

  // Tope por hoja: sin límite, un tenant grande carga TODA su base en memoria en
  // una sola request y puede tumbar el proceso. Se exportan los más recientes.
  const EXPORT_ROW_CAP = 5000;

  const candidates = await prisma.candidate.findMany({
    where: { tenantId: user.tenantId },
    include: {
      vacancies: {
        include: {
          vacancy: {
            select: { title: true, company: { select: { name: true } } },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 20,
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: EXPORT_ROW_CAP,
  });

  const assessments = await prisma.assessment.findMany({
    where: { tenantId: user.tenantId },
    include: {
      candidate: { select: { firstName: true, lastName: true } },
      vacancy: { select: { title: true, company: { select: { name: true } } } },
    },
    orderBy: { completedAt: 'desc' },
    take: EXPORT_ROW_CAP,
  });

  const interviews = await prisma.interview.findMany({
    where: { tenantId: user.tenantId },
    include: { candidate: { select: { firstName: true, lastName: true } } },
    orderBy: { scheduledAt: 'desc' },
    take: EXPORT_ROW_CAP,
  });

  const tasks = await prisma.task.findMany({
    where: {
      tenantId: user.tenantId,
      ...(user.role === 'CONSULTANT' ? { assigneeId: user.id } : {}),
    },
    include: {
      company: { select: { name: true } },
      vacancy: { select: { title: true } },
    },
    orderBy: { dueDate: 'asc' },
    take: EXPORT_ROW_CAP,
  });

  const activeStatuses = new Set(['SEARCH_ACTIVE', 'EVALUATION', 'FINALISTS', 'OFFER', 'PROFILE_BUILDING', 'DISCOVERY', 'DISCOVERY_PENDING', 'APPROVAL_PENDING']);

  return [
    {
      name: 'Clientes',
      headers: ['Empresa', 'Sector', 'Ciudad', 'Estado', 'Correo', 'Teléfono', 'Procesos activos', 'Total procesos', 'Consultor'],
      rows: companies.map((co) => {
        const consultant = co.consultants[0]?.consultant;
        const active = co.vacancies.filter((v) => activeStatuses.has(v.status)).length;
        return [
          co.name,
          co.sector ?? '',
          co.city ?? '',
          co.status ?? '',
          co.email ?? '',
          co.phone ?? '',
          active,
          co.vacancies.length,
          consultant ? `${consultant.firstName} ${consultant.lastName}` : '',
        ];
      }),
    },
    {
      name: 'Procesos',
      headers: ['Cargo', 'Cliente', 'Estado', 'Ciudad', 'Modalidad', 'Prioridad', 'Candidatos', 'Consultor', 'Creado'],
      rows: vacancies.map((v) => [
        v.title,
        v.company?.name ?? '',
        v.status,
        v.city ?? '',
        v.modality ?? '',
        v.priority ?? '',
        v._count.candidates,
        v.consultantId ? consultantNameById.get(v.consultantId) ?? '' : '',
        fmtDate(v.createdAt),
      ]),
    },
    {
      name: 'Candidatos',
      headers: ['Nombre', 'Correo', 'Teléfono', 'Ciudad', 'Estado', 'Fuente', 'Compatibilidad', 'Etapa actual', 'Proceso', 'Cliente'],
      rows: candidates.map((c) => {
        const primary = c.vacancies[0];
        return [
          `${c.firstName} ${c.lastName}`,
          c.email ?? '',
          c.phone ?? '',
          c.city ?? '',
          c.status,
          c.source ?? '',
          c.compatibility ?? '',
          primary?.stage ?? '',
          primary?.vacancy.title ?? '',
          primary?.vacancy.company?.name ?? '',
        ];
      }),
    },
    {
      name: 'Pipeline',
      headers: ['Candidato', 'Correo', 'Proceso', 'Cliente', 'Etapa', 'Ranking', 'Fuente', 'Actualizado'],
      rows: candidates.flatMap((c) =>
        c.vacancies.map((cv) => [
          `${c.firstName} ${c.lastName}`,
          c.email ?? '',
          cv.vacancy.title,
          cv.vacancy.company?.name ?? '',
          cv.stage,
          cv.ranking ?? '',
          cv.source ?? c.source ?? '',
          fmtDate(cv.updatedAt),
        ]),
      ),
    },
    {
      name: 'Evaluaciones',
      headers: ['Candidato', 'Proceso', 'Cliente', 'Tipo', 'Competencia', 'Puntaje', 'Máximo', 'Resultado', 'Completada'],
      rows: assessments.map((a) => [
        `${a.candidate.firstName} ${a.candidate.lastName}`,
        a.vacancy?.title ?? '',
        a.vacancy?.company?.name ?? '',
        ASSESSMENT_TYPE_LABELS[a.type] ?? a.type,
        a.title,
        a.score ?? '',
        a.maxScore,
        a.result ?? '',
        fmtDate(a.completedAt),
      ]),
    },
    {
      name: 'Entrevistas',
      headers: ['Candidato', 'Estado', 'Fecha', 'Puntaje', 'Notas'],
      rows: interviews.map((i) => [
        `${i.candidate.firstName} ${i.candidate.lastName}`,
        i.status,
        fmtDate(i.scheduledAt),
        i.overallScore ?? '',
        i.summary ?? '',
      ]),
    },
    {
      name: 'Tareas',
      headers: ['Tarea', 'Estado', 'Prioridad', 'Cliente', 'Proceso', 'Vence'],
      rows: tasks.map((t) => [
        t.title,
        t.status,
        t.priority ?? '',
        t.company?.name ?? '',
        t.vacancy?.title ?? '',
        fmtDate(t.dueDate),
      ]),
    },
  ];
}

export async function buildExcelExportBuffer(user: AuthUser) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Litt Hunter';
  workbook.created = new Date();

  const sheets = await gatherSheets(user);
  for (const sheet of sheets) addSheet(workbook, sheet);

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
