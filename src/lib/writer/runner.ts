/**
 * 작가 실행기(P3 C). 책 1권 = 스트리밍 호출 1회(정상 시). SPEC §4 방어:
 *  1) 출력 0인 실패(연결·429·5xx·과부하)만 시간 예산 안에서 재시도한다.
 *  2) 중간 끊김·length 종료면 받은 장은 확정하고, 누락 장만 이어쓰기 1회(브리프 + 이미 쓴 장의 요약 + 남은 장 목록).
 *  1-1) (P6b A-2) 대체 모델(fallback)이 있으면, 기본 모델이 출력 0으로 실패할 때(스트리밍 시작 전) 재시도 대신 대체 모델로 한 번 전환한다.
 *  3) 그래도 누락된 장은 안전망 단계에서 결정론 작가가 채운다(여기서는 비워 둔다).
 *  4) 장 경계마다 완성된 장을 저장소에 저장한다(워커가 죽어도 회수 크론이 저장된 장으로 Book을 완성).
 *  5) (최종판 0-1) 작가는 한 번만 부른다. 짧은 장도 작가 원고 그대로 둔다(장·책을 버리고 다시 쓰는 경로 없음). 검사에 걸린 문단 수리·소제목 재작성은 completeText 각 1회.
 *  6) (최종판 0-2) 호출마다 원문을 입력 해시(모델 + 지침 + 브리프·장 목록이 든 사용자 메시지)로 남긴다(WriterRun.raw → Book meta). cache가 있으면 같은 입력은 다시 부르지 않고 저장본을 흘려보낸다.
 *  7) (최종판 0-6) costCapUsd: 이 실행이 쓸 수 있는 비용. 넘었으면 더 부르지 않는다(cost_cap).
 *  8) (HOTFIX-W1) 출력 한도 = 본문 추정 + 생각 여유(writerLimit). length로 끊기고 본문이 비었거나 장이 빠지면 「생각 소진」(classifyCall).
 *     생각 소진은 같은 설정·같은 한도로 되풀이하지 않고 사다리(1단 → 2단 = 모델 상한)를 오른다. 2단도 소진이면 더 부르지 않는다(감독이 보류·알림).
 *     작가 호출도 비용 상한 안에서만: 최악 비용(입력 + 출력 상한)이 남은 예산(검수·수리 몫을 뺀 값)을 넘지 않게 한도를 깎고, 본문도 못 쓸 만큼이면 부르지 않는다.
 *     이어 쓰기: 끝까지 쓴 장은 저장하고, 다음 호출은 빠진 장만 같은 설정으로(설계도 전체 + 이미 쓴 장 원문을 문맥으로).
 * 저장소가 lease를 잃었다고 하면(save=false) 스트림을 끊고 stale로 끝낸다(회수 쪽이 이어받음).
 */
import { createHash } from "node:crypto";
import { priceFor, streamCompletion, type LlmObserved, type LlmProvider, type LlmUsage, type StreamCompletionResult } from "@/lib/llm";
import type { Knowledge } from "@/lib/brief/knowledge";
import type { Brief } from "@/lib/brief/schema";
import { completedChapters, renderChapter, type BookChapter } from "./format";
import { buildContinuationPrompt, buildWriterPrompt, WRITER_TARGET_FACTOR, type WriterChapter } from "./prompt";
import type { DraftChapter } from "./safety";

/** 글자당 출력 토큰. 한글 1.5자 ≈ 1토큰(P2 size.ts 추정). OpenAI 실호출 실측은 docs/v5/api-cost-log.md, Claude 실측은 P6. */
export const TOKENS_PER_CHAR = 1 / 1.5;
/** 작가 호출 전체 시간 예산(워커 maxDuration 800초 안에서 조립·발행 몫 100초를 남긴다). */
export const WRITER_TIME_BUDGET_MS = 700_000;
/**
 * 모델 출력 상한(토큰). 모르는 모델은 상한 없이 공식만 쓴다.
 * HOTFIX-W1 0부: Claude 5.5 세 모델은 128K(platform.claude.com thinking.md 「Max output tokens」 표, 2026-11-13 확인 — 이전 값 64K는 틀림).
 */
export const MODEL_OUTPUT_CAP: Readonly<Record<string, number>> = { "gpt-4o-mini": 16_384, "gpt-5-nano": 128_000, "claude-sonnet-5-5": 128_000, "claude-haiku-5-5": 128_000, "claude-opus-5-5": 128_000, "gpt-6.1-terra": 128_000 };
/**
 * 작가 생각 여유(토큰, HOTFIX-W1 2부). 생각은 max_tokens에 들어간다(문서). between_tools인데도 생각 블록 하나가 상한을 다 쓴 실측:
 * 운영 25,183~28,722(옛 한도 전부, 7회) · AM 개발 최대 36,365(잘린 값). 관측된 최대 소진량을 본문 추정 위에 따로 얹는다
 * → 1단 = 본문 추정 + 36,000 ≈ 61~65K(문서의 「긴 작업은 64,000부터」와 같은 크기). 2단 = 모델 상한.
 */
