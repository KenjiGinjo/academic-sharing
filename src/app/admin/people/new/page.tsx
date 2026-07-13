import { AuthorForm } from "@/components/admin/AuthorForm";
import { requireAdmin } from "@/lib/permissions";

export default async function NewAuthorPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight">Add author</h1>
      <p className="mt-1 text-sm text-muted">
        Creates a public People profile and a login for the backend.
      </p>
      <div className="mt-6">
        <AuthorForm />
      </div>
    </div>
  );
}
