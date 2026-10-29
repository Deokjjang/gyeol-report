import "server-only";
import { bookExperiencePublicEnabled } from "./publicGate";
import { runPaidReportJob, type PaidV5Builder, type ProductGenerator } from "../payment/paidReportReliability";
import type { ReliabilityStore } from "../payment/paidReportReliabilityStore";
import type { NoWriterRuntime } from "../report-generation/writerDisabled";
import { generateProductReport } from "../report-generation/generateProductReport";
import { isRecord, validateNewProductPublication } from "../report-generation/productPublishGate";
import { getAnnualPurchasePolicyDate } from "../payment/annualPurchasePolicy";
import { writerV5Products } from "../writer/flags";

/** v5 작가 시간 예산(결제 경로): claim lease 10분(SQL) 안에서 조립·finish까지 끝나게 8분. 이용권 경로(작가 lease 15분)는 700초. */
export const PAID_V5_WRITER_BUDGET_MS = 480_000;
/** 결제 경로는 장 저장 테이블이 없다: 끊기면 lease 만료 뒤 다음 시도가 처음부터, 3번째 시도는 LLM 없이 결정론으로 완성한다. */
const NO_CHAPTER_SINK = { save: async () => true, load: async () => [] };

// Public worker wiring only. Existing claims, leases, payment validation,
// publication and recovery stay in runPaidReportJob. Old purchases stay V3.
export async function runPublicPaidReportJob(store: ReliabilityStore, runtime: NoWriterRuntime) {
  if (!bookExperiencePublicEnabled()) return runPaidReportJob(store, runtime);
  let evaluatedAt: string | null = null;
  const boundStore: ReliabilityStore = { async call(action, data) {
    const result = await store.call(action, data);
    if (action !== "claim_job" || !result.ok || !isRecord(result.job)) return result;
    const job = result.job, found = await store.call("find_order", { paymentOrderId: job.order_id });
    const order = isRecord(found.order) ? found.order : null;
    if (!found.ok || !order || order.status !== "paid" || order.payment_order_id !== job.order_id || order.report_id !== job.report_id || order.product_type !== job.product_type) return { ok: false, code: "PURCHASE_CONTEXT_UNAVAILABLE" };
    const input = isRecord(order.input_snapshot) ? order.input_snapshot : null;
    const binding = input?.bookGeneration;
    if (binding !== undefined) {
      if (!isRecord(binding) || binding.version !== "v4" || typeof binding.evaluatedAt !== "string" || !Number.isFinite(Date.parse(binding.evaluatedAt))) return { ok: false, code: "PURCHASE_CONTEXT_INVALID" };
      evaluatedAt = binding.evaluatedAt;
    }
    return result;
  } };
  const { generateV4ShadowReport } = await import("../interpretation-v4/runtimeShadow");
  const { validateV4Publication } = await import("../interpretation-v4/runtimeProjection");
  const generate: ProductGenerator = (payload, writer, strategy, acceptance) => {
    if (!evaluatedAt) return generateProductReport(payload, writer, strategy, acceptance);
    const policy = acceptance && getAnnualPurchasePolicyDate(acceptance, payload);
    return generateV4ShadowReport(payload, { evaluatedAt, policyDate: policy ? policy.toISOString() : evaluatedAt });
  };
  // v5 작가(P3.5 B): 플래그가 켠 상품만. 비어 있으면 v5 훅 없음 = 기존과 같다.
  const v5Products = writerV5Products();
  const v5: PaidV5Builder | undefined = v5Products.length ? async job => {
    if (!v5Products.includes(job.product_type) || !isRecord(job.payload)) return null;
    const { buildV5Snapshot } = await import("../writer/publish");
    const policyAt = new Date(evaluatedAt ?? job.created_at).toISOString();
    const built = await buildV5Snapshot({ payload: job.payload as never, reportId: job.report_id, policyAt, sink: NO_CHAPTER_SINK, recover: job.attempt >= 3, deps: { budgetMs: PAID_V5_WRITER_BUDGET_MS } });
    return { snapshot: built.snapshot as unknown as Record<string, unknown> };
  } : undefined;
  return runPaidReportJob(boundStore, runtime, generate, (product, draft, evidence) =>
    evaluatedAt ? validateV4Publication(product, draft, evidence) : validateNewProductPublication(product, draft, evidence), v5);
}
