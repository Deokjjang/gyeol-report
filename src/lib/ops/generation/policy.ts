/**
 * 생성 신뢰성 정책(P6d-ops 7). 순수 함수만 — 시험이 시각을 넣어 24시간을 그대로 돌려 본다.
 * 정식본 = Sonnet이 쓴 원고만(결정론 장 0). terra(OpenAI)는 정식본에 쓰지 않고, Sonnet이 2시간 넘게 실패했을 때 "임시본"으로만 보인다.
 */
import type { ChapterMeta, WriterMeta } from "../../writer/book";
import type { WriterRun } from "../../writer/runner";

const MIN = 60_000, HOUR = 60 * MIN;
/** 출력 전 실패·중간 끊김 뒤 다음 시도까지(n번째 실패 → n번째 값, 끝 값은 반복). */
export const RETRY_DELAYS_MS = [1 * MIN, 5 * MIN, 15 * MIN, 1 * HOUR, 3 * HOUR, 6 * HOUR] as const;
/** 첫 실패부터 이 시간까지만 다시 시도한다. */
export const RETRY_WINDOW_MS = 24 * HOUR;
/** Sonnet이 첫 실패부터 이 시간 넘게 실패하면(OpenAI가 쓸 수 있을 때만) 임시본을 만든다. */
export const INTERIM_AFTER_MS = 2 * HOUR;
/** 정식본·임시본 모델. 정식본은 환경 설정(LLM_PROVIDER 등)과 무관하게 Sonnet으로 고정한다. */
export const OFFICIAL_TARGET = { provider: "anthropic", model: "claude-sonnet-5-5" } as const;
export const INTERIM_TARGET = { provider: "openai", model: "gpt-6.1-terra" } as const;

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

/** 보류 시각을 정한다: 임시본을 낼 수 있으면 첫 실패 + 2시간에 맞춰 한 번 깨운다. */
export function deferUntil(a: { firstFailureAt: number; failures: number; now: number; interimPossible: boolean }): number | null {
  const next = nextRetryAt(a.firstFailureAt, a.failures, a.now);
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
  | { readonly kind: "incomplete"; readonly reason: string; readonly rejected: readonly number[]; readonly missing: readonly number[]; readonly preOutput: boolean }
  | { readonly kind: "stale" };

/**
 * 만든 책을 판정한다. 결정론 장이 하나라도 있으면 정식본·임시본으로 내보내지 않는다.
 * keys_filled(대운·세운 키 일부를 브리프 문단으로 채운 장)는 작가 장으로 본다(SPEC §5 카드 설계, 기록만 남긴다).
 * rejected: 저장된 원고가 있지만 짧거나 비어 결정론이 된 장 — 다음 시도에서 저장본을 버리고 다시 쓴다.
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
  const rejected = det.filter(c => /^(too_short|empty)/.test(c.reason ?? "")).map(c => c.n);
  const missing = det.filter(c => !/^(too_short|empty)/.test(c.reason ?? "")).map(c => c.n);
  const reason = !chapters.length ? "no_chapters" : errors.length ? errors.join(",") : rejected.length ? `short:${rejected.join(",")}` : `missing:${missing.join(",")}`;
  return { kind: "incomplete", reason: (preOutput ? "pre_output:" : "partial:") + reason, rejected, missing, preOutput };
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
