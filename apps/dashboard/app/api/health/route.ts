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

  // En producción Railway solo mira HTTP status: 503 mientras schema/DB no estén listos.
  // El start script levanta Next primero y sincroniza Prisma después; el healthcheck
  // debe seguir reintentando (ver railway.toml healthcheckTimeout) hasta ok:true.
  const ready = production ? hasDb && dbReady && !mock : true;

  return Response.json(
    {
      ok: ready,
      service: 'kova-talent-os',
      booking: ready,
      database: hasDb,
      dbReady,
      mockMode: mock,
      warming: production && !ready,
    },
    { status: ready ? 200 : 503 },
  );
}
