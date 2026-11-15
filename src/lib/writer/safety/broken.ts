/**
 * W6 S0-2 「깨진 문장」(출시 차단, 결정론·호출 0). 발행 본문 문장 하나를 본다(사실 표시 ⟦…⟧는 이미 렌더된 뒤).
 *  - dup_phrase: 같은 문장 안에서 6자 이상(한글·숫자만 센다) 같은 구절이 되풀이(렌더 구절 하나 안의 되풀이는 뺀다 — 「A님의 태어난 날 땅 글자 … B님의 태어난 날 땅 글자」).
 *    W5 1차 종합 「태어난 날 땅 글자(일지)에 태어난 날 땅 글자(일지)의 절」, 1차 궁합 「두 사람 모두에게 있는 현침살처럼 이 기운은 두 사람 모두에게」.
 *  - render_overlap: 렌더 구절과 작가 글의 자리 말 겹침 — 「기사(기사 대운(정재의 10년))」처럼 괄호 앞 말이 괄호 안에서 되풀이, 또는 바로 앞 문장과 같은 렌더 구절(대운 구절 두 문장 연속).
 *  - bracket: 짝 안 맞는 괄호(문단 단위로 세고, 짝이 깨진 문장에 단다) — 남은 표시 ⟦ ⟧는 fact_mark가 먼저 잡는다.
 *  - particle: 조사 겹침(「…(일지)을를」「…현침살의의」) — 괄호·렌더 구절 바로 뒤에서만(낱말 속 「사과와」 같은 오탐을 피함).
 *  - orphan: 앞말 없는 조각 — 소제목 첫 문장이 지시어·접속어·「때문입니다」로만 기댐, 또는 조사로 시작(「에서 보듯 …」 — 빈 표시 흔적).
 */
export type BrokenKind = "dup_phrase" | "render_overlap" | "bracket" | "particle" | "orphan" | "slot";
export type BrokenHit = { readonly kind: BrokenKind; readonly detail: string };

const nk = (s: string) => s.replace(/[⟪⟫]/g, "").replace(/[^가-힣0-9]/g, "");
export const DUP_MIN = 6;

