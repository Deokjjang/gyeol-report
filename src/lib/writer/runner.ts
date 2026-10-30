/**
 * 작가 실행기(P3 C). 책 1권 = 스트리밍 호출 1회(정상 시). SPEC §4 방어:
 *  1) 출력 0인 실패(연결·429·5xx·과부하)만 시간 예산 안에서 재시도한다.
 *  2) 중간 끊김·length 종료면 받은 장은 확정하고, 누락 장만 이어쓰기 1회(브리프 + 이미 쓴 장의 요약 + 남은 장 목록).
 *  3) 그래도 누락된 장은 안전망 단계에서 결정론 작가가 채운다(여기서는 비워 둔다).
 *  4) 장 경계마다 완성된 장을 저장소에 저장한다(워커가 죽어도 회수 크론이 저장된 장으로 Book을 완성).
 * 저장소가 lease를 잃었다고 하면(save=false) 스트림을 끊고 stale로 끝낸다(회수 쪽이 이어받음).
 */
import { streamCompletion, type LlmProvider, type LlmUsage, type StreamCompletionResult } from "@/lib/llm";
import type { Brief } from "@/lib/brief/schema";
import { completedChapters, type BookChapter } from "./format";
import { buildContinuationPrompt, buildWriterPrompt, type WriterChapter } from "./prompt";
import type { DraftChapter } from "./safety";

/** 글자당 출력 토큰. 한글 1.5자 ≈ 1토큰(P2 size.ts 추정). OpenAI 실호출 실측은 docs/v5/api-cost-log.md, Claude 실측은 P6. */
export const TOKENS_PER_CHAR = 1 / 1.5;
/** 작가 호출 전체 시간 예산(워커 maxDuration 800초 안에서 조립·발행 몫 100초를 남긴다). */
export const WRITER_TIME_BUDGET_MS = 700_000;
/** 모델 출력 상한(토큰). 모르는 모델은 상한 없이 공식만 쓴다. */
export const MODEL_OUTPUT_CAP: Readonly<Record<string, number>> = { "gpt-4o-mini": 16_384, "gpt-5-nano": 128_000, "claude-sonnet-5-5": 64_000, "claude-haiku-5-5": 64_000, "claude-opus-5-5": 64_000, "gpt-6.1-terra": 128_000 };

/** 모델별 한글 글자당 출력 토큰(P6 실측: Sonnet 5.5 약 1.1, gpt-6.1-terra 약 0.9). 없으면 TOKENS_PER_CHAR. */
export const MODEL_TOKENS_PER_CHAR: Readonly<Record<string, number>> = { "claude-sonnet-5-5": 1.1, "gpt-6.1-terra": 1.0 };

/** max_tokens = 장 분량 상한 합계 × 글자당 토큰 × 1.3 (반복 장은 key 수만큼). 모델 상한·운영 상한(LLM_MAX_OUTPUT_TOKENS)으로 자른다. */
export function maxTokensFor(chapters: readonly WriterChapter[], model?: string, limit?: number): number {
  const chars = chapters.reduce((s, c) => s + c.targetChars[1] * (c.keys?.length ?? 1), 0);
  const tokens = Math.ceil(chars * (model ? MODEL_TOKENS_PER_CHAR[model] ?? TOKENS_PER_CHAR : TOKENS_PER_CHAR) * 1.3);
  const cap = Math.min(model ? MODEL_OUTPUT_CAP[model] ?? Infinity : Infinity, limit && limit > 0 ? limit : Infinity);
  return Math.min(cap, tokens);
}

export type SavedChapter = { readonly n: number; readonly chapter: BookChapter; readonly source: DraftChapter["source"] };
/** 장 저장소. save가 false면 lease를 잃은 것(다른 워커·회수 크론이 이어받음). */
export type ChapterSink = { save(c: SavedChapter): Promise<boolean>; load(): Promise<readonly SavedChapter[]> };
export type CallLog = { readonly kind: "first" | "retry" | "continuation"; readonly finish: StreamCompletionResult["finishReason"]; readonly error?: string; readonly usage: LlmUsage; readonly costUsd: number | null; readonly requestId: string | null; readonly ms: number; readonly chars: number; readonly maxTokens: number };
export type WriterRun = {
  readonly drafts: Map<number, DraftChapter>;
  readonly calls: readonly CallLog[];
  readonly stale: boolean;
  readonly usage: { inputTokens: number; cachedInputTokens: number; outputTokens: number };
  readonly costUsd: number;
  readonly outputChars: number;
};
export type WriterOptions = {
  readonly brief: Brief;
  readonly provider: LlmProvider;
  readonly model: string;
  readonly sink: ChapterSink;
  readonly apiKey?: string;
  readonly fetchImpl?: typeof fetch;
  readonly budgetMs?: number;
  readonly now?: () => number;
  readonly sleep?: (ms: number) => Promise<void>;
  readonly stream?: typeof streamCompletion;
  /** 호출당 출력 토큰 상한(비용 상한·잘림 시험용). 없으면 공식과 모델 상한만. */
  readonly maxOutputTokens?: number;
};

