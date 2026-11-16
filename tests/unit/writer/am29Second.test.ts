/**
 * AM2-9 2부 시험(호출 0, 모의 작가): 세운·대운 장 묶음 작가의 1차 · 2차(운영 30분 흐름).
 * - 1차 = 묶음 전체 생성 + 차단 다시 쓰기 1회(시도 안 다시 부름 없음). 남은 차단은 four_block.
 * - 2차(secondPass) = 1차 원고(저장된 장 · 원문)에서 이어, 빠진 묶음만 다시 부름 표지로 부르고, 차단이 남은 묶음만 새 호출 1회(걸린 문장 인용 + 이유). 1차 묶음은 다시 쓰지 않는다.
 * - 고객 화면: 2차 문구(30분 안), 사유 글 없음 · 다시 쓰기 받기 기준(뜻 방향).
 */
import { describe, expect, it } from "vitest";
import { cardDir, dirFlip } from "@/lib/writer/chunked/accept";
import { SECOND_PASS_NOTE } from "@/lib/writer/chunked/publish";
import { CHUNK_RETRY_NOTE } from "@/lib/writer/chunked/run";
import { judgeBuild } from "@/lib/ops/generation/policy";
import { describeProgress, elapsedMs, waitingCopy } from "@/components/report/generationProgress";
import { payloadFor } from "../../../tools/annual-major/am2-6-books";

