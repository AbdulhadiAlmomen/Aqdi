// The demo account: demo@demo.com / password123!, a paid office with made-up buildings, units and
// contracts. seedDemo() is safe to run any number of times (it runs on every production build):
// it makes sure the login works and the office is paid, and adds the sample data only to an empty
// office, so anything imported during a demo stays.
//
// Imports use relative paths with extensions so Node can run this file directly (scripts/seed-demo.mts).
import { and, count, eq } from "drizzle-orm";
import type { Db } from "../db/index.ts";
import { accounts, buildings, contracts, installments, memberships, offices, tenants, units, users } from "../db/schema.ts";
import { hashPassword, verifyPassword } from "./password.ts";

export const DEMO_EMAIL = "demo@demo.com";
export const DEMO_PASSWORD = "password123!";
export const DEMO_OFFICE_NAME = "مكتب تجريبي · Demo Office";
const DEMO_NAME = "Demo Admin";

type Cycle = "monthly" | "quarterly" | "semi_annual" | "annual";
const INSTALLMENTS_PER_YEAR: Record<Cycle, number> = { monthly: 12, quarterly: 4, semi_annual: 2, annual: 1 };

// All names, numbers and addresses are made up.
const BUILDINGS = [
  {
    key: "narjis",
    city: "Riyadh", district: "Al Narjis", street: "Anas Ibn Malik Rd", buildingNumber: "7421",
    postalCode: "13326", additionalNumber: "3184", deedNumber: "990000000101",
    units: [
      { number: "101", type: "Apartment", floor: "1", area: "120" },
      { number: "102", type: "Apartment", floor: "1", area: "135" },
      { number: "201", type: "Apartment", floor: "2", area: "120" },
      { number: "202", type: "Apartment", floor: "2", area: "135" },
      { number: "301", type: "Apartment", floor: "3", area: "160" },
      { number: "302", type: "Apartment", floor: "3", area: "160" },
    ],
  },
  {
    key: "olaya",
    city: "Riyadh", district: "Al Olaya", street: "Olaya St", buildingNumber: "2956",
    postalCode: "12241", additionalNumber: "7710", deedNumber: "990000000202",
    units: [
      { number: "S1", type: "Shop", floor: "G", area: "85" },
      { number: "S2", type: "Shop", floor: "G", area: "70" },
      { number: "O1", type: "Office", floor: "1", area: "110" },
      { number: "O2", type: "Office", floor: "1", area: "95" },
    ],
  },
] as const;

// Contracts at different stages, dated relative to the day the office is seeded (months from today).
const CONTRACTS = [
  { building: "narjis", unit: "101", number: "90000000101", startIn: -4, rent: 48000, cycle: "monthly",
    tenant: { name: "Fahad Al-Qahtani", nationality: "Saudi", idType: "national_id", idLast4: "4821", mobile: "0550000101" } }, // running
  { building: "narjis", unit: "102", number: "90000000102", startIn: -11, rent: 54000, cycle: "semi_annual",
    tenant: { name: "Sara Al-Harbi", nationality: "Saudi", idType: "national_id", idLast4: "7310", mobile: "0550000102" } }, // ends within a month
  { building: "narjis", unit: "201", number: "90000000103", startIn: -14, rent: 46000, cycle: "quarterly",
    tenant: { name: "Omar Siddiqui", nationality: "Pakistani", idType: "iqama", idLast4: "5096", mobile: "0550000103" } }, // ended
  { building: "narjis", unit: "301", number: "90000000104", startIn: 1, rent: 62000, cycle: "semi_annual",
    tenant: { name: "Khalid Al-Dosari", nationality: "Saudi", idType: "national_id", idLast4: "2264", mobile: "0550000104" } }, // starts next month
  { building: "olaya", unit: "S1", number: "90000000105", startIn: -2, rent: 90000, cycle: "quarterly",
    tenant: { name: "Ahmed Mansour", nationality: "Egyptian", idType: "iqama", idLast4: "6638", mobile: "0550000105" } }, // running
  { building: "olaya", unit: "O1", number: "90000000106", startIn: -7, rent: 75000, cycle: "annual",
    tenant: { name: "Noura Al-Shehri", nationality: "Saudi", idType: "national_id", idLast4: "9142", mobile: "0550000106" } }, // running
] as const;

// First day of the month, `months` from `today`, as YYYY-MM-DD (UTC).
function monthStart(today: Date, months: number) {
  return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + months, 1));
}
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addMonths = (d: Date, n: number) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, d.getUTCDate()));

