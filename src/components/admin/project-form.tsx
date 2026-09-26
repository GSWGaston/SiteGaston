"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { ProjectActionState } from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/image-upload";
import { ProjectBlockEditor } from "@/components/admin/project-block-editor";
import { projectCategories } from "@/data/projects";
import type { Project } from "@/types/project";

type ProjectFormProps = { project?: Project; action: (state: ProjectActionState, formData: FormData) => Promise<ProjectActionState> };

function slugify(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function SubmitButton() { const { pending } = useFormStatus(); return <button className="admin-primary-button" disabled={pending} type="submit">{pending ? "Salvando…" : "Salvar projeto"}</button>; }

export function ProjectForm({ project, action }: ProjectFormProps) {
  const [state, formAction] = useActionState(action, {});
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const categories = project?.categories ?? [];
  const publicationStatus = project?.publicationStatus ?? (project?.published === false ? "draft" : "published");

  return <form action={formAction} className="admin-project-form">
    <input name="sections" type="hidden" value={JSON.stringify(project?.sections ?? [])} readOnly />
    <section className="admin-form-section"><div className="admin-form-heading"><div><span>01</span><h2>Informações</h2></div><p>Dados dos cards e do topo do case.</p></div><div className="admin-form-grid">
      <div className="admin-field admin-field-wide"><label htmlFor="title">Título</label><input id="title" name="title" required value={title} onChange={(event) => { setTitle(event.target.value); if (!project) setSlug(slugify(event.target.value)); }} /></div>
      <div className="admin-field"><label htmlFor="slug">Slug da URL</label><input id="slug" name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={slug} onChange={(event) => setSlug(slugify(event.target.value))} /></div>
      <div className="admin-field"><label htmlFor="index">Número visual</label><input id="index" name="index" defaultValue={project?.index ?? "01"} required /></div>
      <div className="admin-field admin-field-wide"><label htmlFor="subtitle">Subtítulo</label><input id="subtitle" name="subtitle" defaultValue={project?.subtitle} /></div>
      <div className="admin-field admin-field-wide"><label htmlFor="shortDescription">Resumo</label><textarea id="shortDescription" name="shortDescription" defaultValue={project?.shortDescription} required rows={3} /></div>
      <div className="admin-field admin-field-wide"><label htmlFor="description">Descrição</label><textarea id="description" name="description" defaultValue={project?.description} rows={5} /></div>
      <div className="admin-field"><label htmlFor="year">Ano</label><input id="year" name="year" defaultValue={project?.year} /></div>
      <div className="admin-field"><label htmlFor="status">Fase do projeto</label><select id="status" name="status" defaultValue={project?.status ?? ""}><option value="">Não informado</option><option>Em desenvolvimento</option><option>Conceito</option><option>Acadêmico</option><option>Concluído</option></select></div>
      <div className="admin-field"><label htmlFor="sortOrder">Ordem</label><input id="sortOrder" name="sortOrder" min="0" type="number" defaultValue={project?.sortOrder ?? 0} /></div>
      <div className="admin-field"><label htmlFor="accent">Cor do projeto</label><input id="accent" name="accent" type="color" defaultValue={project?.accent ?? "#d8ff4f"} /></div>
    </div></section>

    <section className="admin-form-section"><div className="admin-form-heading"><div><span>02</span><h2>Classificação</h2></div><p>Categorias, disciplinas e tecnologias.</p></div><fieldset className="admin-category-grid"><legend>Categorias</legend>{projectCategories.filter((item) => item !== "Todos").map((category) => <label key={category}><input defaultChecked={categories.includes(category)} name="categories" type="checkbox" value={category} /><span>{category}</span></label>)}</fieldset><div className="admin-form-grid"><div className="admin-field"><label htmlFor="disciplines">Disciplinas</label><textarea id="disciplines" name="disciplines" defaultValue={project?.disciplines.join("\n")} placeholder="Uma por linha" rows={6} /></div><div className="admin-field"><label htmlFor="technologies">Tecnologias</label><textarea id="technologies" name="technologies" defaultValue={project?.technologies.join("\n")} placeholder="Uma por linha" rows={6} /></div></div></section>

    <section className="admin-form-section"><div className="admin-form-heading"><div><span>03</span><h2>Imagens e links</h2></div><p>Uploads são armazenados no Vercel Blob.</p></div><div className="admin-form-grid"><ImageUpload label="Imagem de capa" name="cover" defaultValue={project?.cover} /><ImageUpload label="Miniatura" name="thumbnail" defaultValue={project?.thumbnail} /><div className="admin-field"><label htmlFor="gallery">Galeria legada</label><textarea id="gallery" name="gallery" defaultValue={project?.gallery.join("\n")} placeholder="Uma URL por linha" rows={6} /></div><div className="admin-field"><label htmlFor="links">Links</label><textarea id="links" name="links" defaultValue={project?.links.map((link) => `${link.label}|${link.href}`).join("\n")} placeholder="Rótulo|https://endereco.com" rows={6} /></div></div></section>

    <ProjectBlockEditor initialBlocks={project?.blocks ?? []} />

    <section className="admin-form-section"><div className="admin-form-heading"><div><span>05</span><h2>Publicação</h2></div><p>Controle a visibilidade e o destaque do projeto.</p></div><div className="admin-form-grid"><div className="admin-field"><label htmlFor="publicationStatus">Visibilidade</label><select id="publicationStatus" name="publicationStatus" defaultValue={publicationStatus}><option value="draft">Rascunho</option><option value="published">Publicado</option><option value="hidden">Oculto</option></select></div><div className="admin-toggle-stack"><label><input defaultChecked={project?.featured} name="featured" type="checkbox" /> Projeto em destaque na Home</label></div></div></section>

    <section className="admin-publish-bar"><p>{publicationStatus === "published" ? "Este projeto está publicado." : "Salve para aplicar as alterações."}</p>{state.error ? <p className="admin-error" role="alert">{state.error}</p> : null}<SubmitButton /></section>
  </form>;
}
