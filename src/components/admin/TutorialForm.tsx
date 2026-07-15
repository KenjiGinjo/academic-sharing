"use client";

import { useState } from "react";
import { ContentEditor } from "@/components/ContentEditor";
import { saveTutorialAction } from "@/app/admin/actions";
import type { Person } from "@prisma/client";

type ChapterDraft = {
  key: string;
  title: string;
  slug: string;
  content: string;
};

type TutorialFormPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  level: string;
  tags: string[];
  authorId: string | null;
  published: boolean;
  featured: boolean;
  publishedAt: Date | null;
  chapters: { title: string; slug: string; content: string }[];
};

function newChapter(partial?: Partial<ChapterDraft>): ChapterDraft {
  return {
    key: crypto.randomUUID(),
    title: "",
    slug: "",
    content: "",
    ...partial,
  };
}

export function TutorialForm({
  people,
  post,
  canAssignAuthor = false,
}: {
  people: Person[];
  post?: TutorialFormPost;
  canAssignAuthor?: boolean;
}) {
  const [chapters, setChapters] = useState<ChapterDraft[]>(
    post?.chapters?.length
      ? post.chapters.map((chapter) =>
          newChapter({
            title: chapter.title,
            slug: chapter.slug,
            content: chapter.content,
          }),
        )
      : [newChapter()],
  );

  const publishedAt = post?.publishedAt
    ? post.publishedAt.toISOString().slice(0, 10)
    : "";

  return (
    <form
      action={saveTutorialAction}
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
        <span className="mb-1 block text-muted">Description</span>
        <textarea
          name="excerpt"
          required
          rows={2}
          defaultValue={post?.excerpt}
          className="w-full rounded border border-border bg-background px-3 py-2"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Level</span>
          <select
            name="level"
            defaultValue={post?.level ?? "Beginner"}
            className="w-full rounded border border-border bg-background px-3 py-2"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>
        <Field
          label="Tags (comma separated)"
          name="tags"
          defaultValue={post?.tags.join(", ")}
        />
      </div>
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
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={post?.featured ?? false}
          />
          <span>Featured (homepage carousel priority)</span>
        </label>
      </div>

      <div className="border-t border-border pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium">Chapters</h2>
          <button
            type="button"
            onClick={() => setChapters((prev) => [...prev, newChapter()])}
            className="rounded border border-border px-2.5 py-1 text-sm hover:bg-background"
          >
            Add chapter
          </button>
        </div>
        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.key}
              className="rounded border border-border bg-background p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium">Chapter {index + 1}</p>
                {chapters.length > 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setChapters((prev) =>
                        prev.filter((item) => item.key !== chapter.key),
                      )
                    }
                    className="text-sm text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block text-muted">Title</span>
                  <input
                    name="chapterTitle"
                    required
                    value={chapter.title}
                    onChange={(e) =>
                      setChapters((prev) =>
                        prev.map((item) =>
                          item.key === chapter.key
                            ? { ...item, title: e.target.value }
                            : item,
                        ),
                      )
                    }
                    className="w-full rounded border border-border bg-surface px-3 py-2"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-muted">Slug</span>
                  <input
                    name="chapterSlug"
                    value={chapter.slug}
                    onChange={(e) =>
                      setChapters((prev) =>
                        prev.map((item) =>
                          item.key === chapter.key
                            ? { ...item, slug: e.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="auto from title"
                    className="w-full rounded border border-border bg-surface px-3 py-2"
                  />
                </label>
              </div>
              <div className="mt-3">
                <ContentEditor
                  name="chapterContent"
                  initialContent={chapter.content}
                  label="Content"
                  minHeight={240}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="rounded bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-deep"
      >
        Save tutorial
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
