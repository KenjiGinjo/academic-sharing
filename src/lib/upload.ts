import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5MB
export const VIDEO_MAX_BYTES = 50 * 1024 * 1024; // 50MB

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

export function getUploadDir() {
  return (
    process.env.UPLOAD_DIR?.trim() ||
    path.join(process.cwd(), "upload")
  );
}

export function isAllowedMime(mime: string) {
  return IMAGE_TYPES.has(mime) || VIDEO_TYPES.has(mime);
}

export function maxBytesForMime(mime: string) {
  if (VIDEO_TYPES.has(mime)) return VIDEO_MAX_BYTES;
  return IMAGE_MAX_BYTES;
}

export function publicUrlForFilename(filename: string) {
  return `/upload/${filename}`;
}

export function resolveUploadPath(filename: string) {
  const base = path.resolve(getUploadDir());
  const resolved = path.resolve(base, filename);
  if (!resolved.startsWith(base + path.sep) && resolved !== base) {
    return null;
  }
  return resolved;
}

export async function saveUploadFile(file: File) {
  const mime = file.type || "application/octet-stream";
  if (!isAllowedMime(mime)) {
    throw new UploadError("Unsupported file type", 415);
  }

  const maxBytes = maxBytesForMime(mime);
  if (file.size > maxBytes) {
    const limitMb = Math.round(maxBytes / (1024 * 1024));
    throw new UploadError(`File too large (max ${limitMb}MB)`, 413);
  }

  const ext = EXT_BY_MIME[mime] ?? path.extname(file.name).toLowerCase();
  const filename = `${randomUUID()}${ext}`;
  const dir = getUploadDir();
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return {
    filename,
    url: publicUrlForFilename(filename),
    mime,
    size: file.size,
  };
}

export class UploadError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "UploadError";
    this.status = status;
  }
}
