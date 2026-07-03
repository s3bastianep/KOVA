import { prisma } from './prisma';
import { isMockMode, MOCK_CALENDAR, MOCK_TASKS, MOCK_INTERVIEWS } from './mock';
import { getMockRequestAgendaStates, seedMockAgendaRequests } from './agenda-request-service';
import type { AgendaItem, AgendaMoveEntry, AgendaStatus } from './agenda';

if (isMockMode()) {
  seedMockAgendaRequests();
}

type StoredState = {
  itemKey: string;
  title: string;
  type: string;
  scheduledAt: string;
  endAt?: string;
  status: AgendaStatus;
  statusReason?: string;
  companyName?: string;
  vacancyTitle?: string;
  contactName?: string;
  location?: string;
  purpose?: string;
  notes?: string;
  moveHistory: AgendaMoveEntry[];
};

const mockStore = new Map<string, StoredState>();

function storeKey(tenantId: string, itemKey: string) {
  return `${tenantId}:${itemKey}`;
}

function taskStatusToAgenda(status: string): AgendaStatus {
  if (status === 'COMPLETED') return 'COMPLETED';
  if (status === 'CANCELLED') return 'CANCELLED';
  return 'PENDING';
}

function baseMockItems(): Omit<AgendaItem, 'moveCount'>[] {
  const now = new Date();
  const items: Omit<AgendaItem, 'moveCount'>[] = [];

  for (const e of MOCK_CALENDAR) {
    items.push({
      id: e.id,
      itemKey: `cal-${e.id}`,
      title: e.title,
      type: e.type,
      date: e.date,
      endDate: e.endDate ?? undefined,
      status: 'PENDING',
      moveHistory: [],
      companyName: e.companyName,
      vacancyTitle: e.vacancyTitle,
      contactName: e.contactName,
      location: e.location,
      purpose: e.purpose,
      notes: e.notes,
    });
  }

  MOCK_TASKS.forEach((t, i) => {
    const due = new Date(now);
    due.setDate(due.getDate() + i * 2 + 1);
    due.setHours(10, 0, 0, 0);
    items.push({
      id: `task-${t.id}`,
      itemKey: `task-${t.id}`,
      title: t.title,
      type: 'Tarea',
      date: due.toISOString(),
      status: taskStatusToAgenda(t.status),
      moveHistory: [],
      companyName: t.company?.name,
      vacancyTitle: t.vacancy?.title,
      purpose: 'Tarea generada por automatización del proceso',
    });
  });

  for (const iv of MOCK_INTERVIEWS) {
    if (!iv.scheduledAt) continue;
    items.push({
      id: `iv-${iv.id}`,
      itemKey: `iv-${iv.id}`,
      title: `Entrevista - ${iv.candidateName}`,
      type: 'Entrevista',
      date: iv.scheduledAt,
      status: iv.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
      moveHistory: [],
      vacancyTitle: iv.vacancy,
      purpose: `Entrevista de ${iv.candidateName}`,
    });
  }

  return items;
}

function applyStored(item: Omit<AgendaItem, 'moveCount'>, stored?: StoredState): AgendaItem {
  if (!stored) {
    return { ...item, moveCount: item.moveHistory.length };
  }
  return {
    ...item,
    title: stored.title,
    type: stored.type,
    date: stored.scheduledAt,
    endDate: stored.endAt,
    status: stored.status,
    statusReason: stored.statusReason,
    companyName: stored.companyName ?? item.companyName,
    vacancyTitle: stored.vacancyTitle ?? item.vacancyTitle,
    contactName: stored.contactName ?? item.contactName,
    location: stored.location ?? item.location,
    purpose: stored.purpose ?? item.purpose,
    notes: stored.notes ?? item.notes,
    moveHistory: stored.moveHistory,
    moveCount: stored.moveHistory.length,
  };
}

