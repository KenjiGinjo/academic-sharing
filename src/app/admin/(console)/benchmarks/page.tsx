import Link from "next/link";
import { deleteBenchmarkAction } from "@/app/admin/actions";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function AdminBenchmarksPage() {
  await requireAdmin();

  const benchmarks = await prisma.benchmark.findMany({
    include: { _count: { select: { entries: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Benchmarks</h1>
          <p className="mt-1 text-sm text-muted">
            Name, description, results, and a Markdown note.
          </p>
        </div>
        <Link
          href="/admin/benchmarks/new"
          className="rounded bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-deep"
        >
          New benchmark
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-background text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Results</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((benchmark) => (
              <tr
                key={benchmark.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="font-medium">{benchmark.name}</div>
                  <div className="text-xs text-muted">/benchmark/{benchmark.slug}</div>
                </td>
                <td className="px-4 py-3 text-muted">{benchmark._count.entries}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      benchmark.published ? "text-accent-deep" : "text-muted"
                    }
                  >
                    {benchmark.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/benchmarks/${benchmark.id}`}
                      className="text-accent-deep hover:underline"
                    >
                      Edit
                    </Link>
                    <ConfirmDeleteButton
                      action={deleteBenchmarkAction}
                      id={benchmark.id}
                      message={`Delete benchmark “${benchmark.name}”? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {!benchmarks.length ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  No benchmarks yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
