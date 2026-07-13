import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // authorize runs in Node (API route), Prisma is OK here
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });
        if (!user || !user.active) return null;

        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? (user.role === "ADMIN" ? "Admin" : "Author"),
          role: user.role,
          personId: user.personId,
        };
      },
    }),
  ],
  callbacks: {
    /**
     * IMPORTANT: jwt also runs in Edge middleware.
     * Do NOT call Prisma here — only copy claims from the user object at sign-in.
     */
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role as UserRole;
        token.personId = user.personId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.email = (token.email as string) ?? session.user.email;
        session.user.name =
          typeof token.name === "string" ? token.name : session.user.name;
        session.user.role = (token.role as UserRole) ?? "AUTHOR";
        session.user.personId =
          typeof token.personId === "string" ? token.personId : null;
      }
      return session;
    },
  },
});
