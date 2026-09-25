"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { projectCategories } from "@/data/projects";
import type { Project, ProjectSection } from "@/types/project";
import type { ProjectActionState } from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/image-upload";

type ProjectFormProps = {
  project?: Project;
  action: (state: ProjectActionState, formData: FormData) => Promise<ProjectActionState>;
};

const emptyTextSection: ProjectSection = { type: "text", title: "", content: [""] };

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button className="admin-primary-button" disabled={pending} type="submit">{pending ? "Salvando…" : "Salvar projeto"}</button>;
}

function SectionEditor({ initialSections }: { initialSections: ProjectSection[] }) {
  const [sections, setSections] = useState<ProjectSection[]>(initialSections.length ? initialSections : [emptyTextSection]);

  function replace(index: number, section: ProjectSection) {
    setSections((current) => current.map((item, itemIndex) => itemIndex === index ? section : item));
  }

  function move(index: number, direction: -1 | 1) {
    setSections((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function add(type: ProjectSection["type"]) {
    const section: ProjectSection = type === "text"
      ? { type, title: "", content: [""] }
      : type === "highlight"
        ? { type, eyebrow: "", content: "" }
        : type === "list"
          ? { type, title: "", items: [""] }
          : type === "media"
            ? { type, title: "", items: [{ src: "", alt: "", caption: "" }] }
            : { type, title: "Tecnologias", items: [""] };
    setSections((current) => [...current, section]);
  }

  return (
    <section className="admin-form-section">
      <div className="admin-form-heading"><div><span>04</span><h2>Conteúdo do case</h2></div><p>Monte a narrativa adicionando e ordenando blocos.</p></div>
      <input name="sections" type="hidden" value={JSON.stringify(sections)} readOnly />
      <div className="admin-block-list">
        {sections.map((section, index) => (
          <article className="admin-block" key={`${section.type}-${index}`}>
            <div className="admin-block-toolbar">
              <strong>{index + 1}. {section.type}</strong>
              <div>
                <button disabled={index === 0} onClick={() => move(index, -1)} type="button" aria-label="Mover bloco para cima">↑</button>
                <button disabled={index === sections.length - 1} onClick={() => move(index, 1)} type="button" aria-label="Mover bloco para baixo">↓</button>
                <button onClick={() => setSections((current) => current.filter((_, itemIndex) => itemIndex !== index))} type="button">Remover</button>
              </div>
            </div>

            {section.type === "text" ? <>
              <input aria-label="Título do bloco" onChange={(event) => replace(index, { ...section, title: event.target.value })} placeholder="Título do bloco" value={section.title ?? ""} />
              <textarea aria-label="Parágrafos" onChange={(event) => replace(index, { ...section, content: event.target.value.split(/\n\n+/) })} placeholder="Separe os parágrafos com uma linha em branco" rows={7} value={section.content.join("\n\n")} />
            </> : null}

            {section.type === "highlight" ? <>
              <input aria-label="Rótulo do destaque" onChange={(event) => replace(index, { ...section, eyebrow: event.target.value })} placeholder="Rótulo" value={section.eyebrow ?? ""} />
              <textarea aria-label="Texto do destaque" onChange={(event) => replace(index, { ...section, content: event.target.value })} placeholder="Texto em destaque" rows={4} value={section.content} />
            </> : null}

            {section.type === "list" || section.type === "technologies" ? <>
              <input aria-label="Título da lista" onChange={(event) => replace(index, { ...section, title: event.target.value })} placeholder="Título" value={section.title ?? ""} />
              <textarea aria-label="Itens da lista" onChange={(event) => replace(index, { ...section, items: event.target.value.split(/\r?\n/).filter(Boolean) })} placeholder="Um item por linha" rows={6} value={section.items.join("\n")} />
            </> : null}

            {section.type === "media" ? <>
              <input aria-label="Título da galeria" onChange={(event) => replace(index, { ...section, title: event.target.value })} placeholder="Título da galeria" value={section.title ?? ""} />
              {section.items.map((item, mediaIndex) => (
                <div className="admin-media-item" key={mediaIndex}>
                  <input aria-label="URL da imagem" onChange={(event) => replace(index, { ...section, items: section.items.map((current, itemIndex) => itemIndex === mediaIndex ? { ...current, src: event.target.value } : current) })} placeholder="URL da imagem" type="url" value={item.src ?? ""} />
                  <input aria-label="Texto alternativo" onChange={(event) => replace(index, { ...section, items: section.items.map((current, itemIndex) => itemIndex === mediaIndex ? { ...current, alt: event.target.value } : current) })} placeholder="Descrição acessível da imagem" value={item.alt} />
                  <input aria-label="Legenda" onChange={(event) => replace(index, { ...section, items: section.items.map((current, itemIndex) => itemIndex === mediaIndex ? { ...current, caption: event.target.value } : current) })} placeholder="Legenda opcional" value={item.caption ?? ""} />
                  <button onClick={() => replace(index, { ...section, items: section.items.filter((_, itemIndex) => itemIndex !== mediaIndex) })} type="button">Remover imagem</button>
                </div>
              ))}
              <button className="admin-secondary-button" onClick={() => replace(index, { ...section, items: [...section.items, { src: "", alt: "", caption: "" }] })} type="button">+ Imagem</button>
            </> : null}
          </article>
        ))}
      </div>
      <div className="admin-add-block">
        <span>Adicionar bloco</span>
        <button onClick={() => add("text")} type="button">Texto</button>
        <button onClick={() => add("highlight")} type="button">Destaque</button>
        <button onClick={() => add("list")} type="button">Lista</button>
        <button onClick={() => add("media")} type="button">Galeria</button>
        <button onClick={() => add("technologies")} type="button">Tecnologias</button>
      </div>
    </section>
  );
}

export function ProjectForm({ project, action }: ProjectFormProps) {
  const [state, formAction] = useActionState(action, {});
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const categories = project?.categories ?? [];

  return (
    <form action={formAction} className="admin-project-form">
      <section className="admin-form-section">
        <div className="admin-form-heading"><div><span>01</span><h2>Informações principais</h2></div><p>O que aparece nos cards e no topo do case.</p></div>
        <div className="admin-form-grid">
          <div className="admin-field admin-field-wide"><label htmlFor="title">Título</label><input id="title" name="title" required value={title} onChange={(event) => { setTitle(event.target.value); if (!project) setSlug(slugify(event.target.value)); }} /></div>
          <div className="admin-field"><label htmlFor="slug">Slug da URL</label><input id="slug" name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={slug} onChange={(event) => setSlug(slugify(event.target.value))} /></div>
          <div className="admin-field"><label htmlFor="index">Número visual</label><input id="index" name="index" defaultValue={project?.index ?? "01"} required /></div>
          <div className="admin-field admin-field-wide"><label htmlFor="subtitle">Subtítulo</label><input id="subtitle" name="subtitle" defaultValue={project?.subtitle} /></div>
          <div className="admin-field admin-field-wide"><label htmlFor="shortDescription">Descrição curta</label><textarea id="shortDescription" name="shortDescription" defaultValue={project?.shortDescription} required rows={3} /></div>
          <div className="admin-field admin-field-wide"><label htmlFor="description">Descrição completa</label><textarea id="description" name="description" defaultValue={project?.description} rows={5} /></div>
          <div className="admin-field"><label htmlFor="year">Ano</label><input id="year" name="year" defaultValue={project?.year} /></div>
          <div className="admin-field"><label htmlFor="status">Status</label><select id="status" name="status" defaultValue={project?.status ?? ""}><option value="">Não informado</option><option>Em desenvolvimento</option><option>Conceito</option><option>Acadêmico</option><option>Concluído</option></select></div>
          <div className="admin-field"><label htmlFor="sortOrder">Ordem</label><input id="sortOrder" name="sortOrder" min="0" type="number" defaultValue={project?.sortOrder ?? 0} /></div>
          <div className="admin-field"><label htmlFor="accent">Cor do projeto</label><input id="accent" name="accent" type="color" defaultValue={project?.accent ?? "#d8ff4f"} /></div>
        </div>
      </section>

      <section className="admin-form-section">
        <div className="admin-form-heading"><div><span>02</span><h2>Classificação</h2></div><p>Categorias, disciplinas e tecnologias utilizadas.</p></div>
        <fieldset className="admin-category-grid"><legend>Categorias</legend>{projectCategories.filter((item) => item !== "Todos").map((category) => <label key={category}><input defaultChecked={categories.includes(category)} name="categories" type="checkbox" value={category} /><span>{category}</span></label>)}</fieldset>
        <div className="admin-form-grid">
          <div className="admin-field"><label htmlFor="disciplines">Disciplinas</label><textarea id="disciplines" name="disciplines" defaultValue={project?.disciplines.join("\n")} placeholder="Uma por linha" rows={6} /></div>
          <div className="admin-field"><label htmlFor="technologies">Tecnologias</label><textarea id="technologies" name="technologies" defaultValue={project?.technologies.join("\n")} placeholder="Uma por linha" rows={6} /></div>
        </div>
      </section>

      <section className="admin-form-section">
        <div className="admin-form-heading"><div><span>03</span><h2>Imagens e links</h2></div><p>Arquivos enviados ficam armazenados no Vercel Blob.</p></div>
        <div className="admin-form-grid">
          <ImageUpload label="Imagem de capa" name="cover" defaultValue={project?.cover} />
          <ImageUpload label="Miniatura" name="thumbnail" defaultValue={project?.thumbnail} />
          <div className="admin-field"><label htmlFor="gallery">Galeria</label><textarea id="gallery" name="gallery" defaultValue={project?.gallery.join("\n")} placeholder="Uma URL por linha" rows={6} /></div>
          <div className="admin-field"><label htmlFor="links">Links</label><textarea id="links" name="links" defaultValue={project?.links.map((link) => `${link.label}|${link.href}`).join("\n")} placeholder="Rótulo|https://endereco.com" rows={6} /></div>
        </div>
      </section>

      <SectionEditor initialSections={project?.sections ?? []} />

      <section className="admin-publish-bar">
        <div className="admin-toggle-group">
          <label><input defaultChecked={project?.featured} name="featured" type="checkbox" /><span>Projeto em destaque</span></label>
          <label><input defaultChecked={project?.published} name="published" type="checkbox" /><span>Publicado no site</span></label>
        </div>
        {state.error ? <p className="admin-error" role="alert">{state.error}</p> : null}
        <SubmitButton />
      </section>
    </form>
  );
}
