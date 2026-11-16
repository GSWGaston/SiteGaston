import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { classificationBadges } from "@/data/classification";
import { ProjectVisual } from "@/components/project-visual";
import type { Project } from "@/types/project";

type ProjectCardProps = { project: Project; priority?: boolean };

export function ProjectCard({ project }: ProjectCardProps) {
  const badges = classificationBadges(project);
  const hiddenCategories = project.categories.length - 2;
  return (
    <article className="project-card reveal">
      <Link href={`/projetos/${project.slug}`} className="project-card-link" aria-label={`Ver projeto ${project.title}`}>
        <ProjectVisual project={project} />
        <div className="project-card-content">
          <div className="project-card-topline">
            <span>{project.categories.slice(0, 2).join(" · ")}{hiddenCategories > 0 ? ` +${hiddenCategories}` : ""}</span>
            {project.status ? <span>{project.status}</span> : <span>Case em preparação</span>}
          </div>
          <div className="project-card-title">
            <h3>{project.title}</h3>
            <ArrowUpRight size={24} />
          </div>
          <p>{project.shortDescription}</p>
          {badges.length ? <ul className="tag-list project-badges" aria-label="Classificação do projeto">{badges.map((badge) => <li key={badge}>{badge}</li>)}</ul> : null}
          <ul className="tag-list" aria-label="Disciplinas">
            {project.disciplines.slice(0, 3).map((discipline) => <li key={discipline}>{discipline}</li>)}
          </ul>
        </div>
      </Link>
    </article>
  );
}