export const THINKING_RESERVE_TOKENS = 36_000;
/** 시간으로 깎는 한도의 속도(토큰/초). 운영 생각 소진 7회 실측 130~139 토큰/초에서 낮춰 잡았다(남은 시간에 다 못 받을 한도는 주지 않는다). */
export const WRITER_TOKENS_PER_SEC = 125;
/** 작가 뒤 검수·수리 몫으로 남기는 시간(ms, 운영 실측 검수 ≤ 37초 + 수리 ≤ 19초 + 여유). 예산이 짧으면(시험) 예산의 20%. */
export const POST_WRITER_MS = 90_000;
export const postWriterMs = (budgetMs: number) => Math.min(POST_WRITER_MS, Math.floor(budgetMs * 0.2));
export type LadderStage = 1 | 2;
/** 호출 실패 분류(HOTFIX-W1 3부 알림): 생각 소진 · 연결 · 기타. */
export type CallClass = "thinking_exhausted" | "connection" | "other";

/** 모델별 한글 글자당 출력 토큰(P6 실측: Sonnet 5.5 약 1.1, gpt-6.1-terra 약 0.9). 없으면 TOKENS_PER_CHAR. */
export const MODEL_TOKENS_PER_CHAR: Readonly<Record<string, number>> = { "claude-sonnet-5-5": 1.1, "gpt-6.1-terra": 1.0 };
/** 표지 한 줄·key마다 카드 줄 3개·핵심 문장 기호(P6c F1·G·H)의 몫(글자). */
const EXTRA_CHARS = { book: 60, key: 140 } as const;

/** 본문 추정(토큰) = (장 분량 상한 합계 + 표지·카드 몫) × 글자당 토큰 × 1.3 (반복 장은 key 수만큼). 모델 상한·운영 상한(LLM_MAX_OUTPUT_TOKENS)으로 자른다. HOTFIX-W1 전에는 이 값이 작가 max_tokens였다. */
export function maxTokensFor(chapters: readonly WriterChapter[], model?: string, limit?: number): number {
  // 작가가 보는 목표는 WRITER_TARGET_FACTOR배(P6b C-4)라 그만큼 여유를 둔다.
  const chars = chapters.reduce((s, c) => s + c.targetChars[1] * (c.keys?.length ?? 1), 0) * WRITER_TARGET_FACTOR
    + EXTRA_CHARS.book + chapters.reduce((s, c) => s + (c.keys?.length ?? 0) * EXTRA_CHARS.key, 0);
  const tokens = Math.ceil(chars * (model ? MODEL_TOKENS_PER_CHAR[model] ?? TOKENS_PER_CHAR : TOKENS_PER_CHAR) * 1.3);
  const cap = Math.min(model ? MODEL_OUTPUT_CAP[model] ?? Infinity : Infinity, limit && limit > 0 ? limit : Infinity);
  return Math.min(cap, tokens);
}

export type SavedChapter = { readonly n: number; readonly chapter: BookChapter; readonly source: DraftChapter["source"] };
/** 장 저장소. save가 false면 lease를 잃은 것(다른 워커·회수 크론이 이어받음). */
export type ChapterSink = { save(c: SavedChapter): Promise<boolean>; load(): Promise<readonly SavedChapter[]> };
export type WriterTarget = { readonly provider: LlmProvider; readonly model: string; readonly apiKey?: string };
export type WriterFallback = { readonly from: { provider: string; model: string }; readonly to: { provider: string; model: string } | "deterministic"; readonly reason: string };
/** "redo"는 옛 Book 메타에만 있다(최종판 0-1: 장 재요청 경로를 없앴다). "cover"는 표지 줄 수리(1-7). */
export type CallKind = "first" | "retry" | "continuation" | "fallback" | "redo" | "repair" | "rewrite" | "cover" | "review";
/** cached: 저장된 원문을 썼다(호출 0). */
/**
 * HOTFIX-W1 1부: stop(끝난 이유 원문)·sent(보낸 생각 설정)·blocks(블록 종류별 수·글자)·firstTextMs(첫 본문까지 ms)·thinkingTokens는 관측 기록,
 * stage(사다리 단계)·body(본문 추정 토큰)·cls(실패 분류)는 이 호출을 고른 규칙. 생각 내용은 없다.
 */
