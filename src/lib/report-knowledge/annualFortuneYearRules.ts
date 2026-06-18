import type {
  AnnualBranchInteraction,
  AnnualBranchInteractionType,
  AnnualFortuneYearAccess,
  AnnualGanjiInfo,
  AnnualMonthGanjiInfo,
  AnnualPillarPosition,
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
  TenGod,
  YinYang,
} from "./annualFortuneTypes";

const heavenlyStems = [
  "甲",
  "乙",
  "丙",
  "丁",
  "戊",
  "己",
  "庚",
  "辛",
  "壬",
  "癸",
] as const satisfies readonly HeavenlyStem[];

const earthlyBranches = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
] as const satisfies readonly EarthlyBranch[];

const monthBranches = [
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
  "子",
  "丑",
] as const satisfies readonly EarthlyBranch[];

const elementKo = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
} as const satisfies Record<FiveElement, string>;

const elementKoAnd = {
  wood: "목과",
  fire: "화와",
  earth: "토와",
  metal: "금과",
  water: "수와",
} as const satisfies Record<FiveElement, string>;

const stemElement = {
  甲: "wood",
  乙: "wood",
  丙: "fire",
  丁: "fire",
  戊: "earth",
  己: "earth",
  庚: "metal",
  辛: "metal",
  壬: "water",
  癸: "water",
} as const satisfies Record<HeavenlyStem, FiveElement>;

const branchElement = {
  子: "water",
  丑: "earth",
  寅: "wood",
  卯: "wood",
  辰: "earth",
  巳: "fire",
  午: "fire",
  未: "earth",
  申: "metal",
  酉: "metal",
  戌: "earth",
  亥: "water",
} as const satisfies Record<EarthlyBranch, FiveElement>;

const stemYinYang = {
  甲: "yang",
  乙: "yin",
  丙: "yang",
  丁: "yin",
  戊: "yang",
  己: "yin",
  庚: "yang",
  辛: "yin",
  壬: "yang",
  癸: "yin",
} as const satisfies Record<HeavenlyStem, YinYang>;

const branchYinYang = {
  子: "yang",
  丑: "yin",
  寅: "yang",
  卯: "yin",
  辰: "yang",
  巳: "yin",
  午: "yang",
  未: "yin",
  申: "yang",
  酉: "yin",
  戌: "yang",
  亥: "yin",
} as const satisfies Record<EarthlyBranch, YinYang>;

const generatingElement = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood",
} as const satisfies Record<FiveElement, FiveElement>;

const controllingElement = {
  wood: "earth",
  earth: "water",
  water: "fire",
  fire: "metal",
  metal: "wood",
} as const satisfies Record<FiveElement, FiveElement>;

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

const branchPunishmentPairs = [
  ["寅", "巳"],
  ["巳", "申"],
  ["申", "寅"],
  ["丑", "戌"],
  ["戌", "未"],
  ["未", "丑"],
  ["子", "卯"],
  ["辰", "辰"],
  ["午", "午"],
  ["酉", "酉"],
  ["亥", "亥"],
] as const satisfies readonly (readonly [EarthlyBranch, EarthlyBranch])[];

const branchBreakPairs = [
  ["子", "酉"],
  ["丑", "辰"],
  ["寅", "亥"],
  ["卯", "午"],
  ["巳", "申"],
  ["未", "戌"],
] as const satisfies readonly (readonly [EarthlyBranch, EarthlyBranch])[];

const firstMonthStemByYearStem = {
  甲: "丙",
  己: "丙",
  乙: "戊",
  庚: "戊",
  丙: "庚",
  辛: "庚",
  丁: "壬",
  壬: "壬",
  戊: "甲",
  癸: "甲",
} as const satisfies Record<HeavenlyStem, HeavenlyStem>;

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

const pillarPositions = [
  "year",
  "month",
  "day",
  "hour",
] as const satisfies readonly AnnualPillarPosition[];

function modulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

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

function unique<T>(values: readonly T[]): readonly T[] {
  return [...new Set(values)];
}

function formatElementSummary(input: {
  readonly stemElement: FiveElement;
  readonly branchElement: FiveElement;
}): string {
  if (input.stemElement === input.branchElement) {
    return `${elementKo[input.stemElement]}의 기운이 강하게 들어오는 해`;
  }

  return `${elementKoAnd[input.stemElement]} ${elementKo[input.branchElement]}의 기운이 함께 들어오는 해`;
}

export function getStemElement(stem: HeavenlyStem): FiveElement {
  return stemElement[stem];
}

export function getBranchElement(branch: EarthlyBranch): FiveElement {
  return branchElement[branch];
}

export function getStemYinYang(stem: HeavenlyStem): YinYang {
  return stemYinYang[stem];
}

export function getBranchYinYang(branch: EarthlyBranch): YinYang {
  return branchYinYang[branch];
}

export function getGeneratedElement(element: FiveElement): FiveElement {
  return generatingElement[element];
}

