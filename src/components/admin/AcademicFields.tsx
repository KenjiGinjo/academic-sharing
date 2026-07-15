"use client";

import { useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type {
  PersonApplication,
  PersonCompetition,
  PersonInterest,
  PersonPatent,
  PersonPublication,
  PublicationType,
} from "@prisma/client";

type AcademicFieldsProps = {
  interests?: PersonInterest[];
  publications?: PersonPublication[];
  competitions?: PersonCompetition[];
  applications?: PersonApplication[];
  patents?: PersonPatent[];
};

type InterestRow = { label: string };
type PubRow = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  type: PublicationType;
  url: string;
  doi: string;
  highlight: boolean;
};
type CompetitionRow = {
  name: string;
  award: string;
  year: string;
  description: string;
  url: string;
};
type ApplicationRow = {
  name: string;
  kind: string;
  summary: string;
  url: string;
  imageUrl: string;
  note: string;
  updatedAtLabel: string;
};
type PatentRow = {
  title: string;
  status: string;
  number: string;
  year: string;
  description: string;
  url: string;
};

export function AcademicFields({
  interests = [],
  publications = [],
  competitions = [],
  applications = [],
  patents = [],
}: AcademicFieldsProps) {
  const [interestRows, setInterestRows] = useState<InterestRow[]>(
    interests.length
      ? interests.map((item) => ({ label: item.label }))
      : [{ label: "" }],
  );
  const [pubRows, setPubRows] = useState<PubRow[]>(
    publications.length
      ? publications.map((item) => ({
          title: item.title,
          authors: item.authors,
          venue: item.venue,
          year: item.year != null ? String(item.year) : "",
          type: item.type,
          url: item.url ?? "",
          doi: item.doi ?? "",
          highlight: item.highlight,
        }))
      : [],
  );
  const [competitionRows, setCompetitionRows] = useState<CompetitionRow[]>(
    competitions.map((item) => ({
      name: item.name,
      award: item.award ?? "",
      year: item.year != null ? String(item.year) : "",
      description: item.description ?? "",
      url: item.url ?? "",
    })),
  );
  const [applicationRows, setApplicationRows] = useState<ApplicationRow[]>(
    applications.map((item) => ({
      name: item.name,
      kind: item.kind ?? "",
      summary: item.summary,
      url: item.url ?? "",
      imageUrl: item.imageUrl ?? "",
      note: item.note ?? "",
      updatedAtLabel: item.updatedAtLabel ?? "",
    })),
  );
  const [patentRows, setPatentRows] = useState<PatentRow[]>(
    patents.map((item) => ({
      title: item.title,
      status: item.status ?? "",
      number: item.number ?? "",
      year: item.year != null ? String(item.year) : "",
      description: item.description ?? "",
      url: item.url ?? "",
    })),
  );

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <SectionLabel>Research interests</SectionLabel>
        {interestRows.map((row, index) => (
          <div key={index} className="flex gap-2">
            <input
              name="interestLabel"
              value={row.label}
              onChange={(e) => {
                const next = [...interestRows];
                next[index] = { label: e.target.value };
                setInterestRows(next);
              }}
              placeholder="e.g. Personalized LLM"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() =>
                setInterestRows(interestRows.filter((_, i) => i !== index))
              }
              className="shrink-0 text-sm text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <AddButton onClick={() => setInterestRows([...interestRows, { label: "" }])} />
      </section>

      <section className="space-y-4">
        <SectionLabel>Publications</SectionLabel>
        {pubRows.map((row, index) => (
          <div
            key={index}
            className="space-y-2 rounded border border-border bg-background p-4"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <Field
                name="pubTitle"
                label="Title"
                value={row.title}
                onChange={(v) => {
                  const next = [...pubRows];
                  next[index] = { ...row, title: v };
                  setPubRows(next);
                }}
              />
              <label className="block text-sm">
                <span className="mb-1 block text-muted">Type</span>
                <select
                  name="pubType"
                  value={row.type}
                  onChange={(e) => {
                    const next = [...pubRows];
                    next[index] = {
                      ...row,
                      type: e.target.value as PublicationType,
                    };
                    setPubRows(next);
                  }}
                  className="w-full rounded border border-border bg-surface px-3 py-2"
                >
                  <option value="JOURNAL">Journal</option>
                  <option value="CONFERENCE">Conference</option>
                  <option value="PREPRINT">Preprint</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>
            </div>
            <Field
              name="pubAuthors"
              label="Authors"
              value={row.authors}
              onChange={(v) => {
                const next = [...pubRows];
                next[index] = { ...row, authors: v };
                setPubRows(next);
              }}
            />
            <div className="grid gap-2 sm:grid-cols-3">
              <Field
                name="pubVenue"
                label="Venue"
                value={row.venue}
                onChange={(v) => {
                  const next = [...pubRows];
                  next[index] = { ...row, venue: v };
                  setPubRows(next);
                }}
              />
              <Field
                name="pubYear"
                label="Year"
                value={row.year}
                onChange={(v) => {
                  const next = [...pubRows];
                  next[index] = { ...row, year: v };
                  setPubRows(next);
                }}
              />
              <Field
                name="pubDoi"
                label="DOI"
                value={row.doi}
                onChange={(v) => {
                  const next = [...pubRows];
                  next[index] = { ...row, doi: v };
                  setPubRows(next);
                }}
              />
            </div>
            <Field
              name="pubUrl"
              label="URL"
              value={row.url}
              onChange={(v) => {
                const next = [...pubRows];
                next[index] = { ...row, url: v };
                setPubRows(next);
              }}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="pubHighlight"
                value={String(index)}
                checked={row.highlight}
                onChange={(e) => {
                  const next = [...pubRows];
                  next[index] = { ...row, highlight: e.target.checked };
                  setPubRows(next);
                }}
              />
              Highlight
            </label>
            {/* Hidden mirror so unchecked highlights still submit index alignment via separate arrays */}
            <input type="hidden" name="pubHighlightFlag" value={row.highlight ? "1" : "0"} />
            <button
              type="button"
              onClick={() => setPubRows(pubRows.filter((_, i) => i !== index))}
              className="text-sm text-red-700"
            >
              Remove publication
            </button>
          </div>
        ))}
        <AddButton
          label="Add publication"
          onClick={() =>
            setPubRows([
              ...pubRows,
              {
                title: "",
                authors: "",
                venue: "",
                year: "",
                type: "OTHER",
                url: "",
                doi: "",
                highlight: false,
              },
            ])
          }
        />
      </section>

      <RepeatSection
        title="Competitions"
        onAdd={() =>
          setCompetitionRows([
            ...competitionRows,
            { name: "", award: "", year: "", description: "", url: "" },
          ])
        }
      >
        {competitionRows.map((row, index) => (
          <div
            key={index}
            className="space-y-2 rounded border border-border bg-background p-4"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <Field
                name="compName"
                label="Name"
                value={row.name}
                onChange={(v) => {
                  const next = [...competitionRows];
                  next[index] = { ...row, name: v };
                  setCompetitionRows(next);
                }}
              />
              <Field
                name="compAward"
                label="Award"
                value={row.award}
                onChange={(v) => {
                  const next = [...competitionRows];
                  next[index] = { ...row, award: v };
                  setCompetitionRows(next);
                }}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field
                name="compYear"
                label="Year"
                value={row.year}
                onChange={(v) => {
                  const next = [...competitionRows];
                  next[index] = { ...row, year: v };
                  setCompetitionRows(next);
                }}
              />
              <Field
                name="compUrl"
                label="URL"
                value={row.url}
                onChange={(v) => {
                  const next = [...competitionRows];
                  next[index] = { ...row, url: v };
                  setCompetitionRows(next);
                }}
              />
            </div>
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Description</span>
              <textarea
                name="compDescription"
                rows={2}
                value={row.description}
                onChange={(e) => {
                  const next = [...competitionRows];
                  next[index] = { ...row, description: e.target.value };
                  setCompetitionRows(next);
                }}
                className="w-full rounded border border-border bg-surface px-3 py-2"
              />
            </label>
            <button
              type="button"
              onClick={() =>
                setCompetitionRows(competitionRows.filter((_, i) => i !== index))
              }
              className="text-sm text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </RepeatSection>

      <RepeatSection
        title="Applications"
        onAdd={() =>
          setApplicationRows([
            ...applicationRows,
            {
              name: "",
              kind: "",
              summary: "",
              url: "",
              imageUrl: "",
              note: "",
              updatedAtLabel: "",
            },
          ])
        }
      >
        {applicationRows.map((row, index) => (
          <div
            key={index}
            className="space-y-2 rounded border border-border bg-background p-4"
          >
            <ImageUploadField
              name="appImageUrl"
              label="Cover image"
              value={row.imageUrl}
              onChange={(url) => {
                const next = [...applicationRows];
                next[index] = { ...row, imageUrl: url };
                setApplicationRows(next);
              }}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Field
                name="appName"
                label="Name"
                value={row.name}
                onChange={(v) => {
                  const next = [...applicationRows];
                  next[index] = { ...row, name: v };
                  setApplicationRows(next);
                }}
              />
              <Field
                name="appKind"
                label="Kind"
                value={row.kind}
                onChange={(v) => {
                  const next = [...applicationRows];
                  next[index] = { ...row, kind: v };
                  setApplicationRows(next);
                }}
                placeholder="Web Application"
              />
            </div>
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Summary</span>
              <textarea
                name="appSummary"
                rows={2}
                value={row.summary}
                onChange={(e) => {
                  const next = [...applicationRows];
                  next[index] = { ...row, summary: e.target.value };
                  setApplicationRows(next);
                }}
                className="w-full rounded border border-border bg-surface px-3 py-2"
              />
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field
                name="appUrl"
                label="URL"
                value={row.url}
                onChange={(v) => {
                  const next = [...applicationRows];
                  next[index] = { ...row, url: v };
                  setApplicationRows(next);
                }}
              />
              <Field
                name="appUpdatedAtLabel"
                label="Updated label"
                value={row.updatedAtLabel}
                onChange={(v) => {
                  const next = [...applicationRows];
                  next[index] = { ...row, updatedAtLabel: v };
                  setApplicationRows(next);
                }}
                placeholder="Last updated 2026-02-28"
              />
            </div>
            <Field
              name="appNote"
              label="Note"
              value={row.note}
              onChange={(v) => {
                const next = [...applicationRows];
                next[index] = { ...row, note: v };
                setApplicationRows(next);
              }}
            />
            <button
              type="button"
              onClick={() =>
                setApplicationRows(applicationRows.filter((_, i) => i !== index))
              }
              className="text-sm text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </RepeatSection>

      <RepeatSection
        title="Patents"
        onAdd={() =>
          setPatentRows([
            ...patentRows,
            {
              title: "",
              status: "",
              number: "",
              year: "",
              description: "",
              url: "",
            },
          ])
        }
      >
        {patentRows.map((row, index) => (
          <div
            key={index}
            className="space-y-2 rounded border border-border bg-background p-4"
          >
            <Field
              name="patentTitle"
              label="Title"
              value={row.title}
              onChange={(v) => {
                const next = [...patentRows];
                next[index] = { ...row, title: v };
                setPatentRows(next);
              }}
            />
            <div className="grid gap-2 sm:grid-cols-3">
              <Field
                name="patentStatus"
                label="Status"
                value={row.status}
                onChange={(v) => {
                  const next = [...patentRows];
                  next[index] = { ...row, status: v };
                  setPatentRows(next);
                }}
              />
              <Field
                name="patentNumber"
                label="Number"
                value={row.number}
                onChange={(v) => {
                  const next = [...patentRows];
                  next[index] = { ...row, number: v };
                  setPatentRows(next);
                }}
              />
              <Field
                name="patentYear"
                label="Year"
                value={row.year}
                onChange={(v) => {
                  const next = [...patentRows];
                  next[index] = { ...row, year: v };
                  setPatentRows(next);
                }}
              />
            </div>
            <Field
              name="patentUrl"
              label="URL"
              value={row.url}
              onChange={(v) => {
                const next = [...patentRows];
                next[index] = { ...row, url: v };
                setPatentRows(next);
              }}
            />
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Description</span>
              <textarea
                name="patentDescription"
                rows={2}
                value={row.description}
                onChange={(e) => {
                  const next = [...patentRows];
                  next[index] = { ...row, description: e.target.value };
                  setPatentRows(next);
                }}
                className="w-full rounded border border-border bg-surface px-3 py-2"
              />
            </label>
            <button
              type="button"
              onClick={() =>
                setPatentRows(patentRows.filter((_, i) => i !== index))
              }
              className="text-sm text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </RepeatSection>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
      {children}
    </h2>
  );
}

function AddButton({
  onClick,
  label = "Add",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-medium text-accent-deep hover:underline"
    >
      + {label}
    </button>
  );
}

function RepeatSection({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <SectionLabel>{title}</SectionLabel>
      {children}
      <AddButton label={`Add ${title.toLowerCase().replace(/s$/, "")}`} onClick={onAdd} />
    </section>
  );
}

function Field({
  name,
  label,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted">{label}</span>
      <input
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-border bg-surface px-3 py-2"
      />
    </label>
  );
}
