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
 * 저장소가 lease를 잃었다고 하면(save=false) 스트림을 끊고 stale로 끝낸다(회수 쪽이 이어받음).
 */
import { createHash } from "node:crypto";
import { streamCompletion, type LlmProvider, type LlmUsage, type StreamCompletionResult } from "@/lib/llm";
import type { Knowledge } from "@/lib/brief/knowledge";
import type { Brief } from "@/lib/brief/schema";
import { completedChapters, type BookChapter } from "./format";
import { buildContinuationPrompt, buildWriterPrompt, WRITER_TARGET_FACTOR, type WriterChapter } from "./prompt";
import type { DraftChapter } from "./safety";

/** 글자당 출력 토큰. 한글 1.5자 ≈ 1토큰(P2 size.ts 추정). OpenAI 실호출 실측은 docs/v5/api-cost-log.md, Claude 실측은 P6. */
export const TOKENS_PER_CHAR = 1 / 1.5;
/** 작가 호출 전체 시간 예산(워커 maxDuration 800초 안에서 조립·발행 몫 100초를 남긴다). */
export const WRITER_TIME_BUDGET_MS = 700_000;
/** 모델 출력 상한(토큰). 모르는 모델은 상한 없이 공식만 쓴다. */
export const MODEL_OUTPUT_CAP: Readonly<Record<string, number>> = { "gpt-4o-mini": 16_384, "gpt-5-nano": 128_000, "claude-sonnet-5-5": 64_000, "claude-haiku-5-5": 64_000, "claude-opus-5-5": 64_000, "gpt-6.1-terra": 128_000 };

/** 모델별 한글 글자당 출력 토큰(P6 실측: Sonnet 5.5 약 1.1, gpt-6.1-terra 약 0.9). 없으면 TOKENS_PER_CHAR. */
export const MODEL_TOKENS_PER_CHAR: Readonly<Record<string, number>> = { "claude-sonnet-5-5": 1.1, "gpt-6.1-terra": 1.0 };
/** 표지 한 줄·key마다 카드 줄 3개·핵심 문장 기호(P6c F1·G·H)의 몫(글자). */
const EXTRA_CHARS = { book: 60, key: 140 } as const;

/** max_tokens = (장 분량 상한 합계 + 표지·카드 몫) × 글자당 토큰 × 1.3 (반복 장은 key 수만큼). 모델 상한·운영 상한(LLM_MAX_OUTPUT_TOKENS)으로 자른다. */
export function maxTokensFor(chapters: readonly WriterChapter[], model?: string, limit?: number): number {
  // 작가가 보는 목표는 WRITER_TARGET_FACTOR배(P6b C-4)라 그만큼 여유를 둔다.
  const chars = chapters.reduce((s, c) => s + c.targetChars[1] * (c.keys?.length ?? 1), 0) * WRITER_TARGET_FACTOR
    + EXTRA_CHARS.book + chapters.reduce((s, c) => s + (c.keys?.length ?? 0) * EXTRA_CHARS.key, 0);
  const tokens = Math.ceil(chars * (model ? MODEL_TOKENS_PER_CHAR[model] ?? TOKENS_PER_CHAR : TOKENS_PER_CHAR) * 1.3);
  const cap = Math.min(model ? MODEL_OUTPUT_CAP[model] ?? Infinity : Infinity, limit && limit > 0 ? limit : Infinity);
  return Math.min(cap, tokens);
}

