import { getAnnualPurchasePolicyDate, type AnnualCommerceAcceptance } from "../payment/annualPurchasePolicy";
import { prepareProductGenerationFromPayload, createProductGenerationDispatcherOptionsFromWriterRuntime, type ProductGenerationResult } from "./productGenerationDispatcher";
import type { ReportWriterRuntime } from "./reportWriterRuntime";
import { isRecord, validateProductPublication } from "./productPublishGate";

export type GenerationStrategy = "normal_writer" | "writer_regeneration" | "deterministic_fallback";
export async function generateProductReport(payload: unknown, runtime: ReportWriterRuntime, strategy: GenerationStrategy, annualAcceptance?: AnnualCommerceAcceptance): Promise<ProductGenerationResult> {
  const purchaseDate = annualAcceptance === undefined ? undefined : getAnnualPurchasePolicyDate(annualAcceptance, payload);
  if (purchaseDate === null) return { ok: false, error: { code: "INVALID_REPORT_INPUT", message: "ANNUAL_PURCHASE_CONTEXT_INVALID" } };
  if (strategy !== "deterministic_fallback" && !runtime.enabled) return { ok: false, error: { code: "INVALID_REPORT_INPUT", message: "WRITER_NOT_CONFIGURED" } };
  const options = createProductGenerationDispatcherOptionsFromWriterRuntime(
    strategy === "deterministic_fallback" ? { enabled: false, reason: "flag_disabled" } : runtime,
  );
  const result = await prepareProductGenerationFromPayload(payload, {
    ...options, automaticFallback: false,
    ...(purchaseDate ? { annualFortune: { ...options.annualFortune, now: () => purchaseDate } } : {}),
    ...(runtime.enabled && strategy !== "deterministic_fallback" ? {
      comprehensiveV2: { writer: { enabled: true, config: { ...runtime.config, allowRepair: false } } },
    } : {}),
  });
  if (!result.ok) return result;
  const gate = validateProductPublication(isRecord(payload) ? String(payload.productKey) : "", result.draft, result.evidencePacket, payload);
  return gate.ok ? result : { ok: false, error: { code: "INVALID_REPORT_INPUT", message: gate.errors.join("; "), validationErrors: gate.errors } };
}
