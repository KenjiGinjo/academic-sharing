"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PublicationType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signOut } from "@/lib/auth";
import {
  ensureUniquePersonSlug,
  initialsFromName,
  parseTags,
  slugify,
} from "@/lib/content";
import {
  assertCanEditPerson,
  assertCanEditPost,
  isAdmin,
  isAuthor,
  requireAdmin,
  requireUser,
} from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

function optionalString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim() || null;
}

function parseYear(raw: string) {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : null;
}

async function replaceAcademicData(personId: string, formData: FormData) {
  const interestLabels = formData
    .getAll("interestLabel")
    .map(String)
    .map((label) => label.trim())
    .filter(Boolean);

  const pubTitles = formData.getAll("pubTitle").map(String);
  const pubAuthors = formData.getAll("pubAuthors").map(String);
  const pubVenues = formData.getAll("pubVenue").map(String);
  const pubYears = formData.getAll("pubYear").map(String);
  const pubTypes = formData.getAll("pubType").map(String);
  const pubUrls = formData.getAll("pubUrl").map(String);
  const pubDois = formData.getAll("pubDoi").map(String);
  const pubHighlights = formData.getAll("pubHighlightFlag").map(String);

  const publications = pubTitles
    .map((title, index) => ({
      title: title.trim(),
      authors: (pubAuthors[index] ?? "").trim(),
      venue: (pubVenues[index] ?? "").trim(),
      year: parseYear(pubYears[index] ?? ""),
      type: (pubTypes[index] ?? "OTHER") as PublicationType,
      url: (pubUrls[index] ?? "").trim() || null,
      doi: (pubDois[index] ?? "").trim() || null,
      highlight: pubHighlights[index] === "1",
      sortOrder: index,
    }))
    .filter((item) => item.title);

  const compNames = formData.getAll("compName").map(String);
  const compAwards = formData.getAll("compAward").map(String);
  const compYears = formData.getAll("compYear").map(String);
  const compDescriptions = formData.getAll("compDescription").map(String);
  const compUrls = formData.getAll("compUrl").map(String);
  const competitions = compNames
    .map((name, index) => ({
      name: name.trim(),
      award: (compAwards[index] ?? "").trim() || null,
      year: parseYear(compYears[index] ?? ""),
      description: (compDescriptions[index] ?? "").trim() || null,
      url: (compUrls[index] ?? "").trim() || null,
      sortOrder: index,
    }))
    .filter((item) => item.name);

  const appNames = formData.getAll("appName").map(String);
  const appKinds = formData.getAll("appKind").map(String);
  const appSummaries = formData.getAll("appSummary").map(String);
  const appUrls = formData.getAll("appUrl").map(String);
  const appImageUrls = formData.getAll("appImageUrl").map(String);
  const appNotes = formData.getAll("appNote").map(String);
  const appUpdated = formData.getAll("appUpdatedAtLabel").map(String);
  const applications = appNames
    .map((name, index) => ({
      name: name.trim(),
      kind: (appKinds[index] ?? "").trim() || null,
      summary: (appSummaries[index] ?? "").trim(),
      url: (appUrls[index] ?? "").trim() || null,
      imageUrl: (appImageUrls[index] ?? "").trim() || null,
      note: (appNotes[index] ?? "").trim() || null,
      updatedAtLabel: (appUpdated[index] ?? "").trim() || null,
      sortOrder: index,
    }))
    .filter((item) => item.name && item.summary);

  const patentTitles = formData.getAll("patentTitle").map(String);
  const patentStatuses = formData.getAll("patentStatus").map(String);
  const patentNumbers = formData.getAll("patentNumber").map(String);
  const patentYears = formData.getAll("patentYear").map(String);
  const patentDescriptions = formData.getAll("patentDescription").map(String);
  const patentUrls = formData.getAll("patentUrl").map(String);
  const patents = patentTitles
    .map((title, index) => ({
      title: title.trim(),
      status: (patentStatuses[index] ?? "").trim() || null,
      number: (patentNumbers[index] ?? "").trim() || null,
      year: parseYear(patentYears[index] ?? ""),
      description: (patentDescriptions[index] ?? "").trim() || null,
      url: (patentUrls[index] ?? "").trim() || null,
      sortOrder: index,
    }))
    .filter((item) => item.title);

  await prisma.$transaction([
    prisma.personInterest.deleteMany({ where: { personId } }),
    prisma.personPublication.deleteMany({ where: { personId } }),
    prisma.personCompetition.deleteMany({ where: { personId } }),
    prisma.personApplication.deleteMany({ where: { personId } }),
    prisma.personPatent.deleteMany({ where: { personId } }),
  ]);

  if (interestLabels.length) {
    await prisma.personInterest.createMany({
      data: interestLabels.map((label, sortOrder) => ({
        personId,
        label,
        sortOrder,
      })),
    });
  }
  if (publications.length) {
    await prisma.personPublication.createMany({
      data: publications.map((item) => ({ personId, ...item })),
    });
  }
  if (competitions.length) {
    await prisma.personCompetition.createMany({
      data: competitions.map((item) => ({ personId, ...item })),
    });
  }
  if (applications.length) {
    await prisma.personApplication.createMany({
      data: applications.map((item) => ({ personId, ...item })),
    });
  }
  if (patents.length) {
    await prisma.personPatent.createMany({
      data: patents.map((item) => ({ personId, ...item })),
    });
  }
}

function readProfileFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const roleTitle = String(formData.get("role") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const about = optionalString(formData, "about");
  const initials =
    String(formData.get("initials") ?? "").trim() || initialsFromName(name);
  const avatarUrl = optionalString(formData, "avatarUrl");
  const github = optionalString(formData, "github");
  const website = optionalString(formData, "website");
  const x = optionalString(formData, "x");
  const emailPublic = optionalString(formData, "emailPublic");
  const googleScholar = optionalString(formData, "googleScholar");
  const cvUrl = optionalString(formData, "cvUrl");
  const profileEnabled = formData.get("profileEnabled") === "on";
  const slugInput = String(formData.get("slug") ?? "").trim();

  return {
    name,
    roleTitle,
    bio,
    about,
    initials,
    avatarUrl,
    github,
    website,
    x,
    emailPublic,
    googleScholar,
    cvUrl,
    profileEnabled,
    slugInput,
  };
}

function revalidatePersonPaths(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/people");
  revalidatePath("/admin/people");
  revalidatePath("/admin/profile");
  if (slug) revalidatePath(`/people/${slug}`);
}

/** Admin creates/updates a fixed author: Person profile + login User. */
export async function saveAuthorAction(formData: FormData) {
  await requireAdmin();

  const personId = String(formData.get("id") ?? "");
  const fields = readProfileFields(formData);
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const active = formData.get("active") === "on";

  if (!fields.name || !fields.roleTitle || !fields.bio || !email) {
    throw new Error("Name, role, bio, and email are required.");
  }

  const slug = await ensureUniquePersonSlug(
    fields.slugInput || fields.name,
    personId || undefined,
  );

  const profileData = {
    name: fields.name,
    slug,
    role: fields.roleTitle,
    bio: fields.bio,
    about: fields.about,
    initials: fields.initials,
    avatarUrl: fields.avatarUrl,
    sortOrder,
    github: fields.github,
    website: fields.website,
    x: fields.x,
    emailPublic: fields.emailPublic,
    googleScholar: fields.googleScholar,
    cvUrl: fields.cvUrl,
    profileEnabled: fields.profileEnabled,
  };

  if (personId) {
    const existing = await prisma.person.findUnique({
      where: { id: personId },
      include: { user: true },
    });
    if (!existing) throw new Error("Author not found.");

    const emailOwner = await prisma.user.findUnique({ where: { email } });
    if (emailOwner && emailOwner.personId !== personId) {
      throw new Error("Email already in use.");
    }

    await prisma.$transaction(async (tx) => {
      await tx.person.update({
        where: { id: personId },
        data: profileData,
      });

      const userData: {
        email: string;
        name: string;
        active: boolean;
        passwordHash?: string;
      } = {
        email,
        name: fields.name,
        active,
      };
      if (password) {
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }
        userData.passwordHash = await bcrypt.hash(password, 10);
      }

      if (existing.user) {
        await tx.user.update({
          where: { id: existing.user.id },
          data: userData,
        });
      } else {
        if (!password) {
          throw new Error("Password is required when creating a login.");
        }
        await tx.user.create({
          data: {
            email,
            name: fields.name,
            role: "AUTHOR",
            active,
            personId,
            passwordHash: userData.passwordHash!,
          },
        });
      }
    });

    await replaceAcademicData(personId, formData);
    revalidatePersonPaths(slug);
    redirect(`/admin/people/${personId}`);
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }
  const emailOwner = await prisma.user.findUnique({ where: { email } });
  if (emailOwner) throw new Error("Email already in use.");

  const passwordHash = await bcrypt.hash(password, 10);
  const created = await prisma.$transaction(async (tx) => {
    const person = await tx.person.create({ data: profileData });
    await tx.user.create({
      data: {
        email,
        name: fields.name,
        role: "AUTHOR",
        active,
        personId: person.id,
        passwordHash,
      },
    });
    return person;
  });

  await replaceAcademicData(created.id, formData);
  revalidatePersonPaths(slug);
  redirect(`/admin/people/${created.id}`);
}