const RETRYABLE = /^(network|stream_interrupted|stream_ended|empty_body|invalid_event|timeout|overloaded_error|api_error|rate_limit_error|http_429|http_5\d\d)$/;
/** 출력 0인 실패만 재시도 대상(비용이 들지 않음). */
export function isZeroOutputRetryable(r: Pick<StreamCompletionResult, "text" | "finishReason" | "error">): boolean {
  return r.text.length === 0 && r.finishReason !== "complete" && r.finishReason !== "length" && RETRYABLE.test(r.error?.code ?? "");
}

const summaryOf = (c: BookChapter) => `${c.sections.map(s => s.heading).filter(Boolean).slice(0, 5).join(" / ")} — ${(c.sections[0]?.paragraphs[0] ?? "").slice(0, 80)}`;

export async function runWriter(o: WriterOptions): Promise<WriterRun> {
  const now = o.now ?? (() => Date.now()), sleep = o.sleep ?? (ms => new Promise(r => setTimeout(r, ms)));
  const stream = o.stream ?? streamCompletion;
  const started = now(), budget = o.budgetMs ?? WRITER_TIME_BUDGET_MS;
  const left = () => budget - (now() - started);
  const prompt = buildWriterPrompt(o.brief);
  const plan = new Map(prompt.chapters.map(c => [c.n, c]));
  const drafts = new Map<number, DraftChapter>();
  for (const s of await o.sink.load()) if (plan.has(s.n) && !drafts.has(s.n)) drafts.set(s.n, { chapter: s.chapter, source: s.source });
  const calls: CallLog[] = [];
  const usage = { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 };
  let cost = 0, outputChars = 0, stale = false;

  /** 한 번의 호출(재시도 포함). 장 경계마다 저장한다. 출력이 있었는지 돌려준다. */
  const call = async (kind: "first" | "continuation", system: string, user: string, want: readonly WriterChapter[]): Promise<boolean> => {
    const wanted = new Set(want.map(c => c.n));
    const maxTokens = maxTokensFor(want, o.model, o.maxOutputTokens);
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      let text = "", saving = Promise.resolve();
      const flush = (finished: boolean) => {
        for (const ch of completedChapters(text, finished)) {
          if (!wanted.has(ch.n) || drafts.has(ch.n)) continue;
          const saved: DraftChapter = { chapter: { ...ch, title: plan.get(ch.n)!.title }, source: kind === "first" ? "writer" : "continuation" };
          drafts.set(ch.n, saved);
          saving = saving.then(async () => { if (stale) return; if (!(await o.sink.save({ n: ch.n, ...saved }))) { stale = true; controller.abort(); } });
        }
      };
      const t0 = now();
      const result = await stream({ provider: o.provider, model: o.model, system, user, maxOutputTokens: maxTokens, timeoutMs: Math.max(1_000, left() - 5_000), apiKey: o.apiKey, fetchImpl: o.fetchImpl, signal: controller.signal,
        onText: d => { text += d; if (d.includes("\n")) flush(false); } });
      text = result.text;
      // 완전히 끝났을 때만 마지막 장도 완성으로 친다(length·끊김이면 마지막 장은 잘렸을 수 있음).
      flush(result.finishReason === "complete");
      await saving;
      for (const k of ["inputTokens", "cachedInputTokens", "outputTokens"] as const) usage[k] += result.usage[k];
      cost += result.costUsd ?? 0; outputChars += result.text.length;
      calls.push({ kind: attempt ? "retry" : kind, finish: result.finishReason, ...(result.error ? { error: result.error.code } : {}), usage: result.usage, costUsd: result.costUsd, requestId: result.requestId, ms: now() - t0, chars: result.text.length, maxTokens });
      if (stale) return true;
      if (!isZeroOutputRetryable(result)) return result.text.length > 0;
      const wait = Math.min(30_000, 2_000 * 2 ** attempt);
      if (left() - wait < 30_000) return false;
      await sleep(wait);
    }
  };

  const missing = () => prompt.chapters.filter(c => !drafts.has(c.n));
  if (missing().length) {
    const produced = drafts.size > 0 || await call("first", prompt.system, prompt.user, prompt.chapters);
    const rest = missing();
    if (!stale && produced && rest.length && left() > 60_000) {
      const written = prompt.chapters.filter(c => drafts.has(c.n)).map(c => ({ n: c.n, title: c.title, summary: summaryOf(drafts.get(c.n)!.chapter) }));
      const cont = buildContinuationPrompt(o.brief, written, rest);
      await call("continuation", cont.system, cont.user, rest);
    }
  }
  return { drafts, calls, stale, usage, costUsd: Math.round(cost * 1e8) / 1e8, outputChars };
}
