# KOVA — Auditoría de estabilidad en producción (Fase 1)

**Fecha:** 2026-07-22  
**Estado:** Hallazgos listos — pendiente aprobación del usuario para plan de implementación  
**Alcance de esta fase:** Estabilidad en producción (health, auth, bookings, deploy Railway)  
**Fases siguientes (acordadas):** 2) Portal/onboarding → 3) Conversión landing → 4) Crecimiento/deuda

---

## 1. Objetivo

Entregar un diagnóstico detallado y priorizado de riesgos de producción, y luego un plan de implementación para remediar **P0** y **P1** críticos — sin tocar código hasta que el usuario apruebe este documento y el plan.

### Criterio de éxito de Fase 1

- Railway no marca healthy un servicio con DB/schema/JWT rotos.
- Las citas se guardan y leen con zona horaria Bogotá correcta.
- No es posible doble-reserva del mismo slot por carrera.
- Arranque fail-fast si faltan variables críticas.
- Auth no emite sesión a usuarios no activos; access tokens no viven 7 días por error de config.
- Documentación de deploy alineada al monolito real (un servicio Next).

---

## 2. Método acordado

**Enfoque:** auditoría secuencial por capa (1 a 1).

| Fase | Foco | Entregable |
|------|------|------------|
| **1 (esta)** | Estabilidad prod | Este spec + hallazgos P0/P1/P2 + plan de fixes |
| 2 | Portal / onboarding | Spec + hallazgos + plan |
| 3 | Conversión landing | Spec + hallazgos + plan |
| 4 | Crecimiento / deuda | Spec + backlog priorizado |

Profundidad de remediación Fase 1: **P0 primero → P1 → P2 opcional**.

---

## 3. Arquitectura real de producción (verificada)

Un solo servicio Railway (repo raíz):

1. `npm run build` → Vite landing → `apps/dashboard/public/www` + `prisma generate` + `next build`
2. `npm run start` → `railway-start.mjs` → `prisma db push` + verify → `next start` + seed en background
3. Middleware reescribe marketing a `/www`; `/api`, `/portal`, `/dashboard` van a Next

**No se usa** `server/index.js` en Railway (solo proxy local).  
`PLATFORM.md` (dos servicios) está **desactualizado** respecto al código.

---

## 4. Hallazgos — P0 (bloquear / arreglar ya)

### P0-1. Zona horaria incorrecta al guardar citas

| | |
|--|--|
| **Archivo** | `apps/dashboard/lib/agenda-request-service.ts` → `parseTimeToDate` |
| **Problema** | Usa `setHours` en TZ del proceso Node. Railway suele ser UTC. Al leer se formatea en `America/Bogota`. |
| **Efecto** | Usuario reserva 10:00 → se guarda 10:00 UTC → se muestra 05:00 Bogotá; el slot 10:00 sigue “libre”. |
| **Fix** | Construir Date con offset fijo de `shared/schedule.js` (`utcOffset: '-05:00'`), p.ej. `` `${date}T${time}:00-05:00` ``. Tests de round-trip. |

### P0-2. Doble reserva por carrera (TOCTOU)

| | |
|--|--|
| **Archivos** | `app/api/bookings/route.ts` (check luego create); `prisma/schema.prisma` modelo `AgendaRequest` (solo indexes, sin unique) |
| **Problema** | `isSlotAvailable` → `createAgendaRequest` sin constraint único ni transacción. |
| **Efecto** | Dos POST concurrentes pueden crear dos citas al mismo slot. |
| **Fix** | Unique (o parcial) en `(tenantId, scheduledAt)` + manejar `P2002` como 409; idealmente insert atómico. |

### P0-3. Healthcheck siempre “verde”

| | |
|--|--|
| **Archivo** | `app/api/health/route.ts` — siempre `ok: true` / HTTP 200 |
| **Problema** | Railway solo mira status HTTP. DB ausente/rota → tráfico igual. |
| **Fix** | En producción: **503** + `ok: false` si `!DATABASE_URL` o `!dbReady`. Opcional: `/live` vs `/ready`. |

### P0-4. Boot sin `DATABASE_URL` / sin validar `JWT_SECRET`

| | |
|--|--|
| **Archivos** | `scripts/railway-start.mjs` (continúa sin DB en prod); `lib/auth.ts` (throw al importar JWT) |
| **Problema** | Start no aborta sin DB; health no importa auth → servicio “vivo” pero bookings/auth rotos. |
| **Fix** | Fail-fast en `railway-start.mjs`: exit 1 si faltan `DATABASE_URL` o `JWT_SECRET` en production. |

### P0-5. Schema solo con `db push` (sin migraciones versionadas)

| | |
|--|--|
| **Evidencia** | No existe `prisma/migrations/`; boot y build usan `db push`. |
| **Problema** | Deploys no reproducibles; cambios destructivos pueden tumbar boot; sin rollback. |
| **Fix** | Baseline migration desde prod + `prisma migrate deploy` en start; `db push` solo local. *(Cuidado: operación deliberada.)* |