export type CallLog = { readonly kind: CallKind; readonly provider?: string; readonly model?: string; readonly finish: StreamCompletionResult["finishReason"]; readonly error?: string; readonly usage: LlmUsage; readonly costUsd: number | null; readonly requestId: string | null; readonly ms: number; readonly chars: number; readonly maxTokens: number; readonly cached?: boolean; readonly key?: string;
  readonly stage?: LadderStage; readonly body?: number; readonly cls?: CallClass; readonly stop?: string | null; readonly sent?: LlmObserved["sent"]; readonly blocks?: LlmObserved["blocks"]; readonly firstTextMs?: number | null; readonly thinkingTokens?: number };
/**
 * 작가·수리 원문(최종판 0-2). key = rawKey(모델, 지침, 사용자 메시지): 사용자 메시지에 브리프·장 목록(또는 수리 항목)이 들어 있어 입력 해시가 된다.
 * Book meta(meta.raw)와 개발 저장소(.cache/writer/)에 같은 꼴로 남는다.
 */
export type RawEntry = { readonly key: string; readonly kind: CallKind; readonly provider: string; readonly model: string; readonly chapters?: readonly number[]; readonly finish: StreamCompletionResult["finishReason"]; readonly text: string; readonly costUsd: number };
/** 원문 저장소: get이 값을 주면 호출하지 않고 그 원문을 쓴다. put은 새로 받은 원문을 남긴다. */
export type WriterCache = { get(key: string): RawEntry | null | Promise<RawEntry | null>; put(e: RawEntry, meta: { readonly system: string; readonly user: string }): void | Promise<void> };
export const rawKey = (model: string, system: string, user: string) => createHash("sha256").update(`${model}\n\u0000${system}\n\u0000${user}`).digest("hex").slice(0, 32);
export type WriterRun = {
  readonly drafts: Map<number, DraftChapter>;
  readonly calls: readonly CallLog[];
  readonly stale: boolean;
  readonly usage: { inputTokens: number; cachedInputTokens: number; outputTokens: number };
  readonly costUsd: number;
  readonly outputChars: number;
  /** 실제로 원고를 쓴 모델(대체되면 대체 모델, 출력이 없으면 null). */
  readonly writer: { provider: string; model: string } | null;
  /** 대체가 일어났으면 기록(P6b A-2). */
  readonly fallback: WriterFallback | null;
  /** 첫 호출 원문의 표지 줄(P6c G). 장 머리글 앞이라 장 파서가 버린다. */
  readonly cover: string | null;
  /** 받은 원문(저장본 포함, 최종판 0-2). */
  readonly raw: readonly RawEntry[];
  /** 비용 상한에 걸려 부르지 않은 호출이 있었다(최종판 0-6). */
  readonly capped: boolean;
  /** HOTFIX-W1: 작가 호출이 생각 소진으로 끝난 가장 높은 사다리 단계(없으면 null). */
  readonly exhausted: LadderStage | null;
  /** HOTFIX-W1: 사다리 끝 — 2단까지 소진했거나, 시간·비용 때문에 소진 때보다 큰 한도를 줄 수 없다(감독이 보류·즉시 알림). */
  readonly ladderEnd: boolean;
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
  /** 기본 모델이 출력 0으로 실패하면 한 번 전환할 모델(P6b A-2). 없으면 기존처럼 같은 모델로 재시도. */
  readonly fallback?: WriterTarget | null;
  /** 지식 DB(P6c A1): 작가 입력의 원문 문장을 재료로 바꾼다. */
  readonly knowledge?: Knowledge;
  /** 원문 저장소(최종판 0-2). 같은 입력 해시면 다시 부르지 않는다. */
  readonly cache?: WriterCache | null;
  /** 이 실행이 더 쓸 수 있는 비용(USD, 최종판 0-6). 쓴 비용이 이 값 이상이면 더 부르지 않는다. 없으면 상한 없음. */
  readonly costCapUsd?: number;
  /** 최종판3 6: 시스템 프롬프트 캐시(false면 붙이지 않는다). 기본은 LLM_PROMPT_CACHE 설정(promptCacheOn). */
  readonly cacheSystem?: boolean;
  /** HOTFIX-W1: 작가 사다리 시작 단계(감독이 지난 시도 기록에서 정한다 — 같은 단계를 되풀이하지 않게). 기본 1. */
  readonly startStage?: LadderStage;
  /**
   * HOTFIX-W1: 지난 시도에서 본문 0자로 생각 소진한 작가 호출의 가장 큰 한도. 이번 첫 호출이 같은 장을 다시 쓰는데 한도가 이 값의 1.1배에 못 미치면
   * 같은 호출 반복으로 보고 부르지 않는다(사다리 끝). 장을 쓰다 끊긴 뒤의 이어 쓰기(빠진 장만)는 다른 호출이라 막지 않는다.
   */
  readonly exhaustedMaxTokens?: number;
  /** HOTFIX-W1: 작가 호출 뒤 검수·수리에 남길 비용(USD). 작가 한도를 깎을 때 이 몫을 먼저 뺀다(검수·수리를 건너뛰어 품질이 떨어지지 않게). */
  readonly postReserveUsd?: number;
};

