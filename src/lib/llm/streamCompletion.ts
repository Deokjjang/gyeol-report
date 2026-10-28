import { computeCostUsd } from "./prices";
import { DRIVERS, InvalidEventError, type StreamState } from "./providers";
import { parseSse } from "./sse";
import type { LlmError, LlmProvider, StreamCompletionInput, StreamCompletionResult } from "./types";

export type LlmConfig = { readonly provider: LlmProvider; readonly model: string | null };

/** LLM_PROVIDER(기본 anthropic), LLM_MODEL. 모델은 호출하는 쪽이 정한다. */
export function resolveLlmConfig(env: Readonly<Record<string, string | undefined>> = process.env): LlmConfig {
  const raw = env.LLM_PROVIDER?.trim() || "anthropic";
  if (raw !== "anthropic" && raw !== "openai") throw new Error(`LLM_PROVIDER는 anthropic 또는 openai여야 합니다: ${raw}`);
  return { provider: raw, model: env.LLM_MODEL?.trim() || null };
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
export async function streamCompletion(input: StreamCompletionInput): Promise<StreamCompletionResult> {
  const driver = DRIVERS[input.provider];
  const apiKey = input.apiKey ?? process.env[driver.apiKeyEnv] ?? "";
  const state: StreamState = { text: "", usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0, cacheWriteTokens: 0 }, finish: null, error: null, requestId: null };
  const finish = (reason: StreamCompletionResult["finishReason"], error?: LlmError): StreamCompletionResult => {
    const usage = { inputTokens: state.usage.inputTokens, cachedInputTokens: state.usage.cachedInputTokens, outputTokens: state.usage.outputTokens, ...(state.usage.cacheWriteTokens ? { cacheWriteTokens: state.usage.cacheWriteTokens } : {}) };
    const failure = error ?? state.error ?? undefined;
    return { text: state.text, finishReason: reason, usage, costUsd: computeCostUsd(input.provider, input.model, usage), requestId: state.requestId, ...(failure ? { error: failure } : {}) };
  };
  if (!apiKey) return finish("error", { code: "missing_api_key", message: `${driver.apiKeyEnv}가 없습니다.` });

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, input.timeoutMs);
  const fetchImpl = input.fetchImpl ?? fetch;
  try {
    const response = await fetchImpl(driver.endpoint, { method: "POST", headers: driver.headers(apiKey), body: JSON.stringify(driver.body(input)), signal: controller.signal });
    state.requestId = response.headers.get(driver.requestIdHeader);
    if (!response.ok) return finish("error", await httpError(response, apiKey));
    if (!response.body) return finish("error", { code: "empty_body", message: "응답 본문이 없습니다." });
    const onText = input.onText ?? (() => undefined);
    for await (const message of parseSse(response.body)) {
      driver.handle(message, state, onText);
      if (state.finish) break;
    }
    if (!state.finish) return finish("error", { code: "stream_ended", message: "종료 신호 없이 스트림이 끝났습니다." });
    return finish(state.finish);
  } catch (caught) {
    if (timedOut) return finish("timeout", { code: "timeout", message: `${input.timeoutMs}ms 안에 끝나지 않았습니다.` });
    if (caught instanceof InvalidEventError) return finish("error", { code: "invalid_event", message: scrub(caught.message, apiKey) });
    const message = scrub(caught instanceof Error ? caught.message : String(caught), apiKey);
    return finish("error", { code: state.text || state.requestId ? "stream_interrupted" : "network", message });
  } finally {
    clearTimeout(timer);
  }
}
