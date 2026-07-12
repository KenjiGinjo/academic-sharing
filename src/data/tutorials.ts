export type TutorialChapter = {
  id: string;
  title: string;
  body: string[];
};

export type Tutorial = {
  slug: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  chapterCount: number;
  chapters: TutorialChapter[];
};

export const tutorials: Tutorial[] = [
  {
    slug: "foundations-of-knowledge-writing",
    title: "Foundations of knowledge writing",
    description:
      "A structured series on turning scattered notes into durable tutorials with clear outcomes.",
    level: "Beginner",
    tags: ["writing", "structure"],
    chapterCount: 4,
    chapters: [
      {
        id: "intent",
        title: "Define reader intent",
        body: [
          "Every durable tutorial starts with a reader who needs to accomplish something specific.",
          "Write one sentence that names the reader, the starting point, and the finished capability. Keep that sentence visible while drafting.",
        ],
      },
      {
        id: "scope",
        title: "Bound the scope",
        body: [
          "Scope is a kindness. Decide what this series will not cover, and say so early.",
          "A short exclusions list prevents the tutorial from drifting into a second product.",
        ],
      },
      {
        id: "chapters",
        title: "Sequence the chapters",
        body: [
          "Order chapters by dependency, not by how interesting they feel. Each chapter should unlock the next.",
          "Prefer fewer chapters with clear checkpoints over many thin pages.",
        ],
      },
      {
        id: "revision",
        title: "Revise for transfer",
        body: [
          "Revision is where knowledge becomes transferable. Cut clever phrasing that hides the next action.",
          "Ask whether a reader could teach the same idea after finishing the final chapter.",
        ],
      },
    ],
  },
  {
    slug: "practical-markdown-workflows",
    title: "Practical Markdown workflows",
    description:
      "From draft to publish: conventions that keep Blog and Tutorial content maintainable.",
    level: "Intermediate",
    tags: ["markdown", "workflow"],
    chapterCount: 3,
    chapters: [
      {
        id: "source-of-truth",
        title: "Treat Markdown as source of truth",
        body: [
          "In an MVP, Markdown files or CMS documents should remain the canonical source.",
          "Avoid formatting that only exists in the rendered page. If it matters, encode it in the document.",
        ],
      },
      {
        id: "frontmatter",
        title: "Use frontmatter deliberately",
        body: [
          "Titles, dates, tags, and series membership belong in frontmatter so the UI can stay thin.",
          "Keep the schema small until a real editorial need appears.",
        ],
      },
      {
        id: "preview",
        title: "Preview like a reader",
        body: [
          "Before publishing, read the rendered page at a normal content width. Fix hierarchy first, then wording.",
        ],
      },
    ],
  },
  {
    slug: "building-a-calm-docs-ui",
    title: "Building a calm docs UI",
    description:
      "Layout patterns for tutorial pages: sticky TOC, readable measure, and quiet navigation.",
    level: "Intermediate",
    tags: ["frontend", "ux"],
    chapterCount: 3,
    chapters: [
      {
        id: "layout",
        title: "Choose a docs-like layout",
        body: [
          "Tutorial detail pages benefit from a persistent table of contents and a focused reading column.",
          "Keep chrome quiet so attention stays on the chapter content.",
        ],
      },
      {
        id: "toc",
        title: "Make the TOC scannable",
        body: [
          "Chapter titles should be short enough to scan. Active state and hover should be obvious without glow effects.",
        ],
      },
      {
        id: "motion",
        title: "Use motion sparingly",
        body: [
          "One or two entrance transitions are enough. Prefer opacity and slight translate over decorative animation.",
        ],
      },
    ],
  },
];

export function getTutorial(slug: string) {
  return tutorials.find((item) => item.slug === slug);
}