const RETRYABLE = /^(network|stream_interrupted|stream_ended|empty_body|invalid_event|timeout|overloaded_error|api_error|rate_limit_error|http_429|http_5\d\d)$/;

/**
 * 호출 실패 분류(HOTFIX-W1 2부 3). 생각 소진 = length로 끝났는데 본문이 비었거나 원한 장이 빠졌다
 * (시간 초과로 끊겼는데 본문 0자이고 생각 블록이 있었던 경우도 같은 것으로 본다). 연결 = 재시도 대상 오류. 성공이면 undefined.
 */
export function classifyCall(r: Pick<StreamCompletionResult, "text" | "finishReason" | "error" | "observed">, missingAfter = 0): CallClass | undefined {
  const thinking = Object.entries(r.observed?.blocks ?? {}).some(([k, b]) => k !== "text" && b.n > 0);
  if (r.finishReason === "length" && (r.text.trim().length === 0 || missingAfter > 0)) return "thinking_exhausted";
  if (r.finishReason === "timeout" && r.text.trim().length === 0 && thinking) return "thinking_exhausted";
  if (r.finishReason === "complete") return missingAfter > 0 && r.text.trim().length === 0 ? "other" : undefined;
  if (r.finishReason === "length") return undefined;
  return RETRYABLE.test(r.error?.code ?? "") ? "connection" : "other";
}



/** 입력 최악 비용(USD): 글자 × 1.1토큰 × max(입력, 캐시 쓰기) 단가. 가격표에 없으면 null. */
function inputWorstUsd(provider: LlmProvider, model: string, chars: number): number | null {
  const p = priceFor(provider, model); if (!p) return null;
  return Math.ceil(chars * 1.1) * Math.max(p.input, p.cacheWrite ?? 0) / 1e6;
}
/** 출력 0인 실패만 재시도 대상(비용이 들지 않음). */
export function isZeroOutputRetryable(r: Pick<StreamCompletionResult, "text" | "finishReason" | "error">): boolean {
  return r.text.length === 0 && r.finishReason !== "complete" && r.finishReason !== "length" && RETRYABLE.test(r.error?.code ?? "");
}

/** 대체로 넘길 실패: 출력 0이고 lease를 잃어 끊은 것(aborted)이 아니면 무엇이든(401·거절·과부하·네트워크). */
export const isZeroOutputFailure = (r: Pick<StreamCompletionResult, "text" | "finishReason" | "error">) => r.text.length === 0 && r.finishReason !== "complete" && r.error?.code !== "aborted";

