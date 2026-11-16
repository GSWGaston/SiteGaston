import type { Metadata } from "next";
import { ProjectFilter } from "@/components/project-filter";
import { getPublicProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Interfaces, sites e identidades visuais de Matheus Gaston, designer de UI/UX, web e branding.",
  alternates: { canonical: "/projetos" },
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublicProjects();
  return (
    <div className="page-shell container">
      <header className="page-header">
        <p className="eyebrow">Arquivo / {String(projects.length).padStart(2, "0")}</p>
        <h1>Projetos</h1>
        <p>Interfaces, sites e identidades visuais construídos entre o design e a tecnologia.</p>
      </header>
      <ProjectFilter projects={projects} />
    </div>
  );
}
