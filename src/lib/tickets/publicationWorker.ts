import "server-only";
import { generateReportSnapshot, type ProductGenerator } from "../payment/paidReportReliability";
import { generateV4ShadowReport } from "../interpretation-v4/runtimeShadow";
import { validateV4Publication } from "../interpretation-v4/runtimeProjection";
import { createAnnualCommerceAcceptance } from "../payment/annualPurchasePolicy";
import { isRecord } from "../report-generation/productPublishGate";
import type { TicketPublicationStore } from "./publication";
import type { TicketResult } from "./service";
import { writerV5Products } from "../writer/flags";
import { runV5TicketJob, type V5JobDeps } from "../writer/ticketJob";

// Separate from the paid worker: two sequential jobs, never Promise.all generation.
// With the existing paid batch: at most 8 paid + 2 ticket claims per paired run.
// No cron schedule is activated here. Lease=10m exceeds the 300s route deadline.
export const TICKET_WORKER_LIMITS = { maxJobs: 2, claimWindowMs: 30_000, maxRssBytes: 1.25 * 1024 ** 3 } as const;
export async function runTicketPublicationJob(store: TicketPublicationStore, generate?: ProductGenerator, v5?: V5JobDeps): Promise<TicketResult> {
  // 플래그가 비어 있으면 claim 인자는 기존과 같다(v4 경로 그대로).
  const v5Products = writerV5Products();
  const job = v5Products.length ? await store.call("claim", null, { v5Products }) : await store.call("claim", null);
  if (!job.ok || job.empty) return job;
  if (job.writerVersion === "v5") return runV5TicketJob(store, job, v5);
  if (typeof job.userId !== "string" || typeof job.redemptionId !== "string" || typeof job.token !== "string") return { ok: false, code: "INVALID_CLAIM" };
  const user = job.userId, origin = { redemptionId: job.redemptionId, token: job.token };
  const reverse = async (reason: string) => {
    try { return await store.call("reverse", user, { ...origin, reason }); }
    catch { return { ok: false, code: "STORAGE_UNAVAILABLE" }; } // Leave the durable lease for reconciliation.
  };
  let publication;
  try {
    if (!isRecord(job.input) || typeof job.policyAt !== "string" || !Number.isFinite(Date.parse(job.policyAt)) || job.productType !== job.input.productKey || typeof job.reportId !== "string") return reverse("INVALID_CLAIM");
    // Postgres JSON timestamps follow the connection timezone. Canonical ISO
    // prevents identical instants from changing the frozen packet's digest.
    const policyAt = new Date(job.policyAt).toISOString();
    const generator = generate ?? (async (input: unknown) => generateV4ShadowReport(input, { evaluatedAt: policyAt, policyDate: policyAt }));
    const selectedYear = isRecord(job.input.productOptions) ? Number(job.input.productOptions.selectedYear) : NaN;
    publication = await generateReportSnapshot({ payload: job.input, product_type: String(job.productType), report_id: job.reportId, created_at: policyAt },
      { enabled: false, reason: "flag_disabled" }, "deterministic_fallback", generator, validateV4Publication,
      job.productType === "annual_fortune" ? createAnnualCommerceAcceptance(selectedYear, new Date(policyAt)) : undefined);
  } catch { return reverse("GENERATION_EXCEPTION"); }
  if (!publication.success) return reverse(publication.stage === "validation" ? "PUBLISH_REJECTED" : "GENERATION_FAILED");
  try {
    const result = await store.call("publish", user, { ...origin, snapshot: publication.snapshot, gateVersion: publication.gateVersion });
    return result.ok ? result : reverse("PERSISTENCE_REJECTED");
  } catch {
    // The reverse transaction observes committed publication under the SAME
    // account lock. A lost publish acknowledgement can never refund COMPLETED.
    return reverse("PERSISTENCE_INTERRUPTED");
  }
}

export async function runTicketPublicationBatch(store: TicketPublicationStore, dependencies: { now?: () => number; rss?: () => number; runJob?: typeof runTicketPublicationJob } = {}) {
  const now = dependencies.now ?? (() => performance.now()), rss = dependencies.rss ?? (() => process.memoryUsage.rss());
  const started = now(); let processed = 0;
  // 로컬 개발 서버(next dev)는 RSS가 수 GB라 상한에 바로 걸린다. 개발 모드에서만 env로 올릴 수 있다(운영은 그대로).
  const devRss = process.env.NODE_ENV === "development" ? Number(process.env.TICKET_WORKER_MAX_RSS_MB) * 1024 ** 2 : NaN;
  const maxRss = devRss > 0 ? devRss : TICKET_WORKER_LIMITS.maxRssBytes;
  while (processed < TICKET_WORKER_LIMITS.maxJobs) {
    if (now() - started >= TICKET_WORKER_LIMITS.claimWindowMs || rss() >= maxRss) return { ok: true, processed, stop: "budget" };
    try {
      const result = await (dependencies.runJob ?? runTicketPublicationJob)(store);
      if (!result.ok) return { ok: false, processed, stop: "storage_error" };
      if (result.empty) return { ok: true, processed, stop: "empty" };
      processed++;
    } catch { return { ok: false, processed, stop: "storage_error" }; }
  }
  return { ok: true, processed, stop: "job_limit" };
}
