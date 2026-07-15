import { notFound } from "next/navigation";
import { BlogForm } from "@/components/admin/BlogForm";
import { assertCanEditPost, isAdmin, requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPage({ params }: Props) {
  const session = await requireUser();
  const { id } = await params;

  await assertCanEditPost(session, id);

  const blog = await prisma.post.findFirst({ where: { id, type: "BLOG" } });
  if (!blog) notFound();

  const people = isAdmin(session)
    ? await prisma.person.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      })
    : [];

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight">Edit blog</h1>
      <div className="mt-6">
        <BlogForm
          people={people}
          canAssignAuthor={isAdmin(session)}
          post={{
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            content: blog.content,
            tags: blog.tags,
            authorId: blog.authorId,
            published: blog.published,
            featured: blog.featured,
            publishedAt: blog.publishedAt,
          }}
        />
      </div>
    </div>
  );
}
