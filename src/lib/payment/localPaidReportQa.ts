import { randomUUID } from "node:crypto";
import { runPaidReportJob } from "./paidReportReliability";
import type { ReliabilityStore } from "./paidReportReliabilityStore";
import { createAnnualCommerceAcceptance } from "./annualPurchasePolicy";
import { createPreviewReportPersistenceAdapter } from "../persistence/reportPersistenceRuntime";
import { buildReportPersistencePayload } from "../report/reportPersistencePayload";
import { isRecord } from "../report-generation/productPublishGate";
import type { ProductPreviewSnapshot } from "../report-generation/productPreviewSnapshot";
import type { ReportWriterRuntime } from "../report-generation/reportWriterRuntime";

// No Toss/client/RPC factory. Only claim and persistence differ from the worker.
export async function runLocalPaidReportQa(payload: unknown, runtime: ReportWriterRuntime, env = process.env) {
  if (!(["development", "test"].includes(env.NODE_ENV ?? "")) || env.REPORT_PERSISTENCE_MODE !== "preview_memory" || env.PAID_REPORT_RELIABILITY_ENABLED === "1") return { ok: false, code: "UNAVAILABLE" };
  if (!isRecord(payload)) return { ok: false, code: "INVALID_REPORT_INPUT" };
  const person = isRecord(payload.person) ? payload.person : isRecord(payload.personA) ? payload.personA : null;
  if (!person || typeof person.birthDate !== "string") return { ok: false, code: "INVALID_REPORT_INPUT" };
  const now = new Date();
  const shell = { version: "v1" as const, titleKo: "상품 리포트", subtitleKo: "상품 리포트", sections: [], notices: [] };
  const seed = buildReportPersistencePayload({ birthDate: person.birthDate, birthTime: typeof person.birthTime === "string" ? person.birthTime : null,
    birthTimeUnknown: person.birthTimeUnknown === true, calendarType: "SOLAR", timezone: "Asia/Seoul", report: shell, nowIso: now.toISOString() });
  if (!seed.ok) return { ok: false, code: "INVALID_REPORT_INPUT" };
  const reportId = seed.input.record.reportId;
  const jobId = randomUUID(), token = randomUUID(), orderId = `local-${randomUUID()}`;
  let claimed = false;
  let diagnostic: Record<string, unknown> = {};
  const store: ReliabilityStore = { async call(action, data = {}) {
    if (action === "claim_job") {
      if (claimed) return { ok: true, job: null };
      claimed = true;
      return { ok: true, job: { job_id: jobId, report_id: reportId, order_id: orderId, lease_token: token, attempt_count: 1,
        run_number: 1, product_type: payload.productKey, payload, created_at: now.toISOString() } };
    }
    if (action === "find_order") return { ok: true, order: { payment_order_id: orderId, report_id: reportId, product_type: payload.productKey, status: "paid",
      input_snapshot: { reportInputPayload: payload, annualCommerceAcceptance: createAnnualCommerceAcceptance(Number(isRecord(payload.productOptions) ? payload.productOptions.selectedYear : NaN), now) } } };
    if (action !== "finish_job" || data.jobId !== jobId || data.token !== token) return { ok: false, code: "STALE_LEASE" };
    diagnostic = { delivery: data.delivery, externalCalls: data.externalCalls, durationMs: data.durationMs };
    if (data.success !== true || !isRecord(data.snapshot)) return { ok: false, code: typeof data.code === "string" ? data.code : "GENERATION_FAILED" };
    const snapshot = data.snapshot as ProductPreviewSnapshot;
    const publishedAt = new Date().toISOString();
    const record = seed.input.record;
    const saved = await createPreviewReportPersistenceAdapter().create({ record: { ...record, reportId, createdAt: publishedAt, updatedAt: publishedAt,
      reportVersion: snapshot.productVersion,
      reportSnapshot: { snapshotKind: "product_preview", productPreview: { ...snapshot, createdAtIso: publishedAt }, report: shell,
        reportVersion: snapshot.productVersion, renderVersion: snapshot.productVersion, createdAt: publishedAt } } });
    return saved.ok ? { ok: true, status: "COMPLETED" } : { ok: false, code: "LOCAL_PERSISTENCE_FAILED" };
  } };
  const result = await runPaidReportJob(store, runtime);
  return result.ok && result.status === "COMPLETED"
    ? { ok: true, reportId, url: `/reports/${reportId}`, diagnostic }
    : { ok: false, code: result.code ?? "GENERATION_FAILED", diagnostic };
}
