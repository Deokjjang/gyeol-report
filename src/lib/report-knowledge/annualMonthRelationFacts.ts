import type {
  AnnualBranchInteractionType, AnnualMonthGanjiInfo, AnnualPillarPosition,
  EarthlyBranch, FiveElement,
} from "./annualFortuneTypes";
import { getAnnualBranchInteractions, getGeneratedElement } from "./annualFortuneYearRules";

export type AnnualMonthRelationFact = {
  readonly id: string;
  readonly source: "month_natal_branch";
  readonly type: AnnualBranchInteractionType;
  readonly monthBranch: EarthlyBranch;
  readonly participants: readonly EarthlyBranch[];
  readonly affectedPillars: readonly AnnualPillarPosition[];
} | {
  readonly id: string;
  readonly source: "month_natal_element";
  readonly type: "missing_element_present" | "heavy_element_present" | "heavy_element_generated";
  readonly element: FiveElement;
  readonly monthElements: readonly FiveElement[];
};

export type AnnualMonthClassification = {
  readonly status: "supportive" | "friction" | "mixed" | "neutral";
  readonly supportFactIds: readonly string[];
  readonly frictionFactIds: readonly string[];
};

const branchPolarity = {
  육합: "supportive", 삼합: "supportive", 반합: "supportive",
  충: "friction", 형: "friction", 파: "friction", 해: "friction",
} as const satisfies Record<AnnualBranchInteractionType, "supportive" | "friction">;

// Interpretation grouping, not a strength score or an overall lucky/unlucky verdict.
// No prose is accepted by this function; wording cannot create a relation.
export function classifyAnnualMonthFacts(facts: readonly AnnualMonthRelationFact[]): AnnualMonthClassification {
  const supportFactIds: string[] = [], frictionFactIds: string[] = [];
  for (const fact of facts) {
    const support = fact.source === "month_natal_branch"
      ? branchPolarity[fact.type] === "supportive"
      : fact.type === "missing_element_present";
    const ids = support ? supportFactIds : frictionFactIds;
    if (!ids.includes(fact.id)) ids.push(fact.id);
  }
  return {
    status: supportFactIds.length ? (frictionFactIds.length ? "mixed" : "supportive") : (frictionFactIds.length ? "friction" : "neutral"),
    supportFactIds, frictionFactIds,
  };
}

export function buildAnnualMonthRelationFacts(input: {
  readonly monthGanji: AnnualMonthGanjiInfo;
  readonly missingElements: readonly FiveElement[];
  readonly heavyElements: readonly FiveElement[];
  readonly natalBranches: readonly EarthlyBranch[];
}): readonly AnnualMonthRelationFact[] {
  const prefix = `month:${input.monthGanji.year}:${input.monthGanji.month}`;
  const facts: AnnualMonthRelationFact[] = [];
  const interactions = getAnnualBranchInteractions({ annualBranch: input.monthGanji.branch, natalBranches: input.natalBranches });
  for (const relation of interactions) {
    const id = `${prefix}:branch:${relation.type}:${relation.branches.join("")}`;
    const existingIndex = facts.findIndex(fact => fact.id === id);
    const existing = facts[existingIndex];
    const positions = [...new Set([
      ...(existing?.source === "month_natal_branch" ? existing.affectedPillars : []),
      ...(relation.affectedPillars ?? []),
    ])];
    const fact: AnnualMonthRelationFact = {
      id, source: "month_natal_branch", type: relation.type,
      monthBranch: input.monthGanji.branch, participants: relation.branches, affectedPillars: positions,
    };
    if (existingIndex < 0) facts.push(fact); else facts[existingIndex] = fact;
  }
  const elements = [...new Set([input.monthGanji.stemElement, input.monthGanji.branchElement])];
  for (const element of [...new Set(input.missingElements)]) {
    if (elements.includes(element)) facts.push({
      id: `${prefix}:element:missing:${element}`, source: "month_natal_element",
      type: "missing_element_present", element, monthElements: [element],
    });
  }
  for (const element of [...new Set(input.heavyElements)]) {
    const direct = elements.includes(element);
    const generators = elements.filter(from => getGeneratedElement(from) === element);
    // The previous engine merged direct and generated pressure on the same element.
    // Preserve that meaning without counting one target twice.
    if (direct || generators.length) facts.push({
      id: `${prefix}:element:heavy:${element}`, source: "month_natal_element",
      type: direct ? "heavy_element_present" : "heavy_element_generated",
      element, monthElements: [...new Set([...(direct ? [element] : []), ...generators])],
    });
  }
  return facts;
}

const elementNames: Record<FiveElement, string> = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
const pillarNames: Record<AnnualPillarPosition, string> = { year: "연지", month: "월지", day: "일지", hour: "시지" };
const branchReadings: Record<AnnualBranchInteractionType, string> = {
  육합: "서로 연결되는 흐름을 약속과 협업의 접점으로 읽습니다",
  삼합: "세 지지가 모이는 흐름을 함께 추진할 일의 접점으로 읽습니다",
  반합: "일부 지지가 연결되는 흐름이며, 완성된 삼합으로 확대하지 않습니다",
  충: "기존 리듬과 다른 요구를 일정과 역할 조정의 관점에서 읽습니다",
  해: "작은 어긋남이 쌓이는 지점을 연락과 약속의 확인 기준으로 읽습니다",
  형: "누적되는 부담을 책임 범위와 반복 업무의 관점에서 읽습니다",
  파: "기존 방식을 다시 맞출 지점을 절차와 역할 재확인의 관점에서 읽습니다",
};

export function explainAnnualMonthFact(fact: AnnualMonthRelationFact): string {
  if (fact.source === "month_natal_branch") {
    const positions = fact.affectedPillars.map(p => pillarNames[p]).join("·");
    return `월지 ${fact.monthBranch}와 원국 ${positions}의 ${fact.participants.join("")} ${fact.type}: ${branchReadings[fact.type]}.`;
  }
  const element = elementNames[fact.element];
  if (fact.type === "missing_element_present") return `월간지의 ${element}이 원국의 부족 요소에 더해집니다.`;
  if (fact.type === "heavy_element_present") return `월간지의 ${element}이 원국에 이미 많은 ${element}을 더합니다.`;
  return `월간지의 ${fact.monthElements.map(e => elementNames[e]).join("·")}이 원국에 이미 많은 ${element}을 생해 더합니다.`;
}

export function summarizeAnnualMonthFacts(facts: readonly AnnualMonthRelationFact[]): string {
  return facts.length ? facts.map(explainAnnualMonthFact).join(" ")
    : "계산된 원국 지지 관계와 부족·과다 오행의 직접 작용은 없습니다. 월간지와 십성은 그대로 읽되, 합충의 도움이나 마찰을 덧붙이지 않습니다.";
}
