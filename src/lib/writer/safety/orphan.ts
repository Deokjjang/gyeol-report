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
/** 앞 문장 내용에 기대는 문장 머리(지시어·접속 지시). repairPlan·repair3이 같이 쓴다. */
export const LEANS_START = /^(이처럼|이렇게|이런|그런|그 덕분|그만큼|여기에|그 결과|그러다(?! 보니)|그때|이때|그다음은|그다음엔|그렇다면|그럼(?![가-힣])|그때마다|이 조합|이 두|이건|그건|이것은|그것은|이 |그 )/;
const BECAUSE_ONLY = /^[^.?!]{0,60}때문(?:입니다|이에요|이죠)[.!]?$/;
/** 앞 문장을 받는 짧은 「INFJ가 겹치면 더 그래요.」(W6 S4 4판). */
export const ANAPHOR_SHORT = /^[^.?!]{0,20}(?:더|특히|역시|훨씬) 그(?:래요|렇습니다|렇죠)[.!]?$/;
/** W6.1 P2(1차 종합 13장): 「새 길을 내는 속도와 … 용기도 함께 있었어요」 — 「~도 함께·같이」는 앞 문장이 말한 것에 더한다. */
const ADDITIVE = /^[^.?!]{0,50}[가-힣]도 (?:함께|같이) /;
/** W6.1 P3(1차 궁합 2장): 「그중 장덕민님이 더 그렇습니다」 — 앞 문장의 공통 성향을 받는 비교 꼬리. */
export const COMPARE_TAIL = /^그중(?:에서도)? [가-힣]{1,6}님(?:이|은|께서) (?:더|특히|훨씬|조금 더) /;
/** 근거 이름(신살·십성·관계·자리) — 문장이 꺼낸 주어인지 본다. */
export const SUBJECT_TERM = /(?:[가-힣]{1,4}살|[가-힣]{1,3}귀인|천문성|금여록|암록|비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인|비겁|식상|재성|관성|인성|원진|삼합|반합|육합|방합|[자축인묘진사오미신유술해]{2}\s?(?:충|합|형|파|해)|연간|월간|일간|연지|월지|일지|일주|(?:하늘|땅) 글자|기둥)(?=[은는이가을를의과와도에]|[\s(),.·]|$)/;
/** 근거 이름을 주어로 받아야 서는 서술(「…드러나는 힘이라」「…눈입니다」). */
const TERM_PREDICATE = /(?:힘|기운|자리|뜻|눈|별|신호|덕)(?:이에요|이라|입니다|이죠|이고|예요)[.!,]?$|(?:힘|기운|자리|눈|덕)이라(?:서)?[,\s]/;
/** W6.1 다시 발행(1차 커리어 8장 「셋, …」 · 1차 종합 6장 「첫 번째 실수는 …」): 목록 항목 — 개선 떼기로 떼면 「셋째는 …」「두 번째는 …」가 빈 번호를 가리킨다. */
export const LIST_ITEM = /^(?:하나|둘|셋|넷|다섯|첫째|둘째|셋째|넷째|다섯째|첫 번째|두 번째|세 번째|네 번째)(?:,|는|은|로|가|이| )/;
const LIST_FAMILY: readonly (readonly string[])[] = [["하나", "둘", "셋", "넷", "다섯"], ["첫째", "둘째", "셋째", "넷째", "다섯째"], ["첫 번째", "두 번째", "세 번째", "네 번째"]];
/** 목록 항목인가: 문장이 번호 말로 시작하고, 같은 장(context)에 같은 갈래의 다른 번호 말이 있을 때만(「두 번째 문장은 …」 같은 낱말은 목록이 아니다). */
export function listItemIn(sentence: string, context: string): boolean {
  const t = sentence.replace(/[⟪⟫]/g, "").trim(); if (!LIST_ITEM.test(t)) return false;
  const fam = LIST_FAMILY.find(f => f.some(w => t.startsWith(w))); if (!fam) return false;
  const me = fam.filter(w => t.startsWith(w)).sort((a, b) => b.length - a.length)[0];
  return fam.some(w => w !== me && new RegExp(`(?:^|[.?!]\\s|\\n)⟪?${w}(?:,|는|은|로|가|이| )`).test(context));
}
const LIST_BACK = /^(?:첫|둘|셋|넷|다섯)째(?:는|로|,)|^(?:두|세|네) 번째(?:는|로)/;
/** 조사로 시작한 문장(앞 문장이 빠진 흔적 — broken.ts orphan과 같은 꼴). */
const PARTICLE_START = /^(에서|에게|의|을|를|은|는|와|과|으로|로|에는|이라|라)\s/;
const PERSON_WORD = /당신|두 사람|둘 다|둘은|둘이|서로|[가-힣]{1,6}님/;
/**
 * W6.1 P2: 지운 문장(removed)에 다음 문장(next)이 기대는가 — 차단 떼기는 기대는 문장을 함께 떼고, 개선 떼기는 원문을 둔다.
 *  - leans: 지시어·「때문입니다」만·짧은 되받기·「~도 함께」·비교 꼬리(「그중 X님이 더」)
 *  - subject: 지운 문장이 꺼낸 주어를 다음 문장이 받는다 — 궁합(두 사람)은 지운 문장이 한 사람을 앞머리 주어로 세웠는데 다음 문장에 사람 말이 없을 때,
 *    한 사람 책은 지운 문장이 근거 이름을 꺼냈는데 다음 문장이 근거 이름 없이 「…힘이에요·…힘이라」로 맺을 때(W6 S4 2차 궁합 7장 · 2차 연애 망신살).
 */
