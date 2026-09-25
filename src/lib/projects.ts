import "server-only";

import { cache } from "react";
import { projects as seedProjects } from "@/data/projects";
import { getSql, isDatabaseConfigured } from "@/lib/db";
import type { Project } from "@/types/project";

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  short_description: string;
  description: string;
  year: string | null;
  status: Project["status"] | null;
  categories: Project["categories"];
  disciplines: string[];
  technologies: string[];
  thumbnail: string | null;
  cover: string | null;
  gallery: string[];
  featured: boolean;
  published: boolean;
  accent: string;
  project_index: string;
  sort_order: number;
  links: Project["links"];
  sections: Project["sections"];
};

export type ProjectInput = Omit<Project, "id"> & { id?: string };

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    shortDescription: row.short_description,
    description: row.description,
    year: row.year ?? undefined,
    status: row.status ?? undefined,
    categories: row.categories ?? [],
    disciplines: row.disciplines ?? [],
    technologies: row.technologies ?? [],
    thumbnail: row.thumbnail ?? undefined,
    cover: row.cover ?? undefined,
    gallery: row.gallery ?? [],
    featured: row.featured,
    published: row.published,
    accent: row.accent,
    index: row.project_index,
    sortOrder: row.sort_order,
    links: row.links ?? [],
    sections: row.sections ?? [],
  };
}

export const getPublicProjects = cache(async (): Promise<Project[]> => {
  if (!isDatabaseConfigured()) return seedProjects;

  const sql = getSql();
  const rows = await sql`SELECT * FROM projects WHERE published = true ORDER BY sort_order ASC, created_at ASC`;
  return (rows as ProjectRow[]).map(rowToProject);
});

export const getAllProjects = cache(async (): Promise<Project[]> => {
  if (!isDatabaseConfigured()) return seedProjects;

  const sql = getSql();
  const rows = await sql`SELECT * FROM projects ORDER BY sort_order ASC, created_at ASC`;
  return (rows as ProjectRow[]).map(rowToProject);
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | undefined> => {
  if (!isDatabaseConfigured()) return seedProjects.find((project) => project.slug === slug);

  const sql = getSql();
  const rows = await sql`SELECT * FROM projects WHERE slug = ${slug} AND published = true LIMIT 1`;
  const row = rows[0] as ProjectRow | undefined;
  return row ? rowToProject(row) : undefined;
});

export const getProjectById = cache(async (id: string): Promise<Project | undefined> => {
  if (!isDatabaseConfigured()) return seedProjects.find((project) => project.id === id);

  const sql = getSql();
  const rows = await sql`SELECT * FROM projects WHERE id = ${id} LIMIT 1`;
  const row = rows[0] as ProjectRow | undefined;
  return row ? rowToProject(row) : undefined;
});

export async function createProject(input: ProjectInput) {
  const sql = getSql();
  const id = input.id ?? crypto.randomUUID();
  const status = input.status ?? null;
  const year = input.year ?? null;
  const thumbnail = input.thumbnail ?? null;
  const cover = input.cover ?? null;
  const published = input.published ?? false;
  const sortOrder = input.sortOrder ?? 0;

  await sql`
    INSERT INTO projects (
      id, slug, title, subtitle, short_description, description, year, status,
      categories, disciplines, technologies, thumbnail, cover, gallery,
      featured, published, accent, project_index, sort_order, links, sections
    ) VALUES (
      ${id}, ${input.slug}, ${input.title}, ${input.subtitle}, ${input.shortDescription},
      ${input.description}, ${year}, ${status}, ${JSON.stringify(input.categories)},
      ${JSON.stringify(input.disciplines)}, ${JSON.stringify(input.technologies)},
      ${thumbnail}, ${cover}, ${JSON.stringify(input.gallery)}, ${input.featured},
      ${published}, ${input.accent}, ${input.index}, ${sortOrder},
      ${JSON.stringify(input.links)}, ${JSON.stringify(input.sections)}
    )
  `;

  return id;
}

export async function updateProject(id: string, input: ProjectInput) {
  const sql = getSql();
  const status = input.status ?? null;
  const year = input.year ?? null;
  const thumbnail = input.thumbnail ?? null;
  const cover = input.cover ?? null;
  const published = input.published ?? false;
  const sortOrder = input.sortOrder ?? 0;

  await sql`
    UPDATE projects SET
      slug = ${input.slug}, title = ${input.title}, subtitle = ${input.subtitle},
      short_description = ${input.shortDescription}, description = ${input.description},
      year = ${year}, status = ${status}, categories = ${JSON.stringify(input.categories)},
      disciplines = ${JSON.stringify(input.disciplines)}, technologies = ${JSON.stringify(input.technologies)},
      thumbnail = ${thumbnail}, cover = ${cover}, gallery = ${JSON.stringify(input.gallery)},
      featured = ${input.featured}, published = ${published}, accent = ${input.accent},
      project_index = ${input.index}, sort_order = ${sortOrder}, links = ${JSON.stringify(input.links)},
      sections = ${JSON.stringify(input.sections)}, updated_at = NOW()
    WHERE id = ${id}
  `;
}

export async function deleteProject(id: string) {
  const sql = getSql();
  await sql`DELETE FROM projects WHERE id = ${id}`;
}
