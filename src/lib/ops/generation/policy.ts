/**
 * 생성 신뢰성 정책(P6d-ops 7). 순수 함수만 — 시험이 시각을 넣어 24시간을 그대로 돌려 본다.
 * 정식본 = Sonnet이 쓴 원고만(결정론 장 0). terra(OpenAI)는 정식본에 쓰지 않고, Sonnet이 실패했을 때 "임시본"으로만 보인다.
 * AM2-3 6-1(덕짱님 결정 2026-11-12): 결정론 대체본은 어느 상품도 내보내지 않는다 — 빈 원고 재호출 1 → 빠진 장·묶음 재시도 1 → 첫 실패 직후 임시본 → 그래도 실패면 보류(처리 봇 경보 · 고객 지연 안내),
 * 24시간 안에 못 만들면 지금처럼 자동 환불(이용권은 되돌림).
 */
import type { ChapterMeta, WriterMeta } from "../../writer/book";
import type { WriterRun } from "../../writer/runner";

const MIN = 60_000, HOUR = 60 * MIN;
/** 출력 전 실패·중간 끊김 뒤 다음 시도까지(n번째 실패 → n번째 값, 끝 값은 반복). */
export const RETRY_DELAYS_MS = [1 * MIN, 5 * MIN, 15 * MIN, 1 * HOUR, 3 * HOUR, 6 * HOUR] as const;
/** 첫 실패부터 이 시간까지만 다시 시도한다. */
export const RETRY_WINDOW_MS = 24 * HOUR;
/** Sonnet이 첫 실패부터 이 시간 넘게 실패하면(OpenAI가 쓸 수 있을 때만) 임시본을 만든다. AM2-3 6-1: 첫 실패 직후 바로(2시간 → 0). */
export const INTERIM_AFTER_MS = 0;
/** 정식본·임시본 모델. 정식본은 환경 설정(LLM_PROVIDER 등)과 무관하게 Sonnet으로 고정한다. */
export const OFFICIAL_TARGET = { provider: "anthropic", model: "claude-sonnet-5-5" } as const;
export const INTERIM_TARGET = { provider: "openai", model: "gpt-6.1-terra" } as const;

/**
 * 주문당 비용 상한(최종판 0-6, USD): 한 주문(Book)의 작가·수리·재작성·이어쓰기 비용 합(모든 시도)이 이 값에 이르면 더 부르지 않고 그 주문을 보류한다.
 * 설정값: ORDER_COST_CAP_USD(없거나 잘못되면 0.60). 관리자 재생성은 재생성 요청 뒤 시도만 센다.
 */
/** 최종판3 6: 최악 비용(작가 입력 상한 4만 자·max_tokens 공식 + 검수 Haiku 입력 6만 자·출력 1.6만 + 수리 40항목·출력 8천, tools/final3/worst-cost.ts) = $0.55. 이 값을 넘는 검수·수리만 건너뛴다(작가는 늘 부른다). */
export const ORDER_COST_CAP_USD = 0.55;
/** 작가 입력 상한(글자): 최악 비용 계산의 전제. 넘으면 경고만 남긴다(작가는 부른다). */
export const WRITER_INPUT_CAP_CHARS = 40_000;
/** AM2-3(덕짱님 지시 2026-11-12): 세운·대운(장 묶음 작가 — 묶음 다시 쓰기로 고친다) 주문 상한은 설정값 $1.0(ORDER_COST_CAP_AM_USD). 4종은 그대로. */
export const ORDER_COST_CAP_AM_USD = 1.0;
const AM_PRODUCTS = new Set(["annual_fortune", "major_fortune"]);
export function orderCostCap(env: Readonly<Record<string, string | undefined>> = process.env, product?: string): number {
  if (product && AM_PRODUCTS.has(product)) { const a = Number(env.ORDER_COST_CAP_AM_USD); return Number.isFinite(a) && a > 0 && a <= 10 ? a : ORDER_COST_CAP_AM_USD; }
  const v = Number(env.ORDER_COST_CAP_USD);
  return Number.isFinite(v) && v > 0 && v <= 10 ? v : ORDER_COST_CAP_USD;
}
/** 상한에 걸린 주문을 보류하는 기간: 관리자 "지연" 목록에 사유와 함께 남는다(자동 환불 없음). */
export const COST_HOLD_MS = 30 * 24 * HOUR;
/** 기록된 시도들의 비용 합(since가 있으면 그 뒤 시도만). */
export function spentOf(runs: readonly { cost_usd?: number | string | null; created_at?: string | null }[] | undefined, since?: string | null): number {
  const t = since ? Date.parse(since) : NaN;
  return Math.round((runs ?? []).filter(r => !Number.isFinite(t) || Date.parse(r.created_at ?? "") >= t).reduce((a, r) => a + (Number(r.cost_usd) || 0), 0) * 1e8) / 1e8;
}

