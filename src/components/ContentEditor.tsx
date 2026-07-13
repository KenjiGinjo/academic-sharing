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

  return (
    <div className="block text-sm">
      {label ? <span className="mb-1 block text-muted">{label}</span> : null}
      <input type="hidden" name={name} value={value} />
      <MantineProvider forceColorScheme="light">
        <div
          className="overflow-hidden rounded border border-border bg-white"
          style={{ minHeight }}
        >
          <BlockNoteView
            editor={editor}
            theme="light"
            onChange={() => {
              setValue(serializeBlocks(editor.document as PartialBlock[]));
            }}
          />
        </div>
      </MantineProvider>
    </div>
  );
}
