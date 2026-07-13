"use client";

import { useEffect, useState } from "react";
import type { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { MantineProvider } from "@mantine/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {
  EMPTY_CONTENT_JSON,
  parseStoredContent,
  serializeBlocks,
} from "@/lib/blocks";

type ContentEditorProps = {
  name: string;
  initialContent?: string;
  label?: string;
  minHeight?: number;
};

async function uploadFile(file: File) {
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
  return data.url;
}

function ExpandIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

export function ContentEditor({
  name,
  initialContent,
  label = "Content",
  minHeight = 280,
}: ContentEditorProps) {
  const [value, setValue] = useState(() => {
    if (!initialContent?.trim()) return EMPTY_CONTENT_JSON;
    if (initialContent.trim().startsWith("[")) return initialContent;
    // legacy markdown will be converted after editor mounts
    return EMPTY_CONTENT_JSON;
  });
  const [fullscreen, setFullscreen] = useState(false);

  const initialBlocks = parseStoredContent(initialContent) as
    | PartialBlock[]
    | undefined;

  const editor = useCreateBlockNote({
    initialContent: initialBlocks,
    uploadFile,
  });

  useEffect(() => {
    setValue(serializeBlocks(editor.document as PartialBlock[]));
  }, [editor]);

  useEffect(() => {
    if (!fullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [fullscreen]);

  return (
    <div className="block text-sm">
      {!fullscreen ? (
        <div className="mb-1 flex items-center justify-between gap-2">
          {label ? <span className="text-muted">{label}</span> : <span />}
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-2 py-1 text-xs text-muted hover:text-foreground"
          >
            <ExpandIcon />
            Fullscreen
          </button>
        </div>
      ) : null}
      <input type="hidden" name={name} value={value} />
      <MantineProvider forceColorScheme="light">
        <div
          className={
            fullscreen
              ? "fixed inset-0 z-50 flex flex-col bg-white"
              : "overflow-hidden rounded border border-border bg-white"
          }
          style={fullscreen ? undefined : { minHeight }}
        >
          {fullscreen ? (
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2">
              <span className="text-sm font-medium text-foreground">
                {label || "Content"}
              </span>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-2.5 py-1.5 text-xs text-muted hover:text-foreground"
              >
                <CollapseIcon />
                Exit fullscreen
                <kbd className="ml-1 rounded border border-border px-1 text-[10px] text-muted">
                  Esc
                </kbd>
              </button>
            </div>
          ) : null}
          <div
            className={
              fullscreen
                ? "min-h-0 flex-1 overflow-y-auto px-4 py-3 md:px-10"
                : undefined
            }
          >
            <div
              className={
                fullscreen ? "mx-auto max-w-3xl" : undefined
              }
              style={fullscreen ? { minHeight: "100%" } : undefined}
            >
              <BlockNoteView
                editor={editor}
                theme="light"
                onChange={() => {
                  setValue(serializeBlocks(editor.document as PartialBlock[]));
                }}
              />
            </div>
          </div>
        </div>
      </MantineProvider>
    </div>
  );
}
