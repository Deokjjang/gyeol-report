/**
 * 개발 서버 예산 관문 연결(최종판 0-5). NODE_ENV=development에서 실제 작가 호출은 모두 tools/llm/budget.ts를 지난다.
 * - LLM_BUDGET_SCOPE(예: final)·LLM_BUDGET_RUN(이번 서버 실행 예산, USD)·LLM_BUDGET_STAGE(원장 단계 이름)가 있으면 관문 stream + 원문 저장소(.cache/writer).
 * - development인데 범위가 없으면 실제 호출을 하지 않는다(거절 stream). 운영(production)·시험(test)에서는 아무것도 하지 않는다(null).
 */
import type { streamCompletion } from "../../llm";
import type { WriterCache } from "../../writer/runner";

export type DevBudget = { readonly stream: typeof streamCompletion; readonly cache: WriterCache | null; readonly note: string };

export async function devBudget(label: string, env: Readonly<Record<string, string | undefined>> = process.env): Promise<DevBudget | null> {
  if (env.NODE_ENV !== "development") return null;
  const scope = env.LLM_BUDGET_SCOPE, run = Number(env.LLM_BUDGET_RUN);
  if (!scope || !(run > 0)) {
    const refuse: typeof streamCompletion = async () => ({ text: "", finishReason: "error", usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }, costUsd: 0, requestId: null, error: { code: "budget_refused", message: "LLM_BUDGET_SCOPE·LLM_BUDGET_RUN 없음" } });
    return { stream: refuse, cache: null, note: "budget_missing" };
  }
  const { budgetGate } = await import("../../../../tools/llm/budget");
  const g = budgetGate({ scope, run: env.LLM_BUDGET_RUN_ID ?? `dev-${scope}`, runBudget: run, stage: `${env.LLM_BUDGET_STAGE ?? "개발 서버"} · ${label}` });
  return { stream: g.stream, cache: g.cache, note: `gate:${scope}` };
}
