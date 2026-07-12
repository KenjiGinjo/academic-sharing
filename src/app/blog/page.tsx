import type { Metadata } from "next";
import { BlogList, SectionHeading } from "@/components/BlogList";
import { blogs } from "@/data/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description: "Lightweight notes and essays from Academic Sharing.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <SectionHeading
        eyebrow="Blog"
        title="Everyday writing from the archive"
      />
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted">
        Short essays and practice notes — lighter than tutorials, still meant to
        be useful.
      </p>
      <BlogList posts={blogs} />
    </div>
  );
}
