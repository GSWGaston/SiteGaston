"use client";

import { upload } from "@vercel/blob/client";
import { useRef, useState } from "react";

type ImageUploadProps = {
  label: string;
  name: string;
  defaultValue?: string;
};

export function ImageUpload({ label, name, defaultValue = "" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const blob = await upload(`projects/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      setUrl(blob.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Não foi possível enviar a imagem.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="admin-field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} onChange={(event) => setUrl(event.target.value)} placeholder="URL da imagem" type="url" value={url} />
      <div className="admin-upload-row">
        <input ref={inputRef} accept="image/jpeg,image/png,image/webp,image/avif,image/gif" aria-label={`Enviar ${label}`} onChange={(event) => void handleFile(event.target.files?.[0])} type="file" />
        <span>{uploading ? "Enviando…" : "JPG, PNG, WebP, AVIF ou GIF"}</span>
      </div>
      {error ? <p className="admin-error" role="alert">{error}</p> : null}
      {url ? <div className="admin-image-preview" style={{ backgroundImage: `url(${url})` }} role="img" aria-label={`Prévia de ${label}`} /> : null}
    </div>
  );
}
