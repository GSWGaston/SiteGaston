import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="not-found container">
      <p className="eyebrow">Erro / 404</p>
      <h1>Projeto não encontrado.</h1>
      <p>O endereço pode ter mudado ou este projeto ainda não foi publicado.</p>
      <Link className="button button-primary" href="/projetos">Ver todos os projetos</Link>
    </div>
  );
}
