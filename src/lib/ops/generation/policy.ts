/**
 * 생성 신뢰성 정책(P6d-ops 7). 순수 함수만 — 시험이 시각을 넣어 24시간을 그대로 돌려 본다.
 * 정식본 = Sonnet이 쓴 원고만(결정론 장 0). terra(OpenAI)는 정식본에 쓰지 않고, Sonnet이 2시간 넘게 실패했을 때 "임시본"으로만 보인다.
 */
import type { ChapterMeta, WriterMeta } from "../../writer/book";
import type { CallLog, LadderStage, WriterRun } from "../../writer/runner";

const MIN = 60_000, HOUR = 60 * MIN;
/** 출력 전 실패·중간 끊김 뒤 다음 시도까지(n번째 실패 → n번째 값, 끝 값은 반복). */
export const RETRY_DELAYS_MS = [1 * MIN, 5 * MIN, 15 * MIN, 1 * HOUR, 3 * HOUR, 6 * HOUR] as const;
/**
 * 첫 실패부터 이 시간까지만 다시 시도한다 — 지나면 포기 + 자동 환불(결제)·이용권 환급(이용권).
 * HOTFIX-W1 3부 4: 설정값 AUTO_REFUND_HOURS(1~72시간, 없거나 잘못되면 기본 6시간 — 덕짱님 결정 2026-11-13, 이전 24시간).
 * 기한은 주문마다 저장하지 않고 book_generation_state.first_failure_at + 이 값으로 매번 계산한다 → 진행 중인 주문도 다음 판단부터 새 값을 따른다.
 */
export const AUTO_REFUND_HOURS_DEFAULT = 6;
export const RETRY_WINDOW_MS = AUTO_REFUND_HOURS_DEFAULT * HOUR;
export function autoRefundHours(env: Readonly<Record<string, string | undefined>> = process.env): number {
  const v = Number(env.AUTO_REFUND_HOURS);
  return Number.isFinite(v) && v >= 1 && v <= 72 ? v : AUTO_REFUND_HOURS_DEFAULT;
}
export const retryWindowMs = (env: Readonly<Record<string, string | undefined>> = process.env) => autoRefundHours(env) * HOUR;
/** Sonnet이 첫 실패부터 이 시간 넘게 실패하면(OpenAI가 쓸 수 있을 때만) 임시본을 만든다. */
export const INTERIM_AFTER_MS = 2 * HOUR;
/** 정식본·임시본 모델. 정식본은 환경 설정(LLM_PROVIDER 등)과 무관하게 Sonnet으로 고정한다. */
export const OFFICIAL_TARGET = { provider: "anthropic", model: "claude-sonnet-5-5" } as const;
export const INTERIM_TARGET = { provider: "openai", model: "gpt-6.1-terra" } as const;

/**
 * 주문당 비용 상한(HOTFIX-W1 2부 6, USD): 작가 호출을 포함한 한 주문(Book)의 모든 시도 비용 합. 이 안에서만 부르고(작가 한도는 최악 비용이 남은 예산 안에
 * 들어오게 깎는다 — runner.writerLimit), 본문도 못 쓸 만큼 남으면 부르지 않고 보류 → 즉시 운영 알림. 진행 중인 주문도 다음 시도부터 같은 규칙.
 * 기본 = 정상 1권 비용 × 2.5. 정상 1권 비용(NORMAL_BOOK_USD) = 옛 작가 한도(본문 추정, maxTokensFor)를 끝까지 쓴 작가 1회 + 검수 + 수리 —
 * 생각 소진 없이 끝나는 책이 들 수 있는 값(운영 11-06~13 완성 13권 실측 $0.19~0.27, 입력 $0.04~0.07).
 * 설정값 ORDER_COST_CAP_USD(0~10)가 있으면 상품과 무관하게 그 값. 관리자 재생성(교체 레인)은 재생성 요청 뒤 시도만 센다.
 */
