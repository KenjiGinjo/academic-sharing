import { redirect } from "next/navigation";
import { AuthorForm } from "@/components/admin/AuthorForm";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function MyProfilePage() {
  const session = await requireUser();
  if (!session.user.personId) {
    redirect("/admin");
  }

  const person = await prisma.person.findUnique({
    where: { id: session.user.personId },
    include: {
      user: true,
      interests: { orderBy: { sortOrder: "asc" } },
      publications: { orderBy: { sortOrder: "asc" } },
      competitions: { orderBy: { sortOrder: "asc" } },
      applications: { orderBy: { sortOrder: "asc" } },
      patents: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!person) redirect("/admin");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">My profile</h1>
          <p className="mt-1 text-sm text-muted">
            Update your public academic page and directory card.
          </p>
        </div>
        {person.profileEnabled ? (
          <a
            href={`/people/${person.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-accent-deep hover:underline"
          >
            View personal site →
          </a>
        ) : null}
      </div>
      <div className="mt-6">
        <AuthorForm person={person} mode="self" />
      </div>
    </div>
  );
}
