/**
 * 작가 실행기(P3 C). 책 1권 = 스트리밍 호출 1회(정상 시). SPEC §4 방어:
 *  1) 출력 0인 실패(연결·429·5xx·과부하)만 시간 예산 안에서 재시도한다.
 *  2) 중간 끊김·length 종료면 받은 장은 확정하고, 누락 장만 이어쓰기 1회(브리프 + 이미 쓴 장의 요약 + 남은 장 목록).
 *  1-1) (P6b A-2) 대체 모델(fallback)이 있으면, 기본 모델이 출력 0으로 실패할 때(스트리밍 시작 전) 재시도 대신 대체 모델로 한 번 전환한다.
 *  3) 그래도 누락된 장은 안전망 단계에서 결정론 작가가 채운다(여기서는 비워 둔다).
 *  4) 장 경계마다 완성된 장을 저장소에 저장한다(워커가 죽어도 회수 크론이 저장된 장으로 Book을 완성).
 *  5) (P6c I) 안전망이 짧다·비었다고 판정한 장만 1회 다시 요청한다(redoChapters). (P6c A5) 검사에 걸린 문단 수리는 completeText 1회.
 * 저장소가 lease를 잃었다고 하면(save=false) 스트림을 끊고 stale로 끝낸다(회수 쪽이 이어받음).
 */
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

export type SavedChapter = { readonly n: number; readonly chapter: BookChapter; readonly source: DraftChapter["source"] };
/** 장 저장소. save가 false면 lease를 잃은 것(다른 워커·회수 크론이 이어받음). */
export type ChapterSink = { save(c: SavedChapter): Promise<boolean>; load(): Promise<readonly SavedChapter[]> };
export type WriterTarget = { readonly provider: LlmProvider; readonly model: string; readonly apiKey?: string };
export type WriterFallback = { readonly from: { provider: string; model: string }; readonly to: { provider: string; model: string } | "deterministic"; readonly reason: string };
export type CallKind = "first" | "retry" | "continuation" | "fallback" | "redo" | "repair" | "rewrite";
export type CallLog = { readonly kind: CallKind; readonly provider?: string; readonly model?: string; readonly finish: StreamCompletionResult["finishReason"]; readonly error?: string; readonly usage: LlmUsage; readonly costUsd: number | null; readonly requestId: string | null; readonly ms: number; readonly chars: number; readonly maxTokens: number };
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
};

const RETRYABLE = /^(network|stream_interrupted|stream_ended|empty_body|invalid_event|timeout|overloaded_error|api_error|rate_limit_error|http_429|http_5\d\d)$/;
/** 출력 0인 실패만 재시도 대상(비용이 들지 않음). */
export function isZeroOutputRetryable(r: Pick<StreamCompletionResult, "text" | "finishReason" | "error">): boolean {
  return r.text.length === 0 && r.finishReason !== "complete" && r.finishReason !== "length" && RETRYABLE.test(r.error?.code ?? "");
}

/** 대체로 넘길 실패: 출력 0이고 lease를 잃어 끊은 것(aborted)이 아니면 무엇이든(401·거절·과부하·네트워크). */
export const isZeroOutputFailure = (r: Pick<StreamCompletionResult, "text" | "finishReason" | "error">) => r.text.length === 0 && r.finishReason !== "complete" && r.error?.code !== "aborted";

const summaryOf = (c: BookChapter) => `${c.sections.map(s => s.heading).filter(Boolean).slice(0, 5).join(" / ")} — ${(c.sections[0]?.paragraphs[0] ?? "").slice(0, 80)}`;
/** 원문 맨 앞(첫 장 머리글 앞)의 "[표지] …" 한 줄(P6c G). */
export const coverOf = (text: string) => text.split(/\n##\s/)[0].match(/^\s*\[표지\]\s*(.+?)\s*$/m)?.[1] ?? null;

/** 작가 세션: 호출 기록·비용·장 원고를 모은다. runWriter·redoChapters·completeText가 같은 세션 규칙(재시도·대체·저장)을 쓴다. */
type Session = {
  readonly o: WriterOptions; readonly drafts: Map<number, DraftChapter>; readonly calls: CallLog[];
  readonly usage: { inputTokens: number; cachedInputTokens: number; outputTokens: number };
  cost: number; outputChars: number; stale: boolean; target: WriterTarget; fallback: WriterFallback | null; wrote: WriterTarget | null; cover: string | null;
  readonly started: number; readonly plan: ReadonlyMap<number, WriterChapter>;
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
    started: now(o), plan,
  };
}

/**
 * 한 번의 호출(재시도·대체 포함). want가 있으면 장 경계마다 저장한다(없으면 글만 돌려준다: 수리 패스).
 * 돌려주는 값: 받은 글(출력이 없으면 "").
 */
