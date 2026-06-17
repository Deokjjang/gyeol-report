import { STEM_ELEMENT } from "../saju/constants";
import { getTenGod } from "../saju/tenGods";
import type {
  EarthlyBranch,
  FiveElement as SajuFiveElement,
  HeavenlyStem,
  TenGod,
} from "../saju/types";
import type { FiveElement } from "./sajuKnowledgeTypes";

export type FiveElementRelation =
  | "same"
  | "generates"
  | "generated_by"
  | "controls"
  | "controlled_by"
  | "neutral";

export type DayMasterElementRelation = {
  readonly sourceStem: HeavenlyStem;
  readonly targetStem: HeavenlyStem;
  readonly sourceElement: FiveElement;
  readonly targetElement: FiveElement;
  readonly relation: FiveElementRelation;
  readonly relationLabel: string;
  readonly summary: string;
};

export type CrossTenGodRelation = {
  readonly viewerDayStem: HeavenlyStem;
  readonly targetDayStem: HeavenlyStem;
  readonly tenGod: TenGod;
  readonly tenGodKo: string;
  readonly relationLabel: string;
};

export type CompatibilityBranchPosition = "year" | "month" | "day" | "hour";

export type CompatibilityBranchRef = {
  readonly person: "personA" | "personB";
  readonly personLabel: string;
  readonly position: CompatibilityBranchPosition;
  readonly branch: EarthlyBranch;
};

export type CompatibilityBranchRelationKind =
  | "six_harmony"
  | "three_harmony"
  | "half_harmony"
  | "clash"
  | "harm";

export type CompatibilityBranchRelation = {
  readonly kind: CompatibilityBranchRelationKind;
  readonly labelKo: string;
  readonly relationLabel: string;
  readonly branches: readonly EarthlyBranch[];
  readonly element?: FiveElement;
  readonly refs: readonly CompatibilityBranchRef[];
};

const heavenlyStemByInput = new Map<string, HeavenlyStem>([
  ["甲", "甲"],
  ["갑", "甲"],
  ["乙", "乙"],
  ["을", "乙"],
  ["丙", "丙"],
  ["병", "丙"],
  ["丁", "丁"],
  ["정", "丁"],
  ["戊", "戊"],
  ["무", "戊"],
  ["己", "己"],
  ["기", "己"],
  ["庚", "庚"],
  ["경", "庚"],
  ["辛", "辛"],
  ["신", "辛"],
  ["壬", "壬"],
  ["임", "壬"],
  ["癸", "癸"],
  ["계", "癸"],
]);

const earthlyBranchByInput = new Map<string, EarthlyBranch>([
  ["子", "子"],
  ["자", "子"],
  ["丑", "丑"],
  ["축", "丑"],
  ["寅", "寅"],
  ["인", "寅"],
  ["卯", "卯"],
  ["묘", "卯"],
  ["辰", "辰"],
  ["진", "辰"],
  ["巳", "巳"],
  ["사", "巳"],
  ["午", "午"],
  ["오", "午"],
  ["未", "未"],
  ["미", "未"],
  ["申", "申"],
  ["신", "申"],
  ["酉", "酉"],
  ["유", "酉"],
  ["戌", "戌"],
  ["술", "戌"],
  ["亥", "亥"],
  ["해", "亥"],
]);

const elementBySajuElement = {
  WOOD: "wood",
  FIRE: "fire",
  EARTH: "earth",
  METAL: "metal",
  WATER: "water",
} as const satisfies Record<SajuFiveElement, FiveElement>;

const elementKo = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
} as const satisfies Record<FiveElement, string>;

const stemKo = {
  甲: "갑",
  乙: "을",
  丙: "병",
  丁: "정",
  戊: "무",
  己: "기",
  庚: "경",
  辛: "신",
  壬: "임",
  癸: "계",
} as const satisfies Record<HeavenlyStem, string>;