/**
 * failures번째 실패(1부터) 뒤 다음 시도 시각. 첫 실패 + 24시간을 넘기면 그 시각에 마지막으로 한 번,
 * 이미 그 시각이 지났으면 null(포기).
 */
export function nextRetryAt(firstFailureAt: number, failures: number, now: number): number | null {
  const end = firstFailureAt + RETRY_WINDOW_MS;
  if (now >= end - 30_000) return null;
  const at = now + RETRY_DELAYS_MS[Math.min(Math.max(failures, 1), RETRY_DELAYS_MS.length) - 1];
  return Math.min(at, end);
}

/** 보류 시각을 정한다: 임시본을 낼 수 있으면 첫 실패 + INTERIM_AFTER_MS에 맞춰 한 번 깨운다(0이면 다음 재시도 시각 그대로 — 그 시도가 임시본). */
export function deferUntil(a: { firstFailureAt: number; failures: number; now: number; interimPossible: boolean }): number | null {
  const next = nextRetryAt(a.firstFailureAt, a.failures, a.now);
  if (next === null) return null;
  const interimAt = a.firstFailureAt + INTERIM_AFTER_MS;
  return a.interimPossible && a.now < interimAt && next > interimAt ? interimAt : next;
}

/** 이번 시도를 임시본(OpenAI)으로 할지: 정식본 대기 중이고, 첫 실패부터 INTERIM_AFTER_MS가 지났고(AM2-3: 0 — 첫 실패 다음 시도), OpenAI를 쓸 수 있을 때. */
export function interimDue(a: { phase: string; firstFailureAt: number | null; now: number; interimPossible: boolean }): boolean {
  return a.phase === "pending" && a.firstFailureAt !== null && a.now - a.firstFailureAt >= INTERIM_AFTER_MS && a.interimPossible;
}

export type BuildVerdict =
  | { readonly kind: "complete"; readonly keysFilled: readonly number[] }
  | { readonly kind: "incomplete"; readonly reason: string; readonly rejected: readonly number[]; readonly missing: readonly number[]; readonly preOutput: boolean; readonly capped?: boolean }
  | { readonly kind: "stale" };

/**
 * 만든 책을 판정한다. 결정론 장이 하나라도 있으면 정식본·임시본으로 내보내지 않는다.
 * AM2-3 6-1: keys_filled(대운·세운 key 일부를 결정론 문단으로 채운 장)도 결정론 대체본이다 — 내보내지 않는다(예전에는 작가 장으로 봤다).
 * 최종판 0-1: 작가가 쓴 장은 짧아도 버리지 않으므로 결정론 장은 "빠진 장"뿐이다(rejected는 늘 빈 배열 — 다음 시도는 저장된 장을 그대로 두고 빠진 장만 이어 쓴다).
 * capped: 주문당 비용 상한에 걸려 부르지 못했다(보류).
 */
export function judgeBuild(built: { readonly meta: WriterMeta; readonly run: WriterRun | null }): BuildVerdict {
  if (built.run?.stale) return { kind: "stale" };
  const chapters: readonly ChapterMeta[] = built.meta.chapters;
  const det = chapters.filter(c => c.source === "deterministic");
  const keysFilled = chapters.filter(c => c.source !== "deterministic" && (c.reason ?? "").startsWith("keys_filled")).map(c => c.n);
  if (!det.length && !keysFilled.length && chapters.length) return { kind: "complete", keysFilled };
  const calls = built.run?.calls ?? built.meta.calls;
  const preOutput = calls.every(c => c.chars === 0);
  const errors = [...new Set(calls.map(c => c.error).filter((e): e is string => Boolean(e)))];
  const missing = [...det.map(c => c.n), ...keysFilled], capped = Boolean(built.run?.capped);
  const reason = capped ? "cost_cap" : !chapters.length ? "no_chapters" : errors.length ? errors.join(",") : !det.length && keysFilled.length ? `keys_filled:${keysFilled.join(",")}` : `missing:${missing.join(",")}`;
  return { kind: "incomplete", reason: (preOutput ? "pre_output:" : "partial:") + reason, rejected: [], missing, preOutput, ...(capped ? { capped } : {}) };
}

/** 관리자·Book 메타에 남길 요약(원고·프롬프트·키 없이). */
export function runSummary(built: { readonly meta: WriterMeta; readonly run: WriterRun | null }) {
  const m = built.meta;
  return {
    provider: m.writer?.provider ?? null, model: m.writer?.model ?? null, costUsd: m.costUsd, durationMs: m.durationMs,
    calls: m.calls.map(c => ({ kind: c.kind, provider: c.provider, model: c.model, finish: c.finish, ...(c.error ? { error: c.error } : {}), chars: c.chars, costUsd: c.costUsd ?? 0, ms: c.ms })),
    chapters: m.chapters.map(c => ({ n: c.n, source: c.source, ...(c.reason ? { reason: c.reason } : {}), chars: c.chars })),
  };
}
