import type { Metadata } from "next";
import { SectionHeader } from "@/components/section-header";
import { skillGroups, softSkills, toolGroups } from "@/data/site";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a trajetória, experiência e competências de Matheus Gaston.",
  alternates: { canonical: "/sobre" },
};

export default function AboutPage() {
  return (
    <div className="page-shell about-page">
      <header className="about-hero container">
        <p className="eyebrow">Sobre / Perfil</p>
        <h1>Olhar criativo.<br /><span>Base técnica.</span></h1>
        <div className="about-intro">
          <p>Sou Matheus Gaston, designer multidisciplinar, estudante de Produção Multimídia no Senac RS e profissional de tecnologia em Porto Alegre.</p>
          <p>Minha prática acontece onde design, produto, desenvolvimento e multimídia se encontram. Gosto de transformar problemas em soluções claras — pensando a experiência e também entendendo o que existe por trás dela.</p>
        </div>
      </header>

      <section className="section container">
        <SectionHeader eyebrow="Trajetória / 01" title="Do suporte à criação de produtos" />
        <div className="trajectory-grid">
          <p className="large-copy">A curiosidade por como as coisas funcionam sempre guiou meu caminho.</p>
          <div>
            <p>Minha experiência em suporte técnico e infraestrutura construiu uma base prática de diagnóstico, autonomia e resolução de problemas. A Produção Multimídia ampliou esse repertório para interfaces, identidades, audiovisual e experiências digitais.</p>
            <p>Hoje, levo a mesma disposição de investigar sistemas para o processo criativo: entender contexto, organizar informação, prototipar e materializar soluções.</p>
          </div>
        </div>
      </section>

      <section className="section skills-section">
        <div className="container">
          <SectionHeader eyebrow="Competências / 02" title="Áreas e conhecimentos" description="Repertório construído entre estudo, prática profissional e projetos autorais." />
          <div className="skill-groups">
            {skillGroups.map((group) => <article key={group.title}><h3>{group.title}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}
          </div>
        </div>
      </section>

      <section className="section container">
        <SectionHeader eyebrow="Experiência / 03" title="Tecnologia aplicada no dia a dia" />
        <article className="experience-card">
          <div><p className="experience-period">Experiência atual</p><h3>Facta Empréstimos / Facta Promotora</h3><p>Suporte técnico e infraestrutura de TI</p></div>
          <div><p>Atuação com configuração de Windows e Ubuntu, manutenção e diagnóstico de hardware, suporte a usuários, inventário, BIOS/UEFI, acesso remoto, automações e infraestrutura.</p><ul className="tag-list"><li>FOG Project</li><li>PXE / iPXE</li><li>Linux</li><li>Hardware</li><li>Scripts</li><li>Troubleshooting</li></ul></div>
        </article>
      </section>

      <section className="section tools-section">
        <div className="container">
          <SectionHeader eyebrow="Ferramentas / 04" title="O que uso para criar e construir" />
          <div className="tools-grid">
            {toolGroups.map((group) => <article key={group.title}><h3>{group.title}</h3>{group.items.map((item) => <p key={item}>{item}</p>)}</article>)}
          </div>
          <div className="soft-skills"><h3>Como trabalho</h3><ul>{softSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul></div>
        </div>
      </section>
    </div>
  );
}
