import { getAnnualPurchasePolicyDate, type AnnualCommerceAcceptance } from "./annualPurchasePolicy";
import { generateProductReport, type GenerationStrategy } from "../report-generation/generateProductReport";
import { isRecord, PUBLISH_GATE_VERSION, validateProductPublication, validateNewProductPublication } from "../report-generation/productPublishGate";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft, type ProductPreviewProductType, type ReportProductSlug } from "../report-generation/productPreviewSnapshot";
import type { ProductGenerationResult } from "../report-generation/productGenerationDispatcher";
import type { ReportWriterRuntime } from "../report-generation/reportWriterRuntime";
import { deliveryIssueCodes } from "../report-generation/paidWriterRescue";
import type { ReliabilityStore } from "./paidReportReliabilityStore";
import type { TossConfirmClientResult, TossConfirmRequest } from "./tossConfirmTypes";

// A crash after provider approval leaves the claimed payment key durable. The worker
// reconciles it with the same provider idempotency key before claiming generation.
export async function confirmPaidReport(input: TossConfirmRequest, store: ReliabilityStore,
  confirm: (input: TossConfirmRequest) => Promise<TossConfirmClientResult>) {
  const claim = await store.call("confirm_claim", { ...input });
  if (!claim.ok || claim.reportId || claim.pending) return claim;
  let paidAt: string | undefined;
  if (!claim.alreadyPaid) {
    try {
      const result = await confirm(input);
      if (!result.ok || result.confirm.status !== "DONE" || result.confirm.orderId !== input.orderId || result.confirm.amount !== input.amount) {
        return { ok: false, code: "PAYMENT_CONFIRM_PENDING" };
      }
      paidAt = result.confirm.approvedAt;
    } catch {
      return { ok: false, code: "PAYMENT_CONFIRM_PENDING" };
    }
  }
  return store.call("confirm_finish", { ...input, token: claim.token, paidAt });
}

