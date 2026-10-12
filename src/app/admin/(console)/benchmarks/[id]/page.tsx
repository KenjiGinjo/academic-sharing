import Link from "next/link";
import { notFound } from "next/navigation";
import { BenchmarkForm } from "@/components/admin/BenchmarkForm";
import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function EditBenchmarkPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const benchmark = await prisma.benchmark.findUnique({
    where: { id },
    include: { entries: { orderBy: { sortOrder: "asc" } } },
  });
  if (!benchmark) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-medium tracking-tight">Edit benchmark</h1>
        {benchmark.published ? (
          <Link
            href={`/benchmark/${benchmark.slug}`}
            className="text-sm text-accent-deep hover:underline"
          >
            View on site
          </Link>
        ) : null}
      </div>
      <div className="mt-6">
        <BenchmarkForm
          benchmark={{
            id: benchmark.id,
            name: benchmark.name,
            slug: benchmark.slug,
            description: benchmark.description,
            info: benchmark.info,
            published: benchmark.published,
            sortOrder: benchmark.sortOrder,
            entries: benchmark.entries.map((entry) => ({
              name: entry.name,
              score: entry.score,
            })),
          }}
        />
      </div>
    </div>
  );
}
