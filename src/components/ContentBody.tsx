"use client";

import dynamic from "next/dynamic";

export const ContentBody = dynamic(
  () => import("./ContentBodyClient").then((mod) => mod.ContentBody),
  {
    ssr: false,
    loading: () => (
      <div className="py-8 text-sm text-muted">Loading content…</div>
    ),
  },
);
