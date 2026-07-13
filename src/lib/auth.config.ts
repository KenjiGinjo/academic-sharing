import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config (no Prisma / bcrypt / Node-only deps).
 * Shared callbacks with auth.ts; middleware should import ONLY this file.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
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
        session.user.role =
          token.role === "ADMIN" || token.role === "AUTHOR"
            ? token.role
            : "AUTHOR";
        session.user.personId =
          typeof token.personId === "string" ? token.personId : null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
