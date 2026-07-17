# KOVA

Landing page de Kova — React + Vite + API propia de agendamiento.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre **http://localhost:3000** — sirve el frontend (Vite) y la API de citas en el mismo puerto.

## Agendamiento propio (`/contacto`)

Sin Calendly ni servicios externos. Flujo:

1. El visitante elige **fecha y hora** en el calendario Kova
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

1. Conecta el repo en [railway.app](https://railway.app).
2. **Build command:** `npm run build`
3. **Start command:** `npm run start`
4. Genera un dominio en **Settings → Networking**.

Cada push redeploya la app. Las citas y todos los datos persisten en la base de datos Postgres de Railway (variable `DATABASE_URL`); no se pierden al redeployar.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Frontend + API en localhost:3000 |
| `npm run build` | Build de producción en `dist/` |
| `npm run start` | Sirve `dist/` + API (Railway) |
| `npm run lint` | ESLint |
