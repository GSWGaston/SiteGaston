# AI Context

Use this file as the first read for future AI/code-agent sessions. It is intentionally short so the model can understand the project without scanning every file.

## Project

Personal portfolio for Matheus Gaston built with Next.js App Router, TypeScript, React and Tailwind CSS. Public pages render portfolio content. `/admin` is a small block-based CMS available to authorized Vercel accounts when production services are configured.

## Runtime Shape

- Public data path: `src/lib/projects.ts`.
- If `DATABASE_URL` is absent, public and admin project lists fall back to `src/data/projects.ts`.
- If `DATABASE_URL` is present, project CRUD uses Neon through `@neondatabase/serverless`.
- Uploads use Vercel Blob through `@vercel/blob`; the upload route returns `503` until `BLOB_READ_WRITE_TOKEN` exists.
- Admin auth uses Sign in with Vercel, OAuth cookies and a signed session cookie in `src/lib/auth.ts`. Every mutation and upload validates the session on the server.
- Project visibility is `draft`, `published` or `hidden`. Only `published` records reach public queries; Home also requires `featured`.
- New case content lives in `projects.blocks` (JSONB). Existing `sections` remain as a read-only public fallback while old cases are migrated naturally.
- Site copy, links, skills and contact placeholders live in `src/data/site.ts`.

## Important Files

- `src/app/layout.tsx`: root metadata, shell and JSON-LD.
- `src/app/page.tsx`: home page and featured projects.
- `src/app/projetos/page.tsx`: project listing and filter.
- `src/app/projetos/[slug]/page.tsx`: case-study detail page.
- `src/app/admin/page.tsx`: admin project index; edit controls only show when DB is configured.
- `src/app/admin/actions.ts`: validated server actions for CRUD, duplication and status changes.
- `src/components/admin/project-form.tsx`: project metadata and publication editor.
- `src/components/admin/project-block-editor.tsx`: block creation, editing, duplication, ordering and in-admin preview.
- `src/components/project-blocks/`: public components and central `ProjectBlockRenderer`.
- `src/types/project.ts`: discriminated union for all block payloads.
- `database/schema.sql`: Neon table schema.
- `scripts/setup-database.ts`: creates schema and seeds projects.

## Commands

```bash
npm install
npm run lint
npm run typecheck
npm run build
npm run dev
```

Local URL: `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` only when testing the admin integration with external services. Without env vars, the public site still works from seed data.

Required for full admin:

- `DATABASE_URL`
- `BLOB_READ_WRITE_TOKEN`
- `NEXT_PUBLIC_VERCEL_APP_CLIENT_ID`
- `VERCEL_APP_CLIENT_SECRET`
- `ADMIN_EMAILS`
- `SESSION_SECRET` with at least 32 characters

After configuring Neon:

```bash
npm run db:setup
```

The setup script applies additive schema changes and seeds only missing projects. It does not delete current records.

## Block Model

Supported `ProjectBlock["type"]` values: `text`, `image`, `gallery`, `video`, `live-demo`, and `two-view`. Every block has a stable `id` and numeric `order`. Images require alt text. `live-demo` always renders an external-link fallback, and `two-view` receives both labels from its data.

To add a block type: extend the union and Zod schema, add its admin editor branch, create a component in `src/components/project-blocks/`, register it in `ProjectBlockRenderer`, then add responsive styles.

## Operational Notes

- Uploads accept JPG, PNG, WebP, AVIF and GIF up to 8 MB. Blob tokens remain server-side.
- Deleting a project preserves Blob files because shared-asset ownership is not tracked yet.
- Draft and hidden projects can be previewed inside their admin editor; they are never exposed by the public slug query.

## Next.js Notes

This repo has an `AGENTS.md` warning: read local Next docs from `node_modules/next/dist/docs/` before changing framework code. Pages and layouts are Server Components by default; interactive admin components need `"use client"`.

Dynamic route params and `searchParams` are typed as promises in this Next version.

## Known Content Placeholders

`src/data/site.ts` still contains placeholder URL, email and social links. Project images are intentionally placeholder text until real media is added.
