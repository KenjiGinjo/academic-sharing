"use client";

import type { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { MantineProvider } from "@mantine/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { expandHardBreaks, parseStoredContent } from "@/lib/blocks";

export function ContentBody({ content }: { content: string }) {
  const parsed = parseStoredContent(content);
  const initialContent = parsed ? expandHardBreaks(parsed) : undefined;

  const editor = useCreateBlockNote({
    initialContent: initialContent as PartialBlock[] | undefined,
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
