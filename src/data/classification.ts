import type { BrandRelation, Project, ProjectKind } from "@/types/project";

export const projectKindOptions: Array<{ value: ProjectKind; label: string }> = [
  { value: "autoral", label: "Autoral" },
  { value: "academico", label: "Acadêmico" },
  { value: "cliente", label: "Para cliente" },
];

export const brandRelationOptions: Array<{ value: BrandRelation; label: string }> = [
  { value: "sem-vinculo", label: "Sem vínculo oficial" },
  { value: "com-vinculo", label: "Com vínculo oficial" },
  { value: "nao-se-aplica", label: "Não se aplica" },
];

const kindBadge: Record<ProjectKind, string> = { autoral: "Projeto autoral", academico: "Projeto acadêmico", cliente: "Projeto para cliente" };

// Só devolve o que estiver preenchido; projetos antigos (sem os campos) retornam [].
export function classificationBadges(project: Pick<Project, "projectType" | "brandRelation" | "referenceBrand">): string[] {
  const brand = project.referenceBrand?.trim();
  const badges: string[] = [];
  if (project.projectType) badges.push(kindBadge[project.projectType]);
  if (project.brandRelation === "sem-vinculo") badges.push(brand ? `Sem vínculo oficial com ${brand}` : "Sem vínculo oficial");
  if (project.brandRelation === "com-vinculo") badges.push(brand ? `Com vínculo oficial com ${brand}` : "Com vínculo oficial");
  return badges;
}
