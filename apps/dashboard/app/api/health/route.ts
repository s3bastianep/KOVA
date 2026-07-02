import { isMockMode } from '../../../lib/mock';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasDb = Boolean(process.env.DATABASE_URL?.trim());
  const mock = isMockMode();
  return Response.json({ ok: true, service: 'kova-talent-os', database: hasDb, mockMode: mock });
}
