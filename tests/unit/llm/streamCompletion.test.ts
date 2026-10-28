import { describe, expect, it, vi } from "vitest";
import { computeCostUsd, priceFor, resolveLlmConfig, streamCompletion, type StreamCompletionInput } from "../../../src/lib/llm";
import { parseSse } from "../../../src/lib/llm/sse";

// 키 모양의 리터럴이 소스에 남지 않게 조립한다(비밀 스캔 오탐 방지).
const KEY = ["sk", "test", "SECRET", "0123456789abcdef"].join("-");
const enc = new TextEncoder();
const sse = (event: string | null, data: unknown) => `${event ? `event: ${event}\n` : ""}data: ${typeof data === "string" ? data : JSON.stringify(data)}\n\n`;

/** 조각 배열을 스트림으로 보낸다. failAfter면 조각 뒤에 연결이 끊기고, hang이면 abort될 때까지 멈춘다. */
function streamOf(chunks: string[], opts: { failAfter?: boolean; hang?: boolean; signal?: AbortSignal | null } = {}): ReadableStream<Uint8Array> {
  let i = 0;
  // pull 방식: 앞 조각을 읽은 뒤에 끊겨야 "받은 만큼" 남는다(error()는 큐에 쌓인 조각을 버린다).
  return new ReadableStream({
    pull(controller) {
      if (i < chunks.length) { controller.enqueue(enc.encode(chunks[i++])); return; }
      if (opts.failAfter) controller.error(new TypeError("terminated"));
      else if (opts.hang) return new Promise<void>(() => opts.signal?.addEventListener("abort", () => controller.error(new DOMException("aborted", "AbortError"))));
      else controller.close();
    },
  });
}
const respond = (chunks: string[], opts: { status?: number; headers?: Record<string, string>; failAfter?: boolean; hang?: boolean } = {}) =>
  vi.fn(async (_url: unknown, init?: RequestInit) => new Response(streamOf(chunks, { ...opts, signal: init?.signal }), { status: opts.status ?? 200, headers: { "content-type": "text/event-stream", ...opts.headers } })) as unknown as typeof fetch;
const base = (provider: "anthropic" | "openai", fetchImpl: typeof fetch, extra: Partial<StreamCompletionInput> = {}): StreamCompletionInput =>
  ({ provider, model: provider === "anthropic" ? "claude-haiku-5-5" : "gpt-4.1-nano", system: "시스템", user: "사용자", maxOutputTokens: 200, timeoutMs: 2000, apiKey: KEY, fetchImpl, ...extra });

const anthropicOk = (parts: string[], stop = "end_turn") => [
  sse("message_start", { type: "message_start", message: { id: "msg_1", usage: { input_tokens: 100, cache_creation_input_tokens: 40, cache_read_input_tokens: 60, output_tokens: 1 } } }),
  sse("content_block_start", { type: "content_block_start", index: 0, content_block: { type: "text", text: "" } }),
  sse("ping", { type: "ping" }),
  ...parts.map((text) => sse("content_block_delta", { type: "content_block_delta", index: 0, delta: { type: "text_delta", text } })),
  sse("content_block_stop", { type: "content_block_stop", index: 0 }),
  sse("message_delta", { type: "message_delta", delta: { stop_reason: stop }, usage: { output_tokens: 33 } }),
  sse("message_stop", { type: "message_stop" }),
];
const openaiOk = (parts: string[], status: "completed" | "incomplete" = "completed") => [
  sse("response.created", { type: "response.created", response: { id: "resp_1" } }),
  ...parts.map((delta) => sse("response.output_text.delta", { type: "response.output_text.delta", delta })),
  sse(`response.${status}`, { type: `response.${status}`, response: { usage: { input_tokens: 90, input_tokens_details: { cached_tokens: 50 }, output_tokens: 20 }, ...(status === "incomplete" ? { incomplete_details: { reason: "max_output_tokens" } } : {}) } }),
];

describe("sse parser", () => {
  it("handles chunk splits inside lines, CRLF, comments and multi-line data", async () => {
    const raw = ": hi\r\nevent: a\r\ndata: 1\r\ndata: 2\r\n\r\ndata: x\n\n";
    const out: unknown[] = [];
    for await (const m of parseSse(streamOf([raw.slice(0, 7), raw.slice(7, 25), raw.slice(25)]))) out.push(m);
    expect(out).toEqual([{ event: "a", data: "1\n2" }, { event: null, data: "x" }]);
  });
});

