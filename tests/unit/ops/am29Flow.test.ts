// AM2-9 2부 「세운·대운 실패 흐름 = 운영 30분 흐름」(비용 0): 가짜 시계 + 1분 크론 흉내 + 가짜 빌드(시도마다 결과를 정함)로
// 세운·대운 주문 하나가 결론(발행 또는 자동 환불·이용권 반환)에 닿는 시각과 2차 설정을 본다. 경로: 정상 · 1차 차단(four_block) → 2차 성공 ·
// 2차도 차단 → 결론 · 생각 소진 → 2차 2단 · 잔액 소진 → 2차 없이 결론 · 연결 → 2분 뒤 2차. 세운 · 대운 각각.
// 장 묶음 작가의 2차 동작(빠진 묶음만 · 차단이 남은 묶음만 인용 + 이유)은 tests/unit/writer/am29Second.test.ts가 실제 발행 함수로 본다.
import { describe, expect, it } from "vitest";
import { superviseQueueJob, type Decision, type QueueJob } from "@/lib/ops/generation/supervisor";
import { memorySink } from "@/lib/ops/generation/sinks";
import { GIVE_UP_AFTER_MS, MAX_ATTEMPTS, orderCostCap } from "@/lib/ops/generation/policy";
import { CONCLUSION_DEADLINE_MS } from "@/lib/ops/config";
import type { V5BuildDeps } from "@/lib/writer/publish";
import { ANTHROPIC_CREDIT, fakeClock, memoryOpsStore, mockAnthropic } from "../../helpers/opsMocks";
import { payloadFor } from "../../../tools/annual-major/am2-6-books";

const MIN = 60_000;
const policyAt = "2026-12-02T03:00:00.000Z";
type Step = { kind: "ok" | "block" | "thinking" | "credit" | "connection"; secs?: number };
type Seen = { secondPass: boolean; startStage: number | undefined; cache: boolean; costCapUsd: number | undefined };

/** 가짜 빌드: 시도마다 steps 차례로(끝 값 반복). 결과는 judgeBuild가 읽는 꼴(장 · 호출 기록)로만 만든다. */
function fakeBuild(clock: ReturnType<typeof fakeClock>, steps: Step[], seen: Seen[]) {
  return (async (a: { deps: V5BuildDeps }) => {
    const s = steps[Math.min(seen.length, steps.length - 1)];
    seen.push({ secondPass: Boolean(a.deps.secondPass), startStage: a.deps.startStage, cache: Boolean(a.deps.cache), costCapUsd: a.deps.costCapUsd });
    clock.t += (s.secs ?? 240) * 1000;
    if (s.kind === "credit") await a.deps.fetchImpl!("https://api.anthropic.com/v1/messages", { method: "POST", body: "{}" });
    const chapters = Array.from({ length: 10 }, (_, j) => ({ n: j + 1, source: "writer", chars: 1200 } as Record<string, unknown>));
    if (s.kind === "block") chapters[6] = { ...chapters[6], reason: "four_block:fact_relation" };
    if (s.kind === "thinking" || s.kind === "connection" || s.kind === "credit") chapters[9] = { n: 10, source: "deterministic", chars: 0 };
    const usage = { inputTokens: 20_000, cachedInputTokens: 0, outputTokens: 4_000 };
    const call = { kind: "first", provider: "anthropic", model: "claude-sonnet-5-5", chars: s.kind === "ok" || s.kind === "block" ? 6_000 : 0, costUsd: 0.06, ms: 60_000, requestId: "r", maxTokens: 9_000, usage, stage: a.deps.startStage ?? 1,
      finish: s.kind === "thinking" ? "length" : s.kind === "connection" || s.kind === "credit" ? "error" : "complete",
      ...(s.kind === "thinking" ? { cls: "thinking_exhausted" } : s.kind === "connection" ? { cls: "connection", error: "http_529" } : s.kind === "credit" ? { cls: "other", error: "invalid_request_error" } : {}) };
    const calls = [call, ...Array.from({ length: 5 }, () => ({ ...call, cls: undefined, error: undefined, finish: "complete", chars: 6_000, stage: 1 }))];
    const meta = { writer: { provider: "anthropic", model: "claude-sonnet-5-5" }, costUsd: 0.36, durationMs: (s.secs ?? 240) * 1000, calls, chapters };
    return { snapshot: { draft: {} }, meta, run: { calls, costUsd: 0.36, stale: false, capped: false, ladderEnd: false, exhausted: null, drafts: new Map(), usage, outputChars: 0, writer: null, fallback: null, cover: null, raw: [] } };
  }) as never;
}

