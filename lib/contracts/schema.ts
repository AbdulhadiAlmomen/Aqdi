import { z } from "zod";

// What the AI must return for one Ejar contract. Nothing is trusted on its own say-so:
// lib/contracts/checks.ts verifies the values in code.
//
// Deliberately flat and plain: every value is a string ("" when the contract doesn't show it) and
// doubt is one list of field names. Anthropic compiles structured-output schemas into a grammar with
// size limits (at most 16 union-typed parameters, and a cap on total grammar size); a nullable
// {value, confidence} object per field broke both. checks.ts turns amounts and dates back into numbers.

const date = (what: string) => z.string().describe(`${what}, as YYYY-MM-DD with Western digits; "" if not shown`);
const text = (what: string) => z.string().describe(`${what}; "" if not shown`);
const amount = (what: string) => z.string().describe(`${what} in SAR, digits only (e.g. 32000 or 7125.50); "" if not shown`);

export const UNCERTAIN_FIELDS = [
  "contractNumber", "startDateGregorian", "startDateHijri", "endDateGregorian", "endDateHijri",
  "tenantName", "tenantNationality", "tenantIdType", "tenantIdNumber", "tenantMobile",
  "propertyCity", "propertyDistrict", "propertyStreet", "buildingNumber", "postalCode", "additionalNumber", "deedNumber",
  "unitNumber", "unitType", "unitFloor", "unitArea", "annualRent", "paymentCycle", "installments",
] as const;

export const ExtractedContractSchema = z.object({
  isEjarContract: z.boolean().describe("true only if this is a Saudi Ejar residential lease contract (عقد إيجار موحد)"),
  contractNumber: text("Contract record number (رقم سجل العقد), digits only"),
  startDateGregorian: date("Tenancy start date (تاريخ بداية مدة الإيجار), Gregorian"),
  startDateHijri: date("Tenancy start date, Hijri as printed"),
  endDateGregorian: date("Tenancy end date (تاريخ نهاية مدة الإيجار), Gregorian"),
  endDateHijri: date("Tenancy end date, Hijri as printed"),
  tenantName: text("Tenant (المستأجر) full name, never the lessor's"),
  tenantNationality: text("Tenant nationality as printed"),
  tenantIdType: z.enum(["national_id", "iqama", "passport", "other", "unknown"]).describe("هوية وطنية = national_id, إقامة = iqama"),
  tenantIdNumber: text("Tenant ID or iqama number exactly as printed, digits only"),
  tenantMobile: text("Tenant mobile number exactly as printed"),
  propertyCity: text("City of the property's national address"),
  propertyDistrict: text("District (الحي), without the word حي"),
  propertyStreet: text("Street name"),
  buildingNumber: text("Building number of the national address"),
  postalCode: text("Postal code"),
  additionalNumber: text("Additional number (الرقم الإضافي)"),
  deedNumber: text("Title deed number (رقم الصك)"),
  unitNumber: text("Rental unit number (رقم الوحدة)"),
  unitType: text("Unit type as printed, e.g. شقة"),
  unitFloor: text("Floor number of the unit"),
  unitArea: text("Unit area in square metres, digits only"),
  annualRent: amount("Annual rent"),
  paymentCycle: z.enum(["monthly", "quarterly", "semi_annual", "annual", "other", "unknown"]).describe("دورية سداد الإيجار"),
  installments: z
    .array(z.object({ dueDateGregorian: date("Due date, Gregorian"), dueDateHijri: date("Due date, Hijri as printed"), amount: amount("Amount") }))
    .describe("Every row of the rent payments schedule (جدول سداد الدفعات), in order"),
  uncertainFields: z
    .array(z.enum(UNCERTAIN_FIELDS))
    .describe("Fields whose printed value was unclear, cut off, contradictory or inferred; [] if none"),
});

export type ExtractedContract = z.infer<typeof ExtractedContractSchema>;
