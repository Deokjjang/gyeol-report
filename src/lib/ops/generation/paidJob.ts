/**
 * 결제 경로 v5 작업(P6d-ops 7). claim은 기존 결제 워커(runPaidReportJob)가 하고, 여기서는 감독 결과를 큐 동작으로 옮긴다.
 * 발행 = 기존 finish_job(검증·발행 규칙 그대로), 보류 = paid_defer(시간표), 포기 = paid_give_up + 자동 환불 요청(관리자 확인 없이, 결정 2026-11-04).
 */
import type { ReliabilityResult } from "../../payment/paidReportReliabilityStore";
import { PUBLISH_GATE_VERSION } from "../../report-generation/productPublishGate";
import type { ReportInputPayload } from "../../report-generation/reportInputTypes";
import { opsChapterSink, type OpsStore } from "./sinks";
import { superviseQueueJob, type GenerationEnv } from "./supervisor";

export const AUTO_REFUND_REASON = "24시간 안에 책을 완성하지 못해 자동 환불";
export type PaidJobOps = { generation: OpsStore; order: OpsStore; audit(e: { actor: "system"; action: string; target: string; detail?: Record<string, unknown> }): Promise<boolean> };

export async function runPaidV5Job(job: { payload: unknown; report_id: string; job_id: string; lease_token: string; order_id: string; policyAt: string; budgetMs?: number },
  finish: (data: Record<string, unknown>) => Promise<ReliabilityResult>, opts: { ops?: PaidJobOps; env?: Omit<GenerationEnv, "store"> } = {}): Promise<ReliabilityResult> {
  const ops = opts.ops ?? (await import("../store")).createOpsStores();
  let last: ReliabilityResult = { ok: false, code: "STALE_LEASE" };
  const { decision } = await superviseQueueJob({ reportId: job.report_id, origin: "paid", originRef: job.order_id, payload: job.payload as ReportInputPayload, policyAt: job.policyAt,
    sink: opsChapterSink(ops.generation, job.report_id, job.lease_token), ...(job.budgetMs ? { budgetMs: job.budgetMs } : {}) }, { ...opts.env, store: ops.generation }, async d => {
    if (d.kind === "publish") last = await finish({ success: true, snapshot: d.snapshot, gateVersion: PUBLISH_GATE_VERSION });
    else if (d.kind === "defer") last = await ops.generation.call("paid_defer", { jobId: job.job_id, token: job.lease_token, until: d.until, code: "V5_DEFERRED" }) as ReliabilityResult;
    else if (d.kind === "give_up") {
      last = await ops.generation.call("paid_give_up", { jobId: job.job_id, token: job.lease_token, code: "GENERATION_GAVE_UP" }) as ReliabilityResult;
      if (last.ok) {
        const refund = await ops.order.call("refund_request", { paymentOrderId: job.order_id, source: "auto", reason: AUTO_REFUND_REASON });
        await ops.audit({ actor: "system", action: "auto_refund_requested", target: job.order_id, detail: { reportId: job.report_id, ok: refund.ok === true, reason: d.reason.slice(0, 120) } });
      }
    }
    return { ok: last.ok === true, ...(last.code ? { code: String(last.code) } : {}) };
  });
  if (decision.kind === "stale") return { ok: false, code: "STALE_LEASE" };
  return last;
}
