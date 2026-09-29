"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import {
  deleteProjectAction,
  duplicateProjectAction,
  reorderProjectsAction,
  setProjectStatusAction,
} from "@/app/admin/actions";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import type { Project, ProjectPublicationStatus } from "@/types/project";

type SortableProjectListProps = {
  databaseReady: boolean;
  projects: Project[];
};

const statusLabels: Record<ProjectPublicationStatus, string> = {
  draft: "Rascunho",
  published: "Publicado",
  hidden: "Oculto",
};

const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

function getPublicationStatus(project: Project): ProjectPublicationStatus {
  return project.publicationStatus ?? (project.published === false ? "draft" : "published");
}

function moveProject(projectIds: string[], draggedId: string, targetId: string) {
  const from = projectIds.indexOf(draggedId);
  const to = projectIds.indexOf(targetId);
  if (from < 0 || to < 0 || from === to) return projectIds;
  const next = [...projectIds];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
}

export function SortableProjectList({ databaseReady, projects }: SortableProjectListProps) {
  const [projectIds, setProjectIds] = useState(() => projects.map((project) => project.id));
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const originalOrder = useRef<string[]>(projectIds);
  const currentOrder = useRef<string[]>(projectIds);
  const dropCommitted = useRef(false);
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const orderedProjects = projectIds.map((id) => projectsById.get(id)).filter((project): project is Project => Boolean(project));

  function startDragging(projectId: string) {
    originalOrder.current = projectIds;
    currentOrder.current = projectIds;
    dropCommitted.current = false;
    setDraggedId(projectId);
    setMessage(null);
  }

  function dragOver(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    setProjectIds((current) => {
      const next = moveProject(current, draggedId, targetId);
      currentOrder.current = next;
      return next;
    });
  }

  function saveOrder() {
    if (!draggedId) return;
    dropCommitted.current = true;
    setDraggedId(null);
    if (currentOrder.current.every((id, index) => id === originalOrder.current[index])) return;

    startTransition(async () => {
      try {
        const result = await reorderProjectsAction(currentOrder.current);
        if (result.error) {
          setProjectIds(originalOrder.current);
          currentOrder.current = originalOrder.current;
          setMessage(result.error);
          return;
        }
        setMessage("Ordem salva. O primeiro projeto agora é o destaque.");
      } catch {
        setProjectIds(originalOrder.current);
        currentOrder.current = originalOrder.current;
        setMessage("Não foi possível salvar a nova ordem.");
      }
    });
  }

  function finishDragging() {
    if (!dropCommitted.current) {
      setProjectIds(originalOrder.current);
      currentOrder.current = originalOrder.current;
    }
    setDraggedId(null);
  }

  return <>
    <div className="admin-sort-instructions">
      <p>{databaseReady ? "Arraste os projetos para mudar a ordem. O primeiro da lista é sempre o destaque do site." : "Conecte o banco para alterar a ordem dos projetos."}</p>
      <span aria-live="polite">{isPending ? "Salvando ordem…" : message}</span>
    </div>
    <div className={`admin-project-list${isPending ? " is-saving" : ""}`}>
      {orderedProjects.map((project, index) => {
        const status = getPublicationStatus(project);
        const draggable = databaseReady && !isPending;
        return <article
          className={draggedId === project.id ? "is-dragging" : undefined}
          draggable={draggable}
          key={project.id}
          onDragEnd={finishDragging}
          onDragEnter={() => { if (draggable) dragOver(project.id); }}
          onDragOver={(event) => { if (draggable) event.preventDefault(); }}
          onDragStart={(event) => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", project.id); startDragging(project.id); }}
          onDrop={(event) => { event.preventDefault(); saveOrder(); }}
        >
          <span className="admin-drag-handle" aria-hidden="true" title="Arraste para reordenar">⠿</span>
          <div className="admin-project-thumb" style={{ backgroundColor: project.accent }}>{project.thumbnail || project.cover ? <Image src={project.thumbnail ?? project.cover ?? ""} alt="" fill sizes="64px" /> : <span>{project.index}</span>}</div>
          <div className="admin-project-info"><div><h2>{project.title}</h2>{index === 0 ? <span className="admin-featured">Destaque</span> : null}</div><p>/{project.slug} · {project.categories.join(" · ")}</p>{project.updatedAt ? <time dateTime={project.updatedAt}>Atualizado em {dateFormat.format(new Date(project.updatedAt))}</time> : null}</div>
          <span className={`admin-status ${status}`}>{databaseReady ? statusLabels[status] : "Dados locais"}</span>
          <div className="admin-project-actions">{status === "published" ? <Link href={`/projetos/${project.slug}`} target="_blank">Visualizar</Link> : null}{databaseReady ? <Link href={`/admin/${project.id}/editar`}>Editar</Link> : null}{databaseReady ? <details><summary aria-label={`Mais ações para ${project.title}`}>•••</summary><div className="admin-action-menu"><form action={duplicateProjectAction.bind(null, project.id)}><button type="submit">Duplicar</button></form>{status !== "published" ? <form action={setProjectStatusAction.bind(null, project.id, "published")}><button type="submit">Publicar</button></form> : <form action={setProjectStatusAction.bind(null, project.id, "draft")}><button type="submit">Tornar rascunho</button></form>}{status !== "hidden" ? <form action={setProjectStatusAction.bind(null, project.id, "hidden")}><button type="submit">Ocultar</button></form> : null}<DeleteProjectButton title={project.title} action={deleteProjectAction.bind(null, project.id)} /></div></details> : null}</div>
        </article>;
      })}
    </div>
  </>;
}
