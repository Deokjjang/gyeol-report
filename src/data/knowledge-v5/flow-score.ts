/**
 * 흐름 세기(1~5) 평가기. timeline/flow-rule.json 의 가중치를 설명 가능하게 합산한다.
 * 순수 함수. UI에는 "참고" 표기로만 쓴다(길흉이 아니라 '얼마나 많이 움직이는가').
 * 규칙 key ↔ 조건 함수는 아래 PREDICATES 에 고정한다. flow-rule.json 에 모르는 key 가 있으면 무시하고 applied 에 남기지 않는다.
 */
import type { FlowRule } from "./schema";

export type FlowElement = "WOOD" | "FIRE" | "EARTH" | "METAL" | "WATER";
export type FlowTenGod = "比肩" | "劫財" | "食神" | "傷官" | "偏財" | "正財" | "偏官" | "正官" | "偏印" | "正印";
export type FlowPosition = "year" | "month" | "day" | "hour";
export type FlowInput = {
  kind: "year" | "month";
  /** 유입 간지의 오행(지지 본기 기준). */
  incomingElement: FlowElement;
  /** 원국에서 부족·미흡한 오행(ElementLabel *_WEAK|*_MISSING). */
  lackElements: readonly FlowElement[];
  /** 원국에서 과다한 오행(ElementLabel *_STRONG). */
  excessElements: readonly FlowElement[];
  /** 일간 대비 유입 천간의 십성. */
  tenGod: FlowTenGod;
  dayMasterStrength: "WEAK" | "BALANCED" | "STRONG";
  /** 유입 지지가 충하는 원국 자리. */
  clashes: readonly FlowPosition[];
  /** 유입 간지가 합(천간합·육합)하는 원국 자리. */
  haps: readonly FlowPosition[];
  /** 유입 지지로 삼합이 완성되는가. */
  samhapComplete: boolean;
  /** 유입 지지가 원국 공망에 드는가. */
  gongmang: boolean;
};
export type FlowApplied = { key: string; when: string; delta: number };
export type FlowResult = { score: number; raw: number; label: string; applied: FlowApplied[] };

const OFFICER: FlowTenGod[] = ["偏官", "正官"];
const WEALTH: FlowTenGod[] = ["偏財", "正財"];
const PEER: FlowTenGod[] = ["比肩", "劫財"];
const RESOURCE: FlowTenGod[] = ["偏印", "正印"];
const OUTPUT: FlowTenGod[] = ["食神", "傷官"];

export const PREDICATES: Record<string, (i: FlowInput) => boolean> = {
  fillsLack: i => i.lackElements.includes(i.incomingElement),
  feedsExcess: i => i.excessElements.includes(i.incomingElement),
  clashDay: i => i.clashes.includes("day"),
  clashMonth: i => i.clashes.includes("month"),
  clashOther: i => i.clashes.some(p => p === "year" || p === "hour"),
  hapDay: i => i.haps.includes("day"),
  samhap: i => i.samhapComplete,
  officerIn: i => OFFICER.includes(i.tenGod),
  wealthOnWeak: i => WEALTH.includes(i.tenGod) && i.dayMasterStrength === "WEAK",
  peerOnStrong: i => PEER.includes(i.tenGod) && i.dayMasterStrength === "STRONG",
  resourceOnWeak: i => RESOURCE.includes(i.tenGod) && i.dayMasterStrength === "WEAK",
  outputOnStrong: i => OUTPUT.includes(i.tenGod) && i.dayMasterStrength === "STRONG",
  gongmang: i => i.gongmang,
  monthScope: i => i.kind === "month",
};

export function scoreFlow(rule: FlowRule, input: FlowInput): FlowResult {
  const applied: FlowApplied[] = [];
  let raw = rule.base;
  for (const w of rule.weights) {
    const pred = PREDICATES[w.key];
    if (!pred || !pred(input)) continue;
    raw += w.delta; applied.push({ key: w.key, when: w.when, delta: w.delta });
  }
  const [lo, hi] = rule.clamp;
  const score = Math.min(hi, Math.max(lo, Math.round(raw)));
  return { score, raw, label: rule.labels[String(score)] ?? String(score), applied };
}