const tenGodKo = {
  比肩: "비견",
  劫財: "겁재",
  食神: "식신",
  傷官: "상관",
  偏財: "편재",
  正財: "정재",
  偏官: "편관",
  正官: "정관",
  偏印: "편인",
  正印: "정인",
} as const satisfies Record<TenGod, string>;

const generatingPairs = [
  ["wood", "fire"],
  ["fire", "earth"],
  ["earth", "metal"],
  ["metal", "water"],
  ["water", "wood"],
] as const satisfies readonly (readonly [FiveElement, FiveElement])[];

const controllingPairs = [
  ["wood", "earth"],
  ["earth", "water"],
  ["water", "fire"],
  ["fire", "metal"],
  ["metal", "wood"],
] as const satisfies readonly (readonly [FiveElement, FiveElement])[];

const branchSixHarmonyPairs = [
  ["子", "丑"],
  ["寅", "亥"],
  ["卯", "戌"],
  ["辰", "酉"],
  ["巳", "申"],
  ["午", "未"],
] as const satisfies readonly (readonly [EarthlyBranch, EarthlyBranch])[];

const branchClashPairs = [
  ["子", "午"],
  ["丑", "未"],
  ["寅", "申"],
  ["卯", "酉"],
  ["辰", "戌"],
  ["巳", "亥"],
] as const satisfies readonly (readonly [EarthlyBranch, EarthlyBranch])[];

const branchHarmPairs = [
  ["子", "未"],
  ["丑", "午"],
  ["寅", "巳"],
  ["卯", "辰"],
  ["申", "亥"],
  ["酉", "戌"],
] as const satisfies readonly (readonly [EarthlyBranch, EarthlyBranch])[];

const branchTrines = [
  { branches: ["申", "子", "辰"], element: "water", label: "申子辰" },
  { branches: ["亥", "卯", "未"], element: "wood", label: "亥卯未" },
  { branches: ["寅", "午", "戌"], element: "fire", label: "寅午戌" },
  { branches: ["巳", "酉", "丑"], element: "metal", label: "巳酉丑" },
] as const satisfies readonly {
  readonly branches: readonly [EarthlyBranch, EarthlyBranch, EarthlyBranch];
  readonly element: FiveElement;
  readonly label: string;
}[];

function includesPair<T>(
  pairs: readonly (readonly [T, T])[],
  first: T,
  second: T,
): readonly [T, T] | undefined {
  return pairs.find(
    (pair) =>
      (pair[0] === first && pair[1] === second) ||
      (pair[0] === second && pair[1] === first),
  );
}

function normalizeStem(value: string): HeavenlyStem | undefined {
  return heavenlyStemByInput.get(value.trim().slice(0, 1));
}

function normalizeBranch(value: string): EarthlyBranch | undefined {
  return earthlyBranchByInput.get(value.trim().slice(-1));
}

function toElement(stem: HeavenlyStem): FiveElement {
  return elementBySajuElement[STEM_ELEMENT[stem]];
}

function isGenerating(source: FiveElement, target: FiveElement): boolean {
  return includesPair(generatingPairs, source, target)?.[0] === source;
}

function isControlling(source: FiveElement, target: FiveElement): boolean {
  return includesPair(controllingPairs, source, target)?.[0] === source;
}

function getFiveElementRelation(
  source: FiveElement,
  target: FiveElement,
): FiveElementRelation {
  if (source === target) {
    return "same";
  }
  if (isGenerating(source, target)) {
    return "generates";
  }
  if (isGenerating(target, source)) {
    return "generated_by";
  }
  if (isControlling(source, target)) {
    return "controls";
  }
  if (isControlling(target, source)) {
    return "controlled_by";
  }

  return "neutral";
}

function formatStemElement(stem: HeavenlyStem): string {
  return `${stemKo[stem]}${elementKo[toElement(stem)]}`;
}

