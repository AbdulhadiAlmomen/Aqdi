import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { ExtractionError, type ContractExtractor } from "./extractor";
import { ExtractedContractSchema, type ExtractedContract } from "./schema";

// The build plan names Claude Sonnet for contract reading.
const MODEL = "claude-sonnet-5-5";

const SYSTEM = `You read Saudi Ejar unified residential lease contracts (عقد الإيجار الموحد) and return their data for a property management system.

Copy what is printed; do not compute, guess or fill in values. Use an empty string for anything not on the page. The tenant is المستأجر, never the lessor (المؤجر) or the brokerage office. Give dates as YYYY-MM-DD with Western digits: Gregorian dates as printed, and Hijri dates converted from the printed day/month/year without recalculating them from the Gregorian date. Give amounts as digits only in SAR, without commas or currency. List in uncertainFields every field whose text is unclear, cut off, contradictory, or that you had to infer.`;

// Shown to the model only on the fallback path, where the API isn't enforcing the schema.
const JSON_INSTRUCTIONS = `Reply with only one JSON object, no other text, matching this JSON Schema:\n${JSON.stringify(z.toJSONSchema(ExtractedContractSchema))}`;

type PdfBlock = { type: "document"; source: { type: "base64"; media_type: "application/pdf"; data: string } };

export class ClaudeExtractor implements ContractExtractor {
  private client: Anthropic;

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) throw new ExtractionError("notConfigured", "ANTHROPIC_API_KEY is not set");
    // One retry; the import page allows several minutes per request.
    this.client = new Anthropic({ timeout: 120_000, maxRetries: 1 });
  }

  async extract(pdf: Uint8Array): Promise<ExtractedContract> {
    const document: PdfBlock = { type: "document", source: { type: "base64", media_type: "application/pdf", data: Buffer.from(pdf).toString("base64") } };
    let data: ExtractedContract;
    try {
      data = await this.structured(document);
    } catch (error) {
      // Anthropic compiles the schema into a grammar with size limits. If it refuses the schema itself,
      // ask for plain JSON instead and validate it here against the same schema.
      if (error instanceof Anthropic.BadRequestError && /grammar|schema|union/i.test(reason(error))) {
        console.warn(`structured output refused (${reason(error)}); falling back to validated JSON`);
        try {
          data = await this.plainJson(document);
        } catch (fallbackError) {
          throw translate(fallbackError);
        }
      } else {
        throw translate(error);
      }
    }
    if (!data.isEjarContract) throw new ExtractionError("notContract");
    return data;
  }

  private async structured(document: PdfBlock) {
    const response = await this.client.beta.messages.parse({
      ...this.base(),
      output_config: { effort: "medium", format: betaZodOutputFormat(ExtractedContractSchema) },
      messages: [{ role: "user", content: [document, { type: "text", text: "Extract this contract's data." }] }],
    });
    checkStop(response.stop_reason, response.stop_details?.category);
    if (!response.parsed_output) throw new ExtractionError("failed", `no structured output (stop_reason ${response.stop_reason})`);
    return response.parsed_output;
  }

  private async plainJson(document: PdfBlock) {
    const response = await this.client.beta.messages.create({
      ...this.base(),
      output_config: { effort: "medium" },
      messages: [{ role: "user", content: [document, { type: "text", text: `Extract this contract's data.\n\n${JSON_INSTRUCTIONS}` }] }],
    });
    checkStop(response.stop_reason, response.stop_details?.category);
    const text = response.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    let raw: unknown;
    try {
      raw = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    } catch {
      throw new ExtractionError("failed", "the reply was not valid JSON");
    }
    const parsed = ExtractedContractSchema.safeParse(raw);
    if (!parsed.success) {
      throw new ExtractionError("failed", `the reply didn't match the schema at ${parsed.error.issues.slice(0, 3).map((i) => i.path.join(".")).join(", ")}`);
    }
    return parsed.data;
  }

  private base() {
    return {
      model: MODEL,
      max_tokens: 16000,
      // If a safety classifier declines, the API retries on Anthropic's recommended fallback model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default" as const,
      system: SYSTEM,
    };
  }
}

function reason(error: InstanceType<typeof Anthropic.APIError>) {
  return (error.error as { error?: { message?: string } } | undefined)?.error?.message ?? error.message;
}

function checkStop(stop: string | null, category?: string | null) {
  if (stop === "refusal") throw new ExtractionError("refused", category ?? undefined);
  if (stop === "max_tokens") throw new ExtractionError("failed", "the reply was cut off (max_tokens)");
}

function translate(error: unknown): ExtractionError {
  if (error instanceof ExtractionError) return error;
  if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
    return new ExtractionError("notConfigured", reason(error));
  }
  if (error instanceof Anthropic.RateLimitError || error instanceof Anthropic.InternalServerError) {
    return new ExtractionError("busy", reason(error));
  }
  // Log the API's own explanation, not the whole response body.
  if (error instanceof Anthropic.APIError) return new ExtractionError("failed", `${error.status}: ${reason(error)}`);
  return new ExtractionError("failed", String(error));
}
