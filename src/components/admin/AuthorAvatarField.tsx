"use client";

import { useRef, useState } from "react";

type AuthorAvatarFieldProps = {
  initialUrl?: string | null;
};

export function AuthorAvatarField({ initialUrl }: AuthorAvatarFieldProps) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFileChange(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Upload failed");
      }
      const data = (await res.json()) as { url: string };
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm text-muted">Avatar</span>
      <input type="hidden" name="avatarUrl" value={url} />
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-soft text-sm font-semibold text-accent-deep">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span aria-hidden>?</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer rounded border border-border bg-background px-3 py-1.5 text-sm hover:bg-surface">
            {uploading ? "Uploading…" : "Upload image"}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => void onFileChange(e.target.files?.[0])}
            />
          </label>
          {url ? (
            <button
              type="button"
              className="rounded border border-border px-3 py-1.5 text-sm text-muted hover:text-foreground"
              onClick={() => setUrl("")}
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
