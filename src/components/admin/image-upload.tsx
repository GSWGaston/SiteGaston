"use client";

import { upload } from "@vercel/blob/client";
import { useRef, useState } from "react";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

type ImageUploadProps = { label: string; name?: string; defaultValue?: string; value?: string; onChange?: (url: string) => void; required?: boolean };

export function ImageUpload({ label, name, defaultValue = "", value, onChange, required }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalUrl, setInternalUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const url = value ?? internalUrl;
  const id = name ?? `upload-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  function setUrl(nextUrl: string) { setInternalUrl(nextUrl); onChange?.(nextUrl); }

  async function handleFile(file: File | undefined) {
    if (!file || uploading) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) { setError("Use JPG, PNG, WebP, AVIF ou GIF."); return; }
    if (file.size > MAX_IMAGE_SIZE) { setError("A imagem deve ter no máximo 8 MB."); return; }
    setUploading(true); setError("");
    try {
      const blob = await upload(`projects/${file.name}`, file, { access: "public", handleUploadUrl: "/api/admin/upload" });
      setUrl(blob.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Não foi possível enviar a imagem.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return <div className="admin-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} name={name} onChange={(event) => setUrl(event.target.value)} placeholder="URL da imagem" required={required} type="url" value={url} />
    <div className="admin-upload-row"><input ref={inputRef} accept={ACCEPTED_IMAGE_TYPES.join(",")} aria-label={`Enviar ${label}`} disabled={uploading} onChange={(event) => void handleFile(event.target.files?.[0])} type="file" /><span aria-live="polite">{uploading ? "Enviando…" : "JPG, PNG, WebP, AVIF ou GIF · máximo 8 MB"}</span></div>
    {error ? <p className="admin-error" role="alert">{error}</p> : null}
    {url ? <div className="admin-image-preview" style={{ backgroundImage: `url(${url})` }} role="img" aria-label={`Prévia de ${label}`} /> : null}
  </div>;
}
