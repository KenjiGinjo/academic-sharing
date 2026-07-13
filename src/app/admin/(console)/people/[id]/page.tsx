import { notFound } from "next/navigation";
import { AuthorForm } from "@/components/admin/AuthorForm";
import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function EditAuthorPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const person = await prisma.person.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!person) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight">Edit author</h1>
      <div className="mt-6">
        <AuthorForm person={person} />
      </div>
    </div>
  );
}
