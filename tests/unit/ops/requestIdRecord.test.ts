// OPS-1 추가 지시: Anthropic 응답 헤더 request-id가 호출 기록(book_generation_runs.calls = runSummary)에 남는지.
// 실패 · 끊김 · max_tokens도 남기고, 헤더가 없으면 오류 없이 칸을 비운다(가짜 응답, 호출 0).
import { describe, expect, it, vi } from "vitest";
import { streamCompletion, type StreamCompletionInput } from "../../../src/lib/llm";
import { runSummary } from "../../../src/lib/ops/generation/policy";
import type { CallLog } from "../../../src/lib/writer/runner";

const KEY = ["sk", "test", "SECRET", "0123456789abcdef"].join("-");
const enc = new TextEncoder();
const sse = (event: string, data: unknown) => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
const body = (chunks: string[], fail = false) => { let i = 0; return new ReadableStream<Uint8Array>({ pull(c) { if (i < chunks.length) c.enqueue(enc.encode(chunks[i++])); else if (fail) c.error(new TypeError("terminated")); else c.close(); } }); };
const fake = (chunks: string[], o: { status?: number; rid?: string; fail?: boolean } = {}) =>
  vi.fn(async () => new Response(o.status && o.status >= 400 ? JSON.stringify({ type: "error", error: { type: "overloaded_error", message: "x" } }) : body(chunks, o.fail),
    { status: o.status ?? 200, headers: { "content-type": o.status && o.status >= 400 ? "application/json" : "text/event-stream", ...(o.rid ? { "request-id": o.rid } : {}) } })) as unknown as typeof fetch;
const input = (fetchImpl: typeof fetch): StreamCompletionInput => ({ provider: "anthropic", model: "claude-sonnet-5-5", system: "s", user: "u", maxOutputTokens: 100, timeoutMs: 2000, apiKey: KEY, fetchImpl });
const start = sse("message_start", { type: "message_start", message: { usage: { input_tokens: 10, output_tokens: 1 } } });
const thinkingOnly = [start, sse("content_block_start", { type: "content_block_start", index: 0, content_block: { type: "thinking", thinking: "" } }),
  sse("content_block_stop", { type: "content_block_stop", index: 0 }), sse("message_delta", { type: "message_delta", delta: { stop_reason: "max_tokens" }, usage: { output_tokens: 100 } }), sse("message_stop", { type: "message_stop" })];
const ok = [start, sse("content_block_start", { type: "content_block_start", index: 0, content_block: { type: "text", text: "" } }),
  sse("content_block_delta", { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: "본문" } }),
  sse("message_delta", { type: "message_delta", delta: { stop_reason: "end_turn" }, usage: { output_tokens: 3 } }), sse("message_stop", { type: "message_stop" })];

const call = (requestId: string | null, extra: Partial<CallLog> = {}): CallLog => ({ kind: "first", provider: "anthropic", model: "claude-sonnet-5-5", finish: "complete", usage: { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1 }, costUsd: 0, requestId, ms: 1, chars: 1, maxTokens: 100, ...extra });
const summary = (calls: CallLog[]) => runSummary({ meta: { writer: null, costUsd: 0, durationMs: 0, calls, chapters: [] } as never, run: null });

describe("request-id 기록", () => {
  it("헤더가 있으면 정상 · max_tokens(본문 0자) · HTTP 오류 · 끊김 모두 requestId를 돌려준다", async () => {
    expect((await streamCompletion(input(fake(ok, { rid: "req_ok" })))).requestId).toBe("req_ok");
    const exhausted = await streamCompletion(input(fake(thinkingOnly, { rid: "req_len" })));
    expect([exhausted.finishReason, exhausted.text, exhausted.requestId]).toEqual(["length", "", "req_len"]);
    const http = await streamCompletion(input(fake([], { status: 529, rid: "req_529" })));
    expect([http.finishReason, http.requestId]).toEqual(["error", "req_529"]);
    const cut = await streamCompletion(input(fake([start], { rid: "req_cut", fail: true })));
    expect([cut.finishReason, cut.error?.code, cut.requestId]).toEqual(["error", "stream_interrupted", "req_cut"]);
  });
  it("헤더가 없으면 오류 없이 null", async () => {
    const r = await streamCompletion(input(fake(ok)));
    expect([r.finishReason, r.text, r.requestId]).toEqual(["complete", "본문", null]);
  });
  it("runSummary(calls)는 requestId를 남기고, 없으면 칸을 비운다(4종 · 장 묶음 · 검수 · 수리 같은 CallLog)", () => {
    const s = summary([call("req_a"), call("req_b", { kind: "review", finish: "length", chars: 0 }), call(null, { kind: "repair", finish: "error", error: "network" })]);
    expect(s.calls.map(c => (c as { requestId?: string }).requestId)).toEqual(["req_a", "req_b", undefined]);
    expect(Object.keys(s.calls[2])).not.toContain("requestId");
  });
});
