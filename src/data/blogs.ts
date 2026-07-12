export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  content: string[];
};

export const blogs: BlogPost[] = [
  {
    slug: "quiet-notes-on-learning-in-public",
    title: "Quiet notes on learning in public",
    excerpt:
      "Why short essays and unfinished thoughts still matter when you are building long-form tutorials.",
    date: "2026-07-08",
    tags: ["writing", "practice"],
    content: [
      "Learning in public does not have to be loud. A short note, written carefully, can be more useful than a polished announcement.",
      "On Academic Sharing, blog posts are meant to stay light: observations, experiments, and the small questions that appear between deeper tutorials.",
      "This keeps a human rhythm in the archive. Tutorials hold structure; blogs hold presence.",
      "## What belongs in a blog post",
      "A useful post often starts from a concrete moment: a failed experiment, a surprising tradeoff, or a sentence you wish someone had written earlier.",
      "Keep the scope narrow. One claim, one example, one takeaway is enough.",
      "## What to leave for tutorials",
      "Anything that needs chapters, prerequisites, or a durable table of contents should live under Tutorials. The blog can point there without trying to replace it.",
    ],
  },
  {
    slug: "drafting-a-tutorial-outline",
    title: "Drafting a tutorial outline before the first sentence",
    excerpt:
      "A simple outline method that keeps series tutorials coherent without over-engineering the curriculum.",
    date: "2026-06-22",
    tags: ["tutorial", "process"],
    content: [
      "Before writing the first paragraph of a series, spend time on the outline. The outline is the product until the prose exists.",
      "Start with the end state: what a reader should be able to do after the last chapter. Then walk backwards into prerequisites.",
      "## A compact outline template",
      "For each chapter, write one outcome sentence, one required concept, and one exercise or checkpoint. If you cannot fill those three lines, the chapter is not ready.",
      "This keeps tutorials academic without becoming bureaucratic.",
    ],
  },
  {
    slug: "typography-for-technical-reading",
    title: "Typography for technical reading",
    excerpt:
      "Measure, hierarchy, and quiet color choices that make long-form knowledge easier to stay with.",
    date: "2026-05-30",
    tags: ["design", "reading"],
    content: [
      "Technical reading fails when the page competes with the content. Hierarchy should be obvious; decoration should stay secondary.",
      "A calm palette, generous whitespace, and a readable measure do more for comprehension than animated flourishes.",
      "## Practical defaults",
      "Prefer a single accent color, keep body text dark on a soft light ground, and reserve display typography for titles that need gravity.",
    ],
  },
  {
    slug: "why-people-pages-matter",
    title: "Why a People page matters on a small knowledge site",
    excerpt:
      "Contributors are part of the archive. Showing them clearly builds trust without turning the site into a social network.",
    date: "2026-05-12",
    tags: ["community"],
    content: [
      "Even a small academic site benefits from a People page. Readers want to know who is writing, what they care about, and how to follow more of their work.",
      "Keep it directory-like: avatar, role, short bio, and optional links. No feeds, no engagement metrics.",
    ],
  },
];

export function getBlog(slug: string) {
  return blogs.find((post) => post.slug === slug);
}