export function getAnnualGanjiInfo(year: number): AnnualGanjiInfo {
  const yearOffsetFrom2024 = year - 2024;
  const stem = heavenlyStems[modulo(yearOffsetFrom2024, heavenlyStems.length)];
  const branch = earthlyBranches[
    modulo(4 + yearOffsetFrom2024, earthlyBranches.length)
  ];
  const annualStemElement = getStemElement(stem);
  const annualBranchElement = getBranchElement(branch);

  return {
    year,
    stem,
    branch,
    ganji: `${stem}${branch}`,
    stemElement: annualStemElement,
    branchElement: annualBranchElement,
    stemYinYang: getStemYinYang(stem),
    branchYinYang: getBranchYinYang(branch),
    displayTitle: `${year}년 ${stem}${branch}`,
    elementSummary: formatElementSummary({
      stemElement: annualStemElement,
      branchElement: annualBranchElement,
    }),
  };
}

export function getAnnualMonthGanjiInfo(params: {
  readonly year: number;
  readonly month: number;
}): AnnualMonthGanjiInfo {
  if (!Number.isInteger(params.month) || params.month < 1 || params.month > 12) {
    throw new Error(`Invalid annual fortune month: ${params.month}`);
  }

  const annualGanji = getAnnualGanjiInfo(params.year);
  const firstMonthStem = firstMonthStemByYearStem[annualGanji.stem];
  const firstMonthStemIndex = heavenlyStems.findIndex(
    (stem) => stem === firstMonthStem,
  );
  const stem = heavenlyStems[
    modulo(firstMonthStemIndex + params.month - 1, heavenlyStems.length)
  ];
  const branch = monthBranches[params.month - 1];

  if (stem === undefined || branch === undefined) {
    throw new Error(`Unsupported annual fortune month: ${params.year}-${params.month}`);
  }

  const stemElementForMonth = getStemElement(stem);
  const branchElementForMonth = getBranchElement(branch);

  return {
    year: params.year,
    month: params.month,
    label: `${params.month}월`,
    ganji: `${stem}${branch}`,
    stem,
    branch,
    stemElement: stemElementForMonth,
    branchElement: branchElementForMonth,
    elementSummary: formatElementSummary({
      stemElement: stemElementForMonth,
      branchElement: branchElementForMonth,
    }).replace(/해$/u, "달"),
    basis: "calendar_month_approximation",
  };
}

export function getAnnualFortuneYearAccess(params: {
  readonly targetYear: number;
  readonly currentDate: Date;
}): AnnualFortuneYearAccess {
  const currentYear = params.currentDate.getFullYear();
  const decemberFirst = new Date(currentYear, 11, 1);

  if (
    params.targetYear >= currentYear - 5 &&
    params.targetYear <= currentYear - 1
  ) {
    return {
      year: params.targetYear,
      mode: "past_review",
      isSelectable: true,
      label: "회고",
    };
  }

  if (params.targetYear === currentYear) {
    return {
      year: params.targetYear,
      mode: "current_year",
      isSelectable: true,
      label: "올해 흐름",
    };
  }

  if (params.targetYear === currentYear + 1) {
    const isOpen = params.currentDate.getTime() >= decemberFirst.getTime();

    return {
      year: params.targetYear,
      mode: isOpen ? "new_year_preview" : "locked_future",
      isSelectable: isOpen,
      label: isOpen ? "신년운세" : "신년운세",
      reason: isOpen
        ? undefined
        : `${params.targetYear}년 신년운세는 ${currentYear}-12-01부터 열립니다.`,
    };
  }

  if (params.targetYear >= currentYear + 2) {
    return {
      year: params.targetYear,
      mode: "locked_future",
      isSelectable: false,
      label: "잠김",
      reason: "아직 열리지 않은 미래 연도입니다.",
    };
  }

  return {
    year: params.targetYear,
    mode: "locked_future",
    isSelectable: false,
    label: "잠김",
    reason: "세운 v1은 최근 5년 회고까지만 지원합니다.",
  };
}

export function getTenGodForStemPair(
  dayStem: HeavenlyStem,
  targetStem: HeavenlyStem,
): TenGod {
  const dayElement = getStemElement(dayStem);
  const targetElement = getStemElement(targetStem);
  const sameYinYang = getStemYinYang(dayStem) === getStemYinYang(targetStem);

  if (dayElement === targetElement) {
    return sameYinYang ? "비견" : "겁재";
  }
  if (generatingElement[dayElement] === targetElement) {
    return sameYinYang ? "식신" : "상관";
  }
  if (controllingElement[dayElement] === targetElement) {
    return sameYinYang ? "편재" : "정재";
  }
  if (controllingElement[targetElement] === dayElement) {
    return sameYinYang ? "편관" : "정관";
  }
  if (generatingElement[targetElement] === dayElement) {
    return sameYinYang ? "편인" : "정인";
  }

  throw new Error(`Unsupported stem pair: ${dayStem}/${targetStem}`);
}

function formatAffectedPillars(
  affectedPillars: readonly AnnualPillarPosition[],
): string {
  const labels = {
    year: "연지",
    month: "월지",
    day: "일지",
    hour: "시지",
  } as const satisfies Record<AnnualPillarPosition, string>;

  return affectedPillars.map((position) => labels[position]).join(", ");
}