/** 원문 맨 앞(첫 장 머리글 앞)의 "[표지] …" 한 줄(P6c G). */
export const coverOf = (text: string) => text.split(/\n##\s/)[0].match(/^\s*\[표지\]\s*(.+?)\s*$/m)?.[1] ?? null;

/** 작가 세션: 호출 기록·비용·장 원고를 모은다. runWriter·completeText가 같은 세션 규칙(재시도·대체·저장·원문·상한)을 쓴다. */
type Session = {
  readonly o: WriterOptions; readonly drafts: Map<number, DraftChapter>; readonly calls: CallLog[];
  readonly usage: { inputTokens: number; cachedInputTokens: number; outputTokens: number };
  cost: number; outputChars: number; stale: boolean; target: WriterTarget; fallback: WriterFallback | null; wrote: WriterTarget | null; cover: string | null;
  readonly started: number; readonly plan: ReadonlyMap<number, WriterChapter>; readonly raw: RawEntry[]; capped: boolean; exhausted: LadderStage | null; ladderEnd: boolean;
};
const now = (o: WriterOptions) => (o.now ?? (() => Date.now()))();
const leftOf = (s: Session) => (s.o.budgetMs ?? WRITER_TIME_BUDGET_MS) - (now(s.o) - s.started);

function session(o: WriterOptions, prev?: WriterRun): Session {
  const plan = new Map(buildWriterPrompt(o.brief, { knowledge: o.knowledge }).chapters.map(c => [c.n, c]));
  const target: WriterTarget = { provider: o.provider, model: o.model, ...(o.apiKey ? { apiKey: o.apiKey } : {}) };
  // 이전 실행에서 대체 모델로 썼으면 같은 모델로 이어 간다.
  const wrote = prev?.writer && prev.fallback && prev.fallback.to !== "deterministic" && o.fallback ? o.fallback : prev?.writer ? target : null;
  return {
    o, drafts: new Map(prev?.drafts ?? []), calls: [...(prev?.calls ?? [])], usage: { ...(prev?.usage ?? { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }) },
    cost: prev?.costUsd ?? 0, outputChars: prev?.outputChars ?? 0, stale: false, target: wrote ?? target, fallback: prev?.fallback ?? null, wrote, cover: prev?.cover ?? null,
    started: now(o), plan, raw: [...(prev?.raw ?? [])], capped: prev?.capped ?? false, exhausted: prev?.exhausted ?? null, ladderEnd: prev?.ladderEnd ?? false,
  };
}

/**
 * 작가 출력 한도(HOTFIX-W1 2부 2·5·6). 1단 = 본문 추정 + 생각 여유, 2단 = 모델 상한. 그다음 깎는다:
 *  운영·시험 상한(maxOutputTokens) → 남은 시간(검수·수리 몫을 남기고 WRITER_TOKENS_PER_SEC, 단 본문 추정 아래로는 자르지 않는다 —
 *  남은 시간에 다 못 쓰면 스트림 시간 제한이 끊고 끝까지 쓴 장은 저장된다) → 남은 비용(검수·수리 몫을 남기고 최악 비용 기준).
 * 비용으로 깎은 값이 본문 추정보다 작으면 부르지 않는다(cost_cap). 운영·시험 상한으로 작아진 것은 그대로 부른다(잘림 시험).
 */
export function writerLimit(s: Pick<Session, "o" | "target" | "cost" | "started">, want: readonly WriterChapter[], stage: LadderStage, inputChars: number): { maxTokens: number; body: number; reason?: "cost_cap" } {
  const o = s.o, model = s.target.model, modelCap = MODEL_OUTPUT_CAP[model] ?? Infinity;
  const body = maxTokensFor(want, model);
  let limit = Math.min(modelCap, stage === 1 ? body + THINKING_RESERVE_TOKENS : modelCap);
  if (!Number.isFinite(limit)) limit = body + THINKING_RESERVE_TOKENS;
  if (o.maxOutputTokens && o.maxOutputTokens > 0) limit = Math.min(limit, o.maxOutputTokens);
  const budget = o.budgetMs ?? WRITER_TIME_BUDGET_MS;
  const left = budget - (now(o) - s.started) - postWriterMs(budget);
  const byTime = Math.floor((left / 1000) * WRITER_TOKENS_PER_SEC);
  if (byTime < limit) limit = Math.max(byTime, Math.min(body, limit));
  if (o.costCapUsd !== undefined) {
    const p = priceFor(s.target.provider, model), inUsd = inputWorstUsd(s.target.provider, model, inputChars);
    if (p && inUsd !== null) {
      const byCost = Math.floor(((o.costCapUsd - s.cost - (o.postReserveUsd ?? 0) - inUsd) * 1e6) / p.output);
      if (byCost < limit) { if (byCost < Math.min(body, limit)) return { maxTokens: 0, body, reason: "cost_cap" }; limit = byCost; }
    }
  }
  return { maxTokens: Math.max(1, Math.floor(limit)), body };
}

/**
 * 한 번의 호출(재시도·대체 포함). want가 있으면 장 경계마다 저장한다(없으면 글만 돌려준다: 수리 패스).
 * 돌려주는 값: 받은 글(출력이 없으면 "")과 마지막 호출의 실패 분류(HOTFIX-W1, 성공이면 undefined).
 * limit: 작가 호출의 한도(writerLimit 결과)와 사다리 단계. 없으면 maxTokensOverride(뒤 호출) 또는 본문 추정.
 */
async function call(s: Session, kind: "first" | "continuation" | "repair" | "rewrite" | "cover" | "review", system: string, user: string, want: readonly WriterChapter[] | null, maxTokensOverride?: number, jsonSchema?: Readonly<Record<string, unknown>>, limit?: { maxTokens: number; body: number; stage: LadderStage }): Promise<{ text: string; cls?: CallClass }> {
  const o = s.o, sleep = o.sleep ?? (ms => new Promise(r => setTimeout(r, ms)));
  const wanted = new Set((want ?? []).map(c => c.n));
  let switched = false;
  for (let attempt = 0; ; attempt++) {
    // 원문 저장소(0-2): 같은 입력이면 저장본을 흘려보낸다(호출 0). 상한(0-6): 넘었으면 부르지 않는다.
    const key = rawKey(s.target.model, system, user);
    let hit: RawEntry | null = null;
    try { hit = o.cache ? await o.cache.get(key) : null; } catch { hit = null; }
    // 뒤 호출(검수·수리·표지·재작성)은 쓴 비용이 상한에 이르면 부르지 않는다. 작가 호출의 비용 규칙은 writerLimit(부르기 전에 한도를 깎는다).
    if (!hit && o.costCapUsd !== undefined && s.cost >= o.costCapUsd && kind !== "first" && kind !== "continuation") {
      s.capped = true;
      s.calls.push({ kind, provider: s.target.provider, model: s.target.model, finish: "error", error: "cost_cap", usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }, costUsd: 0, requestId: null, ms: 0, chars: 0, maxTokens: 0, key });
      return { text: "" };
    }
    const stream: typeof streamCompletion = hit ? (async input => { input.onText?.(hit!.text); return { text: hit!.text, finishReason: hit!.finish, usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }, costUsd: 0, requestId: "cache" }; }) : o.stream ?? streamCompletion;
    const maxTokens = limit?.maxTokens ?? maxTokensOverride ?? maxTokensFor(want ?? [], s.target.model, o.maxOutputTokens);
    const controller = new AbortController();
    let text = "", saving = Promise.resolve();
    const flush = (finished: boolean) => {
      if (!want) return;
      for (const ch of completedChapters(text, finished)) {
        // 문단이 하나도 없는 장은 받지 않은 장으로 본다(이어쓰기가 채운다). 이미 받은 장은 덮지 않는다.
        if (!wanted.has(ch.n) || s.drafts.has(ch.n) || !ch.sections.some(x => x.paragraphs.length)) continue;
        const saved: DraftChapter = { chapter: { ...ch, title: s.plan.get(ch.n)!.title }, source: kind === "first" ? "writer" : "continuation" };
        s.drafts.set(ch.n, saved); wanted.delete(ch.n);
        saving = saving.then(async () => { if (s.stale) return; if (!(await o.sink.save({ n: ch.n, ...saved }))) { s.stale = true; controller.abort(); } });
      }
    };
    const t0 = now(o);
    // HOTFIX-W1 6: 작가 호출은 검수·수리 몫(postWriterMs)을 남기고 끊는다 — 작가가 늦어 검수·수리가 시간 부족으로 빠지지 않게(끝까지 쓴 장은 저장돼 다음 시도가 빠진 장만 쓴다).
    const timeoutMs = Math.max(1_000, leftOf(s) - (limit ? postWriterMs(o.budgetMs ?? WRITER_TIME_BUDGET_MS) : 5_000));
    const result = await stream({ provider: s.target.provider, model: s.target.model, system, user, maxOutputTokens: maxTokens, timeoutMs, apiKey: s.target.apiKey, fetchImpl: o.fetchImpl, signal: controller.signal,
      ...(jsonSchema ? { jsonSchema } : {}), ...(o.cacheSystem === false ? { cacheSystem: false } : {}),
      onText: d => { text += d; if (d.includes("\n")) flush(false); } });
    text = result.text;
    // 완전히 끝났을 때만 마지막 장도 완성으로 친다(length·끊김이면 마지막 장은 잘렸을 수 있음).
    flush(result.finishReason === "complete");
    await saving;
    for (const k of ["inputTokens", "cachedInputTokens", "outputTokens"] as const) s.usage[k] += result.usage[k];
    s.cost += result.costUsd ?? 0; s.outputChars += result.text.length;
    const cls = hit ? undefined : classifyCall(result, want ? wanted.size : 0);
    const ob = result.observed;
    s.calls.push({ kind: switched && attempt === 0 ? "fallback" : attempt ? "retry" : kind, provider: s.target.provider, model: s.target.model, finish: result.finishReason, ...(result.error ? { error: result.error.code } : {}), usage: result.usage, costUsd: result.costUsd, requestId: result.requestId, ms: now(o) - t0, chars: result.text.length, maxTokens, key, ...(hit ? { cached: true } : {}),
      ...(limit ? { stage: limit.stage, body: limit.body } : {}), ...(cls ? { cls } : {}),
      ...(ob ? { stop: ob.stop, sent: ob.sent, blocks: ob.blocks, firstTextMs: ob.firstTextMs, ...(ob.thinkingTokens !== undefined ? { thinkingTokens: ob.thinkingTokens } : {}) } : {}) });
    if (result.text.length > 0) {
      const entry: RawEntry = { key, kind, provider: s.target.provider, model: s.target.model, ...(want ? { chapters: want.map(c => c.n) } : {}), finish: result.finishReason, text: result.text, costUsd: hit ? hit.costUsd : result.costUsd ?? 0 };
      s.raw.push(entry);
      if (!hit && o.cache) { try { await o.cache.put(entry, { system, user }); } catch { /* 저장 실패는 원고를 막지 않는다 */ } }
    }
    if (s.stale) return { text, cls };
    if (result.text.length > 0) { s.wrote = s.target; if (kind === "first" && !s.cover) s.cover = coverOf(result.text); }
    // 스트리밍 시작 전 실패: 대체 모델로 한 번 전환(재시도보다 먼저). 대체도 출력 0이면 아래 재시도 규칙 → 결정론.
    if (isZeroOutputFailure(result) && o.fallback && !s.fallback && leftOf(s) > 60_000) {
      s.fallback = { from: { provider: s.target.provider, model: s.target.model }, to: { provider: o.fallback.provider, model: o.fallback.model }, reason: result.error?.code ?? result.finishReason };
      s.target = o.fallback; switched = true; attempt = -1;
      continue;
    }
    // 잘린 수리 응답도 돌려준다(수리 파서가 끝까지 온 문단만 쓴다).
    if (!isZeroOutputRetryable(result)) return { text: result.text, cls };
    // 최종판3 6: 응답 없이 끊긴 경우(출력 0)만 1회 다시 부른다(호출 기록 kind "retry"로 원장에 남는다). 그 뒤는 부르지 않는다.
    if (attempt >= 1) return { text: "", cls };
    const wait = Math.min(30_000, 2_000 * 2 ** attempt);
    if (leftOf(s) - wait < 30_000) return { text: "", cls };
    await sleep(wait);
  }
}

