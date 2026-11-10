import { describe, expect, it } from "vitest";
import { checkDraft, classifyId, draftFromExtraction, hasBlocking, normalizeMobile } from "@/lib/contracts/checks";
import { asExtraction } from "@/lib/contracts/mock-extractor";
import { formatDual, hijriIso, normalizeHijri } from "@/lib/dates";
import sample1 from "@/samples/expected/sample-1.json";
import sample2 from "@/samples/expected/sample-2.json";
import sampleEn1 from "@/samples/expected/sample-en-1.json";
import sampleEn2 from "@/samples/expected/sample-en-2.json";

describe("field checks", () => {
  it("normalizes Saudi mobiles and rejects others", () => {
    expect(normalizeMobile("+966549021175")).toBe("0549021175");
    expect(normalizeMobile("00966 54 902 1175")).toBe("0549021175");
    expect(normalizeMobile("٠٥٥٢١٤٧٣٩٠")).toBe("0552147390");
    expect(normalizeMobile("0112345678")).toBeNull();
    expect(normalizeMobile("05521473")).toBeNull();
  });

  it("tells national IDs, iqamas and others apart", () => {
    expect(classifyId("1098234561")).toEqual({ type: "national_id", last4: "4561", valid: true });
    expect(classifyId("2134876590")).toEqual({ type: "iqama", last4: "6590", valid: true });
    expect(classifyId("3134876590").valid).toBe(false);
    expect(classifyId("109823456").valid).toBe(false);
  });

  it("converts and formats Hijri dates (Umm al-Qura)", () => {
    expect(hijriIso("2026-03-15")).toBe("1447-09-26");
    expect(normalizeHijri("٢٦/٠٩/١٤٤٧")).toBe("1447-09-26");
    expect(normalizeHijri("1447-9-26")).toBe("1447-09-26");
    expect(formatDual("2026-12-10", "en")).toBe("1 Rajab 1448 · 10 Dec 2026");
    expect(formatDual("2026-12-10", "ar")).toBe("١ رجب ١٤٤٨هـ · 10 ديسمبر 2026م");
  });
});

describe("drafts from extraction", () => {
  it("a perfect read of any sample (Arabic or English) has no flags", () => {
    for (const s of [sample1, sample2, sampleEn1, sampleEn2]) {
      const { draft, flags } = draftFromExtraction(asExtraction(s));
      expect(flags).toEqual({});
      expect(draft.tenantId.last4).toBe(s.tenantIdNumber.slice(-4));
      expect(JSON.stringify(draft)).not.toContain(s.tenantIdNumber); // the full ID never reaches the browser
    }
  });

  it("normalizes the +966 mobile on sample 2", () => {
    const { draft } = draftFromExtraction(asExtraction(sample2));
    expect(draft.fields.tenantMobile).toBe("0549021175");
    expect(draft.tenantId.type).toBe("iqama");
  });

  it("flags what's wrong and blocks saving until it's fixed", () => {
    const x = asExtraction(sample1);
    x.tenantIdNumber = "109823456"; // 9 digits
    x.startDateHijri = "1447-09-25"; // one day off
    x.installments[1].amount = "15000"; // payments no longer add up
    x.uncertainFields = ["tenantMobile"];
    const { draft, flags } = draftFromExtraction(x);
    expect(flags.tenantId).toContain("idFormat");
    expect(flags.startDate).toContain("hijriMismatch");
    expect(flags.installments).toContain("installmentsSum");
    expect(flags.tenantMobile).toContain("lowConfidence");
    expect(hasBlocking(flags)).toBe(true);

    // The office types the right ID and fixes the amount: only warnings remain.
    const fixed = { ...draft, tenantId: { type: "national_id" as const, last4: "4561", needsEntry: false }, installments: draft.installments.map((i) => ({ ...i, amount: "16000" })) };
    expect(hasBlocking(checkDraft(fixed))).toBe(false);
  });

  it("allows other ID types but flags them", () => {
    const x = asExtraction(sample2);
    x.tenantIdType = "passport";
    x.tenantIdNumber = "AB1234567";
    const { flags } = draftFromExtraction(x);
    expect(flags.tenantId).toEqual(["idOther"]);
    expect(hasBlocking(flags)).toBe(false);
  });

  it("reads amounts however they're printed", () => {
    const x = asExtraction(sample1);
    x.annualRent = "32,000.00 ريال";
    x.installments = x.installments.map((i) => ({ ...i, amount: "١٦٬٠٠٠" }));
    const { draft, flags } = draftFromExtraction(x);
    expect(draft.fields.annualRent).toBe("32000");
    expect(draft.installments.map((i) => i.amount)).toEqual(["16000", "16000"]);
    expect(flags).toEqual({});
  });

  it("treats empty strings as missing", () => {
    const x = asExtraction(sample1);
    x.contractNumber = "";
    x.paymentCycle = "unknown";
    const { flags } = draftFromExtraction(x);
    expect(flags.contractNumber).toContain("missing");
    expect(flags.paymentCycle).toContain("missing");
  });

  it("rejects an end date before the start", () => {
    const { draft } = draftFromExtraction(asExtraction(sample1));
    const flags = checkDraft({ ...draft, fields: { ...draft.fields, endDate: "2026-03-01" } });
    expect(flags.endDate).toContain("dateOrder");
  });
});
