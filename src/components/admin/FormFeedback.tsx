"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";

export function SavedBanner({ message = "Saved successfully." }: { message?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const saved = searchParams.get("saved") === "1";

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => {
      router.replace(pathname, { scroll: false });
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [saved, pathname, router]);

  if (!saved) return null;

  return (
    <div
      role="status"
      className="rounded-md border border-accent/30 bg-accent-soft px-4 py-3 text-sm font-medium text-accent-deep"
    >
      {message}
    </div>
  );
}

export function SubmitButton({
  idleLabel,
  pendingLabel = "Saving…",
}: {
  idleLabel: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
