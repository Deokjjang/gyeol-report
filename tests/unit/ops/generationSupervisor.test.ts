// P6d-ops 7 실패 주입(목업, 비용 0): 429·5xx·중간 끊김·Anthropic 장애·잔액 소진. 가짜 시계. W3 P2: 30분 결론(2차 1번, 대체 작가 없음).
import { describe, expect, it } from "vitest";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { superviseQueueJob, runLaneBatch, type Decision } from "@/lib/ops/generation/supervisor";
import { memorySink } from "@/lib/ops/generation/sinks";
import { judgeBuild, nextRetryAt, RETRY_WINDOW_MS, retryWindowMs } from "@/lib/ops/generation/policy";
import { RAW_FULL, mockTextFor } from "../../helpers/v5Scenarios";
import { ANTHROPIC_CREDIT, ANTHROPIC_OVERLOADED, fakeClock, memoryOpsStore, mockAnthropic, mockOpenAiWithBody, routedFetch, type AnthropicBehavior } from "../../helpers/opsMocks";
import type { MockBehavior } from "../../helpers/llmMock";

const MIN = 60_000, HOUR = 60 * MIN;
const policyAt = "2026-10-27T03:00:00.000Z";
const input = (() => { const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date(policyAt) }); if (!n.ok) throw new Error("payload"); return n.value; })();
const { text } = mockTextFor(input, policyAt);
const cutAt = (n: number) => text.indexOf(`## ${n}. `) + 40;
const from = (n: number) => text.slice(text.indexOf(`## ${n}. `));

function harness(anthropic: AnthropicBehavior[], openai: (MockBehavior & { body?: string })[] = [{ text }], opts: { openAiKey?: string | null } = {}) {
  const clock = fakeClock(), ops = memoryOpsStore(clock), a = mockAnthropic(anthropic), o = mockOpenAiWithBody(openai);
  const env = { store: ops.store, now: clock.now, openAiKey: opts.openAiKey === undefined ? "sk-test" : opts.openAiKey,
    deps: { fetchImpl: routedFetch(a, o), sleep: clock.sleep, now: clock.now, people: async () => [], apiKey: "test-key" } };
  const sink = memorySink(), decisions: { at: number; d: Decision }[] = [];
  const job = { reportId: "report_p6dops_test_0001", origin: "paid" as const, originRef: "payment_order_x", payload: input, policyAt, sink, budgetMs: 480_000 };
  const run = async () => {
    const r = await superviseQueueJob(job, env, async d => { decisions.push({ at: clock.now(), d }); if (d.kind === "publish") ops.snapshots.set(job.reportId, d.snapshot); return { ok: true }; });
    return r.decision;
  };
  return { clock, ops, a, o, env, run, decisions, job, setAnthropic: (b: AnthropicBehavior[]) => { const m = mockAnthropic(b); env.deps.fetchImpl = routedFetch(m, o); return m; } };
}

describe("정책: 시간표·판정", () => {
  // W3 P2: 이 시간표는 관리자 재생성(교체 레인)에만 남았다. 고객 주문은 30분 결론(w3Conclusion).
  it("재생성 재시도 간격 1분·5분·15분·1시간·3시간, 첫 실패 + 자동 환불 시간(기본 6시간)이 끝", () => {
    const t0 = 0, steps: number[] = [];
    let now = t0, failures = 0;
    for (;;) { failures++; const n = nextRetryAt(t0, failures, now); if (n === null) break; steps.push(n - now); now = n; }
    expect(RETRY_WINDOW_MS).toBe(6 * HOUR);
    expect(steps).toEqual([1, 5, 15, 60, 180, 99].map(m => m * MIN));
    expect(now).toBe(t0 + RETRY_WINDOW_MS); // 마지막 시도는 정확히 6시간째
    // HOTFIX-W1 3부 4: 설정값 AUTO_REFUND_HOURS(1~72). 24로 두면 예전 시간표(1분…6시간, 24시간 끝).
    expect(retryWindowMs({ AUTO_REFUND_HOURS: "24" })).toBe(24 * HOUR); expect(retryWindowMs({})).toBe(6 * HOUR); expect(retryWindowMs({ AUTO_REFUND_HOURS: "0" })).toBe(6 * HOUR); expect(retryWindowMs({ AUTO_REFUND_HOURS: "100" })).toBe(6 * HOUR);
    { let n2 = 0, f2 = 0; const s2: number[] = []; for (;;) { f2++; const n = nextRetryAt(0, f2, n2, 24 * HOUR); if (n === null) break; s2.push(n - n2); n2 = n; } expect(s2.slice(0, 6)).toEqual([1, 5, 15, 60, 180, 360].map(m => m * MIN)); expect(n2).toBe(24 * HOUR); }
  });
});