function buildPairPlain(input: {
  readonly type: AnnualBranchInteractionType;
  readonly branches: readonly EarthlyBranch[];
  readonly affectedPillars: readonly AnnualPillarPosition[];
}): string {
  const branchText = input.branches.join("");
  const pillarText = formatAffectedPillars(input.affectedPillars);

  if (input.type === "육합") {
    return `${branchText} 육합은 ${pillarText}에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.`;
  }
  if (input.type === "충") {
    return `${branchText} 충은 ${pillarText}의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.`;
  }
  if (input.type === "해") {
    return `${branchText} 해는 ${pillarText}에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.`;
  }
  if (input.type === "형") {
    return `${branchText} 형은 ${pillarText}에서 반복 압박이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.`;
  }
  if (input.type === "파") {
    return `${branchText} 파는 ${pillarText}에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.`;
  }

  return `${branchText} ${input.type}은 ${pillarText}의 흐름을 새롭게 자극합니다.`;
}

function pairInteraction(input: {
  readonly annualBranch: EarthlyBranch;
  readonly natalBranch: EarthlyBranch;
  readonly affectedPillar: AnnualPillarPosition;
}): readonly AnnualBranchInteraction[] {
  const relationTables = [
    { type: "육합", pairs: branchSixHarmonyPairs },
    { type: "충", pairs: branchClashPairs },
    { type: "해", pairs: branchHarmPairs },
    { type: "형", pairs: branchPunishmentPairs },
    { type: "파", pairs: branchBreakPairs },
  ] as const satisfies readonly {
    readonly type: AnnualBranchInteractionType;
    readonly pairs: readonly (readonly [EarthlyBranch, EarthlyBranch])[];
  }[];

  return relationTables.flatMap((table) => {
    const pair = includesPair(
      table.pairs,
      input.annualBranch,
      input.natalBranch,
    );

    if (pair === undefined) {
      return [];
    }

    return [
      {
        type: table.type,
        branches: pair,
        affectedPillars: [input.affectedPillar],
        plain: buildPairPlain({
          type: table.type,
          branches: pair,
          affectedPillars: [input.affectedPillar],
        }),
      },
    ];
  });
}

function trineInteractions(input: {
  readonly annualBranch: EarthlyBranch;
  readonly natalBranches: readonly EarthlyBranch[];
}): readonly AnnualBranchInteraction[] {
  const relations: AnnualBranchInteraction[] = [];

  for (const trine of branchTrines) {
    if (!trine.branches.some((branch) => branch === input.annualBranch)) {
      continue;
    }

    const trineNatalPositions = input.natalBranches
      .map((branch, index) => ({ branch, position: pillarPositions[index] }))
      .filter(
        (
          item,
        ): item is {
          readonly branch: EarthlyBranch;
          readonly position: AnnualPillarPosition;
        } =>
          item.position !== undefined &&
          trine.branches.some((branch) => branch === item.branch),
      );
    const uniqueBranches = unique([
      input.annualBranch,
      ...trineNatalPositions.map((item) => item.branch),
    ]);

    if (uniqueBranches.length === 3) {
      const affectedPillars = unique(
        trineNatalPositions.map((item) => item.position),
      );

      relations.push({
        type: "삼합",
        branches: trine.branches,
        affectedPillars,
        plain: `${trine.label} 삼합 ${elementKo[trine.element]} 흐름은 ${formatAffectedPillars(affectedPillars)}를 통해 그 해의 큰 흐름을 키울 수 있습니다.`,
      });
      continue;
    }

    if (uniqueBranches.length === 2 && trineNatalPositions.length > 0) {
      const affectedPillars = unique(
        trineNatalPositions.map((item) => item.position),
      );
      const branches = uniqueBranches as readonly EarthlyBranch[];

      relations.push({
        type: "반합",
        branches,
        affectedPillars,
        plain: `${branches.join("")} 반합 ${elementKo[trine.element]} 흐름은 ${formatAffectedPillars(affectedPillars)}에서 특정 기운을 부분적으로 키웁니다.`,
      });
    }
  }

  return relations;
}

export function getAnnualBranchInteractions(params: {
  readonly annualBranch: EarthlyBranch;
  readonly natalBranches: readonly EarthlyBranch[];
}): readonly AnnualBranchInteraction[] {
  const pairRelations = params.natalBranches.flatMap((natalBranch, index) => {
    const affectedPillar = pillarPositions[index];

    if (affectedPillar === undefined) {
      return [];
    }

    return pairInteraction({
      annualBranch: params.annualBranch,
      natalBranch,
      affectedPillar,
    });
  });
  const trines = trineInteractions(params);
  const seen = new Set<string>();

  return [...trines, ...pairRelations].filter((relation) => {
    const key = `${relation.type}:${relation.branches.join("")}:${relation.affectedPillars?.join(",") ?? ""}`;

    if (seen.has(key)) {
      return false;
    }
    seen.add(key);

    return true;
  });
}
