import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/icons";
import { CaseContent } from "@/components/case-content";
import { ProjectBlocks } from "@/components/project-blocks/project-block-renderer";
import { ProjectVisual } from "@/components/project-visual";
import { brandRelationOptions, classificationBadges, projectKindOptions } from "@/data/classification";
import { getProjectBySlug, getPublicProjects } from "@/lib/projects";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

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
  const badges = classificationBadges(project);
  const kindLabel = projectKindOptions.find((option) => option.value === project.projectType)?.label;
  const relationLabel = brandRelationOptions.find((option) => option.value === project.brandRelation)?.label;
  const meta: Array<[string, string | undefined]> = [
    ["Tipo", kindLabel],
    ["Vínculo", relationLabel ? [relationLabel, project.referenceBrand].filter(Boolean).join(" · ") : undefined],
    ["Disciplina", project.course],
    ["Status", project.status],
    ["Ano", project.year],
    ["Habilidades", project.disciplines.join(", ") || undefined],
  ];
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
            <p className="case-subtitle">{project.subtitle}</p>
            {badges.length ? <ul className="tag-list project-badges" aria-label="Classificação do projeto">{badges.map((badge) => <li key={badge}>{badge}</li>)}</ul> : null}
            {project.description ? <p className="case-description">{project.description}</p> : null}
          </div>
          <span className="case-index" aria-hidden="true">{String(currentIndex + 1).padStart(2, "0")}</span>
        </div>
        <ProjectVisual project={project} variant="hero" />
        <dl className="case-meta">
          {meta.map(([label, value]) => value ? <div key={label}><dt>{label}</dt><dd>{value}</dd></div> : null)}
        </dl>
      </header>
      {project.blocks?.length ? <ProjectBlocks blocks={project.blocks} /> : <CaseContent project={project} />}
      <nav className="next-project container" aria-label="Navegação entre projetos">
        <p>Próximo projeto</p>
        <Link href={`/projetos/${nextProject.slug}`}><span>{nextProject.title}</span><ArrowRight size={36} /></Link>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema).replace(/</g, "\\u003c") }} />
    </article>
  );
}
