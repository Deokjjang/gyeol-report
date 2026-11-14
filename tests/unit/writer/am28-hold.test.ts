/**
 * AM2-8 5부 시험(호출 0): 보류 다시 부름(묶음 하나 · 새 호출 1회) · 같은 입력 같은 보류 · 감독은 같은 빌드를 되풀이하지 않음 · 고객 즉시 안내 · 다시 쓰기 받기 기준(뜻 방향).
 */
import { describe, expect, it } from "vitest";
import { cardDir, dirFlip } from "@/lib/writer/chunked/accept";
import { HOLD_RETRY_NOTE } from "@/lib/writer/chunked/publish";
import { superviseQueueJob } from "@/lib/ops/generation/supervisor";
import { judgeBuild } from "@/lib/ops/generation/policy";
import { describeGeneration, HOLD_MESSAGE } from "@/components/report/generationProgress";
import { fakeClock, memoryOpsStore } from "../../helpers/opsMocks";
import { payloadFor } from "../../../tools/annual-major/am2-6-books";

const AT = "2026-12-02T03:00:00.000Z";
type Stream = (input: { user: string; onText?: (t: string) => void }) => Promise<{ text: string; finishReason: string; usage: { inputTokens: number; cachedInputTokens: number; outputTokens: number } }>;
async function buildWith(retry: (base: Stream) => Stream) {
  const { buildV5Snapshot } = await import("@/lib/writer/publish");
  const { devMockStream } = await import("@/lib/ops/generation/devMock");
  const { memorySink } = await import("@/lib/ops/generation/sinks");
  const p = payloadFor("annual-1") as never, base = devMockStream("ok" as never, p, AT) as unknown as Stream, calls: string[] = [];
  const stream: Stream = async input => { calls.push(input.user.includes(HOLD_RETRY_NOTE) ? "hold_retry" : "call"); return retry(base)(input); };
  const built = await buildV5Snapshot({ payload: p, reportId: "report_am28hold000001", policyAt: AT, sink: memorySink() as never, deps: { provider: "anthropic", model: "claude-sonnet-5-5", fallback: null, stream: stream as never, people: async () => [] } });
  return { built, calls, review: built.meta.review as Record<string, unknown> };
}

describe("AM2-8 5부 보류 다시 부름(모의 작가)", () => {
  it("남은 차단이 있으면 그 차단이 든 묶음 하나만 새 호출 1회 — 다시 부른 글도 보류면 앞 결과를 두고 보류(판정 incomplete)", async () => {
    const { built, calls, review } = await buildWith(base => base);
    const hr = review.holdRetry as { chunk: string; before: number; after: number | null; kept: boolean } | undefined;
    expect(hr).toBeDefined();
    expect(calls.filter(c => c === "hold_retry")).toHaveLength(1);
    expect(hr!.kept).toBe(false);
    expect(judgeBuild({ meta: built.meta, run: built.run }).kind).toBe("incomplete");
  }, 180_000);
  it("다시 부른 글이 그 묶음 몫을 다 담지 않으면 받지 않는다(앞 결과 그대로)", async () => {
    // 다시 부름에는 빈 글을 돌려준다 → 묶음 몫이 빠져 받지 않는다(앞 결과 그대로) — 받는 조건이 「몫이 다 옴 + 보류가 줄어듦」인지 본다.
    const { review } = await buildWith(base => async input => (input.user.includes(HOLD_RETRY_NOTE) ? { text: "", finishReason: "complete", usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 } } : base(input)));
    const hr = review.holdRetry as { kept: boolean; after: number | null };
    expect(hr.kept).toBe(false); expect(hr.after).toBeNull();
  }, 180_000);
  it("같은 입력이면 같은 보류(결정론) — 두 번 지어도 보류 사유가 같다", async () => {
    const a = await buildWith(base => base), b = await buildWith(base => base);
    expect(judgeBuild({ meta: a.built.meta, run: a.built.run })).toEqual(judgeBuild({ meta: b.built.meta, run: b.built.run }));
  }, 240_000);
});

