import type { VideoProjectBlock } from "@/types/project";
function embedUrl(url: string, autoplay: boolean) {
  try {
    const parsed = new URL(url);
    const youtubeId = parsed.hostname.includes("youtu.be") ? parsed.pathname.slice(1) : parsed.searchParams.get("v") ?? parsed.pathname.match(/\/embed\/([^/]+)/)?.[1];
    if (youtubeId) return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&mute=${autoplay ? 1 : 0}`;
    const vimeoId = parsed.hostname.includes("vimeo.com") ? parsed.pathname.split("/").filter(Boolean).pop() : undefined;
    if (vimeoId && /^\d+$/.test(vimeoId)) return `https://player.vimeo.com/video/${vimeoId}?autoplay=${autoplay ? 1 : 0}&muted=${autoplay ? 1 : 0}`;
  } catch { return undefined; }
  return undefined;
}
export function VideoBlock({ block }: { block: VideoProjectBlock }) {
  const embed = embedUrl(block.url, block.autoplay);
  return <section className="project-block project-block-video">{block.title ? <h2>{block.title}</h2> : null}<div className="project-video-frame">{embed ? <iframe src={embed} title={block.title || "Vídeo do projeto"} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <video controls autoPlay={block.autoplay} muted={block.autoplay} playsInline poster={block.poster}><source src={block.url} />Seu navegador não suporta este vídeo.</video>}</div>{block.caption ? <p className="project-block-caption">{block.caption}</p> : null}</section>;
}
