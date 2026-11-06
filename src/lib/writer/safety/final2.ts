/**
 * 최종판2 새 검사(판독 결함만, 작가 지침은 그대로 — 검사·후처리로 잡아 수리 1회·소제목 재작성 1회로 보낸다).
 *  1-3 pair_profile: 궁합 사람별 고정 성격표와 다른 성향 문장. 한 사람 문장뿐 아니라 두 사람이 한 문장에 나오거나 "두 사람은·둘 다"로 묶인 문장도 본다.
 *  1-4 glyph_list: 신살·오행 설명에서 나열한 글자("갑·신·묘·오 글자")가 그 사람 명식에 없는 글자를 포함.
 *  1-1 ilju_phrase / avoid_image: 같은 일주 이전 책과 공백 뺀 12자 이상 같은 구절 · 다른 책이 쓴 이미지 줄.
 */
import { forbiddenCues, PROFILE_CUES, type ProfileCodes } from "@/lib/brief/pairProfile";
import { iljuPhraseHit, longestRun } from "@/lib/brief/imageLedger";

export type ProfilePerson = { readonly names: readonly string[]; readonly codes: ProfileCodes; readonly label: string };
/** 두 사람을 주어로 묶은 꼴만("두 사람의 몫"처럼 꾸밈·소유는 주어가 아니다). */
const BOTH = /두 사람(은|이|도|모두)|둘 다|둘은|둘이|두 분(은|이|도)/g;
const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** 단서를 그 단서가 가리키는 사람에게 붙인다: "~하는 [이름]"(꾸밈) → 뒤 이름, 아니면 앞의 가장 가까운 이름(또는 "두 사람"), 없으면 뒤 이름. */
function ownersAt(s: string, start: number, end: number, people: readonly ProfilePerson[]): number[] {
  type Mark = { at: number; end: number; who: number[] };
  const marks: Mark[] = [];
  people.forEach((p, i) => { for (const n of p.names) { const re = new RegExp(esc(n), "g"); let m: RegExpExecArray | null; while ((m = re.exec(s))) marks.push({ at: m.index, end: m.index + m[0].length, who: [i] }); } });
  let b: RegExpExecArray | null; BOTH.lastIndex = 0; while ((b = BOTH.exec(s))) marks.push({ at: b.index, end: b.index + b[0].length, who: people.map((_, i) => i) });
  if (!marks.length) return [];
  const next = marks.filter(m => m.at >= end).sort((x, y) => x.at - y.at)[0];
  if (next) { const gap = s.slice(end, next.at); if (gap.length <= 16 && !/[,.!?]/.test(gap) && /(는|은|한|던|인|운|된)\s*(쪽은|사람은|편은|쪽이|사람이)?\s*$/.test(gap)) return next.who; }
  const prev = marks.filter(m => m.end <= start).sort((x, y) => y.end - x.end)[0];
  if (prev) return prev.who;
  // 앞에 주어가 없으면 뒤의 한 사람 이름만(뒤의 "두 사람은"은 앞 단서의 주인이 아니다).
  return next && next.who.length === 1 ? next.who : [];
}
/** 바로 뒤에서 부정·대조하면("~지 않고", "~기보다", "~대신") 그 단서는 그 사람 특성으로 말한 것이 아니다. */
const negatedAfter = (s: string, end: number) => /^[가-힣]{0,3}(지 않|진 않|지 못|기보다|기 전에|는 대신|기는커녕)/.test(s.slice(end));
/** 독자에게 권하는 문장(~세요·연습·규칙)은 성향 설명이 아니다. */
const ADVICE = /(세요|십시오)[.!]?$|연습이 필요|연습을 하/;

export function pairProfileMismatch(s: string, people: readonly ProfilePerson[]): string | null {
  if (people.length < 2 || ADVICE.test(s)) return null;
  for (const [i, p] of people.entries()) for (const f of forbiddenCues(p.codes)) {
    const re = new RegExp(PROFILE_CUES[f.cue].source, "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(s))) {
      const end = m.index + m[0].length;
      if (negatedAfter(s, end)) continue;
      if (ownersAt(s, m.index, end, people).includes(i)) return `${p.label}:${f.slot}`;
    }
  }
  return null;
}

/**
 * 최종 A-8: 「X도 같은 편·마찬가지·똑같·비슷」이 앞 문장의 성향을 X에게 옮긴다(오지안 판독: 앞 문장 「백정우님은 불편한 건 참지 않고 바로 말하는 편」
 * 다음 「오지안님도 같은 편이지만」 — 오지안 다툼 = 정리한 뒤). 앞 문장에서 다른 사람에게 붙은 단서가 X의 표와 맞지 않으면 잡는다.
 */
const SAME_SIDE = (name: string) => new RegExp(`${esc(name)}(?:님)?(?:도|역시) (?:[가-힣]+ )?(?:같은 편|같은 쪽|마찬가지|똑같|비슷한 편|그런 편|그렇)`);
export function pairProfileSameSide(s: string, prev: string, people: readonly ProfilePerson[]): string | null {
  if (people.length < 2 || !prev) return null;
  for (const [i, p] of people.entries()) {
    if (!p.names.some(n => SAME_SIDE(n).test(s))) continue;
    for (const f of forbiddenCues(p.codes)) {
      const re = new RegExp(PROFILE_CUES[f.cue].source, "g");
      let m: RegExpExecArray | null;
      while ((m = re.exec(prev))) {
        const end = m.index + m[0].length;
        if (negatedAfter(prev, end)) continue;
        const who = ownersAt(prev, m.index, end, people);
        if (who.length && !who.includes(i)) return `${p.label}:${f.slot}(앞 문장 성향을 「같은 편」으로 옮김)`;
      }
    }
  }
  return null;
}

/** 간지 한 글자(한글). 신(辛·申)은 한글로 같아 한글 집합으로 본다. */
const GLYPH = "[갑을병정무기경신임계자축인묘진사오미유술해]";
const LIST = new RegExp(`(${GLYPH}(?:·${GLYPH}){1,7})\\s?(글자|자리|가 |이 |처럼|를|을)`, "g");
export type GlyphPerson = { readonly names: readonly string[]; readonly glyphs: ReadonlySet<string> };
/** 나열한 글자 중 그 사람(문장에 나온 사람, 없으면 모두) 명식에 없는 글자. */
export function glyphListMismatch(s: string, people: readonly GlyphPerson[]): string | null {
  LIST.lastIndex = 0; let m: RegExpExecArray | null;
  while ((m = LIST.exec(s))) {
    const named = people.filter(p => p.names.some(n => s.includes(n)));
    const pool = named.length === 1 ? named : people;
    const have = new Set(pool.flatMap(p => [...p.glyphs]));
    const missing = m[1].split("·").filter(g => !have.has(g));
    if (missing.length) return `${m[1]}:없는 글자 ${missing.join("·")}`;
  }
  return null;
}

/** 같은 일주 이전 책 구절(공백 뺀 12자 이상). */
export const iljuPhrase = (s: string, phrases: readonly string[]) => iljuPhraseHit(s, phrases);
/** 다른 책이 쓴 이미지 줄을 본문에 옮겼다(1장은 공백 뺀 8자, 다른 장은 10자 이상 같은 구간). */
export function avoidImageHit(s: string, avoid: readonly string[], chapter: number): string | null {
  const min = chapter === 1 ? 8 : 10;
  return avoid.find(line => longestRun(s, line) >= min) ?? null;
}
