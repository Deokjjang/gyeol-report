/**
 * AM2-8 3부 같은 틀 도구(덕짱님 결정 4 — 결정론 도구 하나, 관문 ③ 셈 · 생성 검사 · verdict.md가 함께 쓴다).
 * 문장 뼈대 = 관계 이름 · 자리 · 때(연 · 월 · 대운) · 입력 낱말 · 숫자 · 십성 · 이름을 가린 문장. 앞 6어절이 같으면 같은 틀이다.
 * - 생성 검사: 장 안에서 같은 틀 셋째부터 그 문단을 다시 쓰기 대상으로 올린다(template_third — 알림이 아니다).
 * - ③ 셈: 판독이 인용한 「이 사람만의 문장」이 장 안 같은 틀 셋째부터면 세지 않는다(처음 두 번만).
 */
import { splitSentences } from "../safety/patterns";
import type { FinalChapter } from "../safety";

const GJ = "[갑을병정무기경신임계][자축인묘진사오미신유술해]";
const BR = "[자축인묘진사오미신유술해]";
/** 가리는 차례: 긴 꼴 먼저(「2027년 정미년」 → 때, 「오미합」 → 관계). */
const MASKS: readonly (readonly [RegExp, string])[] = [
  [/⟪|⟫/g, ""], [/\s?\([一-鿿·\s]+\)/g, ""], [/[一-鿿]+/g, ""],
  [new RegExp(`(?:20\\d\\d년 )?(?:1[0-2]|[1-9])월 ?· ?${GJ}월|20\\d\\d년(?: ${GJ}년)?|${GJ}년|${GJ}월|${GJ} 대운|(?:1[0-2]|[1-9])월`, "g"), "§때"],
  [new RegExp(`${BR}{2,3}(?:합|충|형|파|해|반합|방합|원진|삼합)|${GJ}${GJ}?합|${"[갑을병정무기경신임계]"}{2}합|(?:봄|여름|가을|겨울)(?:의)? ?방합|[목화토금수]국(?: 반합)?|지지형|자형|공망|육합|천간합|반합|방합|삼합|원진`, "g"), "§관계"],
  [/태어난 (?:해|달|날|시각)(?: 자리)?|(?:해|달|날|시) 자리|배우자 자리|일터 자리/g, "§자리"],
  [/비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인/g, "§십성"],
  [/기혼|미혼|솔로|연애 중|결혼 준비 중|직장인|프리랜서|자영업자?|사업자?|학생|취업 준비(?: 중)?|쉬는 중|살림하는|자녀가 있는|아이가 있는|[EI][SN][TF][JP]/g, "§입력"],
  [/\d+(?:번째|살|세|년|개|월|일)?/g, "§수"],
];
/** 가린 말 뒤 조사는 뗀다(「오미합이」 · 「병신합은」 → 같은 뼈대). */
const JOSA_AFTER = /(§(?:때|관계|자리|십성|입력|수|이름))(?:이라는|이라|라는|에는|에서|으로|에게|이|가|은|는|을|를|과|와|의|에|도|로|인|만|처럼|부터|까지)?/g;
export type TplCtx = { readonly names?: readonly string[] };
/** 문장 뼈대(앞 6어절). 4어절이 안 되는 문장은 null(틀로 세지 않는다). */
export function skeleton(sentence: string, c: TplCtx = {}): string | null {
  let t = sentence;
  for (const n of (c.names ?? []).filter(x => x && x.length >= 2).sort((a, b) => b.length - a.length)) t = t.split(n).join("§이름");
  for (const [re, to] of MASKS) t = t.replace(re, to);
  t = t.replace(JOSA_AFTER, "$1").replace(/[.,!?…"'“”‘’「」『』()]/g, " ").replace(/(§\S+)(?:\s+\1)+/g, "$1").replace(/\s+/g, " ").trim();
  const words = t.split(" ").filter(Boolean);
  if (words.length < 4) return null;
  return words.slice(0, 6).join(" ");
}
export const sameTemplate = (a: string, b: string, c: TplCtx = {}) => { const x = skeleton(a, c), y = skeleton(b, c); return Boolean(x && y && x === y); };

export type TplHit = { readonly chapter: number; readonly section: number; readonly paragraph: number; readonly sentence: string; readonly skeleton: string; readonly nth: number };
/** 장 안 문장마다 같은 틀 몇 번째인지(1부터). skip = 시스템 머리 문장(정규화 글)처럼 세지 않을 문장. */
export function templateIndex(chapters: readonly FinalChapter[], c: TplCtx = {}, skip: ReadonlySet<string> = new Set(), o: { readonly skipKeyHead?: boolean } = {}): TplHit[] {
  const out: TplHit[] = [];
  const norm = (t: string) => t.replace(/[^가-힣A-Za-z0-9]/g, "");
  for (const ch of chapters) {
    const seen = new Map<string, number>();
    ch.sections.forEach((sec, si) => sec.paragraphs.forEach((p, pi) => {
      for (const [sj, s] of splitSentences(p).entries()) {
        // 발행본(머리 문장이 든 책)을 셀 때는 key 첫 문단 첫 문장(시스템 머리 문장)을 뺀다.
        if (skip.has(norm(s)) || (o.skipKeyHead && pi === 0 && sj === 0 && ch.keys?.includes(sec.heading))) continue;
        const sk = skeleton(s, c); if (!sk) continue;
        const nth = (seen.get(sk) ?? 0) + 1; seen.set(sk, nth);
        out.push({ chapter: ch.n, section: si, paragraph: pi, sentence: s, skeleton: sk, nth });
      }
    }));
  }
  return out;
}
/** 같은 틀 셋째부터(생성 검사 · verdict.md 기계 셈). */
export const templateThirds = (chapters: readonly FinalChapter[], c: TplCtx = {}, skip: ReadonlySet<string> = new Set(), o: { readonly skipKeyHead?: boolean } = {}) => templateIndex(chapters, c, skip, o).filter(h => h.nth >= 3);

/**
 * 관문 ③ 셈(정본): 판독이 key마다 인용한 「이 사람만의 문장」(여럿이면 모두) 가운데 장 안 같은 틀 셋째 아래인 문장이 하나라도 있으면 「있음」.
 * cites: key(소제목 이름) → 인용 문장들. 인용을 본문에서 찾지 못하면 그 인용은 센다(도구가 판독을 지우지 않는다 — 찾지 못한 수는 따로 돌려준다).
 */
export function personalCount(chapters: readonly FinalChapter[], cites: ReadonlyMap<string, readonly string[]>, c: TplCtx = {}, skip: ReadonlySet<string> = new Set(), o: { readonly skipKeyHead?: boolean } = {}): { have: number; total: number; dropped: { key: string; sentence: string; nth: number }[]; missing: string[] } {
  const idx = templateIndex(chapters, c, skip, o), norm = (t: string) => t.replace(/[^가-힣A-Za-z0-9]/g, "");
  const keyed = chapters.find(ch => ch.keys?.length);
  const keys = keyed?.keys ?? [];
  const dropped: { key: string; sentence: string; nth: number }[] = [], missing: string[] = [];
  let have = 0;
  for (const key of keys) {
    const list = cites.get(key) ?? [];
    let ok = false;
    for (const s of list) {
      const n = norm(s); if (!n) continue;
      const hit = idx.find(h => h.chapter === keyed!.n && keyed!.sections[h.section]?.heading === key && (norm(h.sentence).includes(n.slice(0, 24)) || n.includes(norm(h.sentence).slice(0, 24))));
      if (!hit) { missing.push(`${key}: ${s.slice(0, 40)}`); ok = true; continue; }
      if (hit.nth >= 3) { dropped.push({ key, sentence: s, nth: hit.nth }); continue; }
      ok = true;
    }
    if (ok) have++;
  }
  return { have, total: keys.length, dropped, missing };
}