describe("출력 전 실패·중간 끊김(같은 시도 안)", () => {
  // 최종판3 6: 출력 0 실패는 시도 안에서 1회만 다시 부른다(두 번째도 실패면 다음 시도로 미룬다 — final3RawRetry.test).
  it("429 한 번 → 재시도 1회 → Sonnet 정식본", async () => {
    const h = harness([{ status: 429 }, { text }]);
    const d = await h.run();
    expect(d.kind).toBe("publish"); expect(d.kind === "publish" && d.edition).toBe("official");
    expect(d.kind === "publish" && d.meta.writer).toEqual({ provider: "anthropic", model: "claude-sonnet-5-5" });
    expect(h.a.calls.length).toBeGreaterThanOrEqual(2); expect(h.o.calls).toHaveLength(0); // terra 대체 없음(뒤 호출은 P6c 수리 1회)
    expect(h.ops.states.get(h.job.reportId)!.phase).toBe("official");
  }, 60_000);

  it("5xx(529 과부하) → 재시도 → 정식본, 모든 시도·비용이 기록된다", async () => {
    const h = harness([ANTHROPIC_OVERLOADED, { text }]);
    const d = await h.run();
    expect(d.kind).toBe("publish");
    const run = h.ops.runs.at(-1) as { outcome: string; calls: { error?: string }[]; costUsd: number; chapters: { source: string }[] };
    expect(run.outcome).toBe("published"); expect(run.calls.slice(0, 2).map(c => c.error ?? "ok")).toEqual(["http_529", "ok"]);
    expect(run.chapters.every(c => c.source === "writer")).toBe(true); expect(run.costUsd).toBeGreaterThan(0);
  }, 60_000);

  it("중간 끊김 → 받은 장 저장, 빠진 장만 이어쓰기 → 정식본", async () => {
    const h = harness([{ text, cutAt: cutAt(7) }, { text: from(6) }]);
    const d = await h.run();
    expect(d.kind).toBe("publish");
    const sources = d.kind === "publish" ? d.meta.chapters.map(c => c.source) : [];
    expect(sources.filter(s => s === "writer").length).toBe(6); expect(sources.filter(s => s === "continuation").length).toBe(7);
  }, 60_000);

  it("이어쓰기도 실패(529) → 결정론으로 채우지 않고 2분 뒤 2차 → 2차는 빠진 장만", async () => {
    const h = harness([{ text, cutAt: cutAt(7) }, ANTHROPIC_OVERLOADED]);
    const d1 = await h.run();
    expect(d1.kind).toBe("defer");
    expect(Date.parse((d1 as { until: string }).until) - h.decisions[0].at).toBe(2 * MIN);
    h.clock.advanceTo(Date.parse((d1 as { until: string }).until));
    h.setAnthropic([{ text: from(6) }]);
    const d2 = await h.run();
    expect(d2.kind).toBe("publish");
    // 첫 호출 없이 이어쓰기로 시작(뒤는 P6c 수리 호출뿐).
    const kinds = ((h.ops.runs.at(-1) as { calls: { kind: string }[] }).calls).map(c => c.kind);
    expect(kinds[0]).toBe("continuation"); expect(kinds).not.toContain("first");
    expect(h.ops.states.get(h.job.reportId)!.failures).toBe(1);
  }, 120_000);

  it("인증 실패(401) → 결정론 원고는 내보내지 않고 2차 없이 바로 포기(잔액·인증)", async () => {
    const h = harness([{ status: 401 }]);
    const d = await h.run();
    expect(d.kind).toBe("give_up"); expect(d.kind === "give_up" && d.cls).toBe("credit_auth");
    expect(h.decisions.some(x => x.d.kind === "publish")).toBe(false);
  }, 60_000);
});

