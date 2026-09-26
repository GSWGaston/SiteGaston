import { GalleryBlock } from "./gallery-block";
import { ImageBlock } from "./image-block";
import { LiveDemoBlock } from "./live-demo-block";
import { TextBlock } from "./text-block";
import { TwoViewBlock } from "./two-view-block";
import { VideoBlock } from "./video-block";
import type { ProjectBlock } from "@/types/project";
export function ProjectBlockRenderer({ block }: { block: ProjectBlock }) {
  switch (block.type) { case "text": return <TextBlock block={block} />; case "image": return <ImageBlock block={block} />; case "gallery": return <GalleryBlock block={block} />; case "video": return <VideoBlock block={block} />; case "live-demo": return <LiveDemoBlock block={block} />; case "two-view": return <TwoViewBlock block={block} />; }
}
export function ProjectBlocks({ blocks }: { blocks: ProjectBlock[] }) { return <div className="project-blocks">{[...blocks].sort((a, b) => a.order - b.order).map((block) => <ProjectBlockRenderer block={block} key={block.id} />)}</div>; }
