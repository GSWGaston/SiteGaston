import Link from "next/link";
import { BrandSymbol } from "@/components/brand-logo";
import type { AdminSession } from "@/lib/auth";

export function AdminHeader({ user }: { user: AdminSession }) {
  return (
    <header className="admin-header">
      <Link className="admin-brand" href="/admin"><BrandSymbol /><div>Portfólio<strong>Admin</strong></div></Link>
      <nav aria-label="Navegação administrativa">
        <Link href="/" target="_blank">Ver site ↗</Link>
        <span>{user.name ?? user.username ?? user.email}</span>
        <form action="/api/auth/signout" method="post"><button type="submit">Sair</button></form>
      </nav>
    </header>
  );
}
