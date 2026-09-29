import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { SortableProjectList } from "@/components/admin/sortable-project-list";
import { requireAdmin } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = { title: "Painel de projetos", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const user = await requireAdmin();
  const databaseReady = isDatabaseConfigured();
  const projects = await getAllProjects();
  return <div className="admin-shell"><AdminHeader user={user} /><div className="admin-content"><div className="admin-page-heading"><div><p className="admin-kicker">Painel</p><h1>Projetos</h1><p>{projects.length} itens no portfólio</p></div>{databaseReady ? <Link className="admin-primary-button" href="/admin/novo">+ Novo projeto</Link> : null}</div>
    {!databaseReady ? <section className="admin-setup-panel"><span>Configuração necessária</span><h2>Conecte o Neon para liberar a edição.</h2><p>O site continua usando os dados locais. Depois que o banco for conectado e o schema aplicado, os controles administrativos serão habilitados.</p><code>npm run db:setup</code></section> : null}
    <SortableProjectList databaseReady={databaseReady} projects={projects} />
  </div></div>;
}