async function call(s: Session, kind: "first" | "continuation" | "redo" | "repair" | "rewrite", system: string, user: string, want: readonly WriterChapter[] | null, maxTokensOverride?: number): Promise<string> {
  const o = s.o, sleep = o.sleep ?? (ms => new Promise(r => setTimeout(r, ms))), stream = o.stream ?? streamCompletion;
  const wanted = new Set((want ?? []).map(c => c.n));
  let switched = false;
  for (let attempt = 0; ; attempt++) {
    const maxTokens = maxTokensOverride ?? maxTokensFor(want ?? [], s.target.model, o.maxOutputTokens);
    const controller = new AbortController();
    let text = "", saving = Promise.resolve();
    const flush = (finished: boolean) => {
      if (!want) return;
      for (const ch of completedChapters(text, finished)) {
        // 다시 요청한 장(redo)은 이전 원고를 덮는다.
        if (!wanted.has(ch.n) || (kind !== "redo" && s.drafts.has(ch.n))) continue;
        const saved: DraftChapter = { chapter: { ...ch, title: s.plan.get(ch.n)!.title }, source: kind === "first" ? "writer" : "continuation" };
        s.drafts.set(ch.n, saved); wanted.delete(ch.n);
        saving = saving.then(async () => { if (s.stale) return; if (!(await o.sink.save({ n: ch.n, ...saved }))) { s.stale = true; controller.abort(); } });
      }
    };
    const t0 = now(o);
    const result = await stream({ provider: s.target.provider, model: s.target.model, system, user, maxOutputTokens: maxTokens, timeoutMs: Math.max(1_000, leftOf(s) - 5_000), apiKey: s.target.apiKey, fetchImpl: o.fetchImpl, signal: controller.signal,
      onText: d => { text += d; if (d.includes("\n")) flush(false); } });
    text = result.text;
    // 완전히 끝났을 때만 마지막 장도 완성으로 친다(length·끊김이면 마지막 장은 잘렸을 수 있음).
    flush(result.finishReason === "complete");
    await saving;
    for (const k of ["inputTokens", "cachedInputTokens", "outputTokens"] as const) s.usage[k] += result.usage[k];
    s.cost += result.costUsd ?? 0; s.outputChars += result.text.length;
    s.calls.push({ kind: switched && attempt === 0 ? "fallback" : attempt ? "retry" : kind, provider: s.target.provider, model: s.target.model, finish: result.finishReason, ...(result.error ? { error: result.error.code } : {}), usage: result.usage, costUsd: result.costUsd, requestId: result.requestId, ms: now(o) - t0, chars: result.text.length, maxTokens });
    if (s.stale) return text;
    if (result.text.length > 0) { s.wrote = s.target; if (kind === "first" && !s.cover) s.cover = coverOf(result.text); }
    // 스트리밍 시작 전 실패: 대체 모델로 한 번 전환(재시도보다 먼저). 대체도 출력 0이면 아래 재시도 규칙 → 결정론.
    if (isZeroOutputFailure(result) && o.fallback && !s.fallback && leftOf(s) > 60_000) {
      s.fallback = { from: { provider: s.target.provider, model: s.target.model }, to: { provider: o.fallback.provider, model: o.fallback.model }, reason: result.error?.code ?? result.finishReason };
      s.target = o.fallback; switched = true; attempt = -1;
      continue;
    }
    // 잘린 수리 응답도 돌려준다(수리 파서가 끝까지 온 문단만 쓴다).
    if (!isZeroOutputRetryable(result)) return result.text;
    const wait = Math.min(30_000, 2_000 * 2 ** attempt);
    if (leftOf(s) - wait < 30_000) return "";
    await sleep(wait);
  }
}

function finish(s: Session): WriterRun {
  const w = s.wrote, f = s.fallback;
  return { drafts: s.drafts, calls: s.calls, stale: s.stale, usage: s.usage, costUsd: Math.round(s.cost * 1e8) / 1e8, outputChars: s.outputChars, writer: w ? { provider: w.provider, model: w.model } : null, fallback: f && !w ? { ...f, to: "deterministic" } : f, cover: s.cover };
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
  }
  // 대체 모델도 쓰지 못했으면 최후 대체는 결정론 작가(안전망이 채운다).
  return finish(s);
}

/** (P6c I) 안전망이 짧다·비었다고 본 장만 1회 다시 요청한다. 이미 쓴 장은 요약만 보여 주고, 다시 쓴 장은 이전 원고를 덮는다. */
export async function redoChapters(o: WriterOptions, prev: WriterRun, targets: readonly WriterChapter[]): Promise<WriterRun> {
  const s = session(o, prev);
  if (!targets.length || !s.wrote || leftOf(s) < 90_000) return finish(s);
  const all = buildWriterPrompt(o.brief, { knowledge: o.knowledge }).chapters;
  const redo = new Set(targets.map(t => t.n));
  const written = all.filter(c => s.drafts.has(c.n) && !redo.has(c.n)).map(c => ({ n: c.n, title: c.title, summary: summaryOf(s.drafts.get(c.n)!.chapter) }));
  const p = buildContinuationPrompt(o.brief, written, targets, { knowledge: o.knowledge });
  await call(s, "redo", p.system, `${p.user}\n\n(이 장들은 앞서 목표 분량의 절반도 안 되거나 비어 있었다. 절마다 근거 2개 이상으로 targetChars를 채운다.)`, targets);
  return finish(s);
}

/** (P6c A5) 글만 받는 호출 1회(수리 패스·P6e 소제목 재작성). 같은 모델·대체 규칙, 장 저장 없음. */
export async function completeText(o: WriterOptions, prev: WriterRun, system: string, user: string, maxTokens: number, kind: "repair" | "rewrite" = "repair"): Promise<{ run: WriterRun; text: string }> {
  const s = session(o, prev);
  if (!s.wrote || leftOf(s) < 60_000) return { run: finish(s), text: "" };
  const text = await call(s, kind, system, user, null, Math.min(maxTokens, MODEL_OUTPUT_CAP[s.target.model] ?? maxTokens));
  return { run: finish(s), text };
}
