import type { ContractExtractor } from "./extractor";
import type { ExtractedContract } from "./schema";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import sample1 from "@/samples/expected/sample-1.json";
import sample2 from "@/samples/expected/sample-2.json";
import sampleEn1 from "@/samples/expected/sample-en-1.json";
import sampleEn2 from "@/samples/expected/sample-en-2.json";

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

// Local work and browser tests without an API key (AQDI_MOCK_EXTRACTOR=1): recognises each sample PDF
// by its fingerprint and returns that sample's known answers; any other PDF comes back as sample 1.
const KNOWN: [string, Expected][] = [
  ["sample-1", sample1],
  ["sample-2", sample2],
  ["sample-en-1", sampleEn1],
  ["sample-en-2", sampleEn2],
];
const sha = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
let byHash: Map<string, Expected> | undefined;

export const mockExtractor: ContractExtractor = {
  async extract(pdf) {
    byHash ??= new Map(KNOWN.map(([file, expected]) => [sha(readFileSync(join(process.cwd(), "public", "samples", `${file}.pdf`))), expected]));
    return asExtraction(byHash.get(sha(pdf)) ?? sample1);
  },
};
