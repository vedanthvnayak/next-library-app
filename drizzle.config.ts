import { defineConfig } from "drizzle-kit";
import { AppEnvs } from "@/db/read-env";

export default defineConfig({
  schema: "./db/drizzle",
  out: "./db/drizzle/migration",
  dialect: "mysql",
  dbCredentials: {
    url: AppEnvs.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
});