function finish(s: Session): WriterRun {
  const w = s.wrote, f = s.fallback;
  return { drafts: s.drafts, calls: s.calls, stale: s.stale, usage: s.usage, costUsd: Math.round(s.cost * 1e8) / 1e8, outputChars: s.outputChars, writer: w ? { provider: w.provider, model: w.model } : null, fallback: f && !w ? { ...f, to: "deterministic" } : f, cover: s.cover, raw: s.raw, capped: s.capped, exhausted: s.exhausted, ladderEnd: s.ladderEnd };
}

/** 부르지 않은 작가 호출을 기록한다(시간·비용 상한). 비용이면 capped(감독이 보류). */
function skipWriter(s: Session, kind: "first" | "continuation", stage: LadderStage, body: number, reason: "time" | "cost_cap" | "no_headroom") {
  if (reason === "cost_cap") s.capped = true;
  s.calls.push({ kind, provider: s.target.provider, model: s.target.model, finish: "error", error: reason, usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }, costUsd: 0, requestId: null, ms: 0, chars: 0, maxTokens: 0, stage, body });
}

/** 이어쓰기에 넘길 이미 쓴 장(HOTFIX-W1 2부 4: 요약이 아니라 원문). */
const writtenOf = (s: Session, chapters: readonly WriterChapter[]) => chapters.filter(c => s.drafts.has(c.n)).map(c => ({ n: c.n, title: c.title, text: renderChapter(s.drafts.get(c.n)!.chapter) }));

