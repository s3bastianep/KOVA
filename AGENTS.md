# AGENTS.md

## Project Context

KOVA is a React + Vite landing page with a Next.js dashboard under `apps/dashboard`. Keep changes focused on the user's request and preserve existing project conventions.

Start with `README.md` for local setup and Railway deployment.

## Key Files

- `src/`: marketing frontend (landing + guías + contacto).
- `src/pages/Landing.jsx`: main landing page (plain home styles).
- `src/api/booking.js`: scheduling API client for `/contacto`.
- `apps/dashboard/`: Talent OS (auth, portal, CRM).
- `vite.config.js`: Vite configuration.
- `.env.local`: local-only environment values; never commit secrets.

## Working Notes

- Use `npm run dev` for local development (landing + API on `:3000`, dashboard on `:3001`).
- Use `npm run build` before deploying.
- Railway uses `npm run start` to serve the built app.
- Run the relevant checks from `package.json` before finishing code changes.
