/**
 * W6 S0-2 「깨진 문장」(출시 차단, 결정론·호출 0). 발행 본문 문장 하나를 본다(사실 표시 ⟦…⟧는 이미 렌더된 뒤).
 *  - dup_phrase: 같은 문장 안에서 6자 이상(한글·숫자만 센다) 같은 구절이 되풀이(렌더 구절 하나 안의 되풀이는 뺀다 — 「A님의 태어난 날 땅 글자 … B님의 태어난 날 땅 글자」).
 *    W5 1차 종합 「태어난 날 땅 글자(일지)에 태어난 날 땅 글자(일지)의 절」, 1차 궁합 「두 사람 모두에게 있는 현침살처럼 이 기운은 두 사람 모두에게」.
 *  - render_overlap: 렌더 구절과 작가 글의 자리 말 겹침 — 「기사(기사 대운(정재의 10년))」처럼 괄호 앞 말이 괄호 안에서 되풀이, 또는 바로 앞 문장과 같은 렌더 구절(대운 구절 두 문장 연속).
 *  - bracket: 짝 안 맞는 괄호(문단 단위로 세고, 짝이 깨진 문장에 단다) — 남은 표시 ⟦ ⟧는 fact_mark가 먼저 잡는다.
 *  - particle: 조사 겹침(「…(일지)을를」「…현침살의의」) — 괄호·렌더 구절 바로 뒤에서만(낱말 속 「사과와」 같은 오탐을 피함).
 *  - orphan: 앞말 없는 조각 — 소제목 첫 문장이 지시어·접속어·「때문입니다」로만 기댐, 또는 조사로 시작(「에서 보듯 …」 — 빈 표시 흔적).
 */
export type BrokenKind = "dup_phrase" | "render_overlap" | "bracket" | "particle" | "orphan";
export type BrokenHit = { readonly kind: BrokenKind; readonly detail: string };

const nk = (s: string) => s.replace(/[⟪⟫]/g, "").replace(/[^가-힣0-9]/g, "");
export const DUP_MIN = 6;

/**
 * 같은 문장 안 되풀이 구절. 시험 책 59권 첫판(글자 그대로 6자)은 133건 대부분이 맞는 대구(「도윤님에게 모자란 …, 하린님에게 모자란 …」「한 사람에게는 …, 한 사람에게는 …」)·날짜라 둘로 좁혔다:
 *  A 렌더 구절이 끼인 되풀이 — 두 자리 가운데 하나라도 표시 구절 안에 있고 둘이 같은 구절 하나 안이 아닐 때(「…(일지)에 태어난 날 땅 글자(일지)의 절」·「…현침살처럼 이 기운은 두 사람 모두에게」).
 *  B 작가 글 되풀이 — 숫자 없는 6자 이상이 사이 없이 바로 되풀이(말 더듬기 꼴). 사이 3자까지 넓히면 59권에서 대구 12건이 걸리고 진짜 0건이라 좁혔다.
 */
export function dupPhrase(sen: string, phrases: readonly string[] = []): string | null {
  const n = nk(sen); if (n.length < DUP_MIN * 2) return null;
  const spans: [number, number][] = [];
  for (const p of phrases) { const q = nk(p); if (q.length < DUP_MIN) continue; for (let i = n.indexOf(q); i >= 0; i = n.indexOf(q, i + 1)) spans.push([i, i + q.length]); }
  const inSpan = (x: number, len: number) => spans.findIndex(([a, b]) => x < b && x + len > a);
  const sameSpan = (x: number, y: number, len: number) => spans.some(([a, b]) => a <= x && x + len <= b && a <= y && y + len <= b);
  for (let i = 0; i + DUP_MIN <= n.length; i++) for (let j = i + DUP_MIN; j + DUP_MIN <= n.length; j++) {
    if (n.slice(i, i + DUP_MIN) !== n.slice(j, j + DUP_MIN)) continue;
    let k = DUP_MIN; while (j + k < n.length && n[i + k] === n[j + k] && i + k < j) k++;
    const w = n.slice(i, i + k);
    if (!sameSpan(i, j, k) && (inSpan(i, k) >= 0 || inSpan(j, k) >= 0)) return w;
    if (!/[0-9]/.test(w) && j === i + k) return w;
  }
  return null;
}

