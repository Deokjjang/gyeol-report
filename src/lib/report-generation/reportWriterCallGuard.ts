import { ExternalCallTimeout, withDeadline } from "../network/withDeadline";

export const REPORT_WRITER_TIMEOUT_MS = 120_000;
export const REPORT_WRITER_INPUT_BYTES = 1_048_576;
// Generous tiers preserve long structured reports; these are ceilings, not targets.
export const REPORT_OUTPUT_TOKENS = {
  comprehensive: 65_536, career: 32_768, love: 32_768,
  compatibility: 32_768, major: 65_536, annual: 32_768,
} as const;
export type WriterProduct = keyof typeof REPORT_OUTPUT_TOKENS;
export type WriterCallOutcome = "completed" | "timeout" | "rate_limit" | "config" | "quota" | "malformed" | "incomplete" | "validation" | "provider";
export type WriterCallAudit = {
  sequence: number; model: string; inputTokens: number | null; outputTokens: number | null;
  totalTokens: number | null; durationMs: number; outcome: WriterCallOutcome;
};
export type WriterCallBudget = { readonly limit: number; readonly calls: WriterCallAudit[] };
type GuardConfig = { readonly fetchImpl?: typeof fetch; readonly callBudget?: WriterCallBudget };
const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const count = (value: unknown): number | null => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= 999_999_999 ? value : null;

function outcome(status: number, body: unknown): WriterCallOutcome {
  const code = record(body) && record(body.error) ? body.error.code : undefined;
  if (code === "insufficient_quota" || code === "billing_hard_limit_reached") return "quota";
  if (status === 401 || status === 403 || code === "model_not_found" || code === "invalid_api_key") return "config";
  return status === 429 ? "rate_limit" : "provider";
}

// No SDK, retries, prompt logging or provider error messages in the audit.
export function guardedReportFetch(config: GuardConfig, product: WriterProduct): typeof fetch {
  const budget = config.callBudget ?? { limit: product === "compatibility" || product === "comprehensive" ? 2 : 1, calls: [] };
  return async (url, init) => {
    if (budget.calls.length >= budget.limit) throw new Error("OPENAI_CALL_LIMIT");
    const payload = JSON.parse(String(init?.body)) as Record<string, unknown>;
    const body = JSON.stringify({ ...payload, max_output_tokens: REPORT_OUTPUT_TOKENS[product] });
    if (new TextEncoder().encode(body).byteLength > REPORT_WRITER_INPUT_BYTES) throw new Error("OPENAI_INPUT_LIMIT");
    const model = typeof payload.model === "string" && /^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,99}$/.test(payload.model) && !payload.model.startsWith("sk-") ? payload.model : "unknown";
    const audit: WriterCallAudit = { sequence: budget.calls.length + 1, model, inputTokens: null, outputTokens: null, totalTokens: null, durationMs: 0, outcome: "provider" };
    budget.calls.push(audit);
    const started = Date.now();
    try {
      return await withDeadline(async signal => {
        const response = await (config.fetchImpl ?? fetch)(url, { ...init, body, signal });
        let value: unknown;
        try { value = await response.json(); } catch (error) {
          if (!response.ok) value = null;
          else { if (!signal.aborted) audit.outcome = "malformed"; throw error; }
        }
        if (signal.aborted) throw new ExternalCallTimeout();
        if (record(value) && record(value.usage)) {
          audit.inputTokens = count(value.usage.input_tokens);
          audit.outputTokens = count(value.usage.output_tokens);
          audit.totalTokens = count(value.usage.total_tokens);
        }
        if (!response.ok) audit.outcome = outcome(response.status, value);
        else {
          if (!record(value)) { audit.outcome = "malformed"; throw new Error("OPENAI_MALFORMED"); }
          if ((value.status !== undefined && value.status !== "completed") || value.incomplete_details != null || value.error != null ||
            (Array.isArray(value.output) && value.output.some(item => record(item) && item.status !== undefined && item.status !== "completed"))) {
            audit.outcome = "incomplete";
            throw new Error("OPENAI_INCOMPLETE");
          }
          audit.outcome = "completed";
        }
        // Existing writers consume a buffered body; the network deadline is complete.
        return new Response(JSON.stringify(value), { status: response.status, headers: response.headers });
      }, REPORT_WRITER_TIMEOUT_MS);
    } catch (error) {
      if (error instanceof ExternalCallTimeout || (error instanceof Error && error.name === "AbortError")) audit.outcome = "timeout";
      throw error;
    } finally { audit.durationMs = Math.max(0, Date.now() - started); }
  };
}
