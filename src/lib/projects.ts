import "server-only";

import { cache } from "react";
import { projects as seedProjects } from "@/data/projects";
import { getSql, isDatabaseConfigured } from "@/lib/db";
import type { Project, ProjectBlock, ProjectPublicationStatus } from "@/types/project";

type ProjectRow = {
  id: string; slug: string; title: string; subtitle: string; short_description: string; description: string;
  year: string | null; status: Project["status"] | null; publication_status: ProjectPublicationStatus | null;
  categories: Project["categories"]; disciplines: string[]; technologies: string[]; thumbnail: string | null;
  cover: string | null; gallery: string[]; featured: boolean; published: boolean; accent: string;
  project_index: string; sort_order: number; links: Project["links"]; blocks: ProjectBlock[] | null;
  sections: Project["sections"]; created_at: string | Date; updated_at: string | Date;
};

export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt"> & { id?: string };

function projectRows(rows: Awaited<ReturnType<ReturnType<typeof getSql>>>): ProjectRow[] {
  return rows as unknown as ProjectRow[];
}

function dateString(value: string | Date) {
  return value instanceof Date ? value.toISOString() : value;
}

export function getPublicationStatus(project: Project): ProjectPublicationStatus {
  return project.publicationStatus ?? (project.published === false ? "draft" : "published");
}

function normalizeProject(project: Project): Project {
  const publicationStatus = getPublicationStatus(project);
  return { ...project, publicationStatus, published: publicationStatus === "published", blocks: [...(project.blocks ?? [])].sort((a, b) => a.order - b.order) };
}

function rowToProject(row: ProjectRow): Project {
  return normalizeProject({
    id: row.id, slug: row.slug, title: row.title, subtitle: row.subtitle, shortDescription: row.short_description,
    description: row.description, year: row.year ?? undefined, status: row.status ?? undefined,
    publicationStatus: row.publication_status ?? (row.published ? "published" : "draft"), categories: row.categories ?? [],
    disciplines: row.disciplines ?? [], technologies: row.technologies ?? [], thumbnail: row.thumbnail ?? undefined,
    cover: row.cover ?? undefined, gallery: row.gallery ?? [], featured: row.featured, published: row.published,
    accent: row.accent, index: row.project_index, sortOrder: row.sort_order, links: row.links ?? [], blocks: row.blocks ?? [],
    sections: row.sections ?? [], createdAt: dateString(row.created_at), updatedAt: dateString(row.updated_at),
  });
}

function localProjects() { return seedProjects.map(normalizeProject); }

export const getPublicProjects = cache(async (): Promise<Project[]> => {
  if (!isDatabaseConfigured()) return localProjects().filter((project) => getPublicationStatus(project) === "published");
  const rows = await getSql()`SELECT * FROM projects WHERE publication_status = 'published' ORDER BY sort_order ASC, created_at ASC`;
  return projectRows(rows).map(rowToProject);
});

