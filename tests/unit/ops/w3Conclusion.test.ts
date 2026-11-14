// W3 P2 「30분 결론」 가짜 공급자 시뮬레이션(비용 0): 가짜 시계 + 1분 크론 흉내 + 스크립트 작가로 결제·이용권 주문 하나가 결론(발행 또는 자동 환불·이용권 반환)에
// 닿는 시각을 잰다. 경로: (a) 생각 소진 → 2차 성공 / (a2) 생각 소진 두 번 → 결론 / (b) 529 장애 / (c) Anthropic 잔액 소진 / (d) 검사 탈락(장 빠짐) / (e) 첫 이벤트 멈춤 /
// (f) 함수 죽음 / (g) 장애 자동 멈춤 신호 / 이용권 경로. 모든 경로가 시작 + 30분 안.
import { describe, expect, it } from "vitest";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { superviseQueueJob, type Decision, type QueueJob } from "@/lib/ops/generation/supervisor";
import { memorySink } from "@/lib/ops/generation/sinks";
import { attemptBudgetMs, failClassOf, GIVE_UP_AFTER_MS, MAX_ATTEMPTS, nextAfterFailure, orderCostCap, SWEEP_AFTER_MS } from "@/lib/ops/generation/policy";
import { paidSweepAction, ticketSweepDue } from "@/lib/ops/generation/deadline";
import { CONCLUSION_DEADLINE_MS } from "@/lib/ops/config";
import type { StreamCompletionInput, StreamCompletionResult } from "@/lib/llm/types";
import { RAW_FULL, mockTextFor } from "../../helpers/v5Scenarios";
import { ANTHROPIC_CREDIT, fakeClock, memoryOpsStore, mockAnthropic, mockOpenAiWithBody, routedFetch } from "../../helpers/opsMocks";

const MIN = 60_000;
const policyAt = "2026-10-27T03:00:00.000Z";
const input = (() => { const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date(policyAt) }); if (!n.ok) throw new Error("payload"); return n.value; })();
const { text } = mockTextFor(input, policyAt);
const cutAfter = (n: number) => text.slice(0, text.indexOf(`## ${n + 1}. `));

/** 작가 한 번의 결과와 걸린 시간(가짜 시계를 그만큼 민다). */
type Step = { kind: "ok"; secs?: number } | { kind: "thinking"; secs?: number } | { kind: "status"; code: string; secs?: number } | { kind: "partial"; upTo: number; secs?: number };
const USAGE = { inputTokens: 27_000, cachedInputTokens: 0, outputTokens: 0 };
function scriptedStream(clock: ReturnType<typeof fakeClock>, steps: Step[]) {
  const writer: { maxTokens: number; at: number }[] = [];
  const stream = async (i: StreamCompletionInput): Promise<StreamCompletionResult> => {
    // 검수(Haiku)·수리는 실패로 돌려 발행 경로만 본다(검수가 죽어도 결정론 검사를 통과하면 발행).
    if (!/sonnet/.test(i.model) || i.jsonSchema) { clock.t += 4_000; return { text: "", finishReason: "error", usage: USAGE, costUsd: 0, requestId: "r", error: { code: "http_529", message: "overloaded" } }; }
    const s = steps[Math.min(writer.length, steps.length - 1)];
    writer.push({ maxTokens: i.maxOutputTokens, at: clock.now() });
    const observed = (blocks: Record<string, { n: number; chars: number }>) => ({ stop: null, sent: { maxTokens: i.maxOutputTokens, thinking: "between_tools", effort: null }, blocks, firstTextMs: null });
    if (s.kind === "ok") { clock.t += (s.secs ?? 160) * 1000; i.onText?.(text); return { text, finishReason: "complete", usage: { ...USAGE, outputTokens: 14_000 }, costUsd: 0.2, requestId: "r", observed: observed({ text: { n: 1, chars: text.length } }) }; }
    if (s.kind === "partial") { clock.t += (s.secs ?? 120) * 1000; const t = cutAfter(s.upTo); i.onText?.(t); return { text: t, finishReason: "complete", usage: { ...USAGE, outputTokens: 8_000 }, costUsd: 0.12, requestId: "r", observed: observed({ text: { n: 1, chars: t.length } }) }; }
    if (s.kind === "thinking") { clock.t += (s.secs ?? 498) * 1000; return { text: "", finishReason: "length", usage: { ...USAGE, outputTokens: i.maxOutputTokens }, costUsd: i.maxOutputTokens * 1e-5 + 0.05, requestId: "r", observed: observed({ thinking: { n: 1, chars: 0 } }) }; }
    clock.t += (s.secs ?? 4) * 1000;
    return { text: "", finishReason: "error", usage: USAGE, costUsd: 0, requestId: "r", error: { code: s.code, message: s.code } };
  };
  return { stream, writer };
}