/** preview(AM 4부): 먼저 읽기용 결정론 미리보기(사실·금지 규칙 문장을 가림). 저장소는 함께 저장하고 화면만 쓴다(발행 원고가 아니다). */
export type SavedChapter = { readonly n: number; readonly chapter: BookChapter; readonly source: DraftChapter["source"]; readonly preview?: import("./preview").ChapterPreview; readonly total?: number };
/** AM 4부: 장 저장 행에 진행률·미리보기를 함께 둔다(chapter JSON 안 _total·_preview, 저장 SQL은 그대로). 읽을 때는 뗀다. */
export function chapterForStore(c: SavedChapter): Record<string, unknown> { return { ...c.chapter, ...(c.total ? { _total: c.total } : {}), ...(c.preview ? { _preview: c.preview } : {}) }; }
export function chapterFromStore(x: unknown): BookChapter { const { _total: _t, _preview: _p, ...rest } = (x ?? {}) as Record<string, unknown>; void _t; void _p; return rest as unknown as BookChapter; }
/** 장 저장소. save가 false면 lease를 잃은 것(다른 워커·회수 크론이 이어받음). */
export type ChapterSink = { save(c: SavedChapter): Promise<boolean>; load(): Promise<readonly SavedChapter[]> };
export type WriterTarget = { readonly provider: LlmProvider; readonly model: string; readonly apiKey?: string };
export type WriterFallback = { readonly from: { provider: string; model: string }; readonly to: { provider: string; model: string } | "deterministic"; readonly reason: string };
/** "redo"는 옛 Book 메타에만 있다(최종판 0-1: 장 재요청 경로를 없앴다). "cover"는 표지 줄 수리(1-7). */
export type CallKind = "first" | "retry" | "continuation" | "fallback" | "redo" | "repair" | "rewrite" | "cover" | "review";
/** cached: 저장된 원문을 썼다(호출 0). */
export type CallLog = { readonly kind: CallKind; readonly provider?: string; readonly model?: string; readonly finish: StreamCompletionResult["finishReason"]; readonly error?: string; readonly usage: LlmUsage; readonly costUsd: number | null; readonly requestId: string | null; readonly ms: number; readonly chars: number; readonly maxTokens: number; readonly cached?: boolean; readonly key?: string; readonly hidden?: StreamCompletionResult["hidden"] };
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
};

const RETRYABLE = /^(network|stream_interrupted|stream_ended|empty_body|invalid_event|timeout|overloaded_error|api_error|rate_limit_error|http_429|http_5\d\d)$/;
/**
 * AM 7부(덕짱님 결정 2026-11-11): 본문 0자인데 출력 상한을 다 쓴 응답(생각 블록 하나로 상한 소진 — between_tools인데도, 개발 17회 중 4회·같은 입력 연속 재현).
 * 비용은 들었지만 원고는 없다 → 작가 호출(첫·이어쓰기)만 1회, 생각을 짧게 허용(adaptive, effort low)해 다시 부른다.
 */
export function isHiddenOnlyLength(r: Pick<StreamCompletionResult, "text" | "finishReason" | "usage">): boolean {
  return r.text.length === 0 && r.finishReason === "length" && r.usage.outputTokens > 0;
}
/** 출력 0인 실패만 재시도 대상(비용이 들지 않음). */
export function isZeroOutputRetryable(r: Pick<StreamCompletionResult, "text" | "finishReason" | "error">): boolean {
  return r.text.length === 0 && r.finishReason !== "complete" && r.finishReason !== "length" && RETRYABLE.test(r.error?.code ?? "");
}

/** 대체로 넘길 실패: 출력 0이고 lease를 잃어 끊은 것(aborted)이 아니면 무엇이든(401·거절·과부하·네트워크). */
export const isZeroOutputFailure = (r: Pick<StreamCompletionResult, "text" | "finishReason" | "error">) => r.text.length === 0 && r.finishReason !== "complete" && r.error?.code !== "aborted";

const summaryOf = (c: BookChapter) => `${c.sections.map(s => s.heading).filter(Boolean).slice(0, 5).join(" / ")} — ${(c.sections[0]?.paragraphs[0] ?? "").slice(0, 80)}`;
/** 원문 맨 앞(첫 장 머리글 앞)의 "[표지] …" 한 줄(P6c G). */
export const coverOf = (text: string) => text.split(/\n##\s/)[0].match(/^\s*\[표지\]\s*(.+?)\s*$/m)?.[1] ?? null;

/** 작가 세션: 호출 기록·비용·장 원고를 모은다. runWriter·completeText가 같은 세션 규칙(재시도·대체·저장·원문·상한)을 쓴다. */
type Session = {
  readonly o: WriterOptions; readonly drafts: Map<number, DraftChapter>; readonly calls: CallLog[];
  readonly usage: { inputTokens: number; cachedInputTokens: number; outputTokens: number };
  cost: number; outputChars: number; stale: boolean; target: WriterTarget; fallback: WriterFallback | null; wrote: WriterTarget | null; cover: string | null;
  readonly started: number; readonly plan: ReadonlyMap<number, WriterChapter>; readonly raw: RawEntry[]; capped: boolean;
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
    started: now(o), plan, raw: [...(prev?.raw ?? [])], capped: prev?.capped ?? false,
  };
}

