import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { describe, expect, it } from "vitest";
import { ExtractedContractSchema } from "@/lib/contracts/schema";

// Anthropic rejects structured-output schemas with more than 16 union-typed parameters
// (anyOf, or "type" given as a list — which is what a nullable field becomes). This failed in production once.
describe("AI output schema", () => {
  it("stays within Anthropic's union-type limit", () => {
    const { schema } = betaZodOutputFormat(ExtractedContractSchema) as unknown as { schema: unknown };
    let unions = 0;
    const walk = (node: unknown) => {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== "object") return;
      const o = node as Record<string, unknown>;
      if (Array.isArray(o.anyOf) || Array.isArray(o.oneOf) || Array.isArray(o.type)) unions++;
      Object.values(o).forEach(walk);
    };
    walk(schema);
    expect(unions).toBeLessThanOrEqual(16);
    expect(unions).toBe(0);
  });
});
