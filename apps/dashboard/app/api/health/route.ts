import { isMockMode } from '../../../lib/mock';
import { pingDatabase } from '../../../lib/db-ping';
import { resolveDatabaseUrl } from '../../../lib/database-url';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasDb = Boolean(resolveDatabaseUrl());
  const mock = isMockMode();
  const dbReady = hasDb && !mock ? await pingDatabase() : false;

  return Response.json({
    ok: true,
    service: 'kova-talent-os',
    booking: true,
    database: hasDb,
    dbReady,
    mockMode: mock,
  });
}