/**
 * 한 번의 호출(재시도·대체 포함). want가 있으면 장 경계마다 저장한다(없으면 글만 돌려준다: 수리 패스).
 * 돌려주는 값: 받은 글(출력이 없으면 "").
 */
async function call(s: Session, kind: "first" | "continuation" | "repair" | "rewrite" | "cover" | "review", system: string, user: string, want: readonly WriterChapter[] | null, maxTokensOverride?: number, jsonSchema?: Readonly<Record<string, unknown>>): Promise<string> {
  const o = s.o, sleep = o.sleep ?? (ms => new Promise(r => setTimeout(r, ms)));
  const wanted = new Set((want ?? []).map(c => c.n));
  let switched = false, thinking: "adaptive-low" | undefined;
  for (let attempt = 0; ; attempt++) {
    // 원문 저장소(0-2): 같은 입력이면 저장본을 흘려보낸다(호출 0). 상한(0-6): 넘었으면 부르지 않는다.
    const key = rawKey(s.target.model, system, user);
    let hit: RawEntry | null = null;
    try { hit = o.cache ? await o.cache.get(key) : null; } catch { hit = null; }
    // 최종판3 6: 운영 주문은 예산으로 거절하지 않는다 — 비용 상한은 작가 뒤 호출(검수·수리·표지·재작성)에만 건다. 작가(첫 호출·이어쓰기)는 늘 부른다.
    if (!hit && o.costCapUsd !== undefined && s.cost >= o.costCapUsd && kind !== "first" && kind !== "continuation") {
      s.capped = true;
      s.calls.push({ kind, provider: s.target.provider, model: s.target.model, finish: "error", error: "cost_cap", usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }, costUsd: 0, requestId: null, ms: 0, chars: 0, maxTokens: 0, key });
      return "";
    }
    const stream: typeof streamCompletion = hit ? (async input => { input.onText?.(hit!.text); return { text: hit!.text, finishReason: hit!.finish, usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }, costUsd: 0, requestId: "cache" }; }) : o.stream ?? streamCompletion;
    const maxTokens = maxTokensOverride ?? maxTokensFor(want ?? [], s.target.model, o.maxOutputTokens);
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
    const result = await stream({ provider: s.target.provider, model: s.target.model, system, user, maxOutputTokens: maxTokens, timeoutMs: Math.max(1_000, leftOf(s) - 5_000), apiKey: s.target.apiKey, fetchImpl: o.fetchImpl, signal: controller.signal, ...(thinking ? { thinking } : {}),
      ...(jsonSchema ? { jsonSchema } : {}), ...(o.cacheSystem === false ? { cacheSystem: false } : {}),
      onText: d => { text += d; if (d.includes("\n")) flush(false); } });
    text = result.text;
    // 완전히 끝났을 때만 마지막 장도 완성으로 친다(length·끊김이면 마지막 장은 잘렸을 수 있음).
    flush(result.finishReason === "complete");
    await saving;
    for (const k of ["inputTokens", "cachedInputTokens", "outputTokens"] as const) s.usage[k] += result.usage[k];
    s.cost += result.costUsd ?? 0; s.outputChars += result.text.length;
    s.calls.push({ kind: switched && attempt === 0 ? "fallback" : attempt ? "retry" : kind, provider: s.target.provider, model: s.target.model, finish: result.finishReason, ...(result.error ? { error: result.error.code } : {}), usage: result.usage, costUsd: result.costUsd, requestId: result.requestId, ms: now(o) - t0, chars: result.text.length, maxTokens, key, ...(hit ? { cached: true } : {}), ...(result.hidden ? { hidden: result.hidden } : {}) });
    if (result.text.length > 0) {
      const entry: RawEntry = { key, kind, provider: s.target.provider, model: s.target.model, ...(want ? { chapters: want.map(c => c.n) } : {}), finish: result.finishReason, text: result.text, costUsd: hit ? hit.costUsd : result.costUsd ?? 0 };
      s.raw.push(entry);
      if (!hit && o.cache) { try { await o.cache.put(entry, { system, user }); } catch { /* 저장 실패는 원고를 막지 않는다 */ } }
    }
    if (s.stale) return text;
    // AM 7부: 생각만으로 상한을 다 쓴 빈 원고 → 작가 호출만 1회, 짧은 생각으로 다시(호출 기록 kind "retry"). 두 번째도 빈 원고면 아래 규칙대로 결정론.
    if (!hit && !thinking && (kind === "first" || kind === "continuation") && isHiddenOnlyLength(result) && s.target.provider === "anthropic" && leftOf(s) > 60_000) { thinking = "adaptive-low"; continue; }
    if (result.text.length > 0) { s.wrote = s.target; if (kind === "first" && !s.cover) s.cover = coverOf(result.text); }
    // 스트리밍 시작 전 실패: 대체 모델로 한 번 전환(재시도보다 먼저). 대체도 출력 0이면 아래 재시도 규칙 → 결정론.
    if (isZeroOutputFailure(result) && o.fallback && !s.fallback && leftOf(s) > 60_000) {
      s.fallback = { from: { provider: s.target.provider, model: s.target.model }, to: { provider: o.fallback.provider, model: o.fallback.model }, reason: result.error?.code ?? result.finishReason };
      s.target = o.fallback; switched = true; attempt = -1;
      continue;
    }
    // 잘린 수리 응답도 돌려준다(수리 파서가 끝까지 온 문단만 쓴다).
    if (!isZeroOutputRetryable(result)) return result.text;
    // 최종판3 6: 응답 없이 끊긴 경우(출력 0)만 1회 다시 부른다(호출 기록 kind "retry"로 원장에 남는다). 그 뒤는 부르지 않는다.
    if (attempt >= 1) return "";
    const wait = Math.min(30_000, 2_000 * 2 ** attempt);
    if (leftOf(s) - wait < 30_000) return "";
    await sleep(wait);
  }
}

