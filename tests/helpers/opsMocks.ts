/**
 * P6d-ops 실패 주입(비용 0): Anthropic·OpenAI 스트림 목업(주소로 갈라 보냄), 메모리 감독 저장소, 가짜 시계.
 */
import type { OpsStore } from "@/lib/ops/generation/sinks";
import { mockOpenAi, type MockBehavior } from "./llmMock";

export type AnthropicBehavior = MockBehavior & { body?: string };
export const ANTHROPIC_OVERLOADED: AnthropicBehavior = { status: 529, body: JSON.stringify({ type: "error", error: { type: "overloaded_error", message: "Overloaded" } }) };
export const ANTHROPIC_CREDIT: AnthropicBehavior = { status: 400, body: JSON.stringify({ type: "error", error: { type: "invalid_request_error", message: "Your credit balance is too low to access the Anthropic API." } }) };
export const OPENAI_QUOTA: MockBehavior & { body?: string } = { status: 429, body: JSON.stringify({ error: { message: "You exceeded your current quota, please check your plan and billing details.", type: "insufficient_quota", code: "insufficient_quota" } }) };

/** Anthropic Messages 스트림 목업. 호출마다 behaviors를 차례로(끝 값 반복). */
export function mockAnthropic(behaviors: AnthropicBehavior[]) {
  const calls: { body: Record<string, unknown> }[] = [];
  const impl = async (_url: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const b = behaviors[Math.min(calls.length, behaviors.length - 1)];
    calls.push({ body: JSON.parse(String(init?.body ?? "{}")) });
    if (b.status) return new Response(b.body ?? JSON.stringify({ type: "error", error: { type: "api_error", message: `mock ${b.status}` } }), { status: b.status, headers: { "request-id": `amock-${calls.length}` } });
    const text = b.text ?? "", enc = new TextEncoder(), signal = init?.signal;
    const ev = (event: string, o: unknown) => enc.encode(`event: ${event}\ndata: ${JSON.stringify(o)}\n\n`);
    const body = new ReadableStream<Uint8Array>({
      async start(c) {
        signal?.addEventListener("abort", () => c.error(new Error("aborted")), { once: true });
        c.enqueue(ev("message_start", { type: "message_start", message: { usage: { input_tokens: 12_000, output_tokens: 1 } } }));
        const end = b.cutAt ?? text.length;
        for (let i = 0; i < end; i += 200) {
          if (signal?.aborted) return;
          c.enqueue(ev("content_block_delta", { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: text.slice(i, Math.min(end, i + 200)) } }));
          await new Promise(r => setTimeout(r, 0));
        }
        if (b.hang) return;
        if (b.cutAt !== undefined) { c.error(new Error("socket hang up")); return; }
        c.enqueue(ev("message_delta", { type: "message_delta", delta: { stop_reason: b.finish === "incomplete" ? "max_tokens" : "end_turn" }, usage: { output_tokens: Math.ceil(text.length / 1.13) } }));
        c.enqueue(ev("message_stop", { type: "message_stop" }));
        c.close();
      },
    });
    return new Response(body, { status: 200, headers: { "content-type": "text/event-stream", "request-id": `amock-${calls.length}` } });
  };
  return { fetch: impl as typeof fetch, calls };
}

/** OpenAI 목업에 오류 본문(잔액 부족 등)을 넣을 수 있게 감싼다. */
export function mockOpenAiWithBody(behaviors: (MockBehavior & { body?: string })[]) {
  const inner = mockOpenAi(behaviors);
  let n = 0;
  const impl = async (url: string | URL | Request, init?: RequestInit) => {
    const b = behaviors[Math.min(n++, behaviors.length - 1)];
    if (b.status && b.body) { inner.calls.push({ body: JSON.parse(String(init?.body ?? "{}")) }); return new Response(b.body, { status: b.status }); }
    return inner.fetch(url, init);
  };
  return { fetch: impl as typeof fetch, calls: inner.calls };
}

/** 주소로 공급자를 가른다(작가 어댑터가 부르는 엔드포인트). */
export function routedFetch(anthropic: { fetch: typeof fetch }, openai: { fetch: typeof fetch }): typeof fetch {
  return (async (url: string | URL | Request, init?: RequestInit) => (String(url instanceof Request ? url.url : url).includes("anthropic") ? anthropic.fetch : openai.fetch)(url, init)) as typeof fetch;
}

/** 가짜 시계: sleep이 시간을 앞으로 민다(작가 재시도 대기·시간 예산이 실제로 줄어든다). */
export function fakeClock(start = Date.parse("2026-11-04T00:00:00.000Z")) {
  const c = { t: start, now: () => c.t, sleep: async (ms: number) => { c.t += ms; }, advanceTo: (t: number) => { c.t = Math.max(c.t, t); } };
  return c;
}

