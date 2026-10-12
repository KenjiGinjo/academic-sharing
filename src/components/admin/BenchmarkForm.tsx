"use client";

import { useState } from "react";
import { saveBenchmarkAction } from "@/app/admin/actions";
import { ContentEditor } from "@/components/ContentEditor";
import { SubmitButton } from "@/components/admin/FormFeedback";

type EntryDraft = {
  key: string;
  name: string;
  score: string;
};

type BenchmarkDraft = {
  id: string;
  name: string;
  slug: string;
  description: string;
  info: string;
  published: boolean;
  sortOrder: number;
  entries: { name: string; score: number }[];
};

function blankEntry(): EntryDraft {
  return { key: crypto.randomUUID(), name: "", score: "" };
}

export function BenchmarkForm({ benchmark }: { benchmark?: BenchmarkDraft }) {
  const [entries, setEntries] = useState<EntryDraft[]>(
    benchmark?.entries.length
      ? benchmark.entries.map((entry) => ({
          key: crypto.randomUUID(),
          name: entry.name,
          score: String(entry.score),
        }))
      : [blankEntry()],
  );

  function updateEntry(key: string, patch: Partial<EntryDraft>) {
    setEntries((prev) =>
      prev.map((entry) => (entry.key === key ? { ...entry, ...patch } : entry)),
    );
  }

  function moveEntry(index: number, direction: -1 | 1) {
    setEntries((prev) => {
      const next = index + direction;
      if (next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(next, 0, item);
      return copy;
    });
  }

  return (
    <form
      action={saveBenchmarkAction}
      className="space-y-4 rounded-lg border border-border bg-surface p-6"
    >
      {benchmark ? <input type="hidden" name="id" value={benchmark.id} /> : null}
      <Field label="Name" name="name" defaultValue={benchmark?.name} required />
      <Field
        label="Slug (optional)"
        name="slug"
        defaultValue={benchmark?.slug ?? ""}
        placeholder="Letters and numbers. Leave empty to generate from the name."
      />
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Description</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={benchmark?.description ?? ""}
          className="w-full rounded border border-border bg-background px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Sort order</span>
        <input
          name="sortOrder"
          type="number"
          defaultValue={benchmark?.sortOrder ?? 0}
          className="w-32 rounded border border-border bg-background px-3 py-2"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={benchmark?.published ?? false}
        />
        <span>Published</span>
      </label>

      <div className="border-t border-border pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium">Results</h2>
          <button
            type="button"
            onClick={() => setEntries((prev) => [...prev, blankEntry()])}
            className="rounded border border-border px-2.5 py-1 text-sm hover:bg-background"
          >
            Add result
          </button>
        </div>
        <p className="mb-3 text-xs text-muted">
          Rank is by score, highest first. Order here only breaks ties.
        </p>
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div
              key={entry.key}
              className="grid gap-3 rounded border border-border bg-background p-3 sm:grid-cols-[minmax(0,1fr)_8rem_auto]"
            >
              <label className="block text-sm">
                <span className="mb-1 block text-muted">Name</span>
                <input
                  name="entryName"
                  value={entry.name}
                  onChange={(event) =>
                    updateEntry(entry.key, { name: event.target.value })
                  }
                  className="w-full rounded border border-border bg-surface px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-muted">Score</span>
                <input
                  name="entryScore"
                  type="number"
                  step="any"
                  value={entry.score}
                  onChange={(event) =>
                    updateEntry(entry.key, { score: event.target.value })
                  }
                  className="w-full rounded border border-border bg-surface px-3 py-2"
                />
              </label>
              <div className="flex items-end gap-3 pb-2 text-sm">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveEntry(index, -1)}
                  className="text-muted hover:text-foreground disabled:opacity-40"
                >
                  Up
                </button>
                <button
                  type="button"
                  disabled={index === entries.length - 1}
                  onClick={() => moveEntry(index, 1)}
                  className="text-muted hover:text-foreground disabled:opacity-40"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEntries((prev) =>
                      prev.filter((item) => item.key !== entry.key),
                    )
                  }
                  className="text-red-700 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {!entries.length ? (
            <p className="text-sm text-muted">No results. The chart stays empty.</p>
          ) : null}
        </div>
      </div>

      <ContentEditor
        name="info"
        initialContent={benchmark?.info}
        label="Info"
        minHeight={240}
      />

      <SubmitButton idleLabel="Save benchmark" />
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted">{label}</span>
      <input
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded border border-border bg-background px-3 py-2"
      />
    </label>
  );
}
