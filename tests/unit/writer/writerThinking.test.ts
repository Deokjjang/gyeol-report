// HOTFIX-W1 5부: 작가 「생각만 하다 본문 0자」 고침 — 출력 한도 공식·생각 소진 분류·이어 쓰기·사다리·주문 비용 상한·같은 호출 재반복 금지·
// 보류 즉시 알림·실패율 경보·관측 기록. 모두 목업(비용 0).
import { describe, expect, it } from "vitest";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { superviseQueueJob, type Decision } from "@/lib/ops/generation/supervisor";
import { memorySink } from "@/lib/ops/generation/sinks";
import { ladderOf, orderCostCap, regenerateNowCheck } from "@/lib/ops/generation/policy";
import { failureLine, generationLineOf, holdText, rateAlert, type GenerationAlerts, type RunLite } from "@/lib/ops/generation/alerts";
import { streamCompletion } from "@/lib/llm";
import { classifyCall, MODEL_OUTPUT_CAP, maxTokensFor, runWriter, THINKING_RESERVE_TOKENS, writerLimit, type SavedChapter } from "@/lib/writer/runner";
import { buildWriterPrompt } from "@/lib/writer/prompt";
import { RAW_FULL, mockTextFor } from "../../helpers/v5Scenarios";
import { fakeClock, memoryOpsStore, mockAnthropic, mockOpenAiWithBody, routedFetch } from "../../helpers/opsMocks";

const policyAt = "2026-10-27T03:00:00.000Z";
const input = (() => { const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date(policyAt) }); if (!n.ok) throw new Error("payload"); return n.value; })();
const { brief, text } = mockTextFor(input, policyAt);
const plan = buildWriterPrompt(brief).chapters;
const SONNET = "claude-sonnet-5-5";

/** Anthropic 스트림 목업: thinking 블록(서명만, omitted라 0자) + 텍스트. thinkingTokens만큼 출력 토큰을 쓴 것으로 보고, max_tokens에 닿으면 max_tokens로 끝낸다. */
function thinkingAnthropic(script: { thinking: number; text?: string }[]) {
  const calls: { body: Record<string, unknown> }[] = [];
  const impl = async (_u: string | URL | Request, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body ?? "{}")) as Record<string, unknown>;
    const b = script[Math.min(calls.length, script.length - 1)];
    calls.push({ body });
    const max = Number(body.max_tokens), enc = new TextEncoder();
    const ev = (event: string, o: unknown) => enc.encode(`event: ${event}\ndata: ${JSON.stringify(o)}\n\n`);
    const words = b.text ?? "";
    const textTokens = Math.ceil(words.length * 1.1), thinkingCut = b.thinking >= max;
    const stream = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(ev("message_start", { type: "message_start", message: { usage: { input_tokens: 20_000, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } } }));
        c.enqueue(ev("content_block_start", { type: "content_block_start", index: 0, content_block: { type: "thinking", thinking: "", signature: "" } }));
        c.enqueue(ev("content_block_delta", { type: "content_block_delta", index: 0, delta: { type: "thinking_delta", thinking: "" } }));
        c.enqueue(ev("content_block_delta", { type: "content_block_delta", index: 0, delta: { type: "signature_delta", signature: "sig" } }));
        c.enqueue(ev("content_block_stop", { type: "content_block_stop", index: 0 }));
        let out = Math.min(b.thinking, max);
        let sent = "";
        if (!thinkingCut && words) {
          c.enqueue(ev("content_block_start", { type: "content_block_start", index: 1, content_block: { type: "text", text: "" } }));
          const room = max - out, chars = Math.min(words.length, Math.floor(room / 1.1));
          sent = words.slice(0, chars);
          for (let i = 0; i < sent.length; i += 400) c.enqueue(ev("content_block_delta", { type: "content_block_delta", index: 1, delta: { type: "text_delta", text: sent.slice(i, i + 400) } }));
          out += Math.ceil(sent.length * 1.1);
        }
        const cut = out >= max || (sent.length < words.length);
        c.enqueue(ev("message_delta", { type: "message_delta", delta: { stop_reason: cut ? "max_tokens" : "end_turn" }, usage: { output_tokens: cut ? max : out } }));
        c.enqueue(ev("message_stop", { type: "message_stop" }));
        c.close();
        void textTokens;
      },
    });
    return new Response(stream, { status: 200, headers: { "content-type": "text/event-stream", "request-id": `t-${calls.length}` } });
  };
  return { fetch: impl as typeof fetch, calls };
}

