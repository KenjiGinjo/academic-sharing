"use client";

import dynamic from "next/dynamic";

export const ContentEditor = dynamic(
  () =>
    import("./ContentEditorClient").then((mod) => mod.ContentEditor),
  {
    ssr: false,
    loading: () => (
      <div className="rounded border border-border bg-white px-3 py-8 text-sm text-muted">
        Loading editor…
      </div>
    ),
  },
);