type State = { report_id: string; origin: string; origin_ref: string; phase: string; first_attempt_at: string; first_failure_at: string | null; failures: number; next_at: string | null; rejected_chapters: number[];
  lane_token: string | null; lane_until: number | null; regenerate_requested_at: string | null; interim_at: string | null; official_at: string | null; gave_up_at: string | null; last_reason: string | null };
/** ops_generation과 같은 동작의 메모리 저장소(가짜 시계 기준). 24시간 시험용. */
export function memoryOpsStore(clock: { now: () => number }, snapshots = new Map<string, Record<string, unknown>>()) {
  const states = new Map<string, State>(), runs: Record<string, unknown>[] = [], chapters = new Map<string, Map<number, unknown>>(), versions: { reportId: string; edition: string }[] = [];
  const providers: Record<string, { disabledAt: string | null; reason: string | null }> = { anthropic: { disabledAt: null, reason: null }, openai: { disabledAt: null, reason: null } };
  const iso = () => new Date(clock.now()).toISOString();
  const store: OpsStore = {
    async call(action, d) {
      const id = String(d.reportId ?? "");
      if (action === "begin") { if (!states.has(id)) states.set(id, { report_id: id, origin: String(d.origin), origin_ref: String(d.originRef), phase: "pending", first_attempt_at: iso(), first_failure_at: null, failures: 0, next_at: null, rejected_chapters: [], lane_token: null, lane_until: null, regenerate_requested_at: null, interim_at: null, official_at: null, gave_up_at: null, last_reason: null }); return { ok: true, state: { ...states.get(id) } }; }
      if (action === "provider") return { ok: true, providers };
      if (action === "provider_set") { providers[String(d.provider)] = d.disabled ? { disabledAt: iso(), reason: String(d.reason) } : { disabledAt: null, reason: null }; return { ok: true }; }
      if (action === "record") {
        const s = states.get(id); if (!s) return { ok: false };
        runs.push({ reportId: id, at: iso(), ...(d.run as object) });
        const p = (d.state ?? {}) as Record<string, unknown>;
        if (p.phase) s.phase = String(p.phase);
        if ("firstFailureAt" in p) s.first_failure_at = p.firstFailureAt as string;
        s.failures += Number(p.failuresInc ?? 0);
        if ("nextAt" in p) s.next_at = p.nextAt as string | null;
        if ("rejected" in p) s.rejected_chapters = p.rejected as number[];
        for (const [k, f] of [["interimAt", "interim_at"], ["officialAt", "official_at"], ["gaveUpAt", "gave_up_at"]] as const) if (k in p) s[f] = p[k] as string;
        s.last_reason = String((d.run as Record<string, unknown>).reason ?? s.last_reason);
        return { ok: true, state: { ...s } };
      }
      if (action === "chapters_save") { const m = chapters.get(id) ?? new Map(); m.set(Number(d.n), { n: d.n, source: d.source, chapter: d.chapter }); chapters.set(id, m); return { ok: true }; }
      if (action === "chapters_load") return { ok: true, chapters: [...(chapters.get(id)?.values() ?? [])] };
      if (action === "chapters_clear") { chapters.delete(id); return { ok: true }; }
      if (action === "lane_claim") {
        const s = [...states.values()].find(x => (x.lane_until === null || x.lane_until < clock.now()) && x.phase === "interim" && x.next_at && Date.parse(x.next_at) <= clock.now());
        if (!s) return { ok: true, empty: true };
        s.lane_token = crypto.randomUUID(); s.lane_until = clock.now() + 15 * 60_000;
        return { ok: true, job: { reportId: s.report_id, origin: s.origin, token: s.lane_token, phase: s.phase, regenerate: false, firstFailureAt: s.first_failure_at, failures: s.failures, rejected: s.rejected_chapters, snapshot: snapshots.get(s.report_id) ?? null } };
      }
      if (action === "lane_replace") { const s = states.get(id)!; if (s.lane_token !== d.token) return { ok: false, code: "STALE_LEASE" }; versions.push({ reportId: id, edition: s.phase === "interim" ? "interim" : "previous" }); snapshots.set(id, d.snapshot as Record<string, unknown>); Object.assign(s, { phase: "official", official_at: iso(), next_at: null, lane_token: null, lane_until: null }); return { ok: true }; }
      if (action === "lane_release") { const s = states.get(id)!; if (s.lane_token !== d.token) return { ok: false }; s.lane_token = null; s.lane_until = null; if ("nextAt" in d) s.next_at = d.nextAt as string | null; return { ok: true }; }
      return { ok: false, code: "UNKNOWN_ACTION" };
    },
  };
  return { store, states, runs, chapters, versions, providers, snapshots };
}
