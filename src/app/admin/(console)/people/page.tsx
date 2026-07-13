import Link from "next/link";
import { deleteAuthorAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function AdminAuthorsPage() {
  await requireAdmin();

  const authors = await prisma.person.findMany({
    include: { user: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Authors</h1>
          <p className="mt-1 text-sm text-muted">
            Fixed writers only. Create profile + login so they can publish.
          </p>
        </div>
        <Link
          href="/admin/people/new"
          className="rounded bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-deep"
        >
          Add author
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-background text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Login</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author) => (
              <tr
                key={author.id}
                className="border-b border-border last:border-0 hover:bg-accent-soft/30"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/people/${author.id}`}
                    className="block font-medium text-foreground hover:text-accent-deep"
                  >
                    {author.name}
                  </Link>
                  <div className="text-xs text-muted">{author.role}</div>
                </td>
                <td className="px-4 py-3 text-muted">
                  {author.user?.email ?? "No login"}
                </td>
                <td className="px-4 py-3">
                  {!author.user ? (
                    <span className="text-amber-700">Missing login</span>
                  ) : author.user.active ? (
                    <span className="text-accent-deep">Active</span>
                  ) : (
                    <span className="text-muted">Disabled</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/people/${author.id}`}
                      className="font-medium text-accent-deep hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={deleteAuthorAction}>
                      <input type="hidden" name="id" value={author.id} />
                      <button
                        type="submit"
                        className="text-red-700 hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {!authors.length ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  No authors yet. Add fixed writers so they can log in and publish.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
