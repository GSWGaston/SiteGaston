import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { deleteProjectAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = { title: "Painel de projetos", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const user = await requireAdmin();
  const databaseReady = isDatabaseConfigured();
  const projects = await getAllProjects();

  return (
    <div className="admin-shell">
      <AdminHeader user={user} />
      <div className="admin-content">
        <div className="admin-page-heading"><div><p className="admin-kicker">Painel</p><h1>Projetos</h1><p>{projects.length} itens no portfólio</p></div>{databaseReady ? <Link className="admin-primary-button" href="/admin/novo">+ Novo projeto</Link> : null}</div>
        {!databaseReady ? <section className="admin-setup-panel"><span>Configuração necessária</span><h2>Conecte o Neon para liberar a edição.</h2><p>O site continua usando os dados locais. Depois que o banco for conectado e o schema aplicado, os controles de criação e edição serão habilitados.</p><code>npm run db:setup</code></section> : null}
        <div className="admin-project-list">
          {projects.map((project) => (
            <article key={project.id}>
              <div className="admin-project-swatch" style={{ backgroundColor: project.accent }}>{project.index}</div>
              <div className="admin-project-info"><h2>{project.title}</h2><p>{project.categories.join(" · ")}</p></div>
              <span className={project.published ? "admin-status published" : "admin-status"}>{project.published ? "Publicado" : databaseReady ? "Rascunho" : "Dados locais"}</span>
              <div className="admin-project-actions">
                <Link href={`/projetos/${project.slug}`} target="_blank">Visualizar</Link>
                {databaseReady ? <Link href={`/admin/${project.id}/editar`}>Editar</Link> : null}
                {databaseReady ? <DeleteProjectButton title={project.title} action={deleteProjectAction.bind(null, project.id)} /> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
