"use client";

export function ConfirmDeleteButton({
  action,
  id,
  message,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  message: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(message)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-red-700 hover:underline">
        Delete
      </button>
    </form>
  );
}
