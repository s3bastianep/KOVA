# LITT HUNTER

Landing page de Litt Hunter — React + Vite + API propia de agendamiento.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre **http://localhost:3000** — sirve el frontend (Vite) y la API de citas en el mismo puerto.

## Agendamiento propio (`/contacto`)

Sin Calendly ni servicios externos. Flujo:

1. El visitante elige **fecha y hora** en el calendario Litt Hunter
2. Completa **nombre, correo, teléfono y empresa**
3. La cita se guarda en **Postgres** (vía el dashboard Next.js) con `POST /api/bookings`

### API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/availability?date=YYYY-MM-DD` | Horarios libres del día |
| `POST` | `/api/bookings` | Crear cita |
| `GET` | `/api/health` | Estado del servicio |

### Configurar horarios

Edita `shared/schedule.js`: días laborables, franja horaria (9:00–17:00), duración de slot (30 min), zona horaria. Las citas se guardan en Postgres a través del dashboard (`/api/bookings`).

## Deploy en Railway

1. Conecta el repo en [railway.app](railway.app) con **Root Directory = raíz del repo** (no `apps/dashboard`).
2. **Build command:** `npm run build` (landing Vite → `public/www` + Next).
3. **Start command:** `npm run start` (prepara schema Postgres y arranca Next; sirve landing + API + portal).
4. Variables mínimas: `DATABASE_URL` (Postgres), `JWT_SECRET` (largo y aleatorio), `JWT_EXPIRES_IN=1h`.
5. Genera un dominio en **Settings → Networking**.

Cada push redeploya la app. Las citas y todos los datos persisten en la base de datos Postgres de Railway (variable `DATABASE_URL`); no se pierden al redeployar.

> **Nota:** Un solo servicio Next.js sirve marketing + plataforma. No configures dos servicios ni Root Directory `apps/dashboard` (docs antiguas en `PLATFORM.md` están marcadas como históricas).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Landing (Vite+proxy) en `:3000` + dashboard Next en `:3001` |
| `npm run build` | Build landing → `apps/dashboard/public/www` + `next build` |
| `npm run start` | Arranque producción: schema Postgres + `next start` (Railway) |
| `npm run smoke:prod` | Smoke HTTPS/DB/registro/login/citas contra la URL pública |
| `npm run lint` | ESLint |

### Smoke de producción

Tras un deploy en Railway (o al apuntar el dominio custom):

```bash
npm run smoke:prod
# o contra otra URL:
SMOKE_BASE_URL=https://tu-servicio.up.railway.app npm run smoke:prod
```

Verifica HTTPS, `/api/health` (Postgres real, `mockMode=false`), páginas públicas, registro de candidato, login y una cita real.

## Dominio canónico

La URL pública es **`https://litthunter.com`** (ya conectada a Railway vía Cloudflare).

Si agregas `www.litthunter.com`, crea el registro DNS que indique Railway/Cloudflare (hoy el apex responde; `www` puede faltar).

En el build puedes fijar `VITE_SITE_URL=https://litthunter.com` (también es el default en código).

El hostname de Railway (`*.up.railway.app`) es solo interno de hosting; la marca y el dominio públicos son Litt Hunter.
