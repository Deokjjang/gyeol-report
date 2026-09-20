import { generateProductReport, type GenerationStrategy } from "../report-generation/generateProductReport";
import { isRecord, PUBLISH_GATE_VERSION, validateProductPublication } from "../report-generation/productPublishGate";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft, type ProductPreviewProductType, type ReportProductSlug } from "../report-generation/productPreviewSnapshot";
import type { ProductGenerationResult } from "../report-generation/productGenerationDispatcher";
import type { ReportWriterRuntime } from "../report-generation/reportWriterRuntime";
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

export type ProductGenerator = (payload: unknown, runtime: ReportWriterRuntime, strategy: GenerationStrategy) => Promise<ProductGenerationResult>;
export async function runPaidReportJob(store: ReliabilityStore, runtime: ReportWriterRuntime, generate: ProductGenerator = generateProductReport) {
  const claimed = await store.call("claim_job", { model: runtime.enabled ? runtime.config.model : "deterministic" });
  if (!claimed.ok || !isRecord(claimed.job)) return claimed;
  const job = claimed.job;
  const attempt = Number(job.attempt_count);
  const strategy: GenerationStrategy = attempt === 1 ? "normal_writer" : attempt === 2 ? "writer_regeneration" : "deterministic_fallback";
  const started = Date.now();
  const finish = (data: Record<string, unknown>) => store.call("finish_job", {
    jobId: job.job_id, token: job.lease_token, durationMs: Date.now() - started, ...data,
  });
  try {
    const result = await generate(job.payload, runtime, strategy);
    if (!result.ok) {
      const errors = "validationErrors" in result.error ? result.error.validationErrors : undefined;
      return finish({ success: false, stage: errors ? "validation" : "generation", code: errors ? "PUBLISH_REJECTED" : "GENERATION_FAILED", errors: errors ?? [result.error.code] });
    }
    // Do not trust a generator, including a deterministic fallback or a mock, to publish itself.
    const gate = validateProductPublication(String(job.product_type), result.draft, result.evidencePacket);
    if (!gate.ok) return finish({ success: false, stage: "validation", code: "PUBLISH_REJECTED", errors: gate.errors });
    const snapshot = createProductPreviewSnapshot({
      reportId: String(job.report_id), createdAtIso: String(job.created_at),
      productKey: job.product_type as ProductPreviewProductType,
      productSlug: (isRecord(job.payload) ? job.payload.productSlug : "") as ReportProductSlug,
      draft: result.draft as ProductPreviewSnapshotDraft, evidencePacket: result.evidencePacket,
    });
    if (!snapshot.ok) return finish({ success: false, stage: "snapshot", code: snapshot.error });
    return finish({ success: true, snapshot: { ...snapshot.value, access: { mode: "paid", isPaid: true, isUnlocked: true } }, gateVersion: PUBLISH_GATE_VERSION });
  } catch {
    return finish({ success: false, stage: "generation", code: "GENERATION_EXCEPTION" });
  }
}

export async function readPublishedReport(store: ReliabilityStore, reportId: string) {
  const result = await store.call("read_report", { reportId });
  if (!result.ok || result.status !== "COMPLETED") return { ...result, snapshot: null };
  const snapshot = result.snapshot;
  if (!isRecord(snapshot) || snapshot.reportId !== reportId || !validateProductPublication(String(snapshot.productType), snapshot.draft, snapshot.evidencePacket).ok) {
    await store.call("quarantine", { reportId });
    return { ok: true, status: "FAILED_REQUIRES_ATTENTION", snapshot: null };
  }
  return result;
}
