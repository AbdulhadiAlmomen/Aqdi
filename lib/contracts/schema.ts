import { z } from "zod";

// What the AI must return for one Ejar contract. Every field carries the model's own confidence;
// nothing is trusted on that alone — lib/contracts/checks.ts verifies the values in code.
//
// Every value is a plain string ("" when the contract doesn't show it), never nullable or a number:
// Anthropic's structured outputs allow at most 16 parameters with union types, and a nullable field
// counts as one. checks.ts turns amounts and dates back into numbers and dates.

const confidence = z.enum(["high", "medium", "low"]).describe("low if the value is unclear, partly unreadable, or inferred rather than printed");

function field(description: string) {
  return z.object({ value: z.string().describe(`${description}. Empty string if not on the contract.`), confidence });
}

const date = (what: string) => `${what}, as YYYY-MM-DD with Western digits`;
const amount = (what: string) => `${what} in SAR, digits only (e.g. 32000 or 7125.50), no commas or currency`;

export const ExtractedContractSchema = z.object({
  isEjarContract: z.boolean().describe("true only if this is a Saudi Ejar residential lease contract (عقد إيجار موحد)"),
  contractNumber: field("Contract record number (رقم سجل العقد), digits only"),
  startDateGregorian: field(date("Tenancy start date (تاريخ بداية مدة الإيجار), Gregorian")),
  startDateHijri: field(date("Tenancy start date, Hijri as printed")),
  endDateGregorian: field(date("Tenancy end date (تاريخ نهاية مدة الإيجار), Gregorian")),
  endDateHijri: field(date("Tenancy end date, Hijri as printed")),
  tenantName: field("Tenant (المستأجر) full name, never the lessor's"),
  tenantNationality: field("Tenant nationality as printed"),
  tenantIdType: z.object({
    value: z.enum(["national_id", "iqama", "passport", "other", "unknown"]).describe("Tenant ID type: هوية وطنية = national_id, إقامة = iqama; unknown if not shown"),
    confidence,
  }),
  tenantIdNumber: field("Tenant ID or iqama number exactly as printed, digits only"),
  tenantMobile: field("Tenant mobile number exactly as printed"),
  propertyCity: field("City of the property's national address"),
  propertyDistrict: field("District (الحي), without the word حي"),
  propertyStreet: field("Street name"),
  buildingNumber: field("Building number of the national address"),
  postalCode: field("Postal code"),
  additionalNumber: field("Additional number (الرقم الإضافي)"),
  deedNumber: field("Title deed number (رقم الصك)"),
  unitNumber: field("Rental unit number (رقم الوحدة)"),
  unitType: field("Unit type as printed, e.g. شقة"),
  unitFloor: field("Floor number of the unit"),
  unitArea: field("Unit area in square metres, digits only"),
  annualRent: field(amount("Annual rent")),
  paymentCycle: z.object({
    value: z.enum(["monthly", "quarterly", "semi_annual", "annual", "other", "unknown"]).describe("Rent payment cycle (دورية سداد الإيجار); unknown if not shown"),
    confidence,
  }),
  installments: z.object({
    confidence,
    items: z
      .array(
        z.object({
          number: z.number().int(),
          dueDateGregorian: z.string().describe(date("Due date, Gregorian")),
          dueDateHijri: z.string().describe(`${date("Due date, Hijri as printed")}. Empty string if not shown`),
          amount: z.string().describe(amount("Amount")),
        }),
      )
      .describe("Every row of the rent payments schedule (جدول سداد الدفعات), in order"),
  }),
});

export type ExtractedContract = z.infer<typeof ExtractedContractSchema>;
