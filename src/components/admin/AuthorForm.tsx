import { Suspense } from "react";
import { saveAuthorAction, saveOwnProfileAction } from "@/app/admin/actions";
import { AcademicFields } from "@/components/admin/AcademicFields";
import { AuthorAvatarField } from "@/components/admin/AuthorAvatarField";
import { SavedBanner, SubmitButton } from "@/components/admin/FormFeedback";
import type {
  Person,
  PersonApplication,
  PersonCompetition,
  PersonInterest,
  PersonPatent,
  PersonPublication,
  User,
} from "@prisma/client";

type PersonWithAcademic = Person & {
  user: User | null;
  interests: PersonInterest[];
  publications: PersonPublication[];
  competitions: PersonCompetition[];
  applications: PersonApplication[];
  patents: PersonPatent[];
};

type AuthorFormProps = {
  person?: PersonWithAcademic;
  /** Author editing own profile — no login account section */
  mode?: "admin" | "self";
};

export function AuthorForm({ person, mode = "admin" }: AuthorFormProps) {
  const action = mode === "self" ? saveOwnProfileAction : saveAuthorAction;
  const isAdminMode = mode === "admin";

  return (
    <form
      action={action}
      className="space-y-8 rounded-lg border border-border bg-surface p-6"
    >
      <Suspense fallback={null}>
        <SavedBanner
          message={
            mode === "self"
              ? "Profile saved successfully."
              : "Author saved successfully."
          }
        />
      </Suspense>

      {person ? <input type="hidden" name="id" value={person.id} /> : null}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Public profile
        </h2>
        <AuthorAvatarField initialUrl={person?.avatarUrl} />
        <Field label="Name" name="name" defaultValue={person?.name} required />
        <Field
          label="Slug (personal site path)"
          name="slug"
          defaultValue={person?.slug}
          placeholder="auto from name if empty"
        />
        <Field
          label="Title / role label"
          name="role"
          defaultValue={person?.role}
          required
        />
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Short bio (directory card)</span>
          <textarea
            name="bio"
            required
            rows={3}
            defaultValue={person?.bio}
            className="w-full rounded border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">About (personal site biography)</span>
          <textarea
            name="about"
            rows={6}
            defaultValue={person?.about ?? ""}
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
          {isAdminMode ? (
            <Field
              label="Sort order"
              name="sortOrder"
              type="number"
              defaultValue={String(person?.sortOrder ?? 0)}
            />
          ) : null}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="profileEnabled"
            defaultChecked={person?.profileEnabled ?? false}
          />
          <span>Enable personal academic site (`/people/slug`)</span>
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Links
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Public email"
            name="emailPublic"
            defaultValue={person?.emailPublic ?? ""}
          />
          <Field
            label="Google Scholar URL"
            name="googleScholar"
            defaultValue={person?.googleScholar ?? ""}
          />
          <Field
            label="CV URL"
            name="cvUrl"
            defaultValue={person?.cvUrl ?? ""}
          />
          <Field
            label="GitHub URL"
            name="github"
            defaultValue={person?.github ?? ""}
          />
          <Field label="X URL" name="x" defaultValue={person?.x ?? ""} />
          <Field
            label="External website"
            name="website"
            defaultValue={person?.website ?? ""}
          />
        </div>
      </section>

      <AcademicFields
        interests={person?.interests}
        publications={person?.publications}
        competitions={person?.competitions}
        applications={person?.applications}
        patents={person?.patents}
      />

      {isAdminMode ? (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
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
        </section>
      ) : null}

      <SubmitButton
        idleLabel={mode === "self" ? "Save profile" : "Save author"}
      />
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
