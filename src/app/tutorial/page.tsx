import type { Metadata } from "next";
import { SectionHeading } from "@/components/BlogList";
import { TutorialList } from "@/components/TutorialList";
import { tutorials } from "@/data/tutorials";

export const metadata: Metadata = {
  title: "Tutorial",
  description: "Structured series guides from Academic Sharing.",
};

export default function TutorialPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <SectionHeading
        eyebrow="Tutorial"
        title="Series-based guides with clear outcomes"
      />
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted">
        Heavier than blog posts: chapters, levels, and durable structure for
        learners who want depth.
      </p>
      <TutorialList items={tutorials} />
    </div>
  );
}
