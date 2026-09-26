"use client";
import Image from "next/image";
import { useState } from "react";
import type { TwoViewProjectBlock } from "@/types/project";
export function TwoViewBlock({ block }: { block: TwoViewProjectBlock }) {
  const [active, setActive] = useState<"a" | "b">("a");
  const current = active === "a" ? block.viewA : block.viewB;
  return <section className="project-block project-block-two-view"><div className="project-two-view-heading"><div><h2>{block.title}</h2>{block.description ? <p>{block.description}</p> : null}</div><div className="project-two-view-tabs" role="tablist" aria-label={block.title}><button id={`${block.id}-tab-a`} role="tab" aria-selected={active === "a"} aria-controls={`${block.id}-panel`} onClick={() => setActive("a")} type="button">{block.viewA.label}</button><button id={`${block.id}-tab-b`} role="tab" aria-selected={active === "b"} aria-controls={`${block.id}-panel`} onClick={() => setActive("b")} type="button">{block.viewB.label}</button></div></div><div className="project-two-view-mobile" id={`${block.id}-panel`} role="tabpanel" aria-labelledby={`${block.id}-tab-${active}`}><div className="project-block-media" key={active}><Image src={current.url} alt={current.alt} fill sizes="100vw" /></div>{current.caption ? <p className="project-block-caption">{current.caption}</p> : null}</div><div className="project-two-view-desktop">{[block.viewA, block.viewB].map((view) => <figure key={view.label}><div className="project-block-media"><Image src={view.url} alt={view.alt} fill sizes="50vw" /></div><figcaption><strong>{view.label}</strong>{view.caption ? <span>{view.caption}</span> : null}</figcaption></figure>)}</div></section>;
}
