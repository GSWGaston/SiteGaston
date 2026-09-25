import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found container">
      <p className="eyebrow">Erro / 404</p>
      <h1>Página não encontrada.</h1>
      <p>O endereço informado não existe ou foi movido.</p>
      <Link className="button button-primary" href="/">Voltar ao início</Link>
    </div>
  );
}
