import { createComprehensiveV3 } from "./comprehensiveV3Generation";
import { createCareerV3 } from "./careerV3Generation";
import { createLoveV3 } from "./loveV3Generation";
import { createCompatibilityV3 } from "./compatibilityV3Generation";
import { createMajorFortuneV3 } from "./majorFortuneV3Generation";
import { createAnnualV3 } from "./annualV3Generation";
import { getAnnualPurchasePolicyDate, type AnnualCommerceAcceptance } from "../payment/annualPurchasePolicy";
import { prepareProductGenerationFromPayload, type ProductGenerationResult } from "./productGenerationDispatcher";
import { isRecord, validateNewProductPublication } from "./productPublishGate";
import { deliveryIssueCodes, type DeliveryAudit } from "./deliveryAudit";

// The OpenAI writer was removed: every path returns a validated deterministic draft
// and makes no external call. The runtime argument is ignored; the strategy only
// labels the delivery audit as before (old callers keep their signatures).
export type GenerationStrategy = "normal_writer" | "writer_regeneration" | "deterministic_fallback";
export async function generateProductReport(payload: unknown, _runtime?: unknown, strategy: GenerationStrategy = "deterministic_fallback", annualAcceptance?: AnnualCommerceAcceptance, options: { readonly comprehensiveVersion?: "v2" | "v3"; readonly careerVersion?: "v3"; readonly loveVersion?: "v3"; readonly majorFortuneVersion?: "v3"; readonly annualVersion?: "v3" } = {}): Promise<ProductGenerationResult> {
  const audit: DeliveryAudit = { version: "paid-one-call-v1", preflight: "fail", writerValidation: "not_run", rescueKinds: [], fallbackUsed: false, publish: "fail", failureCode: null, issues: [] };
  const fail = (code: string, issues: readonly string[] = []): ProductGenerationResult => {
    audit.failureCode = code; audit.issues = deliveryIssueCodes(issues);
    return { ok: false, externalCalls: [], delivery: audit, error: { code: "INVALID_REPORT_INPUT", message: code, validationErrors: audit.issues } };
  };
  const purchaseDate = annualAcceptance === undefined ? undefined : getAnnualPurchasePolicyDate(annualAcceptance, payload);
  if (purchaseDate === null) return fail("ANNUAL_PURCHASE_CONTEXT_INVALID");
  const product = isRecord(payload) ? String(payload.productKey) : "";
  // Persisted, explicitly versioned input must select the same content in the
  // paid worker as in preview. Unversioned inputs keep their legacy contract.
  const inputV3Requested = isRecord(payload) && isRecord(payload.productOptions) && payload.productOptions.contentVersion === "v3";
  const annualV3Requested = options.annualVersion === "v3" || inputV3Requested;
  if (product === "annual_fortune" && annualV3Requested) {
    try {
      const v3 = await createAnnualV3(payload, { ...(purchaseDate ? { policyDate: purchaseDate } : {}) });
      if (!v3) return fail("ANNUAL_V3_PREPARATION_FAILED");
      const check = validateNewProductPublication(product, v3.draft, v3.evidencePacket, payload);
      if (!check.ok) return fail("ANNUAL_V3_PUBLICATION_FAILED", check.errors);
      audit.preflight = "pass"; audit.publish = "pass";
      return { ok: true, kind: "annualFortune", ...v3, externalCalls: [], delivery: audit };
    } catch { return fail("ANNUAL_V3_PREPARATION_FAILED"); }
  }
  // Only newly versioned inputs fix A/B roles. Old inputs keep their frozen
  // contract. A bad/new role version fails closed.
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
  if (product === "love_marriage_child" && (options.loveVersion === "v3" || inputV3Requested)) {
    try {
      const v3 = createLoveV3(payload);
      if (!v3) return fail("LOVE_V3_PREPARATION_FAILED");
      const generated = { ok: true as const, kind: "loveMarriageChild" as const, ...v3 };
      const check = validateNewProductPublication(product, generated.draft, generated.evidencePacket, payload);
      if (!check.ok) return fail("LOVE_V3_PUBLICATION_FAILED", check.errors);
      audit.preflight = "pass"; audit.publish = "pass";
      return { ...generated, externalCalls: [], delivery: audit };
    } catch { return fail("LOVE_V3_PREPARATION_FAILED"); }
  }
  if (product === "major_fortune" && (options.majorFortuneVersion === "v3" || inputV3Requested)) {
    try {
      const v3 = await createMajorFortuneV3(payload);
      if (!v3) return fail("MAJOR_FORTUNE_V3_PREPARATION_FAILED");
      const check = validateNewProductPublication(product, v3.draft, v3.evidencePacket, payload);
      if (!check.ok) return fail("MAJOR_FORTUNE_V3_PUBLICATION_FAILED", check.errors);
      audit.preflight = "pass"; audit.publish = "pass";
      return { ok: true, kind: "majorFortune", ...v3, externalCalls: [], delivery: audit };
    } catch { return fail("MAJOR_FORTUNE_V3_PREPARATION_FAILED"); }
  }
  if (product === "career_money_study" && (options.careerVersion === "v3" || inputV3Requested)) {
    try {
      const v3 = createCareerV3(payload);
      // Invalid/non-exact inputs remain on the validated deterministic legacy contract.
      const generated = v3 ? { ok: true as const, kind: "careerMoneyStudy" as const, ...v3 }
        : await prepareProductGenerationFromPayload(payload);
      if (!generated.ok) return fail("CAREER_V3_PREPARATION_FAILED");
      const check = validateNewProductPublication(product, generated.draft, generated.evidencePacket, payload);
      if (!check.ok) return fail("CAREER_V3_PUBLICATION_FAILED", check.errors);
      audit.preflight = "pass"; audit.publish = "pass";
      return { ...generated, externalCalls: [], delivery: audit };
    } catch { return fail("CAREER_V3_PREPARATION_FAILED"); }
  }
  // An explicit legacy option still wins over input metadata.
  if (product === "saju_mbti_full" && (options.comprehensiveVersion === "v3" || (options.comprehensiveVersion === undefined && inputV3Requested))) {
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
    // Normalization, calculation, product evidence + complete deterministic draft.
    prepared = await prepareProductGenerationFromPayload(payload, purchaseDate ? { annualFortune: { now: () => purchaseDate } } : {});
    if (!prepared.ok) return fail("PREFLIGHT_CONTRACT_INVALID", "validationErrors" in prepared.error ? prepared.error.validationErrors : []);
    const check = validateNewProductPublication(product, prepared.draft, prepared.evidencePacket, payload);
    if (!check.ok) return fail("FALLBACK_INVARIANT_FAILED", check.errors);
  } catch { return fail("PREFLIGHT_CONTRACT_INVALID"); }
  // Same audit codes as when the writer flag was off.
  audit.preflight = "pass"; audit.fallbackUsed = true; audit.publish = "pass";
  audit.failureCode = strategy === "normal_writer" ? "WRITER_DISABLED" : "AUTOMATIC_RETRY_NO_WRITER";
  return { ...prepared, delivery: audit, externalCalls: [] };
}
