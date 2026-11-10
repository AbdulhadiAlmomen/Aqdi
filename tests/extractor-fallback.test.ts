import Anthropic from "@anthropic-ai/sdk";
import { beforeAll, describe, expect, it } from "vitest";
import { ClaudeExtractor } from "@/lib/contracts/claude-extractor";
import { ExtractionError } from "@/lib/contracts/extractor";
import { asExtraction } from "@/lib/contracts/mock-extractor";
import sample1 from "@/samples/expected/sample-1.json";

// No network: a fake client stands in for the Anthropic API.
const grammarError = () =>
  new Anthropic.BadRequestError(
    400,
    { type: "error", error: { type: "invalid_request_error", message: "The compiled grammar is too large, which would cause performance issues." } },
    "400",
    new Headers(),
  );

function extractorWith(replyText: string) {
  const extractor = new ClaudeExtractor();
  const calls: string[] = [];
  (extractor as unknown as { client: unknown }).client = {
    beta: {
      messages: {
        parse: async () => {
          calls.push("structured");
          throw grammarError();
        },
        create: async () => {
          calls.push("plain");
          return { stop_reason: "end_turn", stop_details: null, content: [{ type: "text", text: replyText }] };
        },
      },
    },
  };
  return { extractor, calls };
}

describe("Claude extractor fallback", () => {
  beforeAll(() => {
    process.env.ANTHROPIC_API_KEY ??= "test-key-not-used";
  });

  it("falls back to plain JSON when the schema is refused, and validates it", async () => {
    const expected = asExtraction(sample1);
    const { extractor, calls } = extractorWith("Here is the data:\n```json\n" + JSON.stringify(expected) + "\n```");
    const data = await extractor.extract(new Uint8Array([37, 80, 68, 70]));
    expect(calls).toEqual(["structured", "plain"]);
    expect(data).toEqual(expected);
  });

  it("rejects a fallback reply that doesn't match the schema", async () => {
    const { extractor } = extractorWith(JSON.stringify({ isEjarContract: true, contractNumber: 123 }));
    await expect(extractor.extract(new Uint8Array([37]))).rejects.toMatchObject({ code: "failed" });
  });

  it("rejects a fallback reply that isn't JSON", async () => {
    const { extractor } = extractorWith("I couldn't read this document.");
    const error = await extractor.extract(new Uint8Array([37])).catch((e) => e);
    expect(error).toBeInstanceOf(ExtractionError);
    expect(error.code).toBe("failed");
  });
});
