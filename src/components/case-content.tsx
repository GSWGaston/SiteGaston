import { ProjectVisual } from "@/components/project-visual";
import type { Project, ProjectSection } from "@/types/project";

function MediaPlaceholder({ src, alt, caption, project }: { src?: string; alt: string; caption?: string; project: Project }) {
  return (
    <figure className="case-media">
      {src ? <div className="case-media-image"><Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 50vw" /></div> : <ProjectVisual project={project} />}
      <figcaption><span>{alt}</span>{caption ? <span>{caption}</span> : null}</figcaption>
    </figure>
  );
}

function Section({ section, project }: { section: ProjectSection; project: Project }) {
  switch (section.type) {
    case "text":
      return <section className="case-text">{section.title ? <h2>{section.title}</h2> : null}<div>{section.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>;
    case "highlight":
      return <section className="case-highlight"><p className="eyebrow">{section.eyebrow ?? "Destaque"}</p><blockquote>{section.content}</blockquote></section>;
    case "list":
      return <section className="case-list"><h2>{section.title}</h2><ol>{section.items.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></section>;
    case "media":
      return <section className="case-media-grid">{section.title ? <h2>{section.title}</h2> : null}<div>{section.items.map((item) => <MediaPlaceholder key={item.alt} {...item} project={project} />)}</div></section>;
    case "technologies":
      return <section className="case-technologies"><p className="eyebrow">{section.title ?? "Tecnologias"}</p><ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
  }
}

export function CaseContent({ project }: { project: Project }) {
  return <div className="case-content container">{project.sections.map((section, index) => <Section key={`${section.type}-${index}`} project={project} section={section} />)}</div>;
}
import Image from "next/image";