const sink = () => { const m = new Map<number, SavedChapter>(); return { m, async save(c: SavedChapter) { m.set(c.n, c); return true; }, async load() { return [...m.values()]; } }; };

describe("1부 관측: 블록 종류·글자·stop_reason·보낸 설정·첫 본문 시각(생각 내용 없음)", () => {
  it("thinking 블록 하나가 max_tokens를 다 쓰면: 본문 0자, stop=max_tokens, blocks.thinking 1개·0자, sent=between_tools", async () => {
    const m = thinkingAnthropic([{ thinking: 999_999 }]);
    const r = await streamCompletion({ provider: "anthropic", model: SONNET, system: "s", user: "u", maxOutputTokens: 25_183, timeoutMs: 10_000, apiKey: "k", fetchImpl: m.fetch });
    expect(r.text).toBe(""); expect(r.finishReason).toBe("length");
    expect(r.observed).toMatchObject({ stop: "max_tokens", sent: { maxTokens: 25_183, thinking: "between_tools", effort: null }, firstTextMs: null });
    expect(r.observed?.blocks).toEqual({ thinking: { n: 1, chars: 0 } });
    expect(r.usage.outputTokens).toBe(25_183);
    expect(classifyCall(r)).toBe("thinking_exhausted");
  });
  it("생각 뒤 본문이 오면 첫 본문 시각과 text 글자를 남긴다", async () => {
    const m = thinkingAnthropic([{ thinking: 1_000, text: "## 1. 장\n### 소제목\n문단이에요.\n" }]);
    const r = await streamCompletion({ provider: "anthropic", model: SONNET, system: "s", user: "u", maxOutputTokens: 60_000, timeoutMs: 10_000, apiKey: "k", fetchImpl: m.fetch });
    expect(r.finishReason).toBe("complete"); expect(r.observed?.stop).toBe("end_turn");
    expect(r.observed?.blocks.text).toEqual({ n: 1, chars: r.text.length }); expect(r.observed?.firstTextMs).not.toBeNull();
    expect(classifyCall(r)).toBeUndefined();
  });
});

describe("2부 출력 한도 공식(본문 추정 + 생각 여유, 모델 상한·시간·비용으로 깎기)", () => {
  const s = (o: Record<string, unknown> = {}) => ({ o: { brief, provider: "anthropic" as const, model: SONNET, sink: sink(), ...o }, target: { provider: "anthropic" as const, model: SONNET }, cost: 0, started: Date.now() });
  it("1단 = 본문 추정 + 36,000, 2단 = 모델 상한 128K(문서) — 단 남은 시간 안에 받을 수 있는 만큼(이용권·레인 700초면 76,250)", () => {
    const body = maxTokensFor(plan, SONNET);
    expect(MODEL_OUTPUT_CAP[SONNET]).toBe(128_000);
    expect(writerLimit(s(), plan, 1, 30_000)).toEqual({ maxTokens: body + THINKING_RESERVE_TOKENS, body });
    expect(writerLimit(s({ budgetMs: 2_000_000 }), plan, 2, 30_000)).toEqual({ maxTokens: 128_000, body });
    expect(writerLimit(s(), plan, 2, 30_000).maxTokens).toBeLessThanOrEqual(Math.floor((700_000 - 90_000) / 1000 * 125));
  });
  it("결제 경로 480초: 검수·수리 90초를 남긴 시간(125토큰/초)으로 깎는다 — 함수 시간 제한 안에 끝나게", () => {
    const body = maxTokensFor(plan, SONNET);
    const r = writerLimit(s({ budgetMs: 480_000 }), plan, 2, 30_000);
    expect(r.maxTokens).toBe(Math.floor((480_000 - 90_000) / 1000 * 125)); expect(r.maxTokens).toBeGreaterThan(body);
  });
  it("비용: 최악 비용(입력 + 한도)이 남은 예산(검수·수리 몫 뺀 값)을 넘지 않게 깎고, 본문도 못 쓰면 부르지 않는다", () => {
    const body = maxTokensFor(plan, SONNET), inUsd = Math.ceil(30_000 * 1.1) * 2.5 / 1e6;
    const r = writerLimit(s({ costCapUsd: 0.5, postReserveUsd: 0.1 }), plan, 1, 30_000);
    expect(r.maxTokens).toBe(Math.floor((0.5 - 0.1 - inUsd) * 1e6 / 10));
    expect(writerLimit(s({ costCapUsd: 0.2, postReserveUsd: 0.1 }), plan, 1, 30_000)).toEqual({ maxTokens: 0, body, reason: "cost_cap" });
  });
});

