import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";
import { practiceAreas, siteConfig } from "@/data/site";
import { getPublicProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getPublicProjects();
  const featuredProject = projects.find((project) => project.featured) ?? projects[0];
  const otherProjects = projects.filter((project) => project.id !== featuredProject?.id);
  return (
    <>
      <section className="hero container">
        <div className="hero-meta">
          <span>Portfólio / 2026</span>
          <span>{siteConfig.location}</span>
        </div>
        <div className="hero-content">
          <p className="hero-kicker"><span /> Design, tecnologia e experiências digitais</p>
          <h1>Ideias com forma.<br /><span>Soluções que funcionam.</span></h1>
          <div className="hero-bottom">
            <p>Designer multidisciplinar e profissional de tecnologia criando produtos, interfaces, identidades e experiências digitais.</p>
            <div className="hero-actions">
              <Link href="/projetos" className="button button-primary">Ver projetos <ArrowRight /></Link>
              <Link href="/sobre" className="button button-secondary">Sobre mim</Link>
            </div>
          </div>
        </div>
        <div className="hero-marquee" aria-hidden="true">
          <span>UI/UX</span><i>•</i><span>WEB</span><i>•</i><span>BRANDING</span><i>•</i><span>DESENVOLVIMENTO</span><i>•</i><span>MULTIMÍDIA</span>
        </div>
      </section>

      <section className="section container" id="projetos-destaque">
        <SectionHeader eyebrow="Projetos / 01" title="Trabalhos selecionados" description="Uma seleção de produtos, sistemas, identidades e narrativas que conectam pensamento visual e execução técnica." />
        {featuredProject ? <div className="featured-grid"><ProjectCard project={featuredProject} /></div> : null}
        {otherProjects.length ? <div className="projects-grid home-projects-grid">
          {otherProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div> : null}
      </section>

      <section className="section expertise-section">
        <div className="container">
          <SectionHeader eyebrow="Atuação / 02" title="Entre o visual e o funcional" description="Uma prática multidisciplinar para pensar a experiência inteira — da ideia à implementação." />
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
            <p>Sou estudante de Produção Multimídia e profissional de tecnologia. Trabalho na interseção entre design e desenvolvimento, criando de identidades visuais a interfaces, aplicações web e experiências digitais.</p>
            <p>Gosto de entender o problema por inteiro e participar tanto das decisões de produto quanto da execução.</p>
            <Link href="/sobre" className="text-link">Conheça minha trajetória <ArrowRight /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
