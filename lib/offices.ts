import { and, asc, eq } from "drizzle-orm";
import type { Db } from "@/db";
import { memberships, offices, users } from "@/db/schema";

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
  };
}
