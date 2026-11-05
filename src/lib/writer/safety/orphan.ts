/**
 * 최종 A-9: 문장 삭제 뒤 정리(호출 0, 결정론).
 * - 앞 문장이 지워져 다음 문장이 「그런데·그래서·하지만」 같은 접속어로 시작하는 고아 문장이 되면 접속어만 지운다.
 *   지시어로 시작하는 문장(「이처럼·그런·그 덕분」)은 접속어가 아니라 앞 문장 내용을 가리키므로 여기서 다루지 않는다(지우기 쪽이 원문을 둔다).
 * - 소제목 하나에 문장이 2개 이하로 남으면 기록한다(thinSections).
 */
import type { FinalChapter } from "./index";
import { splitSentences } from "./patterns";

export const ORPHAN_CONNECTIVE = /^(⟪?)(그런데|그래서|하지만|그러나|그리고|그러니까|그러니|그러므로|따라서|게다가|또한|더구나|그렇지만|그래도|그러면|반면에|반면|다만|그렇기에|그러다 보니|그렇다 보니|그래서인지|또)(?:,\s*|\s+)/;
/** 접속어를 뗀 문장(없으면 null). ⟪ 표시는 그대로 둔다. */
export function stripConnective(sentence: string): string | null {
  const m = sentence.match(ORPHAN_CONNECTIVE);
  return m ? `${m[1]}${sentence.slice(m[0].length)}` : null;
}
/** 문단 문장 목록에서 i번째를 지우고, 바로 뒤 문장이 접속어로 시작하면 접속어를 뗀다. stripped: 뗀 접속어 수. */
export function removeSentenceAt(ss: readonly string[], i: number): { sentences: string[]; stripped: number } {
  const out = ss.filter((_, j) => j !== i);
  if (i < out.length) { const t = stripConnective(out[i]); if (t) { out[i] = t; return { sentences: out, stripped: 1 }; } }
  return { sentences: out, stripped: 0 };
}
export type ThinSection = { readonly at: string; readonly heading: string; readonly sentences: number };
/** 작가 장(결정론 장 제외)에서 문장이 2개 이하인 소제목. */
export function thinSections(chapters: readonly FinalChapter[], max = 2): ThinSection[] {
  return chapters.filter(c => c.source !== "deterministic").flatMap(c => c.sections.map((s, si) => ({ at: `${c.n}.${si}`, heading: s.heading, sentences: s.paragraphs.reduce((n, p) => n + splitSentences(p).length, 0) })))
    .filter(x => x.sentences <= max);
}
