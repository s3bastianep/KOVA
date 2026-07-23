# Auditoría completa KOVA / Litt Hunter — Diseño, bugs, seguridad, SEO/GEO, conversión

**Fecha:** 2026-07-23  
**Método:** Superpowers + Impeccable (audit/brand) + revisión estática + inspección live  
**URL producto real (Railway):** https://kova-production-958a.up.railway.app/  
**URL dominio `kova.com.co`:** WordPress e-commerce de cuero (NO es este producto)  

---

## Veredicto ejecutivo

El producto en Railway es una landing de reclutamiento comercial **sólida en narrativa y diseño dark**, con funnel empresas/talento claro. Pero hay **fallas estructurales de marca/SEO/dominio** que bloquean conversión y posicionamiento reales:

1. **`kova.com.co` no apunta al Talent OS** → el público llega a una tienda de bolsos.  
2. **Marca dual:** UI/código mezclan “Litt Hunter” (meta, logo, emails, schema) con assets “kova”.  
3. **SEO apunta a `litthunter.com`** (sitemap, canonical, OG) mientras el deploy vive en Railway.  
4. **Imágenes rotas** en CTA final + riesgo de secciones `opacity:0` si falla el IntersectionObserver.  

**Audit Health Score (Impeccable, marketing):** **11/20 — Acceptable** (necesita trabajo significativo antes de escalar ads/SEO).

| Dimensión | Score | Hallazgo clave |
|-----------|-------|----------------|
| Accessibility | 2/4 | Buena semántica general; contraste muted; alts vacíos; score “0 %” confuso |
| Performance | 2/4 | Dual desktop/mobile bundles; reveals JS-gated; assets rotos |
| Responsive | 3/4 | Dual HomeDarkDesktop/Mobile; touch targets en general OK |
| Theming | 3/4 | Tokens dark/lima coherentes; hardcodes residuales |
| Anti-patterns | 1/4 | Brand split + dominio equivocado + reveals ocultos = confusión fuerte |

---

## P0 — Bloquean negocio / confianza

### P0-1. Dominio público ≠ producto — RESUELTO (docs)
- **Evidencia:** `https://kova.com.co/` = WooCommerce “KOVA DE CUERO”. Talent OS = Railway.  
- **Decisión:** canónico = **`litthunter.com` → Railway**. `kova.com.co` queda fuera (otro producto). Ver `README.md` § Dominio canónico.

### P0-2. Identidad de marca inconsistente — RESUELTO (Litt Hunter)
- **Decisión:** marca canónica **Litt Hunter** (`site.js`, logo, emails, schema, index.html).  
- Assets públicos: `lh-home-hero.jpg`, `lh-final-empresas.png`, `lh-final-talento.png`. Prefijos CSS `kova-*` se mantienen como interno técnico.

### P0-3. SEO/GEO indexa el dominio equivocado — CONFIRMADO correcto
- Sitemap / robots / canonical / OG ya apuntan a **`https://litthunter.com/`**. Acción operativa: DNS Custom Domain + Search Console en ese dominio; `VITE_SITE_URL=https://litthunter.com` en build Railway.

### P0-4. Imágenes rotas en CTA final — RESUELTO
- Causa real: archivos PNG con extensión `.jpg` + `Content-Type: image/jpeg` + `x-content-type-options: nosniff` → el navegador rechaza el decode (no solo 404).  
- Fix: servir como `.png` (`/landing/people/lh-final-*.png`) + `alt` descriptivo.

---

## P1 — Dañan UX, SEO o seguridad de forma seria

### P1-1. Contenido oculto con `opacity: 0` hasta JS — RESUELTO
Visible por defecto; animación solo con `html.kd-motion` tras marcar above-fold.

### P1-2. CTA “Contratar” en nav → `/contacto` — RESUELTO

### P1-3. Demasiados CTAs en nav — RESUELTO
Un grupo por superficie (empresas vs empleo/auth).

### P1-4. SearchAction JSON-LD inventado — RESUELTO (eliminado)

### P1-5. Access JWT en `localStorage` + CORS `*` — RESUELTO
Access en cookie HttpOnly `lh_access`; CORS allowlist en `lib/public-cors.ts`.

### P1-6. CSP con `unsafe-inline`
- **Evidencia:** `apps/dashboard/next.config.js`.  
- **Impacto:** Mitiga menos XSS.  
- **Fix:** Nonces/hashes cuando Next lo permita.

### P1-7. `llms.txt` / alternate apunta a litthunter
- **Evidencia:** `index.html` link alternate llms.txt.  
- **Impacto:** GEO (AI engines) lee marca/URL incorrecta.  
- **Fix:** Servir `llms.txt` en canónica con hechos de Kova/Litt unificados.

### P1-8. Score hero “0 %” animado
- **Evidencia:** Región alineación muestra “0 %” hasta animar.  
- **Impacto:** Confusión (“¿el match es cero?”).  
- **Fix:** Placeholder “—” o valor estático accesible + animación no esencial.

---

## P2 — Mejora / deuda

