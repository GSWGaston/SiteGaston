import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/projetos", "/sobre"].map((route) => ({ url: `${siteConfig.url}${route}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.8 }));
  const projectRoutes = projects.map((project) => ({ url: `${siteConfig.url}/projetos/${project.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 }));
  return [...routes, ...projectRoutes];
}