export const NORMAL_BOOK_USD: Readonly<Record<string, number>> = {
  saju_mbti_full: 0.38, career_money_study: 0.36, love_marriage_child: 0.34, saju_mbti_compatibility: 0.36, major_fortune: 0.42, annual_fortune: 0.40,
};
export const ORDER_COST_CAP_MULTIPLIER = 2.5;
/** 상품을 모를 때의 정상 1권 비용. */
export const NORMAL_BOOK_USD_DEFAULT = 0.4;
/** 최종판3 6(옛 값, 기록용): 검수·수리만 거는 상한이었다. HOTFIX-W1부터는 orderCostCap(상품)이 작가를 포함해 건다. */
export const ORDER_COST_CAP_USD = 0.55;
/** 작가 입력 상한(글자): 최악 비용 계산의 전제. 넘으면 경고만 남긴다(작가는 부른다). */
export const WRITER_INPUT_CAP_CHARS = 40_000;
export function orderCostCap(product?: string | null, env: Readonly<Record<string, string | undefined>> = process.env): number {
  const v = Number(env.ORDER_COST_CAP_USD);
  if (env.ORDER_COST_CAP_USD !== undefined && Number.isFinite(v) && v > 0 && v <= 10) return v;
  return Math.round((NORMAL_BOOK_USD[product ?? ""] ?? NORMAL_BOOK_USD_DEFAULT) * ORDER_COST_CAP_MULTIPLIER * 1e4) / 1e4;
}

type RunRow = { cost_usd?: number | string | null; created_at?: string | null; calls?: unknown; lane?: string | null };
const writerCallOf = (c: Partial<CallLog>) => c.kind === "first" || c.kind === "continuation" || c.kind === "retry" || c.kind === "fallback";
/** 지난 기록의 작가 호출이 생각 소진이었나. 옛 기록(분류 없음)은 length + 글자 0을 생각 소진으로, 단계는 0(옛 한도)으로 본다. */
export function exhaustedCall(c: Partial<CallLog>): { stage: 0 | LadderStage; maxTokens: number } | null {
  if (!writerCallOf(c)) return null;
  if (c.cls === "thinking_exhausted") return { stage: c.stage ?? 0, maxTokens: Number(c.maxTokens) || 0 };
  if (c.cls === undefined && c.stage === undefined && c.finish === "length" && Number(c.chars) === 0) return { stage: 0, maxTokens: Number(c.maxTokens) || 0 };
  return null;
}
/**
 * 사다리 시작 단계(HOTFIX-W1 2부 5): 이 주문의 지난 시도(since 뒤, 정식본 모델 호출만)에서 생각 소진으로 끝난 가장 높은 단계 + 1.
 * 3이 되면 사다리 끝(더 부르지 않고 보류). exhaustedMaxTokens: 본문 0자로 소진했을 때 쓴 가장 큰 한도(같은 호출·같은 한도 반복 금지에 쓴다).
 */
export function ladderOf(runs: readonly RunRow[] | undefined, model: string, since?: string | null): { startStage: LadderStage; exhaustedMaxTokens: number; end: boolean } {
  const t = since ? Date.parse(since) : NaN;
  let top = -1, maxTokens = 0;
  for (const r of runs ?? []) {
    if (Number.isFinite(t) && Date.parse(r.created_at ?? "") < t) continue;
    for (const c of Array.isArray(r.calls) ? r.calls as Partial<CallLog>[] : []) {
      if (c.model && c.model !== model) continue;
      const e = exhaustedCall(c);
      if (e) { top = Math.max(top, e.stage); if (!Number(c.chars)) maxTokens = Math.max(maxTokens, e.maxTokens); }
    }
  }
  if (top >= 2) return { startStage: 2, exhaustedMaxTokens: maxTokens, end: true };
  return { startStage: top >= 1 ? 2 : 1, exhaustedMaxTokens: maxTokens, end: false };
}
/** 상한에 걸린 주문을 보류하는 기간: 관리자 "지연" 목록에 사유와 함께 남는다(자동 환불 없음). */
export const COST_HOLD_MS = 30 * 24 * HOUR;
/** 기록된 시도들의 비용 합(since가 있으면 그 뒤 시도만). */
export function spentOf(runs: readonly { cost_usd?: number | string | null; created_at?: string | null }[] | undefined, since?: string | null): number {
  const t = since ? Date.parse(since) : NaN;
  return Math.round((runs ?? []).filter(r => !Number.isFinite(t) || Date.parse(r.created_at ?? "") >= t).reduce((a, r) => a + (Number(r.cost_usd) || 0), 0) * 1e8) / 1e8;
}

