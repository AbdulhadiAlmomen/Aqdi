import type { ContractExtractor } from "./extractor";
import type { ExtractedContract } from "./schema";
import sample1 from "@/samples/expected/sample-1.json";
import sample2 from "@/samples/expected/sample-2.json";

type Expected = typeof sample1;

// Turns a sample's known answers into what a perfect read would return.
export function asExtraction(expected: Expected): ExtractedContract {
  const f = (value: string | number) => ({ value: String(value), confidence: "high" as const });
  return {
    isEjarContract: true,
    contractNumber: f(expected.contractNumber),
    startDateGregorian: f(expected.startDateGregorian),
    startDateHijri: f(expected.startDateHijri),
    endDateGregorian: f(expected.endDateGregorian),
    endDateHijri: f(expected.endDateHijri),
    tenantName: f(expected.tenantName),
    tenantNationality: f(expected.tenantNationality),
    tenantIdType: { value: expected.tenantIdType as "national_id" | "iqama", confidence: "high" },
    tenantIdNumber: f(expected.tenantIdNumber),
    tenantMobile: f(expected.tenantMobile),
    propertyCity: f(expected.propertyCity),
    propertyDistrict: f(expected.propertyDistrict),
    propertyStreet: f(expected.propertyStreet),
    buildingNumber: f(expected.buildingNumber),
    postalCode: f(expected.postalCode),
    additionalNumber: f(expected.additionalNumber),
    deedNumber: f(expected.deedNumber),
    unitNumber: f(expected.unitNumber),
    unitType: f(expected.unitType),
    unitFloor: f(expected.unitFloor),
    unitArea: f(expected.unitArea),
    annualRent: f(expected.annualRent),
    paymentCycle: { value: expected.paymentCycle as "semi_annual" | "quarterly", confidence: "high" },
    installments: {
      confidence: "high",
      items: expected.installments.map((i) => ({ ...i, amount: String(i.amount) })),
    },
  };
}

// Local work without an API key (AQDI_MOCK_EXTRACTOR=1): returns sample 1 or 2 depending on the file size,
// so the two sample PDFs come back as themselves and anything else as sample 1.
export const mockExtractor: ContractExtractor = {
  async extract(pdf) {
    return asExtraction(pdf.length > 119_000 ? (sample2 as Expected) : sample1);
  },
};
