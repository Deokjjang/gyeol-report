// P6d-ops 7 실패 주입(목업, 비용 0): 429·5xx·중간 끊김·Anthropic 24시간 장애·OpenAI 잔액 부족. 가짜 시계로 24시간을 그대로 돈다.
import { describe, expect, it } from "vitest";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { superviseQueueJob, runLaneBatch, type Decision } from "@/lib/ops/generation/supervisor";
import { memorySink } from "@/lib/ops/generation/sinks";
import { deferUntil, INTERIM_AFTER_MS, judgeBuild, nextRetryAt, RETRY_WINDOW_MS } from "@/lib/ops/generation/policy";
import { RAW_FULL, mockTextFor } from "../../helpers/v5Scenarios";
import { ANTHROPIC_CREDIT, ANTHROPIC_OVERLOADED, OPENAI_QUOTA, fakeClock, memoryOpsStore, mockAnthropic, mockOpenAiWithBody, routedFetch, type AnthropicBehavior } from "../../helpers/opsMocks";
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
  it("재시도 간격 1분·5분·15분·1시간·3시간·6시간, 첫 실패 + 24시간이 끝", () => {
    const t0 = 0, steps: number[] = [];
    let now = t0, failures = 0;
    for (;;) { failures++; const n = nextRetryAt(t0, failures, now); if (n === null) break; steps.push(n - now); now = n; }
    expect(steps.slice(0, 6)).toEqual([1, 5, 15, 60, 180, 360].map(m => m * MIN));
    expect(now).toBe(t0 + RETRY_WINDOW_MS); // 마지막 시도는 정확히 24시간째
    // OpenAI를 쓸 수 있으면 2시간에 맞춰 한 번 깨운다(임시본).
    expect(deferUntil({ firstFailureAt: 0, failures: 5, now: 81 * MIN, interimPossible: true })).toBe(INTERIM_AFTER_MS);
    expect(deferUntil({ firstFailureAt: 0, failures: 5, now: 81 * MIN, interimPossible: false })).toBe(261 * MIN);
  });
});