describe("2부 생각 소진 분류", () => {
  const r = (finishReason: "complete" | "length" | "error" | "timeout", t: string, extra: Record<string, unknown> = {}) => ({ text: t, finishReason, ...extra });
  it("length + 본문 0자 / length + 장 빠짐 / 시간 초과 + 0자 + 생각 블록 = 생각 소진, 연결 오류 = 연결", () => {
    expect(classifyCall(r("length", ""))).toBe("thinking_exhausted");
    expect(classifyCall(r("length", "## 1. a"), 3)).toBe("thinking_exhausted");
    expect(classifyCall(r("length", "고친 문단"), 0)).toBeUndefined(); // 뒤 호출(수리)의 잘린 응답은 받는다
    expect(classifyCall(r("timeout", "", { error: { code: "timeout", message: "" }, observed: { stop: null, sent: { maxTokens: 1, thinking: null, effort: null }, blocks: { thinking: { n: 1, chars: 0 } }, firstTextMs: null } }))).toBe("thinking_exhausted");
    expect(classifyCall(r("error", "", { error: { code: "http_529", message: "" } }))).toBe("connection");
    expect(classifyCall(r("error", "", { error: { code: "http_401", message: "" } }))).toBe("other");
  });
});

describe("2부 사다리·이어 쓰기(작가 실행기)", () => {
  it("1단 생각 소진(0자) → 같은 시도에서 2단(모델 상한)으로 → 완성. 두 호출 모두 between_tools(품질 낮추는 단계 없음)", async () => {
    const m = thinkingAnthropic([{ thinking: 999_999 }, { thinking: 40_000, text }]);
    const r = await runWriter({ brief, provider: "anthropic", model: SONNET, sink: sink(), apiKey: "k", fetchImpl: m.fetch, sleep: async () => undefined });
    expect(r.calls.map(c => [c.kind, c.stage, c.cls ?? null])).toEqual([["first", 1, "thinking_exhausted"], ["first", 2, null]]);
    const [t1, t2] = m.calls.map(c => Number(c.body.max_tokens));
    expect(t1).toBe(maxTokensFor(plan, SONNET) + THINKING_RESERVE_TOKENS); expect(t2).toBeGreaterThan(t1 * 1.1); expect(t2).toBeLessThanOrEqual(76_250);
    expect(m.calls.every(c => JSON.stringify(c.body.thinking) === JSON.stringify({ type: "between_tools" }) && !("output_config" in c.body))).toBe(true);
    expect(r.drafts.size).toBe(plan.length); expect(r.exhausted).toBe(1); expect(r.ladderEnd).toBe(false);
  });
  it("2단도 생각 소진이면 더 부르지 않는다(사다리 끝)", async () => {
    const m = thinkingAnthropic([{ thinking: 999_999 }]);
    const r = await runWriter({ brief, provider: "anthropic", model: SONNET, sink: sink(), apiKey: "k", fetchImpl: m.fetch, sleep: async () => undefined });
    expect(m.calls).toHaveLength(2); expect(r.exhausted).toBe(2); expect(r.ladderEnd).toBe(true); expect(r.drafts.size).toBe(0);
  });
  it("length로 끊긴 책: 끝까지 쓴 장은 저장, 다음 호출은 빠진 장만(설계도 전체 + 이미 쓴 장 원문) 2단으로", async () => {
    const cut = text.indexOf("## 7. ");
    const m = thinkingAnthropic([{ thinking: 0, text: text.slice(0, cut + 30) }, { thinking: 0, text: mockTextFor(input, policyAt).text.slice(cut) }]);
    // 1단 한도를 본문 앞부분만 쓸 만큼으로 줄여 잘림을 만든다(운영·시험 상한).
    const sk = sink();
    const r = await runWriter({ brief, provider: "anthropic", model: SONNET, sink: sk, apiKey: "k", fetchImpl: m.fetch, sleep: async () => undefined, maxOutputTokens: Math.ceil((cut + 30) * 1.1) });
    expect(r.calls[0]).toMatchObject({ kind: "first", stage: 1, cls: "thinking_exhausted" });
    expect(r.calls[1]).toMatchObject({ kind: "continuation", stage: 2 });
    const user = String((m.calls[1].body.messages as { content: string }[])[0].content);
    expect(user).toContain("남은 장만 이어서"); expect(user).toContain("전체 13장의 장 목록"); expect(user).toContain(`## 1. ${plan[0].title}`);
    // 이미 쓴 장은 요약이 아니라 원문(첫 장 첫 문단이 그대로)
    const firstPara = sk.m.get(1)!.chapter.sections[0].paragraphs[0];
    expect(user).toContain(firstPara.slice(0, 60));
    expect([...sk.m.keys()].sort((a, b) => a - b).slice(0, 6)).toEqual([1, 2, 3, 4, 5, 6]);
  });
  it("지난 시도에서 0자 소진한 한도보다 1.1배 이상 크지 않으면 같은 호출을 되풀이하지 않는다(no_headroom)", async () => {
    const m = thinkingAnthropic([{ thinking: 0, text }]);
    const r = await runWriter({ brief, provider: "anthropic", model: SONNET, sink: sink(), apiKey: "k", fetchImpl: m.fetch, startStage: 2, exhaustedMaxTokens: 50_000, budgetMs: 480_000 });
    expect(m.calls).toHaveLength(0); expect(r.ladderEnd).toBe(true); expect(r.calls.at(-1)).toMatchObject({ error: "no_headroom", stage: 2 });
  });
});

