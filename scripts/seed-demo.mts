// Creates or repairs the demo account (lib/demo.ts). Safe to run any number of times.
// With DATABASE_URL it seeds that database (Neon); without it, the local embedded database in .pglite.
// Vercel runs it on every production build, right after the migrations.
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "../db/schema.ts";
import type { Db } from "../db/index.ts";
import { seedDemo } from "../lib/demo.ts";

if (process.env.VERCEL && process.env.VERCEL_ENV !== "production") {
  console.log("Demo seed skipped: not a production build.");
  process.exit(0);
}

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
let db: Db;
let close: () => Promise<unknown>;
if (url) {
  const pool = new Pool({ connectionString: url });
  db = drizzle({ client: pool, schema });
  close = () => pool.end();
} else {
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle: drizzlePglite } = await import("drizzle-orm/pglite");
  const client = new PGlite(".pglite");
  db = drizzlePglite({ client, schema }) as unknown as Db;
  close = () => client.close();
}

const result = await seedDemo(db);
await close();
console.log(`Demo account ready on ${url ? "the Neon database" : "the local database"}:`, result);
