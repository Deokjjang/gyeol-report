import { getAnnualPurchasePolicyDate, type AnnualCommerceAcceptance } from "./annualPurchasePolicy";
import { generateProductReport, type GenerationStrategy } from "../report-generation/generateProductReport";
import { isRecord, PUBLISH_GATE_VERSION, validateProductPublication, validateNewProductPublication } from "../report-generation/productPublishGate";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft, type ProductPreviewProductType, type ReportProductSlug } from "../report-generation/productPreviewSnapshot";
import type { ProductGenerationResult } from "../report-generation/productGenerationDispatcher";
import type { NoWriterRuntime } from "../report-generation/writerDisabled";
import { deliveryIssueCodes } from "../report-generation/deliveryAudit";
import { unknownCalculationVersions } from "../saju/calendarVersion";
import type { ReliabilityResult, ReliabilityStore } from "./paidReportReliabilityStore";
import type { TossConfirmClientResult, TossConfirmRequest } from "./tossConfirmTypes";
import { productOnSale, SALES_CLOSED_CODE, SALES_PAUSED_CODE } from "../ops/config";

/**
 * v5 최종3: 판매를 닫은 상품(대운·세운, FORTUNE_SALES_OPEN)의 승인 전 주문인가. 결제 준비·주문 생성은 이미 막혀 있고(prepare·create-ready),
 * 이것은 닫기 전에 만든 주문(배포 직전 결제창을 연 주문 등)이 승인 단계로 오는 경우만 막는다. 이미 승인된 주문(status≠ready)은 막지 않는다
 * (돈이 움직인 주문은 기존대로 이어서 처리). 주문을 못 읽으면 막지 않는다(기존 승인 흐름 그대로).
 * W3 P0: 4종 판매 중지(DB 스위치)도 같은 자리에서 막는다 — 결제창을 연 뒤 멈춘 주문은 승인하지 않는다(결제되지 않음). 스위치를 못 읽으면 막지 않는다.
 * 돌려주는 값: 막는 이유 코드(SALES_CLOSED_CODE · SALES_PAUSED_CODE) 또는 null.
 */
export async function closedProductOrder(store: ReliabilityStore, orderId: string, paused: () => Promise<boolean> = defaultPaused): Promise<string | null> {
  try {
    const found = await store.call("find_order", { orderId });
    const order = found.ok && isRecord(found.order) ? found.order : null;
    if (!order || order.provider_order_id !== orderId || order.status !== "ready") return null;
    if (!productOnSale(order.product_type)) return SALES_CLOSED_CODE;
    return (await paused()) ? SALES_PAUSED_CODE : null;
  } catch { return null; }
}
async function defaultPaused(): Promise<boolean> { return (await import("../ops/salesPause")).salesPaused(); }

// A crash after provider approval leaves the claimed payment key durable. The worker
// reconciles it with the same provider idempotency key before claiming generation.
// salesGate(선택): 승인 전에 판매 중지 상품 주문을 거른다(HTTP 승인 진입점만 넘긴다). 걸리면 토스 승인·주문 선점 없이 끝낸다.
// 값: 막는 이유 코드(문자열) · true(= 판매 닫힘) · false/null(통과).
export async function confirmPaidReport(input: TossConfirmRequest, store: ReliabilityStore,
  confirm: (input: TossConfirmRequest) => Promise<TossConfirmClientResult>, salesGate?: (orderId: string) => Promise<string | boolean | null>) {
  const gated = salesGate ? await salesGate(input.orderId) : null;
  if (gated) return { ok: false, code: typeof gated === "string" ? gated : SALES_CLOSED_CODE };
  const claim = await store.call("confirm_claim", { ...input });
  if (!claim.ok || claim.reportId || claim.pending) return claim;
  let paidAt: string | undefined, receiptUrl: string | undefined;
  if (!claim.alreadyPaid) {
    try {
      const result = await confirm(input);
      if (!result.ok || result.confirm.status !== "DONE" || result.confirm.orderId !== input.orderId || result.confirm.amount !== input.amount) {
        return { ok: false, code: "PAYMENT_CONFIRM_PENDING" };
      }
      paidAt = result.confirm.approvedAt;
      receiptUrl = result.confirm.receiptUrl;
    } catch {
      return { ok: false, code: "PAYMENT_CONFIRM_PENDING" };
    }
  }
  const finished = await store.call("confirm_finish", { ...input, token: claim.token, paidAt });
  // P6d-ops 4: 영수증 주소는 결제 기록 밖(주문 기록)에 남긴다. confirm_finish 결과는 그대로.
  return receiptUrl && finished.ok ? { ...finished, receiptUrl } : finished;
}

