import type { ExtractedContract } from "./schema";

// Reads one contract PDF and returns what's printed on it. Implementations: Claude (production)
// and a fixed mock (tests, and local work without an API key).
export interface ContractExtractor {
  extract(pdf: Uint8Array): Promise<ExtractedContract>;
}

export type ExtractionErrorCode = "notConfigured" | "notContract" | "refused" | "busy" | "failed";

export class ExtractionError extends Error {
  constructor(
    public code: ExtractionErrorCode,
    detail?: string,
  ) {
    super(detail ?? code);
  }
}

let override: ContractExtractor | undefined;

// Tests swap the extractor here.
export function setExtractorForTests(extractor: ContractExtractor | undefined) {
  override = extractor;
}

export async function getExtractor(): Promise<ContractExtractor> {
  if (override) return override;
  if (process.env.AQDI_MOCK_EXTRACTOR === "1") {
    const { mockExtractor } = await import("./mock-extractor");
    return mockExtractor;
  }
  const { ClaudeExtractor } = await import("./claude-extractor");
  return new ClaudeExtractor();
}
