import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { siteConfig } from "@/data/site";

export function ContactSection() {
  return (
    <section className="contact-section" id="contato">
      <div className="container">
        <p className="eyebrow">Contato / 05</p>
        <div className="contact-heading">
          <h2>Tem uma ideia?<br /><span>Vamos tirá-la do papel.</span></h2>
          <p>Estou aberto a oportunidades, colaborações e projetos que aproximem design, tecnologia e boas experiências.</p>
        </div>
        <div className="contact-links">
          {siteConfig.socials.map((social) => (
            <Link href={social.href} key={social.label} target={social.href.startsWith("http") ? "_blank" : undefined} rel={social.href.startsWith("http") ? "noreferrer" : undefined}>
              <span>{social.label}</span>
              <span className="placeholder-label">{social.placeholder ? "link placeholder" : ""}</span>
              <ArrowUpRight />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
