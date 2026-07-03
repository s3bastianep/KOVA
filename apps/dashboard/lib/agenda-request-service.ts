import { randomUUID } from 'crypto';
import { prisma } from './prisma';
import { isMockMode } from './mock';
import type { AgendaItem, AgendaMoveEntry, AgendaStatus } from './agenda';

export type AgendaRequestStatus = 'REQUESTED' | 'ACCEPTED' | 'REJECTED';

export type AgendaRequestRecord = {
  id: string;
  tenantId: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  companyName: string;
  type: string;
  scheduledAt: string;
  endAt?: string;
  purpose?: string;
  notes?: string;
  status: AgendaRequestStatus;
  statusReason?: string;
  moveHistory: AgendaMoveEntry[];
  agendaItemKey?: string;
  createdAt: string;
};

const mockRequests = new Map<string, AgendaRequestRecord>();

type AgendaRequestDb = {
  create: (args: { data: Record<string, unknown> }) => Promise<Record<string, unknown>>;
  findMany: (args: { where: Record<string, unknown>; orderBy?: Record<string, unknown> }) => Promise<Record<string, unknown>[]>;
  findFirst: (args: { where: Record<string, unknown> }) => Promise<Record<string, unknown> | null>;
  update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<Record<string, unknown>>;
};

function agendaRequestDb(): AgendaRequestDb | null {
  const client = prisma as unknown as { agendaRequest?: AgendaRequestDb };
  return client.agendaRequest ?? null;
}

const mockAgendaStates = new Map<string, {
  itemKey: string;
  title: string;
  type: string;
  scheduledAt: string;
  endAt?: string;
  status: AgendaStatus;
  statusReason?: string;
  companyName?: string;
  contactName?: string;
  purpose?: string;
  notes?: string;
  moveHistory: AgendaMoveEntry[];
}>();

function agendaStoreKey(tenantId: string, itemKey: string) {
  return `${tenantId}:${itemKey}`;
}

async function persistRequestCalendarState(
  tenantId: string,
  state: {
    itemKey: string;
    title: string;
    type: string;
    scheduledAt: string;
    endAt?: string;
    status: AgendaStatus;
    statusReason?: string;
    companyName?: string;
    contactName?: string;
    purpose?: string;
    notes?: string;
    moveHistory: AgendaMoveEntry[];
  },
) {
  if (isMockMode()) {
    mockAgendaStates.set(agendaStoreKey(tenantId, state.itemKey), state);
    return;
  }
  try {
    await prisma.agendaState.upsert({
      where: { tenantId_itemKey: { tenantId, itemKey: state.itemKey } },
      create: {
        tenantId,
        itemKey: state.itemKey,
        title: state.title,
        type: state.type,
        scheduledAt: new Date(state.scheduledAt),
        endAt: state.endAt ? new Date(state.endAt) : null,
        status: state.status,
        statusReason: state.statusReason ?? null,
        companyName: state.companyName ?? null,
        contactName: state.contactName ?? null,
        purpose: state.purpose ?? null,
        notes: state.notes ?? null,
        moveHistory: state.moveHistory,
      },
      update: {
        scheduledAt: new Date(state.scheduledAt),
        endAt: state.endAt ? new Date(state.endAt) : null,
        status: state.status,
        statusReason: state.statusReason ?? null,
        moveHistory: state.moveHistory,
      },
    });
  } catch {
    mockAgendaStates.set(agendaStoreKey(tenantId, state.itemKey), state);
  }
}

export function getMockRequestAgendaStates(tenantId: string) {
  const items: typeof mockAgendaStates extends Map<string, infer V> ? V[] : never = [];
  for (const [key, value] of mockAgendaStates.entries()) {
    if (key.startsWith(`${tenantId}:`)) items.push(value);
  }
  return items;
}

