/**
 * 안전망 메타 지표(P3.5 A1·A2, 기록만 하고 지우지 않는다).
 * - briefCopy: 출력 문장 중 브리프 문장과 공백·문장부호를 뺀 20자 이상이 연속으로 같은 문장의 비율(목표 10% 미만). 작가가 쓴 장만 따로도 낸다.
 * - connectors: 같은 연결 어구("이 기운 때문에", "그래서" 등)가 책 전체에서 3회 이상 나온 것.
 */
import type { Brief } from "@/lib/brief/schema";
import type { BookSection, ChapterSource } from "../format";
import { splitSentences } from "./patterns";
import { norm } from "./sentences";

export const BRIEF_COPY_WINDOW = 20;
export const CONNECTOR_LIMIT = 3;

type Chapter = { readonly sections: readonly BookSection[]; readonly source: ChapterSource };
export type BriefCopyMetric = { readonly sentences: number; readonly matched: number; readonly ratio: number; readonly writerSentences: number; readonly writerMatched: number; readonly writerRatio: number };
export type ConnectorRepeat = { readonly phrase: string; readonly count: number };

function briefWindows(brief: Brief): Set<string> {
  const out = new Set<string>();
  const walk = (v: unknown, key = "") => {
    if (typeof v === "string") { if (/^(id|featureId|traitId|ref|key|entryKey|seed|version|hex)$/.test(key)) return; const n = norm(v); for (let i = 0; i + BRIEF_COPY_WINDOW <= n.length; i++) out.add(n.slice(i, i + BRIEF_COPY_WINDOW)); }
    else if (Array.isArray(v)) v.forEach(x => walk(x, key));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, k);
  };
  walk(brief);
  return out;
}
export const copiesBrief = (sentence: string, windows: ReadonlySet<string>) => { const n = norm(sentence); for (let i = 0; i + BRIEF_COPY_WINDOW <= n.length; i++) if (windows.has(n.slice(i, i + BRIEF_COPY_WINDOW))) return true; return false; };

const sentencesOf = (sections: readonly BookSection[]) => sections.flatMap(s => s.paragraphs.flatMap(p => splitSentences(p)));
const ratio = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 1000 : 0);

export function briefCopyMetric(brief: Brief, chapters: readonly Chapter[]): BriefCopyMetric {
  const w = briefWindows(brief);
  let sentences = 0, matched = 0, writerSentences = 0, writerMatched = 0;
  for (const c of chapters) for (const s of sentencesOf(c.sections)) {
    const hit = copiesBrief(s, w);
    sentences++; if (hit) matched++;
    if (c.source !== "deterministic") { writerSentences++; if (hit) writerMatched++; }
  }
  return { sentences, matched, ratio: ratio(matched, sentences), writerSentences, writerMatched, writerRatio: ratio(writerMatched, writerSentences) };
}

/** 이유를 잇는 어구(~ 때문에·덕분에·탓에·이유로)와 문장 첫머리 접속어. */
const CAUSE = /(?<![가-힣])((?:이|그|이런|그런|바로 이|바로 그|이 두|앞의) ?(?:[가-힣]{1,6} ){0,2}[가-힣]{0,6} ?(?:때문에|덕분에|탓에|이유로|까닭에))/g;
const LEAD = /^(그래서|그러니|그러니까|그런데|반대로|그 결과|여기에|게다가|하지만|그래도|결국|덕분에)(?=[\s,])/;
export function connectorRepeats(chapters: readonly Chapter[], limit = CONNECTOR_LIMIT): ConnectorRepeat[] {
  const count = new Map<string, number>();
  const add = (p: string) => count.set(p, (count.get(p) ?? 0) + 1);
  for (const c of chapters) for (const s of sentencesOf(c.sections)) {
    for (const m of s.matchAll(CAUSE)) add(m[1].replace(/\s+/g, " ").trim());
    const lead = s.match(LEAD); if (lead) add(lead[1]);
  }
  return [...count].filter(([, n]) => n >= limit).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([phrase, n]) => ({ phrase, count: n }));
}
