import { isBlockNoteJson } from "@/lib/blocks";

const ENGLISH_WPM = 200;
const CJK_CPM = 300;

export function readingMinutesFromStored(...parts: (string | null | undefined)[]) {
  const text = parts.map((part) => storedToPlainText(part)).join(" ");
  return minutesFromPlainText(text);
}

export function formatReadingTime(minutes: number) {
  const n = Math.max(1, minutes);
  return `${n} min read`;
}

function minutesFromPlainText(text: string) {
  const compact = text.replace(/\s+/g, " ").trim();
  if (!compact) return 1;

  const cjk = compact.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const rest = compact.replace(/[\u3400-\u9fff]/g, " ").trim();
  const words = rest ? rest.split(/\s+/).length : 0;
  const minutes = words / ENGLISH_WPM + cjk / CJK_CPM;
  return Math.max(1, Math.ceil(minutes));
}

function storedToPlainText(raw?: string | null) {
  if (!raw?.trim()) return "";
  if (isBlockNoteJson(raw)) {
    try {
      return blocksToPlainText(JSON.parse(raw.trim()));
    } catch {
      return stripMarkup(raw);
    }
  }
  return stripMarkup(raw);
}

function blocksToPlainText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map(blocksToPlainText).join(" ");
  }
  if (typeof value !== "object") return "";

  const node = value as {
    text?: unknown;
    content?: unknown;
    children?: unknown;
  };
  const text = typeof node.text === "string" ? node.text : "";
  return [text, blocksToPlainText(node.content), blocksToPlainText(node.children)]
    .filter(Boolean)
    .join(" ");
}

function stripMarkup(raw: string) {
  return raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_\-]+/g, " ");
}
