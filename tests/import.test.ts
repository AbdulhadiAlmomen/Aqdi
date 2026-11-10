import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { tenants, users } from "@/db/schema";
import { draftFromExtraction } from "@/lib/contracts/checks";
import { asExtraction } from "@/lib/contracts/mock-extractor";
import { DuplicateContractError, saveImportedContract } from "@/lib/contracts/save";
import { createOfficeWithAdmin, forOffice } from "@/lib/offices";
import sample1 from "@/samples/expected/sample-1.json";
import sample2 from "@/samples/expected/sample-2.json";
import { createTestDb } from "./test-db";

// Read (mocked as a perfect read) → review draft → save, on a real Postgres.
describe("contract import", () => {
  let t: Awaited<ReturnType<typeof createTestDb>>;
  let a: string, b: string;

  beforeAll(async () => {
    t = await createTestDb();
    await t.db.insert(users).values([
      { id: "ua", name: "A", email: "a@example.test" },
      { id: "ub", name: "B", email: "b@example.test" },
    ]);
    a = (await createOfficeWithAdmin(t.db, "ua", "Office A")).id;
    b = (await createOfficeWithAdmin(t.db, "ub", "Office B")).id;
  });
  afterAll(() => t.close());

  it("saves both samples as two buildings, two units, two contracts", async () => {
    for (const s of [sample1, sample2]) await saveImportedContract(t.db, a, draftFromExtraction(asExtraction(s)).draft);
    const office = forOffice(t.db, a);
    expect(await office.contractCount()).toBe(2);
    const buildings = await office.buildingsOverview();
    expect(buildings).toHaveLength(2);
    expect(buildings.map((x) => x.unitCount)).toEqual([1, 1]);
    const list = await office.contracts();
    expect(list.map((c) => c.contractNumber).sort()).toEqual([sample1.contractNumber, sample2.contractNumber].sort());
  });

  it("keeps only the last 4 digits of the tenant ID", async () => {
    const rows = await t.db.select().from(tenants);
    expect(rows.map((r) => r.idLast4).sort()).toEqual(["4561", "6590"]);
    expect(JSON.stringify(rows)).not.toContain(sample1.tenantIdNumber);
    expect(JSON.stringify(rows)).not.toContain(sample2.tenantIdNumber);
  });

  it("refuses the same contract twice in one office", async () => {
    await expect(saveImportedContract(t.db, a, draftFromExtraction(asExtraction(sample1)).draft)).rejects.toBeInstanceOf(DuplicateContractError);
    expect(await forOffice(t.db, a).hasContractNumber(sample1.contractNumber)).toBe(true);
  });

  it("another office can import the same contract number and never sees office A's data", async () => {
    expect(await forOffice(t.db, b).contracts()).toEqual([]);
    expect(await forOffice(t.db, b).hasContractNumber(sample1.contractNumber)).toBe(false);
    await saveImportedContract(t.db, b, draftFromExtraction(asExtraction(sample1)).draft);
    expect(await forOffice(t.db, b).contractCount()).toBe(1);
    expect(await forOffice(t.db, b).buildingsOverview()).toHaveLength(1);
    expect(await forOffice(t.db, a).contractCount()).toBe(2);
  });

  it("a second contract in the same unit reuses the building and unit", async () => {
    const renewal = draftFromExtraction(asExtraction({ ...sample1, contractNumber: "20512847999" })).draft;
    await saveImportedContract(t.db, a, renewal);
    const buildings = await forOffice(t.db, a).buildingsOverview();
    expect(buildings).toHaveLength(2);
    expect(buildings.find((x) => x.deedNumber === sample1.deedNumber)?.contractCount).toBe(2);
  });
});
