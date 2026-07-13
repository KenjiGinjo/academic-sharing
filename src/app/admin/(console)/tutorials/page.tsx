import Link from "next/link";
import { deleteTutorialAction } from "@/app/admin/actions";
import { authorScope, requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function AdminTutorialsPage() {
  const session = await requireUser();
  const tutorials = await prisma.post.findMany({
    where: { type: "TUTORIAL", ...authorScope(session) },
    include: {
      author: true,
      _count: { select: { chapters: true } },
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Tutorials</h1>
          <p className="mt-1 text-sm text-muted">
            {session.user.role === "ADMIN"
              ? "All tutorials."
              : "Your tutorials only."}
          </p>
        </div>
        <Link
          href="/admin/tutorials/new"
          className="rounded bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-deep"
        >
          New tutorial
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-background text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Chapters</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tutorials.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted">
                    {item.level} · /{item.slug}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">
                  {item.author?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted">{item._count.chapters}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      item.published ? "text-accent-deep" : "text-muted"
                    }
                  >
                    {item.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/tutorials/${item.id}`}
                      className="text-accent-deep hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={deleteTutorialAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="text-red-700 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {!tutorials.length ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No tutorials yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