// W3 P2: 임시본(OpenAI)·보류·24시간 시간표는 없앴다 — 시작 + 30분 안에 책 또는 자동 환불. 30분 시뮬레이션 전체는 w3Conclusion 시험.
describe("Anthropic 장애(W3 P2: 30분 결론, 대체 작가 없음)", () => {
  it("529가 계속되면 2분 뒤 2차(같은 설정) → 2차도 실패하면 포기(자동 환불 경로) — OpenAI 키가 있어도 부르지 않는다", async () => {
    const h = harness([ANTHROPIC_OVERLOADED], [{ text }]);
    let d = await h.run();
    const first = h.decisions[0].at;
    expect(d.kind).toBe("defer"); expect(Date.parse((d as { until: string }).until) - first).toBe(2 * MIN);
    h.clock.advanceTo(Date.parse((d as { until: string }).until)); d = await h.run();
    expect(d.kind).toBe("give_up"); expect(d.kind === "give_up" && d.cls).toBe("connection");
    expect(h.o.calls).toHaveLength(0); expect(h.decisions.some(x => x.d.kind === "publish")).toBe(false);
    expect(h.clock.now() - first).toBeLessThan(30 * MIN);
    expect(h.ops.states.get(h.job.reportId)!.phase).toBe("gave_up");
  }, 600_000);

  it("장애가 2차 전에 풀리면 2차가 정식본(Sonnet)으로 발행한다", async () => {
    const h = harness([ANTHROPIC_OVERLOADED], [{ text }]);
    const d1 = await h.run();
    expect(d1.kind).toBe("defer");
    h.setAnthropic([{ text }]); h.clock.advanceTo(Date.parse((d1 as { until: string }).until));
    const d2 = await h.run();
    expect(d2.kind).toBe("publish"); expect(d2.kind === "publish" && d2.edition).toBe("official");
    expect(d2.kind === "publish" && d2.meta.writer?.provider).toBe("anthropic"); expect(h.o.calls).toHaveLength(0);
  }, 600_000);
});

describe("Anthropic 잔액 소진", () => {
  it("잔액 부족 오류를 보면 2차 없이 바로 포기하고 잔액 경보를 보낸다(OpenAI는 부르지 않는다)", async () => {
    const h = harness([ANTHROPIC_CREDIT], [{ text }]);
    const codes: string[] = []; (h.env as { creditAlert?: (c: string) => Promise<unknown> }).creditAlert = async c => { codes.push(c); return { ok: true }; };
    const d = await h.run();
    expect(d.kind).toBe("give_up"); expect(d.kind === "give_up" && d.cls).toBe("credit_auth");
    expect(codes).toEqual(["anthropic_credit"]); expect(h.o.calls).toHaveLength(0);
    expect(h.ops.runs.some(r => String((r as { reason: string }).reason).includes("credit_auth"))).toBe(true);
    expect(h.ops.states.get(h.job.reportId)!.phase).toBe("gave_up");
  }, 60_000);
});

describe("판정", () => {
  it("최종판 0-1: 결정론 장(빠진 장)이 있으면 incomplete — 짧은 작가 장은 버리지 않는다(rejected 늘 빈 배열), 상한에 걸리면 capped", () => {
    const meta = { chapters: [{ n: 1, source: "writer" }, { n: 2, source: "writer", reason: "short:100<600" }, { n: 3, source: "deterministic", reason: "missing" }], calls: [{ chars: 10, error: undefined }] };
    const v = judgeBuild({ meta: meta as never, run: { stale: false, calls: meta.calls } as never });
    expect(v).toMatchObject({ kind: "incomplete", rejected: [], missing: [3], preOutput: false });
    expect(judgeBuild({ meta: { chapters: [{ n: 1, source: "writer", reason: "short:100<600" }], calls: [] } as never, run: null })).toEqual({ kind: "complete", keysFilled: [] });
    expect(judgeBuild({ meta: meta as never, run: { stale: false, capped: true, calls: meta.calls } as never })).toMatchObject({ kind: "incomplete", capped: true, reason: "partial:cost_cap" });
    // AM2-3 6-1: 대운·세운 key를 결정론 문단으로 채운 장도 결정론 대체본 — 내보내지 않는다.
    expect(judgeBuild({ meta: { chapters: [{ n: 1, source: "writer", reason: "keys_filled:2026" }], calls: [] } as never, run: null })).toMatchObject({ kind: "incomplete", missing: [1], reason: "pre_output:keys_filled:1" });
  });
});

describe("OPS_FORCE_ANTHROPIC_DOWN (개발 전용 장애 강제, P6e-ops 8)", () => {
  it("개발 모드에서만 켜지고, 운영·미설정이면 항상 꺼진다", async () => {
    const { devForceAnthropicDown } = await import("@/lib/ops/generation/devMock");
    expect(devForceAnthropicDown({ NODE_ENV: "development", OPS_FORCE_ANTHROPIC_DOWN: "1" })).toBe(true);
    expect(devForceAnthropicDown({ NODE_ENV: "production", OPS_FORCE_ANTHROPIC_DOWN: "1" })).toBe(false);
    expect(devForceAnthropicDown({ NODE_ENV: "test", OPS_FORCE_ANTHROPIC_DOWN: "1" })).toBe(false);
    expect(devForceAnthropicDown({ NODE_ENV: "development" })).toBe(false);
    expect(devForceAnthropicDown({ NODE_ENV: "development", OPS_FORCE_ANTHROPIC_DOWN: "0" })).toBe(false);
  });
});