describe("2부 지난 기록 → 사다리 시작(같은 단계 반복 금지)", () => {
  it("옛 기록(분류 없음, length·0자 5회 — GR-6AA2 꼴)은 옛 한도(0단)로 보고 1단부터, 1단 소진이면 2단, 2단 소진이면 끝", () => {
    const old = Array.from({ length: 5 }, (_, i) => ({ cost_usd: 0.301588, created_at: `2026-11-13T08:${20 + i}:00Z`, calls: [{ kind: "first", model: SONNET, finish: "length", chars: 0, costUsd: 0.301588 }] }));
    expect(ladderOf(old, SONNET)).toEqual({ startStage: 1, exhaustedMaxTokens: 0, end: false });
    const s1 = [...old, { cost_usd: 0.6, created_at: "2026-11-13T10:00:00Z", calls: [{ kind: "first", model: SONNET, finish: "length", chars: 0, stage: 1, cls: "thinking_exhausted", maxTokens: 61_183 }] }];
    expect(ladderOf(s1, SONNET)).toEqual({ startStage: 2, exhaustedMaxTokens: 61_183, end: false });
    const s2 = [...s1, { cost_usd: 0.6, created_at: "2026-11-13T11:00:00Z", calls: [{ kind: "first", model: SONNET, finish: "length", chars: 0, stage: 2, cls: "thinking_exhausted", maxTokens: 128_000 }] }];
    expect(ladderOf(s2, SONNET).end).toBe(true);
    // 임시본(terra) 호출은 정식본 사다리에 세지 않는다.
    expect(ladderOf([{ calls: [{ kind: "first", model: "gpt-6.1-terra", finish: "length", chars: 0 }] }], SONNET)).toEqual({ startStage: 1, exhaustedMaxTokens: 0, end: false });
  });
});

