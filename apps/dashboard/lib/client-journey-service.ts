import { prisma } from './prisma';
import { isMockMode, MOCK_COMPANIES } from './mock';
import {
  CLIENT_JOURNEY_STAGES,
  daysSince,
  nextStageId,
  type ClientJourneyEvent,
  type ClientJourneyRecord,
} from './client-journey';

type JourneyMeta = {
  currentStageId?: string;
  stageEnteredAt?: string;
  history?: ClientJourneyEvent[];
  value?: string;
};

const mockJourney = new Map<string, JourneyMeta>();

function seedMockJourney() {
  if (mockJourney.size > 0) return;
  mockJourney.set('seed-company-001', {
    currentStageId: 'recruitment',
    stageEnteredAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    value: '$15M COP/mes',
    history: [
      { stageId: 'discovery', action: 'initial', at: new Date(Date.now() - 20 * 86400000).toISOString() },
      { stageId: 'ideal_seller', action: 'advance', at: new Date(Date.now() - 14 * 86400000).toISOString() },
      { stageId: 'recruitment', action: 'advance', at: new Date(Date.now() - 4 * 86400000).toISOString() },
    ],
  });
  mockJourney.set('seed-company-002', {
    currentStageId: 'discovery',
    stageEnteredAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    value: '$12M COP/mes',
    history: [{ stageId: 'discovery', action: 'initial', at: new Date(Date.now() - 2 * 86400000).toISOString() }],
  });
  mockJourney.set('mock-client-003', {
    currentStageId: 'evaluation',
    stageEnteredAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    value: '$8M COP/mes',
    history: [
      { stageId: 'discovery', action: 'initial', at: new Date(Date.now() - 30 * 86400000).toISOString() },
      { stageId: 'ideal_seller', action: 'advance', at: new Date(Date.now() - 24 * 86400000).toISOString() },
      { stageId: 'recruitment', action: 'advance', at: new Date(Date.now() - 16 * 86400000).toISOString() },
      { stageId: 'evaluation', action: 'advance', at: new Date(Date.now() - 6 * 86400000).toISOString() },
    ],
  });
  mockJourney.set('mock-client-004', {
    currentStageId: 'onboarding',
    stageEnteredAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    value: '$10M COP/mes',
    history: [
      { stageId: 'discovery', action: 'initial', at: new Date(Date.now() - 90 * 86400000).toISOString() },
      { stageId: 'onboarding', action: 'advance', at: new Date(Date.now() - 10 * 86400000).toISOString() },
    ],
  });
}

const MOCK_EXTRA_CLIENTS = [
  { id: 'mock-client-003', name: 'Logística Express', city: 'Bogotá', primaryContact: 'Carlos Méndez' },
  { id: 'mock-client-004', name: 'InnovaRetail', city: 'Cali', primaryContact: 'Ana Torres' },
];

function metaToRecord(
  companyId: string,
  companyName: string,
  meta: JourneyMeta,
  extras?: { contact?: string; city?: string },
): ClientJourneyRecord {
  const currentStageId = meta.currentStageId ?? CLIENT_JOURNEY_STAGES[0].id;
  const stageEnteredAt = meta.stageEnteredAt ?? new Date().toISOString();
  return {
    companyId,
    companyName,
    contact: extras?.contact,
    city: extras?.city,
    value: meta.value,
    currentStageId,
    stageEnteredAt,
    daysInStage: daysSince(stageEnteredAt),
    history: meta.history ?? [{ stageId: currentStageId, action: 'initial', at: stageEnteredAt }],
  };
}

function parseJourneyMeta(metadata: unknown): JourneyMeta {
  if (!metadata || typeof metadata !== 'object') return {};
  const j = (metadata as { journey?: JourneyMeta }).journey;
  return j ?? {};
}

function stageSortIndex(id: string) {
  return CLIENT_JOURNEY_STAGES.findIndex((s) => s.id === id);
}

