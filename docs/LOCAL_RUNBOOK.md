# Local Runbook

## Fresh Setup

```bash
npm install
npm run lint
npm run typecheck
npm run build
npm run dev
```

Open `http://localhost:3000`.

## Local Behavior

The public site works without external services. When `.env.local` has no `DATABASE_URL`, project data is loaded from `src/data/projects.ts`.

The admin login page is reachable at `/admin/login`, but real login requires Vercel OAuth variables. The admin index at `/admin` requires a valid session.

## Full Admin Setup

1. Create `.env.local` from `.env.example`.
2. Fill Vercel OAuth, Neon, Blob and admin email variables.
3. Run `npm run db:setup`.
4. Start `npm run dev`.
5. Log in through `/admin/login`.

## GitHub Update Checklist

Before pushing:

```bash
npm run lint
npm run typecheck
npm run build
git status --short
git add .
git commit -m "Improve local readiness and AI documentation"
git push origin main
```

Do not commit `.env.local`, `.next`, `node_modules` or `.vercel`; `.gitignore` already excludes them.
