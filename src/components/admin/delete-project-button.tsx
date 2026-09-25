"use client";

export function DeleteProjectButton({ action, title }: { action: () => Promise<void>; title: string }) {
  return (
    <form action={action} onSubmit={(event) => {
      if (!window.confirm(`Excluir “${title}” permanentemente?`)) event.preventDefault();
    }}>
      <button className="admin-danger-button" type="submit">Excluir projeto</button>
    </form>
  );
}
