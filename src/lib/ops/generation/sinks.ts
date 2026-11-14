import type { BookChapter } from "../../writer/format";
import type { ChapterSink, RawEntry, SavedChapter, WriterCache } from "../../writer/runner";

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

/**
 * 최종판3 6: 운영 워커의 호출 원문 저장소(ops_writer_raw, 주문 번호 키). 받는 즉시 저장하고(put), 재시도는 저장본을 쓴다(get → 호출 0).
 * 현재 lease 토큰만 저장·조회된다. 저장 실패는 원고를 막지 않는다(그때는 Book meta.raw가 남는다).
 */
export function opsRawCache(store: OpsStore, reportId: string, token: string): WriterCache {
  let loaded: Map<string, RawEntry> | null = null;
  const load = async () => {
    if (loaded) return loaded;
    try { const r = await store.call("raw_load", { reportId, token }); loaded = new Map(r.ok && Array.isArray(r.entries) ? (r.entries as RawEntry[]).map(e => [e.key, e]) : []); }
    catch { loaded = new Map(); }
    return loaded;
  };
  return {
    async get(key) { return (await load()).get(key) ?? null; },
    async put(e) { (await load()).set(e.key, e); try { await store.call("raw_save", { reportId, token, entry: e }); } catch { /* Book meta.raw가 남는다 */ } },
  };
}
/** 저장본 → 운영 원문 → 개발 관문 순으로 찾고, 새 원문은 운영 원문과 개발 관문 모두에 남긴다. */
export function chainCache(...caches: readonly (WriterCache | null | undefined)[]): WriterCache | null {
  const cs = caches.filter((c): c is WriterCache => Boolean(c));
  if (!cs.length) return null;
  return {
    async get(key) { for (const c of cs) { const v = await c.get(key); if (v) return v; } return null; },
    async put(e, m) { for (const c of cs) await c.put(e, m); },
  };
}

/** OpenAI 잔액·한도(재시도로 안 풀림). credit_balance_exhausted·*_spend_limit_exceeded·organization_usage_limit_exceeded는 11-13 문서 확인(research-w2 3-4). */
const QUOTA = /insufficient_quota|exceeded your current quota|billing_hard_limit_reached|billing_not_active|credit_balance_exhausted|_spend_limit_exceeded|organization_usage_limit_exceeded/i;
/** Anthropic 잔액·결제(문서 11-14: 402 billing_error, 400 = 지출 한도 도달, 「credit balance is too low」). */
const CREDIT = /credit balance is too low|billing_error|spend limit/i;
/** Anthropic 인증·권한(문서 11-14: 401 authentication_error, 403 permission_error). */
const AUTH = /authentication_error|permission_error/;
export type QuotaSeen = { openaiQuota?: boolean; anthropicCredit?: boolean; anthropicAuth?: boolean };
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
        // F: 잔액 부족(credit balance)·결제 필요(402)는 처리 봇 경보(감독이 1시간 1번).
        if (/anthropic\.com/.test(url) && (res.status === 402 || CREDIT.test(body))) seen.anthropicCredit = true;
        // W3 P0: 키가 틀리거나 권한이 없으면 모든 생성이 실패한다 — 잔액과 같은 경보(판매 자동 멈춤).
        else if (/anthropic\.com/.test(url) && (res.status === 401 || res.status === 403 || AUTH.test(body))) seen.anthropicAuth = true;
      } catch { /* 본문을 못 읽어도 응답은 그대로 */ }
    }
    return res;
  }) as typeof fetch;
}