function formatElementRelationSummary(input: {
  readonly sourceStem: HeavenlyStem;
  readonly targetStem: HeavenlyStem;
  readonly relation: FiveElementRelation;
}): string {
  const source = formatStemElement(input.sourceStem);
  const target = formatStemElement(input.targetStem);

  if (input.relation === "generates") {
    return `${source}이 ${target}를 살리는 구조입니다.`;
  }
  if (input.relation === "generated_by") {
    return `${source}은 ${target}에게 힘을 받는 구조입니다.`;
  }
  if (input.relation === "controls") {
    return `${source}이 ${target}를 조절하는 구조입니다.`;
  }
  if (input.relation === "controlled_by") {
    return `${source}은 ${target}에게 조절을 받는 구조입니다.`;
  }
  if (input.relation === "same") {
    return `${source}와 ${target}가 같은 오행으로 공명하는 구조입니다.`;
  }

  return `${source}와 ${target}는 직접 상생·상극보다 다른 기둥의 보조를 함께 봐야 하는 구조입니다.`;
}

export function getDayMasterElementRelation(
  personAStem: string,
  personBStem: string,
): DayMasterElementRelation | undefined {
  const sourceStem = normalizeStem(personAStem);
  const targetStem = normalizeStem(personBStem);

  if (sourceStem === undefined || targetStem === undefined) {
    return undefined;
  }

  const sourceElement = toElement(sourceStem);
  const targetElement = toElement(targetStem);
  const relation = getFiveElementRelation(sourceElement, targetElement);

  return {
    sourceStem,
    targetStem,
    sourceElement,
    targetElement,
    relation,
    relationLabel: `${formatStemElement(sourceStem)} -> ${formatStemElement(targetStem)}`,
    summary: formatElementRelationSummary({
      sourceStem,
      targetStem,
      relation,
    }),
  };
}

export function getCrossTenGodRelation(input: {
  readonly viewerDayStem: string;
  readonly targetDayStem: string;
}): CrossTenGodRelation | undefined {
  const viewerDayStem = normalizeStem(input.viewerDayStem);
  const targetDayStem = normalizeStem(input.targetDayStem);

  if (viewerDayStem === undefined || targetDayStem === undefined) {
    return undefined;
  }

  const tenGod = getTenGod(viewerDayStem, targetDayStem);
  const tenGodLabel = tenGodKo[tenGod];

  return {
    viewerDayStem,
    targetDayStem,
    tenGod,
    tenGodKo: tenGodLabel,
    relationLabel: `${formatStemElement(viewerDayStem)}이 ${formatStemElement(targetDayStem)}를 보면 ${tenGodLabel}`,
  };
}

function branchPairRelation(
  first: CompatibilityBranchRef,
  second: CompatibilityBranchRef,
): CompatibilityBranchRelation | undefined {
  const sixHarmony = includesPair(branchSixHarmonyPairs, first.branch, second.branch);
  if (sixHarmony !== undefined) {
    return {
      kind: "six_harmony",
      labelKo: "육합",
      relationLabel: `${sixHarmony.join("")} 육합`,
      branches: sixHarmony,
      refs: [first, second],
    };
  }

  const clash = includesPair(branchClashPairs, first.branch, second.branch);
  if (clash !== undefined) {
    return {
      kind: "clash",
      labelKo: "충",
      relationLabel: `${clash.join("")} 충`,
      branches: clash,
      refs: [first, second],
    };
  }

  const harm = includesPair(branchHarmPairs, first.branch, second.branch);
  if (harm !== undefined) {
    return {
      kind: "harm",
      labelKo: "해",
      relationLabel: `${harm.join("")} 해`,
      branches: harm,
      refs: [first, second],
    };
  }

  return undefined;
}

