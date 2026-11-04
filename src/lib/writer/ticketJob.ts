/**
 * 이용권 발행 큐의 v5 작업(P3 C, P6d-ops 7). claim(작가 lease 15분) → 생성 감독(Sonnet 정식본) → 장 저장 → 발행 또는 보류.
 * 회수(recover): 작가 lease가 끝난 작업(워커 죽음)을 큐로 되돌린다. 저장된 장은 남아 다음 시도가 빠진 장만 쓴다.
 * 정산 기한 lease_until이 지나면 기존 reconcile이 최후 안전장치로 환불한다(보류 중인 QUEUED는 대상 아님).
 */
import type { TicketPublicationStore } from "../tickets/publication";
import type { TicketResult } from "../tickets/service";
import type { BookChapter } from "./format";
import type { V5BuildDeps } from "./publish";
import type { OpsStore } from "../ops/generation/sinks";
import { superviseQueueJob } from "../ops/generation/supervisor";
import { priorBooks } from "./prior";
import type { ChapterSink, SavedChapter } from "./runner";

/** priorReader: 이전 Book을 읽는 저장소(이용권 report_tickets의 library·read, P6b E-1). 없으면 발행 저장소로 시도한다.
 * ops: 생성 감독 저장소(P6d-ops, 시험 주입). 없으면 운영 저장소(Supabase). openAiKey·opsNow: 시험 주입. */
export type V5JobDeps = V5BuildDeps & { readonly priorReader?: TicketPublicationStore; readonly ops?: OpsStore; readonly openAiKey?: string | null; readonly opsNow?: () => number };
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

/**
 * 이용권 v5 작업(P6d-ops 7): 생성 감독이 정식본(Sonnet)만 발행한다. 아니면 큐로 보류(defer, 시간표), 24시간이면 이용권 환급(reverse).
 * 결정론으로 완성해 발행하지 않는다(회수 크론도 큐로 되돌리기만 한다).
 */
export async function runV5TicketJob(store: TicketPublicationStore, job: TicketResult, deps?: V5JobDeps): Promise<TicketResult> {
  if (typeof job.userId !== "string" || typeof job.redemptionId !== "string" || typeof job.token !== "string" || typeof job.reportId !== "string" || typeof job.policyAt !== "string") return { ok: false, code: "INVALID_CLAIM" };
  const user = job.userId, origin = { redemptionId: job.redemptionId, token: job.token }, reportId = job.reportId;
  const policyAt = new Date(job.policyAt).toISOString();
  const { priorReader, ops: injected, openAiKey, opsNow, ...build } = deps ?? {};
  const ops = injected ?? (await import("../ops/store")).createOpsStores().generation;
  // 같은 고객의 이전 Book(P6b E-1): 읽기 실패는 빈 값(발행은 막지 않는다).
  const prior = await priorBooks(priorReader ?? store, user, job.input);
  let published: TicketResult | null = null;
  const { decision, settled } = await superviseQueueJob({ reportId, origin: "ticket", originRef: job.redemptionId, payload: job.input as never, policyAt, sink: ticketChapterSink(store, user, origin), prior },
    { store: ops, deps: build, ...(openAiKey !== undefined ? { openAiKey } : {}), ...(opsNow ? { now: opsNow } : {}) }, async d => {
      try {
        if (d.kind === "publish") { published = await store.call("publish", user, { ...origin, snapshot: d.snapshot, gateVersion: GATE_VERSION }); return { ok: published.ok === true && published.state === "COMPLETED", code: published.code ? String(published.code) : undefined }; }
        const r = d.kind === "defer" ? await store.call("defer", user, { ...origin, until: d.until, code: "V5_DEFERRED" })
          : await store.call("reverse", user, { ...origin, reason: "GENERATION_GAVE_UP" });
        return { ok: r.ok === true, code: r.code ? String(r.code) : undefined };
      } catch { return { ok: false, code: "PERSISTENCE_INTERRUPTED" }; }
    });
  if (decision.kind === "publish" && settled.ok && published) return { ...(published as TicketResult), meta: decision.meta, edition: decision.edition };
  if (!settled.ok) return { ok: true, state: "RUNNING", code: settled.code ?? "STALE_LEASE", reportId };
  return decision.kind === "defer" ? { ok: true, state: "QUEUED", code: "DEFERRED", reportId, notBefore: decision.until } : { ok: true, state: "REVERSED", code: "GENERATION_GAVE_UP", reportId };
}

/** 회수 크론: 작가 lease가 끝난 v5 작업(워커가 죽음)을 큐로 되돌린다(P6d-ops: 결정론 완성 없음). 다음 claim이 저장된 장 다음부터 쓴다. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- 호출 쪽 인자 모양 유지(회수는 이제 큐로 되돌리기만 한다)
export async function runV5RecoveryBatch(store: TicketPublicationStore, _opts: { maxJobs?: number; deps?: V5JobDeps } = {}) {
  let job: TicketResult;
  try { job = await store.call("recover", null); } catch { return { ok: false, processed: 0, stop: "storage_error" }; }
  if (!job.ok) return { ok: false, processed: 0, stop: "storage_error" };
  return { ok: true, processed: Number(job.requeued ?? 0), stop: "empty" };
}
