import type { BookChapter } from "../../writer/format";
import type { ChapterSink, SavedChapter } from "../../writer/runner";

export type OpsStore = { call(action: string, data: Record<string, unknown>): Promise<Record<string, unknown>> };

/* 최종판 0-1: 짧거나 비어 결정론이 된 장의 저장본을 버리던 filteredSink는 없앴다(저장된 장은 버리지 않고 빠진 장만 이어 쓴다). */

/** 임시본(OpenAI) 시도용: Sonnet 장 저장본과 섞지 않는다. */
export function memorySink(): ChapterSink {
  const saved = new Map<number, SavedChapter>();
  return { async save(c) { saved.set(c.n, c); return true; }, async load() { return [...saved.values()]; } };
}

/** 결제 경로·교체 레인 장 저장(ops_writer_chapters). 현재 lease 토큰만 저장·조회된다. */
export function opsChapterSink(store: OpsStore, reportId: string, token: string): ChapterSink {
  return {
    async save(c) { const r = await store.call("chapters_save", { reportId, token, n: c.n, source: c.source, chapter: c.chapter }); return r.ok === true; },
    async load() {
      const r = await store.call("chapters_load", { reportId, token });
      if (!r.ok || !Array.isArray(r.chapters)) return [];
      return (r.chapters as { n: number; source: SavedChapter["source"]; chapter: BookChapter }[]).map(x => ({ n: x.n, source: x.source, chapter: x.chapter }));
    },
  };
}

const QUOTA = /insufficient_quota|exceeded your current quota|billing_hard_limit_reached|billing_not_active/i;
const CREDIT = /credit balance is too low/i;
export type QuotaSeen = { openaiQuota?: boolean; anthropicCredit?: boolean };
/** 공급자 응답 본문에서 잔액 부족을 알아본다(작가 내부는 오류 코드만 남기므로 바깥 fetch에서 본다). 응답은 그대로 넘긴다. */
export function watchFetch(base: typeof fetch, seen: QuotaSeen): typeof fetch {
  return (async (input: string | URL | Request, init?: RequestInit) => {
    const res = await base(input, init);
    if (res.status >= 400 && res.status < 500) {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      try {
        const body = await res.clone().text();
        // 잔액 부족 429는 기다려도 풀리지 않는다: 재시도하지 않는 402로 바꿔 이번 시도를 바로 끝낸다.
        if (/openai\.com/.test(url) && QUOTA.test(body)) { seen.openaiQuota = true; return new Response(body, { status: 402, headers: res.headers }); }
        if (/anthropic\.com/.test(url) && CREDIT.test(body)) seen.anthropicCredit = true;
      } catch { /* 본문을 못 읽어도 응답은 그대로 */ }
    }
    return res;
  }) as typeof fetch;
}
