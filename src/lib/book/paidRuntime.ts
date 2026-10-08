import "server-only";
import { bookExperiencePublicEnabled } from "./publicGate";
import { runPaidReportJob, type ProductGenerator } from "../payment/paidReportReliability";
import type { ReliabilityStore } from "../payment/paidReportReliabilityStore";
import type { ReportWriterRuntime } from "../report-generation/reportWriterRuntime";
import { generateProductReport } from "../report-generation/generateProductReport";
import { isRecord, validateNewProductPublication } from "../report-generation/productPublishGate";
import { getAnnualPurchasePolicyDate } from "../payment/annualPurchasePolicy";

// Public worker wiring only. Existing claims, leases, payment validation,
// publication and recovery stay in runPaidReportJob. Old purchases stay V3.
export async function runPublicPaidReportJob(store: ReliabilityStore, runtime: ReportWriterRuntime) {
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
  return runPaidReportJob(boundStore, runtime, generate, (product, draft, evidence) =>
    evaluatedAt ? validateV4Publication(product, draft, evidence) : validateNewProductPublication(product, draft, evidence));
}
