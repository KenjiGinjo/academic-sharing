import Link from "next/link";
import { deleteBlogAction } from "@/app/admin/actions";
import { authorScope, requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogsPage() {
  const session = await requireUser();
  const blogs = await prisma.post.findMany({
    where: { type: "BLOG", ...authorScope(session) },
    include: { author: true },
    orderBy: [{ updatedAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Blogs</h1>
          <p className="mt-1 text-sm text-muted">
            {session.user.role === "ADMIN"
              ? "All blog posts."
              : "Your blog posts only."}
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="rounded bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-deep"
        >
          New blog
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-background text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{blog.title}</div>
                  <div className="text-xs text-muted">/{blog.slug}</div>
                </td>
                <td className="px-4 py-3 text-muted">
                  {blog.author?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      blog.published ? "text-accent-deep" : "text-muted"
                    }
                  >
                    {blog.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/blogs/${blog.id}`}
                      className="text-accent-deep hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={deleteBlogAction}>
                      <input type="hidden" name="id" value={blog.id} />
                      <button type="submit" className="text-red-700 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {!blogs.length ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  No blogs yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
