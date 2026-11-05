/**
 * 십성 묶음(비겁·식상·재성·관성·인성) 세기의 단일 기준(P6d A).
 * 값 = 만세력 오행 칸의 가중값(`elements.weighted`: 원국 겉 글자 + 지장간 가중, 화면 "가중")에서 그 묶음 오행 하나의 값.
 * 단계는 엔진 오행 라벨(analyze.ts createElementLabels, WEIGHTED)과 같은 경계: 3 이상 강, 1.5 미만 약(0 = 없음, 약에 포함), 그 밖 보통.
 * v5 브리프·감지·커리어 판정·궁합·카드 조건이 모두 이 값만 쓴다(예전 `tenGods.distribution` 묶음 합은 일간·지지 본기를 빼서
 * 하람 원국에서 식상 1.9가 1위였다 → 커리어 "관성 보통"·종합 "식상 옅음"과 만세력 칸이 어긋났다).
 * 최종판3 1(라벨 기준): 비겁은 일간 자신을 뺀다(같은 오행 가중값 − 일간 천간 1). 일간은 비견·겁재가 아니다.
 * 장덕민(甲申 일주, 목 가중 3)에서 일간을 넣어 "비겁 강"이 나왔는데 같은 원국 강약은 "매우 신약"(비겁 1)이라 한 문단이 모순됐다.
 * 오행 가중값(만세력 칸) 계산은 그대로다 — 화면 오행 칸은 일간을 포함한 오행 값, 비겁 묶음은 일간을 뺀 값.
 */
import { STEM_ELEMENT } from "./constants";
import type { FiveElement, HeavenlyStem, SajuCalcResult } from "./types";

export type TenGodGroupKey = "PEER" | "OUTPUT" | "WEALTH" | "OFFICER" | "RESOURCE";
export type GroupLevel = "strong" | "medium" | "weak";
export const TEN_GOD_GROUP_KEYS: readonly TenGodGroupKey[] = ["PEER", "OUTPUT", "WEALTH", "OFFICER", "RESOURCE"];
/** 강: 가중값 이 이상. */
export const GROUP_STRONG = 3;
/** 약: 가중값 이 미만(0 포함). */
export const GROUP_WEAK = 1.5;
export const GROUP_LEVEL_KO: Readonly<Record<GroupLevel, string>> = { strong: "강", medium: "보통", weak: "약" };
export const GROUP_NAME_KO: Readonly<Record<TenGodGroupKey, string>> = { PEER: "비겁", OUTPUT: "식상", WEALTH: "재성", OFFICER: "관성", RESOURCE: "인성" };

const GEN: Readonly<Record<FiveElement, FiveElement>> = { WOOD: "FIRE", FIRE: "EARTH", EARTH: "METAL", METAL: "WATER", WATER: "WOOD" };
const CTRL: Readonly<Record<FiveElement, FiveElement>> = { WOOD: "EARTH", EARTH: "WATER", WATER: "FIRE", FIRE: "METAL", METAL: "WOOD" };
const inverse = (m: Readonly<Record<FiveElement, FiveElement>>, e: FiveElement) => (Object.keys(m) as FiveElement[]).find(k => m[k] === e)!;

/** 일간 기준 묶음의 오행: 비겁 = 같은 오행, 식상 = 내가 낳는, 재성 = 내가 누르는, 관성 = 나를 누르는, 인성 = 나를 낳는. */
export function groupElements(dayMaster: HeavenlyStem): Readonly<Record<TenGodGroupKey, FiveElement>> {
  const me = STEM_ELEMENT[dayMaster];
  return { PEER: me, OUTPUT: GEN[me], WEALTH: CTRL[me], OFFICER: inverse(CTRL, me), RESOURCE: inverse(GEN, me) };
}

export const groupLevel = (value: number): GroupLevel => (value >= GROUP_STRONG ? "strong" : value < GROUP_WEAK ? "weak" : "medium");
const round = (v: number) => Math.round(v * 100) / 100;

/** 일간 천간이 같은 오행 가중값에 넣은 몫(겉 천간 1). */
export const DAY_MASTER_SELF_WEIGHT = 1;
/** 묶음별 가중값(만세력 오행 칸 값, 비겁만 일간 자신 1을 뺀 값). */
export function groupValues(saju: Pick<SajuCalcResult, "dayMaster" | "elements">): Readonly<Record<TenGodGroupKey, number>> {
  const el = groupElements(saju.dayMaster);
  return Object.fromEntries(TEN_GOD_GROUP_KEYS.map(g => [g, round(Math.max(0, (saju.elements.weighted[el[g]] ?? 0) - (g === "PEER" ? DAY_MASTER_SELF_WEIGHT : 0)))])) as Record<TenGodGroupKey, number>;
}

export type GroupStrength = { readonly element: FiveElement; readonly value: number; readonly level: GroupLevel };
export function groupStrength(saju: Pick<SajuCalcResult, "dayMaster" | "elements">): Readonly<Record<TenGodGroupKey, GroupStrength>> {
  const el = groupElements(saju.dayMaster), v = groupValues(saju);
  return Object.fromEntries(TEN_GOD_GROUP_KEYS.map(g => [g, { element: el[g], value: v[g], level: groupLevel(v[g]) }])) as Record<TenGodGroupKey, GroupStrength>;
}

/**
 * 최종 A-6: 신약·매우 신약인데 비겁·인성 묶음이 「강」이면(묶음 값은 월령 가중이 없고 강약은 월령 가중이라 잣대가 다르다)
 * 브리프에 두 라벨(「신약」·「비겁 강」)을 따로 주지 않고 한 문장 틀로 준다. 계산은 그대로, 표시 단계만 「있음」.
 * 돌려주는 값: 그 경우의 묶음(비겁·인성 중 강인 것), 아니면 빈 배열.
 */
export const SUPPORT_PRESENT_KO = "있음" as const;
export function supportConflictGroups(strengthLevel: string, gs: Readonly<Record<TenGodGroupKey, GroupStrength>>): TenGodGroupKey[] {
  if (strengthLevel !== "WEAK" && strengthLevel !== "VERY_WEAK") return [];
  return (["PEER", "RESOURCE"] as const).filter(g => gs[g].level === "strong");
}
/** 브리프 표시용 단계: 충돌 묶음은 「있음」, 그 밖은 강·보통·약. */
export function groupLevelKoFor(strengthLevel: string, gs: Readonly<Record<TenGodGroupKey, GroupStrength>>, g: TenGodGroupKey): "강" | "보통" | "약" | typeof SUPPORT_PRESENT_KO {
  return supportConflictGroups(strengthLevel, gs).includes(g) ? SUPPORT_PRESENT_KO : GROUP_LEVEL_KO[gs[g].level] as "강" | "보통" | "약";
}
