/**
 * 이용권 발행 큐의 v5 작업(P3 C). claim(작가 lease 15분) → 작가 → 장 저장 → 발행.
 * 회수(recover): 작가 lease가 끝난 작업을 토큰을 바꿔 이어받아, 저장된 장 + 결정론 작가로 완성해 발행한다(LLM 호출 0).
 * 실패해도 환불하지 않는다(정산 기한 lease_until이 지나면 기존 reconcile이 최후 안전장치로 환불).
 */
import type { TicketPublicationStore } from "../tickets/publication";
import type { TicketResult } from "../tickets/service";
import type { BookChapter } from "./format";
import { buildV5Snapshot, type V5BuildDeps } from "./publish";
import type { ChapterSink, SavedChapter } from "./runner";

export type V5JobDeps = V5BuildDeps;
const GATE_VERSION = "paid-report-v1";

export function ticketChapterSink(store: TicketPublicationStore, user: string, origin: { redemptionId: string; token: string }): ChapterSink {
  return {
    async save(c: SavedChapter) {
      const r = await store.call("save-chapter", user, { ...origin, n: c.n, source: c.source, chapter: c.chapter });
      return r.ok === true;
    },
    async load() {
      const r = await store.call("chapters", user, origin);
      if (!r.ok || !Array.isArray(r.chapters)) return [];
      return (r.chapters as { n: number; source: SavedChapter["source"]; chapter: BookChapter }[]).map(x => ({ n: x.n, source: x.source, chapter: x.chapter }));
    },
  };
}

export async function runV5TicketJob(store: TicketPublicationStore, job: TicketResult, deps?: V5JobDeps): Promise<TicketResult> {
  if (typeof job.userId !== "string" || typeof job.redemptionId !== "string" || typeof job.token !== "string" || typeof job.reportId !== "string" || typeof job.policyAt !== "string") return { ok: false, code: "INVALID_CLAIM" };
  const user = job.userId, origin = { redemptionId: job.redemptionId, token: job.token };
  const policyAt = new Date(job.policyAt).toISOString();
  const sink = ticketChapterSink(store, user, origin);
  const recover = job.recover === true;
  let built;
  try { built = await buildV5Snapshot({ payload: job.input as never, reportId: job.reportId, policyAt, sink, recover, ...(deps ? { deps } : {}) }); }
  catch {
    // 작가 단계 밖의 예외(브리프 등): 저장된 장 + 결정론 작가로 한 번 더.
    try { built = await buildV5Snapshot({ payload: job.input as never, reportId: job.reportId, policyAt, sink, recover: true, ...(deps ? { deps: { ...deps, stream: undefined } } : {}) }); }
    catch { return { ok: true, state: "RUNNING", code: "V5_BUILD_FAILED", reportId: job.reportId }; }
  }
  if (built.run?.stale) return { ok: true, state: "RUNNING", code: "STALE_LEASE", reportId: job.reportId };
  try {
    const result = await store.call("publish", user, { ...origin, snapshot: built.snapshot, gateVersion: GATE_VERSION });
    // STALE_LEASE: 회수 쪽이 이미 이어받았다. 다른 실패도 환불하지 않고 회수 크론에 맡긴다.
    return result.ok ? { ...result, meta: built.meta } : { ok: true, state: "RUNNING", code: String(result.code ?? "PUBLISH_FAILED"), reportId: job.reportId };
  } catch { return { ok: true, state: "RUNNING", code: "PERSISTENCE_INTERRUPTED", reportId: job.reportId }; }
}

/** 회수 크론: 작가 lease가 끝난 v5 작업을 하나씩 결정론으로 완성한다. */
export async function runV5RecoveryBatch(store: TicketPublicationStore, opts: { maxJobs?: number; deps?: V5JobDeps } = {}) {
  let processed = 0;
  while (processed < (opts.maxJobs ?? 4)) {
    let job: TicketResult;
    try { job = await store.call("recover", null); } catch { return { ok: false, processed, stop: "storage_error" }; }
    if (!job.ok) return { ok: false, processed, stop: "storage_error" };
    if (job.empty) return { ok: true, processed, stop: "empty" };
    await runV5TicketJob(store, job, opts.deps);
    processed++;
  }
  return { ok: true, processed, stop: "job_limit" };
}
