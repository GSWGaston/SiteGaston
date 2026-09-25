import type { Metadata } from "next";
import { ProjectFilter } from "@/components/project-filter";
import { getPublicProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Produtos digitais, interfaces, identidades, desenvolvimento e projetos multimídia de Matheus Gaston.",
  alternates: { canonical: "/projetos" },
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublicProjects();
  return (
    <div className="page-shell container">
      <header className="page-header">
        <p className="eyebrow">Arquivo / 01—07</p>
        <h1>Projetos</h1>
        <p>Produtos digitais, sistemas, identidades e histórias construídos entre o design e a tecnologia.</p>
      </header>
      <ProjectFilter projects={projects} />
    </div>
  );
}
