"use client";
import { useRef } from "react";
export function DeleteProjectButton({ action, title }: { action: () => Promise<void>; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return <><button className="admin-danger-link" onClick={() => dialogRef.current?.showModal()} type="button">Excluir</button><dialog className="admin-confirm-dialog" ref={dialogRef}><div><p className="admin-kicker">Confirmação</p><h2>Excluir {title}?</h2><p>Essa ação removerá o projeto do portfólio. Os arquivos remotos serão preservados.</p><div className="admin-dialog-actions"><button className="admin-secondary-button" onClick={() => dialogRef.current?.close()} type="button">Cancelar</button><form action={action}><button className="admin-danger-button" type="submit">Excluir projeto</button></form></div></div></dialog></>;
}