### P0-6. Docs de dos servicios pueden romper el deploy

| | |
|--|--|
| **Archivo** | `PLATFORM.md` vs `README.md` / `railway.toml` |
| **Problema** | Seguir PLATFORM (Root Directory = `apps/dashboard` + Express separado) rompe build/landing. |
| **Fix** | Marcar PLATFORM histórico o reescribir al monolito; checklist único en README. |

### P0-7. Access JWT en `localStorage` + example `JWT_EXPIRES_IN=7d`

| | |
|--|--|
| **Archivos** | `lib/api.ts`, `apps/dashboard/.env.example` |
| **Problema** | XSS roba Bearer; si Railway copia example, token vive 7 días. |
| **Fix** | Forzar ≤1h en prod (validar al boot); documentar; medio plazo cookie HttpOnly + `tokenVersion`. |

---

## 5. Hallazgos — P1 (próximo sprint de estabilidad)

| ID | Tema | Evidencia | Fix breve |
|----|------|-----------|-----------|
| P1-1 | Availability fall-open si DB falla | `listAgendaRequests` catch → `[]` | Propagar 503 |
| P1-2 | Fallback mock de `agendaState` en prod | `persistRequestCalendarState` catch | No mock en prod; log + 500 |
| P1-3 | Seed async tras `next start` | `railway-start.mjs` | Await seed mínimo (tenant) antes de tráfico / ready |
| P1-4 | Login no chequea `user.status` | `auth/login/route.ts` | Rechazar no-`ACTIVE` con mensaje genérico |
| P1-5 | Rutas UI solo protegidas en cliente | `middleware.ts` | Auth en middleware o cookies de sesión |
| P1-6 | Rate-limit / caches in-memory | `rate-limit.ts`, portal cache | OK 1 réplica; Redis antes de escalar |
| P1-7 | Cambio email sin revocar refresh | `portal/cuenta` | Revocar tokens; invalidar access |
| P1-8 | Email Candidate sin unique | `schema.prisma` | `@@unique([tenantId, email])` + dedup |
| P1-9 | CORS `*` en bookings/availability | rutas públicas | Allowlist origen landing |
| P1-10 | CRM traga errores como `[]` | `api/crm` | 503 real |
| P1-11 | Vite en `devDependencies` | root `package.json` | Mover a deps o fijar install Nixpacks |
| P1-12 | README dice start sirve `dist/`+API | README | Alinear: start = Next |
| P1-13 | `SEED_DEMO_DATA` peligroso en Railway | `seed.ts` | Alertar en boot; nunca setear en prod |

---

## 6. Hallazgos — P2 (deuda / calidad)

- Ocupación simulada reduce cupos reales (`shared/schedule.js`).
- Smoke escribe citas permanentes sin cleanup.
- Validación email mínima (`includes('@')`).
- Duplicación `bookings` ↔ `solicitudes` POST.
- Sin CI GitHub Actions; lint no bloquea `next build`.
- Modelos `Session` / `PasswordReset` sin uso (sin verify email / reset).
- `KOVA_SCHEMA_READY` set pero no leído.
- Encoding raro en mensajes de registro.
- CSP con `unsafe-inline`.

---

## 7. Fortalezas (no solo riesgos)

- Auth refresh HttpOnly con rotación/revocación bien diseñada.
- Mock mode **forzado off** en production.
- Rate limit + lockout en login; caps de payload en endpoints públicos.
- Security headers en `next.config.js`.
- Smoke `smoke:prod` cubre HTTPS, health JSON, registro, login, cita real.
- Comentarios conscientes sobre no usar `--accept-data-loss` en `db push`.

---

## 8. Orden de remediación propuesto (post-aprobación)

1. **Hotfix citas:** TZ (`parseTimeToDate`) + unique/409 doble reserva.  
2. **Fail-fast prod:** validar env en `railway-start` + health 503.  
3. **Auth hardening:** status en login; forzar `JWT_EXPIRES_IN` corto; checklist Railway.  
4. **Docs:** README + PLATFORM alineados al monolito.  
5. **Resiliencia datos:** no fall-open en availability; no mock agendaState en prod; seed antes de ready.  
6. **Migraciones Prisma (baseline)** — cambio operativo delicado, ventana propia.  
7. P1 restantes + smoke mejorado (concurrencia, TZ, cleanup).

---

## 9. Fuera de alcance de Fase 1

- Rediseño UX landing / portal (Fases 2–3).
- CRM features nuevas / multi-tenant completo (Fase 4).
- Redis / multi-réplica (solo documentar límite actual).

---

## 10. Aprobación

Por favor revisa este documento y confirma:

1. ¿Los P0/P1 reflejan lo que te importa?  
2. ¿Aprobamos el orden de remediación de la sección 8?  
3. ¿Pasamos a escribir el **plan de implementación** detallado (skill writing-plans) y luego código?

Tras tu OK → `docs/superpowers/plans/…` + ejecución por pasos.