function finish(s: Session): WriterRun {
  const w = s.wrote, f = s.fallback;
  return { drafts: s.drafts, calls: s.calls, stale: s.stale, usage: s.usage, costUsd: Math.round(s.cost * 1e8) / 1e8, outputChars: s.outputChars, writer: w ? { provider: w.provider, model: w.model } : null, fallback: f && !w ? { ...f, to: "deterministic" } : f, cover: s.cover, raw: s.raw, capped: s.capped };
}

export async function runWriter(o: WriterOptions): Promise<WriterRun> {
  const s = session(o);
  const prompt = buildWriterPrompt(o.brief, { knowledge: o.knowledge });
  for (const c of await o.sink.load()) if (s.plan.has(c.n) && !s.drafts.has(c.n)) s.drafts.set(c.n, { chapter: c.chapter, source: c.source });
  const missing = () => prompt.chapters.filter(c => !s.drafts.has(c.n));
  if (missing().length) {
    const produced = s.drafts.size > 0 || (await call(s, "first", prompt.system, prompt.user, prompt.chapters)).length > 0;
    const rest = missing();
    if (!s.stale && produced && rest.length && leftOf(s) > 60_000) {
      const written = prompt.chapters.filter(c => s.drafts.has(c.n)).map(c => ({ n: c.n, title: c.title, summary: summaryOf(s.drafts.get(c.n)!.chapter) }));
      const cont = buildContinuationPrompt(o.brief, written, rest, { knowledge: o.knowledge });
      await call(s, "continuation", cont.system, cont.user, rest);
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

/** (P6c A5) 글만 받는 호출 1회(수리·소제목 재작성·표지 줄 수리). 같은 모델·대체 규칙·원문·상한, 장 저장 없음. */
export async function completeText(o: WriterOptions, prev: WriterRun, system: string, user: string, maxTokens: number, kind: "repair" | "rewrite" | "cover" | "review" = "repair", jsonSchema?: Readonly<Record<string, unknown>>): Promise<{ run: WriterRun; text: string }> {
  const s = session(o, prev);
  if (!s.wrote || leftOf(s) < 60_000) return { run: finish(s), text: "" };
  const text = await call(s, kind, system, user, null, Math.min(maxTokens, MODEL_OUTPUT_CAP[s.target.model] ?? maxTokens), jsonSchema);
  return { run: finish(s), text };
}
