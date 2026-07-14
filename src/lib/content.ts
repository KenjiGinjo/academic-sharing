import type { Person, Post, TutorialChapter } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PersonLink = { label: string; href: string };

export type PersonView = {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  avatarUrl?: string | null;
  links: PersonLink[];
};

export type BlogPostView = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  content: string;
  authorName?: string;
};

export type TutorialChapterView = {
  id: string;
  slug: string;
  title: string;
  content: string;
};

export type TutorialView = {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  tags: string[];
  chapterCount: number;
  chapters: TutorialChapterView[];
  authorName?: string;
};

function personLinks(person: Person): PersonLink[] {
  const links: PersonLink[] = [];
  if (person.github) links.push({ label: "GitHub", href: person.github });
  if (person.x) links.push({ label: "X", href: person.x });
  if (person.website) links.push({ label: "Web", href: person.website });
  return links;
}

export function toPersonView(person: Person): PersonView {
  return {
    id: person.id,
    name: person.name,
    role: person.role,
    bio: person.bio,
    initials: person.initials,
    avatarUrl: person.avatarUrl,
    links: personLinks(person),
  };
}

function toBlogView(
  post: Post & { author?: Person | null },
): BlogPostView {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: (post.publishedAt ?? post.createdAt).toISOString(),
    tags: post.tags,
    content: post.content,
    authorName: post.author?.name,
  };
}

function toTutorialView(
  post: Post & { author?: Person | null; chapters: TutorialChapter[] },
): TutorialView {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    description: post.excerpt,
    level: post.level ?? "Beginner",
    tags: post.tags,
    chapterCount: post.chapters.length,
    chapters: post.chapters.map((chapter) => ({
      id: chapter.slug,
      slug: chapter.slug,
      title: chapter.title,
      content: chapter.content,
    })),
    authorName: post.author?.name,
  };
}

export async function listPeople() {
  const people = await prisma.person.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return people.map(toPersonView);
}

export async function listPublishedBlogs() {
  const posts = await prisma.post.findMany({
    where: { type: "BLOG", published: true },
    include: { author: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return posts.map(toBlogView);
}

export async function getPublishedBlog(slug: string) {
  const post = await prisma.post.findFirst({
    where: { type: "BLOG", slug, published: true },
    include: { author: true },
  });
  return post ? toBlogView(post) : null;
}

export async function listPublishedTutorials() {
  const posts = await prisma.post.findMany({
    where: { type: "TUTORIAL", published: true },
    include: {
      author: true,
      chapters: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return posts.map(toTutorialView);
}

export async function getPublishedTutorial(slug: string) {
  const post = await prisma.post.findFirst({
    where: { type: "TUTORIAL", slug, published: true },
    include: {
      author: true,
      chapters: { orderBy: { sortOrder: "asc" } },
    },
  });
  return post ? toTutorialView(post) : null;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function parseTags(raw: string) {
  return raw
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}
