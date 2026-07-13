import type { DefaultSession } from "next-auth";

export type AppRole = "ADMIN" | "AUTHOR";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: AppRole;
      personId: string | null;
    };
  }

  interface User {
    role: AppRole;
    personId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppRole;
    personId?: string | null;
  }
}
