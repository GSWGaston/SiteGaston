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

The admin login page is reachable at `/admin/login`, but real login requires Vercel OAuth variables. The admin index at `/admin` requires a valid session. Public pages continue using seed data when Neon is absent; write operations stay disabled.

## Full Admin Setup

1. Create `.env.local` from `.env.example`.
2. Fill Vercel OAuth, Neon, Blob and admin email variables.
3. Run `npm run db:setup`.
4. Start `npm run dev`.
5. Log in through `/admin/login`.

## CMS Smoke Test

1. Create a draft and verify its slug is unavailable publicly.
2. Add each of the six block types, reorder and duplicate blocks, then use the in-editor preview.
3. Upload an image smaller than 8 MB and save.
4. Publish and verify Home, `/projetos` and `/projetos/[slug]`.
5. Mark the project hidden and verify the public route returns 404.
6. Duplicate the project and confirm the copy is a non-featured draft with a unique slug.

`npm run db:setup` is also the migration command for existing databases. It adds `publication_status` and `blocks` without deleting legacy `sections` or current projects.

## GitHub Update Checklist

Before pushing:

```bash
npm run lint
npm run typecheck
npm run build
git status --short
git add .
git commit -m "Add modular portfolio CMS"
git push origin main
```

Do not commit `.env.local`, `.next`, `node_modules` or `.vercel`; `.gitignore` already excludes them.