export type ProductGenerator = (payload: unknown, runtime: NoWriterRuntime, strategy: GenerationStrategy, annualAcceptance?: AnnualCommerceAcceptance) => Promise<ProductGenerationResult>;
// Shared fulfillment body. The caller verifies the origin (paid order or ticket)
// before entry; neither a client nor an entitlement chooses a weaker validator.
export async function generateReportSnapshot(job: { payload: unknown; product_type: string; report_id: string; created_at: string }, runtime: NoWriterRuntime,
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
/**
 * v5 작가 훅(P3.5 B). 결제 워커 배선(paidRuntime)이 WRITER_V5_PRODUCTS 상품에만 넘긴다. null이면 기존 생성 경로.
 * claim·lease·finish_job(결제·환불 상태 전이)는 그대로이고, 생성물만 v5 스냅샷이다. 예외는 기존과 같이 GENERATION_EXCEPTION 재시도.
 */
export type PaidV5Builder = (job: { payload: unknown; product_type: string; report_id: string; created_at: string; attempt: number; job_id: string; lease_token: string; order_id: string },
  finish: (data: Record<string, unknown>) => Promise<ReliabilityResult>) => Promise<{ snapshot: Record<string, unknown> } | { settled: ReliabilityResult } | null>;
// Internal dependency only; HTTP handlers never accept or forward a validator.
export async function runPaidReportJob(store: ReliabilityStore, runtime: NoWriterRuntime, generate: ProductGenerator = generateProductReport, validatePublication = validateNewProductPublication, v5?: PaidV5Builder) {
  const claimed = await store.call("claim_job", { model: "deterministic" });
  if (!claimed.ok || !isRecord(claimed.job)) return claimed;
  const job = claimed.job;
  const attempt = Number(job.attempt_count);
  // Strategy only labels the attempt audit (no writer exists any more).
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
    // P6d-ops: v5 훅이 발행·보류·포기를 직접 끝냈으면(settled) 그 결과를 그대로 돌려준다.
    const built = v5 ? await v5({ payload: job.payload, product_type: String(job.product_type), report_id: String(job.report_id), created_at: String(job.created_at), attempt,
      job_id: String(job.job_id), lease_token: String(job.lease_token), order_id: String(job.order_id) }, data => finish(data)) : null;
    if (built && "settled" in built) return built.settled;
    if (built) return finish({ success: true, snapshot: built.snapshot, gateVersion: PUBLISH_GATE_VERSION });
    const outcome = await generateReportSnapshot({ payload: job.payload, product_type: String(job.product_type), report_id: String(job.report_id), created_at: String(job.created_at) }, runtime, strategy, generate, validatePublication, annualAcceptance);
    const { result, ...publication } = outcome;
    externalCalls = result.externalCalls ?? [];
    delivery = result.delivery;
    return finish(publication);
  } catch {
    return finish({ success: false, stage: "generation", code: "GENERATION_EXCEPTION" });
  }
}

/**
 * 열람(읽기 전용). v5 최종3: 열람은 고객 Book을 바꾸지 않는다 — 검사가 실패해도 격리(quarantine)를 부르지 않고 로그만 남긴다.
 * 예전에는 실패하면 quarantine을 불러 status가 바뀌고(기본 SQL은 snapshot_json까지 지움) 고객이 다시 열 수 없었다.
 * 검사기는 호출하는 쪽이 저장된 판 계열로 고른다(validateBookPublication: v5→v5 계약, v4→v4 계약, 그 밖→기존 열람 검사).
 * 새 발행 검사(정답지·렌더·시점·라벨·의미 검수)는 발행 경로에만 있고 여기서 부르지 않는다(tests/unit/book/readPathProtection.test.tsx).
 * 검사에 걸린 이번 열람은 내용을 그리지 않고 안내만 한다(저장본은 그대로라 코드를 고치면 다음 열람에 다시 열린다).
 */
export async function readPublishedReport(store: ReliabilityStore, reportId: string, validatePublication = validateProductPublication) {
  const result = await store.call("read_report", { reportId });
  if (!result.ok || result.status !== "COMPLETED") return { ...result, snapshot: null };
  const snapshot = result.snapshot;
  // readRejected(W3 P2): 발행은 끝났는데 이번 열람이 검사에 걸림 — 화면은 「확인이 필요해요」 안내만(생성 대기·자동 환불 흐름이 아니다).
  if (!isRecord(snapshot) || snapshot.reportId !== reportId) {
    console.error(JSON.stringify({ event: "REPORT_READ_SNAPSHOT_MISMATCH", reportId }));
    return { ok: true, status: "FAILED_REQUIRES_ATTENTION", snapshot: null, readRejected: true };
  }
  let errors: string[] = [];
  try {
    const gate = validatePublication(String(snapshot.productType), snapshot.draft, snapshot.evidencePacket);
    if (!gate.ok) errors = gate.errors.length ? gate.errors : ["READ_GATE_REJECTED"];
  } catch { errors = ["READ_VALIDATOR_EXCEPTION"]; }
  if (!errors.length) return result;
  // A calculation version this code does not know comes from a newer engine (e.g. after a rollback).
  const unknownVersions = unknownCalculationVersions(snapshot);
  if (unknownVersions.length) {
    console.error(JSON.stringify({ event: "REPORT_READ_UNKNOWN_CALCULATION_VERSION", reportId, versions: unknownVersions }));
    return { ok: true, status: "FAILED_REQUIRES_ATTENTION", code: "UNKNOWN_CALCULATION_VERSION", snapshot: null, readRejected: true };
  }
  console.error(JSON.stringify({ event: "REPORT_READ_VALIDATION_FAILED", reportId, productType: String(snapshot.productType), productVersion: String(snapshot.productVersion), errors: errors.slice(0, 20) }));
  return { ok: true, status: "FAILED_REQUIRES_ATTENTION", snapshot: null, readRejected: true };
}