async function loadStoredStates(tenantId: string): Promise<Map<string, StoredState>> {
  const map = new Map<string, StoredState>();

  if (isMockMode()) {
    for (const [key, value] of mockStore.entries()) {
      if (key.startsWith(`${tenantId}:`)) {
        map.set(key.slice(tenantId.length + 1), value);
      }
    }
    for (const stored of getMockRequestAgendaStates(tenantId)) {
      map.set(stored.itemKey, {
        itemKey: stored.itemKey,
        title: stored.title,
        type: stored.type,
        scheduledAt: stored.scheduledAt,
        endAt: stored.endAt,
        status: stored.status,
        statusReason: stored.statusReason,
        companyName: stored.companyName,
        contactName: stored.contactName,
        purpose: stored.purpose,
        notes: stored.notes,
        moveHistory: stored.moveHistory,
      });
    }
    return map;
  }

  try {
    const rows = await prisma.agendaState.findMany({ where: { tenantId } });
    for (const row of rows) {
      map.set(row.itemKey, {
        itemKey: row.itemKey,
        title: row.title,
        type: row.type,
        scheduledAt: row.scheduledAt.toISOString(),
        endAt: row.endAt?.toISOString(),
        status: row.status as AgendaStatus,
        statusReason: row.statusReason ?? undefined,
        companyName: row.companyName ?? undefined,
        vacancyTitle: row.vacancyTitle ?? undefined,
        contactName: row.contactName ?? undefined,
        location: row.location ?? undefined,
        purpose: row.purpose ?? undefined,
        notes: row.notes ?? undefined,
        moveHistory: (row.moveHistory as AgendaMoveEntry[]) ?? [],
      });
    }
  } catch {
    // Tabla aún no migrada - continuar con datos base
  }

  return map;
}

function itemInMonth(item: AgendaItem, year: number, month: number) {
  const d = new Date(item.date);
  return d.getFullYear() === year && d.getMonth() === month;
}

export async function listAgendaItems(tenantId: string, year: number, month: number): Promise<AgendaItem[]> {
  const storedMap = await loadStoredStates(tenantId);
  let items: AgendaItem[] = [];

  if (isMockMode()) {
    items = baseMockItems().map((item) => applyStored(item, storedMap.get(item.itemKey)));
    for (const stored of getMockRequestAgendaStates(tenantId)) {
      if (items.some((i) => i.itemKey === stored.itemKey)) continue;
      items.push({
        id: stored.itemKey,
        itemKey: stored.itemKey,
        title: stored.title,
        type: stored.type,
        date: stored.scheduledAt,
        endDate: stored.endAt,
        status: stored.status,
        statusReason: stored.statusReason,
        moveHistory: stored.moveHistory,
        moveCount: stored.moveHistory.length,
        companyName: stored.companyName,
        contactName: stored.contactName,
        purpose: stored.purpose,
        notes: stored.notes,
      });
    }
  } else {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);
    const rangeStart = new Date(year, month - 1, 1);
    const rangeEnd = new Date(year, month + 2, 0, 23, 59, 59);

    const [events, tasks] = await Promise.all([
      prisma.calendarEvent
        .findMany({
          where: { tenantId, startAt: { gte: rangeStart, lte: rangeEnd } },
          include: { company: { select: { name: true } }, vacancy: { select: { title: true } } },
        })
        .catch(() => []),
      prisma.task
        .findMany({
          where: { tenantId, dueDate: { gte: rangeStart, lte: rangeEnd } },
          include: { company: { select: { name: true } }, vacancy: { select: { title: true } } },
        })
        .catch(() => []),
    ]);

    for (const e of events) {
      const itemKey = `cal-${e.id}`;
      const base: Omit<AgendaItem, 'moveCount'> = {
        id: e.id,
        itemKey,
        title: e.title,
        type: e.description?.startsWith('type:') ? e.description.split('\n')[0].replace('type:', '').trim() : 'Actividad',
        date: e.startAt.toISOString(),
        endDate: e.endAt.toISOString(),
        status: 'PENDING',
        moveHistory: [],
        companyName: e.company?.name,
        vacancyTitle: e.vacancy?.title,
        location: e.location ?? undefined,
        purpose: e.description ?? undefined,
      };
      items.push(applyStored(base, storedMap.get(itemKey)));
    }

    for (const t of tasks) {
      if (!t.dueDate) continue;
      const itemKey = `task-${t.id}`;
      const base: Omit<AgendaItem, 'moveCount'> = {
        id: `task-${t.id}`,
        itemKey,
        title: t.title,
        type: 'Tarea',
        date: t.dueDate.toISOString(),
        status: taskStatusToAgenda(t.status),
        moveHistory: [],
        companyName: t.company?.name,
        vacancyTitle: t.vacancy?.title,
        purpose: t.description ?? undefined,
      };
      items.push(applyStored(base, storedMap.get(itemKey)));
    }

    for (const [, stored] of storedMap) {
      if (items.some((i) => i.itemKey === stored.itemKey)) continue;
      const d = new Date(stored.scheduledAt);
      if (d >= monthStart && d <= monthEnd) {
        items.push({
          id: stored.itemKey,
          itemKey: stored.itemKey,
          title: stored.title,
          type: stored.type,
          date: stored.scheduledAt,
          endDate: stored.endAt,
          status: stored.status,
          statusReason: stored.statusReason,
          moveHistory: stored.moveHistory,
          moveCount: stored.moveHistory.length,
          companyName: stored.companyName,
          vacancyTitle: stored.vacancyTitle,
          contactName: stored.contactName,
          location: stored.location,
          purpose: stored.purpose,
          notes: stored.notes,
        });
      }
    }
  }

  return items
    .filter((item) => itemInMonth(item, year, month))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

