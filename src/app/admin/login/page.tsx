import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandSignature } from "@/components/brand-logo";
import { getAdminSession, isAuthConfigured } from "@/lib/auth";

export const metadata: Metadata = { title: "Acesso administrativo", robots: { index: false, follow: false } };

const messages: Record<string, string> = {
  setup: "A autenticação ainda precisa ser configurada na Vercel.",
  cancelled: "O acesso foi cancelado.",
  invalid: "A tentativa de acesso expirou ou é inválida.",
  exchange: "Não foi possível concluir o login com a Vercel.",
  forbidden: "Esta conta Vercel não tem permissão para acessar o painel.",
  token: "A identidade retornada pela Vercel não pôde ser validada.",
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session = await getAdminSession();
  if (session) redirect("/admin");
  const { error } = await searchParams;
  const configured = isAuthConfigured();

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <Link href="/" className="admin-login-logo" aria-label="Gaston Design — página inicial"><BrandSignature /></Link>
        <p className="admin-kicker">Área restrita</p>
        <h1>Gerencie seu portfólio.</h1>
        <p>Adicione projetos, organize cases e publique novas imagens usando sua conta Vercel.</p>
        {error ? <p className="admin-error" role="alert">{messages[error] ?? "Não foi possível entrar."}</p> : null}
        {configured ? <Link className="admin-vercel-button" href="/api/auth/authorize"><span>▲</span> Entrar com Vercel</Link> : <div className="admin-setup-note"><strong>Configuração pendente</strong><p>Adicione as credenciais do Sign in with Vercel e o e-mail administrador às variáveis de ambiente.</p></div>}
        <Link className="admin-back-link" href="/">← Voltar ao portfólio</Link>
      </div>
    </div>
  );
}