function detectFullTrines(
  refs: readonly CompatibilityBranchRef[],
): readonly CompatibilityBranchRelation[] {
  const relations: CompatibilityBranchRelation[] = [];

  for (const trine of branchTrines) {
    const trineRefs = trine.branches
      .map((branch) => refs.find((ref) => ref.branch === branch))
      .filter((ref): ref is CompatibilityBranchRef => ref !== undefined);
    const personSet = new Set(trineRefs.map((ref) => ref.person));

    if (trineRefs.length === 3 && personSet.size > 1) {
      relations.push({
        kind: "three_harmony",
        labelKo: "삼합",
        relationLabel: `${trine.label} 삼합 ${elementKo[trine.element]} 흐름`,
        branches: trine.branches,
        element: trine.element,
        refs: trineRefs,
      });
    }
  }

  return relations;
}

function detectHalfTrines(
  personARefs: readonly CompatibilityBranchRef[],
  personBRefs: readonly CompatibilityBranchRef[],
): readonly CompatibilityBranchRelation[] {
  const relations: CompatibilityBranchRelation[] = [];

  for (const trine of branchTrines) {
    for (let firstIndex = 0; firstIndex < trine.branches.length; firstIndex += 1) {
      for (
        let secondIndex = firstIndex + 1;
        secondIndex < trine.branches.length;
        secondIndex += 1
      ) {
        const firstBranch = trine.branches[firstIndex];
        const secondBranch = trine.branches[secondIndex];
        const firstRef =
          personARefs.find((ref) => ref.branch === firstBranch) ??
          personBRefs.find((ref) => ref.branch === firstBranch);
        const secondRef =
          personARefs.find((ref) => ref.branch === secondBranch) ??
          personBRefs.find((ref) => ref.branch === secondBranch);

        if (
          firstRef !== undefined &&
          secondRef !== undefined &&
          firstRef.person !== secondRef.person
        ) {
          relations.push({
            kind: "half_harmony",
            labelKo: "반합",
            relationLabel: `${firstBranch}${secondBranch} 반합 ${elementKo[trine.element]} 흐름`,
            branches: [firstBranch, secondBranch],
            element: trine.element,
            refs: [firstRef, secondRef],
          });
        }
      }
    }
  }

  return relations;
}

export function detectCrossBranchRelations(input: {
  readonly personARefs: readonly CompatibilityBranchRef[];
  readonly personBRefs: readonly CompatibilityBranchRef[];
}): readonly CompatibilityBranchRelation[] {
  const pairRelations: CompatibilityBranchRelation[] = [];

  for (const personARef of input.personARefs) {
    for (const personBRef of input.personBRefs) {
      const relation = branchPairRelation(personARef, personBRef);
      if (relation !== undefined) {
        pairRelations.push(relation);
      }
    }
  }

  const fullTrines = detectFullTrines([
    ...input.personARefs,
    ...input.personBRefs,
  ]);
  const halfTrines = detectHalfTrines(input.personARefs, input.personBRefs);
  const seen = new Set<string>();

  return [...fullTrines, ...halfTrines, ...pairRelations].filter((relation) => {
    const key = `${relation.kind}:${relation.relationLabel}:${relation.refs
      .map((ref) => `${ref.person}:${ref.position}:${ref.branch}`)
      .join("|")}`;

    if (seen.has(key)) {
      return false;
    }
    seen.add(key);

    return true;
  });
}

export function createBranchRef(input: {
  readonly person: CompatibilityBranchRef["person"];
  readonly personLabel: string;
  readonly position: CompatibilityBranchPosition;
  readonly pillar: string | undefined;
}): CompatibilityBranchRef | undefined {
  if (input.pillar === undefined) {
    return undefined;
  }

  const branch = normalizeBranch(input.pillar);

  if (branch === undefined) {
    return undefined;
  }

  return {
    person: input.person,
    personLabel: input.personLabel,
    position: input.position,
    branch,
  };
}

export function formatBranchRef(ref: CompatibilityBranchRef): string {
  const positionLabel = {
    year: "연지",
    month: "월지",
    day: "일지",
    hour: "시지",
  } as const satisfies Record<CompatibilityBranchPosition, string>;

  return `${ref.personLabel} ${positionLabel[ref.position]} ${ref.branch}`;
}