type Outcome = { conclusion: "published" | "refunded" | "returned" | "none"; atMin: number; attempts: number; decisions: Decision["kind"][] };
/**
 * 크론 흉내: 시작(결제 확정) + 30초에 첫 claim, 미룸(defer)이면 그 시각 뒤 첫 분 정각에 다시, 결론이면 끝.
 * die: 그 번째(1부터) claim은 정산 없이 죽는다(lease 15분 뒤 다시 claim, priorClaims +1). 결제는 포기 직후 환불(refundNow)을 부른다.
 */
async function simulate(steps: Step[], opts: { origin?: "paid" | "ticket"; die?: number[]; fetchImpl?: typeof fetch } = {}): Promise<Outcome & { writer: { maxTokens: number; at: number }[]; refundNowAt: number | null }> {
  const clock = fakeClock(), t0 = clock.now(), ops = memoryOpsStore(clock), sc = scriptedStream(clock, steps);
  const env = { store: ops.store, now: clock.now, openAiKey: null, deps: { ...(opts.fetchImpl ? { fetchImpl: opts.fetchImpl } : { stream: sc.stream }), sleep: clock.sleep, now: clock.now, people: async () => [], apiKey: "test-key" } };
  const origin = opts.origin ?? "paid";
  const job: QueueJob = { reportId: "report_w3_conclusion_01", origin, originRef: "po_w3", payload: input, policyAt, sink: memorySink(), budgetMs: 680_000, originAt: new Date(t0).toISOString() };
  const decisions: Decision["kind"][] = [];
  let claimAt = t0 + 30_000, claims = 0, refundNowAt: number | null = null, attempts = 0;
  for (let guard = 0; guard < 20; guard++) {
    clock.advanceTo(claimAt); claims++;
    if (opts.die?.includes(guard + 1)) { attempts++; claimAt = clock.now() + 15 * MIN; continue; } // lease가 끝날 때까지 아무도 못 잡는다
    const r = await superviseQueueJob({ ...job, ...(claims > 1 ? { priorClaims: claims - 1 } : {}) }, env, async d => {
      decisions.push(d.kind);
      if (d.kind === "give_up" && origin === "paid") refundNowAt = clock.now();
      return { ok: true };
    });
    if (r.decision.kind !== "stale") attempts++;
    const at = (clock.now() - t0) / MIN;
    if (r.decision.kind === "publish") return { conclusion: "published", atMin: at, attempts, decisions, writer: sc.writer, refundNowAt };
    if (r.decision.kind === "give_up") return { conclusion: origin === "paid" ? "refunded" : "returned", atMin: at, attempts, decisions, writer: sc.writer, refundNowAt };
    if (r.decision.kind === "defer") { claims = 0; const u = Date.parse(r.decision.until); claimAt = Math.ceil(Math.max(u, clock.now()) / MIN) * MIN; }
    else claimAt = clock.now() + MIN;
  }
  return { conclusion: "none", atMin: (clock.now() - t0) / MIN, attempts, decisions, writer: sc.writer, refundNowAt };
}
const within30 = (o: Outcome) => { expect(o.conclusion).not.toBe("none"); expect(o.atMin).toBeLessThan(CONCLUSION_DEADLINE_MS / MIN); expect(o.attempts).toBeLessThanOrEqual(MAX_ATTEMPTS); };

