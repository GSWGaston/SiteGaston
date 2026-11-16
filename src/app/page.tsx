import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";
import { practiceAreas, siteConfig } from "@/data/site";
import { getPublicProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getPublicProjects();
  const featuredProject = projects[0];
  const otherProjects = projects.filter((project) => project.id !== featuredProject?.id);
  return (
    <>
      <section className="hero container">
        <div className="hero-meta">
          <span>Portfólio / 2026</span>
          <span>{siteConfig.location}</span>
        </div>
        <div className="hero-content">
          <p className="hero-kicker"><span /> UI/UX, Web e Branding</p>
          <h1>Interfaces, sites e marcas<br /><span>que funcionam.</span></h1>
          <div className="hero-bottom">
            <p>Sou Matheus Gaston, designer de UI/UX, web e branding. Crio interfaces, sites e identidades visuais para profissionais autônomos, pequenos negócios, estúdios e agências.</p>
            <div className="hero-actions">
              <Link href="/projetos" className="button button-primary">Ver projetos <ArrowRight /></Link>
              <Link href="/sobre" className="button button-secondary">Sobre mim</Link>
            </div>
          </div>
        </div>
        <div className="hero-marquee" aria-hidden="true">
          <span>UI/UX</span><i>•</i><span>WEB</span><i>•</i><span>BRANDING</span><i>•</i><span>DESENVOLVIMENTO</span>
        </div>
      </section>

      <section className="section container" id="projetos-destaque">
        <SectionHeader eyebrow="Projetos / 01" title="Trabalhos selecionados" description="Uma seleção de interfaces, sites e identidades visuais, do conceito à entrega." />
        {featuredProject ? <div className="featured-grid"><ProjectCard project={featuredProject} /></div> : null}
        {otherProjects.length ? <div className="projects-grid home-projects-grid">
          {otherProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div> : null}
      </section>

      <section className="section expertise-section">
        <div className="container">
          <SectionHeader eyebrow="Atuação / 02" title="Entre o visual e o funcional" description="Interface, identidade e site pensados juntos, da ideia à implementação." />
          <div className="expertise-list">
            {practiceAreas.map((area) => (
              <article key={area.number}>
                <span>{area.number}</span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <ArrowUpRight />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container home-about">
        <p className="eyebrow">Sobre / 03</p>
        <div className="about-statement">
          <p>Criação e técnica,<br />lado a lado.</p>
          <div>
            <p>Sou estudante de Produção Multimídia no Senac RS e trabalho com UI/UX, web e branding. Crio de identidades visuais a interfaces e sites, cuidando tanto das decisões de design quanto da execução.</p>
            <p>Gosto de entender o problema do cliente por inteiro antes de desenhar a solução.</p>
            <Link href="/sobre" className="text-link">Conheça minha trajetória <ArrowRight /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