/**
 * 같은 문장 안 되풀이 구절. 시험 책 59권 첫판(글자 그대로 6자)은 133건 대부분이 맞는 대구(「도윤님에게 모자란 …, 하린님에게 모자란 …」「한 사람에게는 …, 한 사람에게는 …」)·날짜라 둘로 좁혔다:
 *  A 렌더 구절이 끼인 되풀이 — 두 자리 가운데 하나라도 표시 구절 안에 있고 둘이 같은 구절 하나 안이 아닐 때(「…(일지)에 태어난 날 땅 글자(일지)의 절」·「…현침살처럼 이 기운은 두 사람 모두에게」), 두 자리 사이 20자 이내.
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
    // A는 가까울 때(사이 20자 이내)만 — 두 관계를 한 문장에 이은 긴 문장의 「장덕민님의 태어난 …」 되풀이(사이 60자)는 겹침이 아니다.
    if (!sameSpan(i, j, k) && (inSpan(i, k) >= 0 || inSpan(j, k) >= 0) && j - (i + k) <= 20) return w;
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

/** 두 문자열(한글·숫자만)의 가장 긴 공통 구간. */
function commonRun(a: string, b: string): number {
  let best = 0;
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) { let k = 0; while (i + k < a.length && j + k < b.length && a[i + k] === b[j + k]) k++; if (k > best) best = k; }
  return best;
}
const GLOSS = /([가-힣]{2,8})\(([^()]{8,60})\)((?:은|는|이|가|을|를|과|와|의|도|에는|에|으로|로)(?![가-힣]))?/g;
export const GLOSS_ECHO_MIN = 8;
/** W6.1 P1: 괄호 풀이 바로 뒤(같은 문장 60자 안)에서 본문이 풀이의 8자 이상(한글·숫자)을 되풀이한 곳 — 「정관(평가와 기준이 또렷한 자리에서 인정받는 힘)이 있어서 평가와 기준이 또렷한 자리에서」(1차 커리어 수리 답 ×3). */
export function glossEchoes(sen: string): { readonly all: string; readonly base: string; readonly particle: string; readonly at: number }[] {
  const out: { all: string; base: string; particle: string; at: number }[] = [];
  for (const m of sen.matchAll(GLOSS)) {
    const g = nk(m[2]); if (g.length < GLOSS_ECHO_MIN) continue;
    const rest = sen.slice(m.index! + m[0].length), end = rest.search(/[.?!]/), after = nk((end < 0 ? rest : rest.slice(0, end)).slice(0, 60));
    if (commonRun(g, after) >= GLOSS_ECHO_MIN) out.push({ all: m[0], base: m[1], particle: m[3] ?? "", at: m.index! });
  }
  return out;
}
const josaFor = (word: string, p: string): string => {
  const code = word.charCodeAt(word.length - 1) - 0xac00, has = code >= 0 && code <= 11171 && code % 28 !== 0, rieul = has && code % 28 === 8;
  const pick: Readonly<Record<string, string>> = { 은: has ? "은" : "는", 는: has ? "은" : "는", 이: has ? "이" : "가", 가: has ? "이" : "가", 을: has ? "을" : "를", 를: has ? "을" : "를", 과: has ? "과" : "와", 와: has ? "과" : "와", 으로: has && !rieul ? "으로" : "로", 로: has && !rieul ? "으로" : "로" };
  return pick[p] ?? p;
};
/** P1 정리(호출 0): 되풀이된 풀이 괄호를 뗀다(조사는 앞 이름 받침에 맞춤). */
export function stripGlossEcho(text: string): { text: string; count: number } {
  let count = 0, out = text;
  for (const sen of out.match(/[^.?!]+[.?!]*/g) ?? []) for (const e of glossEchoes(sen)) { const fixed = e.base + josaFor(e.base, e.particle); const next = sen.replace(e.all, fixed); if (next !== sen) { out = out.replace(sen, next); count++; } }
  return { text: out, count };
}
/** W6.1(1차 커리어 6장): 「만드는 힘(식상) 적은 쪽이라」 — 괄호 이름 뒤 조사 없이 꾸밈말. 정리는 받침에 맞춘 「이·가」를 넣는다. */
const BARE_PAREN = /([가-힣])\(((?:식상|재성|관성|인성|비겁|비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인)|[一-鿿]{1,4})\) (적은|많은|넉넉한|약한|강한|센|큰|작은|여린|부족한|모자란|두터운|얇은) /g;
export function fixBareParenParticle(text: string): { text: string; count: number } {
  let count = 0;
  const out = text.replace(BARE_PAREN, (_a, ch: string, inner: string, adj: string) => { count++; return `${ch}(${inner})${josaFor(ch, "이")} ${adj} `; });
  return { text: out, count };
}
/** P3: 앞 문장과 같은 말을 「반면」으로 이음 — 조사 뗀 낱말 셋이 이어서 같으면(「마음 가는 쪽」). */
const STRIP_P = /(으로서|으로써|에게서|으로|에서|에게|까지|부터|처럼|보다|이라|이나|은|는|이|가|을|를|와|과|도|만|의|에|로)$/;
const GENERIC = new Set(["편", "쪽", "것", "수", "때", "더", "잘", "있어요", "있습니다", "편이에요", "쪽이에요", "해요", "합니다", "돼요", "됩니다", "같은", "하는", "한", "그", "이", "두", "사람"]);
const words3 = (s: string) => { const w = (s.replace(/[⟪⟫]/g, "").match(/[가-힣A-Za-z0-9]+/g) ?? []).map(x => x.replace(STRIP_P, "") || x); const out: string[] = []; for (let i = 0; i + 3 <= w.length; i++) if (w.slice(i, i + 3).some(x => x.length >= 2 && !GENERIC.has(x))) out.push(w.slice(i, i + 3).join(" ")); return out; };
export function contrastSame(sen: string, prev: string): string | null {
  const m = sen.match(/^반면(?:에)?,? /); if (!m || /^반면(?:에)?,? [가-힣]{1,6}님/.test(sen)) return null;
  const pv = new Set(words3(prev)); return words3(sen.slice(m[0].length)).find(x => pv.has(x)) ?? null;
}
const BOTH_WORD = /둘 다|두 사람 모두|두 사람 다|둘 모두|두 분 모두|두 사람은|둘은/;

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
  // W6 S4(2차 궁합): 「진술충은 진술충으로」 — 주어 이름을 바로 서술어로 되풀이.
  { const m = sen.match(/(?<![가-힣])([가-힣]{2,8})(?:은|는|이|가) \1(?:으로|로|이라|라|이에요|예요|입니다)(?![가-힣])/); if (m) return { kind: "render_overlap", detail: `「${m[1]}」을 주어와 서술어로 되풀이` }; }
  // W6 S4(1차 커리어): 「내 방식의 힘(비겁) 내 방식의 힘」 — 괄호 뒤에 같은 이름을 바로 되풀이.
  { const m = sen.match(/([가-힣][가-힣 ]{2,12}[가-힣])\([^()]{1,12}\) \1(?![가-힣])/); if (m) return { kind: "render_overlap", detail: `「${m[1]}(…) ${m[1]}」 이름 되풀이` }; }
  // W6 S4(2차 커리어): 자리 표시를 서술어·동격으로 써서 「일주는 이 자리예요」「겁재, 곧 이 자리는」이 됨.
  if (/(?:기둥|글자)(?:\([^()]*\))?(?:은|는) 이 (?:두 |세 )?자리(?:예요|이에요|입니다)[.!]?$/.test(sen) || /, 곧 이 (?:두 |세 )?자리(?:는|가|은|이) /.test(sen)) return { kind: "slot", detail: "자리 표시를 서술어·동격으로 씀(「이 자리예요」「곧 이 자리는」)" };
  // W6 S4(2차 종합): 「땅 글자 자리에는 태어난 날 기둥(일주)이 놓여」 — 글자 한 칸 자리에 기둥(두 글자)을 넣은 꼴.
  { const m = sen.match(/(?:하늘|땅) 글자 자리(?:에는|에|엔|는)? (태어난 (?:해|달|날|시각) 기둥)/); if (m) return { kind: "slot", detail: `글자 자리에 「${m[1]}」을 넣음` }; }
  // W6 S4(2차 궁합 수리문): 「도윤님은 … 재고 싶어 해요. 반면 도윤님은 …」 — 같은 사람을 「반면」으로 맞세움.
  if (o.prev) { const a = o.prev.replace(/[⟪⟫]/g, "").trim().match(/^([가-힣]{1,6})님(?:은|는) /), b = sen.match(/^반면(?:에)?,? ([가-힣]{1,6})님(?:은|는) /); if (a && b && a[1] === b[1]) return { kind: "slot", detail: `앞 문장과 같은 사람(${a[1]}님)을 「반면」으로 맞세움` }; }
  if (o.prev) {
    const pv = nk(o.prev), cur = nk(sen);
    const p = phrases.filter(x => nk(x).length >= 8).find(x => pv.includes(nk(x)) && cur.includes(nk(x)));
    if (p) return { kind: "render_overlap", detail: `바로 앞 문장과 같은 구절 「${p}」` };
  }
  { const d = dupPhrase(sen, phrases); if (d) return { kind: "dup_phrase", detail: `같은 문장 안 되풀이 「${d}」` }; }
  { const g = glossEchoes(sen)[0]; if (g) return { kind: "dup_phrase", detail: `괄호 풀이를 본문이 되풀이 「${g.all.slice(0, 30)}」` }; }
  // W6.1 P3(1차 궁합 2장 수리 뒤): 「그중 장덕민님이 더 그렇습니다」 — 앞 문장이 두 사람 공통을 말하지 않았는데 비교 꼬리만 남음.
  if (/^그중(?:에서도)? [가-힣]{1,6}님(?:이|은|께서) (?:더|특히|훨씬|조금 더) 그(?:렇|래)/.test(sen) && !BOTH_WORD.test(o.prev ?? "")) return { kind: "slot", detail: "앞 문장에 두 사람 공통 성향이 없는 비교 꼬리(「그중 ○○님이 더 그렇습니다」)" };
  // W6.1 P3(2차 커리어 8장 수리 뒤): 「…마음 가는 쪽을 먼저 보고 빠르게 정하는 직감형이고 …. 반면 … 마음 가는 쪽으로 정하는 방식으로」 — 같은 말을 「반면」으로 맞세움.
  if (o.prev) { const c = contrastSame(sen, o.prev.replace(/[⟪⟫]/g, "")); if (c) return { kind: "slot", detail: `앞 문장과 같은 말(「${c}」)을 「반면」으로 이음` }; }
  if (BARE_PAREN.test(sen)) { BARE_PAREN.lastIndex = 0; return { kind: "particle", detail: "괄호 이름 뒤 조사 없이 꾸밈말(「(식상) 적은」)" }; }
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
