import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { deleteProjectAction, duplicateProjectAction, setProjectStatusAction } from "@/app/admin/actions";
import { AdminHeader } from "@/components/admin/admin-header";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { requireAdmin } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { getAllProjects, getPublicationStatus } from "@/lib/projects";
import type { ProjectPublicationStatus } from "@/types/project";

export const metadata: Metadata = { title: "Painel de projetos", robots: { index: false, follow: false } };
const statusLabels: Record<ProjectPublicationStatus, string> = { draft: "Rascunho", published: "Publicado", hidden: "Oculto" };

export default async function AdminPage() {
  const user = await requireAdmin();
  const databaseReady = isDatabaseConfigured();
  const projects = await getAllProjects();
  const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  return <div className="admin-shell"><AdminHeader user={user} /><div className="admin-content"><div className="admin-page-heading"><div><p className="admin-kicker">Painel</p><h1>Projetos</h1><p>{projects.length} itens no portfólio</p></div>{databaseReady ? <Link className="admin-primary-button" href="/admin/novo">+ Novo projeto</Link> : null}</div>
    {!databaseReady ? <section className="admin-setup-panel"><span>Configuração necessária</span><h2>Conecte o Neon para liberar a edição.</h2><p>O site continua usando os dados locais. Depois que o banco for conectado e o schema aplicado, os controles administrativos serão habilitados.</p><code>npm run db:setup</code></section> : null}
    <div className="admin-project-list">{projects.map((project) => { const status = getPublicationStatus(project); return <article key={project.id}>
      <div className="admin-project-thumb" style={{ backgroundColor: project.accent }}>{project.thumbnail || project.cover ? <Image src={project.thumbnail ?? project.cover ?? ""} alt="" fill sizes="64px" /> : <span>{project.index}</span>}</div>
      <div className="admin-project-info"><div><h2>{project.title}</h2>{project.featured ? <span className="admin-featured">Destaque</span> : null}</div><p>/{project.slug} · {project.categories.join(" · ")}</p>{project.updatedAt ? <time dateTime={project.updatedAt}>Atualizado em {dateFormat.format(new Date(project.updatedAt))}</time> : null}</div>
      <span className={`admin-status ${status}`}>{databaseReady ? statusLabels[status] : "Dados locais"}</span>
      <div className="admin-project-actions">{status === "published" ? <Link href={`/projetos/${project.slug}`} target="_blank">Visualizar</Link> : null}{databaseReady ? <Link href={`/admin/${project.id}/editar`}>Editar</Link> : null}{databaseReady ? <details><summary aria-label={`Mais ações para ${project.title}`}>•••</summary><div className="admin-action-menu"><form action={duplicateProjectAction.bind(null, project.id)}><button type="submit">Duplicar</button></form>{status !== "published" ? <form action={setProjectStatusAction.bind(null, project.id, "published")}><button type="submit">Publicar</button></form> : <form action={setProjectStatusAction.bind(null, project.id, "draft")}><button type="submit">Tornar rascunho</button></form>}{status !== "hidden" ? <form action={setProjectStatusAction.bind(null, project.id, "hidden")}><button type="submit">Ocultar</button></form> : null}<DeleteProjectButton title={project.title} action={deleteProjectAction.bind(null, project.id)} /></div></details> : null}</div>
    </article>; })}</div>
  </div></div>;
}