async function findItemBase(tenantId: string, itemKey: string): Promise<Omit<AgendaItem, 'moveCount'> | null> {
  if (itemKey.startsWith('req-')) {
    const stored = (await loadStoredStates(tenantId)).get(itemKey);
    if (stored) {
      return {
        id: itemKey,
        itemKey,
        title: stored.title,
        type: stored.type,
        date: stored.scheduledAt,
        endDate: stored.endAt,
        status: stored.status,
        statusReason: stored.statusReason,
        moveHistory: stored.moveHistory,
        companyName: stored.companyName,
        contactName: stored.contactName,
        purpose: stored.purpose,
        notes: stored.notes,
      };
    }
  }

  const all = baseMockItems();
  const found = all.find((i) => i.itemKey === itemKey);
  if (found) return found;

  if (isMockMode()) return null;

  if (itemKey.startsWith('cal-')) {
    const id = itemKey.replace('cal-', '');
    const e = await prisma.calendarEvent.findFirst({
      where: { id, tenantId },
      include: { company: { select: { name: true } }, vacancy: { select: { title: true } } },
    });
    if (!e) return null;
    return {
      id: e.id,
      itemKey,
      title: e.title,
      type: 'Actividad',
      date: e.startAt.toISOString(),
      endDate: e.endAt.toISOString(),
      status: 'PENDING',
      moveHistory: [],
      companyName: e.company?.name,
      vacancyTitle: e.vacancy?.title,
    };
  }

  if (itemKey.startsWith('task-')) {
    const id = itemKey.replace('task-', '');
    const t = await prisma.task.findFirst({
      where: { id, tenantId },
      include: { company: { select: { name: true } }, vacancy: { select: { title: true } } },
    });
    if (!t || !t.dueDate) return null;
    return {
      id: itemKey,
      itemKey,
      title: t.title,
      type: 'Tarea',
      date: t.dueDate.toISOString(),
      status: taskStatusToAgenda(t.status),
      moveHistory: [],
      companyName: t.company?.name,
      vacancyTitle: t.vacancy?.title,
    };
  }

  return null;
}

async function persistState(tenantId: string, state: StoredState) {
  if (isMockMode()) {
    mockStore.set(storeKey(tenantId, state.itemKey), state);
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
        vacancyTitle: state.vacancyTitle ?? null,
        contactName: state.contactName ?? null,
        location: state.location ?? null,
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
    mockStore.set(storeKey(tenantId, state.itemKey), state);
  }
}

