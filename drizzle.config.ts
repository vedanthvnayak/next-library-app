import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/drizzle",
  out: "./db/drizzle/migration",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
});
