import { LoginForm } from "@/components/admin/LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user?.id) redirect("/admin");

  return (
    <div className="flex min-h-full items-center justify-center bg-[#f4f5f3] px-5 py-16">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-8">
        <h1 className="text-2xl font-medium tracking-tight">Admin login</h1>
        <p className="mt-2 text-sm text-muted">Sign in to manage content.</p>
        <LoginForm />
        <p className="mt-4 text-xs text-muted">
          admin@academic.local / admin123
        </p>
      </div>
    </div>
  );
}