/** Author updates own academic profile (no login account fields). */
export async function saveOwnProfileAction(formData: FormData) {
  const session = await requireUser();
  const personId = String(formData.get("id") ?? "");
  if (!personId) throw new Error("Profile id required.");
  await assertCanEditPerson(session, personId);

  const fields = readProfileFields(formData);
  if (!fields.name || !fields.roleTitle || !fields.bio) {
    throw new Error("Name, role, and bio are required.");
  }

  const slug = await ensureUniquePersonSlug(
    fields.slugInput || fields.name,
    personId,
  );

  await prisma.person.update({
    where: { id: personId },
    data: {
      name: fields.name,
      slug,
      role: fields.roleTitle,
      bio: fields.bio,
      about: fields.about,
      initials: fields.initials,
      avatarUrl: fields.avatarUrl,
      github: fields.github,
      website: fields.website,
      x: fields.x,
      emailPublic: fields.emailPublic,
      googleScholar: fields.googleScholar,
      cvUrl: fields.cvUrl,
      profileEnabled: fields.profileEnabled,
    },
  });

  await replaceAcademicData(personId, formData);
  revalidatePersonPaths(slug);
  redirect("/admin/profile");
}

export async function deleteAuthorAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const person = await prisma.person.findUnique({ where: { id } });
  await prisma.person.delete({ where: { id } });

  revalidatePersonPaths(person?.slug);
  redirect("/admin/people");
}

export async function saveBlogAction(formData: FormData) {
  const session = await requireUser();
  const id = String(formData.get("id") ?? "");

  if (id) {
    await assertCanEditPost(session, id);
  } else if (isAuthor(session) && !session.user.personId) {
    throw new Error("Author profile is missing. Ask an admin to fix your account.");
  }

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || title);
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const tags = parseTags(String(formData.get("tags") ?? ""));
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";
  const publishedAtRaw = String(formData.get("publishedAt") ?? "");
  const publishedAt = publishedAtRaw
    ? new Date(publishedAtRaw)
    : published
      ? new Date()
      : null;

  let authorId: string | null;
  if (isAdmin(session)) {
    authorId = String(formData.get("authorId") ?? "") || null;
  } else {
    authorId = session.user.personId;
  }

  if (!title || !slug || !excerpt) {
    throw new Error("Title, slug, and excerpt are required.");
  }

  const data = {
    type: "BLOG" as const,
    title,
    slug,
    excerpt,
    content,
    tags,
    authorId,
    published,
    featured,
    publishedAt: published ? publishedAt : null,
  };

  if (id) {
    await prisma.post.update({ where: { id }, data });
  } else {
    await prisma.post.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blogs");
  redirect("/admin/blogs");
}

export async function deleteBlogAction(formData: FormData) {
  const session = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await assertCanEditPost(session, id);
  await prisma.post.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
  redirect("/admin/blogs");
}

export async function saveTutorialAction(formData: FormData) {
  const session = await requireUser();
  const id = String(formData.get("id") ?? "");

  if (id) {
    await assertCanEditPost(session, id);
  } else if (!isAdmin(session) && !session.user.personId) {
    throw new Error("Author profile is missing. Ask an admin to fix your account.");
  }

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || title);
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const level = String(formData.get("level") ?? "Beginner") as
    | "Beginner"
    | "Intermediate"
    | "Advanced";
  const tags = parseTags(String(formData.get("tags") ?? ""));
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";
  const publishedAtRaw = String(formData.get("publishedAt") ?? "");
  const publishedAt = publishedAtRaw
    ? new Date(publishedAtRaw)
    : published
      ? new Date()
      : null;

  let authorId: string | null;
  if (isAdmin(session)) {
    authorId = String(formData.get("authorId") ?? "") || null;
  } else {
    authorId = session.user.personId;
  }

  const chapterTitles = formData.getAll("chapterTitle").map(String);
  const chapterSlugs = formData.getAll("chapterSlug").map(String);
  const chapterContents = formData.getAll("chapterContent").map(String);

  const chapters = chapterTitles
    .map((chapterTitle, index) => {
      const chapterSlug =
        slugify(chapterSlugs[index] || chapterTitle) || `chapter-${index + 1}`;
      return {
        title: chapterTitle.trim(),
        slug: chapterSlug,
        content: chapterContents[index] ?? "",
        sortOrder: index,
      };
    })
    .filter((chapter) => chapter.title);

  if (!title || !slug || !excerpt) {
    throw new Error("Title, slug, and description are required.");
  }

  if (id) {
    await prisma.$transaction(async (tx) => {
      await tx.tutorialChapter.deleteMany({ where: { postId: id } });
      await tx.post.update({
        where: { id },
        data: {
          type: "TUTORIAL",
          title,
          slug,
          excerpt,
          level,
          tags,
          authorId,
          published,
          featured,
          publishedAt: published ? publishedAt : null,
          chapters: { create: chapters },
        },
      });
    });
  } else {
    await prisma.post.create({
      data: {
        type: "TUTORIAL",
        slug,
        title,
        excerpt,
        level,
        tags,
        authorId,
        published,
        featured,
        publishedAt: published ? publishedAt : null,
        chapters: { create: chapters },
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/tutorial");
  revalidatePath(`/tutorial/${slug}`);
  revalidatePath("/admin/tutorials");
  redirect("/admin/tutorials");
}

export async function deleteTutorialAction(formData: FormData) {
  const session = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await assertCanEditPost(session, id);
  await prisma.post.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/tutorial");
  revalidatePath("/admin/tutorials");
  redirect("/admin/tutorials");
}
