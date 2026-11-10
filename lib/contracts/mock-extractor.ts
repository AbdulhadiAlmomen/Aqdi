import type { ContractExtractor } from "./extractor";
import type { ExtractedContract } from "./schema";
import sample1 from "@/samples/expected/sample-1.json";
import sample2 from "@/samples/expected/sample-2.json";

type Expected = typeof sample1;

// Turns a sample's known answers into what a perfect read would return.
export function asExtraction(expected: Expected): ExtractedContract {
  const { installments, tenantIdType, paymentCycle, unitArea, annualRent, ...rest } = expected;
  return {
    isEjarContract: true,
    ...rest,
    unitArea: String(unitArea),
    annualRent: String(annualRent),
    tenantIdType: tenantIdType as ExtractedContract["tenantIdType"],
    paymentCycle: paymentCycle as ExtractedContract["paymentCycle"],
    installments: installments.map((i) => ({ dueDateGregorian: i.dueDateGregorian, dueDateHijri: i.dueDateHijri, amount: String(i.amount) })),
    uncertainFields: [],
  };
}

// Local work without an API key (AQDI_MOCK_EXTRACTOR=1): returns sample 1 or 2 depending on the file size,
// so the two sample PDFs come back as themselves and anything else as sample 1.
export const mockExtractor: ContractExtractor = {
  async extract(pdf) {
    return asExtraction(pdf.length > 119_000 ? (sample2 as Expected) : sample1);
  },
};
