# Kova Talent OS — Plataforma

Plataforma privada de reclutamiento comercial que vive junto a la página pública de Kova.
Todo funciona en **Railway**, sin servicios externos.

## Arquitectura (simplificada)

Una sola aplicación **Next.js** contiene el frontend (dashboard) **y** el backend (API + base de datos):

```
KOVA/
├── src/                     # Página pública (Vite) — servicio Railway existente
├── server/                  # Servidor Express de la landing
└── apps/
    └── dashboard/           # Plataforma privada (Next.js) — nuevo servicio Railway
        ├── app/
        │   ├── (dashboard)/ # Pantallas privadas
        │   ├── api/         # API (route handlers) — reemplaza al backend NestJS
        │   └── login/
        ├── lib/             # prisma.ts, auth.ts, api.ts
        └── prisma/          # schema.prisma + seed.ts
```

No hay backend separado ni Supabase/Neon/Redis. La base de datos es **PostgreSQL nativo de Railway**.

## Componentes en Railway

| Servicio | Qué es | Root Directory |
|----------|--------|----------------|
| `kova-web` | Página pública (ya desplegada) | raíz del repo |
| `kova-app` | Plataforma privada (Next.js + API) | `apps/dashboard` |
| `Postgres` | Base de datos (plugin de Railway) | — |

## Desplegar en Railway (paso a paso)

1. **Base de datos**: en tu proyecto de Railway → **New → Database → PostgreSQL**.
   Railway crea la variable `DATABASE_URL` automáticamente.

2. **App de la plataforma**: **New → GitHub Repo** (el mismo repo) →
   en **Settings → Root Directory** escribe `apps/dashboard`.

3. **Variables** del servicio `apps/dashboard` (Settings → Variables):
   - `DATABASE_URL` → referencia la de Postgres: `${{Postgres.DATABASE_URL}}`
   - `JWT_SECRET` → un texto largo y aleatorio
   - `JWT_EXPIRES_IN` → `7d`

4. Railway usa `apps/dashboard/railway.json`:
   - **build**: instala dependencias y `next build`.
   - **start**: `npm run db:deploy && npm run start`
     (crea/actualiza las tablas con `prisma db push`, carga los datos iniciales y arranca Next.js).

5. **Conectar la landing con el login**: en el servicio de la página pública (`kova-web`),
   agrega la variable `VITE_DASHBOARD_URL` con la URL pública del servicio `apps/dashboard` + `/login`
   (ej. `https://kova-app-production.up.railway.app/login`) y vuelve a desplegar.

Con eso, el botón **Iniciar sesión** de la web pública abre la plataforma.

## Usuarios de prueba (se crean solos con el seed)

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Super Admin | `admin@kova.co` | `Kova2026!` |
| Consultor | `consultor@kova.co` | `Kova2026!` |
| Cliente | `cliente@techsales.co` | `Kova2026!` |

## Desarrollo local

```bash
# 1) Base de datos local (requiere Docker) — opcional
docker compose up -d postgres

cd apps/dashboard
cp .env.example .env        # ajusta DATABASE_URL y JWT_SECRET
npm install
npm run db:deploy           # crea tablas + datos de prueba
npm run dev                 # http://localhost:3001
```

La página pública sigue con `npm run dev` en la raíz del repo.

## API interna (route handlers)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Usuario actual |
| POST | `/api/auth/logout` | Cerrar sesión |
| GET | `/api/dashboard` | KPIs y actividad |
| GET/POST | `/api/empresas` | Empresas |
| GET | `/api/vacantes` | Vacantes |
| GET | `/api/candidatos` | Candidatos |
| GET | `/api/discovery` | Discovery comercial |
| GET | `/api/tareas` | Tareas |
| GET | `/api/health` | Healthcheck |

Todas (excepto login/health) requieren `Authorization: Bearer <token>` y respetan el
aislamiento multi-tenant y los roles.

## Stack

Next.js 15 · React · TypeScript · Tailwind CSS · React Query · Prisma · PostgreSQL · JWT + bcrypt.
