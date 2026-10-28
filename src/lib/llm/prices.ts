import type { LlmProvider, LlmUsage } from "./types";

/** USD per 1M tokens. */
export type ModelPrice = {
  readonly input: number;
  /** 캐시 읽기(hit). 모르면 null → 입력 단가로 계산하지 않고 비용 전체를 null로 둔다. */
  readonly cachedInput: number | null;
  /** Anthropic 5분 캐시 쓰기. OpenAI는 해당 없음(null). */
  readonly cacheWrite: number | null;
  readonly output: number;
  /** 프롬프트가 이 토큰 수를 넘으면 다른 단가를 쓰는 모델(Haiku 5.5). */
  readonly overPromptTokens?: { readonly threshold: number; readonly price: Omit<ModelPrice, "overPromptTokens"> };
};

// 단일 가격표. 출처와 확인일을 항목 옆에 적는다. 확인하지 못한 값은 넣지 않는다(없으면 null → 토큰만 기록).
// Anthropic: https://platform.claude.com/docs/en/about-claude/pricing (2026-10-28 확인, 5분 캐시 쓰기 기준, 표준 처리)
// OpenAI:    https://developers.openai.com/api/docs/pricing (2026-10-28 확인, 표준 등급, 짧은 컨텍스트)
const PRICES: Record<LlmProvider, Record<string, ModelPrice>> = {
  anthropic: {
    "claude-fable-5-1": { input: 10, cachedInput: 0.25, cacheWrite: 12.5, output: 50 },
    "claude-opus-5-5": { input: 4, cachedInput: 0.2, cacheWrite: 5, output: 20 },
    "claude-sonnet-5-5": { input: 2, cachedInput: 0.1, cacheWrite: 2.5, output: 10 },
    "claude-haiku-5-5": {
      input: 0.1, cachedInput: 0.01, cacheWrite: 0.125, output: 0.5,
      overPromptTokens: { threshold: 100_000, price: { input: 0.5, cachedInput: 0.05, cacheWrite: 0.625, output: 2.5 } },
    },
  },
  openai: {
    "gpt-5-nano": { input: 0.05, cachedInput: 0.005, cacheWrite: null, output: 0.4 },
    "gpt-4.1-nano": { input: 0.1, cachedInput: 0.025, cacheWrite: null, output: 0.4 },
    "gpt-4o-mini": { input: 0.15, cachedInput: 0.075, cacheWrite: null, output: 0.6 },
    "gpt-5.4-nano": { input: 0.2, cachedInput: 0.02, cacheWrite: null, output: 1.25 },
  },
};

/** 정확히 일치하는 모델만 찾는다. 날짜 접미사(-2025-04-14 등)는 떼고 한 번 더 찾는다. */
export function priceFor(provider: LlmProvider, model: string): ModelPrice | null {
  const table = PRICES[provider];
  return table[model] ?? table[model.replace(/-\d{4}-\d{2}-\d{2}$/, "")] ?? null;
}

export function computeCostUsd(provider: LlmProvider, model: string, usage: LlmUsage): number | null {
  const base = priceFor(provider, model);
  if (!base) return null;
  const promptTokens = usage.inputTokens + usage.cachedInputTokens;
  const price = base.overPromptTokens && promptTokens > base.overPromptTokens.threshold ? base.overPromptTokens.price : base;
  if (usage.cachedInputTokens > 0 && price.cachedInput === null) return null;
  const writes = usage.cacheWriteTokens ?? 0;
  if (writes > 0 && price.cacheWrite === null) return null;
  const plainInput = usage.inputTokens - writes;
  const usd = (plainInput * price.input + writes * (price.cacheWrite ?? 0) + usage.cachedInputTokens * (price.cachedInput ?? 0) + usage.outputTokens * price.output) / 1_000_000;
  return Math.round(usd * 1e8) / 1e8;
}
