import type { PartialBlock } from "@blocknote/core";

export const EMPTY_CONTENT_JSON = JSON.stringify([
  { type: "paragraph", content: "" },
] satisfies PartialBlock[]);

export function isBlockNoteJson(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("[")) return false;
  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed);
  } catch {
    return false;
  }
}

/** Convert stored DB string → BlockNote initialContent. Supports legacy Markdown. */
export function parseStoredContent(raw?: string | null): PartialBlock[] | undefined {
  if (!raw?.trim()) return undefined;

  if (isBlockNoteJson(raw)) {
    const parsed = JSON.parse(raw.trim()) as PartialBlock[];
    return parsed.length > 0 ? parsed : undefined;
  }

  // Legacy Markdown → simple blocks (good enough for one-time migration display)
  return markdownToPartialBlocks(raw);
}

export function serializeBlocks(blocks: PartialBlock[]) {
  return JSON.stringify(blocks);
}

/** A hard break is a "\n" inside paragraph text. Split those into paragraphs. */
export function expandHardBreaks(blocks: PartialBlock[]): PartialBlock[] {
  return blocks.flatMap((block): PartialBlock[] => {
    const children = block.children?.length
      ? expandHardBreaks(block.children)
      : block.children;
    if (block.type !== "paragraph" || !Array.isArray(block.content)) {
      return [{ ...block, children }];
    }

    const segments: typeof block.content[] = [[]];
    let changed = false;
    for (const node of block.content) {
      if (!node || typeof node !== "object" || !("text" in node) || typeof node.text !== "string" || !node.text.includes("\n")) {
        segments.at(-1)!.push(node);
        continue;
      }
      changed = true;
      node.text.split("\n").forEach((part, index) => {
        if (index > 0) segments.push([]);
        if (part) segments.at(-1)!.push({ ...node, text: part });
      });
    }

    const kept = segments.filter((segment) => segment.length > 0);
    if (!changed || kept.length === 0) return [{ ...block, children }];
    return kept.map((content, index) => ({
      type: "paragraph" as const,
      props: block.props,
      ...(index === 0 && block.id ? { id: block.id } : {}),
      content,
      ...(index === kept.length - 1 ? { children } : {}),
    }));
  });
}

function markdownToPartialBlocks(markdown: string): PartialBlock[] | undefined {
  const chunks = markdown.replace(/\r\n/g, "\n").split(/\n{2,}/);
  const blocks: PartialBlock[] = [];

  for (const chunk of chunks) {
    const text = chunk.trim();
    if (!text) continue;

    if (text.startsWith("### ")) {
      blocks.push({
        type: "heading",
        props: { level: 3 },
        content: text.slice(4),
      });
      continue;
    }
    if (text.startsWith("## ")) {
      blocks.push({
        type: "heading",
        props: { level: 2 },
        content: text.slice(3),
      });
      continue;
    }
    if (text.startsWith("# ")) {
      blocks.push({
        type: "heading",
        props: { level: 1 },
        content: text.slice(2),
      });
      continue;
    }

    const lines = text.split("\n");
    const listLines = lines.filter(
      (line) => line.trim().startsWith("- ") || line.trim().startsWith("* "),
    );
    if (listLines.length === lines.length) {
      for (const line of listLines) {
        blocks.push({
          type: "bulletListItem",
          content: line.trim().replace(/^[-*]\s+/, ""),
        });
      }
      continue;
    }

    blocks.push({ type: "paragraph", content: text.replace(/\n/g, " ") });
  }

  return blocks.length > 0 ? blocks : undefined;
}
