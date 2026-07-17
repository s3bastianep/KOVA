import express from 'express';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.argv.includes('--dev');
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '32kb' }));

// Todas las rutas de API y del dashboard viven en Next.js (apps/dashboard), incluida
// la agenda de citas (/api/bookings, /api/availability), que persiste en Postgres.
// Este servidor solo sirve la SPA de la landing y, en dev, proxea al dashboard.
// En Railway este archivo no se usa: `npm run start` arranca Next directamente.
const DASHBOARD_PROXY_ROUTE =
  /^\/(?:api|_next|postular|dev|portal|dashboard|empresas|clientes|vacantes|procesos|pipeline-comercial|crm|calendario|agenda|tareas|reportes|configuracion|candidatos|discovery|ats|entrevistas|evaluaciones|finalistas|onboarding|academia|documentos|perfil-cargo)(?:\/|$)/;

function mountDashboardDevProxy() {
  const dashboardPort = Number(process.env.DASHBOARD_PORT) || 3001;
  const dashboardHost = process.env.DASHBOARD_HOST || '127.0.0.1';

  app.use((req, res, next) => {
    if (!DASHBOARD_PROXY_ROUTE.test(req.path)) return next();

    const headers = { ...req.headers, host: `${dashboardHost}:${dashboardPort}` };
    const hasParsedJsonBody =
      req.body &&
      typeof req.body === 'object' &&
      req.method !== 'GET' &&
      req.method !== 'HEAD' &&
      !Buffer.isBuffer(req.body);

    let bodyBuffer = null;
    if (hasParsedJsonBody) {
      bodyBuffer = Buffer.from(JSON.stringify(req.body), 'utf8');
      headers['content-type'] = headers['content-type'] ?? 'application/json';
      headers['content-length'] = String(bodyBuffer.length);
      delete headers['transfer-encoding'];
    }

    const proxyReq = http.request(
      {
        hostname: dashboardHost,
        port: dashboardPort,
        path: req.url,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
        proxyRes.pipe(res);
      },
    );

    proxyReq.on('error', () => {
      if (!res.headersSent) {
        res
          .status(502)
          .type('text/plain')
          .send('Esta ruta requiere el dashboard en ejecución: cd apps/dashboard && npm run dev');
      }
    });

    if (bodyBuffer) {
      proxyReq.end(bodyBuffer);
    } else {
      req.pipe(proxyReq);
    }
  });
}

async function start() {
  if (isDev) {
    mountDashboardDevProxy();
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const dist = path.join(__dirname, '../dist');
    app.use(express.static(dist));
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(dist, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kova ${isDev ? 'dev' : 'prod'} → http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
