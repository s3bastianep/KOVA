import { isMockMode } from '../../../lib/mock';
import { isSchemaReady } from '../../../lib/schema-ready';
import { withApiErrors } from '../../../lib/api-handler';

export const dynamic = 'force-dynamic';

export const GET = withApiErrors('health', handleGET);

async function handleGET() {
  const hasDb = Boolean(process.env.DATABASE_URL?.trim());
  const mock = isMockMode();
  const dbReady = hasDb && !mock ? await isSchemaReady().catch(() => false) : false;

  return Response.json({
    ok: true,
    service: 'kova-talent-os',
    booking: true,
    database: hasDb,
    dbReady,
    mockMode: mock,
  });
}