/**
 * 「다시 만들기」(HOTFIX-W1 3부 2): 공개 전(만드는 중·보류)이어도 비용 상한 안이면 다음 사다리 단계로 즉시 1회. 아니면 거절 사유.
 * 한 번 시도에 드는 최소 비용 = 정상 1권 비용(옛 한도를 다 쓴 작가 + 검수 + 수리) — 남은 상한이 이보다 작으면 「비용 상한 — 환불 판단 필요」.
 */
export function regenerateNowCheck(a: { runs: readonly RunRow[] | undefined; product: string | null; model?: string; env?: Readonly<Record<string, string | undefined>> }):
  { ok: true; stage: LadderStage; leftUsd: number; capUsd: number } | { ok: false; code: "COST_CAP" | "THINKING_END"; message: string; leftUsd: number; capUsd: number } {
  const cap = orderCostCap(a.product, a.env ?? process.env), spent = spentOf(a.runs as never), left = Math.round((cap - spent) * 1e4) / 1e4;
  const ladder = ladderOf(a.runs, a.model ?? OFFICIAL_TARGET.model);
  const usd = (n: number) => "$" + n.toFixed(2);
  if (ladder.end) return { ok: false, code: "THINKING_END", message: `생각 소진이 2단까지 — 더 큰 한도가 없어요(누적 ${usd(spent)} / 상한 ${usd(cap)}). 환불 판단 필요`, leftUsd: left, capUsd: cap };
  if (left < (NORMAL_BOOK_USD[a.product ?? ""] ?? NORMAL_BOOK_USD_DEFAULT)) return { ok: false, code: "COST_CAP", message: `비용 상한 — 환불 판단 필요(누적 ${usd(spent)} / 상한 ${usd(cap)})`, leftUsd: left, capUsd: cap };
  return { ok: true, stage: ladder.startStage, leftUsd: left, capUsd: cap };
}

/**
 * failures번째 실패(1부터) 뒤 다음 시도 시각. 첫 실패 + 24시간을 넘기면 그 시각에 마지막으로 한 번,
 * 이미 그 시각이 지났으면 null(포기).
 */
export function nextRetryAt(firstFailureAt: number, failures: number, now: number, windowMs: number = retryWindowMs()): number | null {
  const end = firstFailureAt + windowMs;
  if (now >= end - 30_000) return null;
  const at = now + RETRY_DELAYS_MS[Math.min(Math.max(failures, 1), RETRY_DELAYS_MS.length) - 1];
  return Math.min(at, end);
}

/** 보류 시각을 정한다: 임시본을 낼 수 있으면 첫 실패 + 2시간에 맞춰 한 번 깨운다. */
export function deferUntil(a: { firstFailureAt: number; failures: number; now: number; interimPossible: boolean; windowMs?: number }): number | null {
  const next = nextRetryAt(a.firstFailureAt, a.failures, a.now, a.windowMs);
  if (next === null) return null;
  const interimAt = a.firstFailureAt + INTERIM_AFTER_MS;
  return a.interimPossible && a.now < interimAt && next > interimAt ? interimAt : next;
}

/** 이번 시도를 임시본(OpenAI)으로 할지: 정식본 대기 중이고, 첫 실패부터 2시간이 지났고, OpenAI를 쓸 수 있을 때. */
export function interimDue(a: { phase: string; firstFailureAt: number | null; now: number; interimPossible: boolean }): boolean {
  return a.phase === "pending" && a.firstFailureAt !== null && a.now - a.firstFailureAt >= INTERIM_AFTER_MS && a.interimPossible;
}

export type BuildVerdict =
  | { readonly kind: "complete"; readonly keysFilled: readonly number[] }
  | { readonly kind: "incomplete"; readonly reason: string; readonly rejected: readonly number[]; readonly missing: readonly number[]; readonly preOutput: boolean; readonly capped?: boolean;
      /** HOTFIX-W1: 사다리 끝(생각 소진을 더 큰 한도로 풀 수 없음) — 보류. cls: 마지막 작가 호출 실패 분류(알림). stage: 그 호출의 단계. */
      readonly ladderEnd?: boolean; readonly cls?: string; readonly stage?: number }
  | { readonly kind: "stale" };