function parseTimeToDate(dateKey: string, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const d = new Date(`${dateKey}T12:00:00`);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function endAtFromStart(start: Date, minutes = 30): string {
  return new Date(start.getTime() + minutes * 60_000).toISOString();
}

function rowToRecord(row: {
  id: string;
  tenantId: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  companyName: string;
  type: string;
  scheduledAt: Date;
  endAt: Date | null;
  purpose: string | null;
  notes: string | null;
  status: string;
  statusReason: string | null;
  moveHistory: unknown;
  agendaItemKey: string | null;
  createdAt: Date;
}): AgendaRequestRecord {
  return {
    id: row.id,
    tenantId: row.tenantId,
    requesterName: row.requesterName,
    requesterEmail: row.requesterEmail,
    requesterPhone: row.requesterPhone,
    companyName: row.companyName,
    type: row.type,
    scheduledAt: row.scheduledAt.toISOString(),
    endAt: row.endAt?.toISOString(),
    purpose: row.purpose ?? undefined,
    notes: row.notes ?? undefined,
    status: row.status as AgendaRequestStatus,
    statusReason: row.statusReason ?? undefined,
    moveHistory: (row.moveHistory as AgendaMoveEntry[]) ?? [],
    agendaItemKey: row.agendaItemKey ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function resolveDefaultTenantId(): Promise<string> {
  if (isMockMode()) return 'mock-tenant-001';
  const tenant = await prisma.tenant.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  });
  if (!tenant) throw new Error('No hay tenant configurado');
  return tenant.id;
}

export async function createAgendaRequest(input: {
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  companyName: string;
  date: string;
  time: string;
  type?: string;
  purpose?: string;
  notes?: string;
  tenantId?: string;
}): Promise<AgendaRequestRecord> {
  const tenantId = input.tenantId ?? (await resolveDefaultTenantId());
  const scheduledAt = parseTimeToDate(input.date, input.time);
  const endAt = endAtFromStart(scheduledAt);

  const data = {
    tenantId,
    requesterName: input.requesterName.trim(),
    requesterEmail: input.requesterEmail.trim().toLowerCase(),
    requesterPhone: input.requesterPhone.trim(),
    companyName: input.companyName.trim(),
    type: input.type?.trim() || 'Consultoría',
    scheduledAt,
    endAt: new Date(endAt),
    purpose: input.purpose?.trim() || 'Consultoría comercial Kova — 30 min',
    notes: input.notes?.trim() || null,
    status: 'REQUESTED',
    moveHistory: [],
  };

  const db = agendaRequestDb();
  if (!db) {
    const id = randomUUID();
    const record: AgendaRequestRecord = {
      id,
      tenantId,
      requesterName: data.requesterName,
      requesterEmail: data.requesterEmail,
      requesterPhone: data.requesterPhone,
      companyName: data.companyName,
      type: data.type,
      scheduledAt: scheduledAt.toISOString(),
      endAt,
      purpose: data.purpose ?? undefined,
      notes: data.notes ?? undefined,
      status: 'REQUESTED',
      moveHistory: [],
      createdAt: new Date().toISOString(),
    };
    mockRequests.set(id, record);
    return record;
  }

  const row = await db.create({ data });
  return rowToRecord(row as Parameters<typeof rowToRecord>[0]);
}

export async function listAgendaRequests(
  tenantId: string,
  status?: AgendaRequestStatus,
): Promise<AgendaRequestRecord[]> {
  if (isMockMode()) {
    return [...mockRequests.values()]
      .filter((r) => r.tenantId === tenantId && (!status || r.status === status))
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  }

  try {
    const db = agendaRequestDb();
    if (!db) return [];
    const rows = await db.findMany({
      where: { tenantId, ...(status ? { status } : {}) },
      orderBy: { scheduledAt: 'asc' },
    });
    return rows.map((row) => rowToRecord(row as Parameters<typeof rowToRecord>[0]));
  } catch {
    return [];
  }
}

async function getRequest(tenantId: string, id: string): Promise<AgendaRequestRecord | null> {
  if (isMockMode()) {
    const r = mockRequests.get(id);
    return r && r.tenantId === tenantId ? r : null;
  }
  try {
    const db = agendaRequestDb();
    if (!db) return null;
    const row = await db.findFirst({ where: { id, tenantId } });
    return row ? rowToRecord(row as Parameters<typeof rowToRecord>[0]) : null;
  } catch {
    return null;
  }
}

async function saveRequest(record: AgendaRequestRecord) {
  if (isMockMode()) {
    mockRequests.set(record.id, record);
    return;
  }
  const db = agendaRequestDb();
  if (!db) {
    mockRequests.set(record.id, record);
    return;
  }
  await db.update({
    where: { id: record.id },
    data: {
      scheduledAt: new Date(record.scheduledAt),
      endAt: record.endAt ? new Date(record.endAt) : null,
      status: record.status,
      statusReason: record.statusReason ?? null,
      moveHistory: record.moveHistory,
      agendaItemKey: record.agendaItemKey ?? null,
    },
  });
}

function requestToAgendaItem(record: AgendaRequestRecord): AgendaItem {
  const itemKey = record.agendaItemKey ?? `req-${record.id}`;
  return {
    id: record.id,
    itemKey,
    title: `${record.type} — ${record.companyName}`,
    type: record.type,
    date: record.scheduledAt,
    endDate: record.endAt,
    status: record.status === 'REJECTED' ? 'REJECTED' : 'PENDING',
    statusReason: record.statusReason,
    moveCount: record.moveHistory.length,
    moveHistory: record.moveHistory,
    companyName: record.companyName,
    contactName: record.requesterName,
    purpose: record.purpose,
    notes: `Correo: ${record.requesterEmail} · Tel: ${record.requesterPhone}${record.notes ? ` · ${record.notes}` : ''}`,
  };
}

async function materializeOnCalendar(tenantId: string, record: AgendaRequestRecord) {
  const itemKey = `req-${record.id}`;
  record.agendaItemKey = itemKey;
  const item = requestToAgendaItem(record);
  await persistRequestCalendarState(tenantId, {
    itemKey,
    title: item.title,
    type: item.type,
    scheduledAt: item.date,
    endAt: item.endDate,
    status: item.status,
    statusReason: record.statusReason,
    companyName: record.companyName,
    contactName: record.requesterName,
    purpose: record.purpose,
    notes: item.notes,
    moveHistory: record.moveHistory,
  });
}

export async function acceptAgendaRequest(
  tenantId: string,
  id: string,
  reason?: string,
): Promise<{ request: AgendaRequestRecord; item: AgendaItem } | null> {
  const record = await getRequest(tenantId, id);
  if (!record || record.status !== 'REQUESTED') return null;

  record.status = 'ACCEPTED';
  record.statusReason = reason?.trim() || 'Solicitud aceptada';
  await materializeOnCalendar(tenantId, record);
  await saveRequest(record);
  return { request: record, item: requestToAgendaItem(record) };
}

export async function rejectAgendaRequest(
  tenantId: string,
  id: string,
  reason: string,
): Promise<{ request: AgendaRequestRecord; item: AgendaItem } | null> {
  if (!reason.trim()) throw new Error('Indica el motivo del rechazo');
  const record = await getRequest(tenantId, id);
  if (!record || record.status !== 'REQUESTED') return null;

  record.status = 'REJECTED';
  record.statusReason = reason.trim();
  await materializeOnCalendar(tenantId, record);
  await saveRequest(record);
  return { request: record, item: requestToAgendaItem(record) };
}

export async function rescheduleAgendaRequest(
  tenantId: string,
  id: string,
  newDateIso: string,
  reason: string,
): Promise<AgendaRequestRecord | null> {
  if (!reason.trim()) throw new Error('Indica el motivo del cambio de fecha');
  const record = await getRequest(tenantId, id);
  if (!record || record.status !== 'REQUESTED') return null;

  const fromDate = record.scheduledAt;
  const old = new Date(fromDate);
  const next = new Date(newDateIso);
  if (record.endAt) {
    const durationMs = new Date(record.endAt).getTime() - old.getTime();
    record.endAt = new Date(next.getTime() + durationMs).toISOString();
  } else {
    record.endAt = endAtFromStart(next);
  }

  record.moveHistory = [
    ...record.moveHistory,
    {
      fromDate,
      toDate: next.toISOString(),
      reason: reason.trim(),
      movedAt: new Date().toISOString(),
    },
  ];
  record.scheduledAt = next.toISOString();
  await saveRequest(record);
  return record;
}

export function agendaItemsFromRequests(records: AgendaRequestRecord[]): AgendaItem[] {
  return records
    .filter((r) => r.status === 'ACCEPTED' || r.status === 'REJECTED')
    .map(requestToAgendaItem);
}

export function seedMockAgendaRequests() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 2);
  tomorrow.setHours(10, 0, 0, 0);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 5);
  nextWeek.setHours(15, 30, 0, 0);

  const samples: AgendaRequestRecord[] = [
    {
      id: 'mock-req-001',
      tenantId: 'mock-tenant-001',
      requesterName: 'Andrés Villamizar',
      requesterEmail: 'andres@logisticaexpress.co',
      requesterPhone: '+57 310 555 1234',
      companyName: 'Logística Express',
      type: 'Consultoría',
      scheduledAt: tomorrow.toISOString(),
      endAt: endAtFromStart(tomorrow),
      purpose: 'Consultoría comercial — evaluar equipo de ventas',
      status: 'REQUESTED',
      moveHistory: [],
      createdAt: now.toISOString(),
    },
    {
      id: 'mock-req-002',
      tenantId: 'mock-tenant-001',
      requesterName: 'Carolina Ruiz',
      requesterEmail: 'carolina@innovaretail.com',
      requesterPhone: '+57 320 888 4567',
      companyName: 'InnovaRetail',
      type: 'Consultoría',
      scheduledAt: nextWeek.toISOString(),
      endAt: endAtFromStart(nextWeek),
      purpose: 'Consultoría comercial — contratar ejecutivos B2B',
      status: 'REQUESTED',
      moveHistory: [],
      createdAt: now.toISOString(),
    },
  ];

  for (const s of samples) mockRequests.set(s.id, s);
}
