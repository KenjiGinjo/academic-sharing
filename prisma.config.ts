import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // Migrations/push should use the direct (non-pooler) URL on Neon
    url: process.env.DIRECT_URL ?? env("DATABASE_URL"),
  },
});
