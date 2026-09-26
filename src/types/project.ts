export type ProjectCategory =
  | "UI/UX"
  | "Web"
  | "Apps"
  | "Branding"
  | "Design Gráfico"
  | "Multimídia"
  | "Desenvolvimento"
  | "Projetos Técnicos";

export type ProjectLink = { label: string; href: string };

type LegacyTextBlock = { type: "text"; title?: string; content: string[] };
type LegacyHighlightBlock = { type: "highlight"; eyebrow?: string; content: string };
type LegacyListBlock = { type: "list"; title: string; items: string[] };
type LegacyMediaBlock = { type: "media"; title?: string; items: Array<{ src?: string; alt: string; caption?: string }> };
type LegacyTechnologiesBlock = { type: "technologies"; title?: string; items: string[] };

export type ProjectSection = LegacyTextBlock | LegacyHighlightBlock | LegacyListBlock | LegacyMediaBlock | LegacyTechnologiesBlock;

export type ProjectBlockBase = { id: string; order: number };
export type ProjectImage = { url: string; alt: string; caption?: string };

export type TextProjectBlock = ProjectBlockBase & {
  type: "text";
  title?: string;
  subtitle?: string;
  paragraphs: string[];
  listItems?: string[];
  alignment: "left" | "center";
  width: "narrow" | "normal" | "wide";
};

export type ImageProjectBlock = ProjectBlockBase & {
  type: "image";
  image: ProjectImage;
  layout: "normal" | "wide" | "full";
};

export type GalleryProjectBlock = ProjectBlockBase & {
  type: "gallery";
  title?: string;
  images: ProjectImage[];
  layout: "grid" | "carousel" | "editorial";
};

export type VideoProjectBlock = ProjectBlockBase & {
  type: "video";
  title?: string;
  url: string;
  caption?: string;
  poster?: string;
  autoplay: boolean;
};

export type LiveDemoProjectBlock = ProjectBlockBase & {
  type: "live-demo";
  title: string;
  description?: string;
  url: string;
  embedEnabled: boolean;
  openExternalEnabled: boolean;
  previewImage?: string;
};

export type TwoViewProjectBlock = ProjectBlockBase & {
  type: "two-view";
  title: string;
  description?: string;
  viewA: ProjectImage & { label: string };
  viewB: ProjectImage & { label: string };
};

export type ProjectBlock = TextProjectBlock | ImageProjectBlock | GalleryProjectBlock | VideoProjectBlock | LiveDemoProjectBlock | TwoViewProjectBlock;
export type ProjectPublicationStatus = "draft" | "published" | "hidden";

export type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  year?: string;
  status?: "Em desenvolvimento" | "Conceito" | "Acadêmico" | "Concluído";
  publicationStatus?: ProjectPublicationStatus;
  categories: ProjectCategory[];
  disciplines: string[];
  technologies: string[];
  thumbnail?: string;
  cover?: string;
  gallery: string[];
  featured: boolean;
  published?: boolean;
  sortOrder?: number;
  accent: string;
  index: string;
  links: ProjectLink[];
  blocks?: ProjectBlock[];
  sections: ProjectSection[];
  createdAt?: string;
  updatedAt?: string;
};