const LEAN_START = /^(이처럼|이렇게|그 덕분에?|그만큼|그 결과|이 조합|이 두 (?:가지|힘|기운)|이건|그건|이것은|그것은|그래서|그러니|그런데|하지만|게다가|또한|반대로|그러다 보니)(?=[\s,])/;
const BECAUSE_ONLY = /^[^.?!]{0,40}때문(?:입니다|이에요|이죠)[.!]?$/;
/** 「X인 건 Y 때문이에요」처럼 주어(건·것은·이유는)를 갖춘 이유 문장은 조각이 아니다. */
const BECAUSE_FULL = /(?:건|것은|이유는|까닭은|탓은) [^.?!]*때문/;
const PARTICLE_START = /^(에서|에게|의|을|를|은|는|와|과|으로|로|에는|이라|라)\s/;
const DOUBLE_PARTICLE = /(을를|를을|은는|는은|이가|가이|과와|와과|의의|에에|로로|으로로)(?=[\s,.?!]|$)/;
const HANGUL_PAREN = /([가-힣]{2,})\(\1(?=[\s(가-힣])/;

export type BrokenOpts = {
  /** 이 책 사실 표시의 렌더 구절(전체·짧은 꼴). */
  readonly phrases?: readonly string[];
  /** 소제목 첫 문장인가(앞말이 없는 자리). */
  readonly sectionFirst?: boolean;
  /** 같은 문단 바로 앞 문장. */
  readonly prev?: string;
};

export function brokenSentence(raw: string, o: BrokenOpts = {}): BrokenHit | null {
  const sen = raw.replace(/[⟪⟫]/g, "").trim(); if (!sen) return null;
  const phrases = o.phrases ?? [];
  { const m = sen.match(HANGUL_PAREN); if (m) return { kind: "render_overlap", detail: `「${m[1]}(${m[1]}…」 괄호 앞 말을 괄호 안에서 되풀이` }; }
  if (o.prev) {
    const pv = nk(o.prev), cur = nk(sen);
    const p = phrases.filter(x => nk(x).length >= 8).find(x => pv.includes(nk(x)) && cur.includes(nk(x)));
    if (p) return { kind: "render_overlap", detail: `바로 앞 문장과 같은 구절 「${p}」` };
  }
  { const d = dupPhrase(sen, phrases); if (d) return { kind: "dup_phrase", detail: `같은 문장 안 되풀이 「${d}」` }; }
  // 조사 겹침: 괄호 바로 뒤, 또는 렌더 구절 바로 뒤.
  { const m = sen.match(new RegExp(`\\)${DOUBLE_PARTICLE.source}`)); if (m) return { kind: "particle", detail: `조사 겹침 「)${m[1]}」` }; }
  for (const p of phrases) { const i = sen.indexOf(p); if (i < 0) continue; const m = sen.slice(i + p.length).match(new RegExp(`^${DOUBLE_PARTICLE.source}`)); if (m) return { kind: "particle", detail: `조사 겹침 「${p.slice(-6)}${m[1]}」` }; }
  if (PARTICLE_START.test(sen)) return { kind: "orphan", detail: `조사로 시작 「${sen.slice(0, 8)}」` };
  if (o.sectionFirst) {
    const m = sen.match(LEAN_START); if (m) return { kind: "orphan", detail: `소제목 첫 문장이 앞말에 기댐 「${m[1]}」` };
    if (BECAUSE_ONLY.test(sen) && !BECAUSE_FULL.test(sen)) return { kind: "orphan", detail: "소제목 첫 문장이 「때문입니다」로만 기댐" };
  }
  return null;
}

/** 문단의 괄호 짝: 짝이 깨진 문장 번호(없으면 -1). 「」·“”도 본다. */
export function unbalancedAt(sentences: readonly string[]): number {
  const pairs: [string, string][] = [["(", ")"], ["「", "」"], ["“", "”"]];
  for (const [a, b] of pairs) {
    let depth = 0;
    for (const [i, s] of sentences.entries()) for (const ch of s) { if (ch === a) depth++; else if (ch === b) { depth--; if (depth < 0) return i; } }
    if (depth > 0) { let d = 0; for (let i = sentences.length - 1; i >= 0; i--) { for (const ch of sentences[i]) { if (ch === a) d++; else if (ch === b) d--; } if (d > 0) return i; } }
  }
  return -1;
}
