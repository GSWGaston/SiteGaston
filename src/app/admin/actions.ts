"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  isSlugAvailable,
  normalizeProjectOrder,
  reorderProjects,
  updateProject,
  updateProjectStatus,
  type ProjectInput,
} from "@/lib/projects";
import type { ProjectBlock, ProjectCategory, ProjectPublicationStatus, ProjectSection } from "@/types/project";

export type ProjectActionState = { error?: string };

const categoryValues = ["UI/UX", "Web", "Apps", "Branding", "Design Gráfico", "Multimídia", "Desenvolvimento", "Projetos Técnicos"] as const;
const imageSchema = z.object({ url: z.url("Informe uma URL de imagem válida."), alt: z.string().trim().min(2, "Informe o texto alternativo."), caption: z.string().optional() });
const blockBase = { id: z.string().min(1), order: z.number().int().min(0) };
const blockSchema = z.discriminatedUnion("type", [
  z.object({ ...blockBase, type: z.literal("text"), title: z.string().optional(), subtitle: z.string().optional(), paragraphs: z.array(z.string()).min(1), listItems: z.array(z.string()).optional(), alignment: z.enum(["left", "center"]), width: z.enum(["narrow", "normal", "wide"]) }),
  z.object({ ...blockBase, type: z.literal("image"), image: imageSchema, layout: z.enum(["normal", "wide", "full"]) }),
  z.object({ ...blockBase, type: z.literal("gallery"), title: z.string().optional(), images: z.array(imageSchema).min(1, "Adicione ao menos uma imagem à galeria."), layout: z.enum(["grid", "carousel", "editorial"]) }),
  z.object({ ...blockBase, type: z.literal("video"), title: z.string().optional(), url: z.url("Informe uma URL de vídeo válida."), caption: z.string().optional(), poster: z.union([z.literal(""), z.url()]).optional(), autoplay: z.boolean() }),
  z.object({ ...blockBase, type: z.literal("live-demo"), title: z.string().trim().min(1), description: z.string().optional(), url: z.url("Informe uma URL válida para o projeto."), embedEnabled: z.boolean(), openExternalEnabled: z.boolean(), previewImage: z.union([z.literal(""), z.url()]).optional() }),
  z.object({ ...blockBase, type: z.literal("two-view"), title: z.string().trim().min(1), description: z.string().optional(), viewA: imageSchema.extend({ label: z.string().trim().min(1) }), viewB: imageSchema.extend({ label: z.string().trim().min(1) }) }),
]);

const legacySectionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), title: z.string().optional(), content: z.array(z.string()) }),
  z.object({ type: z.literal("highlight"), eyebrow: z.string().optional(), content: z.string() }),
  z.object({ type: z.literal("list"), title: z.string(), items: z.array(z.string()) }),
  z.object({ type: z.literal("media"), title: z.string().optional(), items: z.array(z.object({ src: z.string().optional(), alt: z.string(), caption: z.string().optional() })) }),
  z.object({ type: z.literal("technologies"), title: z.string().optional(), items: z.array(z.string()) }),
]);

const projectSchema = z.object({
  title: z.string().trim().min(2, "Informe o título."),
  slug: z.string().trim().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens no slug."),
  subtitle: z.string().trim(), shortDescription: z.string().trim().min(10, "A descrição curta precisa ter ao menos 10 caracteres."),
  description: z.string().trim(), year: z.string().trim().optional(), status: z.enum(["Em desenvolvimento", "Conceito", "Acadêmico", "Concluído"]).optional(),
  publicationStatus: z.enum(["draft", "published", "hidden"]), categories: z.array(z.enum(categoryValues)).min(1, "Selecione pelo menos uma categoria."),
  disciplines: z.array(z.string()), technologies: z.array(z.string()), thumbnail: z.string().trim().optional(), cover: z.string().trim().optional(),
  gallery: z.array(z.string()), featured: z.boolean(), accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Informe uma cor hexadecimal válida."),
  index: z.string().trim().min(1), sortOrder: z.number().int().min(0), links: z.array(z.object({ label: z.string(), href: z.url() })),
  blocks: z.array(blockSchema), sections: z.array(legacySectionSchema),
});

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "").split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

function parseLinks(value: FormDataEntryValue | null) {
  return String(value ?? "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const [label, ...hrefParts] = line.split("|");
    return { label: label.trim(), href: hrefParts.join("|").trim() };
  }).filter((link) => link.label && link.href);
}

function parseJson<T>(value: FormDataEntryValue | null, message: string): T {
  try { return JSON.parse(String(value ?? "[]")) as T; } catch { throw new Error(message); }
}

