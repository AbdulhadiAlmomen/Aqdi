import { defineConfig } from "drizzle-kit";

// Only used to generate SQL migrations from db/schema.ts (`npm run db:generate`).
// Applying them is scripts/migrate.mts.
export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
});