describe("2부 6·3부 3: 주문 비용 상한과 보류 즉시 알림", () => {
  const harness = (anthropic: { fetch: typeof fetch; calls: unknown[] }) => {
    const clock = fakeClock(), ops = memoryOpsStore(clock), o = mockOpenAiWithBody([{ text }]);
    const held: Parameters<GenerationAlerts["hold"]>[0][] = [], failed: Parameters<GenerationAlerts["failed"]>[0][] = [];
    const env = { store: ops.store, now: clock.now, openAiKey: null, alerts: { hold: async (a: Parameters<GenerationAlerts["hold"]>[0]) => { held.push(a); }, failed: async (a: Parameters<GenerationAlerts["failed"]>[0]) => { failed.push(a); } },
      deps: { fetchImpl: routedFetch(anthropic, o), sleep: clock.sleep, now: clock.now, apiKey: "k", people: async () => [] } };
    const job = { reportId: "report_w1_hold_0000001", origin: "paid" as const, originRef: "po_w1", payload: input, policyAt, sink: memorySink(), budgetMs: 700_000 };
    const run = async () => (await superviseQueueJob(job, env, async (d: Decision) => ({ ok: true, ...(d.kind === "publish" ? {} : {}) }))).decision;
    return { clock, ops, held, failed, run, job };
  };
  it("1단·2단 모두 생각 소진 → 그 시도에서 보류 + 즉시 알림(분류·단계·비용 한 줄), 보류 기한 = 첫 실패 + 6시간", async () => {
    const m = thinkingAnthropic([{ thinking: 999_999 }]);
    const h = harness(m);
    const d = await h.run();
    // 비용 상한(종합 $0.95) 안에서 1단(약 6.5만) 소진 뒤 2단은 예산이 모자라 부르지 않고(cost_cap) 보류.
    expect(d.kind).toBe("hold");
    expect(m.calls.length).toBeLessThanOrEqual(2);
    expect(h.held).toHaveLength(1); expect(h.held[0].line).toMatch(/^(생각 소진|비용 상한) · \d단 · 다음 자동 시도 없음 · 지금까지 \$0\.\d\d\(상한 \$0\.95\)$/);
    expect(d.kind === "hold" && Date.parse(d.until) - h.clock.now()).toBe(6 * 3_600_000);
    expect(h.failed).toHaveLength(1);
    const spent = (h.ops.runs as { costUsd?: number }[]).reduce((a, r) => a + (r.costUsd ?? 0), 0);
    expect(spent).toBeLessThanOrEqual(orderCostCap("saju_mbti_full"));
  });
  it("보류 기한이 지나 다시 잡히면 더 부르지 않고 포기(자동 환불 경로)", async () => {
    const m = thinkingAnthropic([{ thinking: 999_999 }]);
    const h = harness(m);
    const d = await h.run();
    expect(d.kind).toBe("hold");
    const before = m.calls.length;
    h.clock.advanceTo(Date.parse((d as { until: string }).until) + 1_000);
    const d2 = await h.run();
    expect(d2.kind).toBe("give_up"); expect(m.calls.length).toBe(before);
  });
  it("정상 책은 1단 한 번으로 발행(검수·수리 예산이 남는다)", async () => {
    const a = mockAnthropic([{ text }, { text: JSON.stringify({ issues: [] }) }]);
    const h = harness(a);
    const d = await h.run();
    expect(d.kind).toBe("publish"); expect(h.held).toHaveLength(0);
    const writer = (a.calls[0].body as { max_tokens: number }).max_tokens;
    expect(writer).toBe(maxTokensFor(plan, SONNET) + THINKING_RESERVE_TOKENS);
  });
});

