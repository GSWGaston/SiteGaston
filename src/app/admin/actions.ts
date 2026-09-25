"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import {
  createProject,
  deleteProject,
  getProjectById,
  updateProject,
  type ProjectInput,
} from "@/lib/projects";
import type { ProjectCategory, ProjectSection } from "@/types/project";

export type ProjectActionState = { error?: string };

const categoryValues = [
  "UI/UX",
  "Web",
  "Apps",
  "Branding",
  "Design Gráfico",
  "Multimídia",
  "Desenvolvimento",
  "Projetos Técnicos",
] as const;

const sectionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), title: z.string().optional(), content: z.array(z.string()) }),
  z.object({ type: z.literal("highlight"), eyebrow: z.string().optional(), content: z.string() }),
  z.object({ type: z.literal("list"), title: z.string(), items: z.array(z.string()) }),
  z.object({ type: z.literal("media"), title: z.string().optional(), items: z.array(z.object({ src: z.string().optional(), alt: z.string(), caption: z.string().optional() })) }),
  z.object({ type: z.literal("technologies"), title: z.string().optional(), items: z.array(z.string()) }),
]);

const projectSchema = z.object({
  title: z.string().trim().min(2, "Informe o título."),
  slug: z.string().trim().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens no slug."),
  subtitle: z.string().trim(),
  shortDescription: z.string().trim().min(10, "A descrição curta precisa ter ao menos 10 caracteres."),
  description: z.string().trim(),
  year: z.string().trim().optional(),
  status: z.enum(["Em desenvolvimento", "Conceito", "Acadêmico", "Concluído"]).optional(),
  categories: z.array(z.enum(categoryValues)).min(1, "Selecione pelo menos uma categoria."),
  disciplines: z.array(z.string()),
  technologies: z.array(z.string()),
  thumbnail: z.string().trim().optional(),
  cover: z.string().trim().optional(),
  gallery: z.array(z.string()),
  featured: z.boolean(),
  published: z.boolean(),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Informe uma cor hexadecimal válida."),
  index: z.string().trim().min(1),
  sortOrder: z.number().int().min(0),
  links: z.array(z.object({ label: z.string(), href: z.string() })),
  sections: z.array(sectionSchema),
});

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "").split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

function parseLinks(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...hrefParts] = line.split("|");
      return { label: label.trim(), href: hrefParts.join("|").trim() };
    })
    .filter((link) => link.label && link.href);
}

function readProjectForm(formData: FormData): ProjectInput {
  let sections: ProjectSection[] = [];
  try {
    sections = JSON.parse(String(formData.get("sections") ?? "[]")) as ProjectSection[];
  } catch {
    throw new Error("Os blocos de conteúdo estão em um formato inválido.");
  }

  const result = projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    subtitle: formData.get("subtitle"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    year: String(formData.get("year") ?? "") || undefined,
    status: String(formData.get("status") ?? "") || undefined,
    categories: formData.getAll("categories") as ProjectCategory[],
    disciplines: lines(formData.get("disciplines")),
    technologies: lines(formData.get("technologies")),
    thumbnail: String(formData.get("thumbnail") ?? "") || undefined,
    cover: String(formData.get("cover") ?? "") || undefined,
    gallery: lines(formData.get("gallery")),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    accent: formData.get("accent"),
    index: formData.get("index"),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    links: parseLinks(formData.get("links")),
    sections,
  });

  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Revise os dados do projeto.");
  }

  return result.data;
}

function refreshProjectPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projetos");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/projetos/${slug}`);
}

export async function createProjectAction(_state: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  await requireAdmin();
  try {
    const input = readProjectForm(formData);
    const id = await createProject(input);
    refreshProjectPages(input.slug);
    redirect(`/admin/${id}/editar?saved=1`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    return { error: error instanceof Error ? error.message : "Não foi possível criar o projeto." };
  }
}

export async function updateProjectAction(id: string, _state: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  await requireAdmin();
  try {
    const previous = await getProjectById(id);
    const input = readProjectForm(formData);
    await updateProject(id, input);
    refreshProjectPages(previous?.slug);
    refreshProjectPages(input.slug);
    redirect(`/admin/${id}/editar?saved=1`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    return { error: error instanceof Error ? error.message : "Não foi possível salvar o projeto." };
  }
}

function blobUrls(project: NonNullable<Awaited<ReturnType<typeof getProjectById>>>) {
  const sectionUrls = project.sections.flatMap((section) => section.type === "media" ? section.items.flatMap((item) => item.src ? [item.src] : []) : []);
  return [...new Set([project.cover, project.thumbnail, ...project.gallery, ...sectionUrls].filter((url): url is string => Boolean(url?.includes(".blob.vercel-storage.com"))))];
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  const project = await getProjectById(id);
  if (!project) return;

  await deleteProject(id);
  const urls = blobUrls(project);
  if (urls.length && process.env.BLOB_READ_WRITE_TOKEN) await del(urls);
  refreshProjectPages(project.slug);
  redirect("/admin?deleted=1");
}
