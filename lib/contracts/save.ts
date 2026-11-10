import { and, eq } from "drizzle-orm";
import type { Db } from "@/db";
import { buildings, contracts, installments, tenants, units } from "@/db/schema";
import { normalizeMobile, type Draft, type PaymentCycle } from "./checks";

export class DuplicateContractError extends Error {}

const orNull = (s: string) => (s.trim() ? s.trim() : null);

// Saves an approved contract for one office, in one transaction: finds or creates the building
// (by title deed, else by national address), the unit (by number in that building) and the tenant
// (by ID type, last 4 digits and mobile), then adds the contract and its installments.
// Call only after checkDraft() found nothing blocking.
export async function saveImportedContract(db: Db, officeId: string, draft: Draft) {
  const f = draft.fields;
  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: contracts.id })
      .from(contracts)
      .where(and(eq(contracts.officeId, officeId), eq(contracts.contractNumber, f.contractNumber.trim())))
      .limit(1);
    if (existing) throw new DuplicateContractError(f.contractNumber);

    const deed = orNull(f.deedNumber);
    const buildingMatch = deed
      ? and(eq(buildings.officeId, officeId), eq(buildings.deedNumber, deed))
      : and(
          eq(buildings.officeId, officeId),
          eq(buildings.city, f.propertyCity.trim()),
          eq(buildings.district, f.propertyDistrict.trim()),
          eq(buildings.buildingNumber, f.buildingNumber.trim()),
        );
    let [building] = await tx.select({ id: buildings.id }).from(buildings).where(buildingMatch).limit(1);
    if (!building) {
      [building] = await tx
        .insert(buildings)
        .values({
          officeId,
          deedNumber: deed,
          city: orNull(f.propertyCity),
          district: orNull(f.propertyDistrict),
          street: orNull(f.propertyStreet),
          buildingNumber: orNull(f.buildingNumber),
          postalCode: orNull(f.postalCode),
          additionalNumber: orNull(f.additionalNumber),
        })
        .returning({ id: buildings.id });
    }

    let [unit] = await tx
      .select({ id: units.id })
      .from(units)
      .where(and(eq(units.buildingId, building.id), eq(units.unitNumber, f.unitNumber.trim())))
      .limit(1);
    if (!unit) {
      [unit] = await tx
        .insert(units)
        .values({
          officeId,
          buildingId: building.id,
          unitNumber: f.unitNumber.trim(),
          unitType: orNull(f.unitType),
          floor: orNull(f.unitFloor),
          areaSqm: orNull(f.unitArea),
        })
        .returning({ id: units.id });
    }

    const mobile = normalizeMobile(f.tenantMobile) ?? f.tenantMobile.trim();
    let [tenant] = await tx
      .select({ id: tenants.id })
      .from(tenants)
      .where(
        and(
          eq(tenants.officeId, officeId),
          eq(tenants.idType, draft.tenantId.type),
          eq(tenants.idLast4, draft.tenantId.last4),
          eq(tenants.mobile, mobile),
        ),
      )
      .limit(1);
    if (!tenant) {
      [tenant] = await tx
        .insert(tenants)
        .values({
          officeId,
          name: f.tenantName.trim(),
          nationality: orNull(f.tenantNationality),
          idType: draft.tenantId.type,
          idLast4: draft.tenantId.last4,
          mobile,
        })
        .returning({ id: tenants.id });
    }

    const [contract] = await tx
      .insert(contracts)
      .values({
        officeId,
        unitId: unit.id,
        tenantId: tenant.id,
        contractNumber: f.contractNumber.trim(),
        startDate: f.startDate,
        endDate: f.endDate,
        annualRent: String(Number(f.annualRent)),
        paymentCycle: f.paymentCycle as PaymentCycle,
      })
      .returning({ id: contracts.id });

    await tx.insert(installments).values(
      draft.installments.map((i, index) => ({
        officeId,
        contractId: contract.id,
        sequence: index + 1,
        dueDate: i.dueDate,
        amount: String(Number(i.amount)),
      })),
    );
    return contract.id;
  });
}
