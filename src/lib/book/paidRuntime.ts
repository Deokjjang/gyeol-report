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
  // P6d-ops 7: 생성 감독이 정식본(Sonnet)만 발행하고, 아니면 시간표대로 보류(paid_defer), 24시간이면 포기 + 자동 환불 요청.
  // 장은 결제 경로 장 저장(ops_writer_chapters)에 남아 다음 시도가 빠진 장만 쓴다. 결정론 완성(recover)은 쓰지 않는다.
  const v5: PaidV5Builder | undefined = v5Products.length ? async (job, finish) => {
    if (!v5Products.includes(job.product_type) || !isRecord(job.payload)) return null;
    const { runPaidV5Job } = await import("../ops/generation/paidJob");
    return { settled: await runPaidV5Job({ ...job, payload: job.payload, policyAt: new Date(evaluatedAt ?? job.created_at).toISOString(), budgetMs: PAID_V5_WRITER_BUDGET_MS }, finish) };
  } : undefined;
  return runPaidReportJob(boundStore, runtime, generate, (product, draft, evidence) =>
    evaluatedAt ? validateV4Publication(product, draft, evidence) : validateNewProductPublication(product, draft, evidence), v5);
}
