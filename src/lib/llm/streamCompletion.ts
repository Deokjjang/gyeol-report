import { computeCostUsd } from "./prices";
import { DRIVERS, InvalidEventError, newStreamState, type StreamState } from "./providers";
import { parseSse } from "./sse";
import type { LlmError, LlmObserved, LlmProvider, StreamCompletionInput, StreamCompletionResult } from "./types";

export type LlmTarget = { readonly provider: LlmProvider; readonly model: string };
export type LlmConfig = { readonly provider: LlmProvider; readonly model: string; readonly fallback: LlmTarget | null };

/** (P6b A-1) 운영 작가 기본 모델. 결제·이용권(업그레이드 포함) 모두 이 경로를 쓴다. */
export const DEFAULT_WRITER_MODEL: Readonly<Record<LlmProvider, string>> = { anthropic: "claude-sonnet-5-5", openai: "gpt-6.1-terra" };
/** (P6b A-2) 기본 작가가 스트리밍 전에 실패하면 한 번 전환할 모델. */
export const DEFAULT_FALLBACK: LlmTarget = { provider: "openai", model: "gpt-6.1-terra" };

const provider = (raw: string, name: string): LlmProvider => {
  if (raw !== "anthropic" && raw !== "openai") throw new Error(`${name}는 anthropic 또는 openai여야 합니다: ${raw}`);
  return raw;
};

/**
 * LLM_PROVIDER(기본 anthropic), LLM_MODEL(기본 공급자별 DEFAULT_WRITER_MODEL).
 * LLM_FALLBACK: "공급자/모델" 또는 "none". 없으면 기본 공급자가 anthropic일 때 openai/gpt-6.1-terra, 대체 모델이 기본 모델과 같으면 없음.
 */
export function resolveLlmConfig(env: Readonly<Record<string, string | undefined>> = process.env): LlmConfig {
  const p = provider(env.LLM_PROVIDER?.trim() || "anthropic", "LLM_PROVIDER");
  const model = env.LLM_MODEL?.trim() || DEFAULT_WRITER_MODEL[p];
  const raw = env.LLM_FALLBACK?.trim();
  let fallback: LlmTarget | null = p === "anthropic" ? DEFAULT_FALLBACK : null;
  if (raw === "none") fallback = null;
  else if (raw) { const [fp, ...rest] = raw.split("/"); fallback = { provider: provider(fp, "LLM_FALLBACK"), model: rest.join("/") || DEFAULT_WRITER_MODEL[provider(fp, "LLM_FALLBACK")] }; }
  return { provider: p, model, fallback: fallback && (fallback.provider !== p || fallback.model !== model) ? fallback : null };
}

// 오류 메시지·본문에 키가 섞여 나가지 않게 지운다.
function scrub(text: string, apiKey: string): string {
  let out = apiKey ? text.split(apiKey).join("[redacted]") : text;
  out = out.replace(/sk-[A-Za-z0-9_-]{8,}/g, "[redacted]").replace(/Bearer\s+\S+/gi, "Bearer [redacted]");
  return out.slice(0, 500);
}

async function httpError(response: Response, apiKey: string): Promise<LlmError> {
  let message = `HTTP ${response.status}`;
  try {
    const raw = await response.text();
    try {
      const body = JSON.parse(raw);
      message = String(body?.error?.message ?? body?.message ?? raw);
    } catch { message = raw || message; }
  } catch { /* 본문을 못 읽어도 상태 코드는 남긴다 */ }
  return { code: `http_${response.status}`, message: scrub(message, apiKey), status: response.status };
}

/**
 * 스트리밍 호출 한 번. 재시도는 하지 않는다(정책은 작가 단계).
 * 실패해도 중간까지 받은 텍스트는 result.text에 남는다. 예외는 던지지 않는다(설정 오류 제외).
 */
/** W3 P2: 첫 스트림 이벤트를 기다리는 기본 시간(연구 3-3 「첫 이벤트 60~90초 제한」). */
export const FIRST_EVENT_TIMEOUT_MS = 90_000;

