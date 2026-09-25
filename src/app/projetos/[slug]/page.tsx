import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/icons";
import { CaseContent } from "@/components/case-content";
import { ProjectVisual } from "@/components/project-visual";
import { projects as seedProjects } from "@/data/projects";
import { getProjectBySlug, getPublicProjects } from "@/lib/projects";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return seedProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: `/projetos/${project.slug}` },
    openGraph: { title: project.title, description: project.shortDescription, type: "article" },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProjectBySlug(slug), getPublicProjects()]);
  if (!project) notFound();
  const currentIndex = projects.findIndex((item) => item.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    creator: { "@type": "Person", name: "Matheus Gaston da Silva" },
  };

  return (
    <article className="case-page">
      <header className="case-hero container">
        <Link href="/projetos" className="back-link">← Todos os projetos</Link>
        <div className="case-title-row">
          <div>
            <p className="eyebrow">{project.categories.join(" / ")}</p>
            <h1>{project.title}</h1>
            <p>{project.subtitle}</p>
          </div>
          <span className="case-index">{project.index}</span>
        </div>
        <ProjectVisual project={project} variant="hero" />
        <dl className="case-meta">
          <div><dt>Status</dt><dd>{project.status ?? "Não informado"}</dd></div>
          <div><dt>Disciplinas</dt><dd>{project.disciplines.join(", ")}</dd></div>
          <div><dt>Ano</dt><dd>{project.year ?? "Não informado"}</dd></div>
        </dl>
      </header>
      <CaseContent project={project} />
      <nav className="next-project container" aria-label="Navegação entre projetos">
        <p>Próximo projeto</p>
        <Link href={`/projetos/${nextProject.slug}`}><span>{nextProject.title}</span><ArrowRight size={36} /></Link>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema).replace(/</g, "\\u003c") }} />
    </article>
  );
}
