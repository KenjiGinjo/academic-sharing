import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { serializeBlocks, parseStoredContent } from "../src/lib/blocks";

const prisma = new PrismaClient();

function toBlocksJson(markdown: string) {
  const blocks = parseStoredContent(markdown);
  return serializeBlocks(blocks ?? [{ type: "paragraph", content: "" }]);
}

async function main() {
  const adminEmail = (
    process.env.ADMIN_EMAIL ?? "admin@academic.local"
  ).toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const adminHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminHash,
      name: "Admin",
      role: "ADMIN",
      active: true,
      personId: null,
    },
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      name: "Admin",
      role: "ADMIN",
      active: true,
    },
  });

  const authors = [
    {
      name: "Avery Lin",
      role: "Editor & Tutorials",
      bio: "Writes structured guides on knowledge design and keeps series outlines coherent across releases.",
      initials: "AL",
      sortOrder: 1,
      github: "https://github.com",
      email: "avery@academic.local",
      password: "author123",
    },
    {
      name: "Noah Chen",
      role: "Blog & Research Notes",
      bio: "Publishes short essays on learning practice, reading systems, and the craft of technical writing.",
      initials: "NC",
      sortOrder: 2,
      x: "https://x.com",
      email: "noah@academic.local",
      password: "author123",
    },
    {
      name: "Mira Okada",
      role: "Design Systems",
      bio: "Focuses on calm academic interfaces, typography, and documentation layouts that stay out of the way.",
      initials: "MO",
      sortOrder: 3,
      email: "mira@academic.local",
      password: "author123",
    },
    {
      name: "Eli Park",
      role: "Engineering",
      bio: "Builds the static-first frontend and CMS hooks that keep content portable as the archive grows.",
      initials: "EP",
      sortOrder: 4,
      github: "https://github.com",
      email: "eli@academic.local",
      password: "author123",
    },
  ];

  for (const author of authors) {
    const { email, password, ...profile } = author;
    const passwordHash = await bcrypt.hash(password, 10);

    let person = await prisma.person.findFirst({
      where: { name: profile.name },
      include: { user: true },
    });

    if (person) {
      person = await prisma.person.update({
        where: { id: person.id },
        data: {
          role: profile.role,
          bio: profile.bio,
          initials: profile.initials,
          sortOrder: profile.sortOrder,
          github: profile.github ?? null,
          x: "x" in profile ? (profile.x ?? null) : null,
        },
        include: { user: true },
      });
    } else {
      person = await prisma.person.create({
        data: {
          name: profile.name,
          role: profile.role,
          bio: profile.bio,
          initials: profile.initials,
          sortOrder: profile.sortOrder,
          github: profile.github ?? null,
          x: "x" in profile ? (profile.x ?? null) : null,
        },
        include: { user: true },
      });
    }

    await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        name: profile.name,
        role: "AUTHOR",
        active: true,
        personId: person.id,
      },
      create: {
        email,
        passwordHash,
        name: profile.name,
        role: "AUTHOR",
        active: true,
        personId: person.id,
      },
    });
  }

  const people = await prisma.person.findMany();
  const byName = Object.fromEntries(people.map((p) => [p.name, p.id]));

  const blogs = [
    {
      slug: "quiet-notes-on-learning-in-public",
      title: "Quiet notes on learning in public",
      excerpt:
        "Why short essays and unfinished thoughts still matter when you are building long-form tutorials.",
      publishedAt: new Date("2026-07-08"),
      tags: ["writing", "practice"],
      authorId: byName["Noah Chen"],
      content: toBlocksJson(`Learning in public does not have to be loud.

On Academic Sharing, blog posts stay light: observations and small questions between deeper tutorials.

## What belongs in a blog post

One claim, one example, one takeaway is enough.`),
    },
    {
      slug: "drafting-a-tutorial-outline",
      title: "Drafting a tutorial outline before the first sentence",
      excerpt:
        "A simple outline method that keeps series tutorials coherent without over-engineering the curriculum.",
      publishedAt: new Date("2026-06-22"),
      tags: ["tutorial", "process"],
      authorId: byName["Avery Lin"],
      content: toBlocksJson(`Before writing the first paragraph, spend time on the outline.

## A compact outline template

For each chapter: one outcome, one concept, one checkpoint.`),
    },
  ];

  for (const blog of blogs) {
    await prisma.post.upsert({
      where: { slug: blog.slug },
      update: {
        type: "BLOG",
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        tags: blog.tags,
        published: true,
        publishedAt: blog.publishedAt,
        authorId: blog.authorId,
      },
      create: {
        type: "BLOG",
        slug: blog.slug,
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        tags: blog.tags,
        published: true,
        publishedAt: blog.publishedAt,
        authorId: blog.authorId,
      },
    });
  }

  const tutorial = {
    slug: "foundations-of-knowledge-writing",
    title: "Foundations of knowledge writing",
    excerpt:
      "A structured series on turning scattered notes into durable tutorials with clear outcomes.",
    level: "Beginner" as const,
    tags: ["writing", "structure"],
    authorId: byName["Avery Lin"],
    publishedAt: new Date("2026-06-01"),
    chapters: [
      {
        slug: "intent",
        title: "Define reader intent",
        sortOrder: 0,
        content: toBlocksJson(
          "Every durable tutorial starts with a reader who needs to accomplish something specific.",
        ),
      },
      {
        slug: "scope",
        title: "Bound the scope",
        sortOrder: 1,
        content: toBlocksJson(
          "Scope is a kindness. Decide what this series will not cover, and say so early.",
        ),
      },
    ],
  };

  const existingTutorial = await prisma.post.findUnique({
    where: { slug: tutorial.slug },
  });

  if (existingTutorial) {
    await prisma.tutorialChapter.deleteMany({
      where: { postId: existingTutorial.id },
    });
    await prisma.post.update({
      where: { id: existingTutorial.id },
      data: {
        type: "TUTORIAL",
        title: tutorial.title,
        excerpt: tutorial.excerpt,
        level: tutorial.level,
        tags: tutorial.tags,
        published: true,
        publishedAt: tutorial.publishedAt,
        authorId: tutorial.authorId,
        chapters: { create: tutorial.chapters },
      },
    });
  } else {
    await prisma.post.create({
      data: {
        type: "TUTORIAL",
        slug: tutorial.slug,
        title: tutorial.title,
        excerpt: tutorial.excerpt,
        level: tutorial.level,
        tags: tutorial.tags,
        published: true,
        publishedAt: tutorial.publishedAt,
        authorId: tutorial.authorId,
        chapters: { create: tutorial.chapters },
      },
    });
  }

  // Drop legacy AdminUser table if it still exists
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "AdminUser";`);

  console.log("Seed complete.");
  console.log(`Admin:  ${adminEmail} / ${adminPassword}`);
  console.log("Author: avery@academic.local / author123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
