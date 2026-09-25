"use client";

import { useState } from "react";
import { projectCategories } from "@/data/projects";
import type { Project } from "@/types/project";
import { ProjectCard } from "@/components/project-card";

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState<(typeof projectCategories)[number]>("Todos");
  const visibleProjects = activeCategory === "Todos"
    ? projects
    : projects.filter((project) => project.categories.includes(activeCategory));

  return (
    <>
      <div className="filter-list" role="group" aria-label="Filtrar projetos por categoria">
        {projectCategories.map((category) => (
          <button
            aria-pressed={activeCategory === category}
            className={activeCategory === category ? "filter-button is-active" : "filter-button"}
            key={category}
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>
      <p className="filter-result" aria-live="polite">
        {visibleProjects.length} {visibleProjects.length === 1 ? "projeto" : "projetos"}
      </p>
      <div className="projects-grid">
        {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </>
  );
}
