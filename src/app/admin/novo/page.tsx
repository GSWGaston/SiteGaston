import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createProjectAction } from "@/app/admin/actions";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdmin } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = { title: "Novo projeto", robots: { index: false, follow: false } };

export default async function NewProjectPage() {
  const user = await requireAdmin();
  if (!isDatabaseConfigured()) redirect("/admin");
  return <div className="admin-shell"><AdminHeader user={user} /><div className="admin-content admin-editor"><Link className="admin-back-link" href="/admin">← Projetos</Link><div className="admin-page-heading"><div><p className="admin-kicker">Novo item</p><h1>Criar projeto</h1></div></div><ProjectForm action={createProjectAction} /></div></div>;
}
