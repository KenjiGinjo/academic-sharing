"use client";

import { useFormStatus } from "react-dom";

export function AdminSubmitButton({
  label,
  pendingLabel = "Saving…",
}: {
  label: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-deep disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
