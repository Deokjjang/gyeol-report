/**
 * 명리 용어 사전(P3.6 A3): 고객 본문에 나올 수 있는 용어 → 쉬운 말. 데이터 src/lib/brief/data/terms.json(tools/p36/build-terms.ts가 지식 DB에서 생성).
 * 안전망은 사전의 용어가 책에서 처음 나올 때 괄호 밖이면 경고한다("쉬운 말(용어)" 꼴이어야 한다). 지우지 않는다.
 * 일상어 오탐(일주일·도화지)을 막으려고 용어 뒤에는 조사·문장부호만 온다고 본다.
 */
import data from "@/lib/brief/data/terms.json";
import type { StyleWarning } from "./sentences";

export type Term = { readonly term: string; readonly easy: string };
export const TERMS: readonly Term[] = data.terms;
const AFTER = "(?=[은는이가을를의에과와도로만랑처같으까부보라란나야]|[^가-힣]|$)";
const PATTERNS = TERMS.map(t => ({ term: t.term, re: new RegExp(`(?<![가-힣])${t.term}${AFTER}`) }));

/** 문단에서 사전 용어가 처음 나온 자리가 괄호 밖이면 term_first 경고(introduced는 책 단위, 트레이트 이름 검사와 함께 쓴다). */
export function glossaryWarnings(chapter: number, paragraphs: readonly string[], introduced: Set<string>): StyleWarning[] {
  const out: StyleWarning[] = [];
  for (const p of paragraphs) for (const { term, re } of PATTERNS) {
    if (introduced.has(term)) continue;
    const m = re.exec(p); if (!m) continue;
    introduced.add(term);
    const open = p.lastIndexOf("(", m.index), close = p.lastIndexOf(")", m.index);
    if (!(open > close)) out.push({ chapter, kind: "term_first", text: term });
  }
  return out;
}
