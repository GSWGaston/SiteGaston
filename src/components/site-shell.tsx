"use client";

import { usePathname } from "next/navigation";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <main id="conteudo">{children}</main>;

  return <><Header /><main id="conteudo">{children}</main><ContactSection /><Footer /></>;
}
