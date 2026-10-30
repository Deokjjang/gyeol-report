import type { SseMessage } from "./sse";
import type { LlmError, LlmFinishReason, LlmProvider, StreamCompletionInput } from "./types";

/** 스트림을 읽는 동안 쌓이는 상태. 드라이버가 채운다. */
export type StreamState = {
  text: string;
  usage: { inputTokens: number; cachedInputTokens: number; outputTokens: number; cacheWriteTokens: number };
  /** 종료 신호를 받으면 채워진다. 채워지면 더 읽지 않는다. */
  finish: LlmFinishReason | null;
  error: LlmError | null;
  requestId: string | null;
};

export class InvalidEventError extends Error {}

export type ProviderDriver = {
  readonly endpoint: string;
  readonly apiKeyEnv: string;
  readonly requestIdHeader: string;
  headers(apiKey: string): Record<string, string>;
  body(input: StreamCompletionInput): unknown;
  /** 이벤트 하나를 처리한다. 형식이 틀리면 InvalidEventError. */
  handle(message: SseMessage, state: StreamState, onText: (delta: string) => void): void;
};

// 공급자별 이벤트 모양이 달라 느슨하게 받고, 쓰는 필드만 아래에서 검사한다.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parse = (message: SseMessage): Record<string, any> => {
  try {
    const value = JSON.parse(message.data);
    if (typeof value === "object" && value !== null) return value;
  } catch { /* 아래에서 던진다 */ }
  throw new InvalidEventError(`JSON이 아닌 이벤트(${message.event ?? "message"})`);
};
const num = (value: unknown): number => (typeof value === "number" && Number.isFinite(value) ? value : 0);

/**
 * 모델별 요청 옵션(P6). 작가는 추론 없이 쓴다: 출력 토큰이 전부 원고가 되어 비용·시간이 예측된다.
 * - claude-sonnet-5-5: thinking을 빼면 adaptive로 켜진다. 끄는 값은 between_tools(도구가 없으면 생각 안 함, effort high 이하).
 * - gpt-6.1-terra: reasoning effort "none" 지원(상위 모델 중 유일).
 */
const MODEL_OPTIONS: Readonly<Record<string, Record<string, unknown>>> = {
  "claude-sonnet-5-5": { thinking: { type: "between_tools" } },
  "gpt-6.1-terra": { reasoning: { effort: "none" } },
};

export const anthropicDriver: ProviderDriver = {
  endpoint: "https://api.anthropic.com/v1/messages",
  apiKeyEnv: "ANTHROPIC_API_KEY",
  requestIdHeader: "request-id",
  headers: (apiKey) => ({ "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" }),
  body: (input) => ({
    model: input.model,
    max_tokens: input.maxOutputTokens,
    stream: true,
    system: [{ type: "text", text: input.system, ...(input.cacheSystem === false ? {} : { cache_control: { type: "ephemeral" } }) }],
    messages: [{ role: "user", content: input.user }],
    ...MODEL_OPTIONS[input.model],
  }),
  handle(message, state, onText) {
    const type = message.event ?? "";
    if (type === "ping" || type === "content_block_start" || type === "content_block_stop" || type === "message_stop") return;
    const data = parse(message);
    if (type === "message_start") {
      const usage = data.message?.usage ?? {};
      const cacheWrite = num(usage.cache_creation_input_tokens);
      state.usage.inputTokens = num(usage.input_tokens) + cacheWrite;
      state.usage.cacheWriteTokens = cacheWrite;
      state.usage.cachedInputTokens = num(usage.cache_read_input_tokens);
      state.usage.outputTokens = num(usage.output_tokens);
    } else if (type === "content_block_delta") {
      if (data.delta?.type === "text_delta" && typeof data.delta.text === "string" && data.delta.text) {
        state.text += data.delta.text;
        onText(data.delta.text);
      }
    } else if (type === "message_delta") {
      if (data.usage?.output_tokens !== undefined) state.usage.outputTokens = num(data.usage.output_tokens);
      const stop = data.delta?.stop_reason;
      if (stop === "max_tokens" || stop === "model_context_window_exceeded") state.finish = "length";
      else if (stop === "refusal") { state.finish = "error"; state.error = { code: "refusal", message: "모델이 응답을 거절했습니다." }; }
      else if (typeof stop === "string") state.finish = "complete";
    } else if (type === "error") {
      state.finish = "error";
      state.error = { code: String(data.error?.type ?? "stream_error"), message: String(data.error?.message ?? "스트림 오류") };
    }
  },
};

export const openaiDriver: ProviderDriver = {
  endpoint: "https://api.openai.com/v1/responses",
  apiKeyEnv: "OPENAI_API_KEY",
  requestIdHeader: "x-request-id",
  headers: (apiKey) => ({ "content-type": "application/json", authorization: `Bearer ${apiKey}` }),
  body: (input) => ({
    model: input.model,
    instructions: input.system,
    input: input.user,
    max_output_tokens: input.maxOutputTokens,
    stream: true,
    store: false,
    ...MODEL_OPTIONS[input.model],
  }),
  handle(message, state, onText) {
    if (message.data === "[DONE]") return;
    const data = parse(message);
    const type = String(data.type ?? message.event ?? "");
    if (type === "response.output_text.delta") {
      if (typeof data.delta === "string" && data.delta) { state.text += data.delta; onText(data.delta); }
    } else if (type === "response.completed" || type === "response.incomplete") {
      const usage = data.response?.usage ?? {};
      const cached = num(usage.input_tokens_details?.cached_tokens);
      state.usage.cachedInputTokens = cached;
      state.usage.inputTokens = Math.max(0, num(usage.input_tokens) - cached);
      state.usage.outputTokens = num(usage.output_tokens);
      const reason = data.response?.incomplete_details?.reason;
      state.finish = type === "response.completed" ? "complete" : reason === "max_output_tokens" ? "length" : "error";
      if (state.finish === "error") state.error = { code: String(reason ?? "incomplete"), message: "응답이 끝나기 전에 중단되었습니다." };
    } else if (type === "response.failed") {
      state.finish = "error";
      state.error = { code: String(data.response?.error?.code ?? "response_failed"), message: String(data.response?.error?.message ?? "응답 생성 실패") };
    } else if (type === "error") {
      state.finish = "error";
      state.error = { code: String(data.code ?? data.error?.code ?? "stream_error"), message: String(data.message ?? data.error?.message ?? "스트림 오류") };
    }
  },
};

export const DRIVERS: Record<LlmProvider, ProviderDriver> = { anthropic: anthropicDriver, openai: openaiDriver };