export const getAllProjects = cache(async (): Promise<Project[]> => {
  if (!isDatabaseConfigured()) return localProjects();
  const rows = await getSql()`SELECT * FROM projects ORDER BY sort_order ASC, updated_at DESC`;
  return projectRows(rows).map(rowToProject);
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | undefined> => {
  if (!isDatabaseConfigured()) return localProjects().find((project) => project.slug === slug && getPublicationStatus(project) === "published");
  const rows = await getSql()`SELECT * FROM projects WHERE slug = ${slug} AND publication_status = 'published' LIMIT 1`;
  const row = projectRows(rows)[0];
  return row ? rowToProject(row) : undefined;
});

export const getProjectById = cache(async (id: string): Promise<Project | undefined> => {
  if (!isDatabaseConfigured()) return localProjects().find((project) => project.id === id);
  const rows = await getSql()`SELECT * FROM projects WHERE id = ${id} LIMIT 1`;
  const row = projectRows(rows)[0];
  return row ? rowToProject(row) : undefined;
});

export async function isSlugAvailable(slug: string, exceptId?: string) {
  const sql = getSql();
  const rows = exceptId ? await sql`SELECT id FROM projects WHERE slug = ${slug} AND id <> ${exceptId} LIMIT 1` : await sql`SELECT id FROM projects WHERE slug = ${slug} LIMIT 1`;
  return (rows as unknown as Array<{ id: string }>).length === 0;
}

export async function createProject(input: ProjectInput) {
  const sql = getSql();
  const id = input.id ?? crypto.randomUUID();
  const publicationStatus = input.publicationStatus ?? "draft";
  await sql`
    INSERT INTO projects (id, slug, title, subtitle, short_description, description, year, status, publication_status,
      categories, disciplines, technologies, thumbnail, cover, gallery, featured, published, accent, project_index,
      sort_order, links, blocks, sections)
    VALUES (${id}, ${input.slug}, ${input.title}, ${input.subtitle}, ${input.shortDescription}, ${input.description},
      ${input.year ?? null}, ${input.status ?? null}, ${publicationStatus}, ${JSON.stringify(input.categories)},
      ${JSON.stringify(input.disciplines)}, ${JSON.stringify(input.technologies)}, ${input.thumbnail ?? null},
      ${input.cover ?? null}, ${JSON.stringify(input.gallery)}, ${input.featured}, ${publicationStatus === "published"},
      ${input.accent}, ${input.index}, ${input.sortOrder ?? 0}, ${JSON.stringify(input.links)},
      ${JSON.stringify(input.blocks ?? [])}, ${JSON.stringify(input.sections ?? [])})`;
  if (input.featured) await sql`UPDATE projects SET featured = false WHERE id <> ${id} AND featured = true`;
  return id;
}

export async function updateProject(id: string, input: ProjectInput) {
  const sql = getSql();
  const publicationStatus = input.publicationStatus ?? "draft";
  await sql`UPDATE projects SET slug = ${input.slug}, title = ${input.title}, subtitle = ${input.subtitle},
    short_description = ${input.shortDescription}, description = ${input.description}, year = ${input.year ?? null},
    status = ${input.status ?? null}, publication_status = ${publicationStatus}, categories = ${JSON.stringify(input.categories)},
    disciplines = ${JSON.stringify(input.disciplines)}, technologies = ${JSON.stringify(input.technologies)},
    thumbnail = ${input.thumbnail ?? null}, cover = ${input.cover ?? null}, gallery = ${JSON.stringify(input.gallery)},
    featured = ${input.featured}, published = ${publicationStatus === "published"}, accent = ${input.accent},
    project_index = ${input.index}, sort_order = ${input.sortOrder ?? 0}, links = ${JSON.stringify(input.links)},
    blocks = ${JSON.stringify(input.blocks ?? [])}, sections = ${JSON.stringify(input.sections ?? [])}, updated_at = NOW()
    WHERE id = ${id}`;
  if (input.featured) await sql`UPDATE projects SET featured = false WHERE id <> ${id} AND featured = true`;
}

export async function updateProjectStatus(id: string, publicationStatus: ProjectPublicationStatus) {
  await getSql()`UPDATE projects SET publication_status = ${publicationStatus}, published = ${publicationStatus === "published"}, updated_at = NOW() WHERE id = ${id}`;
}

export async function reorderProjects(projectIds: string[]) {
  if (projectIds.length === 0) return;
  const sql = getSql();
  await sql`
    WITH ordered_projects AS (
      SELECT id, ordinality - 1 AS sort_order
      FROM jsonb_array_elements_text(${JSON.stringify(projectIds)}::jsonb) WITH ORDINALITY AS item(id, ordinality)
    )
    UPDATE projects AS project
    SET sort_order = ordered.sort_order,
        featured = ordered.sort_order = 0
    FROM ordered_projects AS ordered
    WHERE project.id = ordered.id`;
}

export async function normalizeProjectOrder() {
  const rows = await getSql()`SELECT id FROM projects ORDER BY sort_order ASC, updated_at DESC`;
  await reorderProjects((rows as unknown as Array<{ id: string }>).map((row) => row.id));
}

export async function deleteProject(id: string) {
  await getSql()`DELETE FROM projects WHERE id = ${id}`;
}
