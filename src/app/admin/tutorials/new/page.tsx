import { redirect } from "next/navigation";
import { TutorialForm } from "@/components/admin/TutorialForm";
import { isAdmin, requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function NewTutorialPage() {
  const session = await requireUser();
  if (session.user.role === "AUTHOR" && !session.user.personId) {
    redirect("/admin");
  }

  const people = isAdmin(session)
    ? await prisma.person.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      })
    : [];

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight">New tutorial</h1>
      <div className="mt-6">
        <TutorialForm people={people} canAssignAuthor={isAdmin(session)} />
      </div>
    </div>
  );
}
