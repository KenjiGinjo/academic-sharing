"use client";

import type { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { MantineProvider } from "@mantine/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { parseStoredContent } from "@/lib/blocks";

export function ContentBody({ content }: { content: string }) {
  const initialContent = parseStoredContent(content) as
    | PartialBlock[]
    | undefined;

  const editor = useCreateBlockNote({
    initialContent,
  });

  return (
    <MantineProvider forceColorScheme="light">
      <div className="bn-reader -mx-3 bg-transparent sm:-mx-4">
        <BlockNoteView
          editor={editor}
          editable={false}
          theme="light"
          className="bg-transparent"
        />
      </div>
    </MantineProvider>
  );
}
