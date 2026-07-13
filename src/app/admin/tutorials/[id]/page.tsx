import { notFound } from "next/navigation";
import { TutorialForm } from "@/components/admin/TutorialForm";
import { assertCanEditPost, isAdmin, requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function EditTutorialPage({ params }: Props) {
  const session = await requireUser();
  const { id } = await params;

  await assertCanEditPost(session, id);

  const tutorial = await prisma.post.findFirst({
    where: { id, type: "TUTORIAL" },
    include: { chapters: { orderBy: { sortOrder: "asc" } } },
  });
  if (!tutorial) notFound();

  const people = isAdmin(session)
    ? await prisma.person.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      })
    : [];

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight">Edit tutorial</h1>
      <div className="mt-6">
        <TutorialForm
          people={people}
          canAssignAuthor={isAdmin(session)}
          post={{
            id: tutorial.id,
            title: tutorial.title,
            slug: tutorial.slug,
            excerpt: tutorial.excerpt,
            level: tutorial.level ?? "Beginner",
            tags: tutorial.tags,
            authorId: tutorial.authorId,
            published: tutorial.published,
            publishedAt: tutorial.publishedAt,
            chapters: tutorial.chapters.map((chapter) => ({
              title: chapter.title,
              slug: chapter.slug,
              content: chapter.content,
            })),
          }}
        />
      </div>
    </div>
  );
}
