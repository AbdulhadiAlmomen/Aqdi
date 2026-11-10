import { Pool } from "@neondatabase/serverless";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

export type Db = NeonDatabase<typeof schema>;

// Folder for the embedded Postgres used in local development when DATABASE_URL isn't set.
export const LOCAL_DB_DIR = ".pglite";

let instance: Db | undefined;

// Created on first use, so builds and static pages never need a database connection.
export function getDb(): Db {
  if (!instance) instance = connect();
  return instance;
}

function connect(): Db {
  const url = process.env.DATABASE_URL;
  if (url) return drizzle({ client: new Pool({ connectionString: url }), schema });
  if (process.env.NODE_ENV === "production" && !process.env.AQDI_LOCAL_DB) {
    throw new Error("DATABASE_URL is not set. Connect the Neon database to this Vercel project.");
  }
  // Local development without Neon: real Postgres running in-process (PGlite), stored on disk.
  // Same SQL and the same query builder, so behaviour matches production.
  /* eslint-disable @typescript-eslint/no-require-imports */
  const { PGlite } = require("@electric-sql/pglite");
  const { drizzle: drizzlePglite } = require("drizzle-orm/pglite");
  /* eslint-enable @typescript-eslint/no-require-imports */
  return drizzlePglite({ client: new PGlite(LOCAL_DB_DIR), schema }) as Db;
}