type Outcome = { conclusion: "published" | "refunded" | "none"; atMin: number; attempts: number; decisions: Decision["kind"][]; seen: Seen[]; reasons: string[] };
async function simulate(product: "annual_fortune" | "major_fortune", steps: Step[], opts: { fetchImpl?: typeof fetch } = {}): Promise<Outcome> {
  const clock = fakeClock(), t0 = clock.now(), ops = memoryOpsStore(clock), seen: Seen[] = [], reasons: string[] = [];
  const payload = payloadFor(product === "annual_fortune" ? "annual-1" : "major-1") as never;
  const env = { store: ops.store, now: clock.now, openAiKey: null, build: fakeBuild(clock, steps, seen),
    deps: { sleep: clock.sleep, now: clock.now, people: async () => [], apiKey: "test-key", ...(opts.fetchImpl ? { fetchImpl: opts.fetchImpl } : { stream: (async () => { throw new Error("부르지 않음"); }) as never }) } };
  // 운영처럼 이 주문의 원문 저장소(ops_writer_raw)를 넘긴다 — 2차가 1차 원문을 그대로 쓰는지 본다.
  const job: QueueJob = { reportId: "report_am29_flow_00001", origin: "paid", originRef: "po_am29", payload, policyAt, sink: memorySink(), budgetMs: 680_000, originAt: new Date(t0).toISOString(), raw: { get: () => null, put: () => undefined } };
  const decisions: Decision["kind"][] = [];
  let claimAt = t0 + 30_000, attempts = 0;
  for (let guard = 0; guard < 20; guard++) {
    clock.advanceTo(claimAt);
    const r = await superviseQueueJob(job, env, async d => { decisions.push(d.kind); if (d.kind !== "publish" && "reason" in d) reasons.push(d.reason); return { ok: true }; });
    if (r.decision.kind !== "stale") attempts++;
    const at = (clock.now() - t0) / MIN;
    if (r.decision.kind === "publish") return { conclusion: "published", atMin: at, attempts, decisions, seen, reasons };
    if (r.decision.kind === "give_up") return { conclusion: "refunded", atMin: at, attempts, decisions, seen, reasons };
    if (r.decision.kind === "defer") claimAt = Math.ceil(Math.max(Date.parse(r.decision.until), clock.now()) / MIN) * MIN;
    else claimAt = clock.now() + MIN;
  }
  return { conclusion: "none", atMin: (clock.now() - t0) / MIN, attempts, decisions, seen, reasons };
}
const within30 = (o: Outcome) => { expect(o.conclusion).not.toBe("none"); expect(o.atMin).toBeLessThan(CONCLUSION_DEADLINE_MS / MIN); expect(o.attempts).toBeLessThanOrEqual(MAX_ATTEMPTS); };