export async function runWriter(o: WriterOptions): Promise<WriterRun> {
  const s = session(o);
  const prompt = buildWriterPrompt(o.brief, { knowledge: o.knowledge });
  for (const c of await o.sink.load()) if (s.plan.has(c.n) && !s.drafts.has(c.n)) s.drafts.set(c.n, { chapter: c.chapter, source: c.source });
  const missing = () => prompt.chapters.filter(c => !s.drafts.has(c.n));
  if (missing().length) {
    // HOTFIX-W1 2부 3~5: 사다리. 생각 소진이면 같은 한도로 되풀이하지 않고 한 단 오른다(2단 = 모델 상한). 그 밖의 실패는
    // 예전처럼: 장이 새로 생겼으면 빠진 장 이어쓰기 1회, 아니면 멈춘다(감독이 시간표대로 다음 시도 — 그때도 빠진 장만).
    // sameWant: 본문 0자로 소진한 호출과 같은 장 묶음을 다시 쓰는가(그때만 같은 한도 반복 금지를 건다). 지난 시도 기록의 한도는 첫 호출에만 견준다.
    let stage: LadderStage = o.startStage ?? 1, continued = false, spentLimit = o.exhaustedMaxTokens ?? 0, sameWant = (o.exhaustedMaxTokens ?? 0) > 0;
    const budget = o.budgetMs ?? WRITER_TIME_BUDGET_MS;
    for (let round = 0; round < 3 && missing().length && !s.stale; round++) {
      const rest = missing(), cont = s.drafts.size > 0;
      const p = cont ? buildContinuationPrompt(o.brief, writtenOf(s, prompt.chapters), rest, { knowledge: o.knowledge }) : prompt;
      const kind = cont ? "continuation" as const : "first" as const;
      // 이어 쓰기는 예전처럼 검수·수리 몫을 빼고도 1분 넘게 남았을 때만(시간이 없으면 다음 시도가 빠진 장만 쓴다).
      if (round > 0 && leftOf(s) - postWriterMs(budget) < 60_000) { skipWriter(s, kind, stage, maxTokensFor(rest, s.target.model), "time"); break; }
      const lim = writerLimit(s, rest, stage, p.system.length + p.user.length);
      if (lim.reason) { skipWriter(s, kind, stage, lim.body, lim.reason); if (s.exhausted || stage >= 2) s.ladderEnd = true; break; }
      // 본문 0자 생각 소진 뒤 같은 장을 다시 쓸 때는 더 큰 한도만(1.1배 미만이면 같은 호출 반복 — 부르지 않고 사다리 끝).
      if (sameWant && spentLimit > 0 && lim.maxTokens < spentLimit * 1.1) { skipWriter(s, kind, stage, lim.body, "no_headroom"); s.ladderEnd = true; break; }
      const before = s.drafts.size;
      const r = await call(s, kind, p.system, p.user, rest, undefined, undefined, { maxTokens: lim.maxTokens, body: lim.body, stage });
      if (s.stale || !missing().length) break;
      if (r.cls === "thinking_exhausted") {
        s.exhausted = stage;
        sameWant = s.drafts.size === before;
        if (sameWant) spentLimit = Math.max(spentLimit, lim.maxTokens);
        if (stage >= 2) { s.ladderEnd = true; break; }
        stage = 2;
        continue;
      }
      sameWant = false;
      if (s.drafts.size > before && !continued) { continued = true; continue; }
      break;
    }
  } else if (s.drafts.size) {
    // 최종판3 6: 저장된 장만으로 다시 시작(워커가 발행 전에 끊긴 재시도). 첫 호출 원문이 저장돼 있으면 그 원문으로 표지·작가를 되살린다(호출 0).
    // 원문이 없으면 저장된 장(작가 원고)의 작가 모델로 본다 — 검수·수리가 건너뛰지 않게(작가는 다시 부르지 않는다).
    let hit: RawEntry | null = null;
    try { hit = o.cache ? await o.cache.get(rawKey(s.target.model, prompt.system, prompt.user)) : null; } catch { hit = null; }
    if (hit) await call(s, "first", prompt.system, prompt.user, prompt.chapters);
    else if (!s.wrote) s.wrote = s.target;
  }
  // 대체 모델도 쓰지 못했으면 최후 대체는 결정론 작가(안전망이 채운다).
  return finish(s);
}