describe("streamCompletion", () => {
  it("anthropic: streams text, reports usage, cost and request id; sends cache_control", async () => {
    const fetchImpl = respond(anthropicOk(["안녕", "하세요"]), { headers: { "request-id": "req_abc" } });
    const seen: string[] = [];
    const result = await streamCompletion(base("anthropic", fetchImpl, { onText: (d) => seen.push(d) }));
    expect(result).toMatchObject({ text: "안녕하세요", finishReason: "complete", requestId: "req_abc", usage: { inputTokens: 140, cachedInputTokens: 60, outputTokens: 33, cacheWriteTokens: 40 } });
    expect(seen).toEqual(["안녕", "하세요"]);
    expect(result.error).toBeUndefined();
    // haiku 5.5: 100 plain + 40 cache write + 60 cache read + 33 out
    expect(result.costUsd).toBeCloseTo((100 * 0.1 + 40 * 0.125 + 60 * 0.01 + 33 * 0.5) / 1e6, 10);
    const [url, init] = vi.mocked(fetchImpl).mock.calls[0];
    const body = JSON.parse(String(init?.body));
    expect(String(url)).toBe("https://api.anthropic.com/v1/messages");
    expect(body).toMatchObject({ model: "claude-haiku-5-5", max_tokens: 200, stream: true, system: [{ type: "text", text: "시스템", cache_control: { type: "ephemeral" } }], messages: [{ role: "user", content: "사용자" }] });
    expect((init?.headers as Record<string, string>)["x-api-key"]).toBe(KEY);
  });

  it("anthropic: cacheSystem=false omits cache_control", async () => {
    const fetchImpl = respond(anthropicOk(["a"]));
    await streamCompletion(base("anthropic", fetchImpl, { cacheSystem: false }));
    expect(JSON.parse(String(vi.mocked(fetchImpl).mock.calls[0][1]?.body)).system[0]).not.toHaveProperty("cache_control");
  });

  it("openai: streams via Responses API and splits cached tokens out of input", async () => {
    const fetchImpl = respond(openaiOk(["가", "나"]), { headers: { "x-request-id": "req_o" } });
    const result = await streamCompletion(base("openai", fetchImpl));
    expect(result).toMatchObject({ text: "가나", finishReason: "complete", requestId: "req_o", usage: { inputTokens: 40, cachedInputTokens: 50, outputTokens: 20 } });
    expect(result.costUsd).toBeCloseTo((40 * 0.1 + 50 * 0.025 + 20 * 0.4) / 1e6, 10);
    const [url, init] = vi.mocked(fetchImpl).mock.calls[0];
    expect(String(url)).toBe("https://api.openai.com/v1/responses");
    expect(JSON.parse(String(init?.body))).toMatchObject({ model: "gpt-4.1-nano", instructions: "시스템", input: "사용자", max_output_tokens: 200, stream: true });
  });

  it("length stop keeps the partial text (both providers)", async () => {
    const a = await streamCompletion(base("anthropic", respond(anthropicOk(["잘린 문", "장"], "max_tokens"))));
    expect(a).toMatchObject({ finishReason: "length", text: "잘린 문장" });
    const o = await streamCompletion(base("openai", respond(openaiOk(["잘린"], "incomplete"))));
    expect(o).toMatchObject({ finishReason: "length", text: "잘린" });
  });

  it("stream cut mid-way returns the text received so far as an error", async () => {
    const result = await streamCompletion(base("anthropic", respond(anthropicOk(["앞부분"]).slice(0, 4), { failAfter: true, headers: { "request-id": "req_cut" } })));
    expect(result).toMatchObject({ finishReason: "error", text: "앞부분", requestId: "req_cut", error: { code: "stream_interrupted" } });
  });

  it("stream that ends without a stop signal is an error with partial text", async () => {
    const result = await streamCompletion(base("openai", respond(openaiOk(["반쪽"]).slice(0, 2))));
    expect(result).toMatchObject({ finishReason: "error", text: "반쪽", error: { code: "stream_ended" } });
  });

  it("provider error event mid-stream keeps text and the error type", async () => {
    const chunks = [...anthropicOk(["일부"]).slice(0, 4), sse("error", { type: "error", error: { type: "overloaded_error", message: "Overloaded" } })];
    const result = await streamCompletion(base("anthropic", respond(chunks)));
    expect(result).toMatchObject({ finishReason: "error", text: "일부", error: { code: "overloaded_error" } });
  });

  it("connection error before any output", async () => {
    const fetchImpl = vi.fn(async () => { throw new TypeError("fetch failed"); }) as unknown as typeof fetch;
    const result = await streamCompletion(base("anthropic", fetchImpl));
    expect(result).toMatchObject({ finishReason: "error", text: "", error: { code: "network" } });
  });

  it.each([[429, "rate_limit_error"], [500, "api_error"], [529, "overloaded_error"]])("HTTP %i before output has no text and carries the status", async (status, type) => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ type: "error", error: { type, message: "busy" } }), { status, headers: { "request-id": "req_e" } })) as unknown as typeof fetch;
    const result = await streamCompletion(base("anthropic", fetchImpl));
    expect(result).toMatchObject({ finishReason: "error", text: "", requestId: "req_e", error: { code: `http_${status}`, status, message: "busy" } });
    expect(vi.mocked(fetchImpl)).toHaveBeenCalledTimes(1); // 어댑터 안에 재시도 없음
  });

  it("malformed event (not JSON) is an error and keeps earlier text", async () => {
    const chunks = [...anthropicOk(["정상"]).slice(0, 4), sse("content_block_delta", "{not json")];
    const result = await streamCompletion(base("anthropic", respond(chunks)));
    expect(result).toMatchObject({ finishReason: "error", text: "정상", error: { code: "invalid_event" } });
  });

  it("ignores unknown event types", async () => {
    const chunks = [sse("future_event", { a: 1 }), ...anthropicOk(["ok"])];
    expect(await streamCompletion(base("anthropic", respond(chunks)))).toMatchObject({ finishReason: "complete", text: "ok" });
  });

  it("times out via AbortController and keeps partial text", async () => {
    const result = await streamCompletion(base("anthropic", respond(anthropicOk(["받은 만큼"]).slice(0, 4), { hang: true }), { timeoutMs: 40 }));
    expect(result).toMatchObject({ finishReason: "timeout", text: "받은 만큼", error: { code: "timeout" } });
  });

  it("times out while waiting for the response headers", async () => {
    const fetchImpl = vi.fn((_u: unknown, init?: RequestInit) => new Promise<Response>((_, reject) => init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError"))))) as unknown as typeof fetch;
    expect(await streamCompletion(base("openai", fetchImpl, { timeoutMs: 30 }))).toMatchObject({ finishReason: "timeout", text: "" });
  });

  it("never leaks the API key in errors or results", async () => {
    const leaky = vi.fn(async () => new Response(`{"error":{"message":"bad key ${KEY} and Bearer ${KEY}"}}`, { status: 401 })) as unknown as typeof fetch;
    const http = await streamCompletion(base("openai", leaky));
    const thrown = await streamCompletion(base("openai", vi.fn(async () => { throw new Error(`boom ${KEY}`); }) as unknown as typeof fetch));
    for (const r of [http, thrown]) {
      expect(JSON.stringify(r)).not.toContain("SECRET");
      expect(JSON.stringify(r)).not.toContain(KEY);
    }
    expect(http.error?.status).toBe(401);
  });

  it("missing key fails closed without calling fetch", async () => {
    const fetchImpl = vi.fn() as unknown as typeof fetch;
    vi.stubEnv("OPENAI_API_KEY", "");
    const result = await streamCompletion({ ...base("openai", fetchImpl), apiKey: undefined });
    expect(result).toMatchObject({ finishReason: "error", error: { code: "missing_api_key" } });
    expect(fetchImpl).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
  });
});