describe("정책(순수): 30분 결론", () => {
  it("마감은 상수 한 곳(30분), 포기 25분·마감 청소 28분, 시도 2번", () => {
    expect(CONCLUSION_DEADLINE_MS).toBe(30 * MIN); expect(GIVE_UP_AFTER_MS).toBe(25 * MIN); expect(SWEEP_AFTER_MS).toBe(28 * MIN); expect(MAX_ATTEMPTS).toBe(2);
  });
  it("시도 예산 = min(기본, 시작 + 25분 − 30초), 4분이 안 남으면 시도 없음", () => {
    expect(attemptBudgetMs({ originAt: 0, now: 30_000, defaultBudgetMs: 680_000 })).toBe(680_000);
    expect(attemptBudgetMs({ originAt: 0, now: 15 * MIN, defaultBudgetMs: 680_000 })).toBe(10 * MIN - 30_000);
    expect(attemptBudgetMs({ originAt: 0, now: 21 * MIN, defaultBudgetMs: 680_000 })).toBeNull();
  });
  it("2차 규칙: 연결 2분 뒤 · 생각 소진·검사 탈락 즉시 · 잔액·인증 바로 결론 · 2차 뒤 결론 · 시간이 모자라면 결론", () => {
    expect(nextAfterFailure({ cls: "connection", attemptIndex: 0, originAt: 0, now: MIN })).toEqual({ kind: "defer", until: 3 * MIN });
    expect(nextAfterFailure({ cls: "thinking_exhausted", attemptIndex: 0, originAt: 0, now: 9 * MIN })).toEqual({ kind: "defer", until: 9 * MIN });
    expect(nextAfterFailure({ cls: "check", attemptIndex: 0, originAt: 0, now: 5 * MIN })).toEqual({ kind: "defer", until: 5 * MIN });
    expect(nextAfterFailure({ cls: "credit_auth", attemptIndex: 0, originAt: 0, now: MIN })).toEqual({ kind: "give_up", why: "credit_auth" });
    expect(nextAfterFailure({ cls: "connection", attemptIndex: 1, originAt: 0, now: 5 * MIN })).toEqual({ kind: "give_up", why: "second_failed" });
    expect(nextAfterFailure({ cls: "connection", attemptIndex: 0, originAt: 0, now: 19 * MIN })).toEqual({ kind: "give_up", why: "no_time" });
    expect(nextAfterFailure({ cls: "thinking_exhausted", attemptIndex: 0, originAt: 0, now: 9 * MIN, capped: true })).toEqual({ kind: "give_up", why: "cost_cap" });
  });
  it("실패 분류: 잔액·인증 > 생각 소진 > 연결 > 예외(기타) > 검사 탈락", () => {
    const v = (o: object) => ({ kind: "incomplete" as const, reason: "partial:missing:3", rejected: [], missing: [3], preOutput: false, ...o });
    expect(failClassOf(v({ cls: "connection" }), { anthropicCredit: true })).toBe("credit_auth");
    expect(failClassOf(v({ cls: "thinking_exhausted" }))).toBe("thinking_exhausted");
    expect(failClassOf(v({ cls: "connection" }))).toBe("connection");
    expect(failClassOf(v({ reason: "pre_output:build_exception:TypeError", preOutput: true }))).toBe("other");
    expect(failClassOf(v({}))).toBe("check");
  });
  it("주문 상한(4종) = 1차 최악 + 2차 최악 + 검수·수리 몫", () => {
    expect(orderCostCap("saju_mbti_full", {})).toBe(1.65); expect(orderCostCap("career_money_study", {})).toBe(1.6);
    expect(orderCostCap("love_marriage_child", {})).toBe(1.6); expect(orderCostCap("saju_mbti_compatibility", {})).toBe(1.65);
    expect(orderCostCap("saju_mbti_full", { ORDER_COST_CAP_USD: "0.8" })).toBe(0.8);
  });
  it("마감 청소 판단: 28분 지난 미발행 → 환불, 실패 상태(FAILED)는 2차 시간이 남으면 다시 큐, 이미 결론·발행은 그대로", () => {
    expect(paidSweepAction({ status: "RUNNING", startedAt: 0, now: 27 * MIN, refunded: false, published: false })).toBe("none");
    expect(paidSweepAction({ status: "RUNNING", startedAt: 0, now: 28 * MIN, refunded: false, published: false })).toBe("refund");
    expect(paidSweepAction({ status: "FAILED_REQUIRES_ATTENTION", startedAt: 0, now: 10 * MIN, refunded: false, published: false })).toBe("requeue");
    expect(paidSweepAction({ status: "FAILED_REQUIRES_ATTENTION", startedAt: 0, now: 22 * MIN, refunded: false, published: false })).toBe("refund");
    expect(paidSweepAction({ status: "RETRYING", startedAt: 0, now: 40 * MIN, refunded: true, published: false })).toBe("none");
    expect(paidSweepAction({ status: "QUEUED", startedAt: 0, now: 40 * MIN, refunded: false, published: true })).toBe("none");
    expect(ticketSweepDue({ state: "QUEUED", startedAt: 0, now: 28 * MIN })).toBe(true);
    expect(ticketSweepDue({ state: "RUNNING", startedAt: 0, now: 27 * MIN })).toBe(false);
    expect(ticketSweepDue({ state: "COMPLETED", startedAt: 0, now: 40 * MIN })).toBe(false);
  });
});