/**
 * (P6c A5) 글만 받는 호출 1회(수리·소제목 재작성·표지 줄 수리·검수). 같은 모델·대체 규칙·원문·상한, 장 저장 없음.
 * HOTFIX-W1 2부 7: 같은 계층 — 생각 소진(length·글자 0)이면 같은 한도로 되풀이하지 않고 모델 상한까지 한 번 올려 부른다.
 * 단 올린 한도의 최악 비용이 남은 예산(reserveAfterUsd를 뺀 값) 안이고 시간이 남을 때만. 아니면 예전처럼 건너뛴다("").
 */
export async function completeText(o: WriterOptions, prev: WriterRun, system: string, user: string, maxTokens: number, kind: "repair" | "rewrite" | "cover" | "review" = "repair", jsonSchema?: Readonly<Record<string, unknown>>, reserveAfterUsd = 0): Promise<{ run: WriterRun; text: string }> {
  const s = session(o, prev);
  if (!s.wrote || leftOf(s) < 60_000) return { run: finish(s), text: "" };
  const cap = MODEL_OUTPUT_CAP[s.target.model] ?? maxTokens;
  const first = Math.min(maxTokens, cap);
  const r = await call(s, kind, system, user, null, first, jsonSchema);
  if (r.cls !== "thinking_exhausted" || first >= cap || s.stale) return { run: finish(s), text: r.text };
  const p = priceFor(s.target.provider, s.target.model), inUsd = inputWorstUsd(s.target.provider, s.target.model, system.length + user.length);
  const left = o.costCapUsd === undefined ? Infinity : o.costCapUsd - s.cost - reserveAfterUsd;
  const byCost = p && inUsd !== null ? Math.floor(((left - inUsd) * 1e6) / p.output) : 0;
  const byTime = Math.floor(((leftOf(s) - 30_000) / 1000) * WRITER_TOKENS_PER_SEC);
  const second = Math.min(cap, byCost, byTime);
  if (second <= first) return { run: finish(s), text: "" };
  const r2 = await call(s, kind, system, user, null, second, jsonSchema);
  return { run: finish(s), text: r2.text };
}
