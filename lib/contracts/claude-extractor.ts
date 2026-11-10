import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { ExtractionError, type ContractExtractor } from "./extractor";
import { ExtractedContractSchema, type ExtractedContract } from "./schema";

// The build plan names Claude Sonnet for contract reading.
const MODEL = "claude-sonnet-5-5";

const SYSTEM = `You read Saudi Ejar unified residential lease contracts (عقد الإيجار الموحد) and return their data for a property management system.

Copy what is printed; do not compute, guess or fill in values. Use an empty string for anything not on the page. The tenant is المستأجر, never the lessor (المؤجر) or the brokerage office. Give dates as YYYY-MM-DD with Western digits: Gregorian dates as printed, and Hijri dates converted from the printed day/month/year without recalculating them from the Gregorian date. Give amounts as digits only in SAR, without commas or currency. Mark a field's confidence low when the text is unclear, cut off, contradictory, or you had to infer it.`;

export class ClaudeExtractor implements ContractExtractor {
  private client: Anthropic;

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) throw new ExtractionError("notConfigured", "ANTHROPIC_API_KEY is not set");
    // One retry; the import page allows several minutes per request.
    this.client = new Anthropic({ timeout: 120_000, maxRetries: 1 });
  }

  async extract(pdf: Uint8Array): Promise<ExtractedContract> {
    let response;
    try {
      response = await this.client.beta.messages.parse({
        model: MODEL,
        max_tokens: 16000,
        // If a safety classifier declines, the API retries on Anthropic's recommended fallback model.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: "medium", format: betaZodOutputFormat(ExtractedContractSchema) },
        system: SYSTEM,
        messages: [
          {
            role: "user",
            content: [
              { type: "document", source: { type: "base64", media_type: "application/pdf", data: Buffer.from(pdf).toString("base64") } },
              { type: "text", text: "Extract this contract's data." },
            ],
          },
        ],
      });
    } catch (error) {
      if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
        throw new ExtractionError("notConfigured", error.message);
      }
      if (error instanceof Anthropic.RateLimitError || error instanceof Anthropic.InternalServerError) {
        throw new ExtractionError("busy", error.message);
      }
      if (error instanceof Anthropic.APIError) {
        // Log the API's own explanation, not the whole response body.
        const reason = (error.error as { error?: { message?: string } } | undefined)?.error?.message ?? error.message;
        throw new ExtractionError("failed", `${error.status}: ${reason}`);
      }
      throw new ExtractionError("failed", String(error));
    }

    if (response.stop_reason === "refusal") throw new ExtractionError("refused", response.stop_details?.category ?? undefined);
    const data = response.parsed_output;
    if (!data) throw new ExtractionError("failed", `no structured output (stop_reason ${response.stop_reason})`);
    if (!data.isEjarContract) throw new ExtractionError("notContract");
    return data;
  }
}
