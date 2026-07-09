import { isMockMode } from '../../../lib/mock';
import { isSchemaReady } from '../../../lib/schema-ready';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasDb = Boolean(process.env.DATABASE_URL?.trim());
  const mock = isMockMode();
  const dbReady = hasDb && !mock ? await isSchemaReady() : false;

  return Response.json({
    ok: true,
    service: 'kova-talent-os',
    booking: true,
    database: hasDb,
    dbReady,
    mockMode: mock,
  });
}
