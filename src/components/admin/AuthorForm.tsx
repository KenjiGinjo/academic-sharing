import { saveAuthorAction } from "@/app/admin/actions";
import { AuthorAvatarField } from "@/components/admin/AuthorAvatarField";
import type { Person, User } from "@prisma/client";

type AuthorFormProps = {
  person?: Person & { user: User | null };
};

export function AuthorForm({ person }: AuthorFormProps) {
  return (
    <form
      action={saveAuthorAction}
      className="space-y-4 rounded-lg border border-border bg-surface p-6"
    >
      {person ? <input type="hidden" name="id" value={person.id} /> : null}

      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        Public profile
      </h2>
      <AuthorAvatarField initialUrl={person?.avatarUrl} />
      <Field label="Name" name="name" defaultValue={person?.name} required />
      <Field
        label="Title / role label"
        name="role"
        defaultValue={person?.role}
        required
      />
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Bio</span>
        <textarea
          name="bio"
          required
          rows={4}
          defaultValue={person?.bio}
          className="w-full rounded border border-border bg-background px-3 py-2"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Initials"
          name="initials"
          defaultValue={person?.initials}
          placeholder="Auto from name if empty"
        />
        <Field
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={String(person?.sortOrder ?? 0)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="GitHub URL" name="github" defaultValue={person?.github ?? ""} />
        <Field label="X URL" name="x" defaultValue={person?.x ?? ""} />
        <Field
          label="Website URL"
          name="website"
          defaultValue={person?.website ?? ""}
        />
      </div>

      <h2 className="pt-2 text-sm font-semibold uppercase tracking-wide text-muted">
        Login account
      </h2>
      <p className="text-xs text-muted">
        Authors use this email/password to sign in and publish their own posts.
      </p>
      <Field
        label="Email"
        name="email"
        type="email"
        defaultValue={person?.user?.email ?? ""}
        required
      />
      <Field
        label={person ? "Password (leave blank to keep)" : "Password"}
        name="password"
        type="password"
        required={!person}
        placeholder={person ? "••••••••" : "At least 6 characters"}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="active"
          defaultChecked={person?.user?.active ?? true}
        />
        <span>Account active (can log in)</span>
      </label>

      <button
        type="submit"
        className="rounded bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-deep"
      >
        Save author
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded border border-border bg-background px-3 py-2"
      />
    </label>
  );
}