describe("AM2-8 5부 감독(W3 P2): 같은 탈락을 되풀이하지 않는다 · 고객 즉시 안내", () => {
  // W3 P2: 검사 탈락 → 즉시 2차(같은 설정). 같은 저장 원문으로 다시 지으면 같은 탈락이라, 2차는 저장 원문 없이 새로 부른다(AM2-8의 「같은 빌드 되풀이 금지」를 이 꼴로).
  it("앞 시도가 정식본 검사 탈락(generation_hold)이면 2차는 저장 원문 없이 새로 짓는다 — 다른 실패 뒤 2차는 저장 원문을 쓴다", async () => {
    const seenCache = async (reason: string) => {
      const clock = fakeClock(), ops = memoryOpsStore(clock), payload = payloadFor("annual-1") as never;
      const job = { reportId: "report_am28repeat0001", origin: "paid" as const, originRef: "po", payload, policyAt: AT, sink: { save: async () => true, load: async () => [] } as never, budgetMs: 480_000,
        raw: { get: () => null, put: () => undefined } };
      await ops.store.call("begin", { reportId: job.reportId, origin: "paid", originRef: "po" });
      await ops.store.call("record", { reportId: job.reportId, run: { lane: "queue", outcome: "deferred", reason, costUsd: 0.3 }, state: { failuresInc: 1, firstFailureAt: new Date(clock.now()).toISOString() } });
      const caches: unknown[] = [];
      await superviseQueueJob(job, { store: ops.store, now: clock.now, openAiKey: null, build: (async (a: { deps: { cache?: unknown } }) => { caches.push(a.deps.cache); throw new Error("시험"); }) as never }, async () => ({ ok: true }));
      return caches;
    };
    expect(await seenCache("official:partial:generation_hold:7:check")).toEqual([undefined]);
    const other = await seenCache("official:partial:missing:3:connection");
    expect(other).toHaveLength(1); expect(other[0]).toBeDefined();
  });
  it("보류 사유면 고객 화면은 「다듬는 중 · 최대 24시간 · 안 되면 자동 환불」을 바로 보인다(사유 글은 내보내지 않는다)", () => {
    const g = describeGeneration("RETRYING", { phase: "pending", failures: 1, next_at: "2026-12-02T04:00:00.000Z", last_reason: "official:partial:generation_hold:7" });
    expect(g.state).toBe("delayed"); expect(g.hold).toBe(true);
    expect(HOLD_MESSAGE).toMatch(/다듬/); expect(HOLD_MESSAGE).toMatch(/24시간/); expect(HOLD_MESSAGE).toMatch(/환불/);
    expect(JSON.stringify(g)).not.toMatch(/generation_hold/);
    expect(describeGeneration("RETRYING", { phase: "pending", failures: 1, next_at: null, last_reason: "official:partial:missing:3" }).hold).toBeUndefined();
  });
});

describe("AM2-8 5부 다시 쓰기 받기 기준 — 뜻 방향", () => {
  it("살필 카드 줄을 권함으로 뒤집은 다시 쓰기는 버린다(P7 annual-p6b 2월 ¶2)", () => {
    const before = "돈도 오르는 달이지만 아끼는 데 집중하다 꼭 필요한 지출까지 미루기 쉬운 쪽입니다. 좋아하는 마음을 확인될 때까지 아낄 때처럼, 쓸 곳에 쓰지 않으면 마음이 먼저 닫혀 버립니다.";
    const after = "돈도 오르는 달이에요. 쓸 곳에 쓰지 않는 모습이 어울리는 달이라 살림이 든든해집니다.";
    expect(cardDir("돈을 살필 달 — 아끼다 필요한 지출까지 미루기 쉬운 쪽")).toBe("caution");
    expect(dirFlip(before, after, "caution")).toMatch(/뒤집/);
    expect(dirFlip(before, "꼭 필요한 지출까지 미루기 쉬운 달이라, 쓸 곳은 먼저 정해 두는 편이 마음이 덜 닫혀요.", "caution")).toBeNull();
  });
});