export function dependsOnRemoved(removed: string, next: string | undefined, o: { readonly names?: readonly (readonly string[])[] } = {}): "leans" | "subject" | null {
  if (next === undefined) return null;
  const n = next.replace(/[⟪⟫]/g, "").trim(), r = removed.replace(/[⟪⟫]/g, "").trim();
  if (LEANS_START.test(n) || BECAUSE_ONLY.test(n) || ANAPHOR_SHORT.test(n) || ADDITIVE.test(n) || COMPARE_TAIL.test(n) || PARTICLE_START.test(n) || (LIST_ITEM.test(r) && LIST_BACK.test(n))) return "leans";
  const people = o.names ?? [];
  // 궁합: 지운 문장이 한 사람 이름을 문장 머리 주어로 세웠을 때만(「그중 X님이 더 …」처럼 이름이 뒤에 오면 주어를 꺼낸 문장이 아니다 — 1차 궁합 8장 W6.1 다시 발행).
  if (people.length >= 2) {
    const who = people.filter(ns => ns.some(x => x && new RegExp(`^${x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}님?(?:의|은|는|이|가|에게는?) `).test(r)));
    if (who.length === 1 && !PERSON_WORD.test(n) && !people.some(ns => ns.some(x => x && n.includes(x)))) return "subject";
  }
  // 근거 이름(신살·십성·관계)을 꺼낸 문장을 지우면, 근거 이름 없이 「…힘이라·…덕이라」로 그것을 받는 다음 문장이 홀로 남는다(한 사람 책·궁합 모두 — 1차 궁합 9장 「어려움의 세기를 낮추고 … 덕이라」).
  if (SUBJECT_TERM.test(r) && !SUBJECT_TERM.test(n) && !/당신/.test(n) && TERM_PREDICATE.test(n)) return "subject";
  return null;
}
export type ThinSection = { readonly at: string; readonly heading: string; readonly sentences: number };
/** 작가 장(결정론 장 제외)에서 문장이 2개 이하인 소제목. */
export function thinSections(chapters: readonly FinalChapter[], max = 2): ThinSection[] {
  return chapters.filter(c => c.source !== "deterministic").flatMap(c => c.sections.map((s, si) => ({ at: `${c.n}.${si}`, heading: s.heading, sentences: s.paragraphs.reduce((n, p) => n + splitSentences(p).length, 0) })))
    .filter(x => x.sentences <= max);
}
