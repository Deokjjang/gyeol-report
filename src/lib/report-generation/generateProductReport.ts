import type { WriterCallBudget } from "./reportWriterCallGuard";
import { createComprehensiveV3 } from "./comprehensiveV3Generation";
import { createCareerV3 } from "./careerV3Generation";
import { createLoveV3 } from "./loveV3Generation";
import { createCompatibilityV3 } from "./compatibilityV3Generation";
import { createMajorFortuneV3 } from "./majorFortuneV3Generation";
import { getAnnualPurchasePolicyDate, type AnnualCommerceAcceptance } from "../payment/annualPurchasePolicy";
import { prepareProductGenerationFromPayload, type ProductGenerationResult } from "./productGenerationDispatcher";
import type { ReportWriterRuntime } from "./reportWriterRuntime";
import { isRecord, validateNewProductPublication } from "./productPublishGate";
import { callOpenAIReportWriter } from "./openaiReportWriterClient";
import { buildPaidWriterRequest } from "./paidWriterRequest";
import { deliveryIssueCodes, settlePaidWriterDraft, type DeliveryAudit } from "./paidWriterRescue";

// writer_regeneration is retained for old callers, but no longer buys another call.
export type GenerationStrategy = "normal_writer" | "writer_regeneration" | "deterministic_fallback";
export async function generateProductReport(payload: unknown, runtime: ReportWriterRuntime, strategy: GenerationStrategy, annualAcceptance?: AnnualCommerceAcceptance, options: { readonly comprehensiveVersion?: "v2" | "v3"; readonly careerVersion?: "v3"; readonly loveVersion?: "v3"; readonly majorFortuneVersion?: "v3" } = {}): Promise<ProductGenerationResult> {
  const audit: DeliveryAudit = { version: "paid-one-call-v1", preflight: "fail", writerValidation: "not_run", rescueKinds: [], fallbackUsed: false, publish: "fail", failureCode: null, issues: [] };
  const budget: WriterCallBudget = { limit: strategy === "normal_writer" ? 1 : 0, calls: [] };
  const fail = (code: string, issues: readonly string[] = []): ProductGenerationResult => {
    audit.failureCode = code; audit.issues = deliveryIssueCodes(issues);
    return { ok: false, externalCalls: budget.calls, delivery: audit, error: { code: "INVALID_REPORT_INPUT", message: code, validationErrors: audit.issues } };
  };
  const purchaseDate = annualAcceptance === undefined ? undefined : getAnnualPurchasePolicyDate(annualAcceptance, payload);
  if (purchaseDate === null) return fail("ANNUAL_PURCHASE_CONTEXT_INVALID");
  const product = isRecord(payload) ? String(payload.productKey) : "";
  // Only newly versioned inputs fix A/B roles. Old inputs keep their frozen
  // contract. A bad/new role version fails closed, never enters a writer.
  if (product === "saju_mbti_compatibility" && isRecord(payload) && payload.compatibilityRoleVersion !== undefined) {
    try {
      const v3 = createCompatibilityV3(payload);
      if (!v3) return fail("COMPATIBILITY_V3_PREPARATION_FAILED");
      const check = validateNewProductPublication(product, v3.draft, v3.evidencePacket, payload);
      if (!check.ok) return fail("COMPATIBILITY_V3_PUBLICATION_FAILED", check.errors);
      audit.preflight = "pass"; audit.publish = "pass";
      return { ok: true, kind: "compatibility", ...v3, externalCalls: [], delivery: audit };
    } catch { return fail("COMPATIBILITY_V3_PREPARATION_FAILED"); }
  }
  if (product === "love_marriage_child" && options.loveVersion === "v3") {
    try {
      const v3 = createLoveV3(payload);
      const generated = v3 ? { ok: true as const, kind: "loveMarriageChild" as const, ...v3 }
        : await prepareProductGenerationFromPayload(payload, { automaticFallback: false });
      if (!generated.ok) return fail("LOVE_V3_PREPARATION_FAILED");
      const check = validateNewProductPublication(product, generated.draft, generated.evidencePacket, payload);
      if (!check.ok) return fail("LOVE_V3_PUBLICATION_FAILED", check.errors);
      audit.preflight = "pass"; audit.publish = "pass";
      return { ...generated, externalCalls: [], delivery: audit };
    } catch { return fail("LOVE_V3_PREPARATION_FAILED"); }
  }
  if (product === "major_fortune" && options.majorFortuneVersion === "v3") {
    try {
      const v3 = await createMajorFortuneV3(payload);
      if (!v3) return fail("MAJOR_FORTUNE_V3_PREPARATION_FAILED");
      const check = validateNewProductPublication(product, v3.draft, v3.evidencePacket, payload);
      if (!check.ok) return fail("MAJOR_FORTUNE_V3_PUBLICATION_FAILED", check.errors);
      audit.preflight = "pass"; audit.publish = "pass";
      return { ok: true, kind: "majorFortune", ...v3, externalCalls: [], delivery: audit };
    } catch { return fail("MAJOR_FORTUNE_V3_PREPARATION_FAILED"); }
  }
  if (product === "career_money_study" && options.careerVersion === "v3") {
    try {
      const v3 = createCareerV3(payload);
      // Invalid/non-exact inputs remain on the validated deterministic legacy
      // contract. Explicit V3 can NEVER fall through to a writer call.
      const generated = v3 ? { ok: true as const, kind: "careerMoneyStudy" as const, ...v3 }
        : await prepareProductGenerationFromPayload(payload, { automaticFallback: false });
      if (!generated.ok) return fail("CAREER_V3_PREPARATION_FAILED");
      const check = validateNewProductPublication(product, generated.draft, generated.evidencePacket, payload);
      if (!check.ok) return fail("CAREER_V3_PUBLICATION_FAILED", check.errors);
      audit.preflight = "pass"; audit.publish = "pass";
      return { ...generated, externalCalls: [], delivery: audit };
    } catch { return fail("CAREER_V3_PREPARATION_FAILED"); }
  }
  // Explicit content-version boundary: paid/writer callers retain their current
  // contract. V3 reuses canonical calculation/evidence, not the V2 body builder.
  if (product === "saju_mbti_full" && options.comprehensiveVersion === "v3") {
    try {
      const v3 = createComprehensiveV3(payload);
      if (!v3) return fail("V3_PREPARATION_FAILED");
      const check = validateNewProductPublication(product, v3.draft, v3.evidencePacket, payload);
      if (!check.ok) return fail("V3_PUBLICATION_FAILED", check.errors);
      audit.preflight = "pass"; audit.publish = "pass";
      return { ok: true, kind: "comprehensiveV2", ...v3, externalCalls: [], delivery: audit };
    } catch { return fail("V3_PREPARATION_FAILED"); }
  }
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
