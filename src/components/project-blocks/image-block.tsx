import Image from "next/image";
import type { ImageProjectBlock } from "@/types/project";
export function ImageBlock({ block }: { block: ImageProjectBlock }) {
  return <figure className={`project-block project-block-image is-${block.layout}`}><div className="project-block-media"><Image src={block.image.url} alt={block.image.alt} fill sizes={block.layout === "normal" ? "(max-width: 800px) 100vw, 900px" : "100vw"} /></div>{block.image.caption ? <figcaption>{block.image.caption}</figcaption> : null}</figure>;
}
