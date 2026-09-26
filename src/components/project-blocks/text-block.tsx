import type { TextProjectBlock } from "@/types/project";
export function TextBlock({ block }: { block: TextProjectBlock }) {
  return <section className={`project-block project-block-text is-${block.width} align-${block.alignment}`}>{block.title ? <h2>{block.title}</h2> : null}{block.subtitle ? <p className="project-block-subtitle">{block.subtitle}</p> : null}<div>{block.paragraphs.map((paragraph, index) => <p key={`${block.id}-${index}`}>{paragraph}</p>)}</div>{block.listItems?.length ? <ul>{block.listItems.map((item, index) => <li key={`${block.id}-item-${index}`}>{item}</li>)}</ul> : null}</section>;
}
