import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AppSession = Session & {
  user: NonNullable<Session["user"]> & {
    id: string;
    role: "ADMIN" | "AUTHOR";
    personId: string | null;
  };
};

export async function requireUser(): Promise<AppSession> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/admin/login");
  }
  return session as AppSession;
}

export async function requireAdmin(): Promise<AppSession> {
  const session = await requireUser();
  if (session.user.role !== "ADMIN") {
    redirect("/admin");
  }
  return session;
}

export function isAdmin(session: AppSession) {
  return session.user.role === "ADMIN";
}

export function isAuthor(session: AppSession) {
  return session.user.role === "AUTHOR";
}

/** Authors can only touch posts under their linked Person profile. */
export async function assertCanEditPost(session: AppSession, postId: string) {
  if (isAdmin(session)) return;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });
  if (!post) {
    redirect("/admin");
  }
  if (!session.user.personId || post.authorId !== session.user.personId) {
    redirect("/admin");
  }
}

export function authorScope(session: AppSession) {
  if (isAdmin(session)) return {};
  return { authorId: session.user.personId ?? "__none__" };
}
