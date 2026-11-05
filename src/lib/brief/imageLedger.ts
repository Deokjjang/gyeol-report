/**
 * 이미지 대장(최종판 1-7 ②, 최종판2 1-1): 지금까지 만든 책(실제 작가 원고 책만)의 핵심 이미지 줄과, 본문이 장면 재료를 그대로 옮긴 구절을 일주별로 모은 표.
 *  - 피할 이미지(chart.avoidImages): 같은 일주 이전 책의 이미지 줄 + 같은 고객 다른 상품 책의 이미지 줄(PriorBooks.images). 표지와 1장 첫 이미지가 이 목록을 피한다.
 *  - 같은 일주 구절(phrases): 이전 책 본문이 그 책의 장면 재료(meta.scenes)·이미지 줄과 공백 뺀 12자 이상 같게 쓴 구절. 이번 책에 같은 구절이 나오면 그 문장만 수리한다.
 * 대장은 tools/final/image-ledger.ts가 만든다(호출 0). 운영에서 새로 나온 책은 대장에 자동으로 더해지지 않는다(같은 고객 책은 PriorBooks로 본다).
 */
import ledger from "./data/image-ledger.json";

export type LedgerLine = { readonly line: string; readonly noun: string; readonly source: string; readonly book?: string; readonly at?: string; readonly people?: readonly string[]; readonly product?: string };
export type LedgerPhrase = { readonly run: string; readonly book: string; readonly at: string; readonly people?: readonly string[]; readonly product?: string };
export type ImageLedger = { readonly version: string; readonly built: string; readonly byDayPillar: Readonly<Record<string, readonly LedgerLine[]>>; readonly phrasesByDayPillar?: Readonly<Record<string, readonly LedgerPhrase[]>> };
export const IMAGE_LEDGER = ledger as ImageLedger;
/** 저장본 검사·replay가 그 책 자신(과 그 뒤에 만든 책, 같은 사람·같은 상품을 다시 만든 판)을 대장에서 뺄 때. */
export type LedgerView = { readonly exclude?: string; readonly before?: string; readonly self?: { readonly people: readonly string[]; readonly product: string } };