/**
 * 만든 책을 판정한다. 결정론 장이 하나라도 있으면 정식본·임시본으로 내보내지 않는다.
 * keys_filled(대운·세운 키 일부를 브리프 문단으로 채운 장)는 작가 장으로 본다(SPEC §5 카드 설계, 기록만 남긴다).
 * 최종판 0-1: 작가가 쓴 장은 짧아도 버리지 않으므로 결정론 장은 "빠진 장"뿐이다(rejected는 늘 빈 배열 — 다음 시도는 저장된 장을 그대로 두고 빠진 장만 이어 쓴다).
 * capped: 주문당 비용 상한에 걸려 부르지 못했다(보류).
 */
export function judgeBuild(built: { readonly meta: WriterMeta; readonly run: WriterRun | null }): BuildVerdict {
  if (built.run?.stale) return { kind: "stale" };
  const chapters: readonly ChapterMeta[] = built.meta.chapters;
  const det = chapters.filter(c => c.source === "deterministic");
  const keysFilled = chapters.filter(c => c.source !== "deterministic" && (c.reason ?? "").startsWith("keys_filled")).map(c => c.n);
  if (!det.length && chapters.length) return { kind: "complete", keysFilled };
  const calls = built.run?.calls ?? built.meta.calls;
  const preOutput = calls.every(c => c.chars === 0);
  const errors = [...new Set(calls.map(c => c.error).filter((e): e is string => Boolean(e)))];
  const missing = det.map(c => c.n), capped = Boolean(built.run?.capped), ladderEnd = Boolean(built.run?.ladderEnd);
  const lastWriter = [...calls].reverse().find(c => writerCallOf(c) && (c.cls || c.error));
  const cls = lastWriter?.cls ?? (lastWriter?.error && !["cost_cap", "time", "no_headroom"].includes(lastWriter.error) ? "other" : undefined);
  const reason = capped ? "cost_cap" : ladderEnd ? "thinking_exhausted_end" : cls === "thinking_exhausted" ? "thinking_exhausted" : !chapters.length ? "no_chapters" : errors.length ? errors.join(",") : `missing:${missing.join(",")}`;
  return { kind: "incomplete", reason: (preOutput ? "pre_output:" : "partial:") + reason, rejected: [], missing, preOutput, ...(capped ? { capped } : {}), ...(ladderEnd ? { ladderEnd } : {}),
    ...(cls ? { cls } : {}), ...(lastWriter?.stage ? { stage: lastWriter.stage } : {}) };
}

/** 관리자·Book 메타에 남길 요약(원고·프롬프트·키 없이). */
export function runSummary(built: { readonly meta: WriterMeta; readonly run: WriterRun | null }) {
  const m = built.meta;
  return {
    provider: m.writer?.provider ?? null, model: m.writer?.model ?? null, costUsd: m.costUsd, durationMs: m.durationMs,
    // HOTFIX-W1 1부: 호출마다 stop_reason·usage(입력·캐시·출력)·보낸 max_tokens·생각 설정·블록별 수와 글자·첫 본문까지 ms·사다리 단계·분류(생각 내용 없음).
    calls: m.calls.map(c => ({ kind: c.kind, provider: c.provider, model: c.model, finish: c.finish, ...(c.error ? { error: c.error } : {}), chars: c.chars, costUsd: c.costUsd ?? 0, ms: c.ms,
      maxTokens: c.maxTokens, usage: c.usage, ...(c.cached ? { cached: true } : {}), ...(c.stop !== undefined ? { stop: c.stop } : {}), ...(c.sent ? { sent: c.sent } : {}), ...(c.blocks ? { blocks: c.blocks } : {}),
      ...(c.firstTextMs !== undefined ? { firstTextMs: c.firstTextMs } : {}), ...(c.thinkingTokens !== undefined ? { thinkingTokens: c.thinkingTokens } : {}),
      ...(c.stage ? { stage: c.stage } : {}), ...(c.body ? { body: c.body } : {}), ...(c.cls ? { cls: c.cls } : {}) })),
    chapters: m.chapters.map(c => ({ n: c.n, source: c.source, ...(c.reason ? { reason: c.reason } : {}), chars: c.chars })),
  };
}
