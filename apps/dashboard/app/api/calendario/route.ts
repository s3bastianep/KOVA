import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized, isStaffRole } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { isMockMode, MOCK_CALENDAR } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

type CalendarItem = {
  id: string;
  title: string;
  type: string;
  date: string;
  endDate?: string | null;
  companyId?: string | null;
  companyName?: string | null;
  vacancyTitle?: string | null;
  contactName?: string | null;
  contactRole?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  location?: string | null;
  meetingUrl?: string | null;
  purpose?: string | null;
  notes?: string | null;
};

function mapEvent(e: {
  id: string;
  title: string;
  description: string | null;
  startAt: Date;
  endAt: Date;
  location: string | null;
  meetingUrl: string | null;
  company?: {
    id: string;
    name: string;
    primaryContact: string | null;
    phone: string | null;
    email: string | null;
    commercialDir: string | null;
  } | null;
  vacancy?: { title: string } | null;
}): CalendarItem {
  const type = e.description?.startsWith('type:')
    ? e.description.split('\n')[0].replace('type:', '').trim()
    : 'Actividad';
  const purpose = e.description?.includes('purpose:')
    ? e.description.match(/purpose:(.+)/)?.[1]?.trim() ?? null
    : e.description;
  const notes = e.description?.includes('notes:')
    ? e.description.match(/notes:(.+)/)?.[1]?.trim() ?? null
    : null;

  return {
    id: e.id,
    title: e.title,
    type,
    date: e.startAt.toISOString(),
    endDate: e.endAt.toISOString(),
    companyId: e.company?.id ?? null,
    companyName: e.company?.name ?? null,
    vacancyTitle: e.vacancy?.title ?? null,
    contactName: e.company?.primaryContact ?? e.company?.commercialDir ?? null,
    contactRole: e.company?.commercialDir ? 'Director Comercial' : null,
    contactPhone: e.company?.phone ?? null,
    contactEmail: e.company?.email ?? null,
    location: e.location,
    meetingUrl: e.meetingUrl,
    purpose,
    notes,
  };
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  if (!isStaffRole(user.role)) return unauthorized();

  if (isMockMode()) {
    const items = [...MOCK_CALENDAR].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    return Response.json(items);
  }

  const since = new Date(Date.now() - 7 * 86400000);

  const [events, followUps] = await Promise.all([
    prisma.calendarEvent.findMany({
      where: { tenantId: user.tenantId, startAt: { gte: since } },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            primaryContact: true,
            phone: true,
            email: true,
            commercialDir: true,
          },
        },
        vacancy: { select: { title: true } },
      },
      orderBy: { startAt: 'asc' },
    }).catch(() => []),
    prisma.followUp.findMany({
      where: {
        scheduledAt: { gte: since },
        company: { tenantId: user.tenantId },
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            primaryContact: true,
            phone: true,
            email: true,
            commercialDir: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    }).catch(() => []),
  ]);

  const fromEvents: CalendarItem[] = events.map(mapEvent);

  const fromFollowUps: CalendarItem[] = followUps
    .filter((f) => f.scheduledAt)
    .map((f) => ({
      id: `followup-${f.id}`,
      title: f.subject,
      type: f.type === 'call' ? 'Llamada' : f.type === 'meeting' ? 'Reunión cliente' : 'Seguimiento',
      date: f.scheduledAt!.toISOString(),
      companyId: f.company.id,
      companyName: f.company.name,
      contactName: f.company.primaryContact ?? f.company.commercialDir,
      contactPhone: f.company.phone,
      contactEmail: f.company.email,
      purpose: f.notes,
    }));

  const items = [...fromEvents, ...fromFollowUps].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return Response.json(items);
}
