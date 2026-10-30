/**
 * 책 안의 모순 막기(P3.7 1-2).
 * - balanceHolds: 강약·균형 단정(신강·신약·중화·고르게·기울지 않·오행 넘침/부족)이 엔진의 단일 판단(일간 강약 1개, 오행 많음·부족 목록)과 맞는 문장만 남긴다.
 *   조건절("일간이 약하면", "물이 없으면")도 같은 판단으로 본다: 이 원국에 해당하지 않는 조건 문장은 작가가 단정으로 옮긴다.
 * - dropOpposites: 같은 행동 차원을 핵심으로 반대로 당기는 trait 둘은, 긴장(MBTI와 반대로 당기는 Fusion)으로 표시된 것 외에는 점수 낮은 쪽을 뺀다.
 */
import type { FiveElement } from "@/lib/saju/types";

export type BalanceCtx = {
  /** 일간 강약(엔진 단일 판단). */
  readonly strength: "WEAK" | "BALANCED" | "STRONG";
  readonly excess: readonly FiveElement[];
  /** 약함·없음 모두. */
  readonly lacking: readonly FiveElement[];
};

const EL: Record<string, FiveElement> = { 나무: "WOOD", 목: "WOOD", 불: "FIRE", 화: "FIRE", 흙: "EARTH", 토: "EARTH", 쇠: "METAL", 금: "METAL", 물: "WATER", 수: "WATER" };
// 한 글자 오행(목·화·토·금·수)은 일상어와 겹쳐 "기운"·"글자"가 붙을 때만 본다.
const ELEMENT = "(?:(?<![가-힣])(나무|불|흙|쇠|물)(?: 기운| 글자)?|(?<![가-힣])(목|화|토|금|수)(?: 기운| 글자))";
const MANY = new RegExp(`${ELEMENT}(?:이|가)? ?(넘치|넘쳐|많|가득|강하|강한|세다|센)`, "g");
const FEW = new RegExp(`${ELEMENT}(?:이|가)? ?(부족|모자라|없|약하|약한|마르|말라)`, "g");
const EL_BALANCED = /(?<![가-힣])(나무|불|흙|쇠|물|목|화|토|금|수)(?: 기운)? ?중화/g;

export function balanceHolds(sentence: string, c: BalanceCtx): boolean {
  if (/신강|(일간|내 힘|타고난 힘)(이|은)? ?(강하|강한|세다|센|넘치)/.test(sentence) && c.strength !== "STRONG") return false;
  if (/신약|(일간|내 힘|타고난 힘)(이|은)? ?(약하|약한|여리)/.test(sentence) && c.strength !== "WEAK") return false;
  const elementBalanced = [...sentence.matchAll(EL_BALANCED)];
  for (const m of elementBalanced) { const e = EL[m[1]]; if (c.excess.includes(e) || c.lacking.includes(e)) return false; }
  if (!elementBalanced.length && /중화/.test(sentence) && c.strength !== "BALANCED") return false;
  if (/균형(이|을)? ?(잘 )?(잡|이룬|이루|맞)|기울지 않|치우치지 않|쏠리지 않|고르게 (갖|퍼|섞|들어|나뉘)/.test(sentence) && !/면 /.test(sentence) && (c.strength !== "BALANCED" || c.excess.length > 0 || c.lacking.length > 0)) return false;
  for (const m of sentence.matchAll(MANY)) if (!c.excess.includes(EL[m[1] ?? m[2]])) return false;
  for (const m of sentence.matchAll(FEW)) if (!c.lacking.includes(EL[m[1] ?? m[2]])) return false;
  return true;
}

/** 문단에서 판단과 어긋나는 문장만 뺀다. 다 빠지면 undefined. */
export function keepBalanced(text: string | undefined, c: BalanceCtx, split: (t: string) => string[]): string | undefined {
  if (!text) return text;
  const kept = split(text).filter(s => balanceHolds(s, c));
  return kept.length ? kept.join(" ") : undefined;
}

/** trait의 핵심 차원 = 절댓값이 가장 큰 두 차원 중 0.7 이상인 것. */
function core(tags: Readonly<Record<string, number>>): [string, number][] {
  return Object.entries(tags).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]) || a[0].localeCompare(b[0])).slice(0, 2).filter(([, v]) => Math.abs(v) >= 0.7);
}

/** 같은 핵심 차원을 반대로 당기는 두 trait 중 뺄 쪽(점수 낮은 쪽, 긴장 표시·핵심 trait는 지킨다). 없으면 null. */
export function oppositeToDrop<T extends { readonly id: string; readonly score: number; readonly tags: Readonly<Record<string, number>>; readonly tension: boolean; readonly keep: boolean }>(items: readonly T[]): T | null {
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    const a = items[i], b = items[j];
    if (a.tension || b.tension) continue;
    const ca = core(a.tags), cb = core(b.tags);
    if (!ca.some(([d, v]) => cb.some(([e, w]) => d === e && Math.sign(v) !== Math.sign(w)))) continue;
    const lose = a.keep ? b : b.keep ? a : a.score < b.score || (a.score === b.score && a.id > b.id) ? a : b;
    if (!lose.keep) return lose;
  }
  return null;
}

/**
 * 같은 차원의 반대 극성(P3.8 1): a의 핵심 차원(상위 둘, 0.6 이상) 중 하나가 b의 핵심 차원과 같은 차원에서 반대 방향이면 true.
 * trait 사이만이 아니라 원국 요약 문장·장면 근거·궁합 공통점도 이 사람의 trait와 견준다(P3.7 r2: "바로 정함" ↔ "오래 잼", 역마살 공통점 ↔ '익숙한 것 지킴').
 */
export function opposes(a: Readonly<Record<string, number>>, b: Readonly<Record<string, number>>, min = 0.6): boolean {
  const top = (t: Readonly<Record<string, number>>) => Object.entries(t).sort((x, y) => Math.abs(y[1]) - Math.abs(x[1]) || x[0].localeCompare(y[0])).slice(0, 2).filter(([, v]) => Math.abs(v) >= min);
  const cb = top(b);
  return top(a).some(([d, v]) => cb.some(([e, w]) => d === e && Math.sign(v) !== Math.sign(w)));
}
