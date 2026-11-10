import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { getDb, type Db } from "@/db";
import * as schema from "@/db/schema";
import { hashPassword, verifyPassword } from "./password";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

// Where the site is served. Set BETTER_AUTH_URL to override; otherwise Vercel's own URLs are used.
function siteUrl() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

// Takes the database so tests can run the exact same configuration against their own Postgres.
export function createAuth(db: Db) {
  return betterAuth({
    appName: "Aqdi",
    baseURL: siteUrl(),
    // BETTER_AUTH_SECRET signs session cookies; Better Auth refuses to run in production without it.
    database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
      password: { hash: hashPassword, verify: verifyPassword },
    },
    // Stay logged in between visits: a session lasts 30 days and is extended once a day while in use.
    session: { expiresIn: THIRTY_DAYS, updateAge: 60 * 60 * 24 },
    advanced: { database: { generateId: () => crypto.randomUUID() } },
    // Must stay last: applies cookies that server actions set.
    plugins: [nextCookies()],
  });
}

let instance: ReturnType<typeof createAuth> | undefined;

// Built on first use so nothing touches the database at build time.
export function getAuth() {
  if (!instance) instance = createAuth(getDb());
  return instance;
}
