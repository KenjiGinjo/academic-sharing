import type {
  Person,
  PersonApplication,
  PersonCompetition,
  PersonInterest,
  PersonPatent,
  PersonPublication,
  Post,
  TutorialChapter,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { profilePath, profilePublicUrl } from "@/lib/profile";

export type PersonLink = { label: string; href: string };

export type AuthorRef = {
  id: string;
  name: string;
  role?: string;
  initials: string;
  avatarUrl?: string | null;
  slug?: string | null;
  profileEnabled?: boolean;
  href?: string | null;
};

export type PersonView = {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  avatarUrl?: string | null;
  profileEnabled: boolean;
  websiteHref: string | null;
  links: PersonLink[];
};

export type ProfileView = {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  about: string | null;
  initials: string;
  avatarUrl: string | null;
  emailPublic: string | null;
  googleScholar: string | null;
  cvUrl: string | null;
  github: string | null;
  x: string | null;
  website: string | null;
  interests: { label: string }[];
  publications: {
    title: string;
    authors: string;
    venue: string;
    year: number | null;
    type: string;
    url: string | null;
    doi: string | null;
    highlight: boolean;
  }[];
  competitions: {
    name: string;
    award: string | null;
    year: number | null;
    description: string | null;
    url: string | null;
  }[];
  applications: {
    name: string;
    kind: string | null;
    summary: string;
    url: string | null;
    imageUrl: string | null;
    note: string | null;
    updatedAtLabel: string | null;
  }[];
  patents: {
    title: string;
    status: string | null;
    number: string | null;
    year: number | null;
    description: string | null;
    url: string | null;
  }[];
};

export type BlogPostView = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  content: string;
  featured: boolean;
  author?: AuthorRef | null;
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
  featured: boolean;
  author?: AuthorRef | null;
};

export type CarouselItemView = {
  kind: "blog" | "tutorial";
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
  author?: AuthorRef | null;
};

function toAuthorRef(person: Person | null | undefined): AuthorRef | null {
  if (!person) return null;
  const enabled = person.profileEnabled && Boolean(person.slug);
  return {
    id: person.id,
    name: person.name,
    role: person.role,
    initials: person.initials,
    avatarUrl: person.avatarUrl,
    slug: person.slug,
    profileEnabled: person.profileEnabled,
    href: enabled && person.slug ? profilePath(person.slug) : null,
  };
}

function personWebsiteHref(person: Person): string | null {
  if (person.profileEnabled && person.slug) {
    return profilePublicUrl(person.slug);
  }
  return person.website || null;
}

function personLinks(person: Person): PersonLink[] {
  const links: PersonLink[] = [];
  if (person.github) links.push({ label: "GitHub", href: person.github });
  if (person.x) links.push({ label: "X", href: person.x });
  return links;
}

export function toPersonView(person: Person): PersonView {
  return {
    id: person.id,
    slug: person.slug,
    name: person.name,
    role: person.role,
    bio: person.bio,
    initials: person.initials,
    avatarUrl: person.avatarUrl,
    profileEnabled: person.profileEnabled,
    websiteHref: personWebsiteHref(person),
    links: personLinks(person),
  };
}

type ProfilePerson = Person & {
  interests: PersonInterest[];
  publications: PersonPublication[];
  competitions: PersonCompetition[];
  applications: PersonApplication[];
  patents: PersonPatent[];
};

export function toProfileView(person: ProfilePerson): ProfileView {
  return {
    id: person.id,
    slug: person.slug,
    name: person.name,
    role: person.role,
    bio: person.bio,
    about: person.about,
    initials: person.initials,
    avatarUrl: person.avatarUrl,
    emailPublic: person.emailPublic,
    googleScholar: person.googleScholar,
    cvUrl: person.cvUrl,
    github: person.github,
    x: person.x,
    website: person.website,
    interests: person.interests.map((item) => ({ label: item.label })),
    publications: person.publications.map((item) => ({
      title: item.title,
      authors: item.authors,
      venue: item.venue,
      year: item.year,
      type: item.type,
      url: item.url,
      doi: item.doi,
      highlight: item.highlight,
    })),
    competitions: person.competitions.map((item) => ({
      name: item.name,
      award: item.award,
      year: item.year,
      description: item.description,
      url: item.url,
    })),
    applications: person.applications.map((item) => ({
      name: item.name,
      kind: item.kind,
      summary: item.summary,
      url: item.url,
      imageUrl: item.imageUrl,
      note: item.note,
      updatedAtLabel: item.updatedAtLabel,
    })),
    patents: person.patents.map((item) => ({
      title: item.title,
      status: item.status,
      number: item.number,
      year: item.year,
      description: item.description,
      url: item.url,
    })),
  };
}

function toBlogView(post: Post & { author?: Person | null }): BlogPostView {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: (post.publishedAt ?? post.createdAt).toISOString(),
    tags: post.tags,
    content: post.content,
    featured: post.featured,
    author: toAuthorRef(post.author),
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
    featured: post.featured,
    author: toAuthorRef(post.author),
  };
}

export async function listPeople() {
  const people = await prisma.person.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return people.map(toPersonView);
}

export async function getPersonProfile(slug: string) {
  const person = await prisma.person.findFirst({
    where: { slug, profileEnabled: true },
    include: {
      interests: { orderBy: { sortOrder: "asc" } },
      publications: { orderBy: [{ year: "desc" }, { sortOrder: "asc" }] },
      competitions: { orderBy: [{ year: "desc" }, { sortOrder: "asc" }] },
      applications: { orderBy: { sortOrder: "asc" } },
      patents: { orderBy: [{ year: "desc" }, { sortOrder: "asc" }] },
    },
  });
  return person ? toProfileView(person) : null;
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

/** Mixed recent/featured posts for homepage carousel (plan A). */
export async function listCarouselItems(limit = 6): Promise<CarouselItemView[]> {
  const featured = await prisma.post.findMany({
    where: { published: true, featured: true },
    include: { author: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  const source =
    featured.length > 0
      ? featured
      : await prisma.post.findMany({
          where: { published: true },
          include: { author: true },
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          take: limit,
        });

  return source.map((post) => ({
    kind: post.type === "BLOG" ? "blog" : "tutorial",
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: (post.publishedAt ?? post.createdAt).toISOString(),
    href: post.type === "BLOG" ? `/blog/${post.slug}` : `/tutorial/${post.slug}`,
    author: toAuthorRef(post.author),
  }));
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

export async function ensureUniquePersonSlug(base: string, excludeId?: string) {
  const root = slugify(base) || "person";
  let candidate = root;
  let n = 2;
  while (true) {
    const existing = await prisma.person.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${root}-${n++}`;
  }
}
