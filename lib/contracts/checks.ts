import { hijriIso, isValidIsoDate, leaseMonths, normalizeHijri } from "@/lib/dates";
import type { ExtractedContract } from "./schema";

// Checks run in code, never trusting the AI: on the extracted data (to highlight fields on the
// review screen) and again on whatever the office approves (to decide whether it can be saved).

export type Flag =
  | "missing"
  | "lowConfidence"
  | "idFormat"
  | "idOther"
  | "mobileFormat"
  | "dateFormat"
  | "numberFormat"
  | "dateOrder"
  | "hijriMismatch"
  | "installmentsSum"
  | "duplicate";

// These stop a save. The rest are warnings the office has seen and accepted by approving.
export const BLOCKING: ReadonlySet<Flag> = new Set(["missing", "idFormat", "mobileFormat", "dateFormat", "numberFormat", "dateOrder", "installmentsSum", "duplicate"]);

export type IdType = "national_id" | "iqama" | "other";
export type PaymentCycle = "monthly" | "quarterly" | "semi_annual" | "annual" | "other";

export const TEXT_FIELDS = [
  "contractNumber", "startDate", "endDate", "annualRent", "paymentCycle",
  "tenantName", "tenantNationality", "tenantMobile",
  "propertyCity", "propertyDistrict", "propertyStreet", "buildingNumber", "postalCode", "additionalNumber", "deedNumber",
  "unitNumber", "unitType", "unitFloor", "unitArea",
] as const;
export type TextField = (typeof TEXT_FIELDS)[number];

export type Installment = { dueDate: string; amount: string };

// What the review screen shows and the office edits. The full ID number never leaves the server:
// only its type and last 4 digits are here. needsEntry: the printed number was a malformed national
// ID or iqama, so the office must type the correct one before saving.
export type Draft = {
  fields: Record<TextField, string>;
  tenantId: { type: IdType; last4: string; needsEntry: boolean };
  installments: Installment[];
  // Hijri dates as printed on the contract, shown next to the Gregorian ones.
  printedHijri: { start: string | null; end: string | null };
};

export type Flags = Partial<Record<TextField | "tenantId" | "installments", Flag[]>>;

const REQUIRED: TextField[] = ["contractNumber", "startDate", "endDate", "annualRent", "paymentCycle", "tenantName", "tenantMobile", "unitNumber"];

function add(flags: Flags, key: keyof Flags, flag: Flag) {
  const list = (flags[key] ??= []);
  if (!list.includes(flag)) list.push(flag);
}

// 05XXXXXXXX from +966 5X…, 00966 5X…, 966 5X… or 05X…; null if it isn't a Saudi mobile.
export function normalizeMobile(raw: string) {
  const digits = raw.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/\D/g, "");
  const local = digits.replace(/^(00966|966)/, "0");
  return /^05\d{8}$/.test(local) ? local : null;
}

// National ID starts with 1, iqama with 2, both 10 digits. Anything else is "other".
export function classifyId(raw: string): { type: IdType; last4: string; valid: boolean } {
  const digits = raw.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/\D/g, "");
  const last4 = digits.slice(-4);
  if (/^1\d{9}$/.test(digits)) return { type: "national_id", last4, valid: true };
  if (/^2\d{9}$/.test(digits)) return { type: "iqama", last4, valid: true };
  return { type: "other", last4, valid: false };
}

const toWestern = (s: string) => s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/[٫]/g, ".");

// "32,000.00 ريال" / "٣٢٠٠٠" / "32000" → "32000"; "" if there's no number in it.
export function parseAmount(raw: string) {
  const cleaned = toWestern(raw).replace(/[,٬\s]/g, "").match(/\d+(\.\d+)?/);
  return cleaned ? String(Number(cleaned[0])) : "";
}

const text = (v: string) => v.trim();

