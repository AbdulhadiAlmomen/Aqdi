import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { accounts, installments, users } from "@/db/schema";
import { createAuth } from "@/lib/auth";
import { DEMO_EMAIL, DEMO_OFFICE_NAME, DEMO_PASSWORD, seedDemo } from "@/lib/demo";
import { findMembership, forOffice } from "@/lib/offices";
import { createTestDb } from "./test-db";

describe("demo account seed", () => {
  let t: Awaited<ReturnType<typeof createTestDb>>;
  const today = new Date(Date.UTC(2026, 10, 10));
  beforeAll(async () => {
    t = await createTestDb();
  });
  afterAll(() => t.close());

  it("creates a verified, paid demo office with sample data", async () => {
    expect(await seedDemo(t.db, today)).toEqual({ userCreated: true, passwordReset: false, officeCreated: true, sampleDataAdded: true });
    const [user] = await t.db.select().from(users).where(eq(users.email, DEMO_EMAIL));
    expect(user.emailVerified).toBe(true);
    const member = (await findMembership(t.db, user.id))!;
    expect(member).toMatchObject({ officeName: DEMO_OFFICE_NAME, role: "admin" });
    const office = forOffice(t.db, member.officeId);
    expect(await office.office()).toMatchObject({ paid: true, paidUnits: 10 });
    expect((await office.buildingsOverview()).length).toBe(2);
    expect(await office.unitCount()).toBe(10);
    const list = await office.contracts();
    expect(list.length).toBe(6);
    // Different stages relative to today: ended, running, ending soon, not started.
    const now = "2026-11-10";
    expect(list.some((c) => c.endDate < now)).toBe(true);
    expect(list.some((c) => c.startDate > now)).toBe(true);
    expect(list.some((c) => c.endDate >= now && c.endDate <= "2026-12-10")).toBe(true);
    expect(list.filter((c) => c.startDate <= now && c.endDate >= now).length).toBeGreaterThanOrEqual(3);
  });

  it("installments add up to each contract's annual rent", async () => {
    const rows = await t.db.select().from(installments);
    const sums = new Map<string, number>();
    for (const r of rows) sums.set(r.contractId, (sums.get(r.contractId) ?? 0) + Number(r.amount));
    const [user] = await t.db.select().from(users).where(eq(users.email, DEMO_EMAIL));
    const list = await forOffice(t.db, (await findMembership(t.db, user.id))!.officeId).contracts();
    for (const c of list) expect(sums.get(c.id)).toBe(Number(c.annualRent));
  });

  it("logs in through the normal login", async () => {
    const auth = createAuth(t.db);
    const res = await auth.api.signInEmail({ body: { email: DEMO_EMAIL, password: DEMO_PASSWORD } });
    expect(res.user.email).toBe(DEMO_EMAIL);
  });

  it("running it again changes nothing and duplicates nothing", async () => {
    expect(await seedDemo(t.db, today)).toEqual({ userCreated: false, passwordReset: false, officeCreated: false, sampleDataAdded: false });
    const [user] = await t.db.select().from(users).where(eq(users.email, DEMO_EMAIL));
    const office = forOffice(t.db, (await findMembership(t.db, user.id))!.officeId);
    expect(await office.unitCount()).toBe(10);
    expect((await office.contracts()).length).toBe(6);
  });

  it("repairs the password and paid status if they were changed", async () => {
    const [user] = await t.db.select().from(users).where(eq(users.email, DEMO_EMAIL));
    await t.db.update(accounts).set({ password: "not-a-hash" }).where(eq(accounts.userId, user.id));
    const officeId = (await findMembership(t.db, user.id))!.officeId;
    const { markOfficeCancelled } = await import("@/lib/billing");
    await markOfficeCancelled(t.db, officeId);
    expect((await seedDemo(t.db, today)).passwordReset).toBe(true);
    expect((await forOffice(t.db, officeId).office())?.paid).toBe(true);
    const auth = createAuth(t.db);
    expect((await auth.api.signInEmail({ body: { email: DEMO_EMAIL, password: DEMO_PASSWORD } })).user.email).toBe(DEMO_EMAIL);
  });
});
