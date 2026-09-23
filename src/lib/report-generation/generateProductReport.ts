import type { WriterCallBudget } from "./reportWriterCallGuard";
import { getAnnualPurchasePolicyDate, type AnnualCommerceAcceptance } from "../payment/annualPurchasePolicy";
import { prepareProductGenerationFromPayload, type ProductGenerationResult } from "./productGenerationDispatcher";
import type { ReportWriterRuntime } from "./reportWriterRuntime";
import { isRecord, validateNewProductPublication } from "./productPublishGate";
import { callOpenAIReportWriter } from "./openaiReportWriterClient";
import { buildPaidWriterRequest } from "./paidWriterRequest";
import { deliveryIssueCodes, settlePaidWriterDraft, type DeliveryAudit } from "./paidWriterRescue";

// writer_regeneration is retained for old callers, but no longer buys another call.
export type GenerationStrategy = "normal_writer" | "writer_regeneration" | "deterministic_fallback";
export async function generateProductReport(payload: unknown, runtime: ReportWriterRuntime, strategy: GenerationStrategy, annualAcceptance?: AnnualCommerceAcceptance): Promise<ProductGenerationResult> {
  const audit: DeliveryAudit = { version: "paid-one-call-v1", preflight: "fail", writerValidation: "not_run", rescueKinds: [], fallbackUsed: false, publish: "fail", failureCode: null, issues: [] };
  const budget: WriterCallBudget = { limit: strategy === "normal_writer" ? 1 : 0, calls: [] };
  const fail = (code: string, issues: readonly string[] = []): ProductGenerationResult => {
    audit.failureCode = code; audit.issues = deliveryIssueCodes(issues);
    return { ok: false, externalCalls: budget.calls, delivery: audit, error: { code: "INVALID_REPORT_INPUT", message: code, validationErrors: audit.issues } };
  };
  const purchaseDate = annualAcceptance === undefined ? undefined : getAnnualPurchasePolicyDate(annualAcceptance, payload);
  if (purchaseDate === null) return fail("ANNUAL_PURCHASE_CONTEXT_INVALID");
  const product = isRecord(payload) ? String(payload.productKey) : "";
  let prepared: ProductGenerationResult;
  try {
    // Normalization, calculation, product evidence + complete fallback, before HTTP.
    prepared = await prepareProductGenerationFromPayload(payload, {
      automaticFallback: false,
      ...(purchaseDate ? { annualFortune: { now: () => purchaseDate } } : {}),
    });
    if (!prepared.ok) return fail("PREFLIGHT_CONTRACT_INVALID", "validationErrors" in prepared.error ? prepared.error.validationErrors : []);
    const check = validateNewProductPublication(product, prepared.draft, prepared.evidencePacket, payload);
    if (!check.ok) return fail("FALLBACK_INVARIANT_FAILED", check.errors);
  } catch { return fail("PREFLIGHT_CONTRACT_INVALID"); }
  audit.preflight = "pass";
  const fallback = (code: string): ProductGenerationResult => {
    // Recheck the exact object being returned; no partial draft or failed rescue.
    const check = validateNewProductPublication(product, prepared.draft, prepared.evidencePacket, payload);
    if (!check.ok) return fail("FALLBACK_INVARIANT_FAILED", check.errors);
    audit.fallbackUsed = true; audit.publish = "pass"; audit.failureCode = code;
    return { ...prepared, delivery: audit, externalCalls: budget.calls };
  };
  if (strategy !== "normal_writer") return fallback("AUTOMATIC_RETRY_NO_WRITER");
  if (!runtime.enabled) return fallback(runtime.reason === "flag_disabled" ? "WRITER_DISABLED" : "OPENAI_CONFIG");
  if (!runtime.config.apiKey.trim() || !/^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,99}$/.test(runtime.config.model) || runtime.config.model.startsWith("sk-")) return fallback("OPENAI_CONFIG");
  let rawText: string;
  try {
    const name = isRecord(payload) && isRecord(payload.person) && typeof payload.person.name === "string" ? payload.person.name.trim() : undefined;
    const request = buildPaidWriterRequest(prepared, name);
    const result = await callOpenAIReportWriter({ ...request, responseFormatName: `${request.product}_report_draft`,
      config: { ...runtime.config, callBudget: budget, allowRepair: false } });
    rawText = result.rawText;
  } catch {
    const last = budget.calls.at(-1);
    if (last?.outcome === "completed") last.outcome = "malformed";
    return fallback(last ? `OPENAI_${last.outcome.toUpperCase()}` : "WRITER_PREFLIGHT_REJECTED");
  }
  let parsed: unknown;
  try { parsed = JSON.parse(rawText); }
  catch { budget.calls[0].outcome = "malformed"; return fallback("OPENAI_MALFORMED"); }
  try {
    const settled = settlePaidWriterDraft(product, parsed, prepared, payload);
    audit.writerValidation = settled.source === "writer" ? "pass" : "fail";
    audit.issues = settled.issues;
    audit.rescueKinds = settled.rescueKinds;
    if (settled.source !== "writer") budget.calls[0].outcome = "validation";
    if (settled.source === "fallback") return fallback("WRITER_VALIDATION_FAILED");
    const check = validateNewProductPublication(product, settled.draft, prepared.evidencePacket, payload);
    if (!check.ok) return fallback("PUBLISH_REJECTED");
    audit.publish = "pass";
    return { ...prepared, draft: settled.draft, delivery: audit, externalCalls: budget.calls };
  } catch {
    audit.writerValidation = "fail";
    budget.calls[0].outcome = "validation";
    return fallback("WRITER_VALIDATION_FAILED");
  }
}