describe("출력 전 실패·중간 끊김(같은 시도 안)", () => {
  it("429 두 번 → 재시도 → Sonnet 정식본", async () => {
    const h = harness([{ status: 429 }, { status: 429 }, { text }]);
    const d = await h.run();
    expect(d.kind).toBe("publish"); expect(d.kind === "publish" && d.edition).toBe("official");
    expect(d.kind === "publish" && d.meta.writer).toEqual({ provider: "anthropic", model: "claude-sonnet-5-5" });
    expect(h.a.calls.length).toBeGreaterThanOrEqual(3); expect(h.o.calls).toHaveLength(0); // terra 대체 없음(뒤 호출은 P6c 수리 1회)
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

  it("이어쓰기도 실패 → 결정론으로 채우지 않고 1분 보류 → 다음 시도는 빠진 장만", async () => {
    const h = harness([{ text, cutAt: cutAt(7) }, ANTHROPIC_OVERLOADED]);
    const d1 = await h.run();
    expect(d1.kind).toBe("defer");
    expect(Date.parse((d1 as { until: string }).until) - h.decisions[0].at).toBe(1 * MIN);
    h.clock.advanceTo(Date.parse((d1 as { until: string }).until));
    h.setAnthropic([{ text: from(6) }]);
    const d2 = await h.run();
    expect(d2.kind).toBe("publish");
    // 첫 호출 없이 이어쓰기로 시작(뒤는 P6c 수리 호출뿐).
    const kinds = ((h.ops.runs.at(-1) as { calls: { kind: string }[] }).calls).map(c => c.kind);
    expect(kinds[0]).toBe("continuation"); expect(kinds).not.toContain("first");
    expect(h.ops.states.get(h.job.reportId)!.failures).toBe(1);
  }, 120_000);

  it("인증 실패(401) → 결정론 원고는 내보내지 않는다(보류)", async () => {
    const h = harness([{ status: 401 }]);
    const d = await h.run();
    expect(d.kind).toBe("defer");
    expect(h.decisions.some(x => x.d.kind === "publish")).toBe(false);
  }, 60_000);
});

describe("Anthropic 24시간 장애", () => {
  it("OpenAI 정상: 2시간에 임시본(terra) 공개 → 교체 레인이 24시간까지 Sonnet 재시도 → 실패하면 임시본 유지", async () => {
    const h = harness([ANTHROPIC_OVERLOADED], [{ text }]);
    let d = await h.run();
    const first = h.decisions[0].at;
    while (d.kind === "defer") { h.clock.advanceTo(Date.parse(d.until)); d = await h.run(); }
    expect(d.kind).toBe("publish"); expect(d.kind === "publish" && d.edition).toBe("interim");
    expect(d.kind === "publish" && d.meta.writer?.provider).toBe("openai");
    const defers = h.decisions.filter(x => x.d.kind === "defer");
    expect(defers).toHaveLength(5); // 1분·5분·15분·1시간 뒤, 그리고 2시간째로 맞춘 깨움
    const interimAt = h.decisions.at(-1)!.at;
    expect(interimAt - first).toBeGreaterThanOrEqual(2 * HOUR); expect(interimAt - first).toBeLessThan(2 * HOUR + 15 * MIN);
    const s = h.ops.states.get(h.job.reportId)!;
    expect(s.phase).toBe("interim");
    // 교체 레인: 다음 시각마다 Sonnet. 24시간이 지나면 멈춘다.
    let lane = 0;
    while (h.ops.states.get(h.job.reportId)!.next_at) { h.clock.advanceTo(Date.parse(h.ops.states.get(h.job.reportId)!.next_at!)); const r = await runLaneBatch(h.env, { maxJobs: 1 }); expect(r.processed).toBe(1); lane++; if (lane > 20) throw new Error("loop"); }
    expect(lane).toBeGreaterThanOrEqual(4);
    expect(h.clock.now() - first).toBeLessThanOrEqual(RETRY_WINDOW_MS + 15 * MIN);
    const end = h.ops.states.get(h.job.reportId)!;
    expect(end.phase).toBe("interim"); expect(end.gave_up_at).not.toBeNull();
    expect((h.ops.runs.at(-1) as { outcome: string }).outcome).toBe("gave_up");
    expect(h.ops.versions).toHaveLength(0); // 정식본이 없었으니 교체도 없다
  }, 600_000);

  it("장애가 풀리면 교체 레인이 정식본으로 바꾸고 임시본을 보관한다", async () => {
    const h = harness([ANTHROPIC_OVERLOADED], [{ text }]);
    let d = await h.run();
    while (d.kind === "defer") { h.clock.advanceTo(Date.parse(d.until)); d = await h.run(); }
    expect(d.kind === "publish" && d.edition).toBe("interim");
    h.setAnthropic([{ text }]);
    h.clock.advanceTo(Date.parse(h.ops.states.get(h.job.reportId)!.next_at!));
    expect((await runLaneBatch(h.env, { maxJobs: 1 })).processed).toBe(1);
    const s = h.ops.states.get(h.job.reportId)!;
    expect(s.phase).toBe("official"); expect(h.ops.versions).toEqual([{ reportId: h.job.reportId, edition: "interim" }]);
    expect((h.ops.snapshots.get(h.job.reportId)!.evidencePacket as { meta: { writer: { provider: string } } }).meta.writer.provider).toBe("anthropic");
    expect((h.ops.runs.at(-1) as { outcome: string; lane: string }).outcome).toBe("replaced");
  }, 600_000);
});

describe("OpenAI 잔액 부족", () => {
  it("잔액 부족 오류를 보면 OpenAI 경로를 끄고, 임시본 없이 24시간 뒤 포기한다(결제 경로는 자동 환불로 이어짐)", async () => {
    const h = harness([ANTHROPIC_CREDIT], [OPENAI_QUOTA]);
    let d = await h.run();
    const first = h.decisions[0].at;
    while (d.kind === "defer") { h.clock.advanceTo(Date.parse(d.until)); d = await h.run(); }
    expect(d.kind).toBe("give_up");
    expect(h.ops.providers.openai.disabledAt).not.toBeNull(); expect(h.ops.providers.openai.reason).toBe("insufficient_quota");
    expect(h.o.calls).toHaveLength(1); // 꺼진 뒤로는 OpenAI를 부르지 않는다
    expect(h.decisions.some(x => x.d.kind === "publish")).toBe(false);
    expect(h.clock.now() - first).toBeGreaterThanOrEqual(RETRY_WINDOW_MS - MIN);
    expect(h.ops.runs.some(r => String((r as { reason: string }).reason).includes("anthropic_credit"))).toBe(true);
    expect(h.ops.states.get(h.job.reportId)!.phase).toBe("gave_up");
  }, 600_000);

  it("OpenAI 키가 없으면 2시간이 지나도 임시본을 만들지 않는다", async () => {
    const h = harness([ANTHROPIC_OVERLOADED], [{ text }], { openAiKey: null });
    let d = await h.run(), n = 0;
    while (d.kind === "defer" && n++ < 6) { h.clock.advanceTo(Date.parse(d.until)); d = await h.run(); }
    expect(h.o.calls).toHaveLength(0); expect(h.decisions.some(x => x.d.kind === "publish")).toBe(false);
  }, 600_000);
});

describe("판정", () => {
  it("결정론 장이 있으면 incomplete, 짧은 장은 rejected(다음 시도에서 다시 쓴다)", () => {
    const meta = { chapters: [{ n: 1, source: "writer" }, { n: 2, source: "deterministic", reason: "too_short:100<600" }, { n: 3, source: "deterministic", reason: "missing" }], calls: [{ chars: 10, error: undefined }] };
    const v = judgeBuild({ meta: meta as never, run: { stale: false, calls: meta.calls } as never });
    expect(v).toMatchObject({ kind: "incomplete", rejected: [2], missing: [3], preOutput: false });
    expect(judgeBuild({ meta: { chapters: [{ n: 1, source: "writer", reason: "keys_filled:2026" }], calls: [] } as never, run: null })).toEqual({ kind: "complete", keysFilled: [1] });
  });
});