async function getOrInitState(tenantId: string, itemKey: string): Promise<StoredState | null> {
  const storedMap = await loadStoredStates(tenantId);
  const existing = storedMap.get(itemKey);
  if (existing) return existing;

  const base = await findItemBase(tenantId, itemKey);
  if (!base) return null;

  return {
    itemKey: base.itemKey,
    title: base.title,
    type: base.type,
    scheduledAt: base.date,
    endAt: base.endDate,
    status: base.status,
    statusReason: base.statusReason,
    companyName: base.companyName,
    vacancyTitle: base.vacancyTitle,
    contactName: base.contactName,
    location: base.location,
    purpose: base.purpose,
    notes: base.notes,
    moveHistory: [],
  };
}

export async function createAgendaItem(
  tenantId: string,
  data: {
    title: string;
    type: string;
    scheduledAt: string;
    endAt?: string;
    companyName?: string;
    contactName?: string;
    location?: string;
    purpose?: string;
    notes?: string;
  },
): Promise<AgendaItem> {
  if (!data.title?.trim()) throw new Error('El título es obligatorio');
  if (!data.scheduledAt) throw new Error('La fecha y hora son obligatorias');

  const itemKey = `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const state: StoredState = {
    itemKey,
    title: data.title.trim(),
    type: data.type || 'Reunión cliente',
    scheduledAt: new Date(data.scheduledAt).toISOString(),
    endAt: data.endAt ? new Date(data.endAt).toISOString() : undefined,
    status: 'PENDING',
    companyName: data.companyName?.trim() || undefined,
    contactName: data.contactName?.trim() || undefined,
    location: data.location?.trim() || undefined,
    purpose: data.purpose?.trim() || undefined,
    notes: data.notes?.trim() || undefined,
    moveHistory: [],
  };

  await persistState(tenantId, state);

  return {
    id: itemKey,
    itemKey,
    title: state.title,
    type: state.type,
    date: state.scheduledAt,
    endDate: state.endAt,
    status: state.status,
    moveHistory: [],
    moveCount: 0,
    companyName: state.companyName,
    contactName: state.contactName,
    location: state.location,
    purpose: state.purpose,
    notes: state.notes,
  };
}

export async function updateAgendaStatus(
  tenantId: string,
  itemKey: string,
  status: AgendaStatus,
  reason?: string,
): Promise<AgendaItem | null> {
  const state = await getOrInitState(tenantId, itemKey);
  if (!state) return null;

  if (status === 'CANCELLED' && !reason?.trim()) {
    throw new Error('Indica el motivo de la cancelación');
  }

  state.status = status;
  state.statusReason = reason?.trim() || state.statusReason;

  await persistState(tenantId, state);
  const base = await findItemBase(tenantId, itemKey);
  return applyStored(base ?? { ...state, id: itemKey, moveHistory: state.moveHistory, status: state.status, date: state.scheduledAt }, state);
}

export async function rescheduleAgendaItem(
  tenantId: string,
  itemKey: string,
  newDateIso: string,
  reason: string,
): Promise<AgendaItem | null> {
  if (!reason.trim()) throw new Error('Indica el motivo del cambio de fecha');

  const state = await getOrInitState(tenantId, itemKey);
  if (!state) return null;

  const fromDate = state.scheduledAt;
  const old = new Date(fromDate);
  const next = new Date(newDateIso);

  if (state.endAt) {
    const endOld = new Date(state.endAt);
    const durationMs = endOld.getTime() - old.getTime();
    state.endAt = new Date(next.getTime() + durationMs).toISOString();
  }

  state.moveHistory = [
    ...state.moveHistory,
    {
      fromDate,
      toDate: next.toISOString(),
      reason: reason.trim(),
      movedAt: new Date().toISOString(),
    },
  ];
  state.scheduledAt = next.toISOString();
  if (state.status === 'COMPLETED') state.status = 'PENDING';

  await persistState(tenantId, state);
  const base = await findItemBase(tenantId, itemKey);
  return applyStored(base ?? { ...state, id: itemKey, moveHistory: state.moveHistory, status: state.status, date: state.scheduledAt }, state);
}