const AT = "2026-12-02T03:00:00.000Z";
type Result = { text: string; finishReason: string; usage: { inputTokens: number; cachedInputTokens: number; outputTokens: number }; costUsd?: number; requestId?: string | null; error?: { code: string; message: string } };
type Input = { user: string; onText?: (t: string) => void };
type Stream = (input: Input) => Promise<Result>;
const kindOf = (u: string) => (u.includes(SECOND_PASS_NOTE) ? "second" : u.includes(CHUNK_RETRY_NOTE) ? "retry" : u.includes("\n고칠 자리:\n") ? "rewrite" : "first");
const chunkOfUser = (u: string) => (u.match(/^## (\d+)\. /m)?.[1] ?? "?");

/** 같은 저장소(장 · 원문)로 1차 → 2차를 차례로 짓는다. wrap으로 시도마다 작가 응답을 바꾼다. */
async function twoAttempts(who: string, wrap: (base: Stream, attempt: 1 | 2) => Stream = b => b) {
  const { buildV5Snapshot } = await import("@/lib/writer/publish");
  const { devMockStream } = await import("@/lib/ops/generation/devMock");
  const p = payloadFor(who) as never, base = devMockStream("ok" as never, p, AT) as unknown as Stream;
  const saved = new Map<number, unknown>(), sink = { save: async (c: { n: number }) => { saved.set(c.n, c); return true; }, load: async () => [...saved.values()] as never };
  const raw = new Map<string, unknown>(), cache = { get: (k: string) => (raw.get(k) as never) ?? null, put: (e: { key: string }) => { raw.set(e.key, e); } };
  const out: { calls: { kind: string; chunk: string; user: string }[]; built: Awaited<ReturnType<typeof buildV5Snapshot>>; review: Record<string, unknown> }[] = [];
  for (const attempt of [1, 2] as const) {
    const calls: { kind: string; chunk: string; user: string }[] = [], inner = wrap(base, attempt);
    const stream: Stream = async input => { calls.push({ kind: kindOf(input.user), chunk: chunkOfUser(input.user), user: input.user }); return inner(input); };
    const built = await buildV5Snapshot({ payload: p, reportId: "report_am29second0001", policyAt: AT, sink: sink as never,
      deps: { provider: "anthropic", model: "claude-sonnet-5-5", fallback: null, stream: stream as never, cache: cache as never, people: async () => [], ...(attempt === 2 ? { secondPass: true } : {}) } });
    out.push({ calls, built, review: built.meta.review as Record<string, unknown> });
  }
  return out;
}

describe("AM2-9 2부 장 묶음 작가 1차 · 2차(모의 작가)", () => {
  it("1차: 묶음 6개 첫 호출 + 다시 쓰기 묶음마다 많아야 1번, 시도 안 다시 부름(보류 다시 부름 · 못 끝낸 묶음 재호출) 없음", async () => {
    const [a1] = await twoAttempts("annual-1");
    expect(a1.calls.filter(c => c.kind === "first")).toHaveLength(6);
    expect(a1.calls.filter(c => c.kind === "second" || c.kind === "retry")).toHaveLength(0);
    const rewrites = a1.calls.filter(c => c.kind === "rewrite").map(c => c.user.match(/\[¶(\d+)\./)?.[1]);
    expect(rewrites.length).toBeLessThanOrEqual(6);
    expect((a1.review.rounds as unknown[]).length).toBeLessThanOrEqual(1);
    expect(a1.review.attempt).toBe(1);
    const v = judgeBuild({ meta: a1.built.meta, run: a1.built.run });
    if (v.kind === "incomplete") expect(v.reason).toMatch(/four_block/);
  }, 240_000);
  it("2차: 차단이 남은 묶음만 새 호출 1번(다시 부름 표지 + 걸린 문장 인용) — 다른 묶음은 부르지 않고, 1차 묶음은 다시 쓰지 않는다", async () => {
    const [a1, a2] = await twoAttempts("annual-1");
    const hold1 = (a1.review.hold as { at: string; sentence: string }[]);
    if (!hold1.length) return; // 1차가 깨끗하면 2차가 부를 것이 없다(아래 시험이 본다)
    expect(a2.calls.every(c => c.kind === "second")).toBe(true);
    const sp = a2.review.secondPass as { chunks: { chunk: string; complete: boolean }[] };
    expect(sp.chunks.length).toBe(a2.calls.length);
    expect(new Set(sp.chunks.map(c => c.chunk)).size).toBe(sp.chunks.length);
    expect(a2.calls.length).toBeLessThan(6 + 1);
    // 인용: 걸린 문장 하나 이상이 그 묶음 지시 끝에 «…» — 이유로 든다.
    const quoted = a2.calls.flatMap(c => [...c.user.split(SECOND_PASS_NOTE)[1].matchAll(/- «(.+?)» — /g)].map(m => m[1]));
    expect(quoted.length).toBeGreaterThan(0);
    expect(quoted.some(q => hold1.some(h => h.sentence.startsWith(q.slice(0, 30))))).toBe(true);
    expect(a2.review.attempt).toBe(2);
  }, 240_000);
  it("2차: 1차에 못 쓴 묶음(연결 오류)은 다시 부름 표지로 부르고, 그 묶음만 다시 쓴다 — 1차 묶음의 다시 쓰기는 없다", async () => {
    let broke = "";
    const [a1, a2] = await twoAttempts("major-1", (base, attempt) => async input => {
      const k = kindOf(input.user), ch = chunkOfUser(input.user);
      if (attempt === 1 && k === "first" && ch !== "1" && !broke) broke = ch;
      if (attempt === 1 && k === "first" && ch === broke) return { text: "", finishReason: "error", usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }, costUsd: 0, requestId: null, error: { code: "http_529", message: "overloaded" } };
      return base(input);
    });
    expect(broke).not.toBe("");
    expect(judgeBuild({ meta: a1.built.meta, run: a1.built.run }).kind).toBe("incomplete");
    const retried = a2.calls.filter(c => c.kind === "retry");
    expect(retried.map(c => c.chunk)).toEqual([broke]);
    expect(a2.calls.filter(c => c.kind === "first")).toHaveLength(0);
    // 다시 쓰기는 이번 시도에 처음 쓴 묶음(다시 부른 묶음)에서만 — 고칠 자리는 그 묶음 장에만 있다.
    for (const c of a2.calls.filter(x => x.kind === "rewrite")) expect(c.user).toContain(`고칠 묶음: ${broke}장`);
  }, 240_000);
});

describe("AM2-9 2부 고객 화면 — 2차 문구(30분 안), 사유 글 없음", () => {
  it("앞 시도가 차단으로 끝나도 고객 화면은 사유 글 없이 2차 대기 문구(늦어도 30분 안에 결과)를 보인다", () => {
    const facts = { origin: "paid" as const, bookStatus: "RETRYING", expired: false, startedAt: AT, paymentStatus: "paid", refundState: null, ticketState: null, failures: 1, phase: "pending" };
    const g = describeProgress({ facts, now: Date.parse(AT) + 6 * 60_000 });
    expect(g).toMatchObject({ state: "making", attempt: 2 });
    expect(JSON.stringify(g)).not.toMatch(/four_block|generation_hold|reason/);
    const copy = waitingCopy(g, elapsedMs(g));
    expect(copy.body).toContain("처음부터 한 번 더 쓰고 있어요"); expect(copy.body).toContain("30분 안에");
    expect(copy.body).not.toMatch(/다듬|24시간/);
  });
});

describe("AM2-8 5부 다시 쓰기 받기 기준 — 뜻 방향(그대로)", () => {
  it("살필 카드 줄을 권함으로 뒤집은 다시 쓰기는 버린다(P7 annual-p6b 2월 ¶2)", () => {
    const before = "돈도 오르는 달이지만 아끼는 데 집중하다 꼭 필요한 지출까지 미루기 쉬운 쪽입니다. 좋아하는 마음을 확인될 때까지 아낄 때처럼, 쓸 곳에 쓰지 않으면 마음이 먼저 닫혀 버립니다.";
    const after = "돈도 오르는 달이에요. 쓸 곳에 쓰지 않는 모습이 어울리는 달이라 살림이 든든해집니다.";
    expect(cardDir("돈을 살필 달 — 아끼다 필요한 지출까지 미루기 쉬운 쪽")).toBe("caution");
    expect(dirFlip(before, after, "caution")).toMatch(/뒤집/);
    expect(dirFlip(before, "꼭 필요한 지출까지 미루기 쉬운 달이라, 쓸 곳은 먼저 정해 두는 편이 마음이 덜 닫혀요.", "caution")).toBeNull();
  });
});
