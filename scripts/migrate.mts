// Applies the SQL migrations in ./drizzle.
// With DATABASE_URL (Neon, and on every Vercel build) it migrates that database;
// without it, the local embedded database in .pglite.
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";

const migrationsFolder = "./drizzle";
// Migrations want a direct connection; Vercel's Neon integration provides both.
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (url) {
  const pool = new Pool({ connectionString: url });
  await migrate(drizzle({ client: pool }), { migrationsFolder });
  await pool.end();
  console.log("Migrations applied to the Neon database.");
} else if (process.env.VERCEL) {
  console.error("DATABASE_URL is not set on Vercel. Connect the Neon database to this project (Storage tab).");
  process.exit(1);
} else {
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle: drizzlePglite } = await import("drizzle-orm/pglite");
  const { migrate: migratePglite } = await import("drizzle-orm/pglite/migrator");
  const client = new PGlite(".pglite");
  await migratePglite(drizzlePglite({ client }), { migrationsFolder });
  await client.close();
  console.log("Migrations applied to the local database in .pglite.");
}
