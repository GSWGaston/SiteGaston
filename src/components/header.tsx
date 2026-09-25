"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site";
import { CloseIcon, MenuIcon } from "@/components/icons";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="Matheus Gaston — página inicial">
          <span className="brand-mark">MG</span>
          <span>Matheus Gaston</span>
        </Link>

        <nav aria-label="Navegação principal" className="desktop-nav">
          {siteConfig.navigation.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("#")[0]);
            return (
              <Link className={active ? "nav-link is-active" : "nav-link"} href={item.href} key={item.label}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          className="menu-button"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div className={isOpen ? "mobile-menu is-open" : "mobile-menu"} aria-hidden={!isOpen}>
        <nav aria-label="Navegação mobile" className="container mobile-nav">
          {siteConfig.navigation.map((item, index) => (
            <Link href={item.href} key={item.label} onClick={() => setIsOpen(false)} tabIndex={isOpen ? 0 : -1}>
              <span>0{index + 1}</span>
              {item.label}
            </Link>
          ))}
          <p>{siteConfig.location}</p>
        </nav>
      </div>
    </header>
  );
}
