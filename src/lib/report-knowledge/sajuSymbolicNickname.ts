import { requireSajuDayPillarEntry } from "./sajuDayPillarKnowledge";
import type { ComputedSajuFacts } from "./sajuComputedFactsTypes";
import {
  getSajuBranchSymbolEntry,
  type SajuBranchSymbolEntry,
} from "./sajuBranchSymbolKnowledge";
import type { FiveElement } from "./sajuKnowledgeTypes";

export type SajuSymbolicNickname = {
  readonly title: string;
  readonly subtitle: string;
  readonly components: readonly {
    readonly source:
      | "day_pillar"
      | "year_branch"
      | "month_branch"
      | "hour_branch"
      | "element_balance";
    readonly label: string;
    readonly meaning: string;
  }[];
};

const elementLabelKo = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
} as const satisfies Record<FiveElement, string>;

const personSuffixBlockers = [
  "형상",
  "이미지",
  "불씨",
  "나무",
  "수레",
  "창고",
  "등불",
] as const;

export function normalizeSymbolicNicknameTitle(title: string): string {
  return title
    .replace(/\s+/g, " ")
    .replace(/입니다[.]?$/u, "")
    .replace(/같은 형상 사람/u, "같은 형상")
    .replace(/형상 사람/u, "형상")
    .replace(/이미지 사람/u, "이미지")
    .replace(/\s*사람 사람$/u, " 사람")
    .trim();
}

function buildTitleFromSymbolicImage(symbolicImage: string): string {
  const baseTitle = normalizeSymbolicNicknameTitle(symbolicImage);

  if (personSuffixBlockers.some((token) => baseTitle.includes(token))) {
    return baseTitle;
  }

  return normalizeSymbolicNicknameTitle(`${baseTitle} 사람`);
}

function getBranchFromPillar(pillar: string | undefined): string | undefined {
  if (pillar === undefined || pillar.length < 2) {
    return undefined;
  }

  return [...pillar].at(-1);
}

function getBranchSymbolsFromFacts(
  facts: ComputedSajuFacts,
): readonly {
  readonly source: "year_branch" | "month_branch" | "hour_branch";
  readonly entry: SajuBranchSymbolEntry;
}[] {
  return [
    { source: "year_branch" as const, branch: getBranchFromPillar(facts.yearPillar) },
    { source: "month_branch" as const, branch: getBranchFromPillar(facts.monthPillar) },
    { source: "hour_branch" as const, branch: getBranchFromPillar(facts.hourPillar) },
  ].flatMap((item) => {
    const entry = getSajuBranchSymbolEntry(item.branch);

    return entry === undefined ? [] : [{ source: item.source, entry }];
  });
}

function getDominantElement(facts: ComputedSajuFacts): FiveElement | undefined {
  const entries = Object.entries(facts.fiveElementCounts) as Array<
    [FiveElement, number]
  >;
  const [element, count] = entries.sort((left, right) => right[1] - left[1])[0] ?? [];

  return count !== undefined && count >= 4 ? element : undefined;
}

function hasBranch(facts: ComputedSajuFacts, labelOrBranch: string): boolean {
  return [
    getBranchFromPillar(facts.yearPillar),
    getBranchFromPillar(facts.monthPillar),
    getBranchFromPillar(facts.dayPillar),
    getBranchFromPillar(facts.hourPillar),
    ...(facts.earthlyBranches ?? []),
  ].some((branch) => branch === labelOrBranch);
}

function buildDayPillarComponent(facts: ComputedSajuFacts): SajuSymbolicNickname["components"][number] {
  const entry = requireSajuDayPillarEntry(facts.dayPillar);

  return {
    source: "day_pillar",
    label: entry.labelKo,
    meaning: entry.symbolicImage,
  };
}

function buildElementComponent(
  facts: ComputedSajuFacts,
): SajuSymbolicNickname["components"][number] | undefined {
  const dominant = getDominantElement(facts);

  if (dominant !== undefined) {
    return {
      source: "element_balance",
      label: `${elementLabelKo[dominant]} 강세`,
      meaning: `${elementLabelKo[dominant]} 기운이 강하게 잡혀 사주의 기본 리듬을 만드는 편입니다.`,
    };
  }

  const missing = facts.missingElements[0];

  if (missing === undefined) {
    return undefined;
  }

  return {
    source: "element_balance",
    label: `${elementLabelKo[missing]} 보완`,
    meaning: `${elementLabelKo[missing]} 기운은 생활 루틴 안에서 보완할수록 전체 균형이 좋아집니다.`,
  };
}

export function buildSajuSymbolicNickname(
  facts: ComputedSajuFacts,
): SajuSymbolicNickname | undefined {
  const dayPillarEntry = requireSajuDayPillarEntry(facts.dayPillar);
  const dayPillarLabel = String(facts.dayPillar);
  const dayBranch = getBranchFromPillar(facts.dayPillar);
  const dayBranchSymbol = getSajuBranchSymbolEntry(dayBranch);
  const branchSymbols = getBranchSymbolsFromFacts(facts);
  const elementComponent = buildElementComponent(facts);
  const baseComponents = [
    buildDayPillarComponent(facts),
    ...(dayBranchSymbol === undefined
      ? []
      : [
          {
            source: "day_pillar" as const,
            label: `${dayBranchSymbol.labelKo}(${dayBranchSymbol.animalKo})`,
            meaning: dayBranchSymbol.symbolicImage,
          },
        ]),
    ...branchSymbols.slice(0, 2).map((item) => ({
      source: item.source,
      label: `${item.entry.labelKo}(${item.entry.animalKo})`,
      meaning: item.entry.symbolicImage,
    })),
    ...(elementComponent === undefined ? [] : [elementComponent]),
  ].slice(0, 4);

  if (dayPillarLabel === "갑신" || dayPillarLabel === "甲申") {
    return {
      title: "큰 나무가 날카로운 금 위에 선 사람",
      subtitle:
        "방향성은 강하고 판단은 빠르지만, 완충과 회복을 같이 설계해야 오래 갑니다.",
      components: baseComponents,
    };
  }

  if (
    (hasBranch(facts, "亥") || hasBranch(facts, "해")) &&
    (facts.excessiveElements.includes("water") ||
      getDominantElement(facts) === "water")
  ) {
    return {
      title: "깊은 물을 품은 겨울 돼지의 감각",
      subtitle:
        "감정과 직관을 안쪽에 저장하는 힘이 있지만, 밖으로 꺼내는 구조가 필요합니다.",
      components: baseComponents,
    };
  }

  if (
    (hasBranch(facts, "午") || hasBranch(facts, "오")) &&
    (facts.excessiveElements.includes("fire") ||
      getDominantElement(facts) === "fire")
  ) {
    return {
      title: "한낮의 말처럼 앞으로 달리는 사람",
      subtitle:
        "표현과 추진은 강하지만, 속도 조절과 주변 리듬 확인이 중요합니다.",
      components: baseComponents,
    };
  }

  if (dayBranchSymbol === undefined || dayPillarEntry.vividness < 4) {
    return undefined;
  }

  return {
    title: buildTitleFromSymbolicImage(dayPillarEntry.symbolicImage),
    subtitle:
      "사주의 기본 형상을 생활 장면으로 옮겨 보면 강점과 보완점이 더 선명해집니다.",
    components: baseComponents,
  };
}
