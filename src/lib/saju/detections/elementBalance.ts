/**
 * 오행 강약 단일 판단(P3). 겉 글자 + 지장간 가중 + 월령을 합친 점수를 한 번만 계산하고,
 * 브리프·featureHit·올해 기운·타임라인·궁합이 모두 이 결론을 쓴다(c1 "불이 많다" ↔ "수 과다" 충돌 방지).
 * 가중치·임계값과 근거는 docs/manseryeok-policy.md §6.
 */
import { BRANCH_MAIN_ELEMENT, HIDDEN_STEMS, STEM_ELEMENT } from "../constants";
import type { FiveElement } from "../types";
import type { PositionedPillar } from "./types";

export const ELEMENT_ORDER: readonly FiveElement[] = ["WOOD", "FIRE", "EARTH", "METAL", "WATER"];
export const ELEMENT_BALANCE_WEIGHTS = {
  /** 천간 한 글자. */
  stem: 1,
  /** 지지 본기 오행(겉 글자). */
  branchMain: 1,
  /** 월지(계절의 주인)는 겉 글자·지장간 몫을 이 배수로 센다. */
  monthBranchMultiplier: 2,
  /** 가장 강한 기운이 전체의 이 비율 이상이면 "많음". */
  excessShare: 0.3,
  /** 이 비율 미만이면 "부족"(점수 0이면 "없음"). */
  lackShare: 0.1,
} as const;

export type ElementLevel = "많음" | "보통" | "부족" | "없음";
export type ElementParts = { readonly visible: number; readonly hidden: number; readonly monthBonus: number };
export type ElementBalance = {
  readonly scores: Readonly<Record<FiveElement, number>>;
  readonly shares: Readonly<Record<FiveElement, number>>;
  readonly parts: Readonly<Record<FiveElement, ElementParts>>;
  /** 많음은 가장 강한 기운 하나만. 부족·없음은 여럿일 수 있다. */
  readonly status: Readonly<Record<FiveElement, ElementLevel>>;
  readonly strongest: { readonly element: FiveElement; readonly share: number; readonly level: ElementLevel; readonly reason: string };
  readonly weakest: { readonly element: FiveElement; readonly share: number; readonly level: ElementLevel; readonly reason: string };
  readonly monthElement: FiveElement;
};

const KO: Record<FiveElement, string> = { WOOD: "나무", FIRE: "불", EARTH: "흙", METAL: "쇠", WATER: "물" };
/** 극하는 관계: 키가 값을 누른다. */
const CONTROLS: Record<FiveElement, FiveElement> = { WOOD: "EARTH", EARTH: "WATER", WATER: "FIRE", FIRE: "METAL", METAL: "WOOD" };
/** 받침에 따라 조사를 고른다(물이/나무가). */
const j = (w: string, withFinal: string, without: string) => w + (((w.charCodeAt(w.length - 1) - 0xac00) % 28) !== 0 ? withFinal : without);
const round = (v: number) => Math.round(v * 1000) / 1000;
const zero = (): Record<FiveElement, number> => ({ WOOD: 0, FIRE: 0, EARTH: 0, METAL: 0, WATER: 0 });

export function judgeElementBalance(natal: readonly PositionedPillar[]): ElementBalance {
  const W = ELEMENT_BALANCE_WEIGHTS;
  const visible = zero(), hidden = zero(), monthBonus = zero();
  const month = natal.find(e => e.position === "month");
  for (const { position, pillar } of natal) {
    visible[STEM_ELEMENT[pillar.stem]] += W.stem;
    const branch = zero();
    branch[BRANCH_MAIN_ELEMENT[pillar.branch]] += W.branchMain;
    const inner = zero();
    for (const h of HIDDEN_STEMS[pillar.branch]) inner[STEM_ELEMENT[h.stem]] += h.weight;
    for (const e of ELEMENT_ORDER) {
      visible[e] += branch[e]; hidden[e] += inner[e];
      if (position === "month") monthBonus[e] += (branch[e] + inner[e]) * (W.monthBranchMultiplier - 1);
    }
  }
  const scores = Object.fromEntries(ELEMENT_ORDER.map(e => [e, round(visible[e] + hidden[e] + monthBonus[e])])) as Record<FiveElement, number>;
  const total = ELEMENT_ORDER.reduce((s, e) => s + scores[e], 0) || 1;
  const shares = Object.fromEntries(ELEMENT_ORDER.map(e => [e, round(scores[e] / total)])) as Record<FiveElement, number>;
  const ranked = [...ELEMENT_ORDER].sort((a, b) => scores[b] - scores[a] || ELEMENT_ORDER.indexOf(a) - ELEMENT_ORDER.indexOf(b));
  const top = ranked[0], low = ranked[ranked.length - 1];
  const status = Object.fromEntries(ELEMENT_ORDER.map(e => [e,
    scores[e] === 0 ? "없음" : shares[e] < W.lackShare ? "부족" : e === top && shares[e] >= W.excessShare ? "많음" : "보통"])) as Record<FiveElement, ElementLevel>;
  const monthElement = month ? BRANCH_MAIN_ELEMENT[month.pillar.branch] : top;
  const parts = Object.fromEntries(ELEMENT_ORDER.map(e => [e, { visible: round(visible[e]), hidden: round(hidden[e]), monthBonus: round(monthBonus[e]) }])) as Record<FiveElement, ElementParts>;

  const strongReason = (e: FiveElement) => {
    const r: string[] = [];
    if (monthElement === e) r.push(`태어난 달의 주인 기운이 ${j(KO[e], "이라", "라")} 두 배로 세고`);
    if (parts[e].visible >= 1) r.push(`겉으로 드러난 ${KO[e]} 글자가 ${parts[e].visible}개`);
    if (parts[e].hidden >= 0.5) r.push(`땅속에 숨은 글자(지장간)에도 ${j(KO[e], "이", "가")} 있어`);
    return `${r.join(", ")} 다섯 기운 가운데 가장 셉니다.`;
  };
  const weakReason = (e: FiveElement) => {
    const r: string[] = [parts[e].visible === 0 ? `겉으로 드러난 ${KO[e]} 글자가 없고` : `겉으로 드러난 ${KO[e]} 글자가 ${parts[e].visible}개뿐이고`];
    r.push(parts[e].hidden === 0 ? "땅속에도 없어" : "땅속에 조금 숨어 있을 뿐이라");
    if (CONTROLS[monthElement] === e) r.push(`태어난 계절의 ${j(KO[monthElement], "이", "가")} ${j(KO[e], "을", "를")} 누르는 쪽이라`);
    return `${r.join(" ")} 가장 약합니다.`;
  };
  return {
    scores, shares, parts, status, monthElement,
    strongest: { element: top, share: shares[top], level: status[top], reason: strongReason(top) },
    weakest: { element: low, share: shares[low], level: status[low], reason: weakReason(low) },
  };
}