export async function streamCompletion(input: StreamCompletionInput): Promise<StreamCompletionResult> {
  const driver = DRIVERS[input.provider];
  const apiKey = input.apiKey ?? process.env[driver.apiKeyEnv] ?? "";
  const state: StreamState = newStreamState();
  // HOTFIX-W1 1부: 첫 본문 글자까지 걸린 시간(요청 시작부터).
  const t0 = Date.now();
  let firstTextMs: number | null = null;
  const finish = (reason: StreamCompletionResult["finishReason"], error?: LlmError): StreamCompletionResult => {
    const usage = { inputTokens: state.usage.inputTokens, cachedInputTokens: state.usage.cachedInputTokens, outputTokens: state.usage.outputTokens, ...(state.usage.cacheWriteTokens ? { cacheWriteTokens: state.usage.cacheWriteTokens } : {}) };
    const failure = error ?? state.error ?? undefined;
    const observed: LlmObserved = { stop: state.stop, sent: { maxTokens: input.maxOutputTokens, ...driver.sent(input.model) }, blocks: state.blocks, firstTextMs,
      ...(state.thinkingTokens !== undefined ? { thinkingTokens: state.thinkingTokens } : {}) };
    return { text: state.text, finishReason: reason, usage, costUsd: computeCostUsd(input.provider, input.model, usage), requestId: state.requestId, ...(failure ? { error: failure } : {}), observed };
  };
  if (!apiKey) return finish("error", { code: "missing_api_key", message: `${driver.apiKeyEnv}가 없습니다.` });

  const controller = new AbortController();
  let timedOut = false, aborted = false, firstEventLate = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, input.timeoutMs);
  // W3 P2: 첫 이벤트가 이 시간 안에 오지 않으면(멈춤) 끊는다 — 결론 시간 안에 2차를 부를 수 있게.
  const firstEventMs = input.firstEventTimeoutMs ?? FIRST_EVENT_TIMEOUT_MS;
  let firstEventTimer: ReturnType<typeof setTimeout> | undefined = firstEventMs > 0 && firstEventMs < input.timeoutMs ? setTimeout(() => { firstEventLate = true; controller.abort(); }, firstEventMs) : undefined;
  const gotEvent = () => { if (firstEventTimer) { clearTimeout(firstEventTimer); firstEventTimer = undefined; } };
  const onAbort = () => { aborted = true; controller.abort(); };
  if (input.signal?.aborted) onAbort(); else input.signal?.addEventListener("abort", onAbort, { once: true });
  const fetchImpl = input.fetchImpl ?? fetch;
  try {
    const response = await fetchImpl(driver.endpoint, { method: "POST", headers: driver.headers(apiKey), body: JSON.stringify(driver.body(input)), signal: controller.signal });
    state.requestId = response.headers.get(driver.requestIdHeader);
    if (!response.ok) return finish("error", await httpError(response, apiKey));
    if (!response.body) return finish("error", { code: "empty_body", message: "응답 본문이 없습니다." });
    const onText = (d: string) => { if (firstTextMs === null) firstTextMs = Date.now() - t0; input.onText?.(d); };
    for await (const message of parseSse(response.body)) {
      gotEvent();
      driver.handle(message, state, onText);
      if (state.finish) break;
    }
    if (!state.finish) return finish("error", { code: "stream_ended", message: "종료 신호 없이 스트림이 끝났습니다." });
    return finish(state.finish);
  } catch (caught) {
    if (firstEventLate) return finish("error", { code: "first_event_timeout", message: `${firstEventMs}ms 안에 첫 이벤트가 오지 않았습니다.` });
    if (timedOut) return finish("timeout", { code: "timeout", message: `${input.timeoutMs}ms 안에 끝나지 않았습니다.` });
    if (aborted) return finish("error", { code: "aborted", message: "호출한 쪽이 스트림을 끊었습니다." });
    if (caught instanceof InvalidEventError) return finish("error", { code: "invalid_event", message: scrub(caught.message, apiKey) });
    const message = scrub(caught instanceof Error ? caught.message : String(caught), apiKey);
    return finish("error", { code: state.text || state.requestId ? "stream_interrupted" : "network", message });
  } finally {
    clearTimeout(timer); gotEvent();
    input.signal?.removeEventListener("abort", onAbort);
  }
}
