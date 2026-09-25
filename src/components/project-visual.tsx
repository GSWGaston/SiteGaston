import Image from "next/image";
import type { Project } from "@/types/project";

type ProjectVisualProps = {
  project: Project;
  variant?: "card" | "hero";
};

export function ProjectVisual({ project, variant = "card" }: ProjectVisualProps) {
  return (
    <div
      className={`project-visual project-visual-${variant}`}
      style={{ "--project-accent": project.accent } as React.CSSProperties}
      role="img"
      aria-label={`Placeholder visual do projeto ${project.title}`}
    >
      {project.cover ? <Image className="project-image" src={project.cover} alt={`Capa do projeto ${project.title}`} fill sizes={variant === "hero" ? "100vw" : "(max-width: 700px) 100vw, 50vw"} priority={variant === "hero"} /> : <>
        <span className="visual-index">{project.index}</span>
        <div className="visual-grid" aria-hidden="true" />
        <div className="visual-monogram" aria-hidden="true">{project.title.slice(0, 2)}</div>
        <span className="visual-note">Imagem do projeto<br />será adicionada</span>
      </>}
    </div>
  );
}
