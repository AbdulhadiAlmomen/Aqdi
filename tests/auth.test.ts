import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { accounts, users } from "@/db/schema";
import { createAuth } from "@/lib/auth";
import { createTestDb } from "./test-db";

// The real auth configuration, against a throwaway Postgres.
describe("email + password accounts", () => {
  let t: Awaited<ReturnType<typeof createTestDb>>;
  let auth: ReturnType<typeof createAuth>;
  const email = "owner@example.test";
  const password = "correct horse battery";

  beforeAll(async () => {
    process.env.BETTER_AUTH_SECRET ??= "test-secret-test-secret-test-secret-123";
    t = await createTestDb();
    auth = createAuth(t.db);
  });

  afterAll(() => t.close());

  it("signs up into the users table and stores an argon2id hash, never the password", async () => {
    const result = await auth.api.signUpEmail({ body: { name: "Office Owner", email, password } });
    expect(result.user.email).toBe(email);

    const [row] = await t.db.select().from(users).where(eq(users.email, email));
    expect(row.name).toBe("Office Owner");

    const [account] = await t.db.select().from(accounts).where(eq(accounts.userId, row.id));
    expect(account.password).toMatch(/^\$argon2id\$/);
    expect(account.password).not.toContain(password);
  });

  it("refuses a second account with the same email", async () => {
    await expect(auth.api.signUpEmail({ body: { name: "Someone", email, password } })).rejects.toMatchObject({
      body: { code: expect.stringMatching(/^USER_ALREADY_EXISTS/) },
    });
  });

  it("logs in with the right password and returns a working session", async () => {
    const res = await auth.api.signInEmail({ body: { email, password }, asResponse: true });
    expect(res.status).toBe(200);
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toMatch(/HttpOnly/i);

    const session = await auth.api.getSession({ headers: new Headers({ cookie: cookie.split(";")[0] }) });
    expect(session?.user.email).toBe(email);
  });

  it("rejects a wrong password", async () => {
    await expect(auth.api.signInEmail({ body: { email, password: "wrong password!" } })).rejects.toMatchObject({
      body: { code: "INVALID_EMAIL_OR_PASSWORD" },
    });
  });

  it("logging out ends the session", async () => {
    const res = await auth.api.signInEmail({ body: { email, password }, asResponse: true });
    const headers = new Headers({ cookie: (res.headers.get("set-cookie") ?? "").split(";")[0] });
    await auth.api.signOut({ headers });
    expect(await auth.api.getSession({ headers })).toBeNull();
  });
});
