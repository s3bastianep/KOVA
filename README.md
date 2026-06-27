# KOVA

Landing page de Kova — React + Vite.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite (normalmente `http://localhost:5173`).

## Formulario de contacto

El formulario de acceso anticipado envía datos a la URL definida en `VITE_EARLY_ACCESS_API_URL`.

Crea `.env.local` en la raíz del proyecto:

```bash
VITE_EARLY_ACCESS_API_URL=https://tu-api.com/early-access
```

Puedes usar Formspree, un webhook propio o un backend en Railway.

## Deploy en Railway

1. Conecta el repo de GitHub en [railway.app](https://railway.app).
2. Railway detectará Node.js automáticamente.
3. **Build command:** `npm run build`
4. **Start command:** `npm run start`
5. Añade la variable `VITE_EARLY_ACCESS_API_URL` si ya tienes endpoint para el formulario.
6. Genera un dominio en **Settings → Networking**.

Cada push a `master` redeploya la app.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run start` | Sirve `dist/` (Railway) |
| `npm run preview` | Preview local del build |
| `npm run lint` | ESLint |
