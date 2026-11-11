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
  /** 최종판3 4: 응답을 이 JSON 스키마로 묶는다(Anthropic output_config.format). 검수 호출만 쓴다. */
  readonly jsonSchema?: Readonly<Record<string, unknown>>;
  /**
   * AM 7부(덕짱님 결정 2026-11-11): "adaptive-low"면 모델 기본 생각 설정 대신 짧은 생각(thinking adaptive, effort low)으로 부른다(Anthropic만).
   * 작가가 between_tools인데도 생각 블록 하나로 출력 상한을 다 쓰고 본문 0자로 끝났을 때의 1회 재호출에만 쓴다.
   */
  readonly thinking?: "adaptive-low";
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
  /**
   * AM 7부: 텍스트가 아닌 출력 블록(thinking 등)의 종류별 수와 글자 수. 원고로 쓰지 않고 기록만 한다.
   * annual-4: 출력 36,365토큰(상한)인데 text_delta가 0자였다 — 어디로 갔는지 다음에는 보이게.
   */
  readonly hidden?: { readonly blocks: Readonly<Record<string, number>>; readonly chars: number };
};
