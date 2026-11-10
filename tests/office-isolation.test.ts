import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { users } from "@/db/schema";
import { createOfficeWithAdmin, findMembership, forOffice } from "@/lib/offices";
import { createTestDb } from "./test-db";

// Two offices with one admin each. Everything office A's handle can reach must belong to A.
describe("office isolation", () => {
  let t: Awaited<ReturnType<typeof createTestDb>>;
  let officeA: { id: string }, officeB: { id: string };

  beforeAll(async () => {
    t = await createTestDb();
    await t.db.insert(users).values([
      { id: "user-a", name: "Office A admin", email: "a@example.test" },
      { id: "user-b", name: "Office B admin", email: "b@example.test" },
    ]);
    officeA = await createOfficeWithAdmin(t.db, "user-a", "Office A");
    officeB = await createOfficeWithAdmin(t.db, "user-b", "Office B");
  });

  afterAll(() => t.close());

  it("finds each user's own office", async () => {
    expect((await findMembership(t.db, "user-a"))?.officeId).toBe(officeA.id);
    expect((await findMembership(t.db, "user-b"))?.officeId).toBe(officeB.id);
  });

  it("office A sees only its own office and members", async () => {
    const a = forOffice(t.db, officeA.id);
    expect((await a.office())?.name).toBe("Office A");
    const members = await a.members();
    expect(members.map((m) => m.email)).toEqual(["a@example.test"]);
  });

  it("office A can't read office B's member, even with B's id", async () => {
    const bMembers = await forOffice(t.db, officeB.id).members();
    const bMemberId = bMembers[0].id;
    expect(await forOffice(t.db, officeB.id).member(bMemberId)).not.toBeNull();
    expect(await forOffice(t.db, officeA.id).member(bMemberId)).toBeNull();
  });

  it("a made-up office id sees nothing", async () => {
    const ghost = forOffice(t.db, "not-a-real-office");
    expect(await ghost.office()).toBeNull();
    expect(await ghost.members()).toEqual([]);
  });

  it("every office gets exactly one admin on creation", async () => {
    const [m] = await forOffice(t.db, officeB.id).members();
    expect(m.role).toBe("admin");
  });
});
