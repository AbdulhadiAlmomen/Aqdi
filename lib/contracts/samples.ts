import type { MessageKey } from "@/lib/i18n";

// Fake contracts anyone can try the import with (made by samples/make-samples.mjs, served from
// public/samples/). The import page offers the set matching the page's language.
export const SAMPLE_CONTRACTS = [
  { file: "sample-en-1", lang: "en", label: "samples.one" },
  { file: "sample-en-2", lang: "en", label: "samples.two" },
  { file: "sample-1", lang: "ar", label: "samples.one" },
  { file: "sample-2", lang: "ar", label: "samples.two" },
] as const satisfies readonly { file: string; lang: "ar" | "en"; label: MessageKey }[];

export const samplePath = (file: string) => `/samples/${file}.pdf`;
