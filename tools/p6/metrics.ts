/**
 * P6 자동 지표(저장된 v5 Book 기준): 분량, 안전망 삭제·교체, 결정론 대체 장, 금지 패턴(최종 원고 잔여), 비문·DB 문구 경고,
 * 같은 정보 반복(P6 새 정의), 소요 시간, 토큰, 권당 비용(USD·원).
 */
import type { V5BookDraft, V5Evidence } from "../../src/lib/writer/book";
import { AWKWARD_PHRASE, GENDER_WORD, LOVE_TIMING, OLD_NEGATIVE, SICK_DEATH_IMAGE, SOURCE_MENTION, isPastAssertion, jobFieldList, splitSentences } from "../../src/lib/writer/safety/patterns";

/** 원/달러(2026-10-30 기준 일자 확인 가능한 공개 시세가 없어 2026년 7~10월 범위 1,425~1,480원의 중간값으로 고정). */
export const KRW_PER_USD = 1450;

export function bookMetrics(draft: V5BookDraft, e: V5Evidence) {
  const meta = e.meta;
  const sentences = draft.chapters.flatMap(c => c.sections.flatMap(s => s.paragraphs.flatMap(p => splitSentences(p))));
  const hit = (test: (s: string) => boolean) => sentences.filter(test);
  const forbidden = {
    oldNegative: hit(s => OLD_NEGATIVE.test(s)).length, loveTiming: hit(s => LOVE_TIMING.test(s)).length, source: hit(s => SOURCE_MENTION.test(s)).length,
    pastAssert: hit(s => isPastAssertion(s)).length, sickDeath: hit(s => SICK_DEATH_IMAGE.test(s)).length,
  };
  const awkward = hit(s => AWKWARD_PHRASE.test(s));
  const dbLeak = hit(s => Boolean(jobFieldList(s)) || /직업군/.test(s));
  const gender = hit(s => GENDER_WORD.test(s) && !/배우자|자녀성|자녀 별/.test(s));
  const info = meta.safety.metrics?.infoRepeats;
  const chars = meta.chapters.reduce((a, c) => a + c.chars, 0);
  return {
    chars, chapterChars: meta.chapters.map(c => c.chars), chapters: meta.chapters.length,
    deterministicChapters: meta.chapters.filter(c => c.source === "deterministic").map(c => `${c.n}:${c.reason ?? ""}`),
    partialKeys: meta.chapters.filter(c => c.reason?.startsWith("keys_filled")).map(c => `${c.n}:${c.reason}`),
    deletions: meta.safety.deletions, byRule: meta.safety.byRule, replacements: meta.safety.metrics?.experience?.replaced ?? 0, warnings: meta.safety.warnings,
    forbiddenResidual: Object.values(forbidden).reduce((a, b) => a + b, 0), forbidden,
    awkward: awkward.length, awkwardSamples: awkward.slice(0, 5), dbLeak: dbLeak.length, dbLeakSamples: dbLeak.slice(0, 5), gender: gender.length, genderSamples: gender.slice(0, 3),
    infoRepeats: info?.count ?? null, infoByKind: info?.byKind ?? null, infoPairs: (info?.pairs ?? []).slice(0, 8),
    briefCopy: meta.safety.metrics?.briefCopy?.ratio ?? null,
    // 만세력 표가 고정됐는지(v4 계산이 입력을 거절하면 표 없이 발행된다).
    manseTables: e.people.map(p => Boolean(p.table)),
    durationMs: meta.durationMs, tokens: meta.tokens, costUsd: meta.costUsd, costKrw: Math.round(meta.costUsd * KRW_PER_USD * 10) / 10,
    calls: meta.calls.map(c => ({ kind: c.kind, finish: c.finish, ...(c.error ? { error: c.error } : {}), ms: c.ms, chars: c.chars, maxTokens: c.maxTokens, usage: c.usage, costUsd: c.costUsd })),
    writer: meta.writer, promptVersion: meta.promptVersion, knowledgeVersion: meta.knowledgeVersion,
  };
}