// Turns an AI extraction into a review draft with flags.
export function draftFromExtraction(x: ExtractedContract): { draft: Draft; flags: Flags } {
  const flags: Flags = {};
  const fields: Record<TextField, string> = {
    contractNumber: toWestern(x.contractNumber.value).replace(/\D/g, ""),
    startDate: text(x.startDateGregorian.value),
    endDate: text(x.endDateGregorian.value),
    annualRent: parseAmount(x.annualRent.value),
    paymentCycle: x.paymentCycle.value === "unknown" ? "" : x.paymentCycle.value,
    tenantName: text(x.tenantName.value),
    tenantNationality: text(x.tenantNationality.value),
    tenantMobile: x.tenantMobile.value ? (normalizeMobile(x.tenantMobile.value) ?? x.tenantMobile.value) : "",
    propertyCity: text(x.propertyCity.value),
    propertyDistrict: (text(x.propertyDistrict.value)).replace(/^حي\s+/, ""),
    propertyStreet: text(x.propertyStreet.value),
    buildingNumber: text(x.buildingNumber.value),
    postalCode: text(x.postalCode.value),
    additionalNumber: text(x.additionalNumber.value),
    deedNumber: text(x.deedNumber.value),
    unitNumber: text(x.unitNumber.value),
    unitType: text(x.unitType.value),
    unitFloor: text(x.unitFloor.value),
    unitArea: parseAmount(x.unitArea.value),
  };

  // The AI's own doubt, mapped onto our field names.
  const confidenceOf: Record<TextField, { confidence: string }> = {
    contractNumber: x.contractNumber, startDate: x.startDateGregorian, endDate: x.endDateGregorian,
    annualRent: x.annualRent, paymentCycle: x.paymentCycle, tenantName: x.tenantName, tenantNationality: x.tenantNationality,
    tenantMobile: x.tenantMobile, propertyCity: x.propertyCity, propertyDistrict: x.propertyDistrict, propertyStreet: x.propertyStreet,
    buildingNumber: x.buildingNumber, postalCode: x.postalCode, additionalNumber: x.additionalNumber, deedNumber: x.deedNumber,
    unitNumber: x.unitNumber, unitType: x.unitType, unitFloor: x.unitFloor, unitArea: x.unitArea,
  };
  for (const key of TEXT_FIELDS) if (confidenceOf[key].confidence === "low") add(flags, key, "lowConfidence");

  // Other ID types (e.g. a passport) are allowed but flagged; a malformed national ID or iqama must be re-typed.
  const id = classifyId(text(x.tenantIdNumber.value));
  const otherType = x.tenantIdType.value === "passport" || x.tenantIdType.value === "other";
  const needsEntry = !!x.tenantIdNumber.value && !id.valid && !otherType;
  if (x.tenantIdNumber.value && !id.valid && otherType) add(flags, "tenantId", "idOther");
  if (x.tenantIdNumber.confidence === "low") add(flags, "tenantId", "lowConfidence");

  // Printed Hijri dates must be the same days as the Gregorian ones.
  const printedHijri = { start: normalizeHijri(x.startDateHijri.value), end: normalizeHijri(x.endDateHijri.value) };
  if (isValidIsoDate(fields.startDate) && printedHijri.start && hijriIso(fields.startDate) !== printedHijri.start) add(flags, "startDate", "hijriMismatch");
  if (isValidIsoDate(fields.endDate) && printedHijri.end && hijriIso(fields.endDate) !== printedHijri.end) add(flags, "endDate", "hijriMismatch");

  const installments = x.installments.items.map((i) => ({ dueDate: text(i.dueDateGregorian), amount: parseAmount(i.amount) }));
  if (x.installments.confidence === "low") add(flags, "installments", "lowConfidence");
  if (x.installments.items.some((i) => i.dueDateHijri && isValidIsoDate(i.dueDateGregorian) && normalizeHijri(i.dueDateHijri) !== hijriIso(i.dueDateGregorian))) {
    add(flags, "installments", "hijriMismatch");
  }

  const draft: Draft = { fields, tenantId: { type: id.type, last4: id.last4, needsEntry }, installments, printedHijri };
  mergeFlags(flags, checkDraft(draft));
  return { draft, flags };
}

// The checks that also run on save, on whatever the office approved.
export function checkDraft(draft: Draft): Flags {
  const flags: Flags = {};
  const f = draft.fields;

  for (const key of REQUIRED) if (!f[key].trim()) add(flags, key, "missing");
  // A building needs a deed number or a full national address to be told apart from others.
  if (!f.deedNumber.trim() && !(f.propertyCity.trim() && f.propertyDistrict.trim() && f.buildingNumber.trim())) add(flags, "deedNumber", "missing");
  if (draft.tenantId.needsEntry) add(flags, "tenantId", "idFormat");
  else if (draft.tenantId.last4.length !== 4) add(flags, "tenantId", "missing");

  if (f.tenantMobile && !normalizeMobile(f.tenantMobile)) add(flags, "tenantMobile", "mobileFormat");

  const startOk = isValidIsoDate(f.startDate);
  const endOk = isValidIsoDate(f.endDate);
  if (f.startDate && !startOk) add(flags, "startDate", "dateFormat");
  if (f.endDate && !endOk) add(flags, "endDate", "dateFormat");
  if (startOk && endOk && f.endDate <= f.startDate) add(flags, "endDate", "dateOrder");

  const rent = Number(f.annualRent);
  if (f.annualRent && !(rent > 0)) add(flags, "annualRent", "numberFormat");
  if (f.unitArea && !(Number(f.unitArea) > 0)) add(flags, "unitArea", "numberFormat");

  // Installments must add up to the rent for the lease's length (one year: the annual rent).
  if (draft.installments.length === 0) add(flags, "installments", "missing");
  else if (draft.installments.some((i) => !isValidIsoDate(i.dueDate))) add(flags, "installments", "dateFormat");
  else if (draft.installments.some((i) => !(Number(i.amount) > 0))) add(flags, "installments", "numberFormat");
  else if (rent > 0 && startOk && endOk && f.endDate > f.startDate) {
    const total = draft.installments.reduce((sum, i) => sum + Number(i.amount), 0);
    const expected = rent * (Math.round(leaseMonths(f.startDate, f.endDate)) / 12);
    if (Math.abs(total - expected) > 1) add(flags, "installments", "installmentsSum");
  }
  return flags;
}

export function mergeFlags(into: Flags, from: Flags) {
  for (const [key, list] of Object.entries(from) as [keyof Flags, Flag[]][]) for (const flag of list) add(into, key, flag);
  return into;
}

export function hasBlocking(flags: Flags) {
  return Object.values(flags).some((list) => list?.some((f) => BLOCKING.has(f)));
}
