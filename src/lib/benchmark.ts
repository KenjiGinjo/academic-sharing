import { slugify } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export type RankedEntry = {
  name: string;
  score: number;
  sortOrder: number;
  rank: number;
  barPercent: number;
};

export async function listPublishedBenchmarks() {
  return prisma.benchmark.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { slug: true, name: true },
  });
}

export async function getPublishedBenchmark(slug: string) {
  const benchmark = await prisma.benchmark.findFirst({
    where: { slug, published: true },
    include: { entries: true },
  });
  if (!benchmark) return null;
  return { ...benchmark, ranked: rankEntries(benchmark.entries) };
}

export function rankEntries(
  entries: { name: string; score: number; sortOrder: number }[],
): RankedEntry[] {
  const sorted = [...entries].sort(
    (a, b) => b.score - a.score || a.sortOrder - b.sortOrder,
  );
  const max = sorted.reduce((highest, entry) => Math.max(highest, entry.score), 0);

  return sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1,
    barPercent: max > 0 && entry.score > 0 ? (entry.score / max) * 100 : 0,
  }));
}

export function formatScore(score: number) {
  if (!Number.isFinite(score)) return "";
  return String(Math.round(score * 10000) / 10000);
}

export async function ensureUniqueBenchmarkSlug(base: string, excludeId?: string) {
  const root = slugify(base) || "benchmark";
  let candidate = root;
  let n = 2;
  while (true) {
    const existing = await prisma.benchmark.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${root}-${n++}`;
  }
}