| ID | Tema | Notas |
|----|------|-------|
| P2-1 | Alt vacíos en fotos finales | `alt=""` en HomeDark* |
| P2-2 | Contraste texto muted | `rgba(245,245,245,0.66–0.78)` / `--kd-muted #8b8b8b` — revisar AA |
| P2-3 | Desktop vs Mobile home distintos | Riesgo de inconsistencia de copy/CTAs |
| P2-4 | Blog label “Blog” → `/guias` | OK redirect; alinear naming |
| P2-5 | Sin `PRODUCT.md` / `DESIGN.md` | Impeccable recomienda `/impeccable init` |
| P2-6 | Health/bookings P0 de Fase 1 | Parte ya merged; migraciones Prisma pending |
| P2-7 | Privacidad aún litthunter emails | `Privacidad.jsx` |
| P2-8 | Footer © Litt Hunter en live | Branding |

---

## Diseño (Impeccable / brand)

**Qué funciona**
- Sistema dark + lima `#c5de4e` + Manrope: POV claro, no “purple AI”.  
- Hero con un mensaje + dos caminos: composición de marca intencional.  
- Garantía 6 meses = señal de confianza fuerte.  
- Separación empresas / talento en secciones.

**Qué falla**
- Marca verbal ≠ visual/path (`litt hunter` vs `kova`).  
- Reveals que esconden contenido.  
- Bloque final con imágenes 404.  
- Densidad de CTAs diluye el “one job” del primer viewport en mobile.

**Anti-patterns verdict:** No es “AI slop” visual genérico, pero **sí falla el brand test** (quitar nav: ¿es Litt Hunter o Kova?).

---

## Bugs / errores

| Severidad | Bug |
|-----------|-----|
| P0 | Imágenes final CTA 404 |
| P0 | Dominio kova.com.co = otro producto |
| P1 | Secciones con `opacity:0` hasta IO |
| P1 | Meta/schema desalineados del host real |
| P2 | Posible mismatch copy desktop/mobile |

No se halló `dangerouslySetInnerHTML` en `src/` (bien).

---

## Seguridad (funnel público)

| OK | Riesgo |
|----|--------|
| Sin innerHTML peligroso en marketing | JWT localStorage |
| CSP + HSTS en Next | `unsafe-inline` |
| Rate limit bookings (in-memory) | CORS `*` |
| Mock off en prod (Fase 1) | Docs PLATFORM 2-servicios |

---

## Links (muestra live Railway)

Internos muestreados OK: `/`, `/para-empresas`, `/empleo`, `/guias`, `/login`, `/registro`, `/para-empresas#contacto`, `#metodologia`.  
**CTA final:** `/landing/people/lh-final-*.png` (PNG real; los `.jpg` mal nombrados se eliminaron).  
**Dominio marketing:** canónico `litthunter.com` → Railway; `kova.com.co` no es este producto.

---

## SEO + GEO

**GEO (Colombia):** meta `geo.region=CO`, Bogotá coords, `es_CO`, `areaServed Colombia` — buena base **si** la URL canónica es la correcta.

**GEO (Generative Engine):**  
- Hay Organization + WebSite JSON-LD (bien).  
- Pero nombre/URL/email = Litt Hunter / litthunter.com.  
- SearchAction dudoso.  
- `llms.txt` alternate mal apuntado.  
- Contenido guías = buen food for AI **cuando** esté en canónica.

**SEO técnico:** Title/description por página vía `usePageMeta` (bien para SPA). Canonical hardcoded a litthunter en HTML estático inicial = flash incorrecto para bots que no ejecutan JS completo.

---

## Conversión / UX claridad

**Funnel empresas:** Home → Para empresas / Empieza a contratar → (ideal) Contacto/agenda.  
Hoy el CTA nav “Contratar” no va directo a agenda.

**Funnel talento:** Home → Empleo / Crear perfil / Ingresar. Claro.

**Confusión principal:** nombre de marca + dominio + emails distintos.

**Claridad de mensaje:** Headline fuerte; subtítulo Medium ayuda legibilidad. Score “0%” y CTAs múltiples = fricción secundaria.

---

## Plan de remediación recomendado (orden)

1. **Decidir marca + URL canónica** (Kova Talent vs Litt Hunter vs ambos con arquitectura clara).  
2. **Apuntar DNS** del dominio elegido al Railway.  
3. **Unificar** `site.js`, logo, emails, sitemap, robots, index.html, schema, privacidad.  
4. **Reparar imágenes** CTA final + alts.  
5. **Reveals fail-open** (contenido visible sin JS).  
6. **CTA nav → `/contacto`**.  
7. Continuar P1 seguridad (CORS, JWT cookies).  
8. `/impeccable init` → PRODUCT.md + DESIGN.md.  
9. Fase 2 portal onboarding (acordada antes).

---

## Comandos Impeccable sugeridos

1. **[P0]** Clarificar marca/URL (fuera de UI) + assets rotos → `/impeccable harden` + fix assets  
2. **[P1]** `/impeccable clarify` — CTAs y score 0%  
3. **[P1]** `/impeccable animate` — reveals fail-open  
4. **[P2]** `/impeccable polish` — contraste muted, alts  
5. **[P2]** `/impeccable init` — PRODUCT.md

---

## Fortalezas a preservar

- Narrativa “alineación > hoja de vida”.  
- Garantía 6 meses.  
- Dual path empresas/talento.  
- Stack Manrope + lima + dark coherente.  
- Smoke prod + fixes estabilidad Fase 1 (TZ, health, slotKey).

---

*Auditoría de solo lectura. No se modificó código en esta pasada.*
