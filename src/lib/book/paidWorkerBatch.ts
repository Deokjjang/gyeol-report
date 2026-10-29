import "server-only";
import type { ReliabilityStore } from "../payment/paidReportReliabilityStore";
import type { NoWriterRuntime } from "../report-generation/writerDisabled";
import { runPublicPaidReportJob } from "./paidRuntime";

export const PAID_WORKER_LIMITS = {
  maxJobs: 8,
  // Admission window, NOT an unsafe timeout racing an in-flight publication.
  // Leaves 255s of the 300s route for the last job.
  claimWindowMs: 45_000,
  maxRssBytes: 1.25 * 1024 ** 3,
} as const;

type BatchStop = "empty" | "job_limit" | "time_budget" | "memory_budget" | "storage_error";
type BatchResult = {
  ok: boolean; processed: number; completed: number; retrying: number; attention: number; stop: BatchStop;
};
type BatchDependencies = {
  startedAt?: number;
  now?: () => number;
  rss?: () => number;
  runJob?: typeof runPublicPaidReportJob;
};

// Only scheduling changes here. Claims, leases, version selection, validation,
// and publication remain owned by the existing single worker.
// No snapshots/identities are retained across iterations or written to logs.
export async function runPaidReportBatch(
  store: ReliabilityStore,
  runtime: NoWriterRuntime,
  dependencies: BatchDependencies = {},
): Promise<BatchResult> {
  const now = dependencies.now ?? (() => performance.now());
  const rss = dependencies.rss ?? (() => process.memoryUsage.rss());
  const runJob = dependencies.runJob ?? runPublicPaidReportJob;
  const startedAt = dependencies.startedAt ?? now();
  // 로컬 개발 서버(next dev)는 RSS가 수 GB라 상한에 바로 걸린다. 개발 모드에서만 env로 올릴 수 있다(운영은 그대로, 이용권 워커와 같은 규칙).
  const devRss = process.env.NODE_ENV === "development" ? Number(process.env.PAID_WORKER_MAX_RSS_MB) * 1024 ** 2 : NaN;
  const maxRss = devRss > 0 ? devRss : PAID_WORKER_LIMITS.maxRssBytes;
  const result: BatchResult = { ok: true, processed: 0, completed: 0, retrying: 0, attention: 0, stop: "job_limit" };
  while (result.processed < PAID_WORKER_LIMITS.maxJobs) {
    if (now() - startedAt >= PAID_WORKER_LIMITS.claimWindowMs) return { ...result, ok: result.processed > 0, stop: "time_budget" };
    if (rss() >= maxRss) return { ...result, ok: result.processed > 0, stop: "memory_budget" };
    try {
      const job = await runJob(store, runtime);
      // A DB/HTTP failure may be a lost acknowledgement after a commit. Never
      // resubmit or release its lease here; the durable state decides recovery.
      if (!job.ok) return { ...result, ok: false, stop: "storage_error" };
      if (job.status === "COMPLETED") result.completed++;
      else if (job.status === "RETRYING") result.retrying++;
      else if (job.status === "FAILED_REQUIRES_ATTENTION") result.attention++;
      else return { ...result, stop: "empty" };
      result.processed++;
    } catch {
      return { ...result, ok: false, stop: "storage_error" };
    }
  }
  return result;
}
