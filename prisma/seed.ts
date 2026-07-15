import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { serializeBlocks, parseStoredContent } from "../src/lib/blocks";

const prisma = new PrismaClient();

/** Local files under /upload — served at /upload/{filename} */
const UPLOAD = {
  avatar1: "/upload/aacd5937-b1df-4984-8e52-ab5f93b8aadc.jpg",
  avatar2: "/upload/2be1672c-76a7-43eb-87a7-94b9a997366d.jpg",
  avatar3: "/upload/33181fef-4aa2-41c4-bc0e-12e4d865521c.jpg",
  avatar4: "/upload/631dc73e-061d-40b0-a859-7e0fc57937ab.jpg",
  appCover: "/upload/8ea43eaf-a182-4877-bdc4-82ce23e72cc9.jpg",
  appCover2: "/upload/2be1672c-76a7-43eb-87a7-94b9a997366d.jpg",
} as const;

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
      slug: "avery-lin",
      role: "Editor & Tutorials",
      bio: "Writes structured guides on knowledge design and keeps series outlines coherent across releases.",
      initials: "AL",
      sortOrder: 1,
      avatarUrl: UPLOAD.avatar1,
      github: "https://github.com",
      emailPublic: "avery@academic.local",
      googleScholar: "https://scholar.google.com",
      profileEnabled: true,
      about:
        "I write structured tutorials on knowledge design and help keep series outlines coherent across releases.\n\nBeyond editing, I care about calm academic interfaces and durable learning materials.",
      email: "avery@academic.local",
      password: "author123",
    },
    {
      name: "Noah Chen",
      slug: "noah-chen",
      role: "Blog & Research Notes",
      bio: "Publishes short essays on learning practice, reading systems, and the craft of technical writing.",
      initials: "NC",
      sortOrder: 2,
      avatarUrl: UPLOAD.avatar2,
      x: "https://x.com",
      profileEnabled: true,
      email: "noah@academic.local",
      password: "author123",
    },
    {
      name: "Mira Okada",
      slug: "mira-okada",
      role: "Design Systems",
      bio: "Focuses on calm academic interfaces, typography, and documentation layouts that stay out of the way.",
      initials: "MO",
      sortOrder: 3,
      avatarUrl: UPLOAD.avatar3,
      profileEnabled: true,
      email: "mira@academic.local",
      password: "author123",
    },
    {
      name: "Eli Park",
      slug: "eli-park",
      role: "Engineering",
      bio: "Builds the static-first frontend and CMS hooks that keep content portable as the archive grows.",
      initials: "EP",
      sortOrder: 4,
      avatarUrl: UPLOAD.avatar4,
      github: "https://github.com",
      profileEnabled: true,
      email: "eli@academic.local",
      password: "author123",
    },
  ];

  for (const author of authors) {
    const { email, password, about, emailPublic, googleScholar, ...profile } =
      author;
    const passwordHash = await bcrypt.hash(password, 10);

    let person = await prisma.person.findFirst({
      where: { OR: [{ slug: profile.slug }, { name: profile.name }] },
      include: { user: true },
    });

    const profileData = {
      slug: profile.slug,
      role: profile.role,
      bio: profile.bio,
      initials: profile.initials,
      sortOrder: profile.sortOrder,
      avatarUrl: profile.avatarUrl,
      github: profile.github ?? null,
      x: "x" in profile ? (profile.x ?? null) : null,
      profileEnabled: profile.profileEnabled,
      about: about ?? null,
      emailPublic: emailPublic ?? null,
      googleScholar: googleScholar ?? null,
    };

    if (person) {
      person = await prisma.person.update({
        where: { id: person.id },
        data: profileData,
        include: { user: true },
      });
    } else {
      person = await prisma.person.create({
        data: {
          name: profile.name,
          ...profileData,
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
  const averyId = byName["Avery Lin"];

  if (averyId) {
    await prisma.personInterest.deleteMany({ where: { personId: averyId } });
    await prisma.personInterest.createMany({
      data: [
        { personId: averyId, label: "Knowledge writing", sortOrder: 0 },
        { personId: averyId, label: "Tutorial design", sortOrder: 1 },
        { personId: averyId, label: "Learning systems", sortOrder: 2 },
      ],
    });

    await prisma.personPublication.deleteMany({ where: { personId: averyId } });
    await prisma.personPublication.create({
      data: {
        personId: averyId,
        title: "Quiet notes on drafting tutorial outlines",
        authors: "Avery Lin",
        venue: "Academic Sharing Notes",
        year: 2026,
        type: "OTHER",
        sortOrder: 0,
      },
    });

    await prisma.personApplication.deleteMany({ where: { personId: averyId } });
    await prisma.personApplication.createMany({
      data: [
        {
          personId: averyId,
          name: "Outline Studio",
          kind: "Web Application",
          summary:
            "A lightweight tool for turning scattered notes into chapter outlines.",
          url: "https://example.com",
          imageUrl: UPLOAD.appCover,
          updatedAtLabel: "Updated 2026-06-01",
          note: "Online demo available",
          sortOrder: 0,
        },
        {
          personId: averyId,
          name: "Series Board",
          kind: "Web Application",
          summary:
            "Plan multi-chapter tutorials with outcomes, checkpoints, and review status.",
          imageUrl: UPLOAD.appCover2,
          updatedAtLabel: "Updated 2026-07-01",
          sortOrder: 1,
        },
      ],
    });
  }

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
