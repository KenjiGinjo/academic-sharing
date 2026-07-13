import { LoginForm } from "@/components/admin/LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user?.id) redirect("/admin");

  const params = await searchParams;

  return (
    <div className="mx-auto max-w-md rounded-lg border border-border bg-surface p-8 shadow-sm">
      <h1 className="text-2xl font-medium tracking-tight">Admin login</h1>
      <p className="mt-2 text-sm text-muted">
        Admins manage authors. Authors sign in here to publish their own posts.
      </p>
      <LoginForm error={Boolean(params.error)} />
      <p className="mt-4 text-xs text-muted">
        Demo admin: admin@academic.local / admin123
        <br />
        Demo author: avery@academic.local / author123
      </p>
    </div>
  );
}