export type DemoSeedResult = { userCreated: boolean; passwordReset: boolean; officeCreated: boolean; sampleDataAdded: boolean };

export async function seedDemo(db: Db, today = new Date()): Promise<DemoSeedResult> {
  const result: DemoSeedResult = { userCreated: false, passwordReset: false, officeCreated: false, sampleDataAdded: false };

  // 1. The user, email already verified.
  let [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, DEMO_EMAIL)).limit(1);
  if (!user) {
    [user] = await db.insert(users).values({ id: crypto.randomUUID(), name: DEMO_NAME, email: DEMO_EMAIL, emailVerified: true }).returning({ id: users.id });
    result.userCreated = true;
  } else {
    await db.update(users).set({ emailVerified: true }).where(eq(users.id, user.id));
  }

  // 2. The password login, the same way Better Auth stores it (provider "credential", argon2id hash).
  const [login] = await db
    .select({ id: accounts.id, password: accounts.password })
    .from(accounts)
    .where(and(eq(accounts.userId, user.id), eq(accounts.providerId, "credential")))
    .limit(1);
  if (!login) {
    await db.insert(accounts).values({ id: crypto.randomUUID(), userId: user.id, accountId: user.id, providerId: "credential", password: await hashPassword(DEMO_PASSWORD) });
  } else if (!login.password || !(await verifyPassword({ hash: login.password, password: DEMO_PASSWORD }).catch(() => false))) {
    await db.update(accounts).set({ password: await hashPassword(DEMO_PASSWORD) }).where(eq(accounts.id, login.id));
    result.passwordReset = true;
  }

  // 3. Its own office, admin role, paid.
  let [member] = await db.select({ officeId: memberships.officeId }).from(memberships).where(eq(memberships.userId, user.id)).limit(1);
  if (!member) {
    member = await db.transaction(async (tx) => {
      const [office] = await tx.insert(offices).values({ name: DEMO_OFFICE_NAME }).returning({ id: offices.id });
      await tx.insert(memberships).values({ officeId: office.id, userId: user.id, role: "admin" });
      return { officeId: office.id };
    });
    result.officeCreated = true;
  }
  const officeId = member.officeId;
  const unitTotal = BUILDINGS.reduce((n, b) => n + b.units.length, 0);
  await db.update(offices).set({ name: DEMO_OFFICE_NAME, paid: true, paidUnits: unitTotal }).where(and(eq(offices.id, officeId), eq(offices.paid, false)));
  await db.update(offices).set({ name: DEMO_OFFICE_NAME }).where(eq(offices.id, officeId));

  // 4. Sample data, only into an empty office.
  const [{ n }] = await db.select({ n: count() }).from(buildings).where(eq(buildings.officeId, officeId));
  if (n > 0) return result;

  await db.transaction(async (tx) => {
    const unitIds = new Map<string, string>();
    for (const b of BUILDINGS) {
      const [building] = await tx
        .insert(buildings)
        .values({ officeId, city: b.city, district: b.district, street: b.street, buildingNumber: b.buildingNumber, postalCode: b.postalCode, additionalNumber: b.additionalNumber, deedNumber: b.deedNumber })
        .returning({ id: buildings.id });
      for (const u of b.units) {
        const [unit] = await tx
          .insert(units)
          .values({ officeId, buildingId: building.id, unitNumber: u.number, unitType: u.type, floor: u.floor, areaSqm: u.area })
          .returning({ id: units.id });
        unitIds.set(`${b.key}/${u.number}`, unit.id);
      }
    }

    for (const c of CONTRACTS) {
      const [tenant] = await tx.insert(tenants).values({ officeId, ...c.tenant }).returning({ id: tenants.id });
      const start = monthStart(today, c.startIn);
      const end = new Date(addMonths(start, 12).getTime() - 86_400_000);
      const [contract] = await tx
        .insert(contracts)
        .values({
          officeId, unitId: unitIds.get(`${c.building}/${c.unit}`)!, tenantId: tenant.id, contractNumber: c.number,
          startDate: iso(start), endDate: iso(end), annualRent: String(c.rent), paymentCycle: c.cycle, source: "demo",
        })
        .returning({ id: contracts.id });
      const per = INSTALLMENTS_PER_YEAR[c.cycle as Cycle];
      await tx.insert(installments).values(
        Array.from({ length: per }, (_, i) => ({
          officeId, contractId: contract.id, sequence: i + 1, dueDate: iso(addMonths(start, (12 / per) * i)), amount: String(c.rent / per),
        })),
      );
    }
  });
  result.sampleDataAdded = true;
  return result;
}