/** 핵심 명사: 줄 끝 낱말(문장부호·조사 없이). "빗속에서도 꺼지지 않는 캠핑 랜턴" → "랜턴", "카페 불빛" → "불빛". 한 글자면 앞 낱말까지. */
export function imageNoun(line: string): string {
  const words = line.replace(/[.,!?·"“”'‘’⟪⟫]/g, " ").trim().split(/\s+/).filter(Boolean);
  const raw = words.at(-1) ?? "", stripped = raw.replace(/(을|를|은|는|의|에|와|과|도)$/, "");
  // 한 글자 낱말(강·흙·불·손)은 혼자서는 너무 흔하다 → 앞 낱말과 함께("큰 강", "화단 흙"): 그 두 낱말이 이어 나올 때만 피한다.
  const last = stripped.length >= 2 ? stripped : raw;
  return last.length >= 2 ? last : words.slice(-2).join(" ");
}
/** 그림이 아닌 흔한 말(관계·추상·사람 낱말)과 일간 기본 명사(나무·불빛·흙…, 그 사람 일간의 바탕이라 피하지 않는다): 같은 머리 명사로 보지 않는다. */
const NOT_IMAGE = new Set(["사이", "사람", "사업", "길", "이야기", "온도", "마음", "힘", "책", "관계", "두 사람", "하루", "시간", "순간", "방식", "자리", "일", "엔진", "여름", "겨울", "봄", "가을", "대표", "기획자", "사장", "정화", "같은 힘", "해",
  "나무", "큰 나무", "덩굴", "화초", "불빛", "불", "작은 불", "산", "큰 산", "흙", "강철", "보석", "강", "큰 강", "빗물", "물줄기"]);
/** 이미지 줄이 아닌 것(소제목 문장·설명문). */
const NOT_LINE = /(다|요|죠)[.!]?$|이렇게|보이는 순간|^\d+|[?]/;

const keep = (v: LedgerView | undefined) => (x: { book?: string; at?: string; people?: readonly string[]; product?: string }) => (!v?.exclude || x.book !== v.exclude) && (!v?.before || !x.at || x.at < v.before)
  && !(v?.self && x.product === v.self.product && (x.people ?? []).some(p => v.self!.people.includes(p)));
/** 이 일주들(한자 간지)의 피할 이미지 줄(중복 없이). */
/** 최종판3 2g: 표지 모티프 계열(같은 사람 이전 책 표지와 계열이 같으면 피한다 — 장소담 3권 모두 작은 불: 난로·촛불·숯불). */
export const COVER_MOTIFS: Readonly<Record<string, RegExp>> = {
  "작은 불": /촛불|숯불|불씨|난로|등불|랜턴|불빛|모닥불|촛대|화로|성냥|불꽃|횃불|캠프파이어/, "큰 나무": /나무|숲|가지|뿌리|새싹|줄기/, "물": /강물|강(?![가-힣])|빗물|샘|호수|바다|물결|시냇물|이슬/,
  "흙": /흙|화분|들판|언덕|밭|대지|도자기/, "쇠": /칼|쇠|바늘|금속|열쇠|칼날|보석/, "빛": /햇살|햇빛|노을|별빛|달빛|등대/,
};
export const coverMotifs = (line: string): string[] => Object.entries(COVER_MOTIFS).filter(([, re]) => re.test(line)).map(([k]) => k);
export function avoidImagesFor(dayPillars: readonly string[], v?: LedgerView, l: ImageLedger = IMAGE_LEDGER): string[] {
  return [...new Set(dayPillars.flatMap(d => (l.byDayPillar[d] ?? []).filter(keep(v)).map(x => x.line.trim())).filter(x => x.length >= 4 && !NOT_LINE.test(x)))];
}
/** 이 일주들의 이전 책 구절(공백 뺀 12자 이상). */
export function iljuPhrasesFor(dayPillars: readonly string[], v?: LedgerView, l: ImageLedger = IMAGE_LEDGER): string[] {
  return [...new Set(dayPillars.flatMap(d => (l.phrasesByDayPillar?.[d] ?? []).filter(keep(v)).map(x => x.run)))];
}

const squash = (s: string) => s.replace(/[\s"“”'‘’「」『』()（）*]/g, "");
/** 두 글의 공백 뺀 가장 긴 같은 구간 길이. */
export function longestRun(a: string, b: string): number {
  const x = squash(a), y = squash(b);
  if (!x || !y) return 0;
  let best = 0; const row = new Array<number>(y.length + 1).fill(0);
  for (let i = 1; i <= x.length; i++) { let diag = 0; for (let j = 1; j <= y.length; j++) { const up = row[j]; row[j] = x[i - 1] === y[j - 1] ? diag + 1 : 0; if (row[j] > best) best = row[j]; diag = up; } }
  return best;
}
/** 같은 그림인가(최종판2 1-1): 공백 뺀 8자 이상 같은 구간, 또는 같은 머리 명사(흔한 말·일간 기본 명사 제외). */
export function imageOverlap(line: string, prev: string): boolean {
  if (longestRun(line, prev) >= 8) return true;
  const a = imageNoun(line), b = imageNoun(prev);
  return a === b && a.length >= 2 && !NOT_IMAGE.has(a);
}
/** 줄과 겹치는 피할 이미지 줄들. */
export const avoidOverlaps = (line: string, avoid: readonly string[]) => avoid.filter(p => p && imageOverlap(line, p));

/** 이 문장에 든 같은 일주 이전 책 구절(공백 뺀 12자 이상 같은 구간). */
export function iljuPhraseHit(sentence: string, phrases: readonly string[], min = 12): string | null {
  const s = squash(sentence);
  if (s.length < min) return null;
  for (const p of phrases) { if (p.length < min) continue; for (let i = 0; i + min <= p.length; i++) if (s.includes(p.slice(i, i + min))) return p; }
  return null;
}
/** 본문 문장들이 재료 글과 공백 뺀 min자 이상 같게 쓴 구간(대장 만들기). */
export function echoRuns(sentences: readonly string[], sources: readonly string[], min = 12): string[] {
  const grams = new Set<string>();
  for (const t of sources.map(squash)) for (let i = 0; i + min <= t.length; i++) grams.add(t.slice(i, i + min));
  const out = new Set<string>();
  for (const raw of sentences) {
    const s = squash(raw); let start = -1, end = -1;
    for (let i = 0; i + min <= s.length; i++) {
      if (!grams.has(s.slice(i, i + min))) continue;
      if (start >= 0 && i <= end - min + 1) { end = i + min; continue; }
      if (start >= 0) out.add(s.slice(start, end));
      start = i; end = i + min;
    }
    if (start >= 0) out.add(s.slice(start, end));
  }
  return [...out];
}
