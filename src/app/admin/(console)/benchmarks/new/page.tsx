import { BenchmarkForm } from "@/components/admin/BenchmarkForm";
import { requireAdmin } from "@/lib/permissions";

export default async function NewBenchmarkPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight">New benchmark</h1>
      <div className="mt-6">
        <BenchmarkForm />
      </div>
    </div>
  );
}
