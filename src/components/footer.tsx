import Link from "next/link";
import { BrandSignature } from "@/components/brand-logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link href="/" className="brand" aria-label="Gaston Design — página inicial"><BrandSignature /></Link>
        <p>UI/UX + Web + Branding</p>
        <p>© {new Date().getFullYear()} — Porto Alegre, RS</p>
      </div>
    </footer>
  );
}
