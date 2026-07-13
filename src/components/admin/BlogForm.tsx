"use client";

import { ContentEditor } from "@/components/ContentEditor";
import { saveBlogAction } from "@/app/admin/actions";
import type { Person } from "@prisma/client";

type BlogFormPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  authorId: string | null;
  published: boolean;
  publishedAt: Date | null;
};

export function BlogForm({
  people,
  post,
  canAssignAuthor = false,
}: {
  people: Person[];
  post?: BlogFormPost;
  canAssignAuthor?: boolean;
}) {
  const publishedAt = post?.publishedAt
    ? post.publishedAt.toISOString().slice(0, 10)
    : "";

  return (
    <form
      action={saveBlogAction}
      className="space-y-4 rounded-lg border border-border bg-surface p-6"
    >
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <Field label="Title" name="title" defaultValue={post?.title} required />
      <Field
        label="Slug"
        name="slug"
        defaultValue={post?.slug}
        placeholder="auto from title if empty"
      />
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Excerpt</span>
        <textarea
          name="excerpt"
          required
          rows={2}
          defaultValue={post?.excerpt}
          className="w-full rounded border border-border bg-background px-3 py-2"
        />
      </label>
      <ContentEditor
        name="content"
        initialContent={post?.content}
        label="Content"
        minHeight={360}
      />
      <Field
        label="Tags (comma separated)"
        name="tags"
        defaultValue={post?.tags.join(", ")}
      />
      {canAssignAuthor ? (
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Author</span>
          <select
            name="authorId"
            defaultValue={post?.authorId ?? ""}
            className="w-full rounded border border-border bg-background px-3 py-2"
          >
            <option value="">— None —</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="text-sm text-muted">
          Author is fixed to your account when you publish.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Published date"
          name="publishedAt"
          type="date"
          defaultValue={publishedAt}
        />
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post?.published ?? false}
          />
          <span>Published</span>
        </label>
      </div>
      <button
        type="submit"
        className="rounded bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-deep"
      >
        Save blog
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
