# AGENTS.md

## Project Context

KOVA is a React + Vite landing page. Keep changes focused on the user's request and preserve existing project conventions.

Start with `README.md` for local setup and Railway deployment.

## Key Files

- `src/`: frontend application source.
- `src/pages/Landing.jsx`: main landing page.
- `src/api/earlyAccess.js`: early access form submission.
- `vite.config.js`: Vite configuration.
- `.env.local`: local-only environment values; never commit secrets.

## Working Notes

- Use `npm run dev` for local development.
- Use `npm run build` before deploying.
- Railway uses `npm run start` to serve the built app from `dist/`.
- Run the relevant checks from `package.json` before finishing code changes.
