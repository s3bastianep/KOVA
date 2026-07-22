# KOVA Estabilidad Prod — Implementation Plan

> **For agentic workers:** Execute inline in this session. Steps use checkbox syntax.

**Goal:** Remediación P0 + P1 críticos de estabilidad (citas TZ/doble-reserva, health/boot, auth status, fall-open, docs).

**Architecture:** Fixes puntuales en Next dashboard + shared schedule semantics; sin baseline de migraciones Prisma en esta pasada (operación deliberada aparte).

**Tech Stack:** Next.js, Prisma, Postgres, Vitest, Railway start scripts.

## Global Constraints

- No `--accept-data-loss` en db push.
- No activar mock en production.
- Zona horaria agenda: America/Bogota / utcOffset `-05:00` de `shared/schedule.js`.
- No commit salvo que el usuario lo pida.

---

### Task 1: TZ + anti doble-reserva + no fall-open agenda

**Files:**
- Modify: `apps/dashboard/lib/agenda-request-service.ts`
- Modify: `apps/dashboard/app/api/bookings/route.ts` (si hace falta P2002)
- Modify: `apps/dashboard/lib/booking-slots.ts` (si errores deben propagarse)
- Modify: `apps/dashboard/prisma/schema.prisma` (índice/unique si viable)
- Test: `apps/dashboard/tests/agenda-publica.test.ts` (extender)

- [ ] Fix `parseTimeToDate` con offset Bogotá
- [ ] Propagar errores de listado; no mock agendaState en prod
- [ ] Unique o manejo atómico de conflicto de slot
- [ ] Tests verdes

### Task 2: Health 503 + fail-fast boot + JWT example

**Files:**
- Modify: `apps/dashboard/app/api/health/route.ts`
- Modify: `apps/dashboard/scripts/railway-start.mjs`
- Modify: `apps/dashboard/.env.example`

- [ ] Health 503 si prod y !dbReady
- [ ] Exit 1 sin DATABASE_URL/JWT_SECRET en production
- [ ] JWT_EXPIRES_IN=1h en example

### Task 3: Login status + docs monolito

**Files:**
- Modify: `apps/dashboard/app/api/auth/login/route.ts`
- Modify: `README.md`
- Modify: `PLATFORM.md` (aviso histórico)

- [ ] Rechazar users no ACTIVE
- [ ] Alinear docs a un servicio Next

### Task 4: Verificar

- [ ] `npm test` / vitest agenda + auth relevantes
- [ ] Lint archivos tocados