export type ProductGenerator = (payload: unknown, runtime: ReportWriterRuntime, strategy: GenerationStrategy, annualAcceptance?: AnnualCommerceAcceptance) => Promise<ProductGenerationResult>;
// Shared fulfillment body. The caller verifies the origin (paid order or ticket)
// before entry; neither a client nor an entitlement chooses a weaker validator.
export async function generateReportSnapshot(job: { payload: unknown; product_type: string; report_id: string; created_at: string }, runtime: ReportWriterRuntime,
  strategy: GenerationStrategy, generate: ProductGenerator, validatePublication = validateNewProductPublication, annualAcceptance?: AnnualCommerceAcceptance) {
  const result = annualAcceptance === undefined ? await generate(job.payload, runtime, strategy) : await generate(job.payload, runtime, strategy, annualAcceptance);
  if (!result.ok) {
    const errors = "validationErrors" in result.error ? result.error.validationErrors : undefined;
    return { success: false as const, result, stage: errors ? "validation" : "generation", code: result.delivery?.failureCode ?? result.externalFailure ?? (errors ? "PUBLISH_REJECTED" : "GENERATION_FAILED"), errors: errors ?? [result.error.code] };
  }
  try {
    const gate = validatePublication(job.product_type, result.draft, result.evidencePacket);
    if (!gate.ok) return { success: false as const, result, stage: "validation", code: "PUBLISH_REJECTED", errors: gate.errors };
    const snapshot = createProductPreviewSnapshot({ reportId: job.report_id, createdAtIso: job.created_at,
      productKey: job.product_type as ProductPreviewProductType, productSlug: (isRecord(job.payload) ? job.payload.productSlug : "") as ReportProductSlug,
      draft: result.draft as ProductPreviewSnapshotDraft, evidencePacket: result.evidencePacket });
    if (!snapshot.ok) return { success: false as const, result, stage: "snapshot", code: snapshot.error };
    // Legacy full-access serialization, not a payment receipt. Origin lives in the
    // durable fulfillment record, never in a fabricated Toss payment/order.
    return { success: true as const, result, snapshot: { ...snapshot.value, access: { mode: "paid" as const, isPaid: true, isUnlocked: true } }, gateVersion: PUBLISH_GATE_VERSION };
  } catch {
    // Preserve the paid worker's already-recorded call/delivery audit even if a
    // validator unexpectedly throws after generation has returned.
    return { success: false as const, result, stage: "generation", code: "GENERATION_EXCEPTION" };
  }
}
// Internal dependency only; HTTP handlers never accept or forward a validator.
export async function runPaidReportJob(store: ReliabilityStore, runtime: ReportWriterRuntime, generate: ProductGenerator = generateProductReport, validatePublication = validateNewProductPublication) {
  const claimed = await store.call("claim_job", { model: runtime.enabled ? runtime.config.model : "deterministic" });
  if (!claimed.ok || !isRecord(claimed.job)) return claimed;
  const job = claimed.job;
  const attempt = Number(job.attempt_count);
  // The durable claim consumes the only writer opportunity for this run. Even a
  // crash with unknown usage must never cause another automatic billable call.
  const strategy: GenerationStrategy = attempt === 1 ? "normal_writer" : "deterministic_fallback";
  const started = Date.now();
  let externalCalls: ProductGenerationResult["externalCalls"] = [];
  let delivery: ProductGenerationResult["delivery"];
  const finish = (data: Record<string, unknown>) => store.call("finish_job", {
    jobId: job.job_id, token: job.lease_token, durationMs: Date.now() - started, externalCalls, delivery, ...data,
    ...(Array.isArray(data.errors) ? { errors: deliveryIssueCodes(data.errors.filter((value): value is string => typeof value === "string")) } : {}),
  });
  try {
    let annualAcceptance: AnnualCommerceAcceptance | undefined;
    if (job.product_type === "annual_fortune") {
      // find_order returns the immutable server-owned input snapshot, not request data.
      const found = await store.call("find_order", { paymentOrderId: job.order_id });
      const order = isRecord(found.order) ? found.order : undefined;
      const input = isRecord(order?.input_snapshot) ? order.input_snapshot : undefined;
      const context = input?.annualCommerceAcceptance;
      if (!found.ok || order?.status !== "paid" || order.payment_order_id !== job.order_id ||
        order.product_type !== job.product_type || order.report_id !== job.report_id ||
        !getAnnualPurchasePolicyDate(context, job.payload) ||
        !getAnnualPurchasePolicyDate(context, input?.reportInputPayload)) {
        return finish({ success: false, stage: "validation", code: "ANNUAL_PURCHASE_CONTEXT_INVALID", errors: ["ANNUAL_PURCHASE_CONTEXT_INVALID"] });
      }
      annualAcceptance = context as AnnualCommerceAcceptance;
    }
    const outcome = await generateReportSnapshot({ payload: job.payload, product_type: String(job.product_type), report_id: String(job.report_id), created_at: String(job.created_at) }, runtime, strategy, generate, validatePublication, annualAcceptance);
    const { result, ...publication } = outcome;
    externalCalls = result.externalCalls ?? [];
    delivery = result.delivery;
    return finish(publication);
  } catch {
    return finish({ success: false, stage: "generation", code: "GENERATION_EXCEPTION" });
  }
}

export async function readPublishedReport(store: ReliabilityStore, reportId: string, validatePublication = validateProductPublication) {
  const result = await store.call("read_report", { reportId });
  if (!result.ok || result.status !== "COMPLETED") return { ...result, snapshot: null };
  const snapshot = result.snapshot;
  if (!isRecord(snapshot) || snapshot.reportId !== reportId || !validatePublication(String(snapshot.productType), snapshot.draft, snapshot.evidencePacket).ok) {
    // Compare the observed value under DB locks so a delayed read cannot
    // quarantine a replacement published by an admin recovery run.
    await store.call("quarantine", { reportId, expectedSnapshot: snapshot ?? null });
    return { ok: true, status: "FAILED_REQUIRES_ATTENTION", snapshot: null };
  }
  return result;
}
