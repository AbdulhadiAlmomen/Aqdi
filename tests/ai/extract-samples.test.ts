import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { draftFromExtraction } from "@/lib/contracts/checks";
import { ClaudeExtractor } from "@/lib/contracts/claude-extractor";
import { normalizeHijri } from "@/lib/dates";
import sample1 from "@/samples/expected/sample-1.json";
import sample2 from "@/samples/expected/sample-2.json";

// Calls the real Claude API (costs a few cents). Run with: npm run test:ai
// Prints, for each sample, every field the AI got right or wrong against the known answers.

const CASES = [
  { file: "samples/sample-1.pdf", expected: sample1 },
  { file: "samples/sample-2.pdf", expected: sample2 },
];

const same = (a: unknown, b: unknown) => String(a ?? "").trim() === String(b ?? "").trim();

// Opt-in only (AQDI_AI_TESTS=1, set by the script), so `npm test` never spends API credit.
describe.skipIf(!process.env.AQDI_AI_TESTS)("AI reading of the sample contracts", () => {
  for (const { file, expected } of CASES) {
    it(file, { timeout: 180_000 }, async () => {
      const started = Date.now();
      const x = await new ClaudeExtractor().extract(new Uint8Array(readFileSync(file)));
      const seconds = ((Date.now() - started) / 1000).toFixed(1);
      const rows: [string, unknown, unknown, string, boolean][] = [];
      const check = (name: string, got: unknown, want: unknown, confidence: string) => rows.push([name, got, want, confidence, same(got, want)]);

      for (const key of Object.keys(expected) as (keyof typeof expected)[]) {
        if (key === "installments") continue;
        const field = x[key as keyof typeof x] as { value: unknown; confidence: string };
        const got = key.endsWith("Hijri") ? normalizeHijri(field.value as string) : field.value;
        check(key, got, expected[key], field.confidence);
      }
      check("installments.count", x.installments.items.length, expected.installments.length, x.installments.confidence);
      expected.installments.forEach((want, i) => {
        const got = x.installments.items[i];
        check(`installment ${i + 1} date`, got?.dueDateGregorian, want.dueDateGregorian, x.installments.confidence);
        check(`installment ${i + 1} hijri`, normalizeHijri(got?.dueDateHijri), want.dueDateHijri, x.installments.confidence);
        check(`installment ${i + 1} amount`, got?.amount, want.amount, x.installments.confidence);
      });

      const { flags } = draftFromExtraction(x);
      const wrong = rows.filter((r) => !r[4]);
      console.log(
        `\n${file}: ${rows.length - wrong.length}/${rows.length} fields right in ${seconds}s\n` +
          rows.map(([n, got, want, c, ok]) => `  ${ok ? "✓" : "✗"} ${n.padEnd(22)} ${JSON.stringify(got)}${ok ? "" : `  (expected ${JSON.stringify(want)})`}  [${c}]`).join("\n") +
          `\n  flags raised by the code checks: ${JSON.stringify(flags)}`,
      );
      expect(x.isEjarContract).toBe(true);
    });
  }
});