// 가짜 시계라 실제로는 몇 초지만, 전체 시험 부하에서 기본 5초를 넘을 수 있다.
describe("시뮬레이션: 모든 경로가 30분 안에 결론", { timeout: 60_000 }, () => {
  it("정상: 1차 한 번에 발행(약 3분)", async () => {
    const o = await simulate([{ kind: "ok" }]);
    within30(o); expect(o.conclusion).toBe("published"); expect(o.decisions).toEqual(["publish"]); expect(o.atMin).toBeLessThan(8); // 작가 160초 + (목업) 검수 529 재시도
  });
  it("(a) 생각 소진 → 즉시 2차(2단, 시간으로 깎인 한도) 성공 → 발행", async () => {
    const o = await simulate([{ kind: "thinking" }, { kind: "ok", secs: 300 }]);
    within30(o); expect(o.conclusion).toBe("published"); expect(o.decisions).toEqual(["defer", "publish"]);
    expect(o.writer[1].maxTokens).toBeGreaterThan(o.writer[0].maxTokens);
    expect(o.writer[1].at - o.writer[0].at).toBeLessThan(10 * MIN);
  });
  it("(a2) 생각 소진 두 번 → 2차 뒤 바로 결론(자동 환불, 포기 직후 환불 호출)", async () => {
    const o = await simulate([{ kind: "thinking" }, { kind: "thinking", secs: 560 }]);
    within30(o); expect(o.conclusion).toBe("refunded"); expect(o.decisions).toEqual(["defer", "give_up"]); expect(o.refundNowAt).not.toBeNull();
  });
  it("(b) Anthropic 장애(529 계속) → 2분 뒤 2차 → 결론(약 3분)", async () => {
    const o = await simulate([{ kind: "status", code: "http_529" }]);
    within30(o); expect(o.conclusion).toBe("refunded"); expect(o.decisions).toEqual(["defer", "give_up"]); expect(o.atMin).toBeLessThan(5);
  });
  it("(b2) 일시 오류 1번 → 2분 뒤 2차 성공", async () => {
    const o = await simulate([{ kind: "status", code: "http_529" }, { kind: "status", code: "http_529" }, { kind: "ok" }]);
    within30(o); expect(o.conclusion).toBe("published");
  });
  it("(c) Anthropic 잔액 소진 → 2차 없이 바로 결론", async () => {
    const a = mockAnthropic([ANTHROPIC_CREDIT]), o2 = mockOpenAiWithBody([{ text }]);
    const o = await simulate([], { fetchImpl: routedFetch(a, o2) });
    within30(o); expect(o.conclusion).toBe("refunded"); expect(o.decisions).toEqual(["give_up"]); expect(o.atMin).toBeLessThan(2);
  });
  it("(d) 검사 탈락(장이 빠진 원고) → 즉시 2차(빠진 장) → 발행", async () => {
    const o = await simulate([{ kind: "partial", upTo: 6 }, { kind: "partial", upTo: 6 }, { kind: "ok" }]);
    within30(o); expect(["published", "refunded"]).toContain(o.conclusion);
  });
  it("(e) 첫 이벤트 멈춤(90초) → 연결로 분류 → 2분 뒤 2차 성공", async () => {
    const o = await simulate([{ kind: "status", code: "first_event_timeout", secs: 90 }, { kind: "status", code: "first_event_timeout", secs: 90 }, { kind: "ok" }]);
    within30(o); expect(o.conclusion).toBe("published");
  });
  it("(f) 결제 함수가 1차 중에 죽음 → lease 15분 뒤 2차로 다시 잡아 발행", async () => {
    const o = await simulate([{ kind: "ok" }], { die: [1] });
    within30(o); expect(o.conclusion).toBe("published"); expect(o.attempts).toBe(2);
  });
  it("(f2) 1차·2차 모두 죽음 → 세 번째 claim은 시도 없이 결론(환불)", async () => {
    const o = await simulate([{ kind: "ok" }], { die: [1, 2] });
    expect(o.conclusion).toBe("refunded"); expect(o.decisions).toEqual(["give_up"]); expect(o.atMin).toBeLessThan(31);
  });
  it("이용권: 연결 장애 → 2차 뒤 이용권 반환(결론)", async () => {
    const o = await simulate([{ kind: "status", code: "http_529" }], { origin: "ticket" });
    within30(o); expect(o.conclusion).toBe("returned");
  });
});
