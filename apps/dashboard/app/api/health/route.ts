import { isMockMode } from '../../../lib/mock';
import { isSchemaReady } from '../../../lib/schema-ready';
import { withApiErrors } from '../../../lib/api-handler';

export const dynamic = 'force-dynamic';

export const GET = withApiErrors('health', handleGET);

async function handleGET() {
  const hasDb = Boolean(process.env.DATABASE_URL?.trim());
  const mock = isMockMode();
  const dbReady = hasDb && !mock ? await isSchemaReady().catch(() => false) : false;
  const production = process.env.NODE_ENV === 'production';

  // En producción Railway solo mira HTTP status: no marcar healthy si la DB no está lista.
  const ready = production ? hasDb && dbReady && !mock : true;

  return Response.json(
    {
      ok: ready,
      service: 'kova-talent-os',
      booking: ready,
      database: hasDb,
      dbReady,
      mockMode: mock,
    },
    { status: ready ? 200 : 503 },
  );
}
