import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";
import { projects } from "../src/data/projects";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL não encontrada. Execute vercel env pull .env.local antes.");
}

const sql = neon(databaseUrl);
const schema = await readFile(resolve(process.cwd(), "database/schema.sql"), "utf8");
const statements = schema.split(";").map((statement) => statement.trim()).filter(Boolean);
for (const statement of statements) await sql.query(statement);

for (const [sortOrder, project] of projects.entries()) {
  await sql`
    INSERT INTO projects (
      id, slug, title, subtitle, short_description, description, year, status,
      publication_status, categories, disciplines, technologies, thumbnail, cover, gallery,
      featured, published, accent, project_index, sort_order, links, blocks, sections
    ) VALUES (
      ${project.id}, ${project.slug}, ${project.title}, ${project.subtitle}, ${project.shortDescription},
      ${project.description}, ${project.year ?? null}, ${project.status ?? null}, 'published',
      ${JSON.stringify(project.categories)}, ${JSON.stringify(project.disciplines)},
      ${JSON.stringify(project.technologies)}, ${project.thumbnail ?? null}, ${project.cover ?? null},
      ${JSON.stringify(project.gallery)}, ${project.featured}, true, ${project.accent},
      ${project.index}, ${sortOrder}, ${JSON.stringify(project.links)}, ${JSON.stringify(project.blocks ?? [])},
      ${JSON.stringify(project.sections)}
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

process.stdout.write(`Schema aplicado e ${projects.length} projetos iniciais verificados.\n`);
