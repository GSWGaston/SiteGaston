import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link href="/" className="brand"><span className="brand-mark">MG</span><span>Matheus Gaston</span></Link>
        <p>Design + Tecnologia + Produto + Multimídia</p>
        <p>© {new Date().getFullYear()} — Porto Alegre, RS</p>
      </div>
    </footer>
  );
}
