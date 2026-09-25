export type ProjectCategory =
  | "UI/UX"
  | "Web"
  | "Apps"
  | "Branding"
  | "Design Gráfico"
  | "Multimídia"
  | "Desenvolvimento"
  | "Projetos Técnicos";

export type ProjectLink = {
  label: string;
  href: string;
};

type TextBlock = {
  type: "text";
  title?: string;
  content: string[];
};

type HighlightBlock = {
  type: "highlight";
  eyebrow?: string;
  content: string;
};

type ListBlock = {
  type: "list";
  title: string;
  items: string[];
};

type MediaBlock = {
  type: "media";
  title?: string;
  items: Array<{ src?: string; alt: string; caption?: string }>;
};

type TechnologiesBlock = {
  type: "technologies";
  title?: string;
  items: string[];
};

export type ProjectSection =
  | TextBlock
  | HighlightBlock
  | ListBlock
  | MediaBlock
  | TechnologiesBlock;

export type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  year?: string;
  status?: "Em desenvolvimento" | "Conceito" | "Acadêmico" | "Concluído";
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
  sections: ProjectSection[];
};