describe.each(["annual_fortune", "major_fortune"] as const)("AM2-9 2부 30분 흐름 — %s", product => {
  it("주문 상한은 $1.0(세운·대운), 포기 25분", () => {
    expect(orderCostCap(product, {})).toBe(1.0);
    expect(GIVE_UP_AFTER_MS).toBe(25 * MIN);
  });
  it("정상: 1차 한 번에 발행", async () => {
    const o = await simulate(product, [{ kind: "ok" }]);
    within30(o); expect(o.conclusion).toBe("published"); expect(o.attempts).toBe(1);
    expect(o.seen[0]).toMatchObject({ secondPass: false, startStage: 1 });
  });
  it("1차 차단(four_block) → 즉시 2차(secondPass · 저장 원문 그대로 · 남은 비용) 성공 → 발행", async () => {
    const o = await simulate(product, [{ kind: "block" }, { kind: "ok", secs: 90 }]);
    within30(o); expect(o.conclusion).toBe("published"); expect(o.decisions).toEqual(["defer", "publish"]);
    expect(o.seen[1]).toMatchObject({ secondPass: true, cache: true });
    expect(o.seen[1].costCapUsd).toBeCloseTo(1.0 - 0.36, 4);
    expect(o.reasons[0]).toMatch(/four_block:7.*:check$/);
  });
  it("2차도 차단 → 2차 뒤 바로 결론(자동 환불) — 25분 안, 보류 없음", async () => {
    const o = await simulate(product, [{ kind: "block" }, { kind: "block" }]);
    within30(o); expect(o.conclusion).toBe("refunded"); expect(o.attempts).toBe(2);
    expect(o.atMin).toBeLessThan(GIVE_UP_AFTER_MS / MIN);
    expect(o.reasons.at(-1)).toMatch(/four_block.*second_failed/);
  });
  it("생각 소진 → 즉시 2차(2단 · secondPass — 빠진 묶음만) 성공", async () => {
    const o = await simulate(product, [{ kind: "thinking", secs: 400 }, { kind: "ok", secs: 120 }]);
    within30(o); expect(o.conclusion).toBe("published");
    expect(o.seen[1]).toMatchObject({ secondPass: true, startStage: 2 });
  });
  it("생각 소진 두 번 → 결론", async () => {
    const o = await simulate(product, [{ kind: "thinking", secs: 400 }, { kind: "thinking", secs: 400 }]);
    within30(o); expect(o.conclusion).toBe("refunded");
  });
  it("Anthropic 잔액 소진 → 2차 없이 바로 결론", async () => {
    const a = mockAnthropic([ANTHROPIC_CREDIT]);
    const o = await simulate(product, [{ kind: "credit", secs: 5 }], { fetchImpl: a.fetch });
    within30(o); expect(o.conclusion).toBe("refunded"); expect(o.attempts).toBe(1);
    expect(o.reasons[0]).toMatch(/anthropic_credit.*credit_auth/);
  });
  it("연결 오류 → 2분 뒤 2차(secondPass) 성공", async () => {
    const o = await simulate(product, [{ kind: "connection", secs: 10 }, { kind: "ok", secs: 120 }]);
    within30(o); expect(o.conclusion).toBe("published");
    expect(o.seen[1]).toMatchObject({ secondPass: true });
  });
});

describe("AM2-9 2부 4종은 2차 설정이 그대로(secondPass 없음)", () => {
  it("종합: 검사 탈락 뒤 2차에 secondPass를 넘기지 않는다", async () => {
    const clock = fakeClock(), ops = memoryOpsStore(clock), seen: Seen[] = [];
    const payload = { ...(payloadFor("annual-1") as Record<string, unknown>), productKey: "saju_mbti_full" } as never;
    const env = { store: ops.store, now: clock.now, openAiKey: null, build: fakeBuild(clock, [{ kind: "connection" }, { kind: "ok" }], seen), deps: { sleep: clock.sleep, now: clock.now, people: async () => [], apiKey: "k" } };
    const job: QueueJob = { reportId: "report_am29_four_00001", origin: "paid", originRef: "po", payload, policyAt, sink: memorySink(), budgetMs: 680_000, originAt: new Date(clock.now()).toISOString() };
    await superviseQueueJob(job, env, async () => ({ ok: true }));
    clock.t += 3 * MIN;
    await superviseQueueJob(job, env, async () => ({ ok: true }));
    expect(seen.map(s => s.secondPass)).toEqual([false, false]);
  });
});
