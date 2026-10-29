export type LlmProvider = "anthropic" | "openai";
export type LlmFinishReason = "complete" | "length" | "error" | "timeout";

export type LlmUsage = {
  /** 캐시를 쓰지 않은 입력 토큰(Anthropic은 캐시 쓰기 토큰 포함). */
  readonly inputTokens: number;
  /** 캐시에서 읽은 입력 토큰. */
  readonly cachedInputTokens: number;
  readonly outputTokens: number;
  /** Anthropic 캐시 쓰기 토큰(inputTokens에 포함, 단가가 달라 따로 기록). */
  readonly cacheWriteTokens?: number;
};

export type LlmError = {
  /** 예: http_429, http_500, network, stream_interrupted, invalid_event, stream_ended, overloaded_error, refusal */
  readonly code: string;
  /** 비밀값을 제거한 메시지. */
  readonly message: string;
  readonly status?: number;
};

export type StreamCompletionInput = {
  readonly provider: LlmProvider;
  readonly model: string;
  readonly system: string;
  readonly user: string;
  readonly maxOutputTokens: number;
  readonly timeoutMs: number;
  /** 텍스트 조각이 도착할 때마다 호출된다. */
  readonly onText?: (delta: string) => void;
  /** 생략하면 ANTHROPIC_API_KEY / OPENAI_API_KEY 환경변수. */
  readonly apiKey?: string;
  /** 테스트용 주입. 생략하면 전역 fetch. */
  readonly fetchImpl?: typeof fetch;
  /** Anthropic 시스템 프롬프트에 cache_control을 붙인다. 기본 true. */
  readonly cacheSystem?: boolean;
  /** 호출하는 쪽이 스트림을 끊을 때(예: 작업 lease를 잃음). 끊기면 finishReason "error", code "aborted". */
  readonly signal?: AbortSignal;
};

export type StreamCompletionResult = {
  /** 실패해도 중간까지 받은 텍스트를 그대로 돌려준다. */
  readonly text: string;
  readonly finishReason: LlmFinishReason;
  readonly usage: LlmUsage;
  /** 가격표에 없는 모델이면 null(토큰만 기록). */
  readonly costUsd: number | null;
  readonly requestId: string | null;
  readonly error?: LlmError;
};
