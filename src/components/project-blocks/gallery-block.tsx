import Image from "next/image";
import type { GalleryProjectBlock } from "@/types/project";
export function GalleryBlock({ block }: { block: GalleryProjectBlock }) {
  return <section className={`project-block project-block-gallery is-${block.layout}`}>{block.title ? <h2>{block.title}</h2> : null}<div className="project-gallery-track">{block.images.map((image, index) => <figure key={`${block.id}-${index}`}><div className="project-block-media"><Image src={image.url} alt={image.alt} fill sizes="(max-width: 800px) 88vw, 50vw" /></div>{image.caption ? <figcaption>{image.caption}</figcaption> : null}</figure>)}</div></section>;
}