describe("3부 알림 문구·실패율 경보·다시 만들기 판단", () => {
  it("실패 한 줄: 분류 · 단계 · 다음 자동 시도(KST) · 지금까지 비용", () => {
    expect(failureLine({ cls: "thinking_exhausted", stage: 1, nextAt: "2026-11-13T09:01:00Z", spentUsd: 0.6631, capUsd: 0.85 })).toBe("생각 소진 · 1단 · 다음 자동 시도 11-13 18:01 · 지금까지 $0.66(상한 $0.85)");
    expect(failureLine({ cls: "connection", stage: null, nextAt: null, spentUsd: 0 })).toBe("연결 · 단계 없음 · 다음 자동 시도 없음 · 지금까지 $0.00");
    // 옛 기록(GR-6AA2 꼴)에서 만든 줄.
    const old = Array.from({ length: 5 }, () => ({ outcome: "deferred", cost_usd: 0.301588, created_at: "2026-11-13T08:20:00Z", reason: "official:pre_output:missing:1,2", calls: [{ kind: "first", finish: "length", chars: 0 }] }));
    expect(generationLineOf(old, { next_at: "2026-11-13T13:58:00Z" }, "love_marriage_child")).toBe("생각 소진 · 옛 한도 · 다음 자동 시도 11-13 22:58 · 지금까지 $1.51(상한 $0.85)");
    expect(holdText({ orderCode: "GR-TEST", origin: "paid", product: "love_marriage_child", line: "생각 소진 · 2단", why: "생각 소진이 사다리 끝까지 — 환불 또는 대기 결정" })).toContain("보류 — 환불 또는 대기 결정 필요");
  });
  it("실패율 경보: 같은 상품 1시간 안 생각 소진이 2건이 되는 순간 1번, 하루 실패율 30%를 넘는 순간 1번", () => {
    const t = Date.parse("2026-11-13T09:00:00Z"), day = Date.parse("2026-11-12T15:00:00Z");
    const ex = (id: string, min: number, product = "love_marriage_child"): RunLite => ({ report_id: id, outcome: "deferred", created_at: new Date(t - min * 60_000).toISOString(), calls: [{ cls: "thinking_exhausted" }], product });
    const ok = (id: string, min: number): RunLite => ({ report_id: id, outcome: "published", created_at: new Date(t - min * 60_000).toISOString(), calls: [], product: "love_marriage_child" });
    expect(rateAlert([ex("a", 30)], ex("a", 30), t, day)).toBeNull();
    const two = [ex("a", 30), ex("b", 0)];
    expect(rateAlert(two, two[1], t, day)).toContain("최근 1시간 생각 소진 2건");
    const three = [...two, ex("c", 0)];
    expect(rateAlert(three, three[2], t, day) ?? "").not.toContain("1시간"); // 세 번째에는 다시 보내지 않는다
    expect(rateAlert([ex("a", 30, "saju_mbti_full"), ex("b", 0)], ex("b", 0), t, day)).toBeNull(); // 다른 상품은 세지 않는다
    const daily = [ok("p1", 300), ok("p2", 290), ok("p3", 280), ok("p4", 270), { ...ex("f1", 200), calls: [] }, { ...ex("f2", 100), calls: [] }, { ...ex("f3", 0), calls: [] }];
    expect(rateAlert(daily, daily.at(-1)!, t, day)).toContain("오늘 실패율 43%(실패 3 / 시도 7)");
  });
  it("다시 만들기(만드는 중): 상한 안이면 다음 단계, 상한·사다리 끝이면 거절 문구", () => {
    expect(regenerateNowCheck({ runs: [], product: "saju_mbti_full" })).toMatchObject({ ok: true, stage: 1, capUsd: 0.95 });
    const gr = Array.from({ length: 5 }, () => ({ cost_usd: 0.301588, calls: [{ kind: "first", finish: "length", chars: 0 }] }));
    expect(regenerateNowCheck({ runs: gr, product: "love_marriage_child" })).toMatchObject({ ok: false, code: "COST_CAP" });
    expect((regenerateNowCheck({ runs: gr, product: "love_marriage_child" }) as { message: string }).message).toMatch(/^비용 상한 — 환불 판단 필요/);
    const end = [{ cost_usd: 0.1, calls: [{ kind: "first", model: SONNET, cls: "thinking_exhausted", stage: 2, chars: 0, maxTokens: 128_000 }] }];
    expect(regenerateNowCheck({ runs: end, product: "saju_mbti_full" })).toMatchObject({ ok: false, code: "THINKING_END" });
  });
});
