"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { signOut } from "@/lib/auth";
import { initialsFromName, parseTags, slugify } from "@/lib/content";
import {
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

/** Admin creates/updates a fixed author: Person profile + login User. */
export async function saveAuthorAction(formData: FormData) {
  await requireAdmin();

  const personId = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const roleTitle = String(formData.get("role") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const initials =
    String(formData.get("initials") ?? "").trim() || initialsFromName(name);
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim() || null;
  const github = String(formData.get("github") ?? "").trim() || null;
  const website = String(formData.get("website") ?? "").trim() || null;
  const x = String(formData.get("x") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const active = formData.get("active") === "on";

  if (!name || !roleTitle || !bio || !email) {
    throw new Error("Name, role, bio, and email are required.");
  }

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
        data: {
          name,
          role: roleTitle,
          bio,
          initials,
          avatarUrl,
          sortOrder,
          github,
          website,
          x,
        },
      });

      const userData: {
        email: string;
        name: string;
        active: boolean;
        passwordHash?: string;
      } = {
        email,
        name,
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
            name,
            role: "AUTHOR",
            active,
            personId,
            passwordHash: userData.passwordHash!,
          },
        });
      }
    });
  } else {
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
    const emailOwner = await prisma.user.findUnique({ where: { email } });
    if (emailOwner) throw new Error("Email already in use.");

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.$transaction(async (tx) => {
      const person = await tx.person.create({
        data: {
          name,
          role: roleTitle,
          bio,
          initials,
          avatarUrl,
          sortOrder,
          github,
          website,
          x,
        },
      });
      await tx.user.create({
        data: {
          email,
          name,
          role: "AUTHOR",
          active,
          personId: person.id,
          passwordHash,
        },
      });
    });
  }

  revalidatePath("/");
  revalidatePath("/people");
  revalidatePath("/admin/people");
  redirect("/admin/people");
}

export async function deleteAuthorAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  // Cascade: User.personId onDelete Cascade deletes user when person is deleted
  await prisma.person.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/people");
  revalidatePath("/admin/people");
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
          publishedAt: published ? publishedAt : null,
          chapters: { create: chapters },
        },
      });
    });
  } else {
    await prisma.post.create({
      data: {
        type: "TUTORIAL",
        title,
        slug,
        excerpt,
        level,
        tags,
        authorId,
        published,
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
