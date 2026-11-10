import { z } from "zod";

// What the AI must return for one Ejar contract. Every field carries the model's own confidence;
// nothing is trusted on that alone — lib/contracts/checks.ts verifies the values in code.

const confidence = z.enum(["high", "medium", "low"]).describe("low if the value is unclear, partly unreadable, or inferred rather than printed");

function field<T extends z.ZodType>(value: T, description: string) {
  return z.object({ value: value.nullable().describe(`${description}. null if not on the contract.`), confidence });
}

const isoDate = (what: string) => z.string().describe(`${what}, as YYYY-MM-DD with Western digits`);

export const ExtractedContractSchema = z.object({
  isEjarContract: z.boolean().describe("true only if this is a Saudi Ejar residential lease contract (عقد إيجار موحد)"),
  contractNumber: field(z.string(), "Contract record number (رقم سجل العقد), digits only"),
  startDateGregorian: field(isoDate("Tenancy start date (تاريخ بداية مدة الإيجار), Gregorian"), "Start date, Gregorian"),
  startDateHijri: field(isoDate("Tenancy start date, Hijri as printed"), "Start date, Hijri"),
  endDateGregorian: field(isoDate("Tenancy end date (تاريخ نهاية مدة الإيجار), Gregorian"), "End date, Gregorian"),
  endDateHijri: field(isoDate("Tenancy end date, Hijri as printed"), "End date, Hijri"),
  tenantName: field(z.string(), "Tenant (المستأجر) full name, never the lessor's"),
  tenantNationality: field(z.string(), "Tenant nationality as printed"),
  tenantIdType: field(z.enum(["national_id", "iqama", "passport", "other"]), "Tenant ID type: هوية وطنية = national_id, إقامة = iqama"),
  tenantIdNumber: field(z.string(), "Tenant ID or iqama number exactly as printed, digits only"),
  tenantMobile: field(z.string(), "Tenant mobile number exactly as printed"),
  propertyCity: field(z.string(), "City of the property's national address"),
  propertyDistrict: field(z.string(), "District (الحي), without the word حي"),
  propertyStreet: field(z.string(), "Street name"),
  buildingNumber: field(z.string(), "Building number of the national address"),
  postalCode: field(z.string(), "Postal code"),
  additionalNumber: field(z.string(), "Additional number (الرقم الإضافي)"),
  deedNumber: field(z.string(), "Title deed number (رقم الصك)"),
  unitNumber: field(z.string(), "Rental unit number (رقم الوحدة)"),
  unitType: field(z.string(), "Unit type as printed, e.g. شقة"),
  unitFloor: field(z.string(), "Floor number of the unit"),
  unitArea: field(z.number(), "Unit area in square metres"),
  annualRent: field(z.number(), "Annual rent in SAR as a plain number"),
  paymentCycle: field(z.enum(["monthly", "quarterly", "semi_annual", "annual", "other"]), "Rent payment cycle (دورية سداد الإيجار)"),
  installments: z.object({
    confidence,
    items: z
      .array(
        z.object({
          number: z.number().int(),
          dueDateGregorian: isoDate("Due date, Gregorian"),
          dueDateHijri: isoDate("Due date, Hijri as printed").nullable(),
          amount: z.number().describe("Amount in SAR as a plain number"),
        }),
      )
      .describe("Every row of the rent payments schedule (جدول سداد الدفعات), in order"),
  }),
});

export type ExtractedContract = z.infer<typeof ExtractedContractSchema>;
