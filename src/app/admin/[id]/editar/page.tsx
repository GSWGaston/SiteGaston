import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deleteProjectAction, updateProjectAction } from "@/app/admin/actions";
import { AdminHeader } from "@/components/admin/admin-header";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdmin } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { getProjectById } from "@/lib/projects";

export const metadata: Metadata = { title: "Editar projeto", robots: { index: false, follow: false } };

export default async function EditProjectPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; duplicated?: string }> }) {
  const user = await requireAdmin();
  if (!isDatabaseConfigured()) redirect("/admin");
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();
  const { saved, duplicated } = await searchParams;
  return <div className="admin-shell"><AdminHeader user={user} /><div className="admin-content admin-editor"><Link className="admin-back-link" href="/admin">← Projetos</Link><div className="admin-page-heading"><div><p className="admin-kicker">Editar item</p><h1>{project.title}</h1></div><DeleteProjectButton title={project.title} action={deleteProjectAction.bind(null, project.id)} /></div>{saved ? <p className="admin-success" role="status">Projeto salvo com sucesso.</p> : null}{duplicated ? <p className="admin-success" role="status">Cópia criada como rascunho.</p> : null}<ProjectForm project={project} action={updateProjectAction.bind(null, id)} /></div></div>;
}