export async function listClientJourneys(tenantId: string): Promise<ClientJourneyRecord[]> {
  if (isMockMode()) {
    seedMockJourney();
    const records: ClientJourneyRecord[] = [];
    for (const c of MOCK_COMPANIES) {
      const meta = mockJourney.get(c.id) ?? { currentStageId: 'discovery', stageEnteredAt: new Date().toISOString(), history: [] };
      records.push(metaToRecord(c.id, c.name, meta, { city: c.city }));
    }
    for (const c of MOCK_EXTRA_CLIENTS) {
      const meta = mockJourney.get(c.id)!;
      records.push(metaToRecord(c.id, c.name, meta, { contact: c.primaryContact, city: c.city }));
    }
    return records.sort((a, b) => stageSortIndex(a.currentStageId) - stageSortIndex(b.currentStageId));
  }

  try {
    const companies = await prisma.company.findMany({
      where: { tenantId },
      select: { id: true, name: true, city: true, primaryContact: true, metadata: true },
      orderBy: { updatedAt: 'desc' },
    });
    return companies.map((c) => {
      const meta = parseJourneyMeta(c.metadata);
      if (!meta.currentStageId) {
        meta.currentStageId = CLIENT_JOURNEY_STAGES[0].id;
        meta.stageEnteredAt = new Date().toISOString();
        meta.history = [{ stageId: meta.currentStageId, action: 'initial', at: meta.stageEnteredAt }];
      }
      return metaToRecord(c.id, c.name, meta, { contact: c.primaryContact ?? undefined, city: c.city ?? undefined });
    });
  } catch {
    return [];
  }
}

async function persistJourney(companyId: string, tenantId: string, meta: JourneyMeta) {
  if (isMockMode()) {
    mockJourney.set(companyId, meta);
    return;
  }
  const company = await prisma.company.findFirst({ where: { id: companyId, tenantId }, select: { metadata: true } });
  if (!company) throw new Error('Cliente no encontrado');
  const currentMeta = (company.metadata as Record<string, unknown>) ?? {};
  await prisma.company.update({
    where: { id: companyId },
    data: { metadata: { ...currentMeta, journey: meta } },
  });
}

export async function updateClientJourney(
  tenantId: string,
  companyId: string,
  action: 'advance' | 'hold',
  reason?: string,
): Promise<ClientJourneyRecord | null> {
  if (isMockMode()) seedMockJourney();

  let meta: JourneyMeta;
  let companyName = '';
  let contact: string | undefined;
  let city: string | undefined;

  if (isMockMode()) {
    meta = mockJourney.get(companyId) ?? { currentStageId: 'discovery', stageEnteredAt: new Date().toISOString(), history: [] };
    const found = [...MOCK_COMPANIES, ...MOCK_EXTRA_CLIENTS].find((c) => c.id === companyId);
    if (!found) return null;
    companyName = found.name;
    contact = 'primaryContact' in found ? found.primaryContact : undefined;
    city = found.city;
  } else {
    const company = await prisma.company.findFirst({
      where: { id: companyId, tenantId },
      select: { name: true, city: true, primaryContact: true, metadata: true },
    });
    if (!company) return null;
    companyName = company.name;
    contact = company.primaryContact ?? undefined;
    city = company.city ?? undefined;
    meta = parseJourneyMeta(company.metadata);
    if (!meta.currentStageId) {
      meta.currentStageId = CLIENT_JOURNEY_STAGES[0].id;
      meta.stageEnteredAt = new Date().toISOString();
      meta.history = [];
    }
  }

  const now = new Date().toISOString();
  const history = [...(meta.history ?? [])];

  if (action === 'advance') {
    const next = nextStageId(meta.currentStageId!);
    if (!next) throw new Error('El cliente ya está en la etapa final');
    history.push({ stageId: next, action: 'advance', reason: reason?.trim(), at: now });
    meta = { ...meta, currentStageId: next, stageEnteredAt: now, history };
  } else {
    history.push({
      stageId: meta.currentStageId!,
      action: 'hold',
      reason: reason?.trim() || 'Sin avance — requiere más trabajo en esta etapa',
      at: now,
    });
    meta = { ...meta, history };
  }

  await persistJourney(companyId, tenantId, meta);
  return metaToRecord(companyId, companyName, meta, { contact, city });
}