function readProjectForm(formData: FormData, ordering: Pick<ProjectInput, "featured" | "sortOrder">): ProjectInput {
  const blocks = parseJson<ProjectBlock[]>(formData.get("blocks"), "Os blocos estão em um formato inválido.");
  const sections = parseJson<ProjectSection[]>(formData.get("sections"), "O conteúdo legado está em um formato inválido.");
  const result = projectSchema.safeParse({
    title: formData.get("title"), slug: formData.get("slug"), subtitle: formData.get("subtitle"),
    shortDescription: formData.get("shortDescription"), description: formData.get("description"),
    year: String(formData.get("year") ?? "") || undefined, status: String(formData.get("status") ?? "") || undefined,
    publicationStatus: formData.get("publicationStatus"), categories: formData.getAll("categories") as ProjectCategory[],
    disciplines: lines(formData.get("disciplines")), technologies: lines(formData.get("technologies")),
    thumbnail: String(formData.get("thumbnail") ?? "") || undefined, cover: String(formData.get("cover") ?? "") || undefined,
    gallery: lines(formData.get("gallery")), featured: ordering.featured, accent: formData.get("accent"),
    index: formData.get("index"), sortOrder: ordering.sortOrder, links: parseLinks(formData.get("links")), blocks, sections,
  });
  if (!result.success) throw new Error(result.error.issues[0]?.message ?? "Revise os dados do projeto.");
  return result.data;
}

function refreshProjectPages(...slugs: Array<string | undefined>) {
  revalidatePath("/"); revalidatePath("/projetos"); revalidatePath("/admin");
  slugs.filter(Boolean).forEach((slug) => revalidatePath(`/projetos/${slug}`));
}

function actionError(error: unknown, fallback: string): ProjectActionState {
  unstable_rethrow(error);
  return { error: error instanceof Error ? error.message : fallback };
}

export async function createProjectAction(_state: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  await requireAdmin();
  try {
    const projects = await getAllProjects();
    const nextSortOrder = projects.reduce((highest, project) => Math.max(highest, project.sortOrder ?? 0), -1) + 1;
    const input = readProjectForm(formData, { featured: projects.length === 0, sortOrder: nextSortOrder });
    if (!(await isSlugAvailable(input.slug))) return { error: "Este slug já está em uso." };
    const id = await createProject(input);
    refreshProjectPages(input.slug);
    redirect(`/admin/${id}/editar?saved=1`);
  } catch (error) { return actionError(error, "Não foi possível criar o projeto."); }
}

export async function updateProjectAction(id: string, _state: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  await requireAdmin();
  try {
    const previous = await getProjectById(id);
    if (!previous) return { error: "Projeto não encontrado." };
    const input = readProjectForm(formData, { featured: previous.featured, sortOrder: previous.sortOrder ?? 0 });
    if (!(await isSlugAvailable(input.slug, id))) return { error: "Este slug já está em uso." };
    await updateProject(id, input);
    refreshProjectPages(previous.slug, input.slug);
    redirect(`/admin/${id}/editar?saved=1`);
  } catch (error) { return actionError(error, "Não foi possível salvar o projeto."); }
}

export async function setProjectStatusAction(id: string, status: ProjectPublicationStatus) {
  await requireAdmin();
  const project = await getProjectById(id);
  if (!project) return;
  await updateProjectStatus(id, status);
  refreshProjectPages(project.slug);
}

export async function duplicateProjectAction(id: string) {
  await requireAdmin();
  const project = await getProjectById(id);
  if (!project) return;
  let suffix = 1;
  let slug = `${project.slug}-copia`;
  while (!(await isSlugAvailable(slug))) { suffix += 1; slug = `${project.slug}-copia-${suffix}`; }
  const projects = await getAllProjects();
  const nextSortOrder = projects.reduce((highest, item) => Math.max(highest, item.sortOrder ?? 0), -1) + 1;
  const copyId = await createProject({ ...project, id: undefined, slug, title: `${project.title} (cópia)`, publicationStatus: "draft", published: false, featured: false, sortOrder: nextSortOrder });
  refreshProjectPages(slug);
  redirect(`/admin/${copyId}/editar?duplicated=1`);
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  const project = await getProjectById(id);
  if (!project) return;
  await deleteProject(id);
  await normalizeProjectOrder();
  refreshProjectPages(project.slug);
  redirect("/admin?deleted=1");
}

const projectOrderSchema = z.array(z.string().trim().min(1)).min(1).max(500);

export async function reorderProjectsAction(projectIds: string[]): Promise<ProjectActionState> {
  await requireAdmin();
  try {
    const result = projectOrderSchema.safeParse(projectIds);
    if (!result.success || new Set(result.data).size !== result.data.length) return { error: "A ordem enviada é inválida." };

    const projects = await getAllProjects();
    const existingIds = new Set(projects.map((project) => project.id));
    if (result.data.length !== existingIds.size || result.data.some((id) => !existingIds.has(id))) {
      return { error: "A lista de projetos mudou. Atualize a página e tente novamente." };
    }

    await reorderProjects(result.data);
    refreshProjectPages(...projects.map((project) => project.slug));
    return {};
  } catch (error) {
    return actionError(error, "Não foi possível salvar a nova ordem.");
  }
}