describe("config and prices", () => {
  it("defaults to anthropic and rejects unknown providers", () => {
    expect(resolveLlmConfig({})).toEqual({ provider: "anthropic", model: null });
    expect(resolveLlmConfig({ LLM_PROVIDER: "openai", LLM_MODEL: " gpt-4.1-nano " })).toEqual({ provider: "openai", model: "gpt-4.1-nano" });
    expect(() => resolveLlmConfig({ LLM_PROVIDER: "gemini" })).toThrow();
  });

  it("unknown models cost null; Haiku 5.5 switches tier above 100k prompt tokens", () => {
    expect(priceFor("openai", "gpt-unknown")).toBeNull();
    expect(computeCostUsd("openai", "gpt-unknown", { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1 })).toBeNull();
    expect(priceFor("openai", "gpt-4.1-nano-2025-04-14")).not.toBeNull();
    expect(computeCostUsd("anthropic", "claude-haiku-5-5", { inputTokens: 1_000_000, cachedInputTokens: 0, outputTokens: 0 })).toBeCloseTo(0.5, 8);
    expect(computeCostUsd("anthropic", "claude-haiku-5-5", { inputTokens: 50_000, cachedInputTokens: 0, outputTokens: 0 })).toBeCloseTo(0.005, 8);
  });
});
