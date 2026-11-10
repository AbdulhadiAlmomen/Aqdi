import { and, asc, count, desc, eq } from "drizzle-orm";
import type { Db } from "@/db";
import { buildings, contracts, memberships, offices, tenants, units, users } from "@/db/schema";

// Free offices can import this many contracts; paying offices have no limit.
export const FREE_CONTRACT_LIMIT = 3;

// A new office with its creator as admin. One transaction: never an office without an admin.
export async function createOfficeWithAdmin(db: Db, userId: string, officeName: string) {
  return db.transaction(async (tx) => {
    const [office] = await tx.insert(offices).values({ name: officeName }).returning();
    await tx.insert(memberships).values({ officeId: office.id, userId, role: "admin" });
    return office;
  });
}

// Which office a signed-in user works in. For now a user belongs to exactly one office.
export async function findMembership(db: Db, userId: string) {
  const [row] = await db
    .select({ officeId: offices.id, officeName: offices.name, role: memberships.role })
    .from(memberships)
    .innerJoin(offices, eq(offices.id, memberships.officeId))
    .where(eq(memberships.userId, userId))
    .orderBy(asc(memberships.createdAt))
    .limit(1);
  return row ?? null;
}

// Every read of office-owned data goes through here. Each query is filtered by the office
// it was opened for, so code holding office A's handle can't see office B's rows,
// even when given B's ids. New office-owned tables (buildings, units, contracts) get added here.
export function forOffice(db: Db, officeId: string) {
  return {
    async office() {
      const [row] = await db.select().from(offices).where(eq(offices.id, officeId)).limit(1);
      return row ?? null;
    },

    members() {
      return db
        .select({ id: memberships.id, role: memberships.role, name: users.name, email: users.email })
        .from(memberships)
        .innerJoin(users, eq(users.id, memberships.userId))
        .where(eq(memberships.officeId, officeId))
        .orderBy(asc(memberships.createdAt));
    },

    async member(membershipId: string) {
      const [row] = await db
        .select({ id: memberships.id, role: memberships.role, name: users.name, email: users.email })
        .from(memberships)
        .innerJoin(users, eq(users.id, memberships.userId))
        .where(and(eq(memberships.id, membershipId), eq(memberships.officeId, officeId)))
        .limit(1);
      return row ?? null;
    },

    async unitCount() {
      const [row] = await db.select({ n: count() }).from(units).where(eq(units.officeId, officeId));
      return row.n;
    },

    async contractCount() {
      const [row] = await db.select({ n: count() }).from(contracts).where(eq(contracts.officeId, officeId));
      return row.n;
    },

    async hasContractNumber(contractNumber: string) {
      const [row] = await db
        .select({ id: contracts.id })
        .from(contracts)
        .where(and(eq(contracts.officeId, officeId), eq(contracts.contractNumber, contractNumber)))
        .limit(1);
      return !!row;
    },

    // Each building with how many units and contracts it has.
    async buildingsOverview() {
      const rows = await db
        .select({
          id: buildings.id,
          city: buildings.city,
          district: buildings.district,
          street: buildings.street,
          buildingNumber: buildings.buildingNumber,
          deedNumber: buildings.deedNumber,
          unitId: units.id,
          contractId: contracts.id,
        })
        .from(buildings)
        .leftJoin(units, and(eq(units.buildingId, buildings.id), eq(units.officeId, officeId)))
        .leftJoin(contracts, and(eq(contracts.unitId, units.id), eq(contracts.officeId, officeId)))
        .where(eq(buildings.officeId, officeId))
        .orderBy(asc(buildings.createdAt));
      const byId = new Map<string, { id: string; city: string | null; district: string | null; street: string | null; buildingNumber: string | null; deedNumber: string | null; units: Set<string>; contracts: Set<string> }>();
      for (const r of rows) {
        const b = byId.get(r.id) ?? {
          id: r.id, city: r.city, district: r.district, street: r.street, buildingNumber: r.buildingNumber, deedNumber: r.deedNumber,
          units: new Set<string>(), contracts: new Set<string>(),
        };
        if (r.unitId) b.units.add(r.unitId);
        if (r.contractId) b.contracts.add(r.contractId);
        byId.set(r.id, b);
      }
      return [...byId.values()].map(({ units: u, contracts: c, ...b }) => ({ ...b, unitCount: u.size, contractCount: c.size }));
    },

    // Contracts with their unit, building and tenant. Only the last 4 digits of the tenant's ID exist.
    contracts() {
      return db
        .select({
          id: contracts.id,
          contractNumber: contracts.contractNumber,
          startDate: contracts.startDate,
          endDate: contracts.endDate,
          annualRent: contracts.annualRent,
          paymentCycle: contracts.paymentCycle,
          unitNumber: units.unitNumber,
          unitType: units.unitType,
          district: buildings.district,
          buildingNumber: buildings.buildingNumber,
          tenantName: tenants.name,
          tenantIdType: tenants.idType,
          tenantIdLast4: tenants.idLast4,
        })
        .from(contracts)
        .innerJoin(units, eq(units.id, contracts.unitId))
        .innerJoin(buildings, eq(buildings.id, units.buildingId))
        .innerJoin(tenants, eq(tenants.id, contracts.tenantId))
        .where(eq(contracts.officeId, officeId))
        .orderBy(desc(contracts.createdAt));
    },
  };
}
